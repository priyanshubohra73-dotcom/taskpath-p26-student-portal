import {
  BookOpen, Bus, CalendarDays, ClipboardList, CreditCard, GraduationCap,
  Headphones, Home, Library, Megaphone, UserRound,
} from "lucide-react";

export const portals = [
  { id: "academic", title: "Academic Portal", short: "Courses, subjects & academic information", icon: GraduationCap, tone: "blue" },
  { id: "attendance", title: "Attendance Portal", short: "Review attendance by subject", icon: ClipboardList, tone: "green" },
  { id: "fees", title: "Fee Portal", short: "Understand fee dues and demo status", icon: CreditCard, tone: "gold" },
  { id: "examinations", title: "Examination Portal", short: "Timetables, admit-card demo & results", icon: BookOpen, tone: "violet" },
  { id: "notices", title: "Notice Portal", short: "Find announcements and circulars", icon: Megaphone, tone: "rose" },
  { id: "requests", title: "Student Request Portal", short: "Submit and track demo requests", icon: ClipboardList, tone: "teal" },
  { id: "library", title: "Library Portal", short: "Search the sample book catalogue", icon: Library, tone: "blue" },
  { id: "timetable", title: "Timetable Portal", short: "Weekly schedule and key dates", icon: CalendarDays, tone: "gold" },
  { id: "hostel", title: "Hostel Portal", short: "Room information and requests", icon: Home, tone: "violet" },
  { id: "transport", title: "Transport Portal", short: "Routes and transport information", icon: Bus, tone: "green" },
  { id: "help", title: "Help Desk Portal", short: "Browse FAQs or contact the demo desk", icon: Headphones, tone: "rose" },
  { id: "profile", title: "Student Profile Portal", short: "Academic details and preferences", icon: UserRound, tone: "teal" },
];

export const notices = [
  { id: "n1", category: "Academic", title: "Course registration: review your planned subjects", date: "20 Nov 2026", body: "Review the subjects shown in the Academic Portal before your next advising session. This is a sample notice for the TaskPath prototype." },
  { id: "n2", category: "Examinations", title: "End-term examination timetable — demo", date: "18 Nov 2026", body: "A sample examination schedule is available in the Examination Portal. Confirm all dates and locations through official university channels." },
  { id: "n3", category: "Campus", title: "Library hours during the study period", date: "16 Nov 2026", body: "This illustrative campus notice demonstrates how students could browse updates by category in one place." },
  { id: "n4", category: "Student services", title: "Student service request tracking", date: "14 Nov 2026", body: "Use the Student Request Portal demo to submit a sample request and follow its status." },
  { id: "n5", category: "Campus", title: "Transport route information", date: "12 Nov 2026", body: "Sample route names and timings are illustrative. Check official transport information before travelling." },
];

export const faqs = [
  { category: "Getting started", q: "Is TaskPath an official LPU service?", a: "No. TaskPath is an INT335 Design Thinking project prototype. It does not connect to LPU systems or verify student records." },
  { category: "Getting started", q: "What should I do if I cannot find a portal?", a: "Use the search at the top of the page, or choose a task from “I want to…” to follow a guided route." },
  { category: "Account access", q: "I am having trouble signing in to an official system. Can TaskPath reset it?", a: "No. This demo cannot access or reset official accounts. Use verified university support channels and never share your password here." },
  { category: "Fees", q: "Can I pay fees or fines in this prototype?", a: "No. Fee information here is illustrative only; there is no payment processing. Follow a verified official destination for payment." },
  { category: "Requests", q: "Are requests sent to the university?", a: "No. Demo requests are stored only in this browser’s local storage and are not submitted to LPU." },
  { category: "Privacy", q: "What information does this demo save?", a: "Only sample preferences, demo task progress, notification read status, and requests you create, stored locally in this browser." },
];

export const subjects = [
  { code: "INT335", name: "Design Thinking", faculty: "Faculty member (sample)", credits: 3, attendance: 86 },
  { code: "CSE205", name: "Data Structures", faculty: "Faculty member (sample)", credits: 4, attendance: 78 },
  { code: "CSE202", name: "Database Management Systems", faculty: "Faculty member (sample)", credits: 4, attendance: 92 },
  { code: "MTH203", name: "Discrete Mathematics", faculty: "Faculty member (sample)", credits: 3, attendance: 81 },
];

