/*
====================================================
THE ARGENT ORDER
SEED DATA
Version: 1.0
====================================================

This file contains sample data for initial setup.
Run after 001_initial_schema.sql
====================================================
*/

----------------------------------------------------
-- ACHIEVEMENTS: FAITH
----------------------------------------------------

INSERT INTO achievements (slug, name, description, icon, category, points, criteria) VALUES
('first_prayer', 'First Prayer', 'Logged your first prayer', '🙏', 'faith', 10, '{"type": "count", "count": 1}'),
('prayer_streak_7', 'Week of Prayer', 'Maintained a 7-day prayer streak', '📿', 'faith', 50, '{"type": "streak", "days": 7}'),
('prayer_streak_30', 'Month of Prayer', 'Maintained a 30-day prayer streak', '🔥', 'faith', 200, '{"type": "streak", "days": 30}'),
('prayer_streak_100', 'Century of Prayer', 'Maintained a 100-day prayer streak', '⭐', 'faith', 500, '{"type": "streak", "days": 100}'),
('mass_attended_1', 'First Mass', 'Attended your first Mass through the Order', '✝️', 'faith', 25, '{"type": "count", "count": 1}'),
('mass_attended_10', 'Devoted', 'Attended 10 Masses', '🎖️', 'faith', 100, '{"type": "count", "count": 10}'),
('mass_attended_52', 'Year of Sundays', 'Attended 52 Masses', '🏆', 'faith', 500, '{"type": "count", "count": 52}'),
('confession_1', 'First Confession', 'Completed your first confession', '💒', 'faith', 25, '{"type": "count", "count": 1}'),
('rosary_1', 'First Rosary', 'Completed your first rosary', '🌹', 'faith', 25, '{"type": "count", "count": 1}'),
('scripture_30', 'Scripture Reader', 'Read scripture for 30 days', '📖', 'faith', 100, '{"type": "streak", "days": 30}'),
('faith_module_1', 'Faith Foundations', 'Completed your first faith formation module', '🎓', 'faith', 100, '{"type": "completed", "module": "faith"}');

----------------------------------------------------
-- ACHIEVEMENTS: DISCIPLINE
----------------------------------------------------

INSERT INTO achievements (slug, name, description, icon, category, points, criteria) VALUES
('first_workout', 'First Rep', 'Completed your first workout', '💪', 'discipline', 10, '{"type": "count", "count": 1}'),
('workout_streak_7', 'Week Warrior', 'Maintained a 7-day workout streak', '🔥', 'discipline', 50, '{"type": "streak", "days": 7}'),
('workout_streak_30', 'Iron Will', 'Maintained a 30-day workout streak', '🏋️', 'discipline', 200, '{"type": "streak", "days": 30}'),
('workout_streak_100', 'Unbreakable', 'Maintained a 100-day workout streak', '⚡', 'discipline', 500, '{"type": "streak", "days": 100}'),
('deep_work_1', 'Deep Diver', 'Completed your first deep work session', '🎯', 'discipline', 10, '{"type": "count", "count": 1}'),
('deep_work_10', 'Focused', 'Completed 10 deep work sessions', '📊', 'discipline', 50, '{"type": "count", "count": 10}'),
('deep_work_100', 'Master of Focus', 'Completed 100 deep work sessions', '🎖️', 'discipline', 300, '{"type": "count", "count": 100}'),
('sleep_target_7', 'Rested', 'Met your sleep target for 7 days', '😴', 'discipline', 50, '{"type": "streak", "days": 7}'),
('early_riser', 'Early Riser', 'Woke before 6am for 7 consecutive days', '🌅', 'discipline', 100, '{"type": "streak", "days": 7}'),
('digital_detox', 'Digital Discipline', 'Completed a 7-day digital detox', '📵', 'discipline', 100, '{"type": "streak", "days": 7}'),
('discipline_module_1', 'Discipline Foundations', 'Completed your first discipline formation module', '🎓', 'discipline', 100, '{"type": "completed", "module": "discipline"}');

----------------------------------------------------
-- ACHIEVEMENTS: BROTHERHOOD
----------------------------------------------------

