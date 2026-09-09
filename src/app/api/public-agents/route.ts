import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { PublicAgent } from "@/config/publicAgents";

const DATA_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "config",
  "publicAgentsData.json"
);

async function getAgentsFromFile(): Promise<PublicAgent[]> {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveAgentsToFile(agents: PublicAgent[]): Promise<void> {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(agents, null, 2), "utf-8");
}

export async function GET() {
  try {
    const agents = await getAgentsFromFile();
    return NextResponse.json({ success: true, agents });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to read public agents" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.name) {
      return NextResponse.json(
        { success: false, error: "Agent name is required" },
        { status: 400 }
      );
    }

    const agents = await getAgentsFromFile();

    const slugId =
      body.id ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newAgent: PublicAgent = {
      id: slugId,
      workflow_uuid: body.workflow_uuid || `wf_${slugId}_${Date.now().toString().slice(-4)}`,
      name: body.name.trim(),
      tagline: body.tagline || `${body.name} - Automated Voice Assistant`,
      role: body.role || "Automated voice representative",
      category: body.category || "Sales & Inbound",
      avatar:
        body.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      voice_name: body.voice_name || "Sarah (ElevenLabs)",
      voice_accent: body.voice_accent || "Natural American",
      latency: body.latency || "~320ms",
      did_id: Number(body.did_id) || 1,
      greeting_preview:
        body.greeting_preview ||
        `Hello! Thank you for calling. My name is ${body.name}, how can I help you today?`,
      sample_topics: Array.isArray(body.sample_topics)
        ? body.sample_topics
        : ["Product Information", "General Inquiries", "Service Booking"],
      skills: Array.isArray(body.skills)
        ? body.skills
        : ["Sub-350ms Voice", "Natural Dialog", "Smart Routing"],
      success_rate: body.success_rate || "95%",
      template_id: body.template_id || "ai_receptionist",
    };

    // Check if updating existing or adding new
    const existingIndex = agents.findIndex((a) => a.id === newAgent.id);
    if (existingIndex >= 0) {
      agents[existingIndex] = { ...agents[existingIndex], ...newAgent };
    } else {
      agents.push(newAgent);
    }

    await saveAgentsToFile(agents);
    return NextResponse.json({ success: true, agent: newAgent, agents });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to save public agent" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Agent ID is required for deletion" },
        { status: 400 }
      );
    }

    let agents = await getAgentsFromFile();
    const initialCount = agents.length;
    agents = agents.filter((a) => a.id !== id);

    if (agents.length === initialCount) {
      return NextResponse.json(
        { success: false, error: `Agent with ID '${id}' not found` },
        { status: 404 }
      );
    }

    await saveAgentsToFile(agents);
    return NextResponse.json({ success: true, message: `Agent '${id}' removed`, agents });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to delete agent" },
      { status: 500 }
    );
  }
}
