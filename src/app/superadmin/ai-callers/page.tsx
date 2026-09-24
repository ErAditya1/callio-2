"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Bot,
  Plus,
  Trash2,
  Sparkles,
  PhoneCall,
  Layers,
  CheckCircle2,
  AlertCircle,
  Tag,
  Code,
  X,
  Play,
  RotateCw,
  Search,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Building2,
  Phone,
  Globe,
  Mic,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

export interface AgentVariable {
  key: string;
  name?: string;
  label: string;
  type: string;
  placeholder?: string;
}

export interface BuiltinAgent {
  id: number;
  workflow_uuid?: string;
  name: string;
  category: string;
  badge: string;
  description: string;
  first_message?: string;
  system_prompt?: string;
  language?: string;
  voice_id?: string;
  call_type?: string;
  variables: AgentVariable[];
  conversion_goal?: Record<string, any>;
  tested_by_admin?: boolean;
  tested_at?: string;
}

export interface WorkspaceWorkflow {
  id: number;
  name: string;
  description?: string;
  status?: string;
  created_at?: string;
  workflow_definition?: any;
  is_builtin?: boolean;
}

export interface InventoryNumberItem {
  id: number;
  phone_number: string;
  provider?: string;
  telephony_configuration_id?: number;
  label?: string;
  is_active?: boolean;
}

const CATEGORIES = [
  "All",
  "Sales & Outreach",
  "Real Estate",
  "Customer Support",
  "Healthcare",
  "E-Commerce",
  "Finance",
  "Lead Qualification",
  "General",
];

const BADGE_OPTIONS = [
  "Official Template",
  "High Conversion",
  "Staff Pick",
  "Top Rated",
  "Popular",
  "Fast Responder",
];

const VOICE_PRESETS = [
  { id: "default", label: "Default AI Voice (Cartesia Warm)" },
  { id: "priya_in_female", label: "Priya (Indian English / Hindi Female)" },
  { id: "aarav_in_male", label: "Aarav (Indian English / Hindi Male)" },
  { id: "sarah_us_female", label: "Sarah (US Natural Female - ElevenLabs)" },
  { id: "george_uk_male", label: "George (British Executive Male)" },
  { id: "alloy_openai", label: "OpenAI Alloy (Versatile Neutral)" },
  { id: "custom", label: "Custom Voice ID..." },
];

