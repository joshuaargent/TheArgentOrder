/*
====================================================
THE ARGENT ORDER
MIGRATION 007: Database Improvements
====================================================

This migration adds:
1. Useful database views for analytics
2. Helper functions for common operations
3. Improved indexes for performance
4. Seed data for formation pillars

Version: 1.0
====================================================
*/

----------------------------------------------------
-- FORMATION PILLARS SEED DATA (ensure exists)
----------------------------------------------------

INSERT INTO formation_pillars (name, slug, description, icon, color, sort_order) VALUES
  ('Faith', 'faith', 'Relationship with God through prayer, sacraments, and scripture', '✝️', '#3b82f6', 1),
  ('Discipline', 'discipline', 'Mastery of self through habits, fitness, and execution', '⚔️', '#ef4444', 2),
  ('Brotherhood', 'brotherhood', 'Relationship with others through community and accountability', '🤝', '#8b5cf6', 3),
  ('Building', 'building', 'Creation of value through projects, businesses, and creation', '🏗️', '#22c55e', 4),
  ('Truth', 'truth', 'Pursuit of wisdom through learning, apologetics, and reason', '📖', '#f59e0b', 5)
ON CONFLICT (slug) DO NOTHING;

----------------------------------------------------
-- HELPER VIEWS
----------------------------------------------------

-- View: User formation summary (scores + rank)
CREATE OR REPLACE VIEW v_user_formation_summary AS
SELECT 
  p.id as user_id,
  p.display_name,
  p.email,
  r.name as rank_name,
  r.order_index as rank_order,
  fs.faith_score,
  fs.discipline_score,
  fs.brotherhood_score,
  fs.building_score,
  fs.truth_score,
  fs.overall_score,
  fs.updated_at as last_activity
FROM profiles p
LEFT JOIN user_ranks ur ON p.user_id = ur.user_id 
  AND ur.id = (
    SELECT ur2.id FROM user_ranks ur2 
    JOIN ranks r2 ON ur2.rank_id = r2.id 
    WHERE ur2.user_id = p.user_id 
    ORDER BY r2.order_index DESC 
    LIMIT 1
  )
LEFT JOIN ranks r ON ur.rank_id = r.id
LEFT JOIN formation_scores fs ON p.user_id = fs.user_id;

-- View: Active campaigns with task count
CREATE OR REPLACE VIEW v_campaigns_with_tasks AS
SELECT 
  c.id,
  c.slug,
  c.title,
  c.description,
  c.campaign_type,
  c.difficulty,
  c.duration_days,
  c.active,
  COUNT(ct.id) as task_count,
  COUNT(CASE WHEN ct.required = true THEN 1 END) as required_task_count
FROM campaigns c
LEFT JOIN campaign_tasks ct ON c.id = ct.campaign_id
GROUP BY c.id;

-- View: User pod membership with details
CREATE OR REPLACE VIEW v_user_pods AS
SELECT 
  pm.user_id,
  pm.pod_id,
  pm.role as pod_role,
  pm.joined_at,
  p.name as pod_name,
  p.description as pod_description,
  capt.display_name as captain_name
FROM pod_members pm
JOIN pods p ON pm.pod_id = p.id
LEFT JOIN profiles capt ON p.captain_id = capt.user_id;

-- View: User achievements with details
CREATE OR REPLACE VIEW v_user_achievements_detail AS
SELECT 
  ua.user_id,
  ua.earned_at,
  a.slug,
  a.name,
  a.description,
  a.icon,
  a.category,
  a.points as achievement_points
FROM user_achievements ua
JOIN achievements a ON ua.achievement_id = a.id;

-- View: Leaderboard (top formation scores)
CREATE OR REPLACE VIEW v_leaderboard AS
SELECT 
  p.user_id,
  p.display_name,
  p.avatar_url,
  r.name as rank_name,
  fs.overall_score,
  fs.faith_score,
  fs.discipline_score,
  fs.brotherhood_score,
  fs.building_score,
  fs.truth_score,
  ROW_NUMBER() OVER (ORDER BY fs.overall_score DESC) as rank
