import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Activity, ArrowDownToLine, ArrowLeft, ArrowRight, Bell, BookOpen, Check, CheckCircle2,
  ChevronDown, CircleHelp, Clock3, CreditCard, ExternalLink, FileText, GraduationCap,
  LayoutDashboard, LogOut, Menu, Search, Send, Settings2, ShieldCheck, Sparkles, X,
} from "lucide-react";
import { books, exams, faqs, notices, portalDescriptions, portals, subjects, taskFlows, timetable } from "./data.js";

const STORAGE = {
  requests: "taskpath_requests",
  completed: "taskpath_completed",
  progress: "taskpath_task_progress",
  read: "taskpath_notifications_read",
  preferences: "taskpath_preferences",
  user: "taskpath_user",
};

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function useLocalState(key, initial) {
  const [value, setValue] = useState(() => readStorage(key, initial));
  const update = (next) => {
    setValue(next);
    saveStorage(key, next);
  };
  return [value, update];
}

function App() {
  const [user, setUser] = useLocalState(STORAGE.user, { name: "Alex Student" });
  const [requests, setRequests] = useLocalState(STORAGE.requests, []);
  const [completed, setCompleted] = useLocalState(STORAGE.completed, []);
  const [taskProgress, setTaskProgress] = useLocalState(STORAGE.progress, {});
  const [readNotices, setReadNotices] = useLocalState(STORAGE.read, []);
  const [preferences, setPreferences] = useLocalState(STORAGE.preferences, { compact: false });
  const [mobileNav, setMobileNav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menu, setMenu] = useState("");
  const location = useLocation();

  useEffect(() => {
    setMobileNav(false);
    setSearchOpen(false);
    setMenu("");
  }, [location.pathname]);

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        setMenu("");
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenu("");
        setMobileNav(false);
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  if (!user) return <Login onLogin={(name) => setUser({ name })} />;

  return (
    <div className={`app-shell ${preferences.compact ? "compact" : ""}`}>
      {mobileNav && <button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <Sidebar mobileNav={mobileNav} />
      <div className="app-main">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu size={19} /></button>
          <div className="breadcrumb"><span>Student services</span><span className="breadcrumb-slash">/</span><strong>{pageTitle(location.pathname)}</strong></div>
          <div className="topbar-actions">
            <div className="global-search-wrap">
              <button className={`search-trigger ${searchOpen ? "active" : ""}`} onClick={() => setSearchOpen((open) => !open)} aria-expanded={searchOpen}>
                <Search size={16} /><span>Search portals, notices, actions...</span><kbd>Ctrl K</kbd>
              </button>
              {searchOpen && <SearchPanel query={searchQuery} setQuery={setSearchQuery} onClose={() => setSearchOpen(false)} />}
            </div>
            <div className="popover-wrap">
              <button className="icon-button notification-button" aria-label="Notifications" aria-expanded={menu === "notifications"} onClick={() => setMenu(menu === "notifications" ? "" : "notifications")}>
                <Bell size={18} />{notices.some((notice) => !readNotices.includes(notice.id)) && <i />}
              </button>
              {menu === "notifications" && <NotificationPanel readNotices={readNotices} markRead={() => setReadNotices(notices.map((n) => n.id))} />}
            </div>
            <div className="popover-wrap">
              <button className="profile-trigger" aria-expanded={menu === "profile"} onClick={() => setMenu(menu === "profile" ? "" : "profile")}>
                <span className="avatar">{initials(user.name)}</span><span className="profile-name">{user.name}</span><ChevronDown size={14} />
              </button>
              {menu === "profile" && <div className="dropdown-menu profile-dropdown">
                <div className="dropdown-user"><b>{user.name}</b><span>Demo student account</span></div>
                <Link to="/portal/profile"><Settings2 size={15} /> Profile preferences</Link>
                <button onClick={() => setUser(null)}><LogOut size={15} /> Sign out</button>
              </div>}
            </div>
          </div>
        </header>
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard user={user} requests={requests} completed={completed} />} />
            <Route path="/portal/:portalId" element={<PortalPage user={user} requests={requests} setRequests={setRequests} preferences={preferences} setPreferences={setPreferences} />} />
            <Route path="/tasks/:taskId" element={<TaskPage key={location.pathname} completed={completed} setCompleted={setCompleted} taskProgress={taskProgress} setTaskProgress={setTaskProgress} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function pageTitle(path) {
  if (path === "/") return "Dashboard";
  if (path.startsWith("/tasks/")) return "Guided task";
  const id = path.split("/").pop();
  return portals.find((portal) => portal.id === id)?.title || "Dashboard";
}

function Sidebar({ mobileNav }) {
  return <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
    <Link className="brand" to="/" aria-label="TaskPath home">
      <span className="brand-mark"><ArrowRight size={20} strokeWidth={2.8} /></span>
      <span><b>TaskPath</b><small>Student services</small></span>
    </Link>
    <div className="project-chip"><span className="live-dot" /> P26 · DESIGN THINKING</div>
    <nav className="side-nav" aria-label="Main navigation">
      <span className="nav-caption">WORKSPACE</span>
      <NavItem to="/" icon={LayoutDashboard} label="Overview" />
      <span className="nav-caption portal-caption">STUDENT PORTALS <span>12</span></span>
      {portals.map((portal) => <NavItem key={portal.id} to={`/portal/${portal.id}`} icon={portal.icon} label={portal.title.replace(" Portal", "")} />)}
      <span className="nav-caption help-caption">SUPPORT</span>
      <NavItem to="/portal/help" icon={CircleHelp} label="Help & FAQs" />
    </nav>
    <div className="sidebar-bottom">
      <div className="demo-card"><ShieldCheck size={16} /><div><b>Demo environment</b><span>Not an official LPU service</span></div></div>
      <div className="sidebar-project">INT335 · Group 9<br />Section K3P26YG</div>
    </div>
  </aside>;
}

function NavItem({ to, icon: Icon, label }) {
  const location = useLocation();
  const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
  return <Link to={to} className={`nav-item ${active ? "active" : ""}`}><Icon size={16} strokeWidth={active ? 2.2 : 1.8} /><span>{label}</span>{active && <span className="nav-active-mark" />}</Link>;
}

function Footer() {
  return <footer className="page-footer"><span>TaskPath · P26 — One Student, Seven Portals</span><span>INT335 Design Thinking · Group 9 · Illustrative prototype</span></footer>;
}

function Dashboard({ user, requests, completed }) {
  const navigate = useNavigate();
  const [noticeQuery, setNoticeQuery] = useState("");
  const firstName = user.name.split(" ")[0] || "Student";
  const visibleNotices = notices.filter((item) => item.title.toLowerCase().includes(noticeQuery.toLowerCase())).slice(0, 3);
  const upcoming = [
    { date: "02", month: "DEC", title: "Data Structures · Sample exam", meta: "09:30 AM · Confirm officially" },
    { date: "05", month: "DEC", title: "Design Thinking · Sample exam", meta: "09:30 AM · Confirm officially" },
    { date: "12", month: "DEC", title: "Library book return · Demo", meta: "Illustrative reminder" },
  ];
  return <div className="dashboard-page">
    <div className="demo-banner"><ShieldCheck size={16} /><span><b>Student demo environment</b> — sample information only. Not connected to official LPU systems.</span><button onClick={() => navigate("/portal/help")}>Learn more <ArrowRight size={13} /></button></div>
    <section className="welcome-row">
      <div><div className="eyebrow"><span className="eyebrow-line" /> YOUR STUDENT WORKSPACE</div><h1>Good afternoon, {firstName}<span className="gold-dot">.</span></h1><p>One place to find your next step across student services.</p></div>
      <div className="welcome-meta"><span className="term-label">DEMO ACADEMIC YEAR</span><strong>2026 – 2027</strong><span>Illustrative student profile</span></div>
    </section>
    <section className="summary-grid" aria-label="Student summary">
      <SummaryCard icon={GraduationCap} label="PROGRAMME" value="B.Tech. Computer Science" sub="Sample academic details" tone="blue" />
      <SummaryCard icon={Activity} label="ATTENDANCE OVERVIEW" value="84%" sub="Illustrative across subjects" tone="green" />
      <SummaryCard icon={CreditCard} label="FEE STATUS · DEMO" value="View breakdown" sub="No real dues or payments" tone="gold" action={() => navigate("/portal/fees")} />
      <SummaryCard icon={CheckCircle2} label="YOUR PROGRESS" value={`${completed.length} of 3 tasks`} sub={`${requests.length} demo requests created`} tone="violet" />
    </section>
    <section className="task-section">
      <div className="section-heading"><div><div className="eyebrow">A GOOD PLACE TO START</div><h2>I want to...</h2></div><span className="section-hint">Choose a task to get a guided checklist</span></div>
      <div className="task-grid">
        <TaskLaunch id="attendance" icon={Activity} title="Check attendance" detail="Find subject-wise records" />
        <TaskLaunch id="fees" icon={CreditCard} title="Pay fee / fine" detail="Verify details safely" />
        <TaskLaunch id="requests" icon={Send} title="Raise a request" detail="Create and track a request" />
        <Link className="task-launch" to="/portal/notices"><span className="task-icon rose"><FileText size={18} /></span><span className="task-copy"><b>Find a notice</b><small>Search announcements</small></span><ArrowRight size={16} className="task-arrow" /></Link>
        <Link className="task-launch" to="/portal/examinations"><span className="task-icon violet"><BookOpen size={18} /></span><span className="task-copy"><b>Exam details</b><small>Timetable and results</small></span><ArrowRight size={16} className="task-arrow" /></Link>
      </div>
    </section>
    <section className="portal-section">
      <div className="section-heading"><div><div className="eyebrow">ALL YOUR SERVICES</div><h2>Student portals</h2></div><span className="section-hint">{portals.length} connected sections <ArrowRight size={13} /></span></div>
      <div className="portal-grid">{portals.map((portal) => <PortalCard key={portal.id} portal={portal} />)}</div>
    </section>
    <section className="dashboard-bottom">
      <div className="content-panel notice-panel">
        <div className="panel-heading"><div><span className="panel-overline">CAMPUS UPDATES</span><h3>Recent notices</h3></div><Link to="/portal/notices" className="text-link">All notices <ArrowRight size={14} /></Link></div>
        <label className="inline-search"><Search size={15} /><input value={noticeQuery} onChange={(e) => setNoticeQuery(e.target.value)} placeholder="Filter notices..." aria-label="Filter recent notices" /></label>
        <div className="notice-list">{visibleNotices.map((notice) => <Link className="notice-row" to="/portal/notices" key={notice.id}><span className="notice-category">{notice.category}</span><span className="notice-title">{notice.title}</span><span className="notice-date">{notice.date}</span></Link>)}{visibleNotices.length === 0 && <EmptyState title="No matching notices" detail="Try a different search term." />}</div>
      </div>
      <div className="content-panel events-panel">
        <div className="panel-heading"><div><span className="panel-overline">PLAN AHEAD</span><h3>Upcoming events</h3></div><Link to="/portal/timetable" className="icon-link" aria-label="Open timetable"><ArrowRight size={16} /></Link></div>
        <div className="event-list">{upcoming.map((event) => <div className="event-row" key={event.title}><div className="event-date"><b>{event.date}</b><span>{event.month}</span></div><div><b>{event.title}</b><span>{event.meta}</span></div></div>)}</div>
      </div>
    </section>
    <div className="project-note"><Sparkles size={16} /><div><b>Designed around the student journey</b><span>TaskPath explores a task-first guide with clear portal labels, checklists, “stuck” tips, FAQs and completion steps—responding to reported login problems, scattered information and difficulty finding the right page.</span></div><Link to="/portal/help">About this project <ArrowRight size={13} /></Link></div>
  </div>;
}

function SummaryCard({ icon: Icon, label, value, sub, tone, action }) {
  const content = <><span className={`summary-icon ${tone}`}><Icon size={18} /></span><span className="summary-label">{label}</span><strong>{value}</strong><small>{sub}</small></>;
  return action ? <button className="summary-card summary-action" onClick={action}>{content}<ArrowRight size={14} className="summary-arrow" /></button> : <div className="summary-card">{content}</div>;
}

function TaskLaunch({ id, icon: Icon, title, detail }) {
  return <Link className="task-launch" to={`/tasks/${id}`}><span className={`task-icon ${id}`}><Icon size={18} /></span><span className="task-copy"><b>{title}</b><small>{detail}</small></span><ArrowRight size={16} className="task-arrow" /></Link>;
}

function PortalCard({ portal }) {
  const Icon = portal.icon;
  return <Link className="portal-card" to={`/portal/${portal.id}`}><span className={`portal-icon ${portal.tone}`}><Icon size={19} /></span><span className="portal-card-body"><b>{portal.title}</b><small>{portal.short}</small></span><ArrowRight size={15} className="portal-card-arrow" /></Link>;
}

function SearchPanel({ query, setQuery, onClose }) {
  const navigate = useNavigate();
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const portalMatches = portals.filter((p) => !q || `${p.title} ${p.short}`.toLowerCase().includes(q)).slice(0, 5).map((p) => ({ label: p.title, detail: "Student portal", to: `/portal/${p.id}`, icon: p.icon }));
    const noticeMatches = notices.filter((n) => q && `${n.title} ${n.category}`.toLowerCase().includes(q)).slice(0, 3).map((n) => ({ label: n.title, detail: `Notice · ${n.category}`, to: "/portal/notices", icon: FileText }));
    const actions = [
      { label: "Check attendance", detail: "Guided task", to: "/tasks/attendance", icon: Activity },
      { label: "Pay a fee or fine", detail: "Guided task · no payments", to: "/tasks/fees", icon: CreditCard },
      { label: "Raise a student request", detail: "Guided task", to: "/tasks/requests", icon: Send },
    ].filter((item) => !q || item.label.toLowerCase().includes(q));
    return [...portalMatches, ...noticeMatches, ...actions.slice(0, 2)].slice(0, 8);
  }, [query]);
  function choose(path) { navigate(path); onClose(); }
  return <div className="search-panel">
    <div className="search-input-wrap"><Search size={17} /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search portals, notices, actions..." aria-label="Search all student services" /><button className="icon-button small-icon" onClick={onClose} aria-label="Close search"><X size={15} /></button></div>
    <div className="search-panel-heading">{query ? "SEARCH RESULTS" : "QUICK LINKS"}</div>
    {matches.length ? matches.map((item, index) => { const Icon = item.icon; return <button className="search-result" key={`${item.label}-${index}`} onClick={() => choose(item.to)}><Icon size={16} /><span><b>{item.label}</b><small>{item.detail}</small></span><ArrowRight size={14} /></button>; }) : <div className="search-empty">No results. Try a portal name or task.</div>}
    <div className="search-foot"><span>Search all student services</span><kbd>ESC</kbd></div>
  </div>;
}

function NotificationPanel({ readNotices, markRead }) {
  return <div className="notification-panel"><div className="notification-heading"><b>Notifications</b><button onClick={markRead}>Mark all read</button></div>
    {notices.slice(0, 3).map((notice) => <Link key={notice.id} to="/portal/notices" className={`notification-item ${readNotices.includes(notice.id) ? "read" : ""}`}><i /><span><b>{notice.title}</b><small>{notice.date} · Sample notice</small></span></Link>)}
    <Link to="/portal/notices" className="notification-all">View all notices <ArrowRight size={14} /></Link>
  </div>;
}

function PortalPage({ user, requests, setRequests, preferences, setPreferences }) {
  const { portalId } = useParams();
  const portal = portals.find((item) => item.id === portalId);
  if (!portal) return <Navigate to="/" replace />;
  const Icon = portal.icon;
  return <div className="portal-page">
    <div className="portal-page-head">
      <div className="portal-page-icon"><Icon size={22} /></div>
      <div className="portal-page-title"><div className="eyebrow">STUDENT SERVICES / {portal.title.toUpperCase()}</div><h1>{portal.title}</h1><p>{portalDescriptions[portalId]}</p></div>
    </div>
    <div className="demo-inline"><ShieldCheck size={16} /><span><b>Illustrative demo information.</b> This prototype has no access to official LPU systems or student records.</span></div>
    <PortalContent portalId={portalId} user={user} requests={requests} setRequests={setRequests} preferences={preferences} setPreferences={setPreferences} />
  </div>;
}

function PortalContent({ portalId, user, requests, setRequests, preferences, setPreferences }) {
  switch (portalId) {
    case "academic": return <AcademicContent />;
    case "attendance": return <AttendanceContent />;
    case "fees": return <FeesContent />;
    case "examinations": return <ExaminationContent user={user} />;
    case "notices": return <NoticesContent />;
    case "requests": return <RequestContent requests={requests} setRequests={setRequests} />;
    case "library": return <LibraryContent />;
    case "timetable": return <TimetableContent />;
    case "hostel": return <HostelContent requests={requests} setRequests={setRequests} />;
    case "transport": return <TransportContent />;
    case "help": return <HelpContent requests={requests} setRequests={setRequests} />;
    case "profile": return <ProfileContent user={user} preferences={preferences} setPreferences={setPreferences} />;
    default: return null;
  }
}

function ContentCard({ title, eyebrow, children, action }) {
  return <section className="content-panel portal-content-card"><div className="panel-heading"><div>{eyebrow && <span className="panel-overline">{eyebrow}</span>}<h3>{title}</h3></div>{action}</div>{children}</section>;
}

function AcademicContent() {
  return <div className="portal-columns">
    <ContentCard title="Programme overview" eyebrow="ACADEMIC DETAILS"><div className="detail-grid"><InfoBlock label="Programme" value="B.Tech. Computer Science" /><InfoBlock label="Academic year" value="2026 – 2027 (sample)" /><InfoBlock label="Term" value="Semester 5 · illustrative" /><InfoBlock label="Credits this term" value="14 credits (sample)" /></div></ContentCard>
    <ContentCard title="Enrolled subjects" eyebrow="CURRENT TERM"><div className="table-wrap"><table><thead><tr><th>COURSE</th><th>SUBJECT</th><th>FACULTY</th><th>CREDITS</th></tr></thead><tbody>{subjects.map((s) => <tr key={s.code}><td><span className="course-code">{s.code}</span></td><td>{s.name}</td><td>{s.faculty}</td><td>{s.credits}</td></tr>)}</tbody></table></div></ContentCard>
    <div className="info-callout"><CircleHelp size={17} /><p>Subject and programme details here are sample content only. Confirm your course registration in the official academic system.</p></div>
  </div>;
}

function AttendanceContent() {
  const [period, setPeriod] = useState("Current term");
  return <div className="portal-columns">
    <div className="content-panel attendance-overview"><div><span className="panel-overline">ILLUSTRATIVE SUMMARY</span><h3>Overall attendance</h3><span className="attendance-score">84<span>%</span></span><p>Sample data only · no official record access</p></div><div className="circle-progress" aria-label="Illustrative attendance 84 percent"><span>84%</span></div></div>
    <ContentCard title="Subject-wise records" eyebrow="ATTENDANCE REGISTER" action={<select className="select-small" value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="Attendance period"><option>Current term</option><option>Last 30 days</option><option>All sample records</option></select>}>
      <div className="table-wrap"><table><thead><tr><th>SUBJECT</th><th>CLASSES HELD</th><th>ATTENDED</th><th>RATE</th><th>STATUS</th></tr></thead><tbody>{subjects.map((s, i) => <tr key={s.code}><td><b>{s.name}</b><small className="table-sub">{s.code}</small></td><td>{period === "Last 30 days" ? [8, 10, 9, 8][i] : [28, 27, 26, 27][i]}</td><td>{period === "Last 30 days" ? [7, 8, 9, 7][i] : [24, 21, 24, 22][i]}</td><td><span className={`rate ${s.attendance < 80 ? "rate-warn" : ""}`}>{s.attendance}%</span></td><td><span className={`status-pill ${s.attendance < 80 ? "status-warn" : "status-ok"}`}>{s.attendance < 80 ? "Review" : "On track"}</span></td></tr>)}</tbody></table></div>
    </ContentCard>
    <div className="info-callout"><CircleHelp size={17} /><p>If a subject looks below your expected attendance, confirm it in the official system. This sample tracker does not calculate eligibility.</p><Link to="/tasks/attendance">Follow attendance steps <ArrowRight size={13} /></Link></div>
  </div>;
}

function FeesContent() {
  const items = [["Tuition fee", "Illustrative"], ["Technology & services", "Illustrative"], ["Library fee", "Illustrative"], ["Hostel / transport", "Not included"]];
  return <div className="portal-columns">
    <div className="fee-summary content-panel"><div><span className="panel-overline">DEMO FEE OVERVIEW</span><h3>Sample fee breakdown</h3><p>Amounts are intentionally not shown as they are not actual dues.</p></div><span className="status-pill status-neutral">Not connected</span></div>
    <ContentCard title="Fee components" eyebrow="ILLUSTRATIVE ONLY"><div className="fee-list">{items.map(([name, value]) => <div className="fee-row" key={name}><span><CreditCard size={16} />{name}</span><b>{value}</b></div>)}</div><div className="fee-total"><span>Payment status</span><b>No payment in this prototype</b></div></ContentCard>
    <div className="safety-card"><span className="safety-icon"><ShieldCheck size={18} /></span><div><b>Keep payments on verified official systems</b><p>TaskPath does not accept payments, collect bank details, or link to unverified payment destinations. Confirm any due date or fine through official channels.</p><Link to="/tasks/fees">See the safe fee checklist <ArrowRight size={14} /></Link></div></div>
  </div>;
}

function ExaminationContent({ user }) {
  const [tab, setTab] = useState("timetable");
  return <div className="portal-columns">
    <div className="tab-bar" role="tablist" aria-label="Examination information">
      {[["timetable", "Exam timetable"], ["admit", "Admit-card demo"], ["results", "Results"]].map(([id, label]) => <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? "selected" : ""} onClick={() => setTab(id)}>{label}</button>)}
    </div>
    {tab === "timetable" && <ContentCard title="Upcoming exams" eyebrow="SAMPLE EXAM SCHEDULE"><div className="table-wrap"><table><thead><tr><th>DATE</th><th>TIME</th><th>SUBJECT</th><th>COURSE</th><th>VENUE</th></tr></thead><tbody>{exams.map((e) => <tr key={e.code}><td><b>{e.date}</b></td><td>{e.time}</td><td>{e.subject}</td><td><span className="course-code">{e.code}</span></td><td>{e.venue}</td></tr>)}</tbody></table></div></ContentCard>}
    {tab === "admit" && <ContentCard title="Admit-card preview" eyebrow="DEMO DOCUMENT"><div className="admit-card"><div className="admit-top"><span className="brand-mark"><GraduationCap size={19} /></span><div><b>Examination admit card</b><small>Illustrative preview · not valid for entry</small></div><span className="status-pill status-neutral">DEMO</span></div><div className="detail-grid"><InfoBlock label="Student" value={`${user.name} (demo display name)`} /><InfoBlock label="Programme" value="B.Tech. Computer Science" /><InfoBlock label="Term" value="Semester 5 (sample)" /><InfoBlock label="Exam schedule" value="See sample timetable" /></div><button className="button-secondary" disabled title="Official document download is not available in this demo"><ArrowDownToLine size={15} /> Download unavailable in demo</button></div></ContentCard>}
    {tab === "results" && <ContentCard title="Sample term results" eyebrow="ILLUSTRATIVE RESULTS"><div className="results-note"><CircleHelp size={18} /><div><b>No official results are available here</b><p>TaskPath is not connected to examination records. The result view is intentionally not populated with invented personal results.</p></div></div><Link className="button-secondary inline-button" to="/portal/help">Where to get help <ArrowRight size={15} /></Link></ContentCard>}
    <div className="info-callout"><ShieldCheck size={17} /><p>Exam dates, venues, admit cards and results must be verified through official university systems before taking action.</p></div>
  </div>;
}

