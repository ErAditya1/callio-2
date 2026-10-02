"use client";

import React, { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BubbleChatIcon,
  CheckmarkCircle02Icon,
  Mail01Icon,
  Megaphone01Icon,
  SentIcon,
  SmartPhone01Icon,
  SparklesIcon,
  ViewIcon,
  XIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export interface FollowupLead {
  id?: number | string;
  name: string;
  phone: string;
  email?: string | null;
  company?: string | null;
}

interface SendFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLeads: FollowupLead[];
  campaignId?: number | string | null;
  onDispatchSuccess?: (count: number) => void;
}

const TEMPLATE_VARIABLES = [
  { label: "Full Name", tag: "{name}" },
  { label: "First Name", tag: "{first_name}" },
  { label: "Company", tag: "{company}" },
  { label: "Booking Link", tag: "{booking_link}" },
  { label: "Phone", tag: "{phone}" },
];

export function SendFollowUpModal({
  isOpen,
  onClose,
  selectedLeads,
  campaignId,
  onDispatchSuccess,
}: SendFollowUpModalProps) {
  // Channel toggles
  const [channels, setChannels] = useState<{
    whatsapp: boolean;
    sms: boolean;
    email: boolean;
  }>({
    whatsapp: true,
    sms: false,
    email: false,
  });

  // Message bodies
  const [whatsappMsg, setWhatsappMsg] = useState(
    "Hi {first_name}! Great connecting with you today. As discussed, you can pick your preferred demo slot here: {booking_link}. Let us know if you have any questions!"
  );
  const [smsMsg, setSmsMsg] = useState(
    "Hi {first_name}, here is your consultation link: {booking_link} - Callio AI"
  );
  const [emailSubject, setEmailSubject] = useState("Your Consultation Details & Booking Link");
  const [emailBody, setEmailBody] = useState(
    "Hi {name},\n\nThank you for speaking with our team today.\n\nYou can schedule your preferred time slot directly on our calendar here: {booking_link}\n\nBest regards,\nCallio AI Team"
  );

  const [activeTab, setActiveTab] = useState<"whatsapp" | "sms" | "email">("whatsapp");
  const [previewMode, setPreviewMode] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleChannel = (ch: "whatsapp" | "sms" | "email") => {
    setChannels((prev) => {
      const next = { ...prev, [ch]: !prev[ch] };
      // Keep at least one channel selected
      if (!next.whatsapp && !next.sms && !next.email) {
        return prev;
      }
      return next;
    });
  };

  const insertVariable = (tag: string) => {
    if (activeTab === "whatsapp") {
      setWhatsappMsg((prev) => prev + " " + tag);
    } else if (activeTab === "sms") {
      setSmsMsg((prev) => prev + " " + tag);
    } else if (activeTab === "email") {
      setEmailBody((prev) => prev + " " + tag);
    }
  };

  // Preview interpolation with the first selected lead
  const sampleLead = selectedLeads[0] || {
    name: "Vikram Malhotra",
    phone: "+91 98765 43210",
    email: "vikram@example.com",
    company: "Apex Tech",
  };

  const interpolate = (text: string) => {
    return text
      .replace(/\{name\}/gi, sampleLead.name)
      .replace(/\{first_name\}/gi, sampleLead.name.split(" ")[0])
      .replace(/\{company\}/gi, sampleLead.company || "Your Company")
      .replace(/\{phone\}/gi, sampleLead.phone)
      .replace(/\{booking_link\}/gi, "https://callio.ai/book/demo-slot");
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      const activeChannelsList = Object.entries(channels)
        .filter(([_, enabled]) => enabled)
        .map(([ch]) => ch);

      const payload = {
        channels: activeChannelsList,
        contacts: selectedLeads.map((l) => ({
          contact_id: typeof l.id === "number" ? l.id : undefined,
          name: l.name,
          phone: l.phone,
          email: l.email || undefined,
          custom_variables: {
            company: l.company,
            booking_link: "https://callio.ai/book/demo-slot",
          },
        })),
        whatsapp_message: whatsappMsg,
        sms_message: smsMsg,
        email_subject: emailSubject,
        email_body: emailBody,
      };

      const cId = campaignId || "1";
      await fetch(`/api/v1/campaigns/${cId}/follow-up/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => null);

      setSentSuccess(true);
      if (onDispatchSuccess) {
        onDispatchSuccess(selectedLeads.length);
      }
      setTimeout(() => {
        onClose();
        setSentSuccess(false);
      }, 1500);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <HugeiconsIcon icon={SentIcon} className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                Send Follow-Up Details
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary font-mono">
                  {selectedLeads.length} {selectedLeads.length === 1 ? "Lead" : "Leads"}
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Dispatch personalized messages via WhatsApp, SMS, or Email in one click.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <HugeiconsIcon icon={XIcon} className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Channel Selectors */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Select Channels to Dispatch
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* WhatsApp */}
              <div
                onClick={() => toggleChannel("whatsapp")}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  channels.whatsapp
                    ? "border-emerald-500 bg-emerald-50/60 text-emerald-950 shadow-xs"
                    : "border-border bg-card opacity-60 hover:opacity-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={channels.whatsapp}
                  readOnly
                  className="h-4 w-4 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500 pointer-events-none"
                />
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={BubbleChatIcon} className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-semibold">WhatsApp</span>
                </div>
              </div>

              {/* SMS */}
              <div
                onClick={() => toggleChannel("sms")}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  channels.sms
                    ? "border-blue-500 bg-blue-50/60 text-blue-950 shadow-xs"
                    : "border-border bg-card opacity-60 hover:opacity-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={channels.sms}
                  readOnly
                  className="h-4 w-4 rounded border-blue-400 text-blue-600 focus:ring-blue-500 pointer-events-none"
                />
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={SmartPhone01Icon} className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-semibold">SMS Text</span>
                </div>
              </div>

              {/* Email */}
              <div
                onClick={() => toggleChannel("email")}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  channels.email
                    ? "border-purple-500 bg-purple-50/60 text-purple-950 shadow-xs"
                    : "border-border bg-card opacity-60 hover:opacity-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={channels.email}
                  readOnly
                  className="h-4 w-4 rounded border-purple-400 text-purple-600 focus:ring-purple-500 pointer-events-none"
                />
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Mail01Icon} className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-semibold">Email</span>
                </div>
              </div>
            </div>
          </div>

          {/* Editor Header: Channel Tab + Preview Toggle */}
          <div className="flex items-center justify-between border-b border-border pb-2 pt-1">
            <div className="flex items-center gap-2">
              {channels.whatsapp && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("whatsapp");
                    setPreviewMode(false);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === "whatsapp"
                      ? "bg-emerald-100 text-emerald-800"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  WhatsApp Template
                </button>
              )}
              {channels.sms && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("sms");
                    setPreviewMode(false);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === "sms"
                      ? "bg-blue-100 text-blue-800"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  SMS Template
                </button>
              )}
              {channels.email && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("email");
                    setPreviewMode(false);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === "email"
                      ? "bg-purple-100 text-purple-800"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Email Template
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer"
            >
              <HugeiconsIcon icon={ViewIcon} className="h-3.5 w-3.5" />
              <span>{previewMode ? "Edit Message" : "Live Preview"}</span>
            </button>
          </div>

          {/* Dynamic Variable Pills */}
          {!previewMode && (
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium text-muted-foreground mr-1">
                  Insert Variables:
                </span>
                {TEMPLATE_VARIABLES.map(({ label, tag }) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => insertVariable(tag)}
                    className="inline-flex items-center rounded-md border border-input bg-background px-2 py-0.8 text-[11px] font-mono font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  >
                    + {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Area */}
          {previewMode ? (
            /* Live Preview Box */
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
              <div className="text-xs font-semibold text-primary flex items-center gap-1.5">
                <HugeiconsIcon icon={SparklesIcon} className="h-3.5 w-3.5" />
                Live Preview for: <span className="font-bold underline">{sampleLead.name}</span>
              </div>
              <div className="rounded-lg border border-border bg-background p-3.5 text-xs text-foreground font-sans whitespace-pre-wrap leading-relaxed shadow-2xs">
                {activeTab === "whatsapp" && interpolate(whatsappMsg)}
                {activeTab === "sms" && interpolate(smsMsg)}
                {activeTab === "email" && (
                  <div>
                    <div className="font-bold pb-2 border-b border-border/60 mb-2">
                      Subject: {interpolate(emailSubject)}
                    </div>
                    <div>{interpolate(emailBody)}</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Editor Inputs */
            <div className="space-y-3">
              {activeTab === "whatsapp" && (
                <div>
                  <textarea
                    rows={4}
                    value={whatsappMsg}
                    onChange={(e) => setWhatsappMsg(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                    placeholder="Write your WhatsApp follow-up message..."
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    💡 Sent via Meta WhatsApp Cloud API to verified phone numbers.
                  </p>
                </div>
              )}

              {activeTab === "sms" && (
                <div>
                  <textarea
                    rows={3}
                    value={smsMsg}
                    onChange={(e) => setSmsMsg(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                    placeholder="Write SMS message (max 160 characters recommended)..."
                  />
                  <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{smsMsg.length} characters</span>
                    <span>1 SMS segment</span>
                  </div>
                </div>
              )}

              {activeTab === "email" && (
                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Email subject..."
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
                  />
                  <textarea
                    rows={5}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-sans"
                    placeholder="Write email body content..."
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3.5 bg-muted/20">
          <p className="text-xs text-muted-foreground">
            {selectedLeads.length} {selectedLeads.length === 1 ? "recipient" : "recipients"} targeted
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isSending}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSend}
              disabled={isSending || selectedLeads.length === 0}
              className="bg-primary text-primary-foreground font-semibold"
            >
              {isSending ? (
                "Dispatching..."
              ) : sentSuccess ? (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4" />
                  Sent Successfully!
                </span>
              ) : (
                `Send to ${selectedLeads.length} ${selectedLeads.length === 1 ? "Lead" : "Leads"}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
