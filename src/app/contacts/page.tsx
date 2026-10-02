"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  Download01Icon,
  FilterIcon,
  FolderAddIcon,
  Folder01Icon,
  Megaphone01Icon,
  PencilEdit02Icon,
  RefreshIcon,
  Search01Icon,
  Tag01Icon,
  Upload01Icon,
  UserCheck01Icon,
  UserGroupIcon,
  UserRoundIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";

import { useAuth } from "@/lib/auth";
import { SendFollowUpModal } from "@/components/followup/SendFollowUpModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Contact {
  id: string | number;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  city?: string;
  status?: string;
  called?: boolean;
  created_at?: string;
}

interface ContactGroup {
  id: number;
  name: string;
  description: string;
  color: string;
  member_count: number;
  created_at?: string;
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

function normalizeIndianMobile(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91") && /^91[6-9]\d{9}$/.test(digits)) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith("0") && /^0[6-9]\d{9}$/.test(digits)) return `+91${digits.slice(1)}`;
  return null;
}

export default function ContactsPage() {
  const { user, getAccessToken, redirectToLogin, loading } = useAuth();
  const router = useRouter();

  // Data state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<number | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "uncalled" | "called">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);

  // Modals state
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupColor, setNewGroupColor] = useState(GROUP_PALETTE[0]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // Import modal state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importTab, setImportTab] = useState<"csv" | "paste">("csv");
  const [pasteText, setPasteText] = useState("");
  const [importGroupMode, setImportGroupMode] = useState<"none" | "existing" | "new">("none");
  const [importSelectedGroupId, setImportSelectedGroupId] = useState<number | null>(null);
  const [importNewGroupName, setImportNewGroupName] = useState("");
  const [importNewGroupColor, setImportNewGroupColor] = useState(GROUP_PALETTE[0]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bulk Add to Group modal
  const [addToGroupModalOpen, setAddToGroupModalOpen] = useState(false);
  const [bulkTargetGroupId, setBulkTargetGroupId] = useState<number | "new">("new");

  // Direct Add Numbers to Group modal
  const [addNumbersModalOpen, setAddNumbersModalOpen] = useState(false);
  const [addNumbersText, setAddNumbersText] = useState("");
  const [isAddingNumbers, setIsAddingNumbers] = useState(false);
  const [addNumbersTab, setAddNumbersTab] = useState<"paste" | "directory">("paste");
  const [directoryContacts, setDirectoryContacts] = useState<Contact[]>([]);
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(false);
  const [selectedDirIds, setSelectedDirIds] = useState<Set<number>>(new Set());
  const [dirSearch, setDirSearch] = useState("");

  // Single Add Contact Modal
  const [addContactModalOpen, setAddContactModalOpen] = useState(false);
  const [singleName, setSingleName] = useState("");
  const [singlePhone, setSinglePhone] = useState("");
  const [singleEmail, setSingleEmail] = useState("");
  const [singleCompany, setSingleCompany] = useState("");
  const [singleCity, setSingleCity] = useState("");
  const [singleGroupId, setSingleGroupId] = useState<number | "none">("none");
  const [isSavingContact, setIsSavingContact] = useState(false);

  // Edit Group Modal
  const [editGroupModalOpen, setEditGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ContactGroup | null>(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDesc, setEditGroupDesc] = useState("");
  const [editGroupColor, setEditGroupColor] = useState(GROUP_PALETTE[0]);
  const [isSavingGroupEdit, setIsSavingGroupEdit] = useState(false);

  // Delete Group Modal
  const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<ContactGroup | null>(null);
  const [isDeletingGroup, setIsDeletingGroup] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      redirectToLogin();
    }
  }, [loading, user, redirectToLogin]);

  // Load Groups
  const fetchGroups = useCallback(async () => {
    if (!user) return;
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/v1/contacts/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setGroups(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load groups:", err);
    }
  }, [user, getAccessToken]);

