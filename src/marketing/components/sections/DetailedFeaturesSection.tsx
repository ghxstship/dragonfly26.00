"use client"

import { useGenerationalMarketing } from "@/hooks/use-generational-marketing"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height } from "@/design-tokens"
import { 
  Briefcase, Building2, Network, Zap, BarChart3, Settings,
  Calendar, Users, MapPin, FileText, Package, Folder,
  DollarSign, Receipt, CreditCard, TrendingUp, PieChart, Wallet,
  MessageSquare, Store, BookOpen, Award, Share2, Trophy,
  Workflow, Clock, Bell, Repeat, GitBranch, Layers,
  LineChart, Database, FileBarChart, Target, Activity, Brain,
  Shield, Key, UserCog, Lock, Eye, Sliders
} from "lucide-react"

export function DetailedFeaturesSection(): JSX.Element {
  const { tGen } = useGenerationalMarketing()
    
  return (
    <div>
      {/* Hero Section */}
      <section className={cn("relative pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950", padding.sectionX)}>
        <div className={cn("mx-auto text-center", container['6xl'])}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-title uppercase text-gray-900 dark:text-white mb-6 leading-tight">
            {tGen('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-6 md:mb-8 leading-relaxed max-w-4xl mx-auto">
            {tGen('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Production Hub */}
      <section className={cn("py-20 bg-white dark:bg-gray-950", padding.sectionX)}>
        <div className={cn("mx-auto", container['6xl'])}>
          <div className="text-center mb-12">
            <Briefcase className={cn("mx-auto mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading uppercase text-gray-900 dark:text-white mb-4">
              {tGen('production.title')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {tGen('production.description')}
            </p>
          </div>
          
          <div className={cn(grid.cards3, "gap-6")}>
            {/* Projects */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Folder className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('production.projects.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('production.projects.description')}</p>
            </div>
            
            {/* Events */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Calendar className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('production.events.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('production.events.description')}</p>
            </div>
            
            {/* People */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Users className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('production.people.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('production.people.description')}</p>
            </div>
            
            {/* Assets */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Package className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('production.assets.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('production.assets.description')}</p>
            </div>
            
            {/* Locations */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <MapPin className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('production.locations.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('production.locations.description')}</p>
            </div>
            
            {/* Files */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <FileText className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('production.files.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('production.files.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hub */}
      <section className={cn("py-20 bg-gray-50 dark:bg-gray-900", padding.sectionX)}>
        <div className={cn("mx-auto", container['6xl'])}>
          <div className="text-center mb-12">
            <Building2 className={cn("mx-auto mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading uppercase text-gray-900 dark:text-white mb-4">
              {tGen('business.title')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {tGen('business.description')}
            </p>
          </div>
          
          <div className={cn(grid.cards3, "gap-6")}>
            {/* Companies */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Building2 className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('business.companies.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('business.companies.description')}</p>
            </div>
            
            {/* Jobs */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Briefcase className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('business.jobs.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('business.jobs.description')}</p>
            </div>
            
            {/* Procurement */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Package className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('business.procurement.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('business.procurement.description')}</p>
            </div>
            
            {/* Invoices */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Receipt className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('business.invoices.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('business.invoices.description')}</p>
            </div>
            
            {/* Expenses */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <CreditCard className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('business.expenses.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('business.expenses.description')}</p>
            </div>
            
            {/* Budgets */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <DollarSign className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('business.budgets.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('business.budgets.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Network Hub */}
      <section className={cn("py-20 bg-white dark:bg-gray-950", padding.sectionX)}>
        <div className={cn("mx-auto", container['6xl'])}>
          <div className="text-center mb-12">
            <Network className={cn("mx-auto mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading uppercase text-gray-900 dark:text-white mb-4">
              {tGen('network.title')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {tGen('network.description')}
            </p>
          </div>
          
          <div className={cn(grid.cards3, "gap-6")}>
            {/* Community */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <MessageSquare className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('network.community.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('network.community.description')}</p>
            </div>
            
            {/* Marketplace */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Store className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('network.marketplace.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('network.marketplace.description')}</p>
            </div>
            
            {/* Resources */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <BookOpen className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('network.resources.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('network.resources.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Automations Hub */}
      <section className={cn("py-20 bg-gray-50 dark:bg-gray-900", padding.sectionX)}>
        <div className={cn("mx-auto", container['6xl'])}>
          <div className="text-center mb-12">
            <Zap className={cn("mx-auto mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading uppercase text-gray-900 dark:text-white mb-4">
              {tGen('automations.title')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {tGen('automations.description')}
            </p>
          </div>
          
          <div className={cn(grid.cards3, "gap-6")}>
            {/* Workflows */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Workflow className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('automations.workflows.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('automations.workflows.description')}</p>
            </div>
            
            {/* Triggers */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Bell className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('automations.triggers.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('automations.triggers.description')}</p>
            </div>
            
            {/* Scheduled Tasks */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Clock className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('automations.scheduled.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('automations.scheduled.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Hub */}
      <section className={cn("py-20 bg-white dark:bg-gray-950", padding.sectionX)}>
        <div className={cn("mx-auto", container['6xl'])}>
          <div className="text-center mb-12">
            <BarChart3 className={cn("mx-auto mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading uppercase text-gray-900 dark:text-white mb-4">
              {tGen('intelligence.title')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {tGen('intelligence.description')}
            </p>
          </div>
          
          <div className={cn(grid.cards3, "gap-6")}>
            {/* Reports */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <FileBarChart className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('intelligence.reports.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('intelligence.reports.description')}</p>
            </div>
            
            {/* Analytics */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <LineChart className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('intelligence.analytics.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('intelligence.analytics.description')}</p>
            </div>
            
            {/* Insights */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Brain className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('intelligence.insights.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('intelligence.insights.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* System Hub */}
      <section className={cn("py-20 bg-gray-50 dark:bg-gray-900", padding.sectionX)}>
        <div className={cn("mx-auto", container['6xl'])}>
          <div className="text-center mb-12">
            <Settings className={cn("mx-auto mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading uppercase text-gray-900 dark:text-white mb-4">
              {tGen('system.title')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {tGen('system.description')}
            </p>
          </div>
          
          <div className={cn(grid.cards3, "gap-6")}>
            {/* Admin */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Shield className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('system.admin.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('system.admin.description')}</p>
            </div>
            
            {/* Settings */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Sliders className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('system.settings.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('system.settings.description')}</p>
            </div>
            
            {/* User Profiles */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <UserCog className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('system.profiles.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('system.profiles.description')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
