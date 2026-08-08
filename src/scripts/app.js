/* ============ DATA ============ */
const trainers = ["Dawit Bekele","Hana Girma","Yonas Tadesse","Meron Alemayehu"];
const plans = ["Basic Monthly","Standard Quarterly","Premium Annual","Student Plan"];
const planPrice = {"Basic Monthly":1500,"Standard Quarterly":3600,"Premium Annual":17000,"Student Plan":1000};

// Supabase client
const sb = supabase;

function initials(name){ return name.split(" ").map(n=>n[0]).slice(0,2).join(""); }
function daysBetween(a,b){ return Math.round((new Date(a)-new Date(b))/86400000); }
function fmtETB(n){ return "ETB " + n.toLocaleString(); }

const members = [
  {id:"SF-1042", name:"Bereket Alemu", gender:"Male", dob:"1996-03-12", phone:"0911 22 34 56", emergency:"0922 11 44 09 (Sister)", address:"Bole, Adama", reg:"2024-11-02", status:"active", expiry:"2026-07-18", plan:"Premium Annual", trainer:"Dawit Bekele", locker:"L-014", medical:"None reported.",
    assess:{weight:82,height:178,bmi:25.9,bodyFat:18.4,muscle:35.2,chest:101,waist:88,hip:99,arm:34,leg:58,goals:"Cut to 76kg, improve endurance",notes:"Good progress on squat form.",date:"2026-06-20"},
    payments:[{date:"2026-01-05",amount:17000,method:"Telebirr",receipt:"RCT-88231",status:"Paid"}],
    attendance:[{in:"06:12",out:"07:40",method:"RFID",branch:"Adama Main"},{in:"Yesterday 17:05",out:"18:20",method:"Fingerprint",branch:"Adama Main"}]},
  {id:"SF-1043", name:"Selamawit Tesfaye", gender:"Female", dob:"1999-07-24", phone:"0933 45 67 12", emergency:"0944 56 78 12 (Husband)", address:"Nazret Ketema, Adama", reg:"2025-02-14", status:"active", expiry:"2026-07-09", plan:"Standard Quarterly", trainer:"Hana Girma", locker:"L-027", medical:"Mild asthma — inhaler kept at front desk.",
    assess:{weight:64,height:165,bmi:23.5,bodyFat:24.1,muscle:26.8,chest:88,waist:74,hip:96,arm:27,leg:52,goals:"Tone up, 5k in under 28 min",notes:"Cardio capacity improving steadily.",date:"2026-06-18"},
    payments:[{date:"2026-04-09",amount:3600,method:"CBE Birr",receipt:"RCT-88450",status:"Paid"}],
    attendance:[{in:"05:48",out:"07:00",method:"QR Code",branch:"Adama Main"}]},
  {id:"SF-1044", name:"Abel Getachew", gender:"Male", dob:"1993-01-30", phone:"0955 90 12 88", emergency:"0966 90 12 88 (Wife)", address:"Geda, Adama", reg:"2023-08-19", status:"expired", expiry:"2026-06-02", plan:"Basic Monthly", trainer:"—", locker:"—", medical:"None reported.",
    assess:{weight:90,height:181,bmi:27.5,bodyFat:22.0,muscle:37.0,chest:106,waist:96,hip:103,arm:36,leg:60,goals:"General fitness maintenance",notes:"Hasn't checked in since May.",date:"2026-05-02"},
    payments:[{date:"2026-05-01",amount:1500,method:"Cash",receipt:"RCT-87210",status:"Paid"}],
    attendance:[{in:"—",out:"—",method:"—",branch:"—"}]},
  {id:"SF-1045", name:"Hanna Mulugeta", gender:"Female", dob:"2001-11-05", phone:"0977 33 21 09", emergency:"0988 12 09 33 (Mother)", address:"Bole, Adama", reg:"2025-09-01", status:"frozen", expiry:"2026-09-30", plan:"Standard Quarterly", trainer:"Meron Alemayehu", locker:"L-005", medical:"Recovering from knee strain — low-impact only.",
    assess:{weight:58,height:160,bmi:22.7,bodyFat:26.0,muscle:22.5,chest:83,waist:70,hip:92,arm:24,leg:48,goals:"Rehab knee, return to running",notes:"Membership frozen while recovering.",date:"2026-05-28"},
    payments:[{date:"2026-03-01",amount:3600,method:"Telebirr",receipt:"RCT-87990",status:"Paid"}],
    attendance:[{in:"—",out:"—",method:"—",branch:"—"}]},
  {id:"SF-1046", name:"Yared Solomon", gender:"Male", dob:"1990-05-16", phone:"0911 88 77 66", emergency:"0922 77 88 66 (Brother)", address:"Nazret Ketema, Adama", reg:"2022-04-11", status:"active", expiry:"2026-07-04", plan:"Premium Annual", trainer:"Dawit Bekele", locker:"L-041", medical:"None reported.",
    assess:{weight:79,height:174,bmi:26.1,bodyFat:19.8,muscle:33.9,chest:99,waist:86,hip:97,arm:33,leg:56,goals:"Strength — 100kg bench",notes:"Bench at 92kg, on track.",date:"2026-06-25"},
    payments:[{date:"2025-07-04",amount:17000,method:"Bank Transfer",receipt:"RCT-81190",status:"Paid"}],
    attendance:[{in:"06:30",out:"07:55",method:"Fingerprint",branch:"Adama Main"}]},
  {id:"SF-1047", name:"Ruth Mekonnen", gender:"Female", dob:"2003-09-09", phone:"0966 12 34 90", emergency:"0977 34 12 90 (Father)", address:"Geda, Adama", reg:"2025-12-20", status:"active", expiry:"2026-07-03", plan:"Student Plan", trainer:"Hana Girma", locker:"—", medical:"None reported.",
    assess:{weight:55,height:158,bmi:22.0,bodyFat:23.0,muscle:21.4,chest:80,waist:68,hip:90,arm:23,leg:46,goals:"Build consistency, 3x/week",notes:"New client, onboarding phase.",date:"2026-06-10"},
    payments:[{date:"2026-06-01",amount:1000,method:"Cash",receipt:"RCT-88602",status:"Paid"}],
    attendance:[{in:"16:10",out:"17:05",method:"QR Code",branch:"Adama Main"}]},
  {id:"SF-1048", name:"Tesfaye Wolde", gender:"Male", dob:"1985-12-01", phone:"0922 45 67 89", emergency:"0933 67 45 89 (Wife)", address:"Bole, Adama", reg:"2021-01-15", status:"expired", expiry:"2026-05-20", plan:"Basic Monthly", trainer:"—", locker:"—", medical:"Hypertension — monitored, cleared for moderate activity.",
    assess:{weight:95,height:176,bmi:30.7,bodyFat:28.5,muscle:34.0,chest:108,waist:104,hip:106,arm:35,leg:59,goals:"Lower blood pressure via cardio",notes:"Needs renewal follow-up call.",date:"2026-04-15"},
    payments:[{date:"2026-04-20",amount:1500,method:"Cash",receipt:"RCT-86710",status:"Paid"}],
    attendance:[{in:"—",out:"—",method:"—",branch:"—"}]},
  {id:"SF-1049", name:"Meskerem Fikru", gender:"Female", dob:"1997-06-22", phone:"0944 11 22 33", emergency:"0955 22 11 33 (Sister)", address:"Nazret Ketema, Adama", reg:"2024-06-08", status:"active", expiry:"2026-08-14", plan:"Standard Quarterly", trainer:"Meron Alemayehu", locker:"L-019", medical:"None reported.",
    assess:{weight:61,height:163,bmi:23.0,bodyFat:22.5,muscle:25.9,chest:86,waist:71,hip:95,arm:26,leg:51,goals:"Marathon prep — Adama 10k",notes:"Weekly mileage increasing on schedule.",date:"2026-06-22"},
    payments:[{date:"2026-05-08",amount:3600,method:"Telebirr",receipt:"RCT-88010",status:"Paid"}],
    attendance:[{in:"05:55",out:"07:10",method:"RFID",branch:"Adama Main"}]},
];

