"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Download01Icon,
  EyeIcon,
  FileTextIcon,
  PlayIcon,
  SquareIcon,
  Upload01Icon,
  XIcon,
} from "@hugeicons/core-free-icons";;
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const CALLING_PURPOSES = [
  "Lead follow-up",
  "Appointment booking",
  "Customer support",
  "Payment reminder",
  "Feedback survey",
  "Property inquiry",
];

const LANGUAGES = [
  { value: "en-US", label: "English" },
  { value: "hi-IN", label: "Hindi" },
  { value: "hinglish", label: "Hinglish" },
  { value: "es-ES", label: "Spanish" },
  { value: "fr-FR", label: "French" },
  { value: "ar-SA", label: "Arabic" },
];

const VOICES = [
  "Aria (Female · Warm)",
  "Marcus (Male · Deep)",
  "Priya (Female · Friendly)",
  "Arjun (Male · Energetic)",
];

const SAMPLE_CSV =
  "name,phone\nAarav Sharma,+919876543210\nDiya Patel,+918765432109\nRohan Mehta,9876543210\nInvalid Row,abc123\n";

/* ------------------------------ csv helpers ----------------------------- */

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [""];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur[cur.length - 1] += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur[cur.length - 1] += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      cur.push("");
    } else if (c === "\n") {
      rows.push(cur);
      cur = [""];
    } else if (c !== "\r") {
      cur[cur.length - 1] += c;
    }
  }
  if (cur.length > 1 || cur[0] !== "") rows.push(cur);
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

interface ContactRow {
  rowNumber: number;
  name: string;
  phone: string;
  ok: boolean;
  reason?: string;
}

function validatePhone(raw: string): { ok: boolean; reason?: string } {
  const digits = raw.replace(/\D/g, "");
  if (!raw.trim()) return { ok: false, reason: "Missing number" };
  if (digits.length < 7) return { ok: false, reason: `Too short (${digits.length} digits)` };
  if (digits.length > 15) return { ok: false, reason: `Too long (${digits.length} digits)` };
  return { ok: true };
}

function toContactRows(table: string[][]): ContactRow[] {
  if (table.length === 0) return [];
  const looksLikeHeader = table[0].every((c) => c.replace(/\D/g, "").length < 7);
  const header = looksLikeHeader ? table[0] : null;
  const body = looksLikeHeader ? table.slice(1) : table;

  let phoneIdx = 0;
  if (header) {
    const found = header.findIndex((h) => /phone|mobile|number|contact|tel/i.test(h));
    if (found >= 0) phoneIdx = found;
  } else {
    let best = 0;
    let bestScore = -1;
    const width = Math.max(...body.map((r) => r.length));
    for (let c = 0; c < width; c++) {
      const score = body.filter((r) => (r[c] ?? "").replace(/\D/g, "").length >= 7).length;
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    }
    phoneIdx = best;
  }
  const nameIdx = phoneIdx === 0 ? 1 : 0;

  return body.map((cells, i) => {
    const phone = (cells[phoneIdx] ?? "").trim();
    const check = validatePhone(phone);
    return {
      rowNumber: i + (header ? 2 : 1),
      name: (cells[nameIdx] ?? "").trim(),
      phone,
      ok: check.ok,
      reason: check.reason,
    };
  });
}

/* --------------------------------- heading --------------------------------- */

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-[32px] font-medium leading-[1.1] tracking-[-0.02em] text-[#0b0b0e]">{title}</h2>
      <p className="mt-1 text-[15px] leading-[1.6] text-[#5b5c64]">{description}</p>
    </div>
  );
}

/* --------------------------------- props --------------------------------- */

interface CreateAgentStepProps {
  onNext: (draft: Record<string, string | number>) => void;
  onBack?: () => void;
}

/* --------------------------------- component --------------------------------- */

