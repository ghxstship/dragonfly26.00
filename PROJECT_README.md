# Dragonfly 26.00

**Production Management Platform** - A comprehensive multi-tenant platform for production, event, and project management.

---

## 🚀 Quick Start

Get up and running in 5 minutes:
- **[Quick Start Guide](QUICKSTART.md)** - Installation and setup
- **[Architecture Overview](ARCHITECTURE.md)** - System design
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment

---

## 📚 Documentation

All documentation has been consolidated into an organized structure:

### 👉 **[View Full Documentation →](docs/README.md)**

### Quick Links

- **[Layers](docs/README.md#%EF%B8%8F-layers)** - 8 architectural layers (Database → UI → Integrations)
- **[Modules](docs/README.md#-modules)** - 20 feature modules with 174 tabs
- **[Features](docs/README.md#-features)** - i18n, CRUD, Views, Forms, etc.
- **[Guides](docs/README.md#-guides)** - Development and testing guides

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Context + Hooks
- **i18n**: next-intl (20 languages)

### Backend
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **Functions**: Supabase Edge Functions
- **Payments**: Stripe

### Infrastructure
- **Hosting**: Vercel (recommended)
- **Database**: Supabase Cloud
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics

---

## 📊 Project Status

- **Backend**: ✅ 100% Complete - All 120+ tables deployed
- **Frontend**: ✅ 95% Complete - All hooks and components ready
- **i18n**: 🟡 70% Complete - Infrastructure done, strings in progress
- **Documentation**: ✅ 100% Complete - Fully consolidated and organized

### Features
- ✅ 20 modules with 174 tabs
- ✅ 18 view types (List, Board, Calendar, Timeline, etc.)
- ✅ Real-time collaboration
- ✅ Multi-tenant architecture
- ✅ Role-based access control
- ✅ 20 languages supported
- ✅ Stripe integration
- ✅ File storage & management
- ✅ Advanced forms system
- ✅ Premium microanimations

---

## 🎯 Key Modules

1. **Dashboard** - Personalized user dashboard
2. **Projects** - Productions and task management
3. **Events** - Event scheduling and run-of-show
4. **People** - Personnel, teams, and time tracking
5. **Assets** - Equipment inventory and maintenance
6. **Locations** - Venues and facilities
7. **Files** - Document management
8. **Finance** - Budgets, invoices, and transactions
9. **Procurement** - Purchase orders and requisitions
10. **Jobs** - Recruitment and applicant tracking
11. **Companies** - Vendors and clients
12. **Community** - Internal social network
13. **Marketplace** - Product marketplace
14. **Resources** - Knowledge base
15. **Reports** - Custom report generation
16. **Analytics** - Data analytics and insights
17. **Admin** - System administration
18. **Settings** - User and organization settings
19. **Profile** - User profiles and work history
20. **Insights** - AI-powered insights

---

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (optional)

### Installation
```bash
# Clone repository
git clone <repository-url>
cd dragonfly26.00

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Stripe keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📖 Documentation Structure

```
docs/
├── README.md                    # Documentation index
├── DOCUMENTATION_AUDIT.md       # Consolidation audit
├── CONSOLIDATION_SUMMARY.md     # Cleanup summary
│
├── layers/                      # Architecture layers
│   ├── LAYER_1_DATABASE.md      # Database schema
│   ├── LAYER_5_REALTIME.md      # Real-time features
│   ├── LAYER_7_UI.md            # Frontend integration
│   └── ... (8 total)
│
├── modules/                     # Feature modules
│   ├── MODULE_DASHBOARD.md      # Dashboard module
│   ├── MODULE_PROJECTS.md       # Projects module
│   └── ... (20 total)
│
├── features/                    # Cross-cutting features
│   ├── FEATURE_I18N.md          # Internationalization
│   ├── FEATURE_CRUD.md          # CRUD system
│   └── ... (8 total)
│
└── guides/                      # Operational guides
    └── ... (4 guides)
```

---

## 🤝 Contributing

1. Read the [Architecture Guide](ARCHITECTURE.md)
2. Check the [Documentation](docs/README.md)
3. Create a feature branch
4. Make your changes
5. Submit a pull request

---

## 📝 License

See [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Documentation**: [docs/README.md](docs/README.md)
- **Quick Start**: [QUICKSTART.md](QUICKSTART.md)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📞 Support

For issues and questions:
- Check the documentation first
- Review relevant module/layer docs
- Open an issue on GitHub

---

**Built with ❤️ for production teams worldwide**
