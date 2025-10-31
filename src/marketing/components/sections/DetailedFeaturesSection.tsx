"use client"

import { 
import { useTranslations } from "next-intl"useGenerationalMarketing } from "@/hooks/use-generational-marketing"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height, cards } from "@/design-tokens"
import { 
  Briefcase, Building2, Network, Zap, BarChart3, Settings,
  Calendar, Users, MapPin, FileText, Package, Folder,
  DollarSign, Receipt, CreditCard, TrendingUp, PieChart, Wallet,
  MessageSquare, Store, BookOpen, Award, Share2, Trophy,
  Workflow, Clock, Bell, Repeat, GitBranch, Layers,
  LineChart, Database, FileBarChart, Target, Activity, Brain,
  Shield, Key, UserCog, Lock, Eye, Sliders, Quote
} from "lucide-react"

export function DetailedFeaturesSection(): JSX.Element {
  const t = useTranslations('marketing')

  const { tGen } = useGenerationalMarketing()
    
  return (
    <div>
      {/* Hero Section */}
      <section className={cn("relative pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950", padding.sectionX)}>
        <div className={cn("mx-auto text-center", container['6xl'])}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-title uppercase text-gray-900 dark:text-white mb-6 leading-tight">
            {tGen('detailedFeatures.hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-6 md:mb-8 leading-relaxed max-w-4xl mx-auto">
            {tGen('detailedFeatures.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Production Hub */}
      <section className={cn("py-20 bg-white dark:bg-gray-950", padding.sectionX)}>
        <div className={cn("mx-auto", container['6xl'])}>
          <div className="text-center mb-12">
            <Briefcase className={cn("mx-auto mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading uppercase text-gray-900 dark:text-white mb-4">
              {tGen('detailedFeatures.production.title')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {tGen('detailedFeatures.production.description')}
            </p>
          </div>
          
          <div className={cn(grid.cards3, "gap-6")}>
            {/* Projects */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Folder className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.production.projects.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.production.projects.description')}</p>
            </div>
            
            {/* Events */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Calendar className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.production.events.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.production.events.description')}</p>
            </div>
            
            {/* People */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Users className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.production.people.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.production.people.description')}</p>
            </div>
            
            {/* Assets */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Package className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.production.assets.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.production.assets.description')}</p>
            </div>
            
            {/* Locations */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <MapPin className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.production.locations.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.production.locations.description')}</p>
            </div>
            
            {/* Files */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <FileText className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.production.files.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.production.files.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial: Odysseus - Production Hub */}
      <section className={cn("py-12 bg-white dark:bg-gray-950", padding.sectionX)}>
        <div className={cn("mx-auto max-w-4xl")}>
          <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", cards.paddingSm)}>
            <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
            <p className="text-gray-700 dark:text-gray-300 mb-4 italic text-lg">{tGen('testimonials.odysseusQuote')}</p>
            <div>
              <p className="text-gray-900 dark:text-white font-semibold">{tGen('testimonials.odysseusAuthor')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('testimonials.odysseusRole')}</p>
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
              {tGen('detailedFeatures.business.title')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {tGen('detailedFeatures.business.description')}
            </p>
          </div>
          
          <div className={cn(grid.cards3, "gap-6")}>
            {/* Companies */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Building2 className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.business.companies.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.business.companies.description')}</p>
            </div>
            
            {/* Jobs */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Briefcase className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.business.jobs.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.business.jobs.description')}</p>
            </div>
            
            {/* Procurement */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Package className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.business.procurement.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.business.procurement.description')}</p>
            </div>
            
            {/* Invoices */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Receipt className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.business.invoices.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.business.invoices.description')}</p>
            </div>
            
            {/* Expenses */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <CreditCard className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.business.expenses.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.business.expenses.description')}</p>
            </div>
            
            {/* Budgets */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <DollarSign className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.business.budgets.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.business.budgets.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial: Captain Sisko - Business Hub */}
      <section className={cn("py-12 bg-gray-50 dark:bg-gray-900", padding.sectionX)}>
        <div className={cn("mx-auto max-w-4xl")}>
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl", cards.paddingSm)}>
            <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
            <p className="text-gray-700 dark:text-gray-300 mb-4 italic text-lg">{tGen('testimonials.captainSiskoQuote')}</p>
            <div>
              <p className="text-gray-900 dark:text-white font-semibold">{tGen('testimonials.captainSiskoAuthor')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('testimonials.captainSiskoRole')}</p>
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
              {tGen('detailedFeatures.network.title')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {tGen('detailedFeatures.network.description')}
            </p>
          </div>
          
          <div className={cn(grid.cards3, "gap-6")}>
            {/* Community */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <MessageSquare className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.network.community.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.network.community.description')}</p>
            </div>
            
            {/* Marketplace */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Store className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.network.marketplace.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.network.marketplace.description')}</p>
            </div>
            
            {/* Resources */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <BookOpen className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.network.resources.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.network.resources.description')}</p>
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
              {tGen('detailedFeatures.automations.title')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {tGen('detailedFeatures.automations.description')}
            </p>
          </div>
          
          <div className={cn(grid.cards3, "gap-6")}>
            {/* Workflows */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Workflow className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.automations.workflows.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.automations.workflows.description')}</p>
            </div>
            
            {/* Triggers */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Bell className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.automations.triggers.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.automations.triggers.description')}</p>
            </div>
            
            {/* Scheduled Tasks */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Clock className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.automations.scheduled.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.automations.scheduled.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial: Captain Marvel - Network Hub */}
      <section className={cn("py-12 bg-white dark:bg-gray-950", padding.sectionX)}>
        <div className={cn("mx-auto max-w-4xl")}>
          <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", cards.paddingSm)}>
            <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
            <p className="text-gray-700 dark:text-gray-300 mb-4 italic text-lg">{tGen('testimonials.captainMarvelQuote')}</p>
            <div>
              <p className="text-gray-900 dark:text-white font-semibold">{tGen('testimonials.captainMarvelAuthor')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('testimonials.captainMarvelRole')}</p>
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
              {tGen('detailedFeatures.intelligence.title')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {tGen('detailedFeatures.intelligence.description')}
            </p>
          </div>
          
          <div className={cn(grid.cards3, "gap-6")}>
            {/* Reports */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <FileBarChart className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.intelligence.reports.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.intelligence.reports.description')}</p>
            </div>
            
            {/* Analytics */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <LineChart className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.intelligence.analytics.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.intelligence.analytics.description')}</p>
            </div>
            
            {/* Insights */}
            <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Brain className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.intelligence.insights.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.intelligence.insights.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial: Captain Janeway - Intelligence Hub */}
      <section className={cn("py-12 bg-white dark:bg-gray-950", padding.sectionX)}>
        <div className={cn("mx-auto max-w-4xl")}>
          <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", cards.paddingSm)}>
            <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
            <p className="text-gray-700 dark:text-gray-300 mb-4 italic text-lg">{tGen('testimonials.captainJanewayQuote')}</p>
            <div>
              <p className="text-gray-900 dark:text-white font-semibold">{tGen('testimonials.captainJanewayAuthor')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('testimonials.captainJanewayRole')}</p>
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
              {tGen('detailedFeatures.system.title')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {tGen('detailedFeatures.system.description')}
            </p>
          </div>
          
          <div className={cn(grid.cards3, "gap-6")}>
            {/* Admin */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Shield className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.system.admin.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.system.admin.description')}</p>
            </div>
            
            {/* Settings */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <Sliders className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.system.settings.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.system.settings.description')}</p>
            </div>
            
            {/* User Profiles */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", padding.card, border.card)}>
              <UserCog className={cn("mb-3 text-blue-600", height.icon)} aria-hidden="true" />
              <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('detailedFeatures.system.profiles.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('detailedFeatures.system.profiles.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial: Moana - System Hub */}
      <section className={cn("py-12 bg-gray-50 dark:bg-gray-900", padding.sectionX)}>
        <div className={cn("mx-auto max-w-4xl")}>
          <div className={cn("bg-white dark:bg-gray-800 rounded-xl", cards.paddingSm)}>
            <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
            <p className="text-gray-700 dark:text-gray-300 mb-4 italic text-lg">{tGen('testimonials.moanaQuote')}</p>
            <div>
              <p className="text-gray-900 dark:text-white font-semibold">{tGen('testimonials.moanaAuthor')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('testimonials.moanaRole')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
