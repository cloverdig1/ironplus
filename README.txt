IRON PLUS — QR MEMBERSHIP SYSTEM
==================================

WHAT'S INCLUDED
----------------
1. admin/admin.html   — Reception/owner dashboard: register members, renew plans,
                   generate & print each member's QR card.
2. admin/checkin.html — The scanner page. Open this on the front-desk tablet/phone.
                   It uses the phone's camera to scan a member's card and
                   instantly shows ACTIVE / EXPIRED + days remaining.

Both files talk directly to a live Supabase database (project "ironplus"),
so any change made in admin/admin.html (new member, renewal) shows up instantly
on admin/checkin.html — no manual syncing, no reprinting cards on renewal.

HOW IT WORKS
------------
- Each member gets ONE permanent QR code when registered. It encodes a link
  like "checkin.html?id=<their-unique-id>" — never the membership data itself.
- Renewing a membership just updates their database record. The same
  printed card keeps working forever.
- Every scan is logged as a check-in, so you get automatic attendance
  history per member for free.

BEFORE YOU GO LIVE
-------------------
1. CHANGE THE ADMIN PASSWORD.
   Current password: ironplus2026
   To change it: generate a new SHA-256 hash of your chosen password and
   replace the PW_HASH constant near the top of the <script> in admin.html.
   (Any "sha256 online" tool or a one-line Python command works:
   python3 -c "import hashlib; print(hashlib.sha256(b'yourpassword').hexdigest())")

2. HOST BOTH FILES on the same domain/folder (e.g. gym.yourdomain.com or
   a free host like Netlify/Vercel/GitHub Pages). Once hosted, open
   admin.html, find the line:
       const CHECKIN_BASE_URL = 'checkin.html';
   and change it to your full checkin.html URL, e.g.
       const CHECKIN_BASE_URL = 'https://gym.yourdomain.com/checkin.html';
   This only matters for QR codes generated AFTER you make the change —
   re-print any cards generated before hosting.

3. On the front-desk tablet/phone, open checkin.html and allow camera
   access when prompted. Bookmark it or add it to the home screen so
   reception can open it with one tap each morning.

DAILY USE
---------
- New member walks in → Admin panel → "Register new member" → fill name,
  phone, plan → Add member. A QR card pops up immediately — print it
  (business-card size works well) and hand it to them.
- Every visit → member shows their card → reception scans it on
  checkin.html → screen shows green ACTIVE (with days left) or red
  EXPIRED.
- Membership about to run out → Admin panel → find member → "Renew" →
  enter the new plan. Their existing card keeps working, no reprint.

DATABASE
--------
Supabase project: ironplus (project ref: wbidkbjxacyzughznxsi)
Tables:
  members  — id, full_name, phone, plan, start_date, end_date, status
  checkins — id, member_id, scanned_at (attendance log)

NOTE ON SECURITY
-----------------
This MVP uses Supabase's public (anon) key with open read/write policies
so the check-in page works without a login for reception. That's fine for
a single-location gym with a physically secured front desk. If you want
per-staff logins, audit trails, or to prevent someone from hitting the
database directly, the next step is adding proper Supabase Auth + row-level
security scoped to authenticated staff — happy to build that when you're
ready to scale.
