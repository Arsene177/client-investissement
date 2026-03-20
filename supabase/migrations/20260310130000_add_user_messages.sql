-- Create user_messages table
CREATE TABLE IF NOT EXISTS user_messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject TEXT,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their own messages" ON user_messages;
CREATE POLICY "Users can view their own messages" 
  ON user_messages FOR SELECT 
  TO authenticated 
  USING (auth.uid() = receiver_id OR auth.uid() = sender_id);

DROP POLICY IF EXISTS "Admins can send messages" ON user_messages;
CREATE POLICY "Admins can send messages" 
  ON user_messages FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can mark messages as read" ON user_messages;
CREATE POLICY "Users can mark messages as read" 
  ON user_messages FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = receiver_id) 
  WITH CHECK (auth.uid() = receiver_id);
