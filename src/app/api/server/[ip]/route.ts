// src/app/api/server/[ip]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ip: string }> }
) {
  const { ip } = await params;
  const port = req.nextUrl.searchParams.get("port") ?? "25565";

  const supabase = createAdminClient();

  // Find server by IP
  const { data: server } = await supabase
    .from("servers")
    .select("id")
    .eq("ip", ip)
    .maybeSingle();

  if (!server) {
    return NextResponse.json({ error: "Server not found" }, { status: 404 });
  }

  // Get cached status
  const { data: status } = await supabase
    .from("server_status")
    .select("*")
    .eq("server_id", server.id)
    .maybeSingle();

  if (!status) {
    return NextResponse.json({ status: null });
  }

  // Check if stale (older than 10 minutes)
  const lastChecked = new Date(status.last_checked);
  const now = new Date();
  const isStale = now.getTime() - lastChecked.getTime() > 10 * 60 * 1000;

  return NextResponse.json({
    status: {
      status: status.status,
      latency_ms: status.latency_ms,
      player_count: status.player_count,
      max_players: status.max_players,
    },
    stale: isStale,
  });
}