const lockersData = Array.from({length:36}, (_,i)=>{
  const n = i+1;
  const assignedMember = members.find(m=>m.locker==="L-"+String(n).padStart(3,"0"));
  let state = assignedMember ? "assigned" : (n%11===0 ? "damaged" : "available");
  return {num:"L-"+String(n).padStart(3,"0"), state, member: assignedMember? assignedMember.name : null};
});

const trainerStats = [
  {name:"Dawit Bekele", clients:24, sessions:86, rating:4.9},
  {name:"Hana Girma", clients:19, sessions:71, rating:4.8},
  {name:"Yonas Tadesse", clients:15, sessions:52, rating:4.6},
  {name:"Meron Alemayehu", clients:21, sessions:79, rating:4.9},
];

const todayCheckins = members.filter(m=>m.attendance[0].in!=="—").map(m=>({name:m.name, id:m.id, in:m.attendance[0].in, method:m.attendance[0].method, branch:m.attendance[0].branch}));

/* ============ NAV ============ */
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const titles = {dashboard:["Dashboard","Today, overview across all branches"], members:["Members","Full member directory & lifecycle actions"], attendance:["Attendance","Check-in and check-out records"], payments:["Payments","Transaction history & outstanding balances"], lockers:["Lockers","Assignment status across the locker bank"], reports:["Reports & analytics","Performance across plans, trainers and growth"]};
navItems.forEach(item=>{
  item.addEventListener("click", ()=>{
    navItems.forEach(n=>n.classList.remove("active"));
    item.classList.add("active");
    const v = item.dataset.view;
    views.forEach(s=>s.classList.remove("active"));
    document.getElementById("view-"+v).classList.add("active");
    document.getElementById("pageTitle").textContent = titles[v][0];
    document.getElementById("pageSub").textContent = titles[v][1];
  });
});

