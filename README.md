# CollabNotes — Collaborative Note-Taking App

A full-stack collaborative note-taking web application built with the **MERN stack** (MongoDB, Express, React, Node.js) and styled with **Tailwind CSS**.

## Features

- **JWT Authentication** — Secure register/login with hashed passwords (bcrypt) and JSON Web Tokens
- **Rich Text Editor** — Full formatting toolbar with headers, bold/italic, colors, images, code blocks, and lists (React Quill)
- **Full-Text Search** — MongoDB text index for fast searching across note titles and content
- **Collaborator Management** — Invite collaborators by email with viewer or editor roles
- **Image Uploads** — Upload images via the API with file type/size validation (multer)
- **Pin Notes** — Pin important notes to the top of your dashboard
- **Responsive UI** — Clean, modern design with Tailwind CSS
- **Rate Limiting** — API rate limiting to prevent abuse

## Tech Stack

| Layer    | Technology                   |
| -------- | ---------------------------- |
| Frontend | React 18, Vite, Tailwind CSS |
| Editor   | React Quill (rich text)      |
| Backend  | Node.js, Express             |
| Database | MongoDB with Mongoose ODM    |
| Auth     | JWT + bcryptjs               |
| Uploads  | Multer (disk storage)        |
| HTTP     | Axios                        |
| Toasts   | react-hot-toast              |

## Project Structure

```
collaborative-notes-app/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # Route handlers
│   ├── middleware/                # Auth & upload middleware
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # Express routes
│   ├── uploads/                  # Uploaded images (gitignored)
│   ├── utils/generateToken.js    # JWT helper
│   ├── server.js                 # Express entry point
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Route pages
│   │   ├── context/              # React context (auth)
│   │   ├── hooks/                # Custom hooks
│   │   ├── routes/               # Private route wrapper
│   │   ├── services/api.js       # Axios instance
│   │   └── utils/formatDate.js
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
├── package.json                  # Root scripts (concurrently)
├── .gitignore
└── README.md
```

## Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** — either a local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works)

## Environment Variables

### Backend (`backend/.env`)

| Variable     | Description                       | Example                                         |
| ------------ | --------------------------------- | ----------------------------------------------- |
| `PORT`       | Server port                       | `5000`                                          |
| `MONGO_URI`  | MongoDB connection string         | `mongodb://localhost:27017/collaborative-notes` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `my_super_secret_key_change_this`               |
| `NODE_ENV`   | Environment                       | `development`                                   |

### Frontend (`frontend/.env`)

| Variable       | Description          | Example                 |
| -------------- | -------------------- | ----------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |

> **Note:** `.env.example` files are provided in both `backend/` and `frontend/`. Copy them to `.env` and fill in your values.

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/collaborative-notes-app.git
cd collaborative-notes-app
```

### 2. Install dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install backend + frontend dependencies
npm run install:all
```

### 3. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and a strong JWT secret

# Frontend
cp frontend/.env.example frontend/.env
# Edit if your backend runs on a different URL
```

### 4. Start MongoDB

If using a local MongoDB:

```bash
mongod
```

Or use your MongoDB Atlas connection string in `backend/.env`.

### 5. Run the application

```bash
# Run both backend and frontend concurrently
npm run dev
```

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

## API Endpoints

### Auth

| Method | Endpoint             | Description      | Auth |
| ------ | -------------------- | ---------------- | ---- |
| POST   | `/api/auth/register` | Register user    | No   |
| POST   | `/api/auth/login`    | Login user       | No   |
| GET    | `/api/auth/me`       | Get current user | Yes  |

### Notes

| Method | Endpoint                               | Description         | Auth |
| ------ | -------------------------------------- | ------------------- | ---- |
| GET    | `/api/notes`                           | Get all user notes  | Yes  |
| GET    | `/api/notes/search?q=keyword`          | Full-text search    | Yes  |
| GET    | `/api/notes/:id`                       | Get single note     | Yes  |
| POST   | `/api/notes`                           | Create note         | Yes  |
| PUT    | `/api/notes/:id`                       | Update note         | Yes  |
| DELETE | `/api/notes/:id`                       | Delete note (owner) | Yes  |
| POST   | `/api/notes/:id/collaborators`         | Add collaborator    | Yes  |
| DELETE | `/api/notes/:id/collaborators/:userId` | Remove collaborator | Yes  |

### Upload

| Method | Endpoint      | Description  | Auth |
| ------ | ------------- | ------------ | ---- |
| POST   | `/api/upload` | Upload image | Yes  |

## Assumptions

- **Authentication**: JWT tokens expire after 7 days. Users must re-login after expiry.
- **Collaborator roles**: "viewer" can only read; "editor" can read and edit content. Only the note owner can delete notes, pin/unpin, or manage collaborators.
- **Image uploads**: Stored on the server filesystem in `backend/uploads/`. In production, you'd want to use cloud storage (S3, Cloudinary, etc.).
- **Full-text search**: Uses MongoDB's built-in text index — works well for English content. For multi-language support, consider an external search engine.
- **Rich text**: Content is stored as HTML (from React Quill). DOMPurify is used on the frontend to sanitize rendered HTML.
- **No real-time sync**: Collaboration is not real-time (no WebSockets). Users see changes after refreshing or re-opening a note. Real-time could be added with Socket.IO as a future enhancement.
- **Rate limiting**: API is rate-limited to 100 requests per 15-minute window per IP.

## License

MIT
