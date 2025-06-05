-- Drop existing foreign key constraint if it exists
ALTER TABLE gifts DROP CONSTRAINT IF EXISTS gifts_submitted_by_fkey;

-- Add the foreign key constraint with proper naming
ALTER TABLE gifts 
ADD CONSTRAINT gifts_submitted_by_fkey 
FOREIGN KEY (submitted_by) REFERENCES profiles(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gifts_submitted_by ON gifts(submitted_by);

-- Drop existing policies first
DROP POLICY IF EXISTS "Gifts are viewable by everyone" ON gifts;
DROP POLICY IF EXISTS "Authenticated users can create gifts" ON gifts;
DROP POLICY IF EXISTS "Users can update own gifts" ON gifts;
DROP POLICY IF EXISTS "Users can delete own gifts" ON gifts;

-- Create updated policies
CREATE POLICY "Gifts are viewable by everyone" ON gifts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create gifts" ON gifts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own gifts" ON gifts FOR UPDATE USING (auth.uid() = submitted_by);
CREATE POLICY "Users can delete own gifts" ON gifts FOR DELETE USING (auth.uid() = submitted_by);