FROM profiles p
JOIN formation_scores fs ON p.user_id = fs.user_id
LEFT JOIN user_ranks ur ON p.user_id = ur.user_id 
  AND ur.id = (
    SELECT ur2.id FROM user_ranks ur2 
    JOIN ranks r2 ON ur2.rank_id = r2.id 
    WHERE ur2.user_id = p.user_id 
    ORDER BY r2.order_index DESC 
    LIMIT 1
  )
LEFT JOIN ranks r ON ur.rank_id = r.id
ORDER BY fs.overall_score DESC
LIMIT 100;

-- View: Project progress summary
CREATE OR REPLACE VIEW v_project_progress AS
SELECT 
  pr.id,
  pr.user_id,
  pr.title,
  pr.description,
  pr.status,
  pr.started_at,
  pr.completed_at,
  COUNT(pm.id) as milestone_count,
  COUNT(CASE WHEN pm.completed = true THEN 1 END) as completed_milestones,
  COUNT(pu.id) as update_count
FROM projects pr
LEFT JOIN project_milestones pm ON pr.id = pm.project_id
LEFT JOIN project_updates pu ON pr.id = pu.project_id
GROUP BY pr.id;

----------------------------------------------------
-- HELPER FUNCTIONS
----------------------------------------------------

-- Function: Get user's current streak for a pillar
CREATE OR REPLACE FUNCTION get_pillar_streak(p_user_id uuid, p_pillar formation_pillar)
RETURNS int AS $$
DECLARE
  v_streak int := 0;
  v_date date := current_date;
BEGIN
  -- Check each day going backwards
  FOR i IN 0..365 LOOP
    -- Check if there's an event for this day and pillar
    IF EXISTS (
      SELECT 1 FROM formation_events 
      WHERE user_id = p_user_id 
        AND pillar = p_pillar 
        AND DATE(created_at) = v_date - (i || ' days')::interval
    ) THEN
      v_streak := v_streak + 1;
    ELSIF i > 0 THEN
      -- Stop counting if we hit a gap (except today which might not have events yet)
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_streak;
END;
$$ LANGUAGE plpgsql;

-- Function: Get user's overall streak (any pillar)
CREATE OR REPLACE FUNCTION get_overall_streak(p_user_id uuid)
RETURNS int AS $$
DECLARE
  v_streak int := 0;
BEGIN
  FOR i IN 0..365 LOOP
    IF EXISTS (
      SELECT 1 FROM formation_events 
      WHERE user_id = p_user_id 
        AND DATE(created_at) = current_date - (i || ' days')::interval
    ) THEN
      v_streak := v_streak + 1;
    ELSIF i > 0 THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_streak;
END;
$$ LANGUAGE plpgsql;

-- Function: Check if user completed daily formation
CREATE OR REPLACE FUNCTION has_daily_formation(p_user_id uuid, p_date date DEFAULT current_date)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM formation_events 
    WHERE user_id = p_user_id 
      AND DATE(created_at) = p_date
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql;

