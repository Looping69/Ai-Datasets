CREATE TABLE IF NOT EXISTS validated_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  status text NOT NULL,
  metadata jsonb,
  crawl_id text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid REFERENCES validated_links(id) ON DELETE CASCADE,
  plan_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_validated_links_url ON validated_links(url);
CREATE INDEX IF NOT EXISTS idx_validated_links_status ON validated_links(status);
CREATE INDEX IF NOT EXISTS idx_ai_plans_link_id ON ai_plans(link_id);

alter publication supabase_realtime add table validated_links;
alter publication supabase_realtime add table ai_plans;
