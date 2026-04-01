# ⚡ JobTrack — Smart Job Application Tracker

A full-stack web app to manage your entire job search pipeline — built with **React**, **Django REST Framework**, and **PostgreSQL**.

---

## ✨ Features

- ➕ **Add** job applications with full details (company, role, salary, URL, notes)
- 📋 **View** all applications in a responsive card grid
- ✏️ **Edit** any application inline via modal
- 🗑️ **Delete** with confirmation dialog
- 🔄 **Quick status update** directly from each card
- 🔍 **Filter** by status (Wishlist / Applied / Interview / Offer / Rejected / Withdrawn)
- 🔎 **Search** across company, role, location, and notes
- 📊 **Stats bar** showing counts per status
- 📦 **REST API** with filtering, searching, ordering, and pagination
- 🐳 **Docker Compose** for one-command startup

---

## 🏗️ Project Structure

```
job-tracker/
├── backend/                  # Django REST Framework
│   ├── job_tracker/          # Django project (settings, urls, wsgi)
│   ├── jobs/                 # Jobs app
│   │   ├── models.py         # JobApplication model
│   │   ├── serializers.py    # DRF serializers (full + list)
│   │   ├── views.py          # ViewSet with stats + quick-status endpoints
│   │   ├── filters.py        # django-filter FilterSet
│   │   ├── urls.py           # Router registration
│   │   └── admin.py          # Django admin
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── api/jobs.js       # Fetch-based API client
│   │   ├── hooks/useJobs.js  # Custom hook (state + CRUD)
│   │   ├── components/
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobForm.jsx
│   │   │   ├── StatsBar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
└── docker-compose.yml
```

---

## 🚀 Quick Start

### Option 1 — Docker Compose (recommended)

```bash
git clone <your-repo>
cd job-tracker
docker-compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:8000/api/
- Django Admin: http://localhost:8000/admin/

---

### Option 2 — Manual Setup

#### Backend

```bash
cd backend

# Create & activate venv
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up PostgreSQL (or use SQLite — see settings.py comment)
createdb job_tracker_db

# Run migrations
python manage.py migrate

# (Optional) create superuser for admin panel
python manage.py createsuperuser

# Start server
python manage.py runserver
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env        # Edit VITE_API_URL if needed
npm run dev
```

---

## 🔌 API Reference

Base URL: `http://localhost:8000/api/`

| Method | Endpoint                     | Description                  |
|--------|------------------------------|------------------------------|
| GET    | `/jobs/`                     | List all applications        |
| POST   | `/jobs/`                     | Create new application       |
| GET    | `/jobs/{id}/`                | Get single application       |
| PUT    | `/jobs/{id}/`                | Full update                  |
| PATCH  | `/jobs/{id}/`                | Partial update               |
| DELETE | `/jobs/{id}/`                | Delete application           |
| PATCH  | `/jobs/{id}/status/`         | Quick status-only update     |
| GET    | `/jobs/stats/`               | Counts by status + total     |

### Query Parameters for `GET /jobs/`

| Param           | Example              | Description                    |
|-----------------|----------------------|--------------------------------|
| `status`        | `?status=applied`    | Filter by status (multi ok)    |
| `search`        | `?search=google`     | Full-text search               |
| `ordering`      | `?ordering=-created_at` | Sort field (prefix `-` desc) |
| `company`       | `?company=acme`      | Company name contains          |
| `created_after` | `?created_after=2024-01-01` | Date range filter       |

### Status Values

`wishlist` · `applied` · `interview` · `offer` · `rejected` · `withdrawn`

---

## 🗄️ Data Model

```python
JobApplication:
  company        CharField
  role           CharField
  status         CharField (choices)
  location       CharField (optional)
  job_url        URLField (optional)
  salary_min     PositiveIntegerField (optional)
  salary_max     PositiveIntegerField (optional)
  notes          TextField (optional)
  date_applied   DateField (optional)
  date_interview DateField (optional)
  created_at     DateTimeField (auto)
  updated_at     DateTimeField (auto)
```

---

## 🛣️ Roadmap / Future Features

- [ ] User authentication (JWT)
- [ ] Email/calendar reminders for follow-ups
- [ ] Kanban board view
- [ ] CSV import/export
- [ ] Interview notes with rich text
- [ ] Company research integration
- [ ] Analytics dashboard with charts
- [ ] Mobile app (React Native)

---

## 🧰 Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Frontend  | React 18, Vite, CSS Variables      |
| Backend   | Django 4.2, Django REST Framework  |
| Database  | PostgreSQL 16                      |
| Filtering | django-filter                      |
| CORS      | django-cors-headers                |
| Container | Docker + Docker Compose            |
