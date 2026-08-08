// Shared Supabase configuration for Iron Plus Gym
const SUPABASE_CONFIG = {
  url: "https://wbidkbjxacyzughznxsi.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiaWRrYmp4YWN5enVnaHpueHNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxOTUwMTMsImV4cCI6MjEwMTc3MTAxM30.0Y72Kk5QVBOW5qwyhNQ6M6x0kGRZ30Ch3t0xougavIw",
  serviceRoleKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiaWRrYmp4YWN5enVnaHpueHNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjE5NTAxMywiZXhwIjoyMTAxNzcxMDEzfQ.ZW5IwdvZNCcf8iejej9fhEEkSuqdszVXTEDfCF0u5ss"
};

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