/* ============ RIDGE SVG (signature motif) ============ */
function ridgeSVG(color, w=140,h=48){
  return `<svg class="ridge" width="${w}" height="${h}" viewBox="0 0 140 48" fill="none">
    <path d="M0 42L14 20L24 34L38 8L52 30L64 14L76 34L90 6L104 30L118 16L140 40" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>
  </svg>`;
}

/* ============ DASHBOARD ============ */
function renderDashboard(){
  const active = members.filter(m=>m.status==="active").length;
  const expired = members.filter(m=>m.status==="expired").length;
  const frozen = members.filter(m=>m.status==="frozen").length;
  const revenue = members.flatMap(m=>m.payments).reduce((s,p)=>s+p.amount,0);

  const stats = [
    {label:"Active members", value: active, delta:"+3 this week", cls:"up", color:"#c8ff4d"},
    {label:"Checked in today", value: todayCheckins.length, delta: todayCheckins.length+" of "+members.length+" members", cls:"flat", color:"#5ac8ff"},
    {label:"Expiring in 7 days", value: members.filter(m=>{const d=daysBetween(m.expiry,"2026-07-01"); return d>=0 && d<=7;}).length, delta:"Needs renewal calls", cls:"down", color:"#ff7a1a"},
    {label:"Revenue this month", value: fmtETB(revenue), delta:"+12% vs last month", cls:"up", color:"#ff7a1a"},
  ];
  document.getElementById("statGrid").innerHTML = stats.map(s=>`
    <div class="stat-card">
      ${ridgeSVG(s.color)}
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-delta ${s.cls}">${s.delta}</div>
    </div>`).join("");

  document.getElementById("dashCheckinsSub").textContent = todayCheckins.length + " check-ins";
  document.getElementById("dashCheckinsBody").innerHTML = todayCheckins.map(c=>`
    <tr class="clickable" onclick="openDrawer('${c.id}')">
      <td class="cell-member"><div class="mini-avatar">${initials(c.name)}</div><div><div class="member-name">${c.name}</div><div class="member-id">${c.id}</div></div></td>
      <td>${c.in}</td>
      <td>${c.method}</td>
      <td>${c.branch}</td>
    </tr>`).join("") || `<tr><td colspan="4" style="color:var(--muted); padding:20px 18px;">No check-ins recorded yet today.</td></tr>`;

  const total = members.length;
  const statusRows = [
    {label:"Active", val: active, color:"var(--lime)"},
    {label:"Expired", val: expired, color:"var(--red)"},
    {label:"Frozen", val: frozen, color:"var(--blue)"},
  ];
  document.getElementById("statusBars").innerHTML = statusRows.map(r=>`
    <div class="bar-row">
      <div class="bar-label">${r.label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(r.val/total*100)}%; background:${r.color};"></div></div>
      <div class="bar-val">${r.val}</div>
    </div>`).join("");

  const dueSoon = members.filter(m=>{const d=daysBetween(m.expiry,"2026-07-01"); return d>=0 && d<=7;}).sort((a,b)=>daysBetween(a.expiry,"2026-07-01")-daysBetween(b.expiry,"2026-07-01"));
  document.getElementById("renewSub").textContent = dueSoon.length + " members";
  document.getElementById("renewBody").innerHTML = dueSoon.map(m=>`
    <tr>
      <td class="cell-member"><div class="mini-avatar">${initials(m.name)}</div><div><div class="member-name">${m.name}</div><div class="member-id">${m.id}</div></div></td>
      <td>${m.plan}</td>
      <td>${m.expiry}</td>
      <td>${daysBetween(m.expiry,"2026-07-01")} days</td>
      <td><button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); openDrawer('${m.id}')">Renew</button></td>
    </tr>`).join("") || `<tr><td colspan="5" style="color:var(--muted); padding:20px 18px;">Nothing due this week.</td></tr>`;
}

