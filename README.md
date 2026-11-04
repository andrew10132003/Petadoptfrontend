# 🐾 Pet Adoption Platform – Frontend

A responsive, role-based Pet Adoption Platform that connects adopters, animal shelters, and foster volunteers. Users can explore available pets, view pet details, submit adoption applications, and manage their adoption activities.

The frontend is built using **React, TypeScript, Vite, and Tailwind CSS**, with a REST API backend powered by Node.js and Express.js.

## 🚀 Features

### Implemented Core Features

- 🏠 Responsive Home Page
- 🐶 Browse Available Pets
- 🔍 Pet Search
- 📄 Pet Details Page
- ❤️ Add and Remove Favorites
- 📝 Submit Adoption Applications
- 👤 User Registration and Login
- 🔐 JWT-based Authentication
- 👥 Role-Based Access Control (RBAC)
- 📋 View Adoption Application Status
- 🏠 Shelter Dashboard
- 🐾 Pet Management for Shelters
- 🩺 Pet Medical History
- 🔎 Pet Search and Sorting in Shelter Dashboard
- 👑 Admin Dashboard
- ✅ Approve Adoption Applications
- ❌ Reject Adoption Applications
- 📱 Responsive UI

### Additional Features Required by Mentor

The following enhancements are part of the remaining implementation scope:

1. **Public Pet Search and Filtering**
   - Filter pets by breed, age, size, and location.
   - Sort available pets.
   - Provide filtering on the public Pets page for adopters.

2. **Application Management**
   - Request additional information from adopters.
   - Schedule meet-and-greet appointments.
   - Manage application-related interactions.

3. **User Reviews and Ratings**
   - Submit reviews and ratings for shelters.
   - Submit reviews and ratings for pets.
   - Filter reviews and ratings.

4. **Adopter–Shelter Communication**
   - Messaging between adopters and shelters.
   - Schedule shelter visits.
   - Manage communication and visit requests.

5. **Foster Management**
   - Foster volunteer registration and sign-up.
   - Manage fostered pets.
   - Coordinate activities between shelters and foster volunteers.

6. **User Account Features**
   - Manage user profiles.
   - Save and retrieve favorite pets persistently.
   - Receive email notifications.

7. **Email Service Integration**
   - Integrate the backend email service.
   - Support application-related email notifications.

## 👥 User Roles and Permissions

The platform supports four roles.

### 👑 Admin
- Access the admin dashboard.
- View adoption applications.
- Manage platform-level adoption activities.
- Approve or reject applications where authorized.

### 🏠 Shelter
- Access the shelter dashboard.
- Add and manage pet listings.
- Update pet information and medical history.
- View adoption applications.
- Manage adoption-related activities.

### 🐕 Adopter
- Browse available pets.
- Search and filter pets.
- View pet details.
- Save favorite pets.
- Submit adoption applications.
- Track application status.
- Communicate with shelters.

### 🧑‍🍼 Foster
- Access foster-related features.
- Manage foster activities.
- Coordinate with shelters.
- Manage fostered pets.

> Access to protected pages and actions is controlled through authentication and role-based authorization.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend library |
| TypeScript | Type safety |
| Vite | Development and build tool |
| Tailwind CSS | Styling |
| Axios | API communication |
| React Router DOM | Routing |
| React Icons | Icons |
| JWT | Authentication |

## 📂 Project Structure

```text
Frontend/
│
├── public/
│
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── routes/
│   ├── utils/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```
## 🔐 Demo Credentials

The following accounts can be used for project evaluation, provided the corresponding accounts have been seeded or created in the backend database.

| Role | Email | Password |
|---|---|---|
| Shelter | shelter@example.com | Shelter@123 |
| Adopter | adopter@example.com | Adopter@123 |
| Foster | foster@example.com | Foster@123 |
| Admin | Use the authorized admin account configured in the database | Not published |

**Note:** These credentials are intended for testing. Do not publish real administrator passwords or production credentials in a public repository.

## 🌐 Deployment

- **Frontend Deployment:** YOUR_FRONTEND_DEPLOYMENT_URL
- **Backend API:** YOUR_BACKEND_DEPLOYMENT_URL
- **GitHub Repository:** YOUR_GITHUB_REPOSITORY_URL

## 🔗 Backend Integration

The frontend communicates with the backend through REST API endpoints using Axios.

The backend provides:

- Authentication and authorization.
- Pet management.
- Adoption application management.
- Admin operations.
- Shelter and adopter activities.
- Additional communication, fostering, review, and notification features as implemented.

## 📌 Project Objective

The objective of this project is to develop a complete pet adoption ecosystem that simplifies the adoption process, improves communication between adopters and shelters, and supports foster volunteers in providing temporary care for animals.

---

**Developed using React, TypeScript, Vite, and Tailwind CSS.** 🐾