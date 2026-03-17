# ShajSutro

<p align="center">
  <strong>Modern minimalist fashion e-commerce platform</strong><br/>
  Built with Next.js 14 + TypeScript + Tailwind CSS + Express + MongoDB
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14.2.5-111827?style=for-the-badge&logo=next.js" />
  <img alt="React" src="https://img.shields.io/badge/React-18-2563EB?style=for-the-badge&logo=react" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-0F766E?style=for-the-badge&logo=typescript" />
  <img alt="Express" src="https://img.shields.io/badge/Express-4.19-1F2937?style=for-the-badge&logo=express" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-8.5-166534?style=for-the-badge&logo=mongodb" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-3.4-0891B2?style=for-the-badge&logo=tailwind-css" />
</p>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Monorepo Structure](#monorepo-structure)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Route Map](#api-route-map)
- [Deployment Guide](#deployment-guide)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

ShajSutro is a full-stack fashion e-commerce application with:

- A modern storefront experience (home, shop, cart, checkout, profile, static policy pages)
- Admin panel for products, categories, users, orders, messages, jobs, applications, and promo codes
- REST API backend with authentication, role-based authorization, and MongoDB persistence
- Job application module with CV upload support

This repository is organized as a two-app setup:

- `root`: Next.js frontend
- `backend/`: Express + TypeScript API server

---

## Core Features

### Storefront

- Hero stats and curated home sections (new arrivals, best sellers, promos)
- Product browsing by category and detail pages
- User authentication and profile management
- Cart, order placement, order history, and invoice endpoint support
- Contact form and careers flow

### Admin Panel

- Dashboard stats and analytics
- Product CRUD and category management (including subcategories)
- User management (create, update, block, delete)
- Order management (status updates, payment confirmation)
- Promo code CRUD and apply endpoint
- Contact message moderation
- Careers and job application review

### Backend API

- JWT-based protected routes
- Role-based middleware (`protect`, `adminOnly`)
- CORS strategy for localhost, Vercel subdomains, and explicit allow-list
- Health endpoint and centralized error middleware

---

## Tech Stack

| Layer           | Technologies                                                             |
| --------------- | ------------------------------------------------------------------------ |
| Frontend        | Next.js 14, React 18, TypeScript, Tailwind CSS, Recharts, React Toastify |
| Backend         | Node.js, Express 4, TypeScript                                           |
| Database        | MongoDB (Mongoose)                                                       |
| Auth & Security | JWT, bcryptjs, CORS                                                      |
| File Upload     | Multer (CV upload: PDF/DOC/DOCX, max 8MB)                                |
| Email           | Nodemailer (Gmail transporter)                                           |
| Docs/Reports    | PDFKit                                                                   |

---

## Monorepo Structure

```text
ShajSutro/
  src/                    # Next.js frontend app
    app/
      (store)/
      admin/
      api/
    components/
    context/
    lib/
  backend/                # Express API server
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      types/
      seed/
  uploads/
    cv/                   # Uploaded resumes
```

---

## Local Development Setup

### 1) Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas connection string
- Gmail app credentials (if email flows are used)

### 2) Install Dependencies

From project root:

```bash
npm install
```

From backend folder:

```bash
cd backend
npm install
```

### 3) Configure Environment Files

Create two files:

- `.env.local` in root (frontend)
- `.env` in `backend/`

Use the variables in the next section.

### 4) Run in Development

Terminal A (frontend, root):

```bash
npm run dev
```

Terminal B (backend):

```bash
cd backend
npm run dev
```

Default development URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- Health check: `http://localhost:4000/api/health`

---

## Environment Variables

### Frontend (`.env.local`)

| Variable              | Required | Example                 | Notes                                |
| --------------------- | -------- | ----------------------- | ------------------------------------ |
| `NEXT_PUBLIC_API_URL` | Yes      | `http://localhost:4000` | Base URL for API calls from frontend |

> Important: frontend fallback in code defaults to `http://localhost:5000`, while backend server default is `4000`. Set `NEXT_PUBLIC_API_URL` explicitly to avoid port mismatch.

### Backend (`backend/.env`)

| Variable         | Required | Example                                             | Notes                           |
| ---------------- | -------- | --------------------------------------------------- | ------------------------------- |
| `NODE_ENV`       | Yes      | `development`                                       | Runtime mode                    |
| `PORT`           | Optional | `4000`                                              | Defaults to 4000                |
| `MONGODB_URI`    | Yes      | `mongodb+srv://...`                                 | MongoDB Atlas connection string |
| `JWT_SECRET`     | Yes      | `super_secret_key`                                  | Token signing secret            |
| `JWT_EXPIRES_IN` | Optional | `7d`                                                | JWT expiration window           |
| `CLIENT_URL`     | Optional | `http://localhost:3000,https://your-app.vercel.app` | Comma-separated allowed origins |
| `EMAIL_USER`     | Optional | `your_gmail@gmail.com`                              | Needed for mailer flows         |
| `EMAIL_PASS`     | Optional | `app_password`                                      | Gmail app password              |

---

## Available Scripts

### Root (Frontend)

| Script | Command         | Description                     |
| ------ | --------------- | ------------------------------- |
| dev    | `npm run dev`   | Run Next.js in development mode |
| build  | `npm run build` | Build production frontend       |
| start  | `npm run start` | Run built frontend              |
| lint   | `npm run lint`  | Next.js linting                 |

### Backend

| Script | Command         | Description                      |
| ------ | --------------- | -------------------------------- |
| dev    | `npm run dev`   | Run API with ts-node-dev         |
| build  | `npm run build` | Compile TypeScript to `dist/`    |
| start  | `npm run start` | Run compiled API server          |
| lint   | `npm run lint`  | Type-check only (`tsc --noEmit`) |

---

## API Route Map

Base server URL: `http://localhost:4000`

| Route Prefix            | Purpose                                                           |
| ----------------------- | ----------------------------------------------------------------- |
| `/api/health`           | API health and environment status                                 |
| `/api/auth`             | Register, login, verify email, password flows, profile management |
| `/api/categories`       | Category and subcategory listing/management                       |
| `/api/products`         | Product listing and admin CRUD                                    |
| `/api/cart`             | Authenticated cart operations                                     |
| `/api/orders`           | Authenticated order flow and invoice                              |
| `/api/reviews`          | Product reviews and user reviews                                  |
| `/api/contact`          | Contact message submission                                        |
| `/api/admin`            | Admin-only dashboard, users, products, orders, messages           |
| `/api/promo-codes`      | Promo apply endpoint + admin CRUD                                 |
| `/api/jobs`             | Public active jobs + admin job management                         |
| `/api/job-applications` | Submit application with CV + admin review                         |
| `/api/stats`            | Public stats endpoints (home hero stats)                          |

### Selected Endpoint Examples

| Method | Endpoint                       | Auth                         |
| ------ | ------------------------------ | ---------------------------- |
| `POST` | `/api/auth/register`           | Public                       |
| `POST` | `/api/auth/login`              | Public                       |
| `GET`  | `/api/products`                | Public                       |
| `POST` | `/api/products`                | Admin                        |
| `GET`  | `/api/orders`                  | User                         |
| `PUT`  | `/api/admin/orders/:id/status` | Admin                        |
| `POST` | `/api/promo-codes/apply`       | Public                       |
| `POST` | `/api/job-applications`        | Public (multipart/form-data) |

---

## Deployment Guide

### Frontend (Vercel)

- Set project root to repository root
- Add environment variable `NEXT_PUBLIC_API_URL` to deployed backend URL
- Build command: `npm run build`

### Backend (Render / Railway / VPS)

- Deploy `backend/` as Node service
- Set all required backend environment variables
- Build command: `npm run build`
- Start command: `npm run start`
- Ensure CORS includes deployed frontend domain in `CLIENT_URL`

---

## Troubleshooting

### API calls failing from frontend

- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Confirm backend is running on expected port
- Check CORS by adding frontend URL to `CLIENT_URL`

### MongoDB connection error

- Ensure `MONGODB_URI` is present and valid
- Confirm network/IP access is allowed in MongoDB Atlas

### CV upload issues

- Confirm file is PDF/DOC/DOCX
- Ensure size is below 8MB
- Check write permission on `uploads/cv`

---

## Notes

- No license file is currently present in the repository.
- Add `LICENSE` and contribution guidelines if this project will be public/open-source.
