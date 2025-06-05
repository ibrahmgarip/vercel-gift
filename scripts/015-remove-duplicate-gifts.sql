-- Find and remove duplicate gifts based on title
-- Keep the one with the highest total_score, or if scores are equal, keep the oldest one

-- First, let's see what duplicates we have
SELECT title, COUNT(*) as duplicate_count
FROM gifts 
GROUP BY title 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Create a temporary table to identify which records to keep
WITH ranked_gifts AS (
  SELECT 
    id,
    title,
    total_score,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY title 
      ORDER BY total_score DESC, created_at ASC
    ) as rn
  FROM gifts
),
duplicates_to_delete AS (
  SELECT id, title
  FROM ranked_gifts 
  WHERE rn > 1
)
-- Delete the duplicate records (keeping the best one for each title)
DELETE FROM gifts 
WHERE id IN (SELECT id FROM duplicates_to_delete);

-- Show the results
SELECT 
  'Duplicate removal completed' as status,
  COUNT(*) as remaining_gifts
FROM gifts;

-- Show remaining gifts grouped by title to verify no duplicates remain
SELECT title, COUNT(*) as count
FROM gifts 
GROUP BY title 
HAVING COUNT(*) > 1;
