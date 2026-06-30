# 🤖 InterviewAI — AI-Powered Interview Preparation Platform

A full-stack platform for students to practice mock interviews, solve coding challenges, take aptitude tests, upload resumes, get AI feedback, and track performance.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, CSS3, React Router v6 |
| Backend | Java 17, Spring Boot 3.2 |
| Database | SQLite 3.x (In-memory/local file) |
| AI | Google Gemini 1.5 Flash |
| File Storage | Cloudinary |
| Auth | JWT + Spring Security |

---

## 🚀 Quick Start

### 1. Database Setup
SQLite is self-contained. The database file `interview_prep.db` will be created automatically in the root backend folder on start. No database installation is required!

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials, JWT secret, Cloudinary, Gemini API key
```

### 3. Run Backend

```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
# Runs on http://localhost:8080
```

### 4. Run Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
JWT_SECRET=your_32_char_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_key_from_aistudio.google.com
```

### Frontend (`frontend/.env.local`)

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 📡 API Endpoints

| Module | Endpoints |
|--------|----------|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Tests | `GET /api/tests`, `POST /api/tests/{id}/submit`, `GET /api/tests/results/my` |
| Coding | `GET /api/coding`, `POST /api/coding/{id}/submit` |
| Aptitude | `GET /api/aptitude/{topic}`, `POST /api/aptitude/{topic}/submit` |
| Resume | `POST /api/resume/upload`, `GET /api/resume/my`, `POST /api/resume/analyze/{id}` |
| Schedule | `GET /api/schedule/my`, `POST /api/schedule`, `PUT /api/schedule/{id}` |
| AI Feedback | `POST /api/feedback/generate`, `GET /api/feedback/my` |
| Analytics | `GET /api/analytics/summary`, `/progress`, `/subjects` |
| Leaderboard | `GET /api/leaderboard`, `GET /api/leaderboard/my-rank` |

---

## 🌐 Deployment

### Backend (Render)
- Root: `backend/`
- Build: `mvn clean install -DskipTests`
- Start: `java -jar target/*.jar`
- Set all env vars in Render dashboard

### Frontend (Vercel)
- Root: `frontend/`
- Build: `npm run build`
- Output: `dist`
- Set `VITE_API_BASE_URL=https://your-backend.onrender.com/api`

---

## 🌱 Seed Data

Automatically loaded on first start:
- **5 mock tests** (Java, DSA, SQL, OOPs, Spring Boot) — 10 MCQs each
- **10 coding challenges** (5 Easy, 3 Medium, 2 Hard)
- **30 aptitude questions** (10 per topic: Quantitative, Logical, Verbal)