export function CreateAgentStep({ onNext, onBack }: CreateAgentStepProps) {
  const [agentName, setAgentName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [language, setLanguage] = useState("");
  const [voice, setVoice] = useState("");
  const [intro, setIntro] = useState("");
  const [instructions, setInstructions] = useState("");
  const [knowledgeFiles, setKnowledgeFiles] = useState<File[]>([]);
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [contactsFileName, setContactsFileName] = useState("");
  const [consent, setConsent] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const knowledgeInputRef = useRef<HTMLInputElement>(null);
  const contactsInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("demo_agent_draft");
      if (!raw) return;
      const d = JSON.parse(raw) as Record<string, string>;
      if (d.agentName) setAgentName(d.agentName);
      if (d.businessName) setBusinessName(d.businessName);
      if (d.purpose) setPurpose(d.purpose);
      if (d.language) setLanguage(d.language);
      if (d.voice) setVoice(d.voice);
      if (d.intro) setIntro(d.intro);
      if (d.instructions) setInstructions(d.instructions);
    } catch {
      // No usable draft — start blank.
    }
  }, []);

  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {
        // Speech not available — nothing to stop.
      }
    };
  }, []);

  const invalidContacts = contacts.filter((c) => !c.ok);
  const validCount = contacts.length - invalidContacts.length;

  const collectDraft = () => ({
    agentName,
    businessName,
    purpose,
    language,
    voice,
    intro,
    instructions,
    contactTotal: contacts.length,
    validContacts: contacts.filter((c) => c.ok).length,
  });

  const handleSaveDraft = () => {
    try {
      window.localStorage.setItem("demo_agent_draft", JSON.stringify(collectDraft()));
      toast.success("Draft saved. You can continue anytime.");
    } catch {
      toast.error("Could not save the draft in this browser.");
    }
  };

  const handleContinue = () => {
    const missing: string[] = [];
    if (!agentName.trim()) missing.push("Agent name");
    if (!businessName.trim()) missing.push("Business name");
    if (!purpose) missing.push("Calling purpose");
    if (!language) missing.push("Language");
    if (!voice) missing.push("Voice");
    if (contacts.length === 0) missing.push("Contacts spreadsheet");
    if (invalidContacts.length > 0)
      missing.push(`${invalidContacts.length} invalid number${invalidContacts.length > 1 ? "s" : ""} (review contacts)`);
    if (contacts.length > 0 && !consent) missing.push("Consent confirmation");
    if (missing.length > 0) {
      toast.error(`Please complete: ${missing.join(", ")}`);
      return;
    }
    try {
      window.localStorage.setItem("demo_agent_draft", JSON.stringify(collectDraft()));
    } catch {
      // Non-fatal for the demo flow.
    }
    onNext(collectDraft() as unknown as Record<string, string | number>);
  };

  const handleKnowledgeFiles = (files: FileList | null) => {
    if (!files) return;
    setKnowledgeFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const handleContactsFile = async (file: File | undefined) => {
    if (!file) return;
    if (!/\.csv$/i.test(file.name)) {
      toast.error("Please upload a CSV file (Excel support is coming soon).");
      return;
    }
    const text = await file.text();
    const rows = toContactRows(parseCsv(text));
    if (rows.length === 0) {
      toast.error("No contacts found in this file.");
      return;
    }
    setContacts(rows);
    setContactsFileName(file.name);
    setConsent(false);
    const bad = rows.filter((r) => !r.ok).length;
    if (bad > 0) {
      toast.error(`${bad} of ${rows.length} numbers need review.`);
    } else {
      toast.success(`${rows.length} valid contacts imported.`);
    }
  };

  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-contacts.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePreviewVoice = () => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) {
        toast.error("Voice preview isn't supported in this browser.");
        return;
      }
      if (previewing) {
        synth.cancel();
        setPreviewing(false);
        return;
      }
      const text = `Hi! I'm ${agentName.trim() || "your AI assistant"}${businessName.trim() ? ` from ${businessName.trim()}` : ""}. This is how I'll sound on your calls.`;
      const utterance = new SpeechSynthesisUtterance(text);
      const langPrefix = language ? language.split("-")[0] : "en";
      const match = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(langPrefix));
      if (match) utterance.voice = match;
      utterance.onend = () => setPreviewing(false);
      utterance.onerror = () => setPreviewing(false);
      setPreviewing(true);
      synth.cancel();
      synth.speak(utterance);
    } catch {
      toast.error("Voice preview isn't supported in this browser.");
    }
  };

  return (
    <>
      <h1 className="mt-10 text-[32px] font-medium leading-[1.1] tracking-[-0.02em] text-[#0b0b0e] sm:text-[36px]">
        Create your agent
      </h1>
      <p className="mt-3 text-[16px] leading-[1.6] text-[#5b5c64]">
        Tell us about your business, brief your agent, and add contacts.
      </p>

      <Card className="mt-8 overflow-hidden rounded-2xl border-neutral-200/80 shadow-[0_1px_2px_rgba(16,16,20,0.04),0_4px_12px_-8px_rgba(16,16,20,0.06)]">
        <CardContent className="p-0">
          {/* 1 — Agent details */}
          <div className="space-y-5 px-6 py-6 sm:px-7 sm:py-7">
            <SectionHeading
              title="Agent Details"
              description="The basics — what your agent is called and how it speaks."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent name</Label>
                <Input
                  id="agent-name"
                  placeholder="e.g. Aria"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-name">Business name</Label>
                <Input
                  id="business-name"
                  placeholder="e.g. Sunrise Realty"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Calling purpose</Label>
                <Select value={purpose} onValueChange={setPurpose}>
                  <SelectTrigger id="purpose" className="h-11 w-full rounded-xl">
                    <SelectValue placeholder="Select a purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    {CALLING_PURPOSES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="h-11 w-full rounded-xl">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="voice">Voice</Label>
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger id="voice" className="h-11 w-full rounded-xl">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICES.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviewVoice}
                  className="h-11 shrink-0 rounded-xl border-neutral-200 px-4 text-sm font-medium"
                >
                  {previewing ? <HugeiconsIcon icon={SquareIcon} className="size-4" /> : <HugeiconsIcon icon={PlayIcon} className="size-4" />}
                  {previewing ? "Stop preview" : "Preview voice"}
                </Button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-100" />

          {/* 2 — Agent instructions */}
          <div className="space-y-5 px-6 py-6 sm:px-7 sm:py-7">
            <SectionHeading
              title="Agent Instructions"
              description="Teach the agent about your business and how it should behave."
            />
            <div className="space-y-2">
              <Label htmlFor="intro">Business introduction</Label>
              <Textarea
                id="intro"
                placeholder="e.g. Sunrise Realty helps families find homes in Pune. We offer 2–4 BHK apartments near Hinjewadi…"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                rows={3}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Agent instructions</Label>
              <Textarea
                id="instructions"
                placeholder="e.g. Greet the caller warmly, ask about budget and preferred location, then offer a site visit…"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={4}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Upload knowledge files</Label>
              <input
                ref={knowledgeInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.md,.doc,.docx"
                className="hidden"
                onChange={(e) => handleKnowledgeFiles(e.target.files)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => knowledgeInputRef.current?.click()}
                className="h-11 rounded-xl border-neutral-200 px-4 text-sm font-medium"
              >
                <HugeiconsIcon icon={Upload01Icon} className="size-4" />
                Upload files
              </Button>
              <p className="text-xs text-neutral-400">PDF, FAQs, property details</p>
              {knowledgeFiles.length > 0 && (
                <ul className="space-y-2 pt-1">
                  {knowledgeFiles.map((f, i) => (
                    <li
                      key={`${f.name}-${i}`}
                      className="flex items-center gap-2.5 rounded-xl border border-neutral-200/80 bg-neutral-50/60 px-3 py-2.5 text-sm"
                    >
                      <HugeiconsIcon icon={FileTextIcon} className="size-4 shrink-0 text-neutral-500" />
                      <span className="min-w-0 flex-1 truncate font-medium text-neutral-800">{f.name}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${f.name}`}
                        onClick={() => setKnowledgeFiles((prev) => prev.filter((_, j) => j !== i))}
                        className="text-neutral-400 hover:text-neutral-700"
                      >
                        <HugeiconsIcon icon={XIcon} className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-100" />

          {/* 3 — Upload contacts */}
          <div className="space-y-5 px-6 py-6 sm:px-7 sm:py-7">
            <SectionHeading
              title="Upload Contacts"
              description="Add the list of people your agent should call."
            />
            <input
              ref={contactsInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                void handleContactsFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => contactsInputRef.current?.click()}
                className="h-11 rounded-xl border-neutral-200 px-4 text-sm font-medium"
              >
                <HugeiconsIcon icon={Upload01Icon} className="size-4" />
                Upload spreadsheet
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleDownloadSample}
                className="h-11 rounded-xl px-4 text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                <HugeiconsIcon icon={Download01Icon} className="size-4" />
                Download sample CSV
              </Button>
            </div>
            <p className="text-xs text-neutral-400">
              {contactsFileName ? `Loaded: ${contactsFileName}` : "CSV with name and phone columns"}
            </p>

            {contacts.length > 0 && (
              <>
                <dl className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 px-4 py-3 text-center">
                    <dt className="text-xs text-neutral-500">Total contacts</dt>
                    <dd className="mt-1 text-xl font-semibold text-neutral-900">{contacts.length}</dd>
                  </div>
                  <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 px-4 py-3 text-center">
                    <dt className="text-xs text-neutral-500">Valid numbers</dt>
                    <dd className="mt-1 text-xl font-semibold text-neutral-900">{validCount}</dd>
                  </div>
                  <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/60 px-4 py-3 text-center">
                    <dt className="text-xs text-neutral-500">Invalid numbers</dt>
                    <dd
                      className={`mt-1 text-xl font-semibold ${invalidContacts.length > 0 ? "text-red-600" : "text-neutral-900"}`}
                    >
                      {invalidContacts.length}
                    </dd>
                  </div>
                </dl>

                {invalidContacts.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setReviewOpen(true)}
                    className="h-11 rounded-xl border-neutral-200 px-4 text-sm font-medium"
                  >
                    <HugeiconsIcon icon={EyeIcon} className="size-4" />
                    Review contacts ({invalidContacts.length})
                  </Button>
                )}

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200/80 px-4 py-3.5">
                  <Checkbox
                    checked={consent}
                    onCheckedChange={(v) => setConsent(v === true)}
                    className="mt-0.5"
                    aria-label="Consent confirmation"
                  />
                  <span className="text-[13.5px] leading-relaxed text-neutral-600">
                    I confirm I have consent to contact these numbers for the purpose stated above.
                  </span>
                </label>
              </>
            )}
          </div>

          {/* Bottom actions — inside card footer (no Back here) */}
          <div className="border-t border-neutral-100 bg-neutral-50/40 px-6 py-5 sm:px-7">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                className="h-11 rounded-full border-neutral-200 bg-white px-6 text-sm font-medium"
              >
                Save as draft
              </Button>
              <Button
                type="button"
                onClick={handleContinue}
                className="h-11 rounded-full bg-neutral-950 px-6 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Continue to payment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Back — outside card, clean text-only (same as Payment) */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-5 text-sm font-medium text-neutral-500 hover:text-neutral-900"
        >
          Back
        </button>
      )}

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold tracking-[-0.01em] text-[#0b0b0e]">
              Contacts needing review
            </DialogTitle>
            <DialogDescription className="text-[13.5px] text-[#5b5c64]">
              These rows won&apos;t be called until fixed. Re-upload the sheet with corrected numbers.
            </DialogDescription>
          </DialogHeader>
          <ul className="max-h-64 space-y-2 overflow-y-auto">
            {invalidContacts.map((c) => (
              <li
                key={c.rowNumber}
                className="flex items-center gap-3 rounded-xl border border-neutral-200/80 px-3 py-2.5 text-sm"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-[11px] font-semibold text-red-600">
                  {c.rowNumber}
                </span>
                <span className="min-w-0 flex-1 truncate font-medium text-neutral-800">
                  {c.name || c.phone || "(empty row)"}
                </span>
                <span className="shrink-0 text-xs text-neutral-400">{c.reason}</span>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
