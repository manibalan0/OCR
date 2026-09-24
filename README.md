# Online Complaint Registration System

- **User (Customer)**: Submit complaints, track real-time status updates, chat directly with support agents, and provide feedback on resolved issues.
- **Support Agent**: View complaints assigned by Admin, update resolution status (`Pending`, `In Progress`, `Resolved`, `Rejected`), and respond via live chat.
- **Admin**: Log in using `admin@coreresolvedesk.com` / `admin123`, access the Admin Portal, assign complaints to support agents, monitor system analytics, and view user feedback.

---

## USER FLOW

```text
[ User / Customer ]
        │
        ▼
[ Submit Complaint / View Tickets ]
        │
        ├───> Click "New Complaint" ───> Fill Details ───> Submit Ticket
        │
        ├───> Open Complaint Detail ───> Live Chat with Agent ───> Receive Real-Time Updates
        │
        └───> Complaint Resolved ───> Submit Feedback & Rating
```

---

## MVC PATTERN EXPLANATION

- **Model Layer (`server/src/models/`)**: Mongoose models defining schemas for `User.js`, `Complaint.js`, `Chat.js`, and `Feedback.js`.
- **View Layer (`client/src/`)**: Dynamic React components rendered with glassmorphism CSS backdrop filters, responsive grid structures, and interactive states.
- **Controller Layer (`server/src/controllers/`)**: Business logic processing requests, performing database CRUD operations, and returning structured JSON API payloads.

---

## 2. PROJECT SETUP AND CONFIGURATION

### Folder Structure

```text
Online Complaint Registration System/
├── client/        # Vite + React Frontend
├── server/        # Node.js + Express Backend REST API
└── README.md
```

### Installation Steps

1. **Server Setup:**
   ```bash
   cd server
   npm install
   ```

2. **Client Setup:**
   ```bash
   cd ../client
   npm install
   ```

---

## 3. BACKEND DEVELOPMENT

### Backend Server Configuration (`server/server.js`)

- Express app mounting routes: `/api/auth`, `/api/complaints`, `/api/messages`, `/api/feedback`.
- Middleware: CORS enabled, JSON parsing, JWT validation.

### Database Seeding:

Populates default admin account `admin@coreresolvedesk.com` / `admin123`, support agent `agent@coreresolvedesk.com` / `agent123`, user account `user@coreresolvedesk.com` / `user123`, and sample complaint tickets:

```bash
cd server
npm run seed
```

---

## 4. DATABASE DEVELOPMENT (MongoDB)

- **MongoDB URI**: `mongodb+srv://sazincse_db_user:complaint123@cluster0.luvkf4q.mongodb.net/?appName=Cluster0`
- **Database connector**: `server/src/config/db.js` using Mongoose ORM.

---

## 5. FRONTEND DEVELOPMENT

Built with **React 18**, **Vite**, **Lucide icons**, and **Vanilla CSS** styled with **Glassmorphism Design System** (`glass-panel`, `glass-card`, `glass-nav`, backdrop blurs, glow borders, and responsive flex/grid layouts).

---

## 6. PROJECT EXECUTION

### Step 1: Start Backend API Server

```bash
cd server
npm run seed
npm run dev
# Running on http://localhost:5000
```

### Step 2: Start Frontend React Server

```bash
cd client
npm run dev
# Running on http://localhost:3000
```

---

## DEMO & EVALUATION LINKS SUMMARY

- **GitHub Repository**: `https://github.com/sazin-13/OCR`
- **Project Documentation Drive**: `https://drive.google.com/drive/folders/1Y3JpqHSJQjZ1EJNRQAXip4cEMVGBz-2j?usp=sharing`
- **Live Render Backend API**: `https://ocr-backend-ylhy.onrender.com`
- **Live Vercel Frontend**: `https://ocr-vcco.vercel.app/`
- **Admin Email**: `admin@coreresolvedesk.com`
- **Admin Password**: `admin123`
- **Agent Email**: `agent@coreresolvedesk.com`
- **Agent Password**: `agent123`
- **User Email**: `user@coreresolvedesk.com`
- **User Password**: `user123`

# OCR