/* ============ MEMBERS TABLE ============ */
let activeFilter = "all";
let searchQuery = "";
function renderMemberChips(){
  const counts = {all: members.length, active: members.filter(m=>m.status==="active").length, expired: members.filter(m=>m.status==="expired").length, frozen: members.filter(m=>m.status==="frozen").length};
  const chips = [["all","All"],["active","Active"],["expired","Expired"],["frozen","Frozen"]];
  document.getElementById("memberChips").innerHTML = chips.map(([key,label])=>`
    <div class="chip ${activeFilter===key?'active':''}" onclick="setFilter('${key}')">${label} <span style="opacity:.6">${counts[key]}</span></div>`).join("");
}
function setFilter(key){ activeFilter = key; renderMemberChips(); renderMembersTable(); }
function badgeFor(status){
  const map = {active:["badge-active","Active"], expired:["badge-expired","Expired"], frozen:["badge-frozen","Frozen"]};
  const [cls,label] = map[status];
  return `<span class="badge ${cls}"><span class="badge-dot"></span>${label}</span>`;
}
function renderMembersTable(){
  let list = members.filter(m=> activeFilter==="all" || m.status===activeFilter);
  if(searchQuery){
    const q = searchQuery.toLowerCase();
    list = list.filter(m=> m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.phone.includes(q));
  }
  document.getElementById("membersBody").innerHTML = list.map(m=>`
    <tr class="clickable" onclick="openDrawer('${m.id}')">
      <td class="cell-member"><div class="mini-avatar">${initials(m.name)}</div><div><div class="member-name">${m.name}</div><div class="member-id">${m.id}</div></div></td>
      <td>${m.plan}</td>
      <td>${badgeFor(m.status)}</td>
      <td>${m.expiry}</td>
      <td>${m.trainer}</td>
      <td>${m.locker}</td>
      <td><button class="btn btn-sm" onclick="event.stopPropagation(); openDrawer('${m.id}')">View</button></td>
    </tr>`).join("") || `<tr><td colspan="7" style="color:var(--muted); padding:24px 18px;">No members match this search.</td></tr>`;
  document.getElementById("navMemberCount").textContent = members.length;
}
document.getElementById("globalSearch").addEventListener("input", (e)=>{
  searchQuery = e.target.value;
  renderMembersTable();
  if(searchQuery){
    navItems.forEach(n=>n.classList.remove("active"));
    document.querySelector('.nav-item[data-view="members"]').classList.add("active");
    views.forEach(s=>s.classList.remove("active"));
    document.getElementById("view-members").classList.add("active");
    document.getElementById("pageTitle").textContent = titles.members[0];
    document.getElementById("pageSub").textContent = titles.members[1];
  }
});

/* ============ ATTENDANCE ============ */
function renderAttendance(){
  const rows = [];
  members.forEach(m=> m.attendance.forEach(a=>{ if(a.in!=="—") rows.push({m,a}); }));
  document.getElementById("attendanceBody").innerHTML = rows.map(({m,a})=>`
    <tr class="clickable" onclick="openDrawer('${m.id}')">
      <td class="cell-member"><div class="mini-avatar">${initials(m.name)}</div><div><div class="member-name">${m.name}</div><div class="member-id">${m.id}</div></div></td>
      <td>${a.in}</td>
      <td>${a.out}</td>
      <td>${a.method}</td>
      <td>${a.branch}</td>
      <td>Aster Kebede</td>
    </tr>`).join("");
}

