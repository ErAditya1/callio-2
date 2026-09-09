'use client';

import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Phone,
  Bot,
  Loader2,
  CheckCircle2,
  Shield,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PublicAgent } from '@/config/publicAgents';
import { WORKFLOW_TEMPLATES } from '@/config/workflowTemplates';
import { toast } from 'sonner';

export function SuperadminShowcaseManager() {
  const [agents, setAgents] = useState<PublicAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    role: '',
    category: 'Sales & Inbound' as PublicAgent['category'],
    voice_name: 'Sarah (ElevenLabs)',
    voice_accent: 'American • Warm',
    latency: '~320ms',
    did_id: 1,
    greeting_preview: '',
    template_id: 'sales_agent',
    workflow_uuid: '',
  });

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/public-agents');
      const data = await res.json();
      if (data?.success && Array.isArray(data.agents)) {
        setAgents(data.agents);
      }
    } catch {
      toast.error('Failed to load showcase agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Agent Name is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/public-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data?.success) {
        toast.success(`Agent "${form.name}" added to Public Showcase!`);
        setModalOpen(false);
        setForm({
          name: '',
          tagline: '',
          role: '',
          category: 'Sales & Inbound',
          voice_name: 'Sarah (ElevenLabs)',
          voice_accent: 'American • Warm',
          latency: '~320ms',
          did_id: 1,
          greeting_preview: '',
          template_id: 'sales_agent',
          workflow_uuid: '',
        });
        fetchAgents();
      } else {
        toast.error(data?.error || 'Failed to add agent');
      }
    } catch {
      toast.error('Network error creating agent');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAgent = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the public landing showcase?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/public-agents?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data?.success) {
        toast.success(`Agent "${name}" removed from showcase`);
        fetchAgents();
      } else {
        toast.error(data?.error || 'Failed to delete agent');
      }
    } catch {
      toast.error('Network error deleting agent');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-bold text-foreground">
              Public Showcase Agents (Landing UI)
            </h2>
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">
              Superadmin Dynamic
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Agents displayed on <span className="font-mono text-foreground">/ai-voice-agents</span> for live public demo testing and 1-click dashboard import. Stored dynamically in frontend API directory (no DB changes).
          </p>
        </div>

        {/* Add Agent Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-sm flex items-center gap-1.5 h-9 text-xs font-semibold">
              <Plus className="w-4 h-4" />
              Add Showcase Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-500" />
                Add New Showcase Agent
              </DialogTitle>
              <DialogDescription>
                Configure the agent details that visitors will see and interact with on the public landing page.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateAgent} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Agent Persona Name *</Label>
                <Input
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Tagline</Label>
                <Input
                  placeholder="e.g. Healthcare & Clinic Front-Desk Coordinator"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(val: any) => setForm({ ...form, category: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sales & Inbound">Sales & Inbound</SelectItem>
                      <SelectItem value="Appointment Booking">Appointment Booking</SelectItem>
                      <SelectItem value="Support & Service">Support & Service</SelectItem>
                      <SelectItem value="Real Estate & Inquiries">Real Estate & Inquiries</SelectItem>
                      <SelectItem value="Collections & Reminders">Collections & Reminders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Instantiate Template</Label>
                  <Select
                    value={form.template_id}
                    onValueChange={(val) => setForm({ ...form, template_id: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Template" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORKFLOW_TEMPLATES.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.emoji} {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Voice Name & Engine</Label>
                  <Input
                    placeholder="e.g. Priya (Cartesia) or Sarah"
                    value={form.voice_name}
                    onChange={(e) => setForm({ ...form, voice_name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Voice Accent</Label>
                  <Input
                    placeholder="e.g. Indian English / Hindi"
                    value={form.voice_accent}
                    onChange={(e) => setForm({ ...form, voice_accent: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Greeting Dialog Preview</Label>
                <Textarea
                  rows={2}
                  placeholder="e.g. Namaste! Metro Health Clinic me aapka swagat hai..."
                  value={form.greeting_preview}
                  onChange={(e) => setForm({ ...form, greeting_preview: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Telephony Workflow UUID (Optional)</Label>
                <Input
                  placeholder="e.g. wf_clinic_demo_01"
                  value={form.workflow_uuid}
                  onChange={(e) => setForm({ ...form, workflow_uuid: e.target.value })}
                />
                <p className="text-[11px] text-muted-foreground">
                  Used to route real phone test calls for this agent.
                </p>
              </div>

              <DialogFooter className="pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Add to Showcase'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Agents List Table / Cards */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          <p className="text-xs">Loading showcase agents...</p>
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm border border-dashed rounded-xl p-8">
          No showcase agents configured yet. Click "Add Showcase Agent" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => {
            const isDeleting = deletingId === agent.id;

            return (
              <div
                key={agent.id}
                className="rounded-xl border border-border/80 bg-background/50 p-4.5 flex flex-col justify-between space-y-4 hover:border-foreground/30 transition-all shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{agent.name}</span>
                        <Badge variant="outline" className="text-[10px] bg-muted/60">
                          {agent.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{agent.tagline}</p>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteAgent(agent.id, agent.name)}
                      disabled={isDeleting}
                      className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 h-8 w-8 shrink-0"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>

                  <div className="rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground border border-border/40 italic line-clamp-2">
                    "{agent.greeting_preview}"
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-indigo-400" />
                      {agent.voice_name}
                    </span>
                    <span>•</span>
                    <span>{agent.voice_accent}</span>
                    <span>•</span>
                    <span className="font-mono text-emerald-400">{agent.latency}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                      <Layers className="w-3 h-3 text-amber-400" />
                      tpl: {agent.template_id}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                  <span className="font-mono text-[10px] text-muted-foreground">ID: {agent.id}</span>
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    Live on Landing Page
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
