"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  AlertCircleIcon,
  CheckIcon,
  Copy01Icon,
  FileTextIcon,
  FilterIcon,
  Folder01Icon,
  FolderAddIcon,
  Loading02Icon,
  Search01Icon,
  Upload01Icon,
  UserGroupIcon,
  UserRoundIcon,
} from "@hugeicons/core-free-icons";

import { getPresignedUploadUrlApiV1S3PresignedUploadUrlPost } from "@/client/sdk.gen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import {
  formatPhone,
  parseContactsCsv,
  parsePastedContacts,
  type ParseResult,
} from "@/lib/csvParser";

export interface ContactGroup {
  id: number;
  name: string;
  description?: string;
  color?: string;
  member_count: number;
}

export interface DirectoryContact {
  id: number;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  city?: string;
  called?: boolean;
  status?: string;
}

export interface CampaignContactSelection {
  sourceType: "group" | "manual" | "csv" | "paste";
  groupIds: number[];
  contactIds: number[];
  validContacts: Array<{
    name: string;
    phone: string;
    email?: string;
    company?: string;
    city?: string;
  }>;
  fileKey?: string;
  fileName?: string;
  saveToDirectory: boolean;
  targetGroupId?: number | null;
  newGroupName?: string;
  newGroupColor?: string;
  totalContactsCount: number;
  summaryLabel: string;
}

interface CampaignContactSelectorProps {
  onChange: (selection: CampaignContactSelection) => void;
  className?: string;
}

const GROUP_PALETTE = [
  "#0F6E6E", // Teal
  "#2563EB", // Blue
  "#7C3AED", // Violet
  "#DB2777", // Pink
  "#D97706", // Amber
  "#059669", // Emerald
  "#DC2626", // Red
  "#4F46E5", // Indigo
];

