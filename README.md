# 🧥 What to Wear — Backend

This is the **backend API** for the **What to Wear** application — a weather-based clothing recommendation app.  
It handles user accounts, clothing item management, and integrates with external weather APIs to suggest appropriate outfits for the day.

---

## 🌤️ Overview

The backend provides a RESTful API that:

- Manages users and authentication (sign up, log in, profile info)
- Stores and retrieves clothing items
- Supports CRUD operations for user-owned items
- Integrates with a weather API to serve context-aware clothing suggestions

The frontend (React-based) communicates with this API to display personalized recommendations.

---

## 🧩 Tech Stack

| Layer                 | Technology                                    |
| --------------------- | --------------------------------------------- |
| Runtime               | Node.js                                       |
| Framework             | Express.js                                    |
| Database              | MongoDB (Mongoose ODM)                        |
| Authentication        | JWT (JSON Web Token)                          |
| Environment Variables | dotenv                                        |
| Validation            | celebrate / Joi                               |
| Error Handling        | Custom middleware                             |
| Hosting               | (e.g., Render / Vercel / Railway / Localhost) |
