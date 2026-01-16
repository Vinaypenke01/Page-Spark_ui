# 🚀 Page Spark - Frontend

> AI-Powered Live Page Generator - Create stunning web pages in seconds with AI

[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [API Integration](#-api-integration)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Page Spark** is a modern SaaS web application that allows users to generate beautiful, live web pages using AI. Simply describe what you want, provide your email, and our AI will create a custom web page for you in seconds - no coding required, no account needed!

### Key Highlights

- ✨ **AI-Powered Generation** - Describe your vision, let AI create it
- ⚡ **Instant Results** - Pages generated in seconds
- 🎨 **Beautiful Design** - Modern, responsive, and professional
- 🔗 **Shareable Links** - Get a unique URL for every page
- 🛡️ **Admin Dashboard** - Comprehensive admin controls
- 🌙 **Dark Mode Support** - Theme switching included

---

## ✨ Features

### User Features

#### 🎯 Page Generation
- **AI-Powered:** Describe your page needs in natural language
- **Customizable:** Choose page type (birthday, event, landing, portfolio, etc.)
- **Theme Options:** Select from multiple visual themes
- **Email Delivery:** Receive live page links via email
- **Real-time Generation:** See progress with loading states

#### 🎨 Design System
- **Modern UI:** Built with shadcn/ui and TailwindCSS
- **Responsive:** Works perfectly on all devices
- **Accessible:** WCAG-compliant components
- **Custom Animations:** Smooth transitions and hover effects

### Admin Features

#### 📊 Dashboard
- **Analytics Overview:** Total pages, views, and conversion rates
- **Recent Activity:** Real-time page generation monitoring
- **Popular Types:** Visual breakdown of page type distribution
- **User Management:** Track and manage user interactions

#### 🔐 Admin Management
- **Secure Login:** Protected admin authentication
- **User Creation:** Create new admin accounts
- **Role Management:** Admin and Super Admin roles
- **Activity Logs:** Monitor all admin actions

---

## 🛠️ Technology Stack

### Core Framework
```json
{
  "React": "18.3.1",          // UI Library
  "TypeScript": "5.8.3",      // Type Safety
  "Vite": "5.4.19",           // Build Tool
  "React Router": "6.30.1"    // Client-side Routing
}
```

### UI & Styling
```json
{
  "TailwindCSS": "3.4.17",            // Utility-first CSS
  "shadcn/ui": "latest",              // Component Library
  "Radix UI": "latest",               // Accessible Primitives
  "Lucide React": "0.462.0",          // Icon Library
  "class-variance-authority": "0.7.1", // Component Variants
  "tailwind-merge": "2.6.0"           // Class Merging
}
```

### State Management & Data
```json
{
  "@tanstack/react-query": "5.83.0", // Server State Management
  "react-hook-form": "7.61.1",       // Form Management
  "zod": "3.25.76"                   // Schema Validation
}
```

### Development Tools
```json
{
  "@vitejs/plugin-react-swc": "3.11.0", // Fast Refresh with SWC
  "ESLint": "9.32.0",                   // Code Linting
  "TypeScript ESLint": "8.38.0",        // TS Linting
  "Autoprefixer": "10.4.21",            // CSS Prefixing
  "PostCSS": "8.5.6"                    // CSS Processing
}
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js:** v18+ ([Download](https://nodejs.org/))
- **npm:** v9+ (comes with Node.js) or **bun** v1+ ([Download](https://bun.sh/))
- **Git:** For version control ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd page-spark-main
   ```

2. **Install dependencies**
   
   Using npm:
   ```bash
   npm install
   ```
   
   Or using bun (faster):
   ```bash
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:8000
   
   # App Configuration
   VITE_APP_NAME=Page Spark
   VITE_APP_VERSION=1.0.0
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   
   Navigate to: `http://localhost:8080`

---

## 📁 Project Structure

```
page-spark-main/
│
├── public/                     # Static assets
│   ├── logo.png               # Application logo
│   └── og-image.png           # Social media preview image
│
├── src/                        # Source code
│   │
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components (49 components)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...           # 45 more UI components
│   │   │
│   │   ├── admin/            # Admin-specific components
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── PagesTable.tsx
│   │   │
│   │   ├── Header.tsx        # Main header component
│   │   ├── PageGenerator.tsx # AI page generation form
│   │   ├── ResultCard.tsx    # Success result display
│   │   ├── LoadingState.tsx  # Loading animations
│   │   └── NavLink.tsx       # Navigation link component
│   │
│   ├── pages/                # Route-level page components
│   │   ├── Index.tsx         # Main landing/generator page
│   │   ├── AdminDashboard.tsx # Admin analytics dashboard
│   │   ├── AdminLogin.tsx    # Admin authentication
│   │   ├── AdminRegister.tsx # Admin registration
│   │   ├── AdminCreate.tsx   # Create new admin users
│   │   └── NotFound.tsx      # 404 error page
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── use-toast.ts      # Toast notification hook
│   │   └── use-mobile.tsx    # Mobile detection hook
│   │
│   ├── lib/                  # Utility functions
│   │   └── utils.ts          # Helper utilities (cn function, etc.)
│   │
│   ├── App.tsx               # Root application component
│   ├── main.tsx              # Application entry point
│   ├── index.css             # Global styles & design tokens
│   ├── App.css               # Component-specific styles
│   └── vite-env.d.ts         # Vite type definitions
│
├── .gitignore                # Git ignore rules
├── index.html                # HTML entry point
├── package.json              # Dependencies & scripts
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # TailwindCSS configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.app.json         # App-specific TS config
├── tsconfig.node.json        # Node-specific TS config
├── eslint.config.js          # ESLint configuration
├── postcss.config.js         # PostCSS configuration
├── components.json           # shadcn/ui configuration
├── CODE_REVIEW.md            # Comprehensive code review
└── README.md                 # This file
```

---

## 💻 Development

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Dev Server** | `npm run dev` | Start development server on port 8080 |
| **Build** | `npm run build` | Build for production |
| **Build (Dev)** | `npm run build:dev` | Build in development mode |
| **Lint** | `npm run lint` | Run ESLint checks |
| **Preview** | `npm run preview` | Preview production build |

### Development Workflow

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code patterns
   - Use TypeScript for type safety
   - Follow TailwindCSS conventions
   - Use shadcn/ui components when possible

3. **Test your changes**
   ```bash
   npm run dev
   # Open http://localhost:8080 and test
   ```

4. **Lint your code**
   ```bash
   npm run lint
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: Add new feature"
   ```

6. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

#### TypeScript
```typescript
// ✅ Good: Type all props and state
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
};
```

#### Component Structure
```typescript
// 1. Imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
}

// 3. Component
const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  // 4. State/Hooks
  const [count, setCount] = useState(0);
  
  // 5. Handlers
  const handleClick = () => {
    setCount(prev => prev + 1);
  };
  
  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>{count}</Button>
    </div>
  );
};

// 7. Export
export default MyComponent;
```

#### TailwindCSS
```typescript
// ✅ Good: Use utility classes
<div className="flex items-center justify-center p-4 bg-card rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-foreground">Hello</h1>
</div>

// ✅ Use cn() utility for conditional classes
import { cn } from "@/lib/utils";

<button className={cn(
  "px-4 py-2 rounded",
  isActive && "bg-primary text-white",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>
  Click me
</button>
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# ===========================================
# API Configuration
# ===========================================
VITE_API_URL=http://localhost:8000

# ===========================================
# App Configuration
# ===========================================
VITE_APP_NAME=Page Spark
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=AI-Powered Live Page Generator

# ===========================================
# Feature Flags (Optional)
# ===========================================
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANALYTICS=false
```

**Important Notes:**
- All Vite environment variables must be prefixed with `VITE_`
- Never commit sensitive keys to version control
- Use different `.env` files for different environments (`.env.development`, `.env.production`)

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: "::",      // Listen on all interfaces (IPv6)
    port: 8080,      // Development server port
    hmr: {
      overlay: false // Disable error overlay
    }
  },
  plugins: [
    react()          // React with SWC for fast refresh
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src") // Path alias for imports
    }
  }
});
```

### TailwindCSS Configuration

The design system uses HSL-based custom properties for easy theming:

```typescript
// tailwind.config.ts
export default {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        accent: "hsl(var(--accent))",
        // ... more colors
      }
    }
  }
}
```

To customize colors, edit `src/index.css`:

```css
:root {
  --primary: 239 84% 67%;    /* Purple-blue */
  --accent: 174 77% 48%;     /* Teal */
  --background: 220 20% 98%; /* Light gray */
}
```

---

## 🌐 API Integration

### API Service Pattern (Recommended)

Create a centralized API service:

```typescript
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  // Page Generation
  generatePage: async (data: {
    prompt: string;
    email: string;
    pageType?: string;
    theme?: string;
  }) => {
    const response = await fetch(`${API_URL}/api/generate/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        prompt: data.prompt,
        page_type: data.pageType,
        theme: data.theme
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate page');
    }
    
    return response.json();
  },
  
  // Admin Authentication
  admin: {
    login: async (credentials: { email: string; password: string }) => {
      const response = await fetch(`${API_URL}/api/admin/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return response.json();
    },
    
    getDashboard: async (token: string) => {
      const response = await fetch(`${API_URL}/api/admin/dashboard/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.json();
    }
  }
};
```

### Using the API Service

```typescript
// In a component
import { api } from '@/services/api';

const handleGenerate = async (data) => {
  try {
    const result = await api.generatePage(data);
    setGeneratedUrl(result.live_url);
  } catch (error) {
    console.error('Generation failed:', error);
    toast.error('Failed to generate page');
  }
};
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deployment Platforms

#### **Netlify** (Recommended)

1. **Connect your repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Select your repository

2. **Configure build settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Add environment variables**
   - Go to Site settings → Environment variables
   - Add `VITE_API_URL` with your API URL

4. **Deploy**
   - Netlify auto-deploys on every push to main

#### **Vercel**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add environment variables**
   ```bash
   vercel env add VITE_API_URL
   ```

#### **Static Hosting (AWS S3, GitHub Pages, etc.)**

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder** to your hosting service

3. **Configure routing**
   - For SPA routing, redirect all requests to `index.html`
   - Example for S3: Set error document to `index.html`

### Performance Optimization

#### Code Splitting
```typescript
// Lazy load admin routes
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/admin" element={<AdminDashboard />} />
  </Routes>
</Suspense>
```

#### Bundle Analysis
```bash
# Add bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
});
```

---

## 🎨 UI Components

### shadcn/ui Component Library

This project includes **49 pre-built shadcn/ui components**:

<details>
<summary><strong>📋 Complete Component List</strong> (Click to expand)</summary>

#### Form Components
- `input` - Text input field
- `textarea` - Multi-line text input
- `select` - Dropdown select
- `checkbox` - Checkbox input
- `radio-group` - Radio button group
- `switch` - Toggle switch
- `slider` - Range slider
- `label` - Form label
- `form` - Form wrapper with validation

#### Feedback Components
- `toast` - Toast notifications
- `sonner` - Alternative toast notifications
- `alert` - Alert messages
- `alert-dialog` - Confirmation dialog
- `dialog` - Modal dialog
- `drawer` - Side drawer
- `progress` - Progress bar
- `skeleton` - Loading skeleton

#### Navigation Components
- `tabs` - Tabbed interface
- `accordion` - Collapsible content
- `breadcrumb` - Breadcrumb navigation
- `navigation-menu` - Navigation menu
- `menubar` - Menu bar
- `sidebar` - Sidebar navigation
- `pagination` - Page navigation

#### Layout Components
- `card` - Card container
- `separator` - Visual separator
- `resizable` - Resizable panels
- `scroll-area` - Scrollable area
- `sheet` - Slide-out panel
- `aspect-ratio` - Aspect ratio container

#### Interactive Components
- `button` - Button element
- `dropdown-menu` - Dropdown menu
- `popover` - Popover overlay
- `tooltip` - Tooltip hint
- `hover-card` - Hover card
- `context-menu` - Right-click menu
- `command` - Command palette
- `toggle` - Toggle button
- `toggle-group` - Toggle button group

#### Data Display Components
- `table` - Data table
- `badge` - Badge label
- `avatar` - User avatar
- `chart` - Chart components
- `carousel` - Image carousel
- `calendar` - Date calendar
- `date-picker` - Date picker

#### Utility Components
- `collapsible` - Collapsible section
- `input-otp` - OTP input

</details>

### Adding New Components

To add a new shadcn/ui component:

```bash
npx shadcn@latest add <component-name>
```

Examples:
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add select
```

---

## 🧪 Testing (Recommended Addition)

### Setting up Tests

1. **Install testing dependencies**
   ```bash
   npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
   ```

2. **Create test configuration**
   ```typescript
   // vitest.config.ts
   import { defineConfig } from 'vitest/config';
   import react from '@vitejs/plugin-react-swc';
   
   export default defineConfig({
     plugins: [react()],
     test: {
       environment: 'jsdom',
       globals: true,
       setupFiles: './src/test/setup.ts'
     }
   });
   ```

3. **Write tests**
   ```typescript
   // src/components/__tests__/Button.test.tsx
   import { render, screen } from '@testing-library/react';
   import { Button } from '../ui/button';
   
   describe('Button', () => {
     it('renders correctly', () => {
       render(<Button>Click me</Button>);
       expect(screen.getByText('Click me')).toBeInTheDocument();
     });
   });
   ```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Contribution Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: Add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: Add dark mode toggle
fix: Correct email validation regex
docs: Update API integration guide
style: Format code with prettier
refactor: Simplify PageGenerator component
test: Add tests for admin login
chore: Update dependencies
```

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 🙏 Acknowledgments

### Technologies & Libraries

- [React](https://reactjs.org/) - UI Library
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Vite](https://vitejs.dev/) - Build Tool
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [shadcn/ui](https://ui.shadcn.com/) - Component Library
- [Radix UI](https://www.radix-ui.com/) - Primitive Components
- [Lucide](https://lucide.dev/) - Icon Library
- [React Router](https://reactrouter.com/) - Routing
- [React Query](https://tanstack.com/query) - Server State
- [React Hook Form](https://react-hook-form.com/) - Form Management
- [Zod](https://zod.dev/) - Schema Validation

---

## 📞 Support

For questions, issues, or support:

- **Documentation:** See [CODE_REVIEW.md](./CODE_REVIEW.md) for detailed code documentation
- **Issues:** Create an issue in the repository
- **Email:** [Your contact email]

---

## 🗺️ Roadmap

### Planned Features

- [ ] **Authentication System**
  - [ ] JWT token-based auth
  - [ ] Protected routes
  - [ ] Session management
  - [ ] Password reset flow

- [ ] **API Integration**
  - [ ] Centralized API service
  - [ ] Error handling
  - [ ] Retry logic
  - [ ] Request caching

- [ ] **Testing**
  - [ ] Unit tests for components
  - [ ] Integration tests
  - [ ] E2E tests
  - [ ] 80%+ code coverage

- [ ] **Performance**
  - [ ] Code splitting
  - [ ] Lazy loading
  - [ ] Image optimization
  - [ ] Bundle size optimization

- [ ] **Accessibility**
  - [ ] ARIA labels
  - [ ] Keyboard navigation
  - [ ] Screen reader support
  - [ ] WCAG 2.1 AA compliance

- [ ] **Features**
  - [ ] Page templates library
  - [ ] Custom domain support
  - [ ] Page analytics
  - [ ] Collaboration features

---

<div align="center">

**Built with ❤️ using React, TypeScript, and TailwindCSS**

⭐ Star this repository if you find it helpful!

</div>