  // Load Contacts
  const fetchContacts = useCallback(async (groupId?: number) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      const query = groupId ? `?group_id=${groupId}&limit=300` : "?limit=300";
      const res = await fetch(`/api/v1/contacts/${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.contacts || [];
        setContacts(list);
      }
    } catch (err) {
      console.error("Failed to load contacts:", err);
      toast.error("Failed to load contacts");
    } finally {
      setIsLoading(false);
    }
  }, [user, getAccessToken]);

  useEffect(() => {
    if (user) {
      fetchGroups();
      fetchContacts();
    }
  }, [user, fetchGroups, fetchContacts]);

  // Change active group tab
  const handleSelectGroup = (gId: number | "all") => {
    setActiveGroupId(gId);
    setSelectedIds(new Set());
    if (gId === "all") {
      fetchContacts();
    } else {
      fetchContacts(gId);
    }
  };

  // Filter contacts client-side for search and called status
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      if (filterMode === "uncalled" && c.called) return false;
      if (filterMode === "called" && !c.called) return false;
      if (!searchQ.trim()) return true;
      const q = searchQ.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.city && c.city.toLowerCase().includes(q)) ||
        (c.company && c.company.toLowerCase().includes(q))
      );
    });
  }, [contacts, filterMode, searchQ]);

  // Handle Create Group Submit
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setIsCreatingGroup(true);
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/v1/contacts/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newGroupName.trim(),
          description: newGroupDesc.trim(),
          color: newGroupColor,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        toast.success(`Group "${created.name}" created`);
        setNewGroupName("");
        setNewGroupDesc("");
        setCreateGroupModalOpen(false);
        fetchGroups();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.detail || "Failed to create group");
      }
    } catch (err: any) {
      toast.error(err?.message || "Network error");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  // Handle Quick Paste or CSV Bulk Import
  const handleBulkSubmit = async (contactList: Array<{ name: string; phone: string; email?: string; company?: string; city?: string }>) => {
    if (contactList.length === 0) return;
    setIsImporting(true);
    try {
      const token = await getAccessToken();
      const payload: any = {
        contacts: contactList,
      };
      if (importGroupMode === "existing" && importSelectedGroupId) {
        payload.group_id = importSelectedGroupId;
      } else if (importGroupMode === "new" && importNewGroupName.trim()) {
        payload.new_group_name = importNewGroupName.trim();
        payload.new_group_color = importNewGroupColor;
      }

      const res = await fetch("/api/v1/contacts/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Imported ${data.count || contactList.length} contacts successfully`);
        setImportModalOpen(false);
        setPasteText("");
        setImportNewGroupName("");
        fetchGroups();
        fetchContacts(activeGroupId === "all" ? undefined : activeGroupId);
      } else {
        toast.error("Failed to import contacts");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsImporting(false);
    }
  };

  // Process Quick Paste
  const handleProcessPaste = () => {
    if (!pasteText.trim()) return;
    const lines = pasteText.split(/[\r\n]+/).map((l) => l.trim()).filter(Boolean);
    const parsed: Array<{ name: string; phone: string }> = [];

    for (const line of lines) {
      const parts = line.split(/[,\t]+/).map((p) => p.trim());
      let phoneCandidate = "";
      let nameCandidate = "";

      if (parts.length >= 2 && parts[0] && parts[1]) {
        const p0 = parts[0];
        const p1 = parts[1];
        if (/^[\d+()\-\s]{5,20}$/.test(p0)) {
          phoneCandidate = p0;
          nameCandidate = p1;
        } else {
          nameCandidate = p0;
          phoneCandidate = p1;
        }
      } else {
        phoneCandidate = line;
        nameCandidate = "Customer";
      }

      const norm = normalizeIndianMobile(phoneCandidate) || phoneCandidate.replace(/[^\d+]/g, "");
      if (norm) {
        parsed.push({ name: nameCandidate || "Customer", phone: norm });
      }
    }

    if (parsed.length === 0) {
      toast.error("No valid phone numbers found in input");
      return;
    }

    handleBulkSubmit(parsed);
  };

  // Process CSV File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split(/[\r\n]+/).map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        toast.error("CSV file is empty or missing headers");
        return;
      }

      const header = lines[0]?.toLowerCase().split(",").map((h) => h.trim().replace(/['"]/g, "")) || [];
      const phoneIdx = header.findIndex((h) => h.includes("phone") || h.includes("mobile") || h.includes("number"));
      const nameIdx = header.findIndex((h) => h.includes("name") || h.includes("customer"));
      const emailIdx = header.findIndex((h) => h.includes("email") || h.includes("mail"));
      const cityIdx = header.findIndex((h) => h.includes("city") || h.includes("location"));
      const companyIdx = header.findIndex((h) => h.includes("company") || h.includes("org"));

      if (phoneIdx === -1) {
        toast.error("CSV must contain a 'phone' or 'mobile' column header");
        return;
      }

      const parsed: Array<{ name: string; phone: string; email?: string; company?: string; city?: string }> = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i]?.split(",").map((c) => c.trim().replace(/^["']|["']$/g, "")) || [];
        const rawPhone = row[phoneIdx] || "";
        const norm = normalizeIndianMobile(rawPhone) || rawPhone.replace(/[^\d+]/g, "");
        if (norm) {
          parsed.push({
            name: (nameIdx !== -1 ? row[nameIdx] : "") || "Customer",
            phone: norm,
            email: emailIdx !== -1 ? row[emailIdx] : undefined,
            city: cityIdx !== -1 ? row[cityIdx] : undefined,
            company: companyIdx !== -1 ? row[companyIdx] : undefined,
          });
        }
      }

      if (parsed.length === 0) {
        toast.error("No valid contacts found in CSV");
        return;
      }

      handleBulkSubmit(parsed);
    } catch {
      toast.error("Failed to parse CSV file");
    }
  };

  // Add selected contacts to group
  const handleAssignSelectedToGroup = async () => {
    if (selectedIds.size === 0) return;
    try {
      const token = await getAccessToken();
      const ids = Array.from(selectedIds);

      if (bulkTargetGroupId === "new") {
        if (!newGroupName.trim()) {
          toast.error("Please enter a group name");
          return;
        }
        // Create group first
        const gRes = await fetch("/api/v1/contacts/groups", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: newGroupName.trim(), color: newGroupColor }),
        });
        if (gRes.ok) {
          const newG = await gRes.json();
          // Assign contacts
          await fetch(`/api/v1/contacts/groups/${newG.id}/contacts`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ contact_ids: ids }),
          });
          toast.success(`Assigned ${ids.length} contacts to "${newG.name}"`);
        }
      } else {
        await fetch(`/api/v1/contacts/groups/${bulkTargetGroupId}/contacts`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ contact_ids: ids }),
        });
        toast.success(`Assigned ${ids.length} contacts to group`);
      }

      setAddToGroupModalOpen(false);
      setSelectedIds(new Set());
      fetchGroups();
      fetchContacts(activeGroupId === "all" ? undefined : activeGroupId);
    } catch {
      toast.error("Failed to assign contacts");
    }
  };

  // Fetch general directory contacts for group picker
  const fetchDirectoryForPicker = useCallback(async () => {
    setIsLoadingDirectory(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/contacts/?limit=300`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.contacts || [];
        setDirectoryContacts(list);
      }
    } catch {
      setDirectoryContacts([]);
    } finally {
      setIsLoadingDirectory(false);
    }
  }, [getAccessToken]);

  // Direct Add Numbers to Group with zero-duplication
  const handleDirectAddNumbersToGroup = async () => {
    if (activeGroupId === "all") return;
    setIsAddingNumbers(true);
    try {
      const token = await getAccessToken();
      const payload: { text?: string; contact_ids?: number[] } = {};

      if (addNumbersTab === "paste") {
        if (!addNumbersText.trim()) {
          toast.error("Please enter at least one phone number");
          setIsAddingNumbers(false);
          return;
        }
        payload.text = addNumbersText;
      } else {
        if (selectedDirIds.size === 0) {
          toast.error("Please select at least one contact from directory");
          setIsAddingNumbers(false);
          return;
        }
        payload.contact_ids = Array.from(selectedDirIds);
      }

      const res = await fetch(`/api/v1/contacts/groups/${activeGroupId}/add-numbers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        const parts: string[] = [];
        if (data.added > 0) parts.push(`${data.added} numbers added to "${data.group_name}"`);
        if (data.existing_directory_linked > 0) parts.push(`${data.existing_directory_linked} linked from existing directory without duplicates`);
        if (data.already_in_group > 0) parts.push(`${data.already_in_group} already in group`);
        if (data.invalid_count > 0) parts.push(`${data.invalid_count} invalid skipped`);
        toast.success(parts.join(" · ") || "Contacts processed without duplicates");
        setAddNumbersModalOpen(false);
        setAddNumbersText("");
        setSelectedDirIds(new Set());
        fetchGroups();
        fetchContacts(activeGroupId);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.detail || "Failed to add numbers to group");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsAddingNumbers(false);
    }
  };

  // Remove selected contacts from current active group
  const handleRemoveFromActiveGroup = async () => {
    if (activeGroupId === "all" || selectedIds.size === 0) return;
    try {
      const token = await getAccessToken();
      const ids = Array.from(selectedIds);
      const res = await fetch(`/api/v1/contacts/groups/${activeGroupId}/contacts`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ contact_ids: ids }),
      });
      if (res.ok) {
        toast.success(`Removed ${ids.length} contacts from group`);
        setSelectedIds(new Set());
        fetchGroups();
        fetchContacts(activeGroupId);
      } else {
        toast.error("Failed to remove contacts");
      }
    } catch {
      toast.error("Network error");
    }
  };

  // Create Single Contact with Group Assignment
  const handleCreateSingleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const norm = normalizeIndianMobile(singlePhone) || singlePhone.replace(/[^\d+]/g, "");
    if (!norm || norm.length < 10) {
      toast.error("Please enter a valid phone number (at least 10 digits)");
      return;
    }
    setIsSavingContact(true);
    try {
      const token = await getAccessToken();
      const payload: any = {
        name: singleName.trim() || "Customer",
        phone: norm,
        email: singleEmail.trim() || undefined,
        company: singleCompany.trim() || undefined,
        city: singleCity.trim() || undefined,
      };
      if (singleGroupId !== "none") {
        payload.group_id = singleGroupId;
      } else if (typeof activeGroupId === "number") {
        payload.group_id = activeGroupId;
      }

      const res = await fetch("/api/v1/contacts/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Contact saved without duplicates!`);
        setAddContactModalOpen(false);
        setSingleName("");
        setSinglePhone("");
        setSingleEmail("");
        setSingleCompany("");
        setSingleCity("");
        fetchGroups();
        fetchContacts(activeGroupId === "all" ? undefined : activeGroupId);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.detail || "Failed to save contact");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSavingContact(false);
    }
  };

  // Update Group
  const handleUpdateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup || !editGroupName.trim()) return;
    setIsSavingGroupEdit(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/contacts/groups/${editingGroup.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: editGroupName.trim(),
          description: editGroupDesc.trim(),
          color: editGroupColor,
        }),
      });
      if (res.ok) {
        toast.success("Group updated successfully");
        setEditGroupModalOpen(false);
        fetchGroups();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.detail || "Failed to update group");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSavingGroupEdit(false);
    }
  };

  // Delete Group
  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;
    setIsDeletingGroup(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/contacts/groups/${groupToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success(`Group "${groupToDelete.name}" deleted. Contacts remain in directory.`);
        setDeleteGroupModalOpen(false);
        if (activeGroupId === groupToDelete.id) {
          setActiveGroupId("all");
          fetchContacts();
        }
        fetchGroups();
      } else {
        toast.error("Failed to delete group");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsDeletingGroup(false);
    }
  };

  // Delete selected contacts
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} contact(s)?`)) return;

    try {
      const token = await getAccessToken();
      const ids = Array.from(selectedIds);
      const res = await fetch("/api/v1/contacts/delete-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        toast.success(`Deleted ${ids.length} contacts`);
        setSelectedIds(new Set());
        fetchGroups();
        fetchContacts(activeGroupId === "all" ? undefined : activeGroupId);
      } else {
        toast.error("Failed to delete contacts");
      }
    } catch {
      toast.error("Network error");
    }
  };

  // Toggle selection
  const toggleContact = (id: string | number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectAll = () => {
    const next = new Set(filteredContacts.map((c) => c.id));
    setSelectedIds(next);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const isAllSelected = filteredContacts.length > 0 && filteredContacts.every((c) => selectedIds.has(c.id));

  return (
    <div className="app-page space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Contacts &amp; Groups</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customer directories, organize targeted calling groups, and launch campaigns.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {typeof activeGroupId === "number" && groups.find((g) => g.id === activeGroupId) && (
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setAddNumbersText("");
                setAddNumbersModalOpen(true);
              }}
              className="flex items-center gap-1.5 font-semibold shadow-xs"
            >
              <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" />
              <span>Add Numbers to &quot;{groups.find((g) => g.id === activeGroupId)?.name}&quot;</span>
            </Button>
          )}
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setSingleName("");
              setSinglePhone("");
              setSingleEmail("");
              setSingleCompany("");
              setSingleCity("");
              setSingleGroupId(typeof activeGroupId === "number" ? activeGroupId : "none");
              setAddContactModalOpen(true);
            }}
            className="flex items-center gap-1.5 font-semibold shadow-xs"
          >
            <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" />
            <span>Add Contact</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCreateGroupModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <HugeiconsIcon icon={FolderAddIcon} className="h-4 w-4" />
            <span>New Group</span>
          </Button>
          <Button
            variant={typeof activeGroupId === "number" ? "outline" : "default"}
            size="sm"
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <HugeiconsIcon icon={Upload01Icon} className="h-4 w-4" />
            <span>Import Contacts</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Contacts</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">{contacts.length}</p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <HugeiconsIcon icon={UserRoundIcon} className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Contact Groups</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">{groups.length}</p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <HugeiconsIcon icon={Folder01Icon} className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Not Called</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">
              {contacts.filter((c) => !c.called).length}
            </p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <HugeiconsIcon icon={UserCheck01Icon} className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Already Called</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {contacts.filter((c) => c.called).length}
            </p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            <HugeiconsIcon icon={Megaphone01Icon} className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Groups Filter Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/70 pb-3">
        <button
          type="button"
          onClick={() => handleSelectGroup("all")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
            activeGroupId === "all"
              ? "bg-foreground text-background shadow-xs"
              : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <HugeiconsIcon icon={UserGroupIcon} className="h-3.5 w-3.5" />
          <span>All Contacts ({contacts.length})</span>
        </button>

        {groups.map((g) => {
          const isActive = activeGroupId === g.id;
          return (
            <div
              key={g.id}
              className={`group/chip inline-flex items-center rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <button
                type="button"
                onClick={() => handleSelectGroup(g.id)}
                className="px-3 py-1.5 flex items-center gap-2"
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: isActive ? "#ffffff" : g.color || "#0F6E6E" }}
                />
                <span>{g.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive ? "bg-white/20 text-white font-bold" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {g.member_count}
                </span>
              </button>

              {/* Edit and Delete Buttons */}
              <div className="hidden group-hover/chip:flex items-center pr-1.5 gap-0.5">
                <button
                  type="button"
                  title="Edit Group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingGroup(g);
                    setEditGroupName(g.name);
                    setEditGroupDesc(g.description || "");
                    setEditGroupColor(g.color || GROUP_PALETTE[0]);
                    setEditGroupModalOpen(true);
                  }}
                  className={`p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 ${
                    isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <HugeiconsIcon icon={PencilEdit02Icon} className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  title="Delete Group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setGroupToDelete(g);
                    setDeleteGroupModalOpen(true);
                  }}
                  className="p-1 rounded hover:bg-red-500/20 text-red-500"
                >
                  <HugeiconsIcon icon={Delete02Icon} className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <HugeiconsIcon
            icon={Search01Icon}
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search by name, phone, company..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["all", "uncalled", "called"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setFilterMode(m)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium capitalize transition ${
                filterMode === m ? "bg-muted text-foreground font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "uncalled" ? "Uncalled" : m === "called" ? "Called" : "All"}
            </button>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchContacts(activeGroupId === "all" ? undefined : activeGroupId)}
            className="h-8 px-2 text-xs"
          >
            <HugeiconsIcon icon={RefreshIcon} className={`h-3.5 w-3.5 mr-1 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Bulk Action Bar (when rows selected) */}
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-foreground text-background px-4 py-2.5 shadow-md animate-slideIn">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span>{selectedIds.size} contact(s) selected</span>
            <button type="button" onClick={clearSelection} className="underline text-muted-foreground hover:text-white">
              Clear
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setFollowUpModalOpen(true)}
              className="h-7 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              <HugeiconsIcon icon={SentIcon} className="h-3 w-3 mr-1" />
              Send Follow-Up
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (groups.length > 0 && groups[0]) setBulkTargetGroupId(groups[0].id);
                setAddToGroupModalOpen(true);
              }}
              className="h-7 text-xs font-semibold"
            >
              <HugeiconsIcon icon={Tag01Icon} className="h-3 w-3 mr-1" />
              Add to Group
            </Button>

            {activeGroupId !== "all" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveFromActiveGroup}
                className="h-7 text-xs font-semibold bg-transparent text-white border-white/30 hover:bg-white/10"
              >
                Remove from Group
              </Button>
            )}

            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              className="h-7 text-xs font-semibold"
            >
              <HugeiconsIcon icon={Delete02Icon} className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Contacts Table Card */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-xs font-semibold text-muted-foreground">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={isAllSelected ? clearSelection : selectAll}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                </th>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Company / City</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                    <HugeiconsIcon icon={RefreshIcon} className="h-5 w-5 animate-spin mx-auto mb-2 text-primary" />
                    Loading contacts…
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-muted-foreground">
                    No contacts found. Click &quot;Import Contacts&quot; to add numbers.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((c) => {
                  const isChecked = selectedIds.has(c.id);
                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-muted/30 transition-colors ${isChecked ? "bg-muted/40" : ""}`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleContact(c.id)}
                          className="h-4 w-4 rounded accent-primary cursor-pointer"
                        />
                      </td>
                      <td className="p-3 font-semibold text-foreground text-xs sm:text-sm">{c.name}</td>
                      <td className="p-3 font-mono text-xs">{c.phone}</td>
                      <td className="p-3 text-xs text-muted-foreground">{c.email || "—"}</td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {c.company || c.city ? `${c.company || ""}${c.company && c.city ? " · " : ""}${c.city || ""}` : "—"}
                      </td>
                      <td className="p-3">
                        {c.called ? (
                          <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            Called
                          </span>
                        ) : (
                          <span className="rounded bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold">
                            Not Called
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Create Group Modal ── */}
      <Dialog open={createGroupModalOpen} onOpenChange={setCreateGroupModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Contact Group</DialogTitle>
            <DialogDescription>
              Organize contacts into custom lists for campaigns.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateGroup} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="group-name">Group Name *</Label>
              <Input
                id="group-name"
                placeholder="e.g. Real Estate VIPs, Q3 Prospects"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="group-desc">Description (Optional)</Label>
              <Input
                id="group-desc"
                placeholder="e.g. High intent inquiries from landing page"
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Group Badge Color</Label>
              <div className="flex items-center gap-2 pt-1">
                {GROUP_PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewGroupColor(c)}
                    className={`h-6 w-6 rounded-full transition-transform ${
                      newGroupColor === c ? "ring-2 ring-primary scale-110" : "opacity-75 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" type="button" onClick={() => setCreateGroupModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingGroup || !newGroupName.trim()}>
                {isCreatingGroup ? "Creating..." : "Create Group"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Import Contacts Modal (CSV & Quick Paste) with Group Assignment ── */}
      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Contacts</DialogTitle>
            <DialogDescription>
              Upload a CSV spreadsheet or paste phone numbers.
            </DialogDescription>
          </DialogHeader>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-muted p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setImportTab("csv")}
              className={`py-1.5 rounded-md transition ${importTab === "csv" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"}`}
            >
              CSV File Upload
            </button>
            <button
              type="button"
              onClick={() => setImportTab("paste")}
              className={`py-1.5 rounded-md transition ${importTab === "paste" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"}`}
            >
              Quick Paste Numbers
            </button>
          </div>

          {/* Group Assignment Settings */}
          <div className="rounded-lg border border-border/80 bg-muted/30 p-3 space-y-2 text-xs">
            <span className="font-bold text-foreground uppercase tracking-wider block text-[11px]">
              Group Assignment:
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="import-group-mode"
                  checked={importGroupMode === "none"}
                  onChange={() => setImportGroupMode("none")}
                  className="accent-primary"
                />
                <span>General Directory</span>
              </label>

              {groups.length > 0 && (
                <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="import-group-mode"
                    checked={importGroupMode === "existing"}
                    onChange={() => {
                      setImportGroupMode("existing");
                      if (!importSelectedGroupId && groups[0]) setImportSelectedGroupId(groups[0].id);
                    }}
                    className="accent-primary"
                  />
                  <span>Existing Group</span>
                  {importGroupMode === "existing" && (
                    <select
                      value={importSelectedGroupId ?? groups[0]?.id}
                      onChange={(e) => setImportSelectedGroupId(Number(e.target.value))}
                      className="ml-1 h-6 rounded border border-border bg-background px-1.5 text-xs font-semibold"
                    >
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  )}
                </label>
              )}

              <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="import-group-mode"
                  checked={importGroupMode === "new"}
                  onChange={() => setImportGroupMode("new")}
                  className="accent-primary"
                />
                <span>Create New</span>
              </label>
            </div>

            {importGroupMode === "new" && (
              <div className="pt-1 flex items-center gap-2">
                <Input
                  placeholder="Enter new group name"
                  value={importNewGroupName}
                  onChange={(e) => setImportNewGroupName(e.target.value)}
                  className="h-7 text-xs flex-1"
                />
                <div className="flex items-center gap-1">
                  {GROUP_PALETTE.slice(0, 5).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setImportNewGroupColor(color)}
                      className={`h-4 w-4 rounded-full ${importNewGroupColor === color ? "ring-2 ring-primary scale-110" : "opacity-80"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tab content */}
          {importTab === "csv" ? (
            <div className="space-y-3 py-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border/80 rounded-xl p-8 text-center cursor-pointer hover:bg-muted/40 transition space-y-2"
              >
                <HugeiconsIcon icon={Upload01Icon} className="h-8 w-8 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Click to select CSV File</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Must have a &apos;Phone&apos; column header</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              <textarea
                rows={6}
                placeholder={`9876543210\nRahul Sharma, 9123456789\n+91 9811223344`}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                className="w-full rounded-md border border-border bg-background p-2.5 font-mono text-xs leading-relaxed"
              />
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setImportModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" disabled={isImporting || !pasteText.trim()} onClick={handleProcessPaste}>
                  {isImporting ? "Importing..." : "Import Contacts"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Bulk Add Selected Contacts to Group Modal ── */}
      <Dialog open={addToGroupModalOpen} onOpenChange={setAddToGroupModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Contact Group</DialogTitle>
            <DialogDescription>
              Assign {selectedIds.size} selected contact(s) to a group.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            {groups.length > 0 && (
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border cursor-pointer">
                <input
                  type="radio"
                  name="bulk-assign-mode"
                  checked={bulkTargetGroupId !== "new"}
                  onChange={() => {
                    if (groups[0]) setBulkTargetGroupId(groups[0].id);
                  }}
                  className="accent-primary"
                />
                <span className="font-semibold">Existing Group:</span>
                {bulkTargetGroupId !== "new" && (
                  <select
                    value={bulkTargetGroupId}
                    onChange={(e) => setBulkTargetGroupId(Number(e.target.value))}
                    className="ml-auto h-7 rounded border border-border bg-background px-2 text-xs font-semibold"
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>{g.name} ({g.member_count})</option>
                    ))}
                  </select>
                )}
              </label>
            )}

            <label className="flex items-center gap-2 p-2.5 rounded-lg border border-border cursor-pointer">
              <input
                type="radio"
                name="bulk-assign-mode"
                checked={bulkTargetGroupId === "new"}
                onChange={() => setBulkTargetGroupId("new")}
                className="accent-primary"
              />
              <span className="font-semibold">Create New Group:</span>
            </label>

            {bulkTargetGroupId === "new" && (
              <div className="pl-6 space-y-2">
                <Input
                  placeholder="New group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddToGroupModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignSelectedToGroup}>
              Assign to Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Direct Add Numbers to Group Modal ── */}
      {typeof activeGroupId === "number" && groups.find((g) => g.id === activeGroupId) && (
        <Dialog open={addNumbersModalOpen} onOpenChange={setAddNumbersModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: groups.find((g) => g.id === activeGroupId)?.color || "#0F6E6E" }}
                />
                <DialogTitle>Add Numbers to &quot;{groups.find((g) => g.id === activeGroupId)?.name}&quot;</DialogTitle>
              </div>
              <DialogDescription>
                Directly add mobile numbers into this group. Numbers already in your directory will be linked automatically without duplicate rows.
              </DialogDescription>
            </DialogHeader>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-lg border border-border p-1 bg-muted/40 text-xs">
              <button
                type="button"
                onClick={() => setAddNumbersTab("paste")}
                className={`flex-1 py-1.5 font-semibold rounded-md transition ${
                  addNumbersTab === "paste"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Quick Paste / Type
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddNumbersTab("directory");
                  if (directoryContacts.length === 0) {
                    void fetchDirectoryForPicker();
                  }
                }}
                className={`flex-1 py-1.5 font-semibold rounded-md transition ${
                  addNumbersTab === "directory"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pick from Directory
              </button>
            </div>

            <div className="space-y-3 py-1 text-xs">
              <div className="rounded-md border border-primary/20 bg-primary/5 p-2.5 text-xs text-foreground">
                <p className="font-semibold text-primary">🛡️ Zero Duplicate Protection</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  Existing contacts in your directory will be reused; only missing numbers will be added to the directory.
                </p>
              </div>

              {addNumbersTab === "paste" ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs font-semibold">Phone Numbers:</Label>
                    <span className="text-[11px] text-muted-foreground">Comma or new line separated</span>
                  </div>
                  <textarea
                    rows={5}
                    value={addNumbersText}
                    onChange={(e) => setAddNumbersText(e.target.value)}
                    placeholder={"9876543210\n+91 91234 56789\nRohan, 9811122233"}
                    className="w-full rounded-md border border-border bg-background p-2.5 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Accepts 10-digit Indian numbers, with or without +91, or &quot;Name, Phone&quot;.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="Search existing contacts..."
                    value={dirSearch}
                    onChange={(e) => setDirSearch(e.target.value)}
                    className="h-8 text-xs"
                  />

                  {isLoadingDirectory ? (
                    <div className="py-6 text-center text-xs text-muted-foreground">
                      Loading directory contacts…
                    </div>
                  ) : (
                    <div className="max-h-52 overflow-y-auto rounded-md border border-border divide-y divide-border">
                      {directoryContacts
                        .filter((c) => !dirSearch || `${c.name} ${c.phone}`.toLowerCase().includes(dirSearch.toLowerCase()))
                        .slice(0, 100)
                        .map((c) => {
                          const cid = Number(c.id);
                          const isChecked = selectedDirIds.has(cid);
                          return (
                            <label
                              key={c.id}
                              className="flex items-center justify-between p-2 hover:bg-muted/40 cursor-pointer text-xs select-none"
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    setSelectedDirIds((prev) => {
                                      const next = new Set(prev);
                                      if (next.has(cid)) next.delete(cid);
                                      else next.add(cid);
                                      return next;
                                    });
                                  }}
                                  className="h-3.5 w-3.5 accent-primary rounded"
                                />
                                <div>
                                  <span className="font-semibold block">{c.name}</span>
                                  <span className="text-[11px] text-muted-foreground font-mono">{c.phone}</span>
                                </div>
                              </div>
                              {isChecked && (
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                  Selected
                                </span>
                              )}
                            </label>
                          );
                        })}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground font-medium">
                      {selectedDirIds.size} selected
                    </span>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAddNumbersModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleDirectAddNumbersToGroup}
                disabled={
                  isAddingNumbers ||
                  (addNumbersTab === "paste" ? !addNumbersText.trim() : selectedDirIds.size === 0)
                }
              >
                {isAddingNumbers
                  ? "Adding..."
                  : addNumbersTab === "paste"
                  ? "Add to Group"
                  : `Attach ${selectedDirIds.size} to Group`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ── Single Add Contact Modal with Group Assignment ── */}
      <Dialog open={addContactModalOpen} onOpenChange={setAddContactModalOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateSingleContact} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add Contact</DialogTitle>
              <DialogDescription>
                Save a single customer contact to your directory or directly assign them to a group.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-1">
              <div>
                <Label htmlFor="sc-name" className="text-xs font-semibold mb-1 block">Full Name</Label>
                <Input
                  id="sc-name"
                  placeholder="e.g. Rahul Sharma"
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="sc-phone" className="text-xs font-semibold mb-1 block">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sc-phone"
                  required
                  placeholder="+91 98765 43210 or 9876543210"
                  value={singlePhone}
                  onChange={(e) => setSinglePhone(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="sc-email" className="text-xs font-semibold mb-1 block">Email (Optional)</Label>
                  <Input
                    id="sc-email"
                    type="email"
                    placeholder="name@company.com"
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor="sc-city" className="text-xs font-semibold mb-1 block">City (Optional)</Label>
                  <Input
                    id="sc-city"
                    placeholder="e.g. Mumbai"
                    value={singleCity}
                    onChange={(e) => setSingleCity(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sc-group" className="text-xs font-semibold mb-1 block">Assign to Group (Optional)</Label>
                <select
                  id="sc-group"
                  value={singleGroupId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSingleGroupId(val === "none" ? "none" : Number(val));
                  }}
                  className="w-full h-9 rounded-md border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="none">General Directory (No Group)</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.member_count} contacts)
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-md border border-primary/20 bg-primary/5 p-2.5 text-xs text-foreground">
                <p className="font-semibold text-primary">🛡️ Zero Duplicate Guarantee</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  If this phone number already exists in your directory, details will be updated and attached to the selected group without creating a duplicate record.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setAddContactModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingContact || !singlePhone.trim()}>
                {isSavingContact ? "Saving..." : "Save Contact"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Edit Group Modal ── */}
      {editingGroup && (
        <Dialog open={editGroupModalOpen} onOpenChange={setEditGroupModalOpen}>
          <DialogContent className="max-w-md">
            <form onSubmit={handleUpdateGroup} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Edit Contact Group</DialogTitle>
                <DialogDescription>
                  Update the group name, description, and color tag.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-1">
                <div>
                  <Label htmlFor="eg-name" className="text-xs font-semibold mb-1 block">Group Name</Label>
                  <Input
                    id="eg-name"
                    required
                    value={editGroupName}
                    onChange={(e) => setEditGroupName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div>
                  <Label htmlFor="eg-desc" className="text-xs font-semibold mb-1 block">Description</Label>
                  <Input
                    id="eg-desc"
                    value={editGroupDesc}
                    onChange={(e) => setEditGroupDesc(e.target.value)}
                    placeholder="e.g. High priority leads from webinar"
                    className="h-9 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold mb-1.5 block">Group Color</Label>
                  <div className="flex items-center gap-2">
                    {GROUP_PALETTE.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEditGroupColor(c)}
                        style={{ backgroundColor: c }}
                        className={`h-6 w-6 rounded-full transition-transform ${
                          editGroupColor === c ? "ring-2 ring-foreground ring-offset-2 scale-110" : "opacity-80 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setEditGroupModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSavingGroupEdit || !editGroupName.trim()}>
                  {isSavingGroupEdit ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* ── Delete Group Confirmation Dialog ── */}
      {groupToDelete && (
        <Dialog open={deleteGroupModalOpen} onOpenChange={setDeleteGroupModalOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-red-600">Delete Contact Group?</DialogTitle>
              <DialogDescription className="text-xs">
                Are you sure you want to delete <strong className="text-foreground">{groupToDelete.name}</strong>?
                <br /><br />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ Your contacts will remain completely safe in the General Directory.
                </span>{" "}
                Only the group tag will be removed.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2">
              <Button variant="outline" type="button" onClick={() => setDeleteGroupModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                type="button"
                onClick={handleDeleteGroup}
                disabled={isDeletingGroup}
              >
                {isDeletingGroup ? "Deleting..." : "Delete Group"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ── Multi-Channel Lead Follow-Up Modal ── */}
      <SendFollowUpModal
        isOpen={followUpModalOpen}
        onClose={() => setFollowUpModalOpen(false)}
        selectedLeads={contacts.filter((c) => selectedIds.has(c.id))}
        onDispatchSuccess={(count) => {
          toast.success(`Dispatched multi-channel follow-up to ${count} leads!`);
          clearSelection();
        }}
      />
    </div>
  );
}
