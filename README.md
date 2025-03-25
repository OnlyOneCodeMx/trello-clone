# 🗂️ Trello Clone - Project Management Board

[![Next.js](https://img.shields.io/badge/Next.js-15.2.2-000000?logo=next.js&style=flat)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&style=flat)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&style=flat)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.2.1-2D3748?logo=prisma&style=flat)](https://prisma.io/)

A feature-rich Trello clone built with modern web technologies. Developed as a learning project to practice full-stack development and showcase in my professional portfolio. 🚀

![Project Preview](./public/planify.png)

## ✨ Features

- 🎯 Kanban-style task management
- 🖱️ Drag & drop functionality with `@hello-pangea/dnd`
- 🔒 Secure authentication using `@clerk/nextjs`
- 🐘 Supabase PostgreSQL database integration
- 📡 Next.js Server Actions for CRUD operations
- 📱 Fully responsive design
- 📅 Date management with `date-fns`
- 🏪 State management with `Zustand`
- 💬 Toast notifications using `sonner`
- 🛡️ Form validation with `zod`
- 💳 Payment integration with Stripe

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19 (RC)
- **State Management**: Zustand
- **Styling**: Tailwind CSS + `tailwind-merge`
- **UI Components**: `shadcn/ui` + `lucide-react` icons
- **Drag & Drop**: `@hello-pangea/dnd`
- **Server Actions**: Next.js Server Components
- **Notifications**: `sonner`
- **Hooks**: `usehooks-ts`

### Backend

- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Server Logic**: Next.js Server Actions
- **Payments**: Stripe SDK
- **Image API**: Unsplash

### Development Tools

- TypeScript
- ESLint
- Shadcn UI
- Prisma Studio

## 🚀 Getting Started

### Prerequisites

- Node.js ≥18.x
- Supabase account ([free tier available](https://supabase.com/))
- Clerk account ([sign up here](https://clerk.com/))
- Stripe account ([developer access](https://stripe.com/))

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/OnlyOneCodeMx/trello-clone
cd trello-clone
```

2. **Install dependencies**

```bash
npm install
```

3. _Set up enviroment variables_

```bash
cp .env .env.local
```

4. **Configure services**

```bash
# 1. Create accounts in:
#    - Supabase: https://supabase.com/
#    - Clerk: https://clerk.com/
#    - Stripe: https://stripe.com/
#
# 2. Create a Supabase project and set up Clerk-Supabase integration
#    - https://clerk.com/docs/integrations/databases/supabase
```

5. **Environment variables**

### Required Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database (Supabase)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Third-party Services
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_key
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Important Notes

1. Replace all ... and placeholder values with your actual keys

2. Keep these variables in .env (not committed to version control)

3. For Supabase credentials, get the exact connection string from your project settings

4. **Database setup**

```bash
npx prisma generate
npx prisma db push
```

7. **Start the development server**

```bash
npm run dev
```

## 📚 Key Learnings

### This project helped me master:

- Full-stack development with `Next.js` App Router

- Server-Side Mutations using `Next.js Server Actions`

- Database integration with Supabase `(PostgreSQL)`

- Advanced `drag & drop` implementations

- Modern `authentication flows` with Clerk

- Type-safe form `validation with Zod`

- `Server Components` architecture patterns

- `Payment integration` with Stripe

- Secure `database operations` with Prisma

## 🤝 Contributing

### Contributions are welcome! Please follow these steps:

1. Fork the repository

2. Create your feature branch (git checkout -b feature/AmazingFeature)

3. Commit your changes (git commit -m 'Add some AmazingFeature')

4. Push to the branch (git push origin feature/AmazingFeature)

5. Open a Pull Request

## 📝 License

_This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details._

---

### ⭐ Star this repo if you found it useful