INSERT INTO achievements (slug, name, description, icon, category, points, criteria) VALUES
('first_pod_meeting', 'Pod Initiation', 'Attended your first pod meeting', '👥', 'brotherhood', 25, '{"type": "count", "count": 1}'),
('pod_meeting_10', 'Regular Pod Member', 'Attended 10 pod meetings', '📍', 'brotherhood', 100, '{"type": "count", "count": 10}'),
('pod_meeting_52', 'Pod Dedication', 'Attended 52 pod meetings', '🏆', 'brotherhood', 500, '{"type": "count", "count": 52}'),
('first_mentorship', 'Mentor Connection', 'Started your first mentorship', '🤝', 'brotherhood', 50, '{"type": "count", "count": 1}'),
('mentor_mentee', 'Formation Guide', 'Mentored your first brother', '🌟', 'brotherhood', 100, '{"type": "count", "count": 1}'),
('brotherhood_event_1', 'Community Builder', 'Attended your first brotherhood event', '🎉', 'brotherhood', 25, '{"type": "count", "count": 1}'),
('prayer_request_1', 'Prayer Warrior', 'Submitted your first prayer request', '🙌', 'brotherhood', 10, '{"type": "count", "count": 1}'),
('support_brother', 'Brotherly Support', 'Supported another member 10 times', '❤️', 'brotherhood', 50, '{"type": "count", "count": 10}'),
('lead_pod_meeting', 'Pod Leader', 'Led your first pod meeting', '🎤', 'brotherhood', 100, '{"type": "count", "count": 1}'),
('brotherhood_module_1', 'Brotherhood Foundations', 'Completed your first brotherhood formation module', '🎓', 'brotherhood', 100, '{"type": "completed", "module": "brotherhood"}');

----------------------------------------------------
-- ACHIEVEMENTS: BUILDING
----------------------------------------------------

INSERT INTO achievements (slug, name, description, icon, category, points, criteria) VALUES
('first_project', 'Builder Begins', 'Created your first project', '🔨', 'building', 25, '{"type": "count", "count": 1}'),
('project_launched', 'First Launch', 'Launched your first project', '🚀', 'building', 100, '{"type": "count", "count": 1}'),
('project_milestone', 'Milestone Maker', 'Completed your first project milestone', '🏗️', 'building', 25, '{"type": "count", "count": 1}'),
('deep_work_hour_10', '10 Hours Deep', 'Logged 10 hours of deep work', '⏰', 'building', 50, '{"type": "hours", "count": 10}'),
('deep_work_hour_100', '100 Hours Deep', 'Logged 100 hours of deep work', '⏱️', 'building', 300, '{"type": "hours", "count": 100}'),
('deep_work_hour_500', '500 Hours Deep', 'Logged 500 hours of deep work', '⌛', 'building', 1000, '{"type": "hours", "count": 500}'),
('business_launch', 'Entrepreneur', 'Launched a business or product', '💼', 'building', 500, '{"type": "count", "count": 1}'),
('side_hustle', 'Side Hustler', 'Generated revenue from a side project', '💰', 'building', 200, '{"type": "count", "count": 1}'),
('building_module_1', 'Builder Foundations', 'Completed your first building formation module', '🎓', 'building', 100, '{"type": "completed", "module": "building"}');

----------------------------------------------------
-- ACHIEVEMENTS: TRUTH
----------------------------------------------------

INSERT INTO achievements (slug, name, description, icon, category, points, criteria) VALUES
('first_book', 'Reader', 'Completed your first book review', '📚', 'truth', 10, '{"type": "count", "count": 1}'),
('book_12', 'Year of Reading', 'Completed 12 book reviews', '📖', 'truth', 100, '{"type": "count", "count": 12}'),
('book_50', 'Library Builder', 'Completed 50 book reviews', '📚', 'truth', 500, '{"type": "count", "count": 50}'),
('course_1', 'Student', 'Completed your first course', '🎓', 'truth', 50, '{"type": "count", "count": 1}'),
('course_10', 'Scholar', 'Completed 10 courses', '🏅', 'truth', 300, '{"type": "count", "count": 10}'),
('apologetics_1', 'Defender', 'Completed your first apologetics module', '⚔️', 'truth', 100, '{"type": "count", "count": 1}'),
('debate_participated', 'Dialogue', 'Participated in your first debate', '💬', 'truth', 25, '{"type": "count", "count": 1}'),
('daily_reading_7', 'Disciplined Reader', 'Read daily for 7 days', '📰', 'truth', 50, '{"type": "streak", "days": 7}'),
('daily_reading_30', 'Avid Reader', 'Read daily for 30 days', '📑', 'truth', 200, '{"type": "streak", "days": 30}'),
('truth_module_1', 'Truth Foundations', 'Completed your first truth formation module', '🎓', 'truth', 100, '{"type": "completed", "module": "truth"}');

