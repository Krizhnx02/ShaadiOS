# ShaadiOS — Enterprise-Grade Wedding Planning Dashboard

A high-performance, mobile-first, modular wedding planning dashboard built for Indian couples and families. Designed with Clean Architecture principles for team scalability.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** HeroUI + shadcn/ui primitives
- **Styling:** Tailwind CSS (mobile-first)
- **Validation:** Zod + React Hook Form
- **Icons:** Lucide React
- **Language:** TypeScript (strict mode)

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── budget/            # Budget tracking page
│   ├── tasks/             # Task management page
│   ├── vendors/           # Vendor management page
│   └── guests/            # Guest list page
├── components/
│   ├── layout/            # Sidebar, BottomNav, TopBar, DashboardLayout
│   └── ui/                # Reusable primitives (ProgressRing, StatCard, etc.)
├── features/
│   ├── dashboard/         # Dashboard-specific components
│   ├── budget/            # Budget tracking logic
│   ├── tasks/             # Task management + WhatsApp nudge
│   ├── vendors/           # Vendor shortlist & management
│   └── guests/            # Guest list & RSVP tracking
├── hooks/                 # Global reusable hooks
├── lib/
│   ├── types/             # Centralized TypeScript interfaces (Source of Truth)
│   ├── constants/         # Indian wedding event metadata, categories
│   ├── data/              # Seed/mock data
│   └── utils/             # Utilities (WhatsApp, currency formatting, cn)
```

## Key Features

### Two-Family Architecture
Every data object includes a `side` field: `'bride' | 'groom' | 'shared'`, enabling independent tracking per family.

### Privacy Layer (Perspective Toggle)
A perspective toggle in the UI switches between "All", "Bride's Side", and "Groom's Side" views. Financial details from the opposite family are blurred for privacy.

### WhatsApp Nudge Integration
One-tap WhatsApp messaging to nudge family members about pending tasks or follow up with vendors.

### Indian Wedding Events
Built-in support for: Mehendi, Sangeet, Haldi, Baraat, Pheras, Reception, Engagement.

### Responsive Design
- **Mobile:** Bottom navigation bar + compact top bar
- **Desktop:** Collapsible sidebar with full navigation

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Theme

- **Background:** #FDFCFB (Warm paper)
- **Accents:** Emerald (#047857) & Gold (#B45309)
- **Bride:** Pink (#DB2777)
- **Groom:** Blue (#2563EB)
- **Shared:** Green (#059669)
