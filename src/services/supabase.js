import { createClient } from '@supabase/supabase-js';
import { withStableIds } from '../utils/slugify';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://huiytazoiiqrebugdbds.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1aXl0YXpvaWlxcmVidWdkYmRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMjIyODksImV4cCI6MjEwMzU5ODI4OX0.ttS6WDmfrv9I1VRNcRI7EGAmjjK9DRLM9_eiDuHcuz4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Record a video view once per browser session
 */
export async function trackVideoView(videoUrl, title = '') {
  if (!videoUrl) return;
  const sessionKey = 'top_viewed_' + videoUrl;
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, '1');

  try {
    await supabase.rpc('increment_video_view', {
      p_video_url: videoUrl,
      p_title: title
    });
  } catch (err) {
    console.warn('Video view tracking error (non-blocking):', err);
  }
}

/**
 * Submit testimony to Supabase testimonies table
 */
export async function submitTestimonyToSupabase({ fullName, zone, message }) {
  try {
    const { error } = await supabase.from('testimonies').insert([
      {
        full_name: fullName,
        zone: zone,
        message: message,
      }
    ]);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.warn('Testimony submission to Supabase error:', err);
    return { success: false, error: err };
  }
}

/**
 * Fetch written testimonies from Supabase
 */
export async function fetchWrittenTestimonies(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('testimonies')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetchWrittenTestimonies error (using fallback):', err);
    return [];
  }
}

/**
 * Submit prayer request to Supabase prayer_requests table
 */
export async function submitPrayerRequest({ name, request }) {
  try {
    const { error } = await supabase.from('prayer_requests').insert([
      { name, request }
    ]);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Prayer request submission failed:', err);
    throw err;
  }
}

/**
 * Chat messages operations
 */
export async function fetchChatMessages(limit = 30, lastId = null) {
  try {
    let query = supabase
      .from('chat_messages')
      .select('id, name, message, created_at');

    if (lastId) {
      query = query.gt('id', lastId).order('id', { ascending: true });
    } else {
      query = query.order('id', { ascending: false }).limit(limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return lastId ? data : (data || []).reverse();
  } catch (err) {
    console.warn('Chat fetch failed:', err);
    return [];
  }
}

export async function sendChatMessage({ name, message }) {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert([{ name, message }]);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Chat message send failed:', err);
    throw err;
  }
}

/**
 * ADOTOPOC: Fetch resources with fallback to local JSON
 */
export async function fetchAdotopocResources() {
  try {
    const { data, error } = await supabase
      .from('adotopoc_resources')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Fallback to local data/adotopoc.json
      const res = await fetch('/data/adotopoc.json');
      if (res.ok) {
        const json = await res.json();
        return withStableIds(json.resources || []);
      }
      return [];
    }
    return withStableIds(data);
  } catch (err) {
    console.warn('Supabase ADOTOPOC fetch error, using fallback:', err);
    try {
      const res = await fetch('/data/adotopoc.json');
      if (res.ok) {
        const json = await res.json();
        return withStableIds(json.resources || []);
      }
    } catch {}
    return [];
  }
}

/**
 * ADOTOPOC: Track resource view
 */
export async function trackAdotopocView(resourceId) {
  if (!resourceId) return;
  const key = `adotopoc_view_${resourceId}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, '1');

  const device = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  try {
    await supabase.rpc('increment_adotopoc_view', {
      p_resource_id: resourceId,
      p_device_type: device
    });
  } catch (err) {
    // Non-blocking fallback
    console.warn('ADOTOPOC view tracking failed (non-blocking):', err);
  }
}

/**
 * ADOTOPOC: Track resource download
 */
export async function trackAdotopocDownload(resourceId) {
  if (!resourceId) return;
  const device = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  try {
    await supabase.rpc('increment_adotopoc_download', {
      p_resource_id: resourceId,
      p_device_type: device
    });
  } catch (err) {
    console.warn('ADOTOPOC download tracking failed (non-blocking):', err);
  }
}