----------------------------------------------------
-- ACHIEVEMENTS: SPECIAL
----------------------------------------------------

INSERT INTO achievements (slug, name, description, icon, category, points, criteria) VALUES
('campaign_1', 'First Campaign', 'Joined your first campaign', '🎯', 'special', 25, '{"type": "count", "count": 1}'),
('campaign_completed', 'Campaign Complete', 'Completed your first campaign', '✅', 'special', 100, '{"type": "count", "count": 1}'),
('campaign_5', 'Campaign Veteran', 'Completed 5 campaigns', '🏆', 'special', 300, '{"type": "count", "count": 5}'),
('all_pillars_30', 'Balanced Builder', 'Logged activity in all 5 pillars in 30 days', '⚖️', 'special', 200, '{"type": "all_pillars", "days": 30}'),
('formation_score_100', 'Formed', 'Reached 100 formation score', '⭐', 'special', 100, '{"type": "formation_score", "score": 100}'),
('formation_score_500', 'Well-Formed', 'Reached 500 formation score', '🌟', 'special', 300, '{"type": "formation_score", "score": 500}'),
('formation_score_1000', 'Fully Formed', 'Reached 1000 formation score', '💫', 'special', 1000, '{"type": "formation_score", "score": 1000}'),
('onboarding_complete', 'Brother', 'Completed the onboarding process', '🤴', 'special', 50, '{"type": "onboarding", "complete": true}');

----------------------------------------------------
-- CERTIFICATIONS
----------------------------------------------------

INSERT INTO certifications (slug, name, description, category, points, requirements) VALUES
('rule_of_life_certified', 'Rule of Life Certified', 'Demonstrated mastery of Rule of Life practices', 'discipline', 100, '{"streak_days": 30, "rules_completed": 0.8}'),
('pod_leader_certified', 'Pod Leader Certified', 'Completed pod leadership training and led successful pods', 'brotherhood', 200, '{"meetings_led": 12, "training_complete": true}'),
('mentor_certified', 'Mentor Certified', 'Completed mentor training and demonstrated mentoring ability', 'brotherhood', 200, '{"mentees_guided": 3, "training_complete": true}'),
('builder_certified', 'Builder Certified', 'Launched a project through the building pillar', 'building', 150, '{"project_launched": true}'),
('faith_foundations', 'Faith Foundations', 'Completed all faith formation modules', 'faith', 100, '{"modules": ["prayer", "mass", "confession", "scripture"]}'),
('discipline_foundations', 'Discipline Foundations', 'Demonstrated discipline in all areas', 'discipline', 100, '{"habits": ["workout", "sleep", "deep_work"]}'),
('leadership_certified', 'Leadership Certified', 'Completed advanced leadership training', 'brotherhood', 300, '{"training_complete": true, "reviews_completed": 4}'),
('apologetics_certified', 'Apologetics Certified', 'Demonstrated Catholic apologetics knowledge', 'truth', 150, '{"assessment_passed": true}');

----------------------------------------------------
-- SAMPLE CAMPAIGNS
----------------------------------------------------

