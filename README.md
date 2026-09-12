🐾 Pet Adoption Platform - Frontend

A responsive and user-friendly pet adoption platform that allows users to browse pets, view pet details, add favorites, and submit adoption applications.

Built using React, TypeScript, Vite, and Tailwind CSS.
 🚀 Features
- 🏠 Home Page
- 🐶 Browse Available Pets
- 🔍 Search Pets
- ❤️ Add / Remove Favorites
- 📄 Pet Details Page
- 📝 Adoption Form
- 👤 User Registration
- 🔐 User Login
- 👑 Admin Dashboard
- ✅ Admin Approve Adoption Requests
- ❌ Admin Reject Adoption Requests
- 📋 View Adoption Request Status
- 🔒 Role-based Authentication
- 📱 Responsive Design

 👥 User Roles
The application supports four user roles:
 👑 Admin
Admin manages the overall platform.
Admin can:
- View all adoption requests
- Approve adoption requests
- Reject adoption requests
- Manage platform-level adoption activities
 🏠 Shelter
Shelter users can access their dashboard and manage their adoption-related activities.
🐕 Adopter
Adopters can:
- Browse pets
- View pet details
- Add pets to favorites
- Submit adoption applications
- View adoption request status
 🧑‍🍼 Foster
Foster users can access their account and manage their foster-related activities.
 🔐 Demo Credentials
The following demo accounts are available for testing.
🏠 Shelter Login
Email: `shelter@example.com`  
Password:`Shelter@123`  
Role: `shelter`
 🐕 Adopter Login
Email: `adopter@example.com`  
Password: `Adopter@123`  
Role: `adopter`
🧑‍🍼 Foster Login
Email: `foster@example.com`  
Password: `Foster@123`  
Role: `foster`
 👑 Admin Login
Use the existing Admin account created in the backend database.
Role: `admin`
> ⚠️ Demo credentials are provided for project evaluation and testing purposes.
## 🛠️ Tech Stack
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- 📂 Folder Structure

```text
Frontend
│
├── public
│
├── src
│   │
│   ├── api
│   ├── assets
│   ├── components
│   ├── context
│   ├── pages
│   ├── routes
│   └── utils
│
├── App.tsx
├── main.tsx
├── index.css
├── package.json
└── README.md