function NoticesContent() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [open, setOpen] = useState(null);
  const categories = ["All categories", ...new Set(notices.map((notice) => notice.category))];
  const filtered = notices.filter((notice) => (category === "All categories" || notice.category === category) && `${notice.title} ${notice.body} ${notice.category}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="portal-columns">
    <div className="filter-toolbar"><label className="field-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notices..." aria-label="Search notices" /></label><select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter notices by category">{categories.map((item) => <option key={item}>{item}</option>)}</select><span className="filter-count">{filtered.length} notices</span></div>
    {filtered.length ? <div className="notice-results">{filtered.map((notice) => <article className={`notice-card ${open === notice.id ? "expanded" : ""}`} key={notice.id}><button className="notice-card-button" onClick={() => setOpen(open === notice.id ? null : notice.id)} aria-expanded={open === notice.id}><span className="notice-type-icon"><FileText size={17} /></span><span className="notice-card-content"><span className="notice-card-meta"><span className="notice-category">{notice.category}</span><span>{notice.date} · Sample</span></span><b>{notice.title}</b></span><ChevronDown size={17} /></button>{open === notice.id && <p className="notice-body">{notice.body}</p>}</article>)}</div> : <EmptyState title="No notices found" detail="Try another keyword or choose a different category." />}
  </div>;
}

const requestCategories = ["Academic query", "Fee clarification", "Hostel support", "Transport support", "Technical issue", "Other"];
function RequestContent({ requests, setRequests, categoryList = requestCategories }) {
  const [form, setForm] = useState({ category: categoryList[0], subject: "", details: "" });
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  function submit(e) {
    e.preventDefault();
    if (form.subject.trim().length < 4 || form.details.trim().length < 10) {
      setFeedback({ type: "error", text: "Add a clear subject (at least 4 characters) and details (at least 10 characters)." });
      return;
    }
    setSubmitting(true);
    const request = { ...form, id: `TP-${Date.now().toString().slice(-6)}`, status: "Received", date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) };
    window.setTimeout(() => {
      setRequests([request, ...requests]);
      setForm({ category: categoryList[0], subject: "", details: "" });
      setFeedback({ type: "success", text: `Demo request ${request.id} saved in this browser only. It was not sent to the university.` });
      setSubmitting(false);
    }, 350);
  }
  return <div className="portal-columns request-layout">
    <ContentCard title="Create a request" eyebrow="LOCAL DEMO REQUEST"><form className="form-stack" onSubmit={submit} noValidate>
      <label className="form-field">Request category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categoryList.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="form-field">Subject<input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} maxLength={80} placeholder="Briefly describe your request" required /></label>
      <label className="form-field">Details<textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} maxLength={500} rows={4} placeholder="Add context. Do not include passwords or sensitive account details." required /><span className="field-hint">{form.details.length}/500 · Use sample information only</span></label>
      {feedback && <FormMessage type={feedback.type} text={feedback.text} />}
      <button className="button-primary" type="submit" disabled={submitting}>{submitting ? <><span className="spinner" /> Saving demo request...</> : <><Send size={15} /> Submit demo request</>}</button>
    </form></ContentCard>
    <ContentCard title="Request tracker" eyebrow={`${requests.length} LOCAL ${requests.length === 1 ? "REQUEST" : "REQUESTS"}`} action={<span className="status-pill status-neutral">This browser only</span>}>
      {requests.length ? <div className="request-list">{requests.map((request) => <div className="request-row" key={request.id}><div className="request-row-top"><b>{request.subject}</b><span className="status-pill status-ok">{request.status}</span></div><span>{request.category} · {request.id}</span><small>{request.date}</small></div>)}</div> : <EmptyState title="No demo requests yet" detail="Submit a sample request to see it appear here." />}
    </ContentCard>
  </div>;
}

function LibraryContent() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All subjects");
  const [issued, setIssued] = useState([]);
  const categories = ["All subjects", ...new Set(books.map((book) => book.category))];
  const matches = books.filter((book) => (category === "All subjects" || book.category === category) && `${book.title} ${book.author}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="portal-columns">
    <div className="filter-toolbar"><label className="field-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title or author..." aria-label="Search books" /></label><select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by book category">{categories.map((item) => <option key={item}>{item}</option>)}</select><span className="filter-count">{matches.length} books</span></div>
    <ContentCard title="Sample catalogue" eyebrow="LIBRARY COLLECTION"><div className="book-list">{matches.map((book) => { const isIssued = issued.includes(book.title); return <div className="book-row" key={book.title}><span className="book-cover"><BookOpen size={19} /></span><div className="book-info"><b>{book.title}</b><span>{book.author}</span><small>{book.category}</small></div><span className={`status-pill ${book.status === "Available" ? "status-ok" : "status-neutral"}`}>{book.status}</span><button className="button-quiet" onClick={() => setIssued(isIssued ? issued.filter((name) => name !== book.title) : [...issued, book.title])}>{isIssued ? "Undo demo" : "Issue demo"}</button></div>; })}{!matches.length && <EmptyState title="No books found" detail="Try a different search or category." />}</div></ContentCard>
    <div className="info-callout"><Library size={17} /><p>Availability and issue actions are demonstrations only. No library catalogue or circulation system is connected.</p></div>
  </div>;
}

