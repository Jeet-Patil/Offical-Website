# DESOC Official Website & Event Portal

Welcome to the official repository for the **Design and Software Development Club (DESOC)** website and its integrated event/recruitment systems.

---

## 🏗️ Project Layout

This repository is split into a React frontend client and a Node.js/Express backend server:

- **Frontend (Root Directory)**: React application powered by Vite and Tailwind CSS.
  - **Routing**: Defined in [src/App.jsx](./src/App.jsx).
  - **Navigation & Layout**: Shared components like the navigation bar and footer are in [src/components/Navbar.jsx](./src/components/Navbar.jsx) and [src/components/Footer.jsx](./src/components/Footer.jsx).
  - **Pages**: Main pages are in `src/pages/`, including:
    - [Home.jsx](./src/pages/Home.jsx): Home landing page.
    - [AboutPage.jsx](./src/pages/AboutPage.jsx): Society highlights and core information.
    - [CommitteePage.jsx](./src/pages/CommitteePage.jsx): Details about current members.
    - [AlumniPage.jsx](./src/pages/AlumniPage.jsx): Profiles of notable club alumni.
    - [GenesisPage.jsx](./src/pages/GenesisPage.jsx) & [RegistrationPage.jsx](./src/pages/RegistrationPage.jsx): Portal for Genesis events information and team registrations.
    - [RecruitmentPage.jsx](./src/pages/RecruitmentPage.jsx): Multi-section member recruitment application.
    - [BidAndBuildPage.jsx](./src/pages/BidAndBuildPage.jsx) & [BidAndBuildEventPage.jsx](./src/pages/BidAndBuildEventPage.jsx): Live auction sub-event page.

- **Backend (`/server`)**: Node.js REST API using Express and MongoDB.
  - **Server Entrypoint**: Located at [server/src/index.js](./server/src/index.js).
  - **Database Connection**: Configured in [server/src/db.js](./server/src/db.js) with custom DNS query fallback logic.
  - **Models & Routes**: Mongoose schemas are stored in `server/src/models/` and router handlers are in `server/src/routes/`.
  - **Integrations**:
    - **Google Sheets API**: Submissions are automatically appended to a tracking sheet using [server/src/sheets.js](./server/src/sheets.js).
    - **Cloudinary**: File attachments (like payment screenshots or resumes) are uploaded to Cloudinary using custom multer middlewares.

---

## ⚡ Setup & Run

### 1. Environment Configuration

- **Backend**: Configure your database connection keys, Cloudinary upload folders, and Google credentials by creating a `.env` file in the `server` directory. Refer to the existing [server/.env.example](./server/.env.example) file for all required fields.
- **Frontend**: Create a `.env.local` file in the root directory:
  ```env
  VITE_API_URL=http://localhost:5000
  ```

### 2. Run Commands

#### Root Directory (Frontend)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Vite dev server:
   ```bash
   npm run dev
   ```

#### Server Directory (Backend)
1. Navigate into `/server`:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs via nodemon for hot-reloads):
   ```bash
   npm run dev
   ```
