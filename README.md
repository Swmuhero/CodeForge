# CodeForge LeetCode Clone

A full-stack coding practice platform built with Next.js, Express, MongoDB, JWT auth, Monaco Editor, and Judge0-powered code execution.

## Supported Languages

The platform strictly supports only:

- Java
- JS
- Python
- C++

The backend validates this allowlist in the API, Mongoose schema, and judge configuration. The frontend selector exposes only these four options.

## Features

- Register, login, logout with bcrypt password hashing and JWT auth
- Protected problem solving, profile, run, submit, and submission history routes
- Problem list with search, difficulty filter, tags, and solved status
- Monaco coding workspace with dark/light mode
- Public test cases for Run Code
- Public plus hidden test cases for Submit Code
- Judge0 execution with CPU, wall-time, memory, process, and file-size limits
- Submission storage with verdict, language, execution time, passed count, and timestamp
- Seeded problem bank with 293 total problems across Easy, Medium, and Hard

## Project Structure

```text
backend/
  src/config        Mongo and language config
  src/controllers   Auth, problems, users
  src/middleware    JWT auth, validation, errors
  src/models        Mongoose models
  src/routes        Express routes
  src/seed          Preloaded problems
  src/services      Judge and cache services

frontend/
  src/app           Next.js app router pages
  src/components    Auth, nav, protected route, result panel
  src/lib           API client, types, language list, UI helpers
```

## Requirements

- Node.js 20+
- MongoDB local or MongoDB Atlas
- A Judge0 endpoint, either the default Community Edition endpoint or your own hosted Judge0 service

## Local Setup

Install dependencies:

```bash
npm install
npm run install:all
```

Create backend env:

```bash
cp backend/.env.example backend/.env
```

Create frontend env:

```bash
cp frontend/.env.local.example frontend/.env.local
```

Start MongoDB, then seed problems:

```bash
npm run seed
```

Start both apps:

```bash
npm run dev
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:4000/api`

## Judge Runtime

The backend sends submissions to Judge0 and accepts only these four language IDs by default:

| Language | Judge0 Language |
| --- | --- |
| Java | `62` Java OpenJDK |
| JS | `63` JavaScript Node.js |
| Python | `71` Python 3 |
| C++ | `54` C++ GCC |

Execution limits are configured through backend env vars:

- `JUDGE0_API_URL`
- `JUDGE0_CPU_TIME_LIMIT_SECONDS`
- `JUDGE0_WALL_TIME_LIMIT_SECONDS`
- `JUDGE0_MEMORY_LIMIT_KB`
- `JUDGE0_MAX_PROCESSES`
- `JUDGE0_MAX_FILE_SIZE_KB`
- `JUDGE0_POLL_TIMEOUT_MS`

If your Judge0 provider requires authentication, set `JUDGE0_API_KEY` and optionally `JUDGE0_API_KEY_HEADER` or `JUDGE0_RAPIDAPI_HOST`.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/problems`
- `GET /api/problems/:slug`
- `POST /api/problems/:slug/run`
- `POST /api/problems/:slug/submit`
- `GET /api/users/me`
- `GET /api/users/me/submissions`

## Deployment

Frontend:

- Deploy `frontend` to Vercel.
- Set `NEXT_PUBLIC_API_URL` to your backend API URL.

Backend:

- Deploy `backend` to Railway, Render, or another Node host with MongoDB network access.
- Set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, and Judge0 env vars.
- Use a managed Judge0 provider or point `JUDGE0_API_URL` at your own Judge0 service.

Database:

- Use MongoDB Atlas.
- Run `npm run seed --prefix backend` once against the production database.

## Notes

- Hidden test cases are never returned by the problem API.
- Submit responses mask hidden test case input, expected output, and actual output.
- The in-memory cache is used for frequently read problem lists; database indexes are defined for auth lookups, problem search/filtering, and submissions.
