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

## 🚀 Clone & Run Instructions

To run this platform on another system, follow these simple steps:

### 📋 Prerequisites
Ensure you have the following installed:
* **Java Development Kit (JDK) 17** or higher.
* **Node.js** (v18 or higher) & **npm**.
* **Git** installed.

---

### Step 1: Clone the Repository
Clone the repository and navigate into the root directory:
```bash
git clone https://github.com/SRINIVAS-R-Code/-ai-interview.git
cd -ai-interview
```

---

### Step 2: Configure the Gemini API Key
You need to set up your Gemini API Key in the backend configurations:
1. Open [backend/src/main/resources/application.properties](file:///e:/ai%20%20interview%20paltfrom/backend/src/main/resources/application.properties)
2. Locate line 24: `gemini.api.key=${GEMINI_API_KEY:your_gemini_api_key}`
3. Replace `your_gemini_api_key` with your actual Google Gemini API Key (or set the `GEMINI_API_KEY` system environment variable).

---

### Step 3: Run the Spring Boot Backend
Start the Java backend application:
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```
* **Port:** The backend runs on [http://localhost:8085](http://localhost:8085).
* **Database:** The local SQLite database `interview_prep.db` is already pre-seeded and pushed with **1,050+ aptitude questions**, **13 mock tests**, and **coding challenges**. You do not need to run any seeding scripts!

---

### Step 4: Run the React Frontend
Open a new terminal window, navigate to the frontend folder, install packages, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
* **Port:** The frontend runs on [http://localhost:5173](http://localhost:5173).
* **Accessing the App:** Open [http://localhost:5173](http://localhost:5173) in your browser. You can log in using the demo account credentials `fulltax@t.com` / `Test@1234` or register a new account.

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
VITE_API_BASE_URL=http://localhost:8085/api
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