INSERT INTO campaigns (slug, title, description, campaign_type, difficulty, duration_days, start_date, end_date, active) VALUES
('lent_2026', 'Lent 2026', 'A 40-day journey of fasting, prayer, and almsgiving', 'lent', 'intermediate', 40, '2026-02-18', '2026-03-29', true),
('advent_2026', 'Advent 2026', 'Preparing our hearts for Christmas through prayer and penance', 'advent', 'beginner', 24, '2026-11-29', '2026-12-23', true),
('daily_examen_30', '30 Days of Examen', 'Develop the habit of daily self-examination', 'sprint', 'beginner', 30, NULL, NULL, true),
('deep_work_sprint_q1', 'Q1 Deep Work Sprint', '30 days of focused deep work sessions', 'sprint', 'advanced', 30, '2026-01-01', '2026-01-30', true),
('prayer_warrior', 'Prayer Warrior Challenge', '30 days of intensified prayer life', 'sprint', 'intermediate', 30, NULL, NULL, true),
('st_joseph_2026', 'St. Joseph Novena 2026', '9-day novena to St. Joseph following his example', 'sprint', 'beginner', 9, '2026-03-10', '2026-03-18', true),
('fitness_challenge_90', '90-Day Fitness Transformation', 'Build lasting fitness habits', 'sprint', 'advanced', 90, NULL, NULL, true),
('reading_challenge_2026', '2026 Reading Challenge', 'Read through the Catechism and classic Catholic literature', 'permanent', 'intermediate', 365, '2026-01-01', '2026-12-31', true);

----------------------------------------------------
-- SAMPLE CAMPAIGN TASKS: LENT 2026
----------------------------------------------------

INSERT INTO campaign_tasks (campaign_id, title, description, task_type, points, required, "order")
SELECT c.id, t.title, t.description, t.task_type, t.points, t.required, t.order_num
FROM campaigns c,
(VALUES
  ('Daily Prayer', 'Spend at least 15 minutes in prayer', 'daily', 10, true, 1),
  ('Daily Examen', 'Complete your evening examen', 'daily', 10, true, 2),
  ('Fasting', 'Practice your fast', 'daily', 10, true, 3),
  ('Scripture Reading', 'Read at least one chapter of scripture', 'daily', 5, true, 4),
  ('Almsgiving', 'Give generously to those in need', 'daily', 5, false, 5),
  ('Weekly Mass', 'Attend Mass', 'weekly', 25, true, 6),
  ('Weekly Confession', 'Go to confession', 'weekly', 30, false, 7),
  ('Weekly Review', 'Complete your weekly formation review', 'weekly', 15, true, 8),
  ('Lent Reading Plan', 'Follow the Lenten reading plan', 'one-time', 100, false, 9),
  ('Charity Project', 'Complete a service project', 'one-time', 100, false, 10)
) AS t(title, description, task_type, points, required, order_num)
WHERE c.slug = 'lent_2026';

----------------------------------------------------
-- SAMPLE CAMPAIGN TASKS: 30 DAYS OF EXAMEN
----------------------------------------------------

INSERT INTO campaign_tasks (campaign_id, title, description, task_type, points, required, "order")
SELECT c.id, t.title, t.description, t.task_type, t.points, t.required, t.order_num
FROM campaigns c,
(VALUES
  ('Morning Prayer', 'Begin your day with prayer', 'daily', 5, true, 1),
  ('Examen Morning', 'Review your morning for God''s presence', 'daily', 5, true, 2),
  ('Examen Midday', 'Check in with God midday', 'daily', 5, false, 3),
  ('Examen Evening', 'Complete your evening examen', 'daily', 15, true, 4),
  ('Gratitude List', 'Write 3 things you are grateful for', 'daily', 5, true, 5),
  ('Weekly Reflection', 'Write a weekly reflection', 'weekly', 50, true, 6)
) AS t(title, description, task_type, points, required, order_num)
WHERE c.slug = 'daily_examen_30';

----------------------------------------------------
-- SAMPLE CAMPAIGN TASKS: DEEP WORK SPRINT
----------------------------------------------------

INSERT INTO campaign_tasks (campaign_id, title, description, task_type, points, required, "order")
SELECT c.id, t.title, t.description, t.task_type, t.points, t.required, t.order_num
FROM campaigns c,
(VALUES
  ('2-Hour Deep Work', 'Complete a 2-hour deep work session', 'daily', 20, true, 1),
  ('No Phone Morning', 'Start your day without phone until after deep work', 'daily', 5, true, 2),
  ('Daily Review', 'Review your progress and plan tomorrow', 'daily', 5, true, 3),
  ('Project Milestone', 'Complete a significant project milestone', 'weekly', 100, true, 4),
  ('Weekly Retrospective', 'Review your week and adjust', 'weekly', 25, true, 5)
) AS t(title, description, task_type, points, required, order_num)
WHERE c.slug = 'deep_work_sprint_q1';
