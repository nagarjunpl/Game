
CREATE TABLE IF NOT EXISTS player_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  level integer NOT NULL,
  completed_at timestamptz DEFAULT now(),
  score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, level)
);

ALTER TABLE player_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON player_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON player_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON player_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