function TimetableContent() {
  const [day, setDay] = useState("All days");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return <div className="portal-columns">
    <ContentCard title="Weekly class schedule" eyebrow="SAMPLE TIMETABLE" action={<select className="select-small mobile-day-select" value={day} onChange={(e) => setDay(e.target.value)} aria-label="Choose timetable day"><option>All days</option>{days.map((d) => <option key={d}>{d}</option>)}</select>}>
      <div className="table-wrap timetable-wrap"><table className="timetable-table"><thead><tr><th>TIME</th>{days.filter((d) => day === "All days" || d === day).map((d) => <th key={d}>{d}</th>)}</tr></thead><tbody>{timetable.map((row) => <tr key={row.time}><td><b>{row.time}</b></td>{days.filter((d) => day === "All days" || d === day).map((d) => <td key={d}><span className={row[d] === "Open study" || row[d] === "Library hour" ? "schedule-muted" : "schedule-class"}>{row[d]}</span></td>)}</tr>)}</tbody></table></div>
    </ContentCard>
    <ContentCard title="Academic calendar" eyebrow="UPCOMING DATES"><div className="calendar-list"><CalendarEvent date="02 Dec 2026" title="Sample exam period begins" /><CalendarEvent date="12 Dec 2026" title="Illustrative library reminder" /><CalendarEvent date="18 Dec 2026" title="Sample term-end marker" /></div></ContentCard>
    <div className="info-callout"><Clock3 size={17} /><p>Schedule and dates are examples for the TaskPath project, not official class or examination appointments.</p></div>
  </div>;
}

