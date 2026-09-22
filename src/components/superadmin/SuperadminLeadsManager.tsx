"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Inbox,
  Search,
  RefreshCw,
  PhoneCall,
  Mail,
  Building2,
  User,
  Briefcase,
  Globe,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Download,
  Filter,
  Eye,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export interface LeadItem {
  id: number;
  kind: "hire_expert" | "enterprise" | string;
  name: string;
  company: string;
  email: string;
  phone: string;
  job_title: string;
  volume: string;
  deployment: string;
  agent_goal: string;
  source: string;
  origin: string;
  country: string;
  timezone: string;
  status: "new" | "contacted" | "in_discussion" | "qualified" | "closed" | string;
  notes: string;
  raw_payload?: Record<string, unknown>;
  created_at: string | null;
}

interface LeadStats {
  total: number;
  hire_expert_count: number;
  enterprise_count: number;
  new_count: number;
  contacted_count: number;
  qualified_count: number;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; badgeVariant: string; border: string; bg: string }
> = {
  new: {
    label: "New",
    color: "text-amber-400",
    badgeVariant: "default",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10 text-amber-400",
  },
  contacted: {
    label: "Contacted",
    color: "text-blue-400",
    badgeVariant: "default",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10 text-blue-400",
  },
  in_discussion: {
    label: "In Discussion",
    color: "text-purple-400",
    badgeVariant: "default",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10 text-purple-400",
  },
  qualified: {
    label: "Qualified",
    color: "text-emerald-400",
    badgeVariant: "default",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10 text-emerald-400",
  },
  closed: {
    label: "Closed",
    color: "text-zinc-400",
    badgeVariant: "default",
    border: "border-zinc-500/30",
    bg: "bg-zinc-500/10 text-zinc-400",
  },
};

