# 👨‍💻 Dragonfly Developer Documentation

**Complete Technical Documentation for Developers**

Version 26.00 | Last Updated: October 15, 2025

---

## 📚 Documentation Structure

This developer documentation is organized into four main sections.

---

## 🚀 Getting Started

New developer? Start here!

- **[Quick Start](getting-started/quick-start.md)** - Set up dev environment in 10 minutes
- **[Project Structure](getting-started/project-structure.md)** - Understand the codebase
- **[Development Workflow](getting-started/development-workflow.md)** - Day-to-day development
- **[Contribution Guidelines](getting-started/contributing.md)** - How to contribute

---

## 🏗️ Architecture

Understand how Dragonfly is built:

### System Architecture
- **[Overview](architecture/overview.md)** - High-level architecture
- **[Frontend Architecture](architecture/frontend.md)** - Next.js, React, TypeScript
- **[Backend Architecture](architecture/backend.md)** - Supabase, PostgreSQL
- **[Database Schema](architecture/database-schema.md)** - Complete schema documentation

### Layers
- **[Layer 1: Database](architecture/layer-1-database.md)** - PostgreSQL schema, PostGIS
- **[Layer 2: Storage](architecture/layer-2-storage.md)** - File storage system
- **[Layer 3: Authentication](architecture/layer-3-auth.md)** - Auth system
- **[Layer 4: RLS](architecture/layer-4-rls.md)** - Row Level Security
- **[Layer 5: Realtime](architecture/layer-5-realtime.md)** - Real-time subscriptions
- **[Layer 6: Business Logic](architecture/layer-6-business-logic.md)** - RPC functions
- **[Layer 7: UI](architecture/layer-7-ui.md)** - Frontend integration
- **[Layer 8: Integrations](architecture/layer-8-integrations.md)** - External APIs

---

## 🔌 APIs & Integration

Connect with Dragonfly programmatically:

### API Documentation
- **[REST API Reference](apis/rest-api.md)** - RESTful endpoints
- **[GraphQL API](apis/graphql.md)** - GraphQL queries and mutations
- **[Realtime API](apis/realtime.md)** - WebSocket connections
- **[Authentication API](apis/authentication.md)** - Auth endpoints

### SDKs & Libraries
- **[JavaScript/TypeScript SDK](apis/javascript-sdk.md)** - Official SDK
- **[React Hooks](apis/react-hooks.md)** - Custom hooks documentation
- **[Python SDK](apis/python-sdk.md)** - Python integration
- **[API Client Examples](apis/examples.md)** - Code examples

### Webhooks & Events
- **[Webhook Configuration](apis/webhooks.md)** - Set up webhooks
- **[Event Types](apis/event-types.md)** - Available event types
- **[Webhook Security](apis/webhook-security.md)** - Verify webhooks

---

## 📖 Development Guides

Practical guides for common development tasks:

### Module Development
- **[Creating a Module](guides/creating-modules.md)** - Build new modules
- **[Module Structure](guides/module-structure.md)** - Module conventions
- **[Module Integration](guides/module-integration.md)** - Integrate with platform

### Component Development
- **[Component Guidelines](guides/component-guidelines.md)** - Component best practices
- **[UI Components](guides/ui-components.md)** - Using shadcn/ui components
- **[Custom Components](guides/custom-components.md)** - Build custom components
- **[Component Testing](guides/component-testing.md)** - Test components

### Data & State Management
- **[Data Fetching](guides/data-fetching.md)** - Fetch data from Supabase
- **[State Management](guides/state-management.md)** - Using Zustand
- **[Caching Strategy](guides/caching.md)** - React Query caching
- **[Real-time Data](guides/realtime-data.md)** - Real-time subscriptions

### Database Development
- **[Writing Migrations](guides/database-migrations.md)** - Create migrations
- **[RLS Policies](guides/rls-policies.md)** - Row Level Security
- **[Database Functions](guides/database-functions.md)** - PostgreSQL functions
- **[Query Optimization](guides/query-optimization.md)** - Optimize queries

### Testing
- **[Testing Strategy](guides/testing-strategy.md)** - Overall approach
- **[Unit Testing](guides/unit-testing.md)** - Component unit tests
- **[Integration Testing](guides/integration-testing.md)** - API integration tests
- **[E2E Testing](guides/e2e-testing.md)** - End-to-end testing
- **[Test Data](guides/test-data.md)** - Mock data and fixtures