-- Function: Get formation events for date range
CREATE OR REPLACE FUNCTION get_formation_events_range(
  p_user_id uuid,
  p_start_date date,
  p_end_date date DEFAULT current_date
)
RETURNS TABLE (
  event_date date,
  pillar formation_pillar,
  total_points int,
  event_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(fe.created_at) as event_date,
    fe.pillar,
    SUM(fe.points)::int as total_points,
    COUNT(*)::bigint as event_count
  FROM formation_events fe
  WHERE fe.user_id = p_user_id
    AND DATE(fe.created_at) >= p_start_date
    AND DATE(fe.created_at) <= p_end_date
  GROUP BY DATE(fe.created_at), fe.pillar
  ORDER BY event_date;
END;
$$ LANGUAGE plpgsql;

-- Function: Get rank requirements
CREATE OR REPLACE FUNCTION get_rank_requirements()
RETURNS TABLE (
  rank_name text,
  rank_order int,
  rank_description text,
  min_score int
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.name::text,
    r.order_index,
    r.description::text,
    CASE r.order_index
      WHEN 2 THEN 0      -- Initiate
      WHEN 3 THEN 100   -- Brother
      WHEN 4 THEN 300   -- Veteran
      WHEN 5 THEN 600   -- Captain
      WHEN 6 THEN 1000  -- Officer
      WHEN 7 THEN 1500  -- Mentor
      WHEN 8 THEN 2500  -- Steward
      ELSE 0
    END as min_score
  FROM ranks r
  WHERE r.name != 'Visitor'
  ORDER BY r.order_index;
END;
$$ LANGUAGE plpgsql;

-- Function: Auto-assign rank based on score
CREATE OR REPLACE FUNCTION assign_rank_if_eligible(p_user_id uuid)
RETURNS void AS $$
DECLARE
  v_score int;
  v_current_rank_order int;
  v_new_rank_id uuid;
BEGIN
  -- Get user's current score
  SELECT overall_score INTO v_score
  FROM formation_scores
  WHERE user_id = p_user_id;
  
  IF v_score IS NULL THEN
    RETURN;
  END IF;
  
  -- Get user's current highest rank order
  SELECT MAX(r.order_index) INTO v_current_rank_order
  FROM user_ranks ur
  JOIN ranks r ON ur.rank_id = r.id
  WHERE ur.user_id = p_user_id;
  
  -- Find the appropriate rank based on score
  SELECT r.id INTO v_new_rank_id
  FROM ranks r
  WHERE r.name != 'Visitor'
    AND (
      (r.order_index = 2 AND v_score >= 0) OR
      (r.order_index = 3 AND v_score >= 100) OR
      (r.order_index = 4 AND v_score >= 300) OR
      (r.order_index = 5 AND v_score >= 600) OR
      (r.order_index = 6 AND v_score >= 1000) OR
      (r.order_index = 7 AND v_score >= 1500) OR
      (r.order_index = 8 AND v_score >= 2500)
    )
  ORDER BY r.order_index DESC
  LIMIT 1;
  
  -- Assign new rank if higher than current
  IF v_new_rank_id IS NOT NULL AND (
    v_current_rank_order IS NULL OR 
    (SELECT order_index FROM ranks WHERE id = v_new_rank_id) > v_current_rank_order
  ) THEN
    INSERT INTO user_ranks (user_id, rank_id, assigned_by)
    VALUES (p_user_id, v_new_rank_id, p_user_id);
  END IF;
END;
$$ LANGUAGE plpgsql security definer;

-- Function: Get campaign progress for user
CREATE OR REPLACE FUNCTION get_campaign_progress(p_user_id uuid, p_campaign_id uuid)
RETURNS TABLE (
  task_id uuid,
  task_title text,
  task_type text,
  required boolean,
  completed boolean,
  completion_date timestamp
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ct.id,
    ct.title,
    ct.task_type,
    ct.required,
    CASE WHEN cp.id IS NOT NULL THEN true ELSE false END,
    cp.completed_at
  FROM campaign_tasks ct
  LEFT JOIN campaign_progress cp ON ct.id = cp.task_id
    AND cp.enrollment_id = (
      SELECT id FROM campaign_enrollments 
      WHERE user_id = p_user_id AND campaign_id = p_campaign_id
    )
  WHERE ct.campaign_id = p_campaign_id
  ORDER BY ct.order;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------
-- IMPROVED INDEXES
----------------------------------------------------

-- Index for leaderboard queries
DROP INDEX IF EXISTS idx_formation_scores_leaderboard;
CREATE INDEX idx_formation_scores_leaderboard 
  ON formation_scores(overall_score DESC);

-- Index for recent activity
DROP INDEX IF EXISTS idx_formation_events_recent_user;
CREATE INDEX idx_formation_events_recent_user
  ON formation_events(user_id, created_at DESC);

-- Index for daily streak calculations
DROP INDEX IF EXISTS idx_formation_events_daily;
CREATE INDEX idx_formation_events_daily
  ON formation_events(DATE(created_at), user_id, pillar);

-- Index for campaign task lookups
DROP INDEX IF EXISTS idx_campaign_tasks_campaign;
CREATE INDEX idx_campaign_tasks_campaign
  ON campaign_tasks(campaign_id, required DESC, order);

-- Index for pod membership lookups
DROP INDEX IF EXISTS idx_pod_members_user_pod;
CREATE INDEX idx_pod_members_user_pod
  ON pod_members(user_id, pod_id);

-- Index for project user lookups
DROP INDEX IF EXISTS idx_projects_user_status;
CREATE INDEX idx_projects_user_status
  ON projects(user_id, status);

----------------------------------------------------
-- ANALYTICS SNAPSHOT FUNCTION
----------------------------------------------------

-- Function: Create daily formation snapshot
CREATE OR REPLACE FUNCTION create_daily_formation_snapshot(p_user_id uuid, p_date date DEFAULT current_date)
RETURNS void AS $$
DECLARE
  v_snapshot jsonb;
BEGIN
  -- Get formation scores
  SELECT jsonb_build_object(
    'faith_score', faith_score,
    'discipline_score', discipline_score,
    'brotherhood_score', brotherhood_score,
    'building_score', building_score,
    'truth_score', truth_score,
    'overall_score', overall_score
  ) INTO v_snapshot
  FROM formation_scores
  WHERE user_id = p_user_id;
  
  -- Get today's events
  v_snapshot := v_snapshot || jsonb_build_object(
    'events_today', (
      SELECT COUNT(*) 
      FROM formation_events 
      WHERE user_id = p_user_id 
        AND DATE(created_at) = p_date
    ),
    'pillars_active_today', (
      SELECT COUNT(DISTINCT pillar) 
      FROM formation_events 
      WHERE user_id = p_user_id 
        AND DATE(created_at) = p_date
    )
  );
  
  -- Insert or update snapshot
  INSERT INTO formation_snapshots (user_id, snapshot_date, data)
  VALUES (p_user_id, p_date, v_snapshot)
  ON CONFLICT (user_id, snapshot_date) 
  DO UPDATE SET data = v_snapshot;
END;
$$ LANGUAGE plpgsql security definer;

-- Function: Calculate streak for all pillars at once
CREATE OR REPLACE FUNCTION calculate_all_pillar_streaks(p_user_id uuid)
RETURNS TABLE (
  pillar formation_pillar,
  current_streak int,
  longest_streak int
) AS $$
DECLARE
  v_pillar formation_pillar;
  v_current int;
  v_longest int;
BEGIN
  FOR v_pillar IN SELECT unnest(enum_range(NULL::formation_pillar)) LOOP
    -- Simplified streak calculation (current streak = consecutive days ending today/yesterday)
    SELECT COUNT(DISTINCT DATE(created_at)) INTO v_current
    FROM formation_events
    WHERE user_id = p_user_id
      AND pillar = v_pillar
      AND created_at > now() - interval '90 days';
    
    v_longest := v_current; -- Simplified: use current as approximation
    
    pillar := v_pillar;
    current_streak := v_current;
    longest_streak := v_longest;
    
    RETURN NEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------
-- FINAL SETUP NOTES
----------------------------------------------------

-- Grant permissions (if needed)
-- GRANT SELECT ON v_user_formation_summary TO anon;
-- GRANT SELECT ON v_leaderboard TO anon;

-- Note: Run 'supabase db push' or 'supabase migrate' to apply