export function SuperadminLeadsManager() {
  const { getAccessToken } = useAuth();
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [stats, setStats] = useState<LeadStats>({
    total: 0,
    hire_expert_count: 0,
    enterprise_count: 0,
    new_count: 0,
    contacted_count: 0,
    qualified_count: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selected Lead Modal
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Delete Lead Dialog
  const [leadToDelete, setLeadToDelete] = useState<LeadItem | null>(null);
  const [deletingLead, setDeletingLead] = useState(false);

  // Copy Feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.append("kind", typeFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/v1/leads?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        toast.error("Failed to load inbound enquiries");
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
      toast.error("Network error while loading enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [typeFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        toast.success(`Status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setSavingNotes(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/leads/${selectedLead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ notes: editingNotes }),
      });

      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === selectedLead.id ? { ...l, notes: editingNotes } : l
          )
        );
        setSelectedLead((prev) => (prev ? { ...prev, notes: editingNotes } : null));
        toast.success("Notes saved successfully");
      } else {
        toast.error("Failed to save notes");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!leadToDelete) return;
    setDeletingLead(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/leads/${leadToDelete.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== leadToDelete.id));
        setStats((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
        setLeadToDelete(null);
        if (selectedLead?.id === leadToDelete.id) {
          setDetailsModalOpen(false);
        }
        toast.success("Enquiry removed");
      } else {
        toast.error("Failed to delete enquiry");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete enquiry");
    } finally {
      setDeletingLead(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      toast.error("No enquiries to export");
      return;
    }

    const headers = [
      "ID",
      "Type",
      "Status",
      "Name",
      "Company",
      "Email",
      "Phone",
      "Job Title",
      "Expected Volume",
      "Deployment",
      "Agent Goal",
      "Origin",
      "Country",
      "Timezone",
      "Notes",
      "Created At",
    ];

    const rows = leads.map((l) => [
      l.id,
      l.kind === "hire_expert" ? "Done-for-you" : "Strategy Call",
      l.status,
      `"${(l.name || "").replace(/"/g, '""')}"`,
      `"${(l.company || "").replace(/"/g, '""')}"`,
      `"${(l.email || "").replace(/"/g, '""')}"`,
      `"${(l.phone || "").replace(/"/g, '""')}"`,
      `"${(l.job_title || "").replace(/"/g, '""')}"`,
      `"${(l.volume || "").replace(/"/g, '""')}"`,
      `"${(l.deployment || "").replace(/"/g, '""')}"`,
      `"${(l.agent_goal || "").replace(/"/g, '""')}"`,
      `"${(l.origin || "").replace(/"/g, '""')}"`,
      `"${(l.country || "").replace(/"/g, '""')}"`,
      `"${(l.timezone || "").replace(/"/g, '""')}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
      l.created_at || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `callio_inbound_enquiries_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Enquiries exported as CSV");
  };

  const openDetailsModal = (lead: LeadItem) => {
    setSelectedLead(lead);
    setEditingNotes(lead.notes || "");
    setDetailsModalOpen(true);
  };

  const formatTimestamp = (isoString?: string | null) => {
    if (!isoString) return "—";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-background to-purple-950/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                <Inbox className="h-4.5 w-4.5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Inbound Enquiries & Strategy Calls
              </h1>
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                PIPELINE
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Consolidated inbox for incoming &ldquo;Done-for-you&rdquo; voice agent build requests
              and enterprise &ldquo;Book a Strategy Call&rdquo; reservations. Track qualification, review project scopes, and follow up directly.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={leads.length === 0}
              className="h-9 gap-2 text-xs border-border/70 hover:bg-muted/70"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLeads}
              disabled={loading}
              className="h-9 gap-2 text-xs border-border/70 hover:bg-muted/70"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Inbound Enquiries
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Inbox className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.total}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              All lifetime captured submissions
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Done-For-You Agents
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {stats.hire_expert_count}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Custom agent build requests
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Strategy Calls Booked
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {stats.enterprise_count}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Enterprise volume discussions
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Action Required (New)
            </CardTitle>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">
              {stats.new_count}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Awaiting review & initial response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border/60 bg-card/50 shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, company, email, phone, or goal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs bg-background/60 border-border/70"
                />
              </div>
              <Button type="submit" size="sm" className="h-9 px-4 text-xs bg-indigo-600 hover:bg-indigo-500 text-white">
                Filter
              </Button>
            </form>

            {/* Select Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Type:
                </span>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-9 w-[160px] text-xs bg-background/60 border-border/70">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="hire_expert">Done-For-You</SelectItem>
                    <SelectItem value="enterprise">Strategy Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-medium">Status:</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-[150px] text-xs bg-background/60 border-border/70">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="in_discussion">In Discussion</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table Card */}
      <Card className="border-border/60 bg-card/50 shadow-xs overflow-hidden">
        <CardHeader className="p-4 sm:p-6 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                <span>Enquiries Pipeline</span>
                <Badge variant="outline" className="text-xs border-border/60 font-mono">
                  {leads.length} {leads.length === 1 ? "entry" : "entries"}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Real-time submissions stored in PostgreSQL. Change status inline to update your pipeline.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Contact & Company</th>
                <th className="py-3 px-4">Communication</th>
                <th className="py-3 px-4">Expected Scope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-indigo-500" />
                      <span>Loading inbound enquiries...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-1">
                        <Inbox className="h-6 w-6" />
                      </div>
                      <span className="font-medium text-foreground text-sm">No enquiries found</span>
                      <p className="text-xs text-muted-foreground">
                        No submissions match the selected filter criteria. When visitors submit the Done-for-you or Strategy Call forms, they will automatically appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const isDoneForYou = lead.kind === "hire_expert";
                  const statusConf = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Category Badge */}
                      <td className="py-3 px-4 align-top">
                        {isDoneForYou ? (
                          <Badge className="bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[10px] font-medium flex items-center gap-1 w-fit py-0.5">
                            <Sparkles className="h-3 w-3 shrink-0" />
                            Done-for-you
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] font-medium flex items-center gap-1 w-fit py-0.5">
                            <Calendar className="h-3 w-3 shrink-0" />
                            Strategy Call
                          </Badge>
                        )}
                        {lead.origin && (
                          <span className="block text-[10px] text-muted-foreground font-mono mt-1">
                            ref: {lead.origin}
                          </span>
                        )}
                      </td>

                      {/* Contact & Company */}
                      <td className="py-3 px-4 align-top max-w-[220px]">
                        <div className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                          <span>{lead.name || "Anonymous / Not provided"}</span>
                        </div>
                        {lead.company && (
                          <div className="text-muted-foreground text-[11px] flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                            <span className="truncate">{lead.company}</span>
                          </div>
                        )}
                        {lead.job_title && (
                          <div className="text-muted-foreground/80 text-[10px] flex items-center gap-1 mt-0.5">
                            <Briefcase className="h-2.5 w-2.5 shrink-0" />
                            <span className="truncate">{lead.job_title}</span>
                          </div>
                        )}
                        {lead.country && (
                          <div className="mt-1">
                            <Badge variant="outline" className="text-[9px] py-0 px-1 border-border/50 text-muted-foreground">
                              {lead.country}
                            </Badge>
                          </div>
                        )}
                      </td>

                      {/* Communication (Email + Phone) */}
                      <td className="py-3 px-4 align-top">
                        {lead.email ? (
                          <div className="flex items-center gap-1.5 group/email">
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 text-xs truncate max-w-[180px]"
                              title={lead.email}
                            >
                              <Mail className="h-3 w-3 shrink-0" />
                              <span className="truncate">{lead.email}</span>
                            </a>
                            <button
                              onClick={() => handleCopy(lead.email, `email-${lead.id}`)}
                              className="text-muted-foreground hover:text-foreground opacity-0 group-hover/email:opacity-100 transition-opacity"
                              title="Copy email"
                            >
                              {copiedKey === `email-${lead.id}` ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/50 text-[11px]">No email</span>
                        )}

                        {lead.phone ? (
                          <div className="flex items-center gap-1.5 mt-1 group/phone">
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-muted-foreground hover:text-foreground hover:underline flex items-center gap-1 text-[11px] font-mono truncate"
                              title={lead.phone}
                            >
                              <PhoneCall className="h-3 w-3 shrink-0 text-emerald-500" />
                              <span>{lead.phone}</span>
                            </a>
                            <button
                              onClick={() => handleCopy(lead.phone, `phone-${lead.id}`)}
                              className="text-muted-foreground hover:text-foreground opacity-0 group-hover/phone:opacity-100 transition-opacity"
                              title="Copy phone"
                            >
                              {copiedKey === `phone-${lead.id}` ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/50 text-[11px] block mt-0.5">No phone</span>
                        )}
                      </td>

                      {/* Expected Scope & Goal */}
                      <td className="py-3 px-4 align-top max-w-[260px]">
                        {lead.volume && (
                          <div className="inline-block px-1.5 py-0.5 rounded bg-muted/60 text-[10px] font-mono text-muted-foreground border border-border/50 mb-1">
                            Vol: {lead.volume}
                          </div>
                        )}
                        {lead.agent_goal ? (
                          <p
                            className="text-[11px] text-muted-foreground line-clamp-2 cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => openDetailsModal(lead)}
                            title="Click to view full description"
                          >
                            {lead.agent_goal}
                          </p>
                        ) : (
                          <span className="text-muted-foreground/50 text-[11px] italic">
                            No goal specified
                          </span>
                        )}
                        {lead.notes && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                            <FileText className="h-2.5 w-2.5" />
                            <span className="truncate max-w-[200px]">Notes: {lead.notes}</span>
                          </div>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3 px-4 align-top">
                        <Select
                          value={lead.status || "new"}
                          onValueChange={(val) => handleStatusChange(lead.id, val)}
                        >
                          <SelectTrigger
                            className={`h-7 w-[120px] text-[11px] font-medium border ${statusConf.border} ${statusConf.bg} focus:ring-0`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="in_discussion">In Discussion</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        <div className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground/60" />
                          <span>{formatTimestamp(lead.created_at)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetailsModal(lead)}
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/70 gap-1"
                            title="View full enquiry details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Details</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLeadToDelete(lead)}
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Delete enquiry"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Details & Notes Modal */}
      {selectedLead && (
        <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border/80">
            <DialogHeader>
              <div className="flex items-center justify-between gap-3 mb-1">
                {selectedLead.kind === "hire_expert" ? (
                  <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 text-xs py-0.5">
                    Done-for-you Voice Agent
                  </Badge>
                ) : (
                  <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-xs py-0.5">
                    Enterprise Strategy Call
                  </Badge>
                )}
                <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                  ID #{selectedLead.id}
                </Badge>
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {selectedLead.name || "Unnamed Submission"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Submitted on {formatTimestamp(selectedLead.created_at)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-0.5">
                    Company
                  </span>
                  <p className="font-medium text-foreground">
                    {selectedLead.company || "Not provided"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-0.5">
                    Job Title / Role
                  </span>
                  <p className="font-medium text-foreground">
                    {selectedLead.job_title || "Not provided"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-0.5">
                    Email Address
                  </span>
                  {selectedLead.email ? (
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Mail className="h-3 w-3 shrink-0" />
                      {selectedLead.email}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-0.5">
                    Phone Number
                  </span>
                  {selectedLead.phone ? (
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="text-foreground hover:underline flex items-center gap-1 font-mono font-medium"
                    >
                      <PhoneCall className="h-3 w-3 text-emerald-500 shrink-0" />
                      {selectedLead.phone}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-0.5">
                    Country & Timezone
                  </span>
                  <p className="text-muted-foreground font-mono">
                    {selectedLead.country || "Unknown"} {selectedLead.timezone ? `(${selectedLead.timezone})` : ""}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-0.5">
                    Form Origin & Referral
                  </span>
                  <p className="text-muted-foreground font-mono">
                    {selectedLead.origin || selectedLead.source || "Direct web"}
                  </p>
                </div>
              </div>

              {/* Scope & Goals */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-0.5">
                      Expected Call Volume
                    </span>
                    <Badge variant="outline" className="font-mono text-xs border-indigo-500/30 text-indigo-400">
                      {selectedLead.volume || "Not specified"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-0.5">
                      Deployment Preference
                    </span>
                    <span className="font-medium text-foreground">
                      {selectedLead.deployment || "Standard Cloud"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block mb-1">
                    Voice Agent Goal & Project Details
                  </span>
                  <div className="p-3 rounded-lg bg-background/80 border border-border/60 text-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedLead.agent_goal || "No specific goal provided by user."}
                  </div>
                </div>
              </div>

              {/* Status Update & Internal Notes */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                    Lead Status
                  </span>
                  <Select
                    value={selectedLead.status || "new"}
                    onValueChange={(val) => handleStatusChange(selectedLead.id, val)}
                  >
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="in_discussion">In Discussion</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-semibold text-muted-foreground block mb-1">
                    Internal Superadmin Notes
                  </label>
                  <Textarea
                    placeholder="Add follow-up notes, call summary, or pricing discussion..."
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    rows={3}
                    className="text-xs bg-background/80 border-border/60"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="h-8 text-xs bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                      {savingNotes ? "Saving..." : "Save Notes"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Raw JSON Payload (Collapsible) */}
              {selectedLead.raw_payload && Object.keys(selectedLead.raw_payload).length > 0 && (
                <details className="p-3 rounded-xl bg-muted/20 border border-border/40 group">
                  <summary className="cursor-pointer text-[11px] font-semibold text-muted-foreground hover:text-foreground flex items-center justify-between">
                    <span>Inspect Raw Form Payload</span>
                    <span className="text-[10px] font-mono text-muted-foreground/60">JSON</span>
                  </summary>
                  <pre className="mt-2 p-2.5 rounded bg-black/40 text-[10px] font-mono text-muted-foreground overflow-x-auto border border-border/40">
                    {JSON.stringify(selectedLead.raw_payload, null, 2)}
                  </pre>
                </details>
              )}
            </div>

            <DialogFooter className="flex items-center justify-between border-t border-border/50 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDetailsModalOpen(false)}
                className="text-xs"
              >
                Close
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setLeadToDelete(selectedLead);
                }}
                className="text-xs gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Enquiry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {leadToDelete && (
        <Dialog open={!!leadToDelete} onOpenChange={(open) => !open && setLeadToDelete(null)}>
          <DialogContent className="max-w-md bg-card border-border/80">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-destructive flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Inbound Enquiry
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1">
                Are you sure you want to delete the enquiry from &ldquo;{leadToDelete.name || leadToDelete.company || "Anonymous"}&rdquo;?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLeadToDelete(null)}
                disabled={deletingLead}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteLead}
                disabled={deletingLead}
                className="text-xs gap-1.5"
              >
                {deletingLead ? "Deleting..." : "Confirm Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