function CalendarEvent({ date, title }) { return <div className="calendar-event"><span><CalendarDays size={16} /></span><div><small>{date}</small><b>{title}</b></div><span className="status-pill status-neutral">Sample</span></div>; }

function HostelContent({ requests, setRequests }) {
  const [roomTab, setRoomTab] = useState("Room details");
  const [submitted, setSubmitted] = useState(false);
  return <div className="portal-columns">
    <div className="tab-bar" role="tablist" aria-label="Hostel sections">{["Room details", "Hostel request", "Notices"].map((item) => <button key={item} role="tab" aria-selected={roomTab === item} className={roomTab === item ? "selected" : ""} onClick={() => setRoomTab(item)}>{item}</button>)}</div>
    {roomTab === "Room details" && <ContentCard title="Hostel accommodation" eyebrow="ILLUSTRATIVE DETAILS"><div className="detail-grid"><InfoBlock label="Residence" value="Sample residence" /><InfoBlock label="Room" value="Details not connected" /><InfoBlock label="Meal plan" value="Confirm officially" /><InfoBlock label="Support status" value="No live record" /></div><div className="info-callout inner-callout"><Home size={17} /><p>No personal hostel assignment is shown. Confirm room and residence information through an official channel.</p></div></ContentCard>}
    {roomTab === "Hostel request" && <ContentCard title="Hostel support request" eyebrow="DEMO FORM"><p className="body-copy">Create a local demo request for a hostel-related question. No information is sent to staff.</p><button className="button-primary" disabled={submitted} onClick={() => { setRequests([{ id: `TP-${Date.now().toString().slice(-6)}`, category: "Hostel support", subject: "Sample hostel support request", details: "Demo", status: "Received", date: new Date().toLocaleDateString("en-GB") }, ...requests]); setSubmitted(true); }}>{submitted ? <><Check size={15} /> Saved in this browser</> : <><Send size={15} /> Create sample request</>}</button>{submitted && <FormMessage type="success" text="Your demo request was saved locally and was not sent to the university." />}</ContentCard>}
    {roomTab === "Notices" && <ContentCard title="Hostel notices" eyebrow="SAMPLE UPDATES"><div className="calendar-list"><CalendarEvent date="18 Nov 2026" title="Quiet-hours reminder (illustrative)" /><CalendarEvent date="15 Nov 2026" title="Maintenance contact information (sample)" /></div></ContentCard>}
  </div>;
}

