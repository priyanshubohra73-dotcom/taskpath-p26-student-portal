# TaskPath

**P26 — One Student, Seven Portals** · INT335 Design Thinking · Group 9 · Section K3P26YG

TaskPath is a student-first, task-oriented university services prototype. It explores a unified dashboard and guided checklists to address reported login problems, scattered information, and difficulty finding the right page. The prototype is illustrative and does not connect to LPU systems.

## Run locally

### No-install option

Open [`Standalone.html`](./Standalone.html) directly in a modern browser. It is a self-contained version and does not need Node.js, npm, a web server, or an internet connection.

### React/Vite development version

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview a production build:

```bash
npm run build
npm run preview
```

## Demo behavior

- Enter a display name to explore; no password is requested or stored.
- Requests, task completion, notification read status, and display preferences are saved in this browser's local storage.
- Sample attendance, fee descriptions, academic details, books, routes, notices, schedules, and exam dates are illustrative. No real student records are used.
- There is no payment processing, official login, database connection, or university request submission. Verify information and destinations through official LPU channels.

## Project structure

- `src/data.js` — centrally maintained portal definitions, notices, FAQs, sample course/catalogue data, and task checklists.
- `src/App.jsx` — shared application shell, React Router routes, reusable UI, forms, and portal screens.
- `src/styles.css` — responsive layout, accessible focus states, and shared visual system.
