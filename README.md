# HikePal Hong Kong

A comprehensive hiking companion app featuring route planning, AI-powered guidance, and social hiking features.

## 🚀 Setup Instructions (如何启动)

### 1. Supabase Setup (数据库设置)

This project uses Supabase for authentication and database.

1.  Create a project at [Supabase](https://supabase.com).
2.  Go to the **SQL Editor** in your Supabase dashboard.
3.  Copy the content from `db_schema.sql` in this project.
4.  Paste it into the SQL Editor and click **Run**.
    *   *Note: This creates the `profiles` table and sets up the automation to handle new user signups.*

### 2. Environment Variables (环境变量)

To connect to your database and AI services, you need to set up your local environment variables.

1.  Find the file named `.env.example` in the project root.
2.  Copy it and rename the copy to `.env` (or create a new `.env` file).
3.  Fill in your keys in the `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key
VITE_GOOGLE_API_KEY=your-gemini-api-key
```

*   **Supabase Keys**: Found in Project Settings -> API.
*   **Gemini Key**: Get it from Google AI Studio.

### 3. Install & Run

```bash
npm install
npm run dev
```

## 🛠️ Tech Stack

*   React 19
*   TypeScript
*   Vite
*   Supabase (Auth & Database)
*   Google Gemini API (AI Features)
*   Tailwind CSS
