/**
 * useAgentMemory — wired to /semantic/* backend endpoints.
 * Stores and retrieves agent conversation context via pgvector similarity search.
 */

const BACKEND_URL = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:8000';

async function getAuthHeader() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const url = import.meta.env?.VITE_SUPABASE_URL;
    const key = import.meta.env?.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return {};
    const sb = createClient(url, key);
    const { data } = await sb.auth.getSession();
    const token = data?.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export function useAgentMemory({ tenantId, agentId, domain = 'general' } = {}) {
  const loadMemory = async (query) => {
    if (!query) return { contextString: '', memories: [] };
    try {
      const headers = await getAuthHeader();
      const res = await fetch(`${BACKEND_URL}/semantic/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({
          query,
          entity_type: `agent_${domain}`,
          limit: 5,
          similarity_threshold: 0.65,
        }),
      });
      if (!res.ok) return { contextString: '', memories: [] };
      const memories = await res.json();
      const contextString = memories.map(m => m.content).join('\n\n');
      return { contextString, memories };
    } catch {
      return { contextString: '', memories: [] };
    }
  };

  const saveMemory = async (content, metadata = {}) => {
    if (!content) return null;
    try {
      const headers = await getAuthHeader();
      const res = await fetch(`${BACKEND_URL}/semantic/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({
          entity_type: `agent_${domain}`,
          entity_id: agentId || null,
          content,
          metadata: { tenantId, agentId, domain, ...metadata },
        }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const logEvent = async (eventType, content, metadata = {}) => {
    return saveMemory(content, { eventType, ...metadata });
  };

  return { loadMemory, saveMemory, logEvent };
}