/* ============ PAYMENTS ============ */
function renderPayments(){
  const rows = [];
  members.forEach(m=> m.payments.forEach(p=> rows.push({m,p})));
  const totalRevenue = rows.reduce((s,r)=>s+r.p.amount,0);
  const outstanding = members.filter(m=>m.status==="expired").length * 1200;
  document.getElementById("payStatGrid").innerHTML = [
    {label:"Total collected", value: fmtETB(totalRevenue), color:"#c8ff4d"},
    {label:"Outstanding balance", value: fmtETB(outstanding), color:"#ff5c5c"},
    {label:"Transactions this month", value: rows.length, color:"#5ac8ff"},
  ].map(s=>`<div class="stat-card">${ridgeSVG(s.color)}<div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div></div>`).join("");

  document.getElementById("paymentsBody").innerHTML = rows.map(({m,p})=>`
    <tr class="clickable" onclick="openDrawer('${m.id}')">
      <td class="cell-member"><div class="mini-avatar">${initials(m.name)}</div><div><div class="member-name">${m.name}</div><div class="member-id">${m.id}</div></div></td>
      <td>${p.date}</td>
      <td>${m.plan}</td>
      <td>${fmtETB(p.amount)}</td>
      <td>${p.method}</td>
      <td class="mono">${p.receipt}</td>
      <td><span class="badge badge-active"><span class="badge-dot"></span>${p.status}</span></td>
    </tr>`).join("");
}

/* ============ LOCKERS ============ */
function renderLockers(){
  document.getElementById("lockerGrid").innerHTML = lockersData.map((l,i)=>`
    <div class="locker ${l.state}" onclick="cycleLocker(${i})" title="${l.member? l.member : ''}">
      <div class="locker-num">${l.num}</div>
      <div class="locker-state">${l.state}</div>
    </div>`).join("");
}
function cycleLocker(i){
  const order = ["available","assigned","damaged"];
  const cur = order.indexOf(lockersData[i].state);
  lockersData[i].state = order[(cur+1)%order.length];
  if(lockersData[i].state!=="assigned") lockersData[i].member = null;
  renderLockers();
}

/* ============ REPORTS ============ */
function renderReports(){
  const byPlan = {};
  plans.forEach(p=> byPlan[p] = members.filter(m=>m.plan===p && m.status==="active").length * planPrice[p]);
  const maxRev = Math.max(...Object.values(byPlan),1);
  document.getElementById("revenueByPlan").innerHTML = Object.entries(byPlan).map(([p,v])=>`
    <div class="bar-row" style="padding:9px 0;">
      <div class="bar-label" style="width:120px;">${p}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(v/maxRev*100)}%; background:#ff7a1a;"></div></div>
      <div class="bar-val" style="width:60px;">${v.toLocaleString()}</div>
    </div>`).join("");

  const growth = [180,196,205,221,236, members.length + 233];
  const w=280,h=64, max=Math.max(...growth), min=Math.min(...growth);
  const pts = growth.map((v,i)=>{
    const x = (i/(growth.length-1))*w;
    const y = h - ((v-min)/(max-min||1))*(h-10) - 5;
    return `${x},${y}`;
  }).join(" ");
  document.getElementById("growthSpark").innerHTML = `
    <polyline points="${pts}" fill="none" stroke="#c8ff4d" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    ${growth.map((v,i)=>{const x=(i/(growth.length-1))*w; const y=h-((v-min)/(max-min||1))*(h-10)-5; return `<circle cx="${x}" cy="${y}" r="2.6" fill="#0b0c0e" stroke="#c8ff4d" stroke-width="2"/>`;}).join("")}
  `;

  const planCounts = {};
  plans.forEach(p=> planCounts[p] = members.filter(m=>m.plan===p && m.status==="active").length);
  const top = Object.entries(planCounts).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById("popularPlan").innerHTML = `
    <div class="stat-value" style="font-size:22px;">${top[0]}</div>
    <div class="page-sub" style="margin-top:6px;">${top[1]} active members on this plan</div>
    <div style="margin-top:14px;">${Object.entries(planCounts).map(([p,c])=>`
      <div class="bar-row" style="padding:6px 0;">
        <div class="bar-label" style="width:110px; font-size:11.5px;">${p}</div>
        <div class="bar-track" style="height:5px;"><div class="bar-fill" style="width:${(c/(top[1]||1)*100)}%; background:#5ac8ff;"></div></div>
        <div class="bar-val" style="width:20px; font-size:11px;">${c}</div>
      </div>`).join("")}</div>
  `;

  document.getElementById("trainerBody").innerHTML = trainerStats.map(t=>`
    <tr>
      <td class="cell-member"><div class="mini-avatar">${initials(t.name)}</div><div class="member-name">${t.name}</div></td>
      <td>${t.clients}</td>
      <td>${t.sessions}</td>
      <td>★ ${t.rating}</td>
    </tr>`).join("");
}

