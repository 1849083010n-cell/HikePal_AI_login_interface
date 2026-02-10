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

Create a `.env` file in the root directory (copy `.env.example` if it exists, or create new):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
VITE_GOOGLE_API_KEY=your_gemini_api_key
```

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
