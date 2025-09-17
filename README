# Tiny Todoist

A full-stack task management application inspired by Todoist, built with a modern tech stack including React, Node.js, PostgreSQL, and TypeScript. This project aims to replicate the core functionalities and clean user experience of Todoist for educational purposes.

**Live Demo:** [https://tiny-todoist.vercel.app/](https://tiny-todoist.vercel.app/)

## ✨ Features

- **Authentication**: Secure user sign-up and login with email/password and GitHub OAuth.
- **Email Verification**: Magic link email verification for new user sign-ups.
- **Task Management**: Full CRUD operations for tasks, including titles, descriptions, priorities, and due dates.
- **Project Organization**: Create, update, and delete projects to categorize tasks.
- **Hierarchical Tasks**: Support for nested subtasks.
- **Task Views**: Filter tasks by Inbox, Today, Upcoming, and specific projects.
- **Comments & Attachments**: Add comments and upload file attachments to tasks.
- **Profile Management**: Users can update their name and avatar.
- **Responsive UI**: Clean and modern interface that works seamlessly on desktop and mobile devices.

## 🛠️ Tech Stack

| Category         | Technology                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend**     | [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)                        |
| **Backend**      | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/)               |
| **Database**     | [PostgreSQL](https://www.postgresql.org/), [Prisma](https://www.prisma.io/)                                                    |
| **Styling**      | [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/) |
| **State Mgt**    | [TanStack Query](https://tanstack.com/query/latest), [Zustand](https://zustand-demo.pmnd.rs/)                                  |
| **Auth**         | [Passport.js](http://www.passportjs.org/) (GitHub, JWT), [bcryptjs](https://www.npmjs.com/package/bcryptjs)                    |
| **File Storage** | [Supabase Storage](https://supabase.com/storage)                                                                               |
| **Validation**   | [Zod](https://zod.dev/)                                                                                                        |

## 🚀 Getting Started

To clone and run this project locally, you will need [Node.js](https://nodejs.org/en) (v18+), [npm](https://www.npmjs.com/), and [Docker](https://www.docker.com/) (to run PostgreSQL) installed on your machine.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/tiny-todoist.git
cd tiny-todoist
```

### 2. Setup Backend

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file from the example
cp .env.example .env
```

Next, you need to start a PostgreSQL database instance. The easiest way is using Docker:

```bash
docker run --name tiny-todoist-db -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

Then, update the environment variables in `server/.env` with your database credentials, Supabase keys, GitHub OAuth details, and other secrets.

```env
# server/.env

# Database
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/tiny_todoist?schema=public"
DIRECT_URL="postgresql://postgres:mysecretpassword@localhost:5432/tiny_todoist?schema=public"

# Supabase (for file storage)
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
SUPABASE_BUCKET_NAME=...
SUPABASE_AVATAR_BUCKET_NAME=...

# GitHub OAuth
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# JWT
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

Finally, apply the database migrations and start the server:

```bash
# Apply database schema
npx prisma migrate dev

# Run the development server
npm run dev
```

The server will be running at `http://localhost:3000`.

### 3. Setup Frontend

```bash
# Navigate to the client directory from the root
cd client

# Install dependencies
npm install

# Create a .env file
cp .env.example .env
```

Update the `client/.env` file to point to the server's API URL:

```env
# client/.env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Start the client development server:

```bash
npm run dev
```

The client will be running at `http://localhost:5173`.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Disclaimer:** This project is for educational purposes only and is not affiliated with Todoist. All brand assets of Todoist are the property of their respective owners.