function TransportContent() {
  const routes = [{ name: "North campus loop", stops: "Main gate · Library · Residence area", time: "08:00 AM · Sample" }, { name: "City connection", stops: "Campus hub · Central interchange", time: "08:30 AM · Sample" }, { name: "Evening return", stops: "Campus hub · Main gate", time: "05:15 PM · Sample" }];
  const [selected, setSelected] = useState("");
  return <div className="portal-columns">
    <ContentCard title="Sample transport routes" eyebrow="ROUTE INFORMATION"><div className="route-list">{routes.map((route, i) => <div className={`route-card ${selected === route.name ? "route-selected" : ""}`} key={route.name}><span className="route-number">0{i + 1}</span><div className="route-details"><b>{route.name}</b><span>{route.stops}</span><small><Clock3 size={13} /> {route.time}</small></div><button className="button-secondary" onClick={() => setSelected(selected === route.name ? "" : route.name)}>{selected === route.name ? "Selected" : "View route"}</button></div>)}</div></ContentCard>
    {selected && <ContentCard title={`${selected} · sample stops`} eyebrow="ROUTE PREVIEW"><div className="route-stops">{["Campus hub", "Library junction", "Residence area", "Main gate"].map((stop, i) => <div className="route-stop" key={stop}><span>{i + 1}</span><b>{stop}</b><small>Illustrative stop</small></div>)}</div></ContentCard>}
    <div className="info-callout"><Bus size={17} /><p>Route names, stops, times and availability are illustrative. Confirm current transport services through official university channels.</p></div>
  </div>;
}

