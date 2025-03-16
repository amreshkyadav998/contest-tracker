# TLE Tracker


## Live Demo
Watch the full demo here: [TLE Tracker Demo](https://drive.google.com/drive/folders/1qGJR0v0uTknivP9c0NLtYwocIjtw6eI1?usp=drive_link)

## Overview
TLE Tracker is a **MERN stack**-based platform designed for tracking competitive programming contests from platforms like **CodeChef, CodeForces, and LeetCode**. It includes features such as:

- **Bookmarking contests** (with authentication)
- **JWT-based authentication**
- **Admin panel for video uploads**
- **Dark mode support**
- **Fully responsive design**
- **Loader animation for smooth UX**


---

## Tech Stack
### **Frontend:**
- React.js (with Vite for fast builds)
- Tailwind CSS for styling
- React Router for navigation
- React Hot Toast for notifications
- React Icons for UI enhancements

### **Backend:**
- Express.js (Node.js framework)
- MongoDB (via Mongoose for database operations)
- JWT for authentication
- Google APIs integration
- Node-cron for scheduled tasks

---

## Features
### **1. Contest Fetching**
- The backend fetches contest details from **CodeChef, CodeForces, and LeetCode APIs**.
- Data is then displayed dynamically on the frontend.

### **2. Authentication**
- User authentication is implemented using **JWT (JSON Web Token)**.
- Users need to log in before performing actions like bookmarking contests.

### **3. Bookmarking System**
- Users can bookmark contests for later reference.
- If a user tries to bookmark without logging in, a **pop-up message** appears prompting them to log in first.
- Users can remove bookmarks anytime from the **Bookmarks Page**.

### **4. Admin Panel**
- Admins can upload contest-related **video links**.
- Once uploaded, the video link will appear on the **contest page** for users.

### **5. Dark Mode**
- Users can toggle between **light and dark mode** for a better viewing experience.

### **6. Responsive Design**
- The website is fully optimized for **mobile, tablet, and desktop**.

### **7. Loader Animation**
- A **loader animation** is implemented to enhance the user experience while data is being fetched.

---

## Installation & Setup
### **Backend**
1. Clone the repository and navigate to the backend folder:
   ```bash
   git clone https://github.com/your-repo/tle-tracker.git
   cd tle-tracker/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add the required environment variables.
4. Start the backend server:
   ```bash
   npm start
   ```

### **Frontend**
1. Navigate to the frontend folder:
   ```bash
   cd tle-tracker/client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

---

## Dependencies
### **Backend**
```json
{
  "axios": "^1.8.3",
  "bcryptjs": "^3.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "fs": "^0.0.1-security",
  "googleapis": "^146.0.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.12.1",
  "node-cron": "^3.0.3",
  "nodemon": "^3.1.9",
  "path": "^0.12.7"
}
```

### **Frontend**
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-hot-toast": "^2.5.2",
  "react-icons": "^5.5.0",
  "react-router-dom": "^7.3.0",
  "tailwindcss": "^3.4.17",
  "three": "^0.174.0"
}
```

---

## Future Improvements
- **Profile management** (to track user activity)
- **Push notifications** for upcoming contests
- **Leaderboard system** for competitive tracking

---

## Contributors
- **Amresh Yadav** (Frontend Developer, MERN Stack Developer)

---

### **License**
This project is licensed under **MIT License**.

