# Podcast Management System - Setup Guide

This guide will help you recreate this Podcast Management System web application from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- A code editor like **VS Code**

## Tech Stack

This application is built with:
- **React** 18.3+ - Frontend library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Pre-built React components
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## Step-by-Step Setup

### 1. Create a New Vite + React Project

```bash
npm create vite@latest podcast-hub -- --template react-ts
cd podcast-hub
npm install
```

### 2. Install Required Dependencies

```bash
# Core dependencies
npm install react-router-dom

# UI Components & Styling
npm install tailwindcss postcss autoprefixer
npm install -D @types/node
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge

# shadcn/ui setup
npx shadcn@latest init
```

When prompted during shadcn init:
- Style: Default
- Base color: Slate
- CSS variables: Yes

### 3. Install shadcn/ui Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add tabs
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add table
npx shadcn@latest add toast
```

### 4. Install Additional Dependencies

```bash
npm install lucide-react sonner
npm install @tanstack/react-query
```

### 5. Configure Tailwind CSS

Update `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add custom color tokens (see src/index.css)
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-hero': 'var(--gradient-hero)',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'medium': 'var(--shadow-medium)',
        'glow': 'var(--shadow-glow)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

### 6. Project Structure

Create the following folder structure:

```
src/
├── components/
│   ├── ui/              # shadcn components
│   ├── Header.tsx       # Navigation header
│   ├── ProtectedRoute.tsx
│   ├── PodcastEpisodes.tsx
│   └── EpisodeDetail.tsx
├── contexts/
│   ├── AuthContext.tsx  # Authentication state
│   └── DataContext.tsx  # Podcast data state
├── pages/
│   ├── Auth.tsx         # Login/Register
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Podcasts.tsx     # Podcaster view
│   ├── Episodes.tsx     # Listener view
│   ├── Admin.tsx        # Admin dashboard
│   ├── Profile.tsx      # User profile
│   └── NotFound.tsx     # 404 page
├── App.tsx              # Main app with routing
├── index.css            # Global styles & design tokens
└── main.tsx             # Entry point
```

### 7. Design System Setup

The application uses a custom design system defined in `src/index.css`:

**Key Features:**
- **HSL color palette** with CSS variables
- **Purple gradient** for primary branding
- **Orange accent** for calls-to-action
- **Smooth animations** and transitions
- **Soft shadows** for depth
- Light and dark mode support

### 8. Core Contexts

#### AuthContext (`src/contexts/AuthContext.tsx`)
Manages:
- User authentication (login/logout/register)
- User roles (Podcaster, Listener, Admin)
- Mock credentials for demo
- Local storage persistence

#### DataContext (`src/contexts/DataContext.tsx`)
Manages:
- Podcasts CRUD operations
- Episodes CRUD operations
- Comments system
- Play count tracking
- All data stored in-memory

### 9. Routing Setup

Update `src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Podcasts from '@/pages/Podcasts';
import Episodes from '@/pages/Episodes';
import Admin from '@/pages/Admin';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/podcasts"
              element={
                <ProtectedRoute allowedRoles={['podcaster']}>
                  <Podcasts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/episodes"
              element={
                <ProtectedRoute allowedRoles={['listener']}>
                  <Episodes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
```

### 10. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Features Overview

### Authentication System
- **Login/Register** with role selection
- **Demo credentials** visible on login page for quick testing
- Three user roles: Podcaster, Listener, Admin
- Protected routes based on user role

### Podcaster Features
- Create, edit, and delete podcasts
- Manage episodes for each podcast
- Add episode metadata (title, duration, audio URL, topic)
- Update play counts
- View analytics

### Listener Features
- Browse all episodes
- Sort by popularity or release date
- Search by topic or host
- View episode details
- Add and edit comments

### Admin Features
- View platform analytics
- Top episodes by views
- User management (view registered users)
- Platform statistics

### Profile Page
- User information
- Activity statistics
- Podcast collections (for Podcasters)
- Subscriptions (for Listeners)

## Demo Credentials

The app comes with pre-configured demo accounts:

1. **Podcaster Account**
   - Email: `podcaster@demo.com`
   - Password: `demo123`

2. **Listener Account**
   - Email: `listener@demo.com`
   - Password: `demo123`

3. **Admin Account**
   - Email: `admin@demo.com`
   - Password: `demo123`

## Design Highlights

- **Responsive design** - Works on mobile, tablet, and desktop
- **Gradient backgrounds** - Purple and orange theme
- **Card-based UI** - Clean, modern layout
- **Smooth animations** - Fade-in and slide-in effects
- **Toast notifications** - User feedback for actions
- **Semantic tokens** - Consistent design system

## Development Tips

1. **State Management**: All data is stored in-memory using React Context. For production, consider using a backend API.

2. **Styling**: Use semantic tokens from the design system instead of hardcoded colors. Example:
   ```tsx
   // Good
   <Button className="bg-gradient-primary">
   
   // Avoid
   <Button className="bg-purple-600">
   ```

3. **Components**: Break down large components into smaller, reusable pieces.

4. **Type Safety**: Leverage TypeScript interfaces for better developer experience.

5. **Error Handling**: Add proper validation and error messages for user inputs.

## Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## Deployment

You can deploy this app to:
- **Vercel**: `vercel deploy`
- **Netlify**: Connect your GitHub repo
- **GitHub Pages**: Use `gh-pages` package
- **Any static hosting service**

## Troubleshooting

**Issue**: Styles not loading
- Ensure Tailwind CSS is properly configured
- Check that `index.css` is imported in `main.tsx`

**Issue**: Routes not working
- Verify React Router is installed
- Check that BrowserRouter wraps your app

**Issue**: Components not found
- Run `npx shadcn@latest add [component-name]` to install missing components
- Check import paths use `@/` alias

## Further Enhancements

Consider adding:
- Real backend integration (Supabase, Firebase, etc.)
- Audio player functionality
- User avatars and profile pictures
- Email verification
- Password reset
- Advanced search and filtering
- Podcast RSS feeds
- Analytics dashboard with charts
- Social sharing features
- Subscription system

## Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Router](https://reactrouter.com)
- [Vite](https://vitejs.dev)

## License

This project is open source and available under the MIT License.