export const timetable = [
  { time: "09:00 – 10:00", Mon: "Design Thinking", Tue: "Data Structures", Wed: "Discrete Mathematics", Thu: "Design Thinking", Fri: "Database Systems" },
  { time: "10:00 – 11:00", Mon: "Database Systems", Tue: "Discrete Mathematics", Wed: "Data Structures", Thu: "Database Systems", Fri: "Design Thinking" },
  { time: "11:30 – 12:30", Mon: "Data Structures", Tue: "Database Systems", Wed: "Design Thinking", Thu: "Discrete Mathematics", Fri: "Data Structures" },
  { time: "14:00 – 15:00", Mon: "Tutorial / Lab", Tue: "Library hour", Wed: "Tutorial / Lab", Thu: "Project studio", Fri: "Open study" },
];

export const exams = [
  { date: "02 Dec 2026", time: "09:30 AM", subject: "Data Structures", code: "CSE205", venue: "See official timetable" },
  { date: "05 Dec 2026", time: "09:30 AM", subject: "Design Thinking", code: "INT335", venue: "See official timetable" },
  { date: "09 Dec 2026", time: "02:00 PM", subject: "Database Management Systems", code: "CSE202", venue: "See official timetable" },
];

export const books = [
  { title: "The Design of Everyday Things", author: "Don Norman", category: "Design", status: "Available" },
  { title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest & Stein", category: "Computing", status: "Available" },
  { title: "Database System Concepts", author: "Silberschatz, Korth & Sudarshan", category: "Computing", status: "On loan" },
  { title: "Discrete Mathematics and Its Applications", author: "Kenneth H. Rosen", category: "Mathematics", status: "Available" },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "General", status: "On loan" },
];

export const taskFlows = {
  attendance: {
    title: "Check attendance",
    portal: "Attendance Portal",
    intro: "Follow this illustrative checklist to find a subject-wise attendance view.",
    steps: [
      { title: "Open the Attendance Portal", body: "Choose Attendance Portal from the launcher or navigation menu. In this prototype, the figures are sample data only." },
      { title: "Choose a subject", body: "Compare the subject rows and locate the course you want to review. Check the latest date and total classes in the official system." },
      { title: "Confirm the record", body: "If something looks incorrect, note the course and date, then contact the appropriate official academic support channel." },
    ],
    faqs: ["Why might attendance differ between systems? Demo figures are not synced; confirm your record in the official system.", "Where can I ask about a correction? Use a verified university contact, not this prototype."],
  },
  fees: {
    title: "Pay a fee or fine",
    portal: "Fee Portal",
    intro: "Use these steps to locate fee information safely. TaskPath does not process payments.",
    steps: [
      { title: "Review the Fee Portal", body: "Open Fee Portal and inspect the illustrative fee breakdown. No amounts shown here are actual student dues." },
      { title: "Verify details officially", body: "Sign in only through a verified official university destination and confirm your student details, amount, and due date there." },
      { title: "Use the official payment route", body: "Complete any payment only on the verified official system. Never enter payment details into TaskPath." },
    ],
    faqs: ["Can I pay here? No. There is no payment processing or external payment link in this demo.", "What if I see a fine? Confirm the reason and amount through an official university channel."],
  },
  requests: {
    title: "Raise a student request",
    portal: "Student Request Portal",
    intro: "Create a local demo request and see how a simple status tracker can help students follow progress.",
    steps: [
      { title: "Choose a request category", body: "Open Student Request Portal and select the category that best matches your question." },
      { title: "Describe what you need", body: "Enter a short summary. Use sample information only—do not include sensitive personal or account details." },
      { title: "Submit and track", body: "Submit the form. It is saved in this browser only and is not sent to university staff." },
    ],
    faqs: ["Will staff receive this request? No, it remains in browser local storage.", "Can I include my password? Never include passwords or sensitive information."],
  },
};

export const portalDescriptions = {
  academic: "Sample course information for exploring a more unified student experience.",
  attendance: "Illustrative attendance only—not connected to official class records.",
  fees: "A sample fee breakdown for demonstration; no real dues or payment processing.",
  examinations: "Illustrative exam dates and results. Verify all details with official university systems.",
  notices: "Search and filter sample announcements, circulars, and service updates.",
  requests: "Create and track browser-local demo requests. Nothing is sent to the university.",
  library: "Browse a small sample catalogue. Availability is not connected to a live library.",
  timetable: "Example weekly schedule and academic dates for the prototype.",
  hostel: "Illustrative room information, requests, and notices for the prototype.",
  transport: "Sample route details only. Confirm current routes through official channels.",
  help: "Find answers to common demo questions or send a local sample support request.",
  profile: "Sample student profile and locally saved display preferences.",
};
