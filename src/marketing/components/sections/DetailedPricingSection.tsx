"use client"

import { useState } from "react"
import { useGenerationalMarketing } from "@/hooks/use-generational-marketing"
import { cn } from "@/lib/utils"
import { spacing, padding, container, cards, height } from "@/design-tokens"
import { 
  Check, 
  X, 
  Ghost, 
  Plane, 
  Sword, 
  Compass, 
  Target, 
  Shield, 
  Handshake, 
  Eye, 
  Users, 
  Star,
  Quote,
  type LucideIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

// Role definitions
const ROLES = {
  phantom: {
    icon: Ghost,
    type: "Internal Role",
    accessLevel: "Supreme",
    permissions: "Full Control",
    gradient: "from-purple-600 to-indigo-600",
    abilities: [
      "Complete system administration and configuration",
      "Manage all users, roles, and permissions across the organization",
      "Access and modify all data fields and custom configurations",
      "Override any workflow or approval process",
      "Full audit trail visibility and compliance controls"
    ]
  },
  aviator: {
    icon: Plane,
    type: "Internal Role",
    accessLevel: "Executive",
    permissions: "Strategic",
    gradient: "from-purple-600 to-indigo-600",
    abilities: [
      "Cross-project visibility and resource allocation",
      "Advanced analytics and executive dashboards",
      "Budget oversight and financial planning",
      "Team performance metrics and reporting",
      "Strategic workflow design and optimization"
    ]
  },
  gladiator: {
    icon: Sword,
    type: "Internal Role",
    accessLevel: "Advanced",
    permissions: "Full Edit",
    gradient: "from-purple-600 to-indigo-600",
    abilities: [
      "Full project creation and management",
      "Complete editing rights across all project elements",
      "Team coordination and task assignment",
      "Workflow customization and automation setup",
      "Client communication and stakeholder management"
    ]
  },
  navigator: {
    icon: Compass,
    type: "Internal Role",
    accessLevel: "Intermediate",
    permissions: "Edit & Guide",
    gradient: "from-purple-600 to-indigo-600",
    abilities: [
      "Project coordination and timeline management",
      "Task creation and assignment",
      "Standard workflow execution",
      "Team collaboration and communication",
      "Progress tracking and status updates"
    ]
  },
  deviator: {
    icon: Target,
    type: "Internal Role",
    accessLevel: "Standard",
    permissions: "Contribute",
    gradient: "from-purple-600 to-indigo-600",
    abilities: [
      "Task completion and status updates",
      "File uploads and asset management",
      "Comment and collaborate on assignments",
      "View project timelines and dependencies",
      "Access to standardized workflows and templates"
    ]
  },
  raider: {
    icon: Shield,
    type: "Internal Role",
    accessLevel: "Basic",
    permissions: "View & Learn",
    gradient: "from-purple-600 to-indigo-600",
    abilities: [
      "View-only access to assigned projects",
      "Access to community resources and learning materials",
      "Participate in discussions and forums",
      "Basic profile and portfolio management",
      "Explore industry best practices and templates"
    ]
  },
  partner: {
    icon: Handshake,
    type: "External Role",
    accessLevel: "Strategic",
    permissions: "Collaborative",
    gradient: "from-pink-500 to-orange-500",
    abilities: [
      "Dedicated project workspace access",
      "Two-way data sharing and collaboration",
      "Custom integration with partner systems",
      "Joint workflow management",
      "Shared reporting and analytics"
    ]
  },
  visitor: {
    icon: Eye,
    type: "External Role",
    accessLevel: "Limited",
    permissions: "View Only",
    gradient: "from-pink-500 to-orange-500",
    abilities: [
      "Read-only access to designated projects",
      "View timelines and milestones",
      "Limited commenting on specific items",
      "Download approved deliverables",
      "Time-limited access controls"
    ]
  },
  vendor: {
    icon: Users,
    type: "External Role",
    accessLevel: "Transactional",
    permissions: "Scoped Access",
    gradient: "from-pink-500 to-orange-500",
    abilities: [
      "Access to assigned vendor tasks only",
      "Upload deliverables to designated areas",
      "Receive and respond to project requirements",
      "Limited visibility to relevant project context",
      "Secure file transfer and approval workflows"
    ]
  },
  ambassador: {
    icon: Star,
    type: "External Role",
    accessLevel: "Community",
    permissions: "Represent",
    gradient: "from-pink-500 to-orange-500",
    abilities: [
      "Community moderation and support",
      "Host events and training sessions",
      "Create and share educational content",
      "Facilitate introductions and networking",
      "Provide feedback to shape platform development"
    ]
  }
} as const

type RoleKey = keyof typeof ROLES

interface RoleModalProps {
  role: RoleKey
  onClose: () => void
}

function RoleModal({ role, onClose }: RoleModalProps) {
  const { tGen } = useGenerationalMarketing()
  const roleData = ROLES[role]
  const Icon = roleData.icon

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-400"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors z-10 bg-gray-800/80 rounded-full p-1.5 sm:p-2"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Floating icon */}
        <div className="text-center mb-4 sm:mb-6">
          <div className={cn(
            "inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full animate-bounce",
            "bg-gradient-to-r text-white",
            roleData.gradient
          )}>
            <Icon className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
        </div>

        {/* Role name */}
        <h2 className="text-xl sm:text-2xl md:text-3xl text-white text-center mb-2 font-heading uppercase">
          {tGen(`${role}.name`)}
        </h2>

        {/* Role type badge */}
        <div className="flex flex-wrap justify-center mb-4 sm:mb-6">
          <span className={cn(
            "px-3 py-1 sm:px-4 sm:py-1 rounded-full text-xs sm:text-sm font-heading uppercase text-white bg-gradient-to-r",
            roleData.gradient
          )}>
            {roleData.type}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4">
            <div className="text-gray-400 text-xs font-heading uppercase mb-1">Access Level</div>
            <div className="text-white text-sm sm:text-base font-heading uppercase">{roleData.accessLevel}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4">
            <div className="text-gray-400 text-xs font-heading uppercase mb-1">Permissions</div>
            <div className="text-white text-sm sm:text-base font-heading uppercase">{roleData.permissions}</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
          {tGen(`${role}.description`)}
        </p>

        {/* Key Abilities */}
        <div>
          <h3 className="text-white mb-3 uppercase text-sm font-heading uppercase">Key Abilities</h3>
          <ul className="space-y-2">
            {roleData.abilities.map((ability, index) => (
              <li 
                key={index}
                className="flex items-start text-gray-300 dark:text-gray-400 text-sm hover:translate-x-1 transition-transform min-w-0"
              >
                <span className="text-green-400 mr-2 mt-0.5 flex-shrink-0">▸</span>
                <span className="flex-1 min-w-0 break-words">{ability}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

interface RoleBadgeProps {
  role: RoleKey
  onClick: () => void
}

function RoleBadge({ role, onClick }: RoleBadgeProps) {
  const { tGen } = useGenerationalMarketing()
  const roleData = ROLES[role]
  const Icon = roleData.icon

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-heading uppercase text-white",
        "bg-gradient-to-r transition-all duration-300 hover:scale-105 hover:shadow-lg",
        "whitespace-nowrap flex-shrink-0",
        roleData.gradient
      )}
    >
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
      <span className="truncate">{tGen(`${role}.name`)}</span>
    </button>
  )
}

export function DetailedPricingSection(): JSX.Element {
  const { tGen } = useGenerationalMarketing()
    const [isAnnual, setIsAnnual] = useState(false)
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null)

  return (
    <>
      <section className={cn("py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950", padding.sectionX)}>
        <div className={cn("mx-auto", container['6xl'])}>
          {/* Header */}
          <div className="text-center mb-12 animate-in fade-in-50 duration-800">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white mb-6 font-title uppercase">
              ATLVS Pricing
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Choose the perfect plan for your production needs
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 lg:gap-4 mb-8 md:mb-12 lg:mb-16 animate-in fade-in duration-1000 delay-300">
            <span className={cn("text-lg font-heading uppercase", !isAnnual ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400")}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              style={{ backgroundColor: isAnnual ? '#7c3aed' : '#d1d5db' }}
              aria-label="Toggle billing period"
            >
              <span
                className="absolute top-1 left-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-lg transition-transform duration-300"
                style={{ transform: isAnnual ? 'translateX(32px)' : 'translateX(0)' }}
              />
            </button>
            <span className={cn("text-lg font-heading uppercase", isAnnual ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400")}>
              Annual
            </span>
            <span 
              className={cn(
                "ml-2 px-3 py-1 bg-green-100 text-green-800 text-sm font-heading uppercase rounded-full transition-opacity duration-300",
                isAnnual ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              aria-hidden={!isAnnual}
            >
              Save 2 Months
            </span>
          </div>

          {/* Pricing Grid */}
          <div className={cn(cards.grid1to4, "mb-8 md:mb-12 lg:mb-16 animate-in fade-in-50 duration-1000 delay-500")}>
            {/* Community */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300", cards.marketing, cards.paddingMd)}>
              <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-white mb-2 font-heading uppercase">Community</h3>
              <div className="mb-4">
                <span className="text-4xl sm:text-5xl font-title uppercase text-gray-900 dark:text-white">Free</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Forever</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Perfect for getting started</p>

              <div className="space-y-3 md:space-y-4 lg:space-y-6 mb-4 md:mb-6 lg:mb-8">
                <div>
                  <h4 className="text-xs uppercase text-gray-500 dark:text-gray-500 mb-3 font-heading uppercase">COLLABORATION</h4>
                  <ul className={spacing.listTight}>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Community Access</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Industry Resources</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-gray-500 dark:text-gray-500 mb-3 font-heading uppercase">FUNDAMENTALS</h4>
                  <ul className={spacing.listTight}>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Basic Project Management</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Single User Seat</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Community Support Forum</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-gray-500 dark:text-gray-500 mb-3 font-heading uppercase">AVAILABLE ROLES</h4>
                  <div className="flex flex-wrap gap-2">
                    <RoleBadge role="raider" onClick={() => setSelectedRole("raider")} />
                  </div>
                </div>
              </div>

              <Link href="/signup">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Pro */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300", cards.marketing, cards.paddingMd)}>
              <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-white mb-2 font-heading uppercase">Pro</h3>
              <div className="mb-4">
                <span className="text-4xl sm:text-5xl font-title uppercase text-gray-900 dark:text-white">
                  ${isAnnual ? '10' : '12'}
                </span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
                {isAnnual && <p className="text-sm text-gray-500 dark:text-gray-500">$120 billed annually</p>}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Independent Contractor</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">Single Seat</p>

              <div className="space-y-3 md:space-y-4 lg:space-y-6 mb-4 md:mb-6 lg:mb-8">
                <p className="text-sm font-heading uppercase text-gray-700 dark:text-gray-300">Everything in Community, plus:</p>

                <div>
                  <h4 className="text-xs uppercase text-gray-500 dark:text-gray-500 mb-3 font-heading uppercase">EFFICIENCY</h4>
                  <ul className={spacing.listTight}>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Standardized Datasets</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Universal Workflows</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Transparent Reporting</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-gray-500 dark:text-gray-500 mb-3 font-heading uppercase">PRO FEATURES</h4>
                  <ul className={spacing.listTight}>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Advanced Project Tools</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Priority Email Support</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Enhanced Analytics Dashboard</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-gray-500 dark:text-gray-500 mb-3 font-heading uppercase">AVAILABLE ROLES</h4>
                  <div className="flex flex-wrap gap-2">
                    <RoleBadge role="deviator" onClick={() => setSelectedRole("deviator")} />
                    <RoleBadge role="raider" onClick={() => setSelectedRole("raider")} />
                  </div>
                </div>
              </div>

              <Link href="/signup?plan=pro">
                <Button variant="default" className="w-full">Choose Pro</Button>
              </Link>
            </div>

            {/* Team - Featured */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-4 border-purple-600 hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 relative lg:scale-105", cards.marketing, cards.paddingMd)}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 sm:relative sm:top-0 sm:left-0 sm:translate-x-0 sm:mb-4 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-heading uppercase w-max mx-auto">
                MOST POPULAR
              </div>
              <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-white mb-2 mt-8 sm:mt-0 font-heading uppercase">Team</h3>
              <div className="mb-4">
                <span className="text-4xl sm:text-5xl font-title uppercase text-gray-900 dark:text-white">
                  ${isAnnual ? '100' : '120'}
                </span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
                {isAnnual && <p className="text-sm text-gray-500 dark:text-gray-500">$1,200 billed annually</p>}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Vendor</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">2-10 Seats</p>

              <div className="space-y-3 md:space-y-4 lg:space-y-6 mb-4 md:mb-6 lg:mb-8">
                <p className="text-sm font-heading uppercase text-gray-700 dark:text-gray-300">Everything in Pro, plus:</p>

                <div>
                  <h4 className="text-xs uppercase text-gray-500 dark:text-gray-500 mb-3 font-heading uppercase">TEAM MANAGEMENT</h4>
                  <ul className={spacing.listTight}>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Tiered Access Controls</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Global Templates</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Team Collaboration Hub</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-gray-500 dark:text-gray-500 mb-3 font-heading uppercase">INTEGRATIONS</h4>
                  <ul className={spacing.listTight}>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Unlimited API Integrations</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Open Source Automations</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Webhook Support</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Premium Support (24hr response)</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-gray-500 dark:text-gray-500 mb-3 font-heading uppercase">AVAILABLE ROLES</h4>
                  <div className="flex flex-wrap gap-2">
                    <RoleBadge role="gladiator" onClick={() => setSelectedRole("gladiator")} />
                    <RoleBadge role="navigator" onClick={() => setSelectedRole("navigator")} />
                    <RoleBadge role="deviator" onClick={() => setSelectedRole("deviator")} />
                    <RoleBadge role="raider" onClick={() => setSelectedRole("raider")} />
                    <RoleBadge role="visitor" onClick={() => setSelectedRole("visitor")} />
                    <RoleBadge role="vendor" onClick={() => setSelectedRole("vendor")} />
                    <RoleBadge role="ambassador" onClick={() => setSelectedRole("ambassador")} />
                  </div>
                </div>
              </div>

              <Link href="/signup?plan=team">
                <Button variant="default" className="w-full bg-purple-600 hover:bg-purple-700">Choose Team</Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300", cards.marketing, cards.paddingMd)}>
              <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-white mb-2 font-heading uppercase">Enterprise</h3>
              <div className="mb-4">
                <span className="text-4xl sm:text-5xl font-title uppercase text-gray-900 dark:text-white">
                  ${isAnnual ? '1,000' : '1,200'}
                </span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
                {isAnnual && <p className="text-sm text-gray-500 dark:text-gray-500">$12,000 billed annually</p>}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Producer</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">2-20 Seats</p>

              <div className="space-y-3 md:space-y-4 lg:space-y-6 mb-4 md:mb-6 lg:mb-8">
                <p className="text-sm font-heading uppercase text-gray-700 dark:text-gray-300">Everything in Team, plus:</p>

                <div>
                  <h4 className="text-xs uppercase text-gray-500 dark:text-gray-500 mb-3 font-heading uppercase">ENTERPRISE CONTROL</h4>
                  <ul className={spacing.listTight}>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Advanced Permissions</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Custom Data Fields</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Personalized Views</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>SSO & SAML Integration</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-gray-500 dark:text-gray-500 mb-3 font-heading uppercase">AI & INTELLIGENCE</h4>
                  <ul className={spacing.listTight}>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>AI Agents & Insights</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Smart Recommendations</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Predictive Resource Planning</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Dedicated Account Manager</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>24/7 Priority Support</span>
                    </li>
                    <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Custom Onboarding & Training</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-gray-500 dark:text-gray-500 mb-3 font-heading uppercase">AVAILABLE ROLES</h4>
                  <div className="flex flex-wrap gap-2">
                    <RoleBadge role="phantom" onClick={() => setSelectedRole("phantom")} />
                    <RoleBadge role="aviator" onClick={() => setSelectedRole("aviator")} />
                    <RoleBadge role="gladiator" onClick={() => setSelectedRole("gladiator")} />
                    <RoleBadge role="navigator" onClick={() => setSelectedRole("navigator")} />
                    <RoleBadge role="deviator" onClick={() => setSelectedRole("deviator")} />
                    <RoleBadge role="raider" onClick={() => setSelectedRole("raider")} />
                    <RoleBadge role="partner" onClick={() => setSelectedRole("partner")} />
                    <RoleBadge role="visitor" onClick={() => setSelectedRole("visitor")} />
                    <RoleBadge role="vendor" onClick={() => setSelectedRole("vendor")} />
                    <RoleBadge role="ambassador" onClick={() => setSelectedRole("ambassador")} />
                  </div>
                </div>
              </div>

              <Link href="/demo">
                <Button variant="default" className="w-full">Choose Enterprise</Button>
              </Link>
            </div>
          </div>

          {/* Additional Seats */}
          <div className="text-center text-gray-600 dark:text-gray-400 animate-in fade-in duration-1200 delay-800">
            <p className="text-lg">
              <span className="font-heading uppercase">Need More Seats?</span> Additional seats available for{' '}
              <span className="font-heading uppercase text-gray-900 dark:text-white">
                ${isAnnual ? '10' : '12'}/month
              </span>
              {isAnnual && ' ($120 when billed annually)'}
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={cn("py-20 bg-gray-50 dark:bg-gray-900", padding.sectionX)}>
        <div className={cn("mx-auto", container['6xl'])}>
          <div className="text-center mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-4 font-heading uppercase">
              Trusted by Captains at Every Scale
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              From small crews to enterprise fleets
            </p>
          </div>
          
          <div className={cn(cards.grid1to3)}>
            {/* Long John Silver - Pro/Team tier */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", cards.marketing, cards.paddingSm)}>
              <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">{tGen('testimonials.longJohnSilverQuote')}</p>
              <div>
                <p className="text-gray-900 dark:text-white font-semibold">{tGen('testimonials.longJohnSilverAuthor')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('testimonials.longJohnSilverRole')}</p>
              </div>
            </div>
            
            {/* Horatio Hornblower - Team tier */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", cards.marketing, cards.paddingSm)}>
              <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">{tGen('testimonials.horatioHornblowerQuote')}</p>
              <div>
                <p className="text-gray-900 dark:text-white font-semibold">{tGen('testimonials.horatioHornblowerAuthor')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('testimonials.horatioHornblowerRole')}</p>
              </div>
            </div>
            
            {/* Captain Nemo - Enterprise tier */}
            <div className={cn("bg-white dark:bg-gray-800 rounded-xl", cards.marketing, cards.paddingSm)}>
              <Quote className={cn("mb-4 text-blue-600", height.iconLg)} aria-hidden="true" />
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">{tGen('testimonials.captainNemoQuote')}</p>
              <div>
                <p className="text-gray-900 dark:text-white font-semibold">{tGen('testimonials.captainNemoAuthor')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tGen('testimonials.captainNemoRole')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Modal */}
      {selectedRole && (
        <RoleModal role={selectedRole} onClose={() => setSelectedRole(null)} />
      )}
    </>
  )
}
