-- V5 Migration 1: Enable pgvector + semantic search RPC
-- Applied: 2026-03-18

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE public.intel_records ADD COLUMN IF NOT EXISTS embedding vector(1536);

CREATE OR REPLACE FUNCTION public.find_similar_actions(
  query_embedding vector(1536),
  similarity_threshold float DEFAULT 0.75,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  deal_id UUID,
  action_type TEXT,
  description TEXT,
  outcome TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    aa.id, aa.deal_id, aa.action_type, aa.description, aa.outcome,
    1 - (aa.embedding <=> query_embedding) AS similarity
  FROM public.agent_actions aa
  WHERE 1 - (aa.embedding <=> query_embedding) > similarity_threshold
  ORDER BY aa.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