export function CampaignContactSelector({ onChange, className = "" }: CampaignContactSelectorProps) {
  const { getAccessToken } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"group" | "manual" | "csv" | "paste">("group");

  // Groups State
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<number>>(new Set());
  const [groupSearch, setGroupSearch] = useState("");

  // Create Group Modal
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupColor, setNewGroupColor] = useState(GROUP_PALETTE[0]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // Directory Contacts State
  const [directoryContacts, setDirectoryContacts] = useState<DirectoryContact[]>([]);
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState<Set<number>>(new Set());
  const [directorySearch, setDirectorySearch] = useState("");
  const [directoryGroupFilter, setDirectoryGroupFilter] = useState<string>("all");
  const [directoryStatusFilter, setDirectoryStatusFilter] = useState<"all" | "uncalled" | "called">("all");

  // CSV State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvFileName, setCsvFileName] = useState("");
  const [csvParseResult, setCsvParseResult] = useState<ParseResult | null>(null);
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileKey, setUploadedFileKey] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saveCsvToDirectory, setSaveCsvToDirectory] = useState(true);
  const [csvTargetGroup, setCsvTargetGroup] = useState<string>("none"); // 'none' | groupId | 'new'
  const [csvNewGroupName, setCsvNewGroupName] = useState("");

  // Paste State
  const [pastedText, setPastedText] = useState("");
  const [pasteParseResult, setPasteParseResult] = useState<ParseResult | null>(null);
  const [savePastedToDirectory, setSavePastedToDirectory] = useState(true);
  const [pasteTargetGroup, setPasteTargetGroup] = useState<string>("none");
  const [pasteNewGroupName, setPasteNewGroupName] = useState("");

  // Fetch Contact Groups
  const fetchGroups = useCallback(async () => {
    try {
      setIsLoadingGroups(true);
      const token = await getAccessToken();
      const res = await fetch("/api/v1/contacts/groups", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setGroups(list);
        // Default select first group if none selected
        if (list.length > 0 && selectedGroupIds.size === 0) {
          setSelectedGroupIds(new Set([list[0].id]));
        }
      }
    } catch (err) {
      console.error("Failed to load contact groups:", err);
    } finally {
      setIsLoadingGroups(false);
    }
  }, [getAccessToken, selectedGroupIds.size]);

  // Fetch Directory Contacts
  const fetchDirectory = useCallback(async () => {
    try {
      setIsLoadingDirectory(true);
      const token = await getAccessToken();
      const url = directoryGroupFilter !== "all"
        ? `/api/v1/contacts/?limit=500&group_id=${directoryGroupFilter}`
        : `/api/v1/contacts/?limit=500`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.contacts || [];
        setDirectoryContacts(
          list.map((c: any) => ({
            id: Number(c.id),
            name: c.name || "Customer",
            phone: c.phone || "",
            email: c.email,
            company: c.company,
            city: c.city,
            called: Boolean(c.called),
            status: c.status || "valid",
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load contacts directory:", err);
    } finally {
      setIsLoadingDirectory(false);
    }
  }, [getAccessToken, directoryGroupFilter]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (activeTab === "manual" && directoryContacts.length === 0) {
      fetchDirectory();
    }
  }, [activeTab, directoryContacts.length, fetchDirectory]);

  // Handle Quick Create Group
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    try {
      setIsCreatingGroup(true);
      const token = await getAccessToken();
      const res = await fetch("/api/v1/contacts/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: newGroupName.trim(),
          description: newGroupDesc.trim() || undefined,
          color: newGroupColor,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to create group");
      }

      const created = await res.json();
      toast.success(`Group "${created.name}" created`);
      setCreateGroupModalOpen(false);
      setNewGroupName("");
      setNewGroupDesc("");
      await fetchGroups();
      setSelectedGroupIds((prev) => new Set([...prev, created.id]));
    } catch (err: any) {
      toast.error(err.message || "Failed to create group");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  // Group Selection Toggle
  const toggleGroup = (id: number) => {
    setSelectedGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Directory Selection Toggle
  const toggleContact = (id: number) => {
    setSelectedContactIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filtered Groups
  const filteredGroups = useMemo(() => {
    if (!groupSearch.trim()) return groups;
    const q = groupSearch.toLowerCase();
    return groups.filter(
      (g) => g.name.toLowerCase().includes(q) || (g.description && g.description.toLowerCase().includes(q))
    );
  }, [groups, groupSearch]);

  // Filtered Directory Contacts
  const filteredDirectory = useMemo(() => {
    return directoryContacts
      .filter((c) => {
        if (directoryStatusFilter === "uncalled") return !c.called;
        if (directoryStatusFilter === "called") return c.called;
        return true;
      })
      .filter((c) => {
        if (!directorySearch.trim()) return true;
        const q = directorySearch.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          (c.company && c.company.toLowerCase().includes(q)) ||
          (c.city && c.city.toLowerCase().includes(q))
        );
      });
  }, [directoryContacts, directoryStatusFilter, directorySearch]);

  // Handle CSV file selection and parsing
  const handleCsvFile = async (file: File) => {
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".txt")) {
      toast.error("Please upload a CSV or TXT file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size cannot exceed 10MB");
      return;
    }

    setCsvFile(file);
    setCsvFileName(file.name);
    setUploadedFileKey(null);

    // Read and parse file
    try {
      const text = await file.text();
      const parsed = parseContactsCsv(text);
      setCsvParseResult(parsed);

      if (parsed.validCount === 0) {
        toast.error("No valid phone numbers found in CSV");
      } else {
        toast.success(`Found ${parsed.validCount} valid contacts`);
      }

      // Upload to S3 in background for campaign source_id
      await uploadCsvToS3(file);
    } catch (err: any) {
      toast.error(err.message || "Failed to parse CSV file");
    }
  };

  const uploadCsvToS3 = async (file: File) => {
    try {
      setIsUploadingCsv(true);
      setUploadProgress(10);
      const { data: presignedData, error } = await getPresignedUploadUrlApiV1S3PresignedUploadUrlPost({
        body: {
          file_name: file.name,
          file_size: file.size,
          content_type: "text/csv",
        },
      });

      if (error || !presignedData) {
        throw new Error("Failed to get storage upload URL");
      }

      setUploadProgress(40);
      const uploadRes = await fetch(presignedData.upload_url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": "text/csv" },
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file to cloud storage");
      }

      setUploadProgress(100);
      setUploadedFileKey(presignedData.file_key);
    } catch (err) {
      console.warn("Storage upload notice:", err);
    } finally {
      setIsUploadingCsv(false);
    }
  };

  // Handle Pasted Text change
  const handlePastedChange = (text: string) => {
    setPastedText(text);
    if (!text.trim()) {
      setPasteParseResult(null);
      return;
    }
    const parsed = parsePastedContacts(text);
    setPasteParseResult(parsed);
  };

  // Notify parent component on state changes
  useEffect(() => {
    let result: CampaignContactSelection;

    if (activeTab === "group") {
      const chosenGroups = groups.filter((g) => selectedGroupIds.has(g.id));
      const totalCount = chosenGroups.reduce((acc, g) => acc + (g.member_count || 0), 0);
      const groupNames = chosenGroups.map((g) => g.name);

      result = {
        sourceType: "group",
        groupIds: Array.from(selectedGroupIds),
        contactIds: [],
        validContacts: [],
        saveToDirectory: false,
        totalContactsCount: totalCount,
        summaryLabel:
          chosenGroups.length > 0
            ? `${chosenGroups.length} group(s) selected (${totalCount} contacts)`
            : "No groups selected",
      };
    } else if (activeTab === "manual") {
      result = {
        sourceType: "manual",
        groupIds: [],
        contactIds: Array.from(selectedContactIds),
        validContacts: [],
        saveToDirectory: false,
        totalContactsCount: selectedContactIds.size,
        summaryLabel: `${selectedContactIds.size} individual contact(s) selected`,
      };
    } else if (activeTab === "csv") {
      const valid = csvParseResult?.validContacts || [];
      const targetId = csvTargetGroup !== "none" && csvTargetGroup !== "new" ? Number(csvTargetGroup) : null;

      result = {
        sourceType: "csv",
        groupIds: targetId ? [targetId] : [],
        contactIds: [],
        validContacts: valid,
        fileKey: uploadedFileKey || undefined,
        fileName: csvFileName || undefined,
        saveToDirectory: saveCsvToDirectory,
        targetGroupId: targetId,
        newGroupName: csvTargetGroup === "new" ? csvNewGroupName.trim() : undefined,
        totalContactsCount: valid.length,
        summaryLabel:
          valid.length > 0
            ? `${valid.length} valid contacts from ${csvFileName || "CSV"}`
            : "No valid contacts uploaded",
      };
    } else {
      // Paste Mode
      const valid = pasteParseResult?.validContacts || [];
      const targetId = pasteTargetGroup !== "none" && pasteTargetGroup !== "new" ? Number(pasteTargetGroup) : null;

      result = {
        sourceType: "paste",
        groupIds: targetId ? [targetId] : [],
        contactIds: [],
        validContacts: valid,
        saveToDirectory: savePastedToDirectory,
        targetGroupId: targetId,
        newGroupName: pasteTargetGroup === "new" ? pasteNewGroupName.trim() : undefined,
        totalContactsCount: valid.length,
        summaryLabel: `${valid.length} valid pasted contact(s)`,
      };
    }

    onChange(result);
  }, [
    activeTab,
    selectedGroupIds,
    groups,
    selectedContactIds,
    csvParseResult,
    uploadedFileKey,
    csvFileName,
    saveCsvToDirectory,
    csvTargetGroup,
    csvNewGroupName,
    pasteParseResult,
    savePastedToDirectory,
    pasteTargetGroup,
    pasteNewGroupName,
    onChange,
  ]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-semibold tracking-tight">Audience &amp; Contacts to Call</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose a contact group, pick from directory, upload CSV, or paste numbers directly.
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto p-1 bg-muted/60 border border-border/80">
          <TabsTrigger
            value="group"
            className="flex items-center gap-1.5 py-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <HugeiconsIcon icon={UserGroupIcon} className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Contact Groups</span>
            {selectedGroupIds.size > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] h-4">
                {selectedGroupIds.size}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="manual"
            className="flex items-center gap-1.5 py-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <HugeiconsIcon icon={UserRoundIcon} className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Directory Picker</span>
            {selectedContactIds.size > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] h-4">
                {selectedContactIds.size}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="csv"
            className="flex items-center gap-1.5 py-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <HugeiconsIcon icon={Upload01Icon} className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>Upload CSV</span>
            {csvParseResult && csvParseResult.validCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] h-4">
                {csvParseResult.validCount}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="paste"
            className="flex items-center gap-1.5 py-2 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <HugeiconsIcon icon={Copy01Icon} className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>Quick Paste</span>
            {pasteParseResult && pasteParseResult.validCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] h-4">
                {pasteParseResult.validCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* 1. CONTACT GROUPS TAB */}
        <TabsContent value="group" className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="relative flex-1">
              <HugeiconsIcon
                icon={Search01Icon}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
              />
              <Input
                placeholder="Search contact groups..."
                value={groupSearch}
                onChange={(e) => setGroupSearch(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCreateGroupModalOpen(true)}
                className="h-8 text-xs gap-1.5 shrink-0"
              >
                <HugeiconsIcon icon={FolderAddIcon} className="h-3.5 w-3.5 text-emerald-600" />
                New Group
              </Button>
              <Link
                href="/contacts"
                target="_blank"
                className="text-xs text-primary hover:underline font-semibold shrink-0"
              >
                Manage Groups
              </Link>
            </div>
          </div>

          {isLoadingGroups ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              <HugeiconsIcon icon={Loading02Icon} className="h-5 w-5 animate-spin mx-auto mb-2 text-muted-foreground" />
              Loading contact groups…
            </div>
          ) : groups.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center space-y-2 bg-muted/20">
              <HugeiconsIcon icon={Folder01Icon} className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-xs font-semibold">No contact groups yet</p>
              <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                Create a group to organize leads (e.g. &quot;Real Estate Leads&quot;, &quot;Q4 Follow-ups&quot;), or switch to Upload CSV.
              </p>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => setCreateGroupModalOpen(true)}
                className="text-xs h-8 bg-emerald-600 hover:bg-emerald-500 text-white mt-1"
              >
                <HugeiconsIcon icon={Add01Icon} className="h-3.5 w-3.5 mr-1" />
                Create First Group
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {filteredGroups.map((g) => {
                const isSelected = selectedGroupIds.has(g.id);
                return (
                  <div
                    key={g.id}
                    onClick={() => toggleGroup(g.id)}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "border-emerald-500/80 bg-emerald-500/5 shadow-sm"
                        : "border-border/70 hover:border-border hover:bg-muted/30"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleGroup(g.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: g.color || "#0F6E6E" }}
                        />
                        <span className="font-semibold text-xs truncate text-foreground">{g.name}</span>
                      </div>
                      {g.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {g.description}
                        </p>
                      )}
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-mono font-semibold">
                          {g.member_count || 0} contacts
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedGroupIds.size > 0 && (
            <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground border-t">
              <span className="font-semibold text-foreground">
                {selectedGroupIds.size} group(s) selected •{" "}
                {groups
                  .filter((g) => selectedGroupIds.has(g.id))
                  .reduce((sum, g) => sum + (g.member_count || 0), 0)}{" "}
                total contacts
              </span>
              <button
                type="button"
                onClick={() => setSelectedGroupIds(new Set())}
                className="text-xs text-muted-foreground hover:underline"
              >
                Clear selection
              </button>
            </div>
          )}
        </TabsContent>

        {/* 2. DIRECTORY PICKER TAB */}
        <TabsContent value="manual" className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="relative flex-1">
              <HugeiconsIcon
                icon={Search01Icon}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
              />
              <Input
                placeholder="Search by name, phone, company, or city..."
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              {groups.length > 0 && (
                <Select value={directoryGroupFilter} onValueChange={setDirectoryGroupFilter}>
                  <SelectTrigger className="h-8 text-xs w-[140px]">
                    <SelectValue placeholder="All Groups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    {groups.map((g) => (
                      <SelectItem key={g.id} value={String(g.id)}>
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select
                value={directoryStatusFilter}
                onValueChange={(val: any) => setDirectoryStatusFilter(val)}
              >
                <SelectTrigger className="h-8 text-xs w-[110px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="uncalled">Uncalled</SelectItem>
                  <SelectItem value="called">Called</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs px-0.5">
            <span className="font-semibold text-foreground">
              {selectedContactIds.size} of {filteredDirectory.length} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const all = new Set(filteredDirectory.map((c) => c.id));
                  setSelectedContactIds(all);
                }}
                className="text-primary hover:underline font-semibold"
              >
                Select Filtered ({filteredDirectory.length})
              </button>
              <span className="text-muted-foreground">·</span>
              <button
                type="button"
                onClick={() => setSelectedContactIds(new Set())}
                className="text-muted-foreground hover:underline"
              >
                Clear
              </button>
            </div>
          </div>

          {isLoadingDirectory ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              <HugeiconsIcon icon={Loading02Icon} className="h-5 w-5 animate-spin mx-auto mb-2 text-muted-foreground" />
              Loading directory contacts…
            </div>
          ) : filteredDirectory.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center space-y-2 bg-muted/20">
              <HugeiconsIcon icon={UserRoundIcon} className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-xs font-semibold">No contacts found</p>
              <p className="text-[11px] text-muted-foreground">
                No contacts match your filter, or directory is empty.
              </p>
              <Link href="/contacts" target="_blank">
                <Button variant="outline" size="sm" className="h-8 text-xs mt-1">
                  Add contacts in Directory
                </Button>
              </Link>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto rounded-lg border border-border/80 divide-y divide-border/60">
              {filteredDirectory.map((c) => {
                const isSelected = selectedContactIds.has(c.id);
                return (
                  <label
                    key={c.id}
                    className={`flex items-center justify-between p-2.5 hover:bg-muted/40 cursor-pointer select-none transition-colors ${
                      isSelected ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleContact(c.id)}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-foreground">{c.name}</span>
                          {c.company && (
                            <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              {c.company}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground font-mono font-medium block">
                          {formatPhone(c.phone)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {c.called ? (
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          Called
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded font-medium">
                          New
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* 3. CSV UPLOAD TAB */}
        <TabsContent value="csv" className="space-y-4 pt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCsvFile(file);
            }}
            className="hidden"
          />

          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleCsvFile(file);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-primary bg-primary/5 scale-[0.99]"
                : "border-border/80 hover:border-primary/60 hover:bg-muted/20"
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {isUploadingCsv ? (
                  <HugeiconsIcon icon={Loading02Icon} className="h-5 w-5 animate-spin" />
                ) : (
                  <HugeiconsIcon icon={Upload01Icon} className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {csvFileName ? `Selected: ${csvFileName}` : "Click or drag & drop CSV file"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Must include phone number column. Auto-formats Indian 10-digit (+91) &amp; E.164 formats. Max 10MB.
                </p>
              </div>
            </div>
          </div>

          {/* Parsing Summary Cards */}
          {csvParseResult && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 block">
                    {csvParseResult.validCount}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                    Ready to Dial
                  </span>
                </div>
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5">
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400 block">
                    {csvParseResult.duplicateCount}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                    Duplicates Merged
                  </span>
                </div>
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-2.5">
                  <span className="text-lg font-bold text-destructive block">
                    {csvParseResult.invalidCount}
                  </span>
                  <span className="text-[10px] font-semibold text-destructive">
                    Invalid Numbers
                  </span>
                </div>
              </div>

              {/* Preview Table of First 5 rows */}
              {csvParseResult.rows.length > 0 && (
                <div className="rounded-lg border border-border/80 overflow-hidden">
                  <div className="bg-muted/40 px-3 py-1.5 text-[11px] font-semibold border-b flex items-center justify-between">
                    <span>CSV Contacts Preview (First 5 of {csvParseResult.rows.length})</span>
                    <span className="text-muted-foreground font-normal">Headers: {csvParseResult.headers.join(", ")}</span>
                  </div>
                  <div className="divide-y divide-border/60 text-xs">
                    {csvParseResult.rows.slice(0, 5).map((r, i) => (
                      <div key={i} className="p-2 flex items-center justify-between hover:bg-muted/20">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{r.name}</span>
                          <span className="text-muted-foreground font-mono text-[11px]">
                            {r.phone ? formatPhone(r.phone) : r.rawPhone || "—"}
                          </span>
                        </div>
                        <div>
                          {r.status === "valid" ? (
                            <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white text-[10px] h-4">
                              Valid
                            </Badge>
                          ) : r.status === "duplicate" ? (
                            <Badge variant="outline" className="text-amber-600 border-amber-500/30 text-[10px] h-4">
                              Duplicate
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[10px] h-4">
                              {r.reason || "Invalid"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Import Options: Save to Directory & Assign to Group */}
              <div className="rounded-lg border border-border/70 p-3 space-y-3 bg-card/60">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-semibold">Save Contacts to Organization Directory</Label>
                    <p className="text-[11px] text-muted-foreground">
                      Keeps contacts in your unified phonebook for analytics and re-targeting.
                    </p>
                  </div>
                  <Switch
                    checked={saveCsvToDirectory}
                    onCheckedChange={setSaveCsvToDirectory}
                  />
                </div>

                {saveCsvToDirectory && (
                  <div className="pt-2 border-t space-y-2">
                    <Label className="text-xs font-semibold">Assign to Contact Group</Label>
                    <Select value={csvTargetGroup} onValueChange={setCsvTargetGroup}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Choose group assignment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Group (Directory Only)</SelectItem>
                        {groups.map((g) => (
                          <SelectItem key={g.id} value={String(g.id)}>
                            {g.name} ({g.member_count} contacts)
                          </SelectItem>
                        ))}
                        <SelectItem value="new">+ Create New Group for this upload</SelectItem>
                      </SelectContent>
                    </Select>

                    {csvTargetGroup === "new" && (
                      <Input
                        placeholder="Enter new group name..."
                        value={csvNewGroupName}
                        onChange={(e) => setCsvNewGroupName(e.target.value)}
                        className="h-8 text-xs mt-1"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* 4. QUICK PASTE TAB */}
        <TabsContent value="paste" className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Paste Numbers or Lines</Label>
            <p className="text-[11px] text-muted-foreground">
              Paste phone numbers (one per line, or comma-separated). Examples: <br />
              <span className="font-mono text-foreground/80">9876543210</span> or{" "}
              <span className="font-mono text-foreground/80">Rahul Sharma, 9876543210</span>
            </p>
            <Textarea
              placeholder={`9876543210\n+919876543211\nAnkit Patel, 9876543212`}
              rows={5}
              value={pastedText}
              onChange={(e) => handlePastedChange(e.target.value)}
              className="font-mono text-xs"
            />
          </div>

          {pasteParseResult && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ✓ {pasteParseResult.validCount} valid numbers
                </span>
                {pasteParseResult.duplicateCount > 0 && (
                  <span className="text-amber-600 font-semibold">
                    • {pasteParseResult.duplicateCount} duplicates
                  </span>
                )}
                {pasteParseResult.invalidCount > 0 && (
                  <span className="text-destructive font-semibold">
                    • {pasteParseResult.invalidCount} invalid
                  </span>
                )}
              </div>

              {/* Save & Group settings */}
              <div className="rounded-lg border border-border/70 p-3 space-y-3 bg-card/60">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-semibold">Save Pasted Contacts to Directory</Label>
                    <p className="text-[11px] text-muted-foreground">
                      Adds pasted entries into your organization phonebook.
                    </p>
                  </div>
                  <Switch
                    checked={savePastedToDirectory}
                    onCheckedChange={setSavePastedToDirectory}
                  />
                </div>

                {savePastedToDirectory && (
                  <div className="pt-2 border-t space-y-2">
                    <Label className="text-xs font-semibold">Assign to Contact Group</Label>
                    <Select value={pasteTargetGroup} onValueChange={setPasteTargetGroup}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Choose group assignment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Group (Directory Only)</SelectItem>
                        {groups.map((g) => (
                          <SelectItem key={g.id} value={String(g.id)}>
                            {g.name} ({g.member_count} contacts)
                          </SelectItem>
                        ))}
                        <SelectItem value="new">+ Create New Group for this paste</SelectItem>
                      </SelectContent>
                    </Select>

                    {pasteTargetGroup === "new" && (
                      <Input
                        placeholder="Enter new group name..."
                        value={pasteNewGroupName}
                        onChange={(e) => setPasteNewGroupName(e.target.value)}
                        className="h-8 text-xs mt-1"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Create Group Modal */}
      <Dialog open={createGroupModalOpen} onOpenChange={setCreateGroupModalOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateGroup}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={FolderAddIcon} className="h-5 w-5 text-emerald-600" />
                Create New Contact Group
              </DialogTitle>
              <DialogDescription>
                Group leads for targeted outbound campaigns and automated follow-ups.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-4">
              <div className="space-y-1">
                <Label htmlFor="cg-name" className="text-xs font-semibold">Group Name *</Label>
                <Input
                  id="cg-name"
                  placeholder="e.g. VIP Inbound Leads, Web Demo Signups"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="cg-desc" className="text-xs font-semibold">Description (Optional)</Label>
                <Input
                  id="cg-desc"
                  placeholder="e.g. High priority leads from landing page"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Color Tag</Label>
                <div className="flex items-center gap-2">
                  {GROUP_PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewGroupColor(color)}
                      className={`h-6 w-6 rounded-full transition-transform flex items-center justify-center ${
                        newGroupColor === color ? "scale-110 ring-2 ring-offset-2 ring-primary" : ""
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {newGroupColor === color && (
                        <HugeiconsIcon icon={CheckIcon} className="h-3.5 w-3.5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateGroupModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingGroup}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5"
              >
                {isCreatingGroup ? (
                  <HugeiconsIcon icon={Loading02Icon} className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <HugeiconsIcon icon={Add01Icon} className="h-3.5 w-3.5" />
                )}
                Create Group
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