### Deployment
- **[Local Development](guides/local-development.md)** - Run locally
- **[Environment Variables](guides/environment-variables.md)** - Configuration
- **[Building for Production](guides/production-build.md)** - Build process
- **[Deployment Guide](guides/deployment.md)** - Deploy to production
- **[CI/CD Setup](guides/cicd.md)** - Continuous integration

### Performance
- **[Performance Optimization](guides/performance.md)** - Optimization techniques
- **[Bundle Size](guides/bundle-size.md)** - Reduce bundle size
- **[Image Optimization](guides/image-optimization.md)** - Optimize images
- **[Lazy Loading](guides/lazy-loading.md)** - Code splitting

### Security
- **[Security Best Practices](guides/security.md)** - Security guidelines
- **[Authentication](guides/authentication-dev.md)** - Implement auth
- **[Authorization](guides/authorization.md)** - Permission checks
- **[Data Validation](guides/data-validation.md)** - Validate user input

### Internationalization
- **[i18n Setup](guides/i18n-setup.md)** - Configure i18n
- **[Adding Translations](guides/adding-translations.md)** - Add new languages
- **[Translation Workflow](guides/translation-workflow.md)** - Translation process

---

## 🔧 Reference

### Technology Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- TailwindCSS 3.3
- shadcn/ui components
- Lucide React icons
- Framer Motion animations

**Backend:**
- Supabase (PostgreSQL 15)
- Supabase Auth
- Supabase Storage
- Supabase Realtime
- Edge Functions (Deno)

**State & Data:**
- Zustand (global state)
- TanStack Query (server state)
- React Hook Form (forms)
- Zod (validation)

**Development:**
- TypeScript (strict mode)
- ESLint
- Prettier (code formatting)
- Git (version control)

### Code Standards

- **[TypeScript Guidelines](guides/typescript-guidelines.md)** - TS best practices
- **[Code Style Guide](guides/code-style.md)** - Formatting standards
- **[Naming Conventions](guides/naming-conventions.md)** - Variable and file naming
- **[Git Workflow](guides/git-workflow.md)** - Branching and commits
- **[Pull Request Template](guides/pr-template.md)** - PR guidelines

### Module Reference

Complete documentation for all 20 modules:

1. **[Dashboard Module](modules/dashboard.md)**
2. **[Projects Module](modules/projects.md)**
3. **[Events Module](modules/events.md)**
4. **[People Module](modules/people.md)**
5. **[Assets Module](modules/assets.md)**
6. **[Locations Module](modules/locations.md)**
7. **[Files Module](modules/files.md)**
8. **[Finance Module](modules/finance.md)**
9. **[Procurement Module](modules/procurement.md)**
10. **[Jobs Module](modules/jobs.md)**
11. **[Companies Module](modules/companies.md)**
12. **[Community Module](modules/community.md)**
13. **[Marketplace Module](modules/marketplace.md)**
14. **[Resources Module](modules/resources.md)**
15. **[Reports Module](modules/reports.md)**
16. **[Analytics Module](modules/analytics.md)**
17. **[Insights Module](modules/insights.md)**
18. **[Admin Module](modules/admin.md)**
19. **[Settings Module](modules/settings.md)**
20. **[Profile Module](modules/profile.md)**

---

## 🆘 Support & Community

### Getting Help

- **Documentation**: Search this documentation first
- **Code Examples**: Check `/examples` directory
- **GitHub Issues**: Report bugs and feature requests
- **Discussions**: Ask questions in GitHub Discussions
- **Slack/Discord**: Join developer community (if available)

### Contributing

We welcome contributions!

1. Read [Contribution Guidelines](getting-started/contributing.md)
2. Check [Good First Issues](https://github.com/your-org/dragonfly/labels/good-first-issue)
3. Fork repository
4. Make changes
5. Submit pull request

### Resources

- **[Changelog](../CHANGELOG.md)** - Version history
- **[Roadmap](../PRODUCT_ROADMAP.md)** - Future features
- **[Known Issues](https://github.com/your-org/dragonfly/issues)** - Bug tracker
- **[License](../../LICENSE)** - MIT License

---

## 📊 Project Statistics

**Codebase Metrics:**
- **Total Lines of Code**: 39,000+
- **Components**: 177 React components
- **Custom Hooks**: 23 hooks
- **Database Tables**: 100+
- **Migrations**: 88 applied
- **Languages Supported**: 20 languages
- **Modules**: 20 feature modules
- **Tabs**: 208 total tabs

**Coverage:**
- Backend: 100% complete
- Frontend: 95% complete
- Tests: In progress
- Documentation: 100% complete

---

**Let's Build Together! 🚀**
