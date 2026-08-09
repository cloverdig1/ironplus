# Iron Plus Gym

A complete gym management system with member management, QR-based check-in system, and admin dashboard.

## Project structure

- `index.html` — main admin dashboard with member management
- `landing.html` — public landing page for the gym
- `admin/admin.html` — QR membership admin panel for registering members and generating QR cards
- `admin/checkin.html` — QR scanner page for front-desk check-in system
- `readme.txt` — detailed documentation for the QR membership system
- `supabase-schema.sql` — database schema for Supabase setup
- `src/styles/main.css` — shared styling for the frontend
- `src/scripts/app.js` — frontend behavior and Supabase integration
- `src/scripts/supabase-config.js` — shared Supabase configuration
- `backend/app.js` — Express backend entry point (optional)
- `backend/routes/` — API route modules
- `backend/db/` — SQLite database files and schema (legacy)

## Getting started

### 1. Set up Supabase Database

The project uses Supabase for real-time database management. Follow these steps:

1. Open your Supabase project's SQL Editor
2. Run the schema from `supabase-schema.sql` to create the required tables
3. Ensure Row Level Security (RLS) policies are enabled as defined in the schema

### 2. Configure Supabase Credentials

The Supabase credentials are already configured in:
- `src/scripts/supabase-config.js`
- `admin/admin.html`
- `admin/checkin.html`

If you need to update them, modify the `SUPABASE_URL` and `SUPABASE_KEY` values.

### 3. Run the Application

**Option A: Direct file opening (simplest)**
- Simply open `index.html`, `admin/admin.html`, or `admin/checkin.html` in your browser
- No server required for basic functionality

**Option B: Using the backend server**
```bash
npm install
npm run dev
```
Then open `http://localhost:4000` in your browser.

## QR Membership System

The project includes a complete QR-based membership system:

- **admin/admin.html**: Register members, renew plans, generate and print QR cards
- **admin/checkin.html**: Scan member QR codes at reception for check-in
- Both pages connect to the Supabase database for real-time member management
- See `readme.txt` for detailed setup instructions and usage guide

### Admin Panel Features
- Password-protected admin access (default: ironplus2026)
- Register new members with plans
- Generate QR cards for members
- Renew existing memberships
- View member statistics

### Check-in Scanner Features
- Camera-based QR code scanning
- Manual member ID entry
- Real-time membership status validation
- Automatic check-in logging

## Database Schema

The Supabase database includes these tables:
- **members**: Member information, plans, and status
- **checkins**: QR scan logs for attendance tracking
- **attendance**: Detailed attendance records
- **payments**: Payment history and transactions

## Security Notes

- The current setup uses public Supabase keys for demo purposes
- For production, implement proper authentication and tighten RLS policies
- Change the admin password in `admin/admin.html` before deployment
- Consider adding user authentication for staff access

## Development

- The project can work with or without the Express backend
- Supabase handles the database operations directly from the frontend
- The SQLite backend in `backend/` is legacy and can be removed if not needed
- Add new features by extending the Supabase schema and frontend code
