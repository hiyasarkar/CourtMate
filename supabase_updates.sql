-- 1. Update profiles table (if not already present, ensuring role column exists)
-- Note: If you don't have a profiles table, this creates it. If you do, it adds the column.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT CHECK (role IN ('user', 'lawyer')) DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Sync auth.users to public.profiles (optional but recommended logic)
-- You might already have a trigger for this.

-- 2. Create lawyers table (if you haven't already, ensuring it matches requirements)
CREATE TABLE IF NOT EXISTS public.lawyers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id), -- If a lawyer logs in
  full_name TEXT NOT NULL,
  domain TEXT, -- e.g. Criminal, Family, Corporate
  reg_no TEXT,
  experience_years INT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 3. Update cases table
ALTER TABLE public.cases 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Draft', -- 'Draft', 'Filed', 'Consulting'
ADD COLUMN IF NOT EXISTS assigned_lawyer_id UUID REFERENCES public.lawyers(id);

-- 4. Create messages table for Realtime Chat
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES public.cases(id),
  sender_id UUID REFERENCES auth.users(id),
  receiver_id UUID REFERENCES auth.users(id), -- Could be a lawyer's user_id
  content TEXT,
  is_system_message BOOLEAN DEFAULT FALSE,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 5. Enable Row Level Security (RLS) policies (Basic examples)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own case messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Enable Realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