/* ============ DRAWER ============ */
function openDrawer(id){
  const m = members.find(x=>x.id===id);
  if(!m) return;
  const age = new Date("2026-07-01").getFullYear() - new Date(m.dob).getFullYear();
  document.getElementById("drawer").innerHTML = `
    <div class="drawer-head">
      <div class="drawer-avatar">${initials(m.name)}</div>
      <div style="flex:1;">
        <div style="font-weight:700; font-size:16px;">${m.name}</div>
        <div class="member-id" style="margin-top:2px;">${m.id} · ${age} yrs · ${m.gender}</div>
        <div style="margin-top:8px;">${badgeFor(m.status)}</div>
      </div>
      <div class="drawer-close" onclick="closeDrawer()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </div>
    </div>

    <div class="drawer-section">
      <div class="drawer-section-title">Membership</div>
      <div class="action-row" style="margin-bottom:14px;">
        <button class="btn btn-sm btn-primary">Renew</button>
        <button class="btn btn-sm">Upgrade</button>
        <button class="btn btn-sm">Freeze</button>
        <button class="btn btn-sm btn-danger">Cancel</button>
      </div>
      <div class="info-grid">
        <div class="info-item"><div class="k">Plan</div><div class="v">${m.plan}</div></div>
        <div class="info-item"><div class="k">Expiry date</div><div class="v">${m.expiry}</div></div>
        <div class="info-item"><div class="k">Assigned trainer</div><div class="v">${m.trainer}</div></div>
        <div class="info-item"><div class="k">Assigned locker</div><div class="v">${m.locker}</div></div>
      </div>
    </div>

    <div class="drawer-section">
      <div class="drawer-section-title">Personal information</div>
      <div class="info-grid">
        <div class="info-item"><div class="k">Phone</div><div class="v">${m.phone}</div></div>
        <div class="info-item"><div class="k">Date of birth</div><div class="v">${m.dob}</div></div>
        <div class="info-item"><div class="k">Address</div><div class="v">${m.address}</div></div>
        <div class="info-item"><div class="k">Emergency contact</div><div class="v">${m.emergency}</div></div>
        <div class="info-item"><div class="k">Registered</div><div class="v">${m.reg}</div></div>
        <div class="info-item"><div class="k">Medical notes</div><div class="v">${m.medical}</div></div>
      </div>
    </div>

    <div class="drawer-section">
      <div class="drawer-section-title">Latest physical assessment · ${m.assess.date}</div>
      <div class="assess-grid">
        <div class="assess-item"><div class="k">Weight</div><div class="v">${m.assess.weight} kg</div></div>
        <div class="assess-item"><div class="k">Height</div><div class="v">${m.assess.height} cm</div></div>
        <div class="assess-item"><div class="k">BMI</div><div class="v">${m.assess.bmi}</div></div>
        <div class="assess-item"><div class="k">Body fat</div><div class="v">${m.assess.bodyFat}%</div></div>
        <div class="assess-item"><div class="k">Muscle mass</div><div class="v">${m.assess.muscle} kg</div></div>
        <div class="assess-item"><div class="k">Chest</div><div class="v">${m.assess.chest} cm</div></div>
        <div class="assess-item"><div class="k">Waist</div><div class="v">${m.assess.waist} cm</div></div>
        <div class="assess-item"><div class="k">Hip</div><div class="v">${m.assess.hip} cm</div></div>
        <div class="assess-item"><div class="k">Arm</div><div class="v">${m.assess.arm} cm</div></div>
      </div>
      <div style="margin-top:12px; font-size:12.5px; color:var(--text-dim);"><b style="color:var(--text);">Goals:</b> ${m.assess.goals}</div>
      <div style="margin-top:6px; font-size:12.5px; color:var(--text-dim);"><b style="color:var(--text);">Trainer notes:</b> ${m.assess.notes}</div>
    </div>

    <div class="drawer-section">
      <div class="drawer-section-title">Payment history</div>
      ${m.payments.map(p=>`<div class="mini-row"><div class="l">${p.date} · ${p.method}</div><div class="r">${fmtETB(p.amount)}</div></div>`).join("")}
    </div>

    <div class="drawer-section">
      <div class="drawer-section-title">Attendance history</div>
      ${m.attendance.map(a=>`<div class="mini-row"><div class="l">${a.branch} · ${a.method}</div><div class="r">${a.in} ${a.out!=='—' ? '→ '+a.out : ''}</div></div>`).join("")}
    </div>
  `;
  document.getElementById("drawer").classList.add("open");
  document.getElementById("overlay").classList.add("open");
}
function closeDrawer(){
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
}

