# 💼 Job Portal

A smart and simple **Job Portal Web Application** built with **PHP Laravel** and **MySQL** — designed to connect job seekers with employers in a clean, responsive interface.

---

## 🚀 Project Overview

This web application allows job seekers to browse and apply for jobs, while employers can post job listings and manage applications — all in one platform.

---

## ✨ Features

- 🔐 User Registration & Login (Job Seeker / Employer)
- 📋 Job Listings with Search & Filter
- 📝 Job Posting by Employers
- 📨 Job Application by Seekers
- 🛠️ Admin Panel to Manage Users & Jobs
- 📱 Responsive Design (Mobile & Desktop)

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| PHP Laravel | Backend Framework |
| MySQL | Database |
| Blade Templates | Frontend Views |
| Bootstrap / Tailwind | UI Styling |
| Composer | PHP Dependency Manager |

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- PHP >= 8.1
- Composer
- MySQL
- Node.js & npm (for frontend assets)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/job-portal.git
cd job-portal
```

2. **Install PHP dependencies**
```bash
composer install
```

3. **Install Node dependencies**
```bash
npm install
```

4. **Create environment file**
```bash
cp .env.example .env
```

5. **Generate application key**
```bash
php artisan key:generate
```

6. **Configure your database in `.env`**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=job_portal
DB_USERNAME=root
DB_PASSWORD=your_password
```

7. **Run database migrations**
```bash
php artisan migrate
```

8. **Seed the database (optional)**
```bash
php artisan db:seed
```

9. **Build frontend assets**
```bash
npm run dev
```

10. **Start the development server**
```bash
php artisan serve
```

Visit: `http://localhost:8000`

---

## 📁 Project Structure

```
job-portal/
├── app/
│   ├── Http/Controllers/
│   └── Models/
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   └── views/
├── routes/
│   └── web.php
├── public/
├── .env.example
├── composer.json
└── README.md
```

---

## 🔑 Default Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@jobportal.com | password |
| Employer | employer@jobportal.com | password |
| Job Seeker | seeker@jobportal.com | password |

---

## 👨‍💻 Author
Anushka Barai
GitHub:barais111(https://github.com/barais111)

