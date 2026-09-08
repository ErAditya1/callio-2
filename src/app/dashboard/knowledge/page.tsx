'use client';

import {
  BookOpen,
  CheckCircle2,
  FileText,
  Globe,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  UploadCloud
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function KnowledgeBasePage() {
  const [sources, setSources] = useState([
    {
      id: 'src-1',
      title: 'Acme Clinic Official Website',
      type: 'Website URL',
      url: 'https://acmehealth.example.com',
      status: 'Indexed',
      itemsCount: '48 pages',
      lastSynced: '2 hours ago'
    },
    {
      id: 'src-2',
      title: 'Dental Services & Pricing Guide 2026.pdf',
      type: 'PDF Document',
      url: 'Uploaded file (1.4 MB)',
      status: 'Indexed',
      itemsCount: '12 pages',
      lastSynced: 'Yesterday'
    },
    {
      id: 'src-3',
      title: 'Insurance Accepted & Copay Policies',
      type: 'FAQ Document',
      url: 'Direct Text Input',
      status: 'Indexed',
      itemsCount: '24 Q&As',
      lastSynced: 'Sep 2, 2026'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    setSources([
      ...sources,
      {
        id: `src-${Date.now()}`,
        title: newTitle,
        type: 'Website URL',
        url: newUrl || 'Custom Source',
        status: 'Indexed',
        itemsCount: 'Processing...',
        lastSynced: 'Just now'
      }
    ]);
    setShowAddModal(false);
    setNewTitle('');
    setNewUrl('');
    toast.success('Knowledge source added and indexed!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Knowledge Base
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Teach your AI voice agents about your business, clinic policies, pricing, and FAQs.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-10 px-4 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          + Add Knowledge Source
        </Button>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sources.map((src) => (
          <div
            key={src.id}
            className="rounded-3xl border border-border/80 bg-card p-6 shadow-md flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  {src.type.includes('Web') ? <Globe className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20 py-0.5">
                  ● {src.status}
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-foreground text-sm">{src.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{src.url}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{src.itemsCount}</span>
              <span>Updated {src.lastSynced}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload/Crawl Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-foreground">Add Knowledge Source</h3>
            <p className="text-xs text-muted-foreground">
              Paste your website URL or documentation. CallioAI will index it so your agents can answer caller questions accurately.
            </p>

            <form onSubmit={handleAddSource} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Source Name</label>
                <Input
                  required
                  placeholder="e.g. Clinic Services & Pricing 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Website URL or Document Link</label>
                <Input
                  placeholder="https://example.com/faq"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs">
                  Index Knowledge
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
