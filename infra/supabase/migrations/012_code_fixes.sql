/*
====================================================
THE ARGENT ORDER
MIGRATION 012: CODE COMPATIBILITY FIXES
Version: 1.0
====================================================

This migration adds compatibility aliases and views to support
the existing bot code that uses incorrect column names.

The bot code uses:
- total_score (should be overall_score)
- community_score (should be brotherhood_score)
- level_order (should be order_index)

====================================================
*/

----------------------------------------------------
-- PHASE 1: ADD ALIAS COLUMNS FOR COMPATIBILITY
----------------------------------------------------

-- Add compatibility columns to formation_scores
alter table formation_scores add column if not exists total_score int generated always as (overall_score) stored;
alter table formation_scores add column if not exists community_score int generated always as (brotherhood_score) stored;

-- Note: We use generated columns to maintain consistency
-- The bot code will work without changes, and we can fix it later

----------------------------------------------------
-- PHASE 2: ADD ORDER_INDEX ALIAS
----------------------------------------------------

-- Add compatibility column for level_order -> order_index
-- This requires a view since we can't add generated column to a joined table

-- View for formation levels with compatibility column name
create or replace view formation_levels_compat as
select 
  id,
  name,
  description,
  order_index,
  order_index as level_order
from formation_levels;

----------------------------------------------------
-- PHASE 3: ENSURE POD QUERIES WORK
----------------------------------------------------

-- Create view that properly filters active pod members
create or replace view active_pod_members as
select 
  pm.id,
  pm.pod_id,
  pm.user_id,
  pm.joined_at,
  pm.role,
  p.name as pod_name,
  p.captain_id,
  pr.display_name,
  pr.avatar_url
from pod_members pm
join pods p on pm.pod_id = p.id
join profiles pr on pm.user_id = pr.user_id
where pm.left_at is null;

-- Grant access
grant select on active_pod_members to authenticated;

----------------------------------------------------
-- PHASE 4: FIX LEADERSHIP VIEW
----------------------------------------------------

-- Create view for leadership command compatibility
create or replace view leadership_compat as
select 
  p.user_id,
  p.display_name,
  r.name as rank_name,
  r.order_index as rank_order,
  fl.name as formation_level,
  fl.order_index as level_order,
  fs.faith_score,
  fs.discipline_score,
  fs.brotherhood_score,
  fs.building_score,
  fs.truth_score,
  fs.overall_score,
  fs.overall_score as total_score,
  fs.brotherhood_score as community_score
from profiles p
left join user_ranks ur on p.user_id = ur.user_id
left join ranks r on ur.rank_id = r.id
left join user_formation_levels ufl on p.user_id = ufl.user_id
left join formation_levels fl on ufl.formation_level_id = fl.id
left join formation_scores fs on p.user_id = fs.user_id;

grant select on leadership_compat to authenticated;

----------------------------------------------------
-- MIGRATION COMPLETE
----------------------------------------------------

/*
This migration adds:
1. Generated columns for column name compatibility
2. Views with correct column names for bot queries
3. Active pod members view with proper filtering

Note: The generated columns (total_score, community_score) are computed
from the correct columns (overall_score, brotherhood_score) and don't
take additional storage due to PostgreSQL's storage optimization.
*/
