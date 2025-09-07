# 🎓 DeSchol

DeSchol is a **scholarship management and matching platform** built with the **MERN stack** (MongoDB, Express.js, React, Node.js).  
It helps **students** discover scholarships and **universities/recruiters** post verified opportunities in a secure, structured way.

---

## 🚀 Features

### 👩‍🎓 For Students
- Browse and search scholarships by **type, level, and country**
- View detailed scholarship info: requirements, deadlines, official links
- Apply directly through external links
- User authentication (register/login/logout)

### 🏫 For Universities / Recruiters
- Register a university
- (Admins/Recruiters) Post new scholarships linked to universities
- Manage scholarship listings from dashboard
- Pending universities can be verified before posting

### 🛠 For Admins
- Verify registered universities
- Moderate scholarships
- View admin dashboard and system stats

---

## 🧑‍💻 Tech Stack

- **Frontend**: React (Vite), TailwindCSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose ODM)  
- **Authentication**: JWT (JSON Web Tokens)  
- **Other**: REST API, Role-based Access Control (Admin / Recruiter / Student)

---

## 📂 Project Structure

```

DESchol/
│
├── Backend/           # Express + MongoDB backend
│   ├── models/        # Mongoose schemas (User, University, Scholarship)
│   ├── controllers/   # Business logic for routes
│   ├── routes/        # API endpoints
│   └── middlewares/   # Auth & role-based guards
│
├── Frontend/          # React + Vite frontend
│   ├── src/components # Shared UI components
│   ├── src/pages      # Pages (Home, Scholarships, Admin, etc.)
│   └── src/context    # Auth context
│
└── README.md          # Project documentation

````

---

## ⚙️ Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/ZohanaZuthi/DeSchol-Final-Version-.git
   cd DeSchol-Final-Version-
````

2. **Backend setup**

   ```bash
   cd Backend
   npm install
   cp .env.example .env   # set your MongoDB URI + JWT secret
   npm run dev
   ```

3. **Frontend setup**

   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

---

## 📸 Screenshots (to add later)

* Homepage
* Scholarship list
* Compose scholarship page
* Admin verification dashboard

---

## 👥 Roles

* **Student**: Browse & apply to scholarships
* **Recruiter**: Register university, compose scholarships
* **Admin**: Verify universities, manage system

---

## 📜 License

This project is for academic and learning purposes. You can extend it as needed.

---

````