function generateNewMemberId(){
  const last = members.reduce((max,m)=>{
    const num = Number(m.id.split("-")[1]) || 0;
    return Math.max(max,num);
  }, 0);
  return `SF-${String(last+1).padStart(4,"0")}`;
}

function openDrawerForNew(){
  const id = generateNewMemberId();
  document.getElementById("drawer").innerHTML = `
    <div class="drawer-head">
      <div class="drawer-avatar">+</div>
      <div style="flex:1;">
        <div style="font-weight:700; font-size:16px;">Add new member</div>
        <div class="member-id" style="margin-top:2px;">${id} · New registration</div>
      </div>
      <div class="drawer-close" onclick="closeDrawer()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </div>
    </div>

    <div class="drawer-section">
      <div class="drawer-section-title">Member details</div>
      <div class="info-grid">
        <div class="info-item"><label class="k">Full name</label><input id="newName" class="drawer-input" placeholder="Full name"></div>
        <div class="info-item"><label class="k">Gender</label><select id="newGender" class="drawer-input"><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
        <div class="info-item"><label class="k">Date of birth</label><input id="newDob" class="drawer-input" type="date"></div>
        <div class="info-item"><label class="k">Phone</label><input id="newPhone" class="drawer-input" placeholder="0911 22 33 44"></div>
        <div class="info-item"><label class="k">Emergency contact</label><input id="newEmergency" class="drawer-input" placeholder="0922 11 44 09 (Name)"></div>
        <div class="info-item"><label class="k">Address</label><input id="newAddress" class="drawer-input" placeholder="Bole, Adama"></div>
        <div class="info-item"><label class="k">Plan</label><select id="newPlan" class="drawer-input"><option>Basic Monthly</option><option>Standard Quarterly</option><option>Premium Annual</option><option>Student Plan</option></select></div>
        <div class="info-item"><label class="k">Trainer</label><select id="newTrainer" class="drawer-input"><option>Dawit Bekele</option><option>Hana Girma</option><option>Yonas Tadesse</option><option>Meron Alemayehu</option></select></div>
        <div class="info-item"><label class="k">Status</label><select id="newStatus" class="drawer-input"><option value="active">Active</option><option value="expired">Expired</option><option value="frozen">Frozen</option></select></div>
        <div class="info-item"><label class="k">Expiry date</label><input id="newExpiry" class="drawer-input" type="date"></div>
        <div class="info-item" style="grid-column:1 / -1;"><label class="k">Medical notes</label><textarea id="newMedical" class="drawer-input" placeholder="Medical notes or special instructions" rows="3"></textarea></div>
      </div>
    </div>

    <div class="drawer-section">
      <div class="drawer-section-title">Actions</div>
      <div class="action-row" style="justify-content:flex-start; gap:12px;">
        <button class="btn btn-primary" id="createMemberBtn">Create member</button>
        <button class="btn" onclick="closeDrawer()">Cancel</button>
      </div>
    </div>
  `;

  document.getElementById("overlay").classList.add("open");
  document.getElementById("drawer").classList.add("open");

  document.getElementById("createMemberBtn").addEventListener("click", async ()=>{
    const newMemberData = {
      full_name: document.getElementById("newName").value.trim() || "New Member",
      name: document.getElementById("newName").value.trim() || "New Member",
      gender: document.getElementById("newGender").value,
      dob: document.getElementById("newDob").value || "2000-01-01",
      phone: document.getElementById("newPhone").value.trim() || "0911 000 0000",
      emergency_contact: document.getElementById("newEmergency").value.trim() || "Not provided",
      address: document.getElementById("newAddress").value.trim() || "Not provided",
      registration_date: new Date().toISOString().slice(0,10),
      start_date: new Date().toISOString().slice(0,10),
      status: document.getElementById("newStatus").value,
      end_date: document.getElementById("newExpiry").value || new Date(Date.now()+1000*60*60*24*90).toISOString().slice(0,10),
      expiry_date: document.getElementById("newExpiry").value || new Date(Date.now()+1000*60*60*24*90).toISOString().slice(0,10),
      plan: document.getElementById("newPlan").value,
      trainer: document.getElementById("newTrainer").value,
      locker: "—",
      medical_notes: document.getElementById("newMedical").value.trim() || "None reported."
    };

    // Try to save to Supabase first
    try {
      const { data, error } = await sb.from('members').insert(newMemberData).select().single();
      if(error) throw error;
      
      // Add to local array with Supabase ID
      const newMember = {
        id: data.id,
        name: newMemberData.full_name,
        gender: newMemberData.gender,
        dob: newMemberData.dob,
        phone: newMemberData.phone,
        emergency: newMemberData.emergency_contact,
        address: newMemberData.address,
        reg: newMemberData.registration_date,
        status: newMemberData.status,
        expiry: newMemberData.end_date,
        plan: newMemberData.plan,
        trainer: newMemberData.trainer,
        locker: newMemberData.locker,
        medical: newMemberData.medical_notes,
        assess: {weight:"—",height:"—",bmi:"—",bodyFat:"—",muscle:"—",chest:"—",waist:"—",hip:"—",arm:"—",leg:"—",goals:"Onboard member",notes:"New member created.",date:new Date().toISOString().slice(0,10)},
        payments: [],
        attendance: [{in:"—",out:"—",method:"—",branch:"—"}]
      };
      members.push(newMember);
    } catch(e) {
      console.error('Error saving to Supabase:', e);
      // Fall back to local-only if Supabase fails
      const newMember = {
        id,
        name: newMemberData.full_name,
        gender: newMemberData.gender,
        dob: newMemberData.dob,
        phone: newMemberData.phone,
        emergency: newMemberData.emergency_contact,
        address: newMemberData.address,
        reg: newMemberData.registration_date,
        status: newMemberData.status,
        expiry: newMemberData.end_date,
        plan: newMemberData.plan,
        trainer: newMemberData.trainer,
        locker: newMemberData.locker,
        medical: newMemberData.medical_notes,
        assess: {weight:"—",height:"—",bmi:"—",bodyFat:"—",muscle:"—",chest:"—",waist:"—",hip:"—",arm:"—",leg:"—",goals:"Onboard member",notes:"New member created (local only)",date:new Date().toISOString().slice(0,10)},
        payments: [],
        attendance: [{in:"—",out:"—",method:"—",branch:"—"}]
      };
      members.push(newMember);
    }

    renderDashboard();
    renderMemberChips();
    renderMembersTable();
    renderAttendance();
    renderPayments();
    renderReports();
    closeDrawer();
  });
}