function HelpContent({ requests, setRequests }) {
  const [faqQuery, setFaqQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const [open, setOpen] = useState(0);
  const categories = ["All topics", ...new Set(faqs.map((faq) => faq.category))];
  const filtered = faqs.filter((faq) => (category === "All topics" || faq.category === category) && `${faq.q} ${faq.a}`.toLowerCase().includes(faqQuery.toLowerCase()));
  return <div className="portal-columns help-layout">
    <ContentCard title="Frequently asked questions" eyebrow="QUICK ANSWERS">
      <div className="filter-toolbar faq-filter"><label className="field-search"><Search size={16} /><input value={faqQuery} onChange={(e) => setFaqQuery(e.target.value)} placeholder="Search FAQs..." aria-label="Search FAQs" /></label><select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter FAQs">{categories.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="faq-list">{filtered.map((faq, i) => <div className={`faq-item ${open === i ? "faq-open" : ""}`} key={faq.q}><button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}><span>{faq.q}</span><ChevronDown size={16} /></button>{open === i && <p>{faq.a}</p>}</div>)}{!filtered.length && <EmptyState title="No answers found" detail="Try another keyword or topic." />}</div>
    </ContentCard>
    <RequestContent requests={requests} setRequests={setRequests} categoryList={["Technical issue", "Account access guidance", "Portal navigation", "Other"]} />
  </div>;
}

function ProfileContent({ user, preferences, setPreferences }) {
  const [saved, setSaved] = useState(false);
  const [compact, setCompact] = useState(Boolean(preferences.compact));
  return <div className="portal-columns profile-layout">
    <ContentCard title="Sample student profile" eyebrow="PROFILE DETAILS"><div className="profile-summary"><span className="profile-avatar-large">{initials(user.name)}</span><div><b>{user.name}</b><span>Sample demo profile · no real student record</span></div></div><div className="detail-grid profile-details"><InfoBlock label="Programme" value="B.Tech. Computer Science" /><InfoBlock label="Academic year" value="2026 – 2027 · sample" /><InfoBlock label="Term" value="Semester 5 · illustrative" /><InfoBlock label="Student ID" value="Not provided in demo" /></div><div className="info-callout inner-callout"><ShieldCheck size={17} /><p>We use sample data only. Do not enter real student identifiers or sensitive personal information.</p></div></ContentCard>
    <ContentCard title="Display preferences" eyebrow="SAVED IN THIS BROWSER"><div className="preference-row"><div><b>Compact layout</b><span>Reduce spacing across dashboard cards</span></div><button type="button" className={`toggle ${compact ? "on" : ""}`} role="switch" aria-checked={compact} aria-label="Compact layout" onClick={() => { setCompact(!compact); setPreferences({ ...preferences, compact: !compact }); setSaved(false); }}><span /></button></div>
      <button className="button-primary" onClick={() => { setPreferences({ ...preferences, compact }); setSaved(true); }}><Check size={15} /> Save preferences</button>{saved && <FormMessage type="success" text="Your display preference has been saved in this browser." />}
    </ContentCard>
  </div>;
}

function TaskPage({ completed, setCompleted, taskProgress, setTaskProgress }) {
  const { taskId } = useParams();
  const flow = taskFlows[taskId];
  const [step, setStep] = useState(taskProgress[taskId] || 0);
  const [finished, setFinished] = useState(completed.includes(taskId));
  if (!flow) return <Navigate to="/" replace />;
  const done = finished || step >= flow.steps.length;
  function complete() {
    const next = completed.includes(taskId) ? completed : [...completed, taskId];
    setCompleted(next);
    setTaskProgress({ ...taskProgress, [taskId]: flow.steps.length });
    setFinished(true);
  }
  function changeStep(nextStep) {
    setStep(nextStep);
    setTaskProgress({ ...taskProgress, [taskId]: nextStep });
  }
  return <div className="task-page">
    <Link to="/" className="back-link"><ArrowLeft size={15} /> Back to overview</Link>
    <div className="task-header"><div className="task-header-tag"><Sparkles size={15} /> GUIDED TASK · I WANT TO...</div><h1>{done ? "Task complete" : flow.title}<span className="gold-dot">.</span></h1><p>{done ? "You’ve reached the end of this illustrative checklist." : flow.intro}</p></div>
    <div className="task-layout">
      <div className="task-main-card content-panel">
        {done ? <div className="completion-screen"><span className="completion-icon"><CheckCircle2 size={28} /></span><span className="panel-overline">CHECKLIST COMPLETE</span><h2>Nice work. You’re all set.</h2><p>{flow.title} guide marked complete. Remember, the steps and data in TaskPath are illustrative—confirm important details through official systems.</p><div className="completion-actions"><Link className="button-primary inline-button" to={`/portal/${taskId === "fees" ? "fees" : taskId}`}><ArrowRight size={15} /> Open {flow.portal}</Link><Link className="button-secondary inline-button" to="/">Return to overview</Link></div></div> :
          <>
            <div className="task-card-top"><div><span className="panel-overline">YOUR CHECKLIST</span><h2>{flow.title}</h2></div><span className="step-count">STEP {step + 1} OF {flow.steps.length}</span></div>
            <div className="progress-track" role="progressbar" aria-valuenow={Math.round((step / flow.steps.length) * 100)} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${(step / flow.steps.length) * 100}%` }} /></div>
            <div className="task-step-list">{flow.steps.map((item, index) => <div className={`task-step ${index === step ? "current" : index < step ? "finished" : ""}`} key={item.title}><span className="step-number">{index < step ? <Check size={15} /> : index + 1}</span><div className="step-copy"><b>{item.title}</b>{index <= step && <p>{item.body}</p>}{index === step && <Link className="step-portal-link" to={`/portal/${taskId === "fees" ? "fees" : taskId}`}><ExternalLink size={13} /> Relevant section: {flow.portal}</Link>}</div></div>)}</div>
            <div className="task-controls"><button className="button-secondary" onClick={() => changeStep(Math.max(0, step - 1))} disabled={step === 0}><ArrowLeft size={15} /> Previous</button>{step < flow.steps.length - 1 ? <button className="button-primary" onClick={() => changeStep(step + 1)}>Next step <ArrowRight size={15} /></button> : <button className="button-primary" onClick={complete}><Check size={15} /> Mark as done</button>}</div>
          </>}
      </div>
      <aside className="task-help-column">
        <div className="task-help-card"><div className="task-help-title"><CircleHelp size={17} /><b>Stuck? Need help?</b></div><p>Try the relevant portal directly, or look at a quick answer below.</p><Link to="/portal/help" className="button-secondary help-link">Visit Help Desk <ArrowRight size={14} /></Link></div>
        <div className="task-help-card faq-side"><span className="panel-overline">COMMON QUESTIONS</span>{flow.faqs.map((faq) => <div className="task-faq" key={faq}><b>{faq.split("?")[0]}?</b><p>{faq.split("?").slice(1).join("?").trim()}</p></div>)}</div>
        <div className="task-demo-note"><ShieldCheck size={15} /><span>Illustrative instructions only. Verify against actual LPU systems.</span></div>
      </aside>
    </div>
  </div>;
}

function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  function submit(e) {
    e.preventDefault();
    if (name.trim().length < 2) { setError("Enter a display name with at least 2 characters."); return; }
    onLogin(name.trim());
  }
  return <div className="login-screen"><div className="login-side"><Link className="brand login-brand" to="/"><span className="brand-mark"><ArrowRight size={20} /></span><span><b>TaskPath</b><small>Student services</small></span></Link><div className="login-message"><div className="eyebrow"><span className="eyebrow-line" /> P26 · INT335 DESIGN THINKING</div><h1>Find your next step.<span className="gold-dot">.</span></h1><p>A student-first guide to services, tasks and campus information—in one place.</p><div className="login-project">One Student, Seven Portals <span>·</span> Group 9 · Section K3P26YG</div></div><span className="login-side-footer">Student demo environment · Not an official LPU service</span></div><div className="login-form-side"><form className="login-form" onSubmit={submit}><span className="login-symbol"><GraduationCap size={21} /></span><span className="panel-overline">DEMO ACCESS</span><h2>Welcome to TaskPath</h2><p>Use a display name to explore the prototype. No password is needed or collected.</p><label className="form-field">Your display name<input value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="e.g. Alex Student" autoComplete="name" required /></label>{error && <FormMessage type="error" text={error} />}<button className="button-primary login-submit" type="submit">Enter demo <ArrowRight size={16} /></button><div className="login-notice"><ShieldCheck size={15} /><span>Never enter an LPU password or real payment details into a prototype.</span></div></form></div></div>;
}

function InfoBlock({ label, value }) { return <div className="info-block"><span>{label}</span><b>{value}</b></div>; }
function FormMessage({ type, text }) { return <div className={`form-message ${type}`} role={type === "error" ? "alert" : "status"}>{type === "error" ? <CircleHelp size={15} /> : <CheckCircle2 size={15} />}{text}</div>; }
function EmptyState({ title, detail }) { return <div className="empty-state"><span><Search size={18} /></span><b>{title}</b><p>{detail}</p></div>; }
function initials(name) { return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("") || "ST"; }

export default App;