export default function SuperadminAICallersPage() {
  const { getAccessToken, user } = useAuth();
  const [agents, setAgents] = useState<BuiltinAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Direct Create Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Sales & Outreach");
  const [badge, setBadge] = useState("Official Template");
  const [description, setDescription] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [language, setLanguage] = useState("en-IN");
  const [voicePreset, setVoicePreset] = useState("default");
  const [customVoiceId, setCustomVoiceId] = useState("");
  const [conversionGoal, setConversionGoal] = useState("Qualify lead and book appointment");
  const [variables, setVariables] = useState<AgentVariable[]>([
    { key: "client_name", label: "Client Name", type: "text", placeholder: "e.g. Aarav Sharma" },
  ]);

  // Workspace Workflows Picker Modal State (Option B)
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [workspaceAgents, setWorkspaceAgents] = useState<WorkspaceWorkflow[]>([]);
  const [loadingWorkspace, setLoadingWorkspace] = useState(false);
  const [selectedWorkspaceAgent, setSelectedWorkspaceAgent] = useState<WorkspaceWorkflow | null>(null);
  const [publishCategory, setPublishCategory] = useState("Sales & Outreach");
  const [publishBadge, setPublishBadge] = useState("Official Template");
  const [publishDescription, setPublishDescription] = useState("");
  const [publishGoal, setPublishGoal] = useState("High Conversion Outreach");
  const [publishingWorkspace, setPublishingWorkspace] = useState(false);

  // Test Call Modal State
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testingAgent, setTestingAgent] = useState<BuiltinAgent | null>(null);
  const [testPhone, setTestPhone] = useState("");
  const [testingCall, setTestingCall] = useState(false);
  const [inventoryNumbers, setInventoryNumbers] = useState<InventoryNumberItem[]>([]);
  const [selectedFromNumber, setSelectedFromNumber] = useState<string>("");
  const [loadingInventory, setLoadingInventory] = useState(false);

  const getHeaders = async (contentType = true): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {};
    if (contentType) headers["Content-Type"] = "application/json";
    try {
      const token = await getAccessToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    } catch {}
    return headers;
  };

  const fetchInventory = async () => {
    try {
      setLoadingInventory(true);
      const headers = await getHeaders(false);
      const res = await fetch("/api/v1/superuser/telephony/inventory", {
        headers,
        cache: "no-store",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const list: InventoryNumberItem[] = Array.isArray(data) ? data : [];
        setInventoryNumbers(list);
        if (list.length > 0) {
          setSelectedFromNumber((prev) => prev || list[0].phone_number);
        }
      }
    } catch {
      // fallback handled gracefully in UI
    } finally {
      setLoadingInventory(false);
    }
  };

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const headers = await getHeaders(false);
      const res = await fetch("/api/v1/workflow/builtin", {
        headers,
        cache: "no-store",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setAgents(Array.isArray(data) ? data : []);
      } else {
        toast.error("Failed to load platform built-in callers");
      }
    } catch {
      toast.error("Network error while loading platform built-in callers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    fetchInventory();
  }, []);

  const addVariable = () => {
    setVariables((prev) => [
      ...prev,
      { key: "", label: "", type: "text", placeholder: "" },
    ]);
  };

  const removeVariable = (idx: number) => {
    setVariables((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateVariable = (idx: number, patch: Partial<AgentVariable>) => {
    setVariables((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, ...patch } : v))
    );
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Caller name is required");
      return;
    }

    const validVars = variables
      .filter((v) => v.key.trim() || v.label.trim())
      .map((v) => ({
        key: (v.key || v.label).toLowerCase().replace(/[^a-z0-9_]+/g, "_"),
        name: (v.key || v.label).toLowerCase().replace(/[^a-z0-9_]+/g, "_"),
        label: v.label || v.key,
        type: v.type || "text",
        placeholder: v.placeholder || "",
      }));

    const finalVoice = voicePreset === "custom" ? customVoiceId.trim() || "default" : voicePreset;

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        category,
        badge,
        first_message: firstMessage.trim(),
        system_prompt: systemPrompt.trim(),
        language,
        voice_id: finalVoice,
        variables: validVars,
        conversion_goal: { goal: conversionGoal },
      };

      const headers = await getHeaders(true);
      const res = await fetch("/api/v1/workflow/builtin", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = Array.isArray(err?.detail)
          ? err.detail.map((e: any) => e.msg || e.message).join(", ")
          : (typeof err?.detail === "string" ? err.detail : (err?.message || "Failed to create built-in agent"));
        throw new Error(msg);
      }

      toast.success(`Platform AI Caller "${name}" created and published!`);
      setCreateModalOpen(false);
      // Reset form
      setName("");
      setDescription("");
      setFirstMessage("");
      setSystemPrompt("");
      setVariables([{ key: "client_name", label: "Client Name", type: "text", placeholder: "e.g. Aarav Sharma" }]);
      fetchAgents();
    } catch (err: any) {
      toast.error(err?.message || "Error creating agent");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Workspace Picker (Option B)
  const handleOpenWorkspacePicker = async () => {
    try {
      setWorkspaceModalOpen(true);
      setSelectedWorkspaceAgent(null);
      setLoadingWorkspace(true);
      const headers = await getHeaders(false);
      const res = await fetch("/api/v1/workflow/fetch?status=active", {
        headers,
        cache: "no-store",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        const list: WorkspaceWorkflow[] = Array.isArray(data) ? data : data?.data || [];
        const existingBuiltinIds = new Set(agents.map((a) => a.id));
        setWorkspaceAgents(list.filter((w) => !existingBuiltinIds.has(w.id)));
      } else {
        toast.error("Failed to load workspace agents");
      }
    } catch {
      toast.error("Failed to load workspace agents");
    } finally {
      setLoadingWorkspace(false);
    }
  };

  const handleSelectWorkspaceWorkflow = (workflow: WorkspaceWorkflow) => {
    setSelectedWorkspaceAgent(workflow);
    setPublishCategory("Sales & Outreach");
    setPublishBadge("Official Template");
    setPublishDescription(workflow.description || `Platform certified ${workflow.name} voice agent.`);
    setPublishGoal("Verified conversion pipeline");
  };

  const handlePublishWorkspaceWorkflow = async () => {
    if (!selectedWorkspaceAgent) return;
    try {
      setPublishingWorkspace(true);
      const headers = await getHeaders(true);
      const res = await fetch(`/api/v1/workflow/${selectedWorkspaceAgent.id}/publish-builtin`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          category: publishCategory,
          badge: publishBadge,
          description: publishDescription.trim() || selectedWorkspaceAgent.name,
          confirm_tested: true,
          variables: [],
          conversion_goal: { goal: publishGoal },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = Array.isArray(err?.detail)
          ? err.detail.map((e: any) => e.msg || e.message).join(", ")
          : (typeof err?.detail === "string" ? err.detail : (err?.message || "Failed to publish agent to platform catalog"));
        throw new Error(msg);
      }

      toast.success(`"${selectedWorkspaceAgent.name}" successfully published as Platform Built-in Agent!`);
      setWorkspaceModalOpen(false);
      setSelectedWorkspaceAgent(null);
      fetchAgents();
    } catch (err: any) {
      toast.error(err?.message || "Error publishing agent");
    } finally {
      setPublishingWorkspace(false);
    }
  };

  const handleUnpublishAgent = async (id: number, agentName: string) => {
    if (!confirm(`Are you sure you want to unpublish "${agentName}" from platform templates? It will remain as an active workflow.`)) {
      return;
    }
    try {
      const headers = await getHeaders(false);
      const res = await fetch(`/api/v1/workflow/${id}/unpublish-builtin`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      if (res.ok) {
        toast.success(`Agent "${agentName}" unpublished from platform catalog`);
        fetchAgents();
      } else {
        toast.error("Failed to unpublish agent");
      }
    } catch {
      toast.error("Error unpublishing agent");
    }
  };

  const handleDeleteAgent = async (id: number, agentName: string) => {
    if (!confirm(`Are you sure you want to permanently delete AI Caller "${agentName}"?`)) return;
    try {
      const headers = await getHeaders(false);
      const res = await fetch(`/api/v1/workflow/builtin/${id}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      if (res.ok) {
        toast.success(`Agent "${agentName}" deleted`);
        fetchAgents();
      } else {
        toast.error("Failed to delete agent");
      }
    } catch {
      toast.error("Error deleting agent");
    }
  };

  const handleMarkTested = async (id: number, agentName: string) => {
    try {
      const headers = await getHeaders(false);
      const res = await fetch(`/api/v1/workflow/${id}/mark-tested`, {
        method: "POST",
        headers,
        credentials: "include",
      });
      if (res.ok) {
        toast.success(`Agent "${agentName}" verified and marked as tested`);
        fetchAgents();
      } else {
        toast.error("Failed to mark agent as tested");
      }
    } catch {
      toast.error("Error updating agent status");
    }
  };

  const handleTestCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone || !testingAgent) return;
    setTestingCall(true);
    try {
      const matched = inventoryNumbers.find((n) => n.phone_number === selectedFromNumber);
      const fromNum = selectedFromNumber || (inventoryNumbers[0]?.phone_number ?? undefined);

      const headers = await getHeaders(true);
      const res = await fetch("/api/v1/campaign/test-call", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          phone_number: testPhone.trim(),
          workflow_id: testingAgent.id,
          from_phone_number: fromNum,
          telephony_configuration_id: matched?.telephony_configuration_id,
          from_phone_number_id: matched?.id,
        }),
      });
      if (res.ok) {
        toast.success(`Live test call initiated to ${testPhone} from ${fromNum || "platform line"}!`);
        setTestModalOpen(false);
        setTestPhone("");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.detail || "Failed to trigger test call");
      }
    } catch {
      toast.error("Error triggering test call");
    } finally {
      setTestingCall(false);
    }
  };

  // Filtered Agents
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesCategory = selectedCategory === "All" || agent.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        agent.name.toLowerCase().includes(q) ||
        (agent.description && agent.description.toLowerCase().includes(q)) ||
        agent.category.toLowerCase().includes(q) ||
        (agent.badge && agent.badge.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [agents, selectedCategory, searchQuery]);

  // Aggregate Stats
  const totalCallers = agents.length;
  const verifiedCount = agents.filter((a) => a.tested_by_admin).length;
  const uniqueCategories = new Set(agents.map((a) => a.category)).size;
  const totalVariables = agents.reduce((acc, a) => acc + (a.variables?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-xs">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Platform AI Callers &amp; Templates</h1>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-mono">
                SUPERADMIN
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Create, test, verify, and publish official AI voice callers. Published callers appear immediately across Callio landing showcase, callers catalog, and campaign wizard.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchAgents} disabled={loading} className="h-9">
            <RotateCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {/* Option B: Publish from Workspace */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenWorkspacePicker}
            className="h-9 gap-1.5 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
          >
            <Layers className="h-4 w-4 text-indigo-400" />
            Publish from Workspace
          </Button>

          {/* Option A: Quick Create & Publish */}
          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="h-9 bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Create New AI Caller
          </Button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="bg-card/40 border-border/60 p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total AI Callers</span>
            <Bot className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight mt-1 text-foreground">{totalCallers}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Official platform templates</div>
        </Card>

        <Card className="bg-card/40 border-border/60 p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Active Categories</span>
            <Tag className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight mt-1 text-foreground">{uniqueCategories}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Industry specific workflows</div>
        </Card>

        <Card className="bg-card/40 border-border/60 p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Admin Verified</span>
            <CheckCircle2 className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight mt-1 text-foreground">{verifiedCount}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Tested before publishing</div>
        </Card>

        <Card className="bg-card/40 border-border/60 p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Dynamic Variables</span>
            <Code className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight mt-1 text-foreground">{totalVariables}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Lead &amp; campaign fields</div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-xs font-semibold"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search callers by name, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-muted/30 border-border/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* AI Callers Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-56 bg-card/40 border-border/40" />
          ))}
        </div>
      ) : filteredAgents.length === 0 ? (
        <Card className="border-dashed border-border/80 p-12 text-center bg-card/20">
          <Bot className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-semibold">No AI Callers Found</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1 mb-5">
            {searchQuery || selectedCategory !== "All"
              ? "No callers match your current search or category filter. Try clearing filters."
              : "No platform AI callers have been published yet. Use 'Create New AI Caller' or 'Publish from Workspace' above to add your first template."}
          </p>
          <div className="flex items-center justify-center gap-2">
            {(searchQuery || selectedCategory !== "All") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </Button>
            )}
            <Button
              onClick={() => setCreateModalOpen(true)}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Create AI Caller
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAgents.map((agent) => (
            <Card
              key={agent.id}
              className="relative flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-xs bg-card/60"
            >
              <CardHeader className="pb-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-semibold text-indigo-400 border-indigo-500/30 bg-indigo-500/10"
                  >
                    {agent.category || "General"}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    {agent.tested_by_admin ? (
                      <span
                        className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md"
                        title="Verified & tested by superadmin"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkTested(agent.id, agent.name)}
                        className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-md hover:bg-amber-500/20 transition-colors"
                        title="Click to mark tested"
                      >
                        <AlertCircle className="h-3 w-3" />
                        Mark Tested
                      </button>
                    )}
                    <Badge variant="secondary" className="text-[10px] font-medium shrink-0">
                      {agent.badge || "Template"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <CardTitle className="text-base font-bold text-foreground">{agent.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2 mt-1">
                    {agent.description || "Voice calling assistant configured for outbound outreach."}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pb-3 text-xs">
                {/* Greeting / First Message */}
                {agent.first_message && (
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                    <span className="font-semibold text-muted-foreground text-[10px] uppercase block mb-1">
                      First Message (Greeting):
                    </span>
                    <p className="text-xs italic line-clamp-2 text-foreground/90">&quot;{agent.first_message}&quot;</p>
                  </div>
                )}

                {/* Voice & Language Info */}
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3 text-indigo-400" />
                    <span>{agent.language || "en-IN"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mic className="h-3 w-3 text-indigo-400" />
                    <span className="truncate max-w-[120px]">{agent.voice_id || "Default Voice"}</span>
                  </div>
                </div>

                {/* Dynamic Variables Badge List */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1.5">
                    <div className="flex items-center gap-1">
                      <Code className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Dynamic Lead Variables ({agent.variables?.length || 0}):</span>
                    </div>
                  </div>
                  {agent.variables && agent.variables.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {agent.variables.map((v) => (
                        <span
                          key={v.key || v.name}
                          className="px-2 py-0.5 rounded-md bg-secondary/80 text-[10px] font-mono text-foreground border border-border/70"
                        >
                          {`{{${v.key || v.name}}}`}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-muted-foreground italic">No variables required</span>
                  )}
                </div>
              </CardContent>

              {/* Action Buttons */}
              <div className="px-5 py-3 border-t border-border/60 bg-muted/10 flex items-center justify-between rounded-b-xl gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5 bg-background/80 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30"
                  onClick={() => {
                    setTestingAgent(agent);
                    setTestModalOpen(true);
                  }}
                >
                  <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                  Test Call
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => handleUnpublishAgent(agent.id, agent.name)}
                    title="Remove from platform built-in catalog"
                  >
                    Unpublish
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteAgent(agent.id, agent.name)}
                    title="Delete permanently"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL 1: Create New Platform AI Caller */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[88vh] flex flex-col p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-3 border-b shrink-0 bg-muted/10">
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Bot className="h-5 w-5 text-indigo-500" />
              Create &amp; Publish Platform AI Caller
            </DialogTitle>
            <DialogDescription>
              Configure caller prompt, greeting, and campaign lead variables. Published callers will appear on the Callio Landing Page and Caller Directory.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAgent} className="flex-1 flex flex-col overflow-hidden">
            <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="agent-name">Caller Name *</Label>
                  <Input
                    id="agent-name"
                    placeholder="e.g. Real Estate Property Pitcher"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.filter((c) => c !== "All").map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="badge">Badge</Label>
                  <Select value={badge} onValueChange={setBadge}>
                    <SelectTrigger id="badge">
                      <SelectValue placeholder="Badge" />
                    </SelectTrigger>
                    <SelectContent>
                      {BADGE_OPTIONS.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-IN">English (India)</SelectItem>
                      <SelectItem value="hi-IN">Hindi (India)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="voicePreset">Voice Persona</Label>
                  <Select value={voicePreset} onValueChange={setVoicePreset}>
                    <SelectTrigger id="voicePreset">
                      <SelectValue placeholder="Voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {VOICE_PRESETS.map((vp) => (
                        <SelectItem key={vp.id} value={vp.id}>
                          {vp.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {voicePreset === "custom" && (
                <div className="space-y-1.5">
                  <Label htmlFor="customVoice">Custom Voice ID / Cartesia / ElevenLabs Voice ID</Label>
                  <Input
                    id="customVoice"
                    placeholder="e.g. 21m00Tcm4TlvDq8ikWAM or cartesia voice uuid"
                    value={customVoiceId}
                    onChange={(e) => setCustomVoiceId(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="desc">Caller Description</Label>
                <Input
                  id="desc"
                  placeholder="Short summary of what this caller accomplishes for the business..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="conversionGoal">Conversion Goal</Label>
                <Input
                  id="conversionGoal"
                  placeholder="e.g. Book appointment, qualify budget, answer FAQs"
                  value={conversionGoal}
                  onChange={(e) => setConversionGoal(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="first-msg">First Message (Greeting)</Label>
                <Input
                  id="first-msg"
                  placeholder="e.g. Hello! I am calling from UrbanNest. Am I speaking with {{client_name}}?"
                  value={firstMessage}
                  onChange={(e) => setFirstMessage(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  Variables wrapped in <code>{`{{variable_name}}`}</code> will dynamically populate from leads during campaigns.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prompt">System Prompt / Instructions</Label>
                <Textarea
                  id="prompt"
                  rows={4}
                  placeholder="You are an AI sales assistant. Introduce the property {{property_name}} located in {{location}} with price {{budget}}..."
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                />
              </div>

              {/* Dynamic Variables Section */}
              <div className="space-y-2.5 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold">Dynamic Lead Variables / Campaign Fields</Label>
                    <p className="text-xs text-muted-foreground">
                      Users will configure these variables when running campaigns with this caller.
                    </p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={addVariable}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Field
                  </Button>
                </div>

                <div className="space-y-2">
                  {variables.map((v, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-muted/30 p-2.5 rounded-lg border border-border/60 items-center"
                    >
                      <div className="sm:col-span-3">
                        <Input
                          placeholder="key (e.g. budget)"
                          value={v.key}
                          onChange={(e) => updateVariable(idx, { key: e.target.value })}
                          className="h-8 text-xs font-mono w-full"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <Input
                          placeholder="Label (e.g. Budget)"
                          value={v.label}
                          onChange={(e) => updateVariable(idx, { label: e.target.value })}
                          className="h-8 text-xs w-full"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <Select
                          value={v.type}
                          onValueChange={(val) => updateVariable(idx, { type: val })}
                        >
                          <SelectTrigger className="h-8 text-xs w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="sm:col-span-2">
                        <Input
                          placeholder="Placeholder"
                          value={v.placeholder || ""}
                          onChange={(e) => updateVariable(idx, { placeholder: e.target.value })}
                          className="h-8 text-xs w-full"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeVariable(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="px-6 py-3 border-t bg-muted/10 shrink-0 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                {submitting ? "Publishing..." : "Create & Publish AI Caller"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Publish from Existing Workspace Agents (Option B) */}
      <Dialog open={workspaceModalOpen} onOpenChange={setWorkspaceModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-3 border-b shrink-0 bg-muted/10">
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Layers className="h-5 w-5 text-indigo-500" />
              Publish from Workspace Agents
            </DialogTitle>
            <DialogDescription>
              Select an agent designed in your Studio / Workflows canvas and publish it as an official platform template.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto px-6 py-4 flex-1 space-y-4">
            {loadingWorkspace ? (
              <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">
                Loading your workspace workflows...
              </div>
            ) : workspaceAgents.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Bot className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
                <p className="text-sm font-medium">No Unpublished Agents in Workspace</p>
                <p className="text-xs text-muted-foreground">
                  All your existing studio agents are either already published or you haven&apos;t created any yet in /workflow.
                </p>
              </div>
            ) : !selectedWorkspaceAgent ? (
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">
                  Select an agent to publish:
                </Label>
                <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                  {workspaceAgents.map((wf) => (
                    <button
                      key={wf.id}
                      type="button"
                      onClick={() => handleSelectWorkspaceWorkflow(wf)}
                      className="w-full text-left p-3 rounded-xl border border-border/70 bg-card hover:border-indigo-500/50 hover:bg-muted/40 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-foreground group-hover:text-indigo-400 transition-colors">
                          {wf.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {wf.description || "Custom workflow designed on canvas"}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-400 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-indigo-400 block">Selected Workflow:</span>
                    <span className="text-sm font-bold text-foreground">{selectedWorkspaceAgent.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-indigo-300 hover:text-indigo-200"
                    onClick={() => setSelectedWorkspaceAgent(null)}
                  >
                    Change
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="pub-cat">Category</Label>
                    <Select value={publishCategory} onValueChange={setPublishCategory}>
                      <SelectTrigger id="pub-cat">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.filter((c) => c !== "All").map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pub-badge">Badge</Label>
                    <Select value={publishBadge} onValueChange={setPublishBadge}>
                      <SelectTrigger id="pub-badge">
                        <SelectValue placeholder="Badge" />
                      </SelectTrigger>
                      <SelectContent>
                        {BADGE_OPTIONS.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pub-desc">Platform Description</Label>
                  <Input
                    id="pub-desc"
                    placeholder="Short public description for callers catalog..."
                    value={publishDescription}
                    onChange={(e) => setPublishDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pub-goal">Primary Conversion Goal</Label>
                  <Input
                    id="pub-goal"
                    placeholder="e.g. Inbound inquiry routing, live warm transfer"
                    value={publishGoal}
                    onChange={(e) => setPublishGoal(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="px-6 py-3 border-t bg-muted/10 shrink-0 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setWorkspaceModalOpen(false)}>
              Cancel
            </Button>
            {selectedWorkspaceAgent && (
              <Button
                type="button"
                disabled={publishingWorkspace}
                onClick={handlePublishWorkspaceWorkflow}
                className="bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                {publishingWorkspace ? "Publishing..." : "Publish to Platform Catalog"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Test Call Modal */}
      <Dialog open={testModalOpen} onOpenChange={setTestModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <PhoneCall className="h-5 w-5 text-emerald-400" />
              Test Call: {testingAgent?.name}
            </DialogTitle>
            <DialogDescription>
              Enter your phone number to receive a live test call and verify this AI caller before releasing to users.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleTestCall} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="from-number" className="text-xs font-medium">
                Calling From (Telephony Inventory Test Number)
              </Label>
              {inventoryNumbers.length > 0 ? (
                <Select
                  value={selectedFromNumber || inventoryNumbers[0].phone_number}
                  onValueChange={(val) => setSelectedFromNumber(val)}
                >
                  <SelectTrigger id="from-number" className="w-full text-xs">
                    <SelectValue placeholder="Select platform test number" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryNumbers.map((num) => (
                      <SelectItem key={num.id} value={num.phone_number} className="text-xs font-mono">
                        {num.phone_number} {num.provider ? `(${num.provider.toUpperCase()})` : ""} {num.label ? `— ${num.label}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2.5 rounded-lg border border-border/60 bg-muted/20 text-xs text-muted-foreground flex items-center justify-between">
                  <span>Platform Default Line: <strong className="font-mono text-foreground">+919876543210</strong></span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">Auto</Badge>
                </div>
              )}
              <p className="text-[11px] text-muted-foreground">
                Outbound Caller ID configured in your Telephony Inventory.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="test-phone" className="text-xs font-medium">Destination Phone Number (with Country Code) *</Label>
              <Input
                id="test-phone"
                placeholder="+919876543210"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                required
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Enter the mobile/landline number you want to receive this AI agent's test call on.
              </p>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setTestModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={testingCall} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
                <PhoneCall className="h-4 w-4" />
                {testingCall ? "Initiating Call..." : "Dial Test Call"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
