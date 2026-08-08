-- Iron Plus Gym - Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  name TEXT, -- Legacy field for compatibility
  gender TEXT DEFAULT 'Other',
  dob TEXT,
  phone TEXT,
  emergency_contact TEXT,
  address TEXT,
  registration_date TEXT DEFAULT CURRENT_DATE,
  start_date TEXT DEFAULT CURRENT_DATE,
  end_date TEXT,
  expiry_date TEXT, -- Legacy field for compatibility
  status TEXT DEFAULT 'active',
  plan TEXT DEFAULT 'Basic Monthly',
  trainer TEXT,
  locker TEXT,
  medical_notes TEXT DEFAULT 'None reported.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check-ins table (for QR system)
CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance table (for main dashboard)
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  check_in TEXT,
  check_out TEXT,
  method TEXT,
  branch TEXT DEFAULT 'Adama Main',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  payment_date TEXT DEFAULT CURRENT_DATE,
  amount REAL,
  method TEXT,
  receipt TEXT,
  status TEXT DEFAULT 'Paid',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_plan ON members(plan);
CREATE INDEX IF NOT EXISTS idx_checkins_member_id ON checkins(member_id);
CREATE INDEX IF NOT EXISTS idx_checkins_scanned_at ON checkins(scanned_at);
CREATE INDEX IF NOT EXISTS idx_attendance_member_id ON attendance(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_member_id ON payments(member_id);

-- Enable Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes - tighten in production)
CREATE POLICY "Allow public read access to members" ON members FOR SELECT USING (true);
CREATE POLICY "Allow public insert to members" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to members" ON members FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to members" ON members FOR DELETE USING (true);

CREATE POLICY "Allow public read access to checkins" ON checkins FOR SELECT USING (true);
CREATE POLICY "Allow public insert to checkins" ON checkins FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to attendance" ON attendance FOR SELECT USING (true);
CREATE POLICY "Allow public insert to attendance" ON attendance FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to payments" ON payments FOR SELECT USING (true);
CREATE POLICY "Allow public insert to payments" ON payments FOR INSERT WITH CHECK (true);

-- Insert sample data (optional - for testing)
INSERT INTO members (full_name, name, gender, dob, phone, emergency_contact, address, registration_date, status, end_date, plan, trainer, locker, medical_notes) VALUES
('Bereket Alemu', 'Bereket Alemu', 'Male', '1996-03-12', '0911 22 34 56', '0922 11 44 09 (Sister)', 'Bole, Adama', '2024-11-02', 'active', '2026-07-18', 'Premium Annual', 'Dawit Bekele', 'L-014', 'None reported.'),
('Selamawit Tesfaye', 'Selamawit Tesfaye', 'Female', '1999-07-24', '0933 45 67 12', '0944 56 78 12 (Husband)', 'Nazret Ketema, Adama', '2025-02-14', 'active', '2026-07-09', 'Standard Quarterly', 'Hana Girma', 'L-027', 'Mild asthma — inhaler kept at front desk.'),
('Abel Getachew', 'Abel Getachew', 'Male', '1993-01-30', '0955 90 12 88', '0966 90 12 88 (Wife)', 'Geda, Adama', '2023-08-19', 'expired', '2026-06-02', 'Basic Monthly', NULL, NULL, 'None reported.')
ON CONFLICT DO NOTHING;
