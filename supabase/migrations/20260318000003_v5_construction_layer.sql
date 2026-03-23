-- V5 Migration 3: Construction & BIM Layer
-- Applied: 2026-03-18

-- bim_extracts: Speckle CAD/BIM parsed data
CREATE TABLE IF NOT EXISTS public.bim_extracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  speckle_stream_id TEXT,
  object_type TEXT,
  geometry JSONB DEFAULT '{}',
  properties JSONB DEFAULT '{}',
  extracted_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bim_extracts_project_id ON public.bim_extracts(project_id);

-- workflow_tasks: Procore-synced construction task tracking
CREATE TABLE IF NOT EXISTS public.workflow_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  procore_task_id TEXT,
  title TEXT NOT NULL,
  phase TEXT,
  assignee TEXT,
  due_date DATE,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','in_progress','complete','blocked','cancelled')),
  depends_on UUID[],
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_workflow_tasks_project_id ON public.workflow_tasks(project_id);

-- site_plans: OpenSpace vision embeddings
CREATE TABLE IF NOT EXISTS public.site_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  capture_date DATE,
  image_url TEXT,
  embedding vector(1536),
  ai_summary TEXT,
  flagged_issues JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_site_plans_project_id ON public.site_plans(project_id);
