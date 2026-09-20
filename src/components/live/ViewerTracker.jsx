import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { useApp } from '../../context/AppContext';

const HEARTBEAT_MS = 20000;

// Calls the same Supabase RPCs the admin dashboard (admin/analytics.html) reads from:
// get_or_create_stream_session -> join_stream_session -> heartbeat_stream_viewer -> leave_stream_session
function rpc(fn, body, { keepalive = false } = {}) {
  return fetch(`${supabase.supabaseUrl}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    keepalive,
    headers: {
      'Content-Type': 'application/json',
      apikey: supabase.supabaseKey,
      Authorization: `Bearer ${supabase.supabaseKey}`,
    },
    body: JSON.stringify(body),
  }).then(async (res) => {
    if (!res.ok) throw new Error(`Supabase RPC ${fn} failed: ${res.status}`);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  });
}

export default function ViewerTracker({ isLive }) {
  const { stream } = useApp();
  const title = stream?.heading || 'Live Stream';
  const [viewerCount, setViewerCount] = useState(null);

  useEffect(() => {
    if (!isLive) return;

    let cancelled = false;
    let sessionId = null;
    let viewerId = null;
    let heartbeatTimer = null;

    const join = async () => {
      if (viewerId != null || cancelled) return;
      try {
        if (sessionId == null) {
          sessionId = await rpc('get_or_create_stream_session', { p_title: title });
        }
        const name = localStorage.getItem('top_chat_name') || null;
        const id = await rpc('join_stream_session', {
          p_session_id: sessionId,
          p_name: name,
          p_group_size: 1,
        });
        if (cancelled) {
          rpc('leave_stream_session', { p_viewer_id: id }, { keepalive: true }).catch(() => {});
          return;
        }
        viewerId = id;
      } catch (err) {
        console.warn('Stream viewer tracking unavailable (non-blocking):', err);
      }
    };

    const leave = () => {
      if (viewerId == null) return;
      const id = viewerId;
      viewerId = null;
      rpc('leave_stream_session', { p_viewer_id: id }, { keepalive: true }).catch(() => {});
    };

    const refreshCount = async () => {
      if (sessionId == null) return;
      try {
        const count = await rpc('get_stream_viewer_count', { p_session_id: sessionId });
        // Only show a real number; if the function isn't available, the badge stays hidden.
        if (typeof count === 'number') setViewerCount(Math.max(1, count));
      } catch {
        /* non-blocking */
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') leave();
      else join(); // came back to the tab: register again so the admin counts them
    };

    join().then(refreshCount);

    heartbeatTimer = setInterval(() => {
      if (viewerId != null) rpc('heartbeat_stream_viewer', { p_viewer_id: viewerId }).catch(() => {});
      refreshCount();
    }, HEARTBEAT_MS);

    window.addEventListener('pagehide', leave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      clearInterval(heartbeatTimer);
      window.removeEventListener('pagehide', leave);
      document.removeEventListener('visibilitychange', onVisibility);
      leave();
    };
  }, [isLive, title]);

  if (!isLive || viewerCount == null) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </span>
      <Users className="w-3.5 h-3.5 text-red-400" />
      <span>{viewerCount.toLocaleString()} Watching</span>
    </div>
  );
}
