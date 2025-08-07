-- Drop existing tables if they exist
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS membership_applications CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT[] DEFAULT '{}',
    github_url TEXT,
    live_url TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    team_members TEXT[] DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    type TEXT DEFAULT 'general' CHECK (type IN ('general', 'workshop', 'meeting', 'hackathon')),
    max_participants INTEGER,
    image_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resources table
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT DEFAULT 'link' CHECK (type IN ('link', 'document', 'video', 'tutorial')),
    category TEXT DEFAULT 'general',
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create membership_applications table
CREATE TABLE membership_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    student_id TEXT,
    major TEXT,
    graduation_year INTEGER,
    interests TEXT[] DEFAULT '{}',
    experience TEXT,
    motivation TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users
CREATE POLICY "Users can read their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can update users" ON users FOR UPDATE USING (true);

-- Create RLS policies for projects
CREATE POLICY "Anyone can read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Admins can insert projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update projects" ON projects FOR UPDATE USING (true);
CREATE POLICY "Admins can delete projects" ON projects FOR DELETE USING (true);

-- Create RLS policies for events
CREATE POLICY "Anyone can read events" ON events FOR SELECT USING (true);
CREATE POLICY "Admins can insert events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update events" ON events FOR UPDATE USING (true);
CREATE POLICY "Admins can delete events" ON events FOR DELETE USING (true);

-- Create RLS policies for resources
CREATE POLICY "Anyone can read resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Admins can insert resources" ON resources FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update resources" ON resources FOR UPDATE USING (true);
CREATE POLICY "Admins can delete resources" ON resources FOR DELETE USING (true);

-- Create RLS policies for membership_applications
CREATE POLICY "Anyone can insert applications" ON membership_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read all applications" ON membership_applications FOR SELECT USING (true);
CREATE POLICY "Admins can update applications" ON membership_applications FOR UPDATE USING (true);
CREATE POLICY "Admins can delete applications" ON membership_applications FOR DELETE USING (true);

-- Insert admin user for test@email.vccs.edu
INSERT INTO users (id, email, role) 
VALUES ('c6077857-5638-43af-81b1-ddb4954cb4fa', 'test@email.vccs.edu', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
