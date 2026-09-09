import { redirect } from 'next/navigation';

/**
 * UX Consolidation:
 * Redirect /demo to /ai-voice-agents to maintain a single, high-converting,
 * authoritative Voice Agent Directory with live call testing and 1-click import.
 */
export default function DemoPage() {
  redirect('/ai-voice-agents');
}
