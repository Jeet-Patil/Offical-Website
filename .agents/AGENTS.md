# Workspace Guidelines for AI Coding Assistants (AGENTS.md)

Welcome, Agent! This document contains project-specific patterns, commands, and code rules for the Design and Software Development Club (DESOC) website codebase. Please adhere to these rules when working on this repository.

---

## 🏗️ Project Layout & Entry Points

- **Frontend (React)**: Located in the root directory.
  - Entry Point: [src/main.jsx](./src/main.jsx)
  - Routing Table: [src/App.jsx](./src/App.jsx)
  - Layout Components: Navbar is at [src/components/Navbar.jsx](./src/components/Navbar.jsx)
- **Backend (Node.js/Express)**: Located in the `server/` directory.
  - Entry Point: [server/src/index.js](./server/src/index.js)
  - DB Connection: [server/src/db.js](./server/src/db.js)

---

## 🛠️ Build & Run Commands

When starting, running, or installing dependencies:
- **Root (Frontend)**:
  - Install: `npm install`
  - Development Dev Server: `npm run dev`
  - Build: `npm run build`
- **Server Folder (Backend)**:
  - Install: `npm install`
  - Development Server (Nodemon): `npm run dev`
  - Production Start: `npm run start`

---

## 📋 Coding Patterns & Tech Guidelines

### 1. Database Connection & DNS Fallback
- Connections to MongoDB must use the `connectDB()` logic from [server/src/db.js](./server/src/db.js).
- **DNS Resolution Caveat**: On some routers/networks, resolving Mongo SRV URLs can trigger `querySrv` or `ECONNREFUSED` exceptions. The connection logic catches these errors and sets DNS servers to Google (`8.8.8.8`) and Cloudflare (`1.1.1.1`) public resolvers dynamically. Avoid changing or removing this exception handling.

### 2. Multi-Part File Uploads & Cloudinary
- The project has two separate Multer configurations:
  - **Resume Uploads**: Handled via `uploadDoc` middleware ([server/src/middleware/uploadDoc.js](./server/src/middleware/uploadDoc.js)). Restricts files to 10MB maximum size and document types. Saves to the `recruitment/resumes` Cloudinary directory.
  - **Payment Uploads**: Handled via `upload` middleware ([server/src/middleware/upload.js](./server/src/middleware/upload.js)). Restricts files to 5MB maximum size and image types. Saves to the `genesis/payment-screenshots` Cloudinary directory.
- Always perform schema updates or server validation checks (e.g. check for existing unique email/phone entries) **before** streaming files to Cloudinary to avoid leaving unused orphan files in Cloudinary.

### 3. Google Sheets Synchronization
- All submissions are mirrored in a tracking spreadsheet using the functions defined in [server/src/sheets.js](./server/src/sheets.js).
- **WARNING**: The column ordering in the spreadsheet must match the row arrays specified in `appendRow` (for registrations) and `appendRecruitmentRow` (for recruitment applications) exactly.
- If you modify or add database fields, check and update the corresponding sheets-sync functions to make sure headers and columns align perfectly.

### 4. Genesis Registrations Status
- Note that the routing endpoint for Genesis registrations (`/api/genesis`) is currently commented out in [server/src/index.js](./server/src/index.js). If you are instructed to implement or update event registrations, uncomment this route and use [server/src/routes/register.js](./server/src/routes/register.js).

### 5. Frontend CSS & Styling
- The design system uses Tailwind CSS supplemented by specific Vanilla CSS rules in `src/index.css` and page components.
- Do not introduce arbitrary utility classes that break the dark-mode aesthetic (vibrant gradients, card borders with low opacities, and glassmorphism backdrops). Always check existing pages like `RecruitmentPage.jsx` and `RegistrationPage.jsx` for existing classes.