/* ============ SUPABASE INTEGRATION ============ */
async function loadMembersFromSupabase(){
  try {
    const { data, error } = await sb.from('members').select('*');
    if(error) {
      console.error('Error loading members:', error);
      return;
    }
    
    // Transform Supabase data to match app.js format
    if(data && data.length > 0) {
      members.length = 0; // Clear mock data
      data.forEach(m => {
        members.push({
          id: m.id,
          name: m.full_name || m.name,
          gender: m.gender || 'Other',
          dob: m.dob || '2000-01-01',
          phone: m.phone || '—',
          emergency: m.emergency_contact || '—',
          address: m.address || '—',
          reg: m.registration_date || m.start_date || new Date().toISOString().slice(0,10),
          status: m.status || 'active',
          expiry: m.end_date || m.expiry_date || '—',
          plan: m.plan || 'Basic Monthly',
          trainer: m.trainer || '—',
          locker: m.locker || '—',
          medical: m.medical_notes || 'None reported.',
          assess: {weight:"—",height:"—",bmi:"—",bodyFat:"—",muscle:"—",chest:"—",waist:"—",hip:"—",arm:"—",leg:"—",goals:"Onboard member",notes:"Data from Supabase",date:new Date().toISOString().slice(0,10)},
          payments: [],
          attendance: [{in:"—",out:"—",method:"—",branch:"—"}]
        });
      });
      
      // Re-render all views with real data
      renderDashboard();
      renderMemberChips();
      renderMembersTable();
      renderAttendance();
      renderPayments();
      renderLockers();
      renderReports();
    }
  } catch(e) {
    console.error('Supabase connection error:', e);
    // Fall back to mock data if Supabase fails
    renderDashboard();
    renderMemberChips();
    renderMembersTable();
    renderAttendance();
    renderPayments();
    renderLockers();
    renderReports();
  }
}

/* ============ INIT ============ */
// Try to load from Supabase first, fall back to mock data
loadMembersFromSupabase();
