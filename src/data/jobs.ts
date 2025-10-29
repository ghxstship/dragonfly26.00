export interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  salary?: string
  description: string
  responsibilities: string[]
  qualifications: string[]
  niceToHave: string[]
  benefits: string[]
}

export const jobs: Job[] = [
  {
    id: "captain-community",
    title: "Captain, Community",
    department: "Community",
    location: "Hybrid - Tampa, FL",
    type: "Full-time",
    salary: "Competitive",
    description: "Lead community engagement and growth initiatives as a VP/C-Suite level executive. You'll be responsible for building and nurturing our user community, creating meaningful connections, and driving engagement across all touchpoints.",
    responsibilities: [
      "Develop and execute comprehensive community engagement strategy",
      "Build and scale community programs, events, and initiatives",
      "Lead community team and establish best practices",
      "Create feedback loops between community and product teams",
      "Measure and report on community health metrics",
      "Foster relationships with key community members and advocates",
      "Develop content strategy for community channels",
      "Represent ATLVS at industry events and conferences"
    ],
    qualifications: [
      "10+ years of experience in community management or related field",
      "5+ years in leadership roles (VP/Director level)",
      "Proven track record of building communities from scratch",
      "Experience in live events or entertainment industry",
      "Strong understanding of community platforms and tools",
      "Excellent communication and interpersonal skills",
      "Data-driven approach to community growth",
      "Bachelor's degree in Marketing, Communications, or related field"
    ],
    niceToHave: [
      "Experience with B2B SaaS communities",
      "Background in production or event management",
      "Public speaking and content creation experience",
      "MBA or advanced degree",
      "Experience with community analytics platforms"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible hybrid work arrangement",
      "Unlimited PTO",
      "Professional development budget",
      "Latest tech and equipment",
      "Team events and offsites"
    ]
  },
  {
    id: "captain-finance",
    title: "Captain, Finance",
    department: "Finance",
    location: "Hybrid - Tampa, FL",
    type: "Full-time",
    salary: "Competitive",
    description: "Lead financial strategy and operations as our VP/C-Suite level finance executive. You'll oversee all financial planning, analysis, and reporting while building a world-class finance organization.",
    responsibilities: [
      "Develop and execute financial strategy aligned with company goals",
      "Lead financial planning, budgeting, and forecasting processes",
      "Oversee accounting, FP&A, and financial reporting",
      "Build and manage finance team",
      "Ensure compliance with financial regulations and standards",
      "Partner with leadership on strategic initiatives",
      "Manage investor relations and board reporting",
      "Drive operational efficiency and cost optimization"
    ],
    qualifications: [
      "15+ years of progressive finance experience",
      "5+ years in VP/C-Suite finance roles",
      "CPA or CMA certification required",
      "Experience with SaaS business models and metrics",
      "Strong understanding of GAAP and financial regulations",
      "Proven track record of scaling finance operations",
      "Excellent analytical and strategic thinking skills",
      "Bachelor's degree in Finance, Accounting, or related field"
    ],
    niceToHave: [
      "MBA or advanced degree",
      "Experience with fundraising and M&A",
      "Background in high-growth startups",
      "Experience with ERP and financial systems",
      "Big 4 accounting firm experience"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible hybrid work arrangement",
      "Unlimited PTO",
      "Professional development budget",
      "Latest tech and equipment",
      "Team events and offsites"
    ]
  },
  {
    id: "captain-marketing",
    title: "Captain, Marketing",
    department: "Marketing",
    location: "Hybrid - Tampa, FL",
    type: "Full-time",
    salary: "Competitive",
    description: "Drive marketing strategy and brand growth as our VP/C-Suite level marketing executive. You'll lead all marketing initiatives, build our brand presence, and drive customer acquisition and retention.",
    responsibilities: [
      "Develop and execute comprehensive marketing strategy",
      "Lead brand positioning and messaging",
      "Build and manage marketing team across all functions",
      "Drive customer acquisition and growth marketing",
      "Oversee content, digital, and event marketing",
      "Manage marketing budget and ROI optimization",
      "Partner with sales on demand generation",
      "Establish marketing analytics and reporting"
    ],
    qualifications: [
      "12+ years of marketing experience",
      "5+ years in VP/Director level marketing roles",
      "Proven track record in B2B SaaS marketing",
      "Experience building and scaling marketing teams",
      "Strong understanding of digital marketing channels",
      "Data-driven approach to marketing strategy",
      "Excellent leadership and communication skills",
      "Bachelor's degree in Marketing, Business, or related field"
    ],
    niceToHave: [
      "MBA or advanced degree",
      "Experience in live events or entertainment industry",
      "Background in product marketing",
      "Experience with marketing automation platforms",
      "Public speaking and thought leadership experience"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible hybrid work arrangement",
      "Unlimited PTO",
      "Professional development budget",
      "Latest tech and equipment",
      "Team events and offsites"
    ]
  },
  {
    id: "captain-operations",
    title: "Captain, Operations",
    department: "Operations",
    location: "Hybrid - Tampa, FL",
    type: "Full-time",
    salary: "Competitive",
    description: "Oversee operational excellence and efficiency as our VP/C-Suite level operations executive. You'll manage day-to-day operations, optimize processes, and ensure the company runs smoothly at scale.",
    responsibilities: [
      "Develop and execute operational strategy",
      "Lead cross-functional operational initiatives",
      "Build and optimize business processes and systems",
      "Manage operations team and establish best practices",
      "Drive operational efficiency and cost optimization",
      "Oversee vendor and partner relationships",
      "Implement operational metrics and reporting",
      "Support rapid scaling and growth initiatives"
    ],
    qualifications: [
      "12+ years of operations experience",
      "5+ years in VP/Director level operations roles",
      "Proven track record of scaling operations",
      "Experience with SaaS or technology companies",
      "Strong process optimization and project management skills",
      "Excellent analytical and problem-solving abilities",
      "Experience building and leading teams",
      "Bachelor's degree in Business, Operations, or related field"
    ],
    niceToHave: [
      "MBA or advanced degree",
      "Six Sigma or Lean certification",
      "Experience with operations software and tools",
      "Background in consulting or process improvement",
      "Experience in high-growth startups"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible hybrid work arrangement",
      "Unlimited PTO",
      "Professional development budget",
      "Latest tech and equipment",
      "Team events and offsites"
    ]
  },
  {
    id: "captain-production",
    title: "Captain, Production",
    department: "Production",
    location: "Hybrid - Tampa, FL",
    type: "Full-time",
    salary: "Competitive",
    description: "Lead product development and delivery as our VP/C-Suite level production executive. You'll be responsible for production strategy, execution, and ensuring we deliver exceptional value to our customers.",
    responsibilities: [
      "Define and execute product strategy and roadmap",
      "Lead product development and delivery teams",
      "Drive product vision aligned with market needs",
      "Establish product development processes and best practices",
      "Partner with engineering, design, and stakeholders",
      "Conduct market research and competitive analysis",
      "Define and track product success metrics",
      "Manage product lifecycle from concept to launch"
    ],
    qualifications: [
      "12+ years of product management experience",
      "5+ years in VP/Director level product roles",
      "Proven track record of successful product launches",
      "Experience with B2B SaaS products",
      "Strong understanding of agile methodologies",
      "Excellent strategic thinking and execution skills",
      "Experience building and leading product teams",
      "Bachelor's degree in Computer Science, Business, or related field"
    ],
    niceToHave: [
      "MBA or advanced degree",
      "Technical background or engineering degree",
      "Experience in live events or entertainment industry",
      "Background in UX/UI design",
      "Experience with product analytics platforms"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible hybrid work arrangement",
      "Unlimited PTO",
      "Professional development budget",
      "Latest tech and equipment",
      "Team events and offsites"
    ]
  },
  {
    id: "captain-revenue",
    title: "Captain, Revenue",
    department: "Revenue",
    location: "Hybrid - Tampa, FL",
    type: "Full-time",
    salary: "Competitive",
    description: "Drive revenue growth and sales strategy as our VP/C-Suite level revenue executive. You'll oversee all revenue-generating activities, build high-performing sales teams, and drive sustainable growth.",
    responsibilities: [
      "Develop and execute revenue strategy",
      "Build and lead sales organization",
      "Drive new customer acquisition and expansion",
      "Establish sales processes and methodologies",
      "Manage sales pipeline and forecasting",
      "Partner with marketing on demand generation",
      "Develop pricing and packaging strategy",
      "Build customer success and account management functions"
    ],
    qualifications: [
      "15+ years of sales and revenue experience",
      "5+ years in VP/CRO level roles",
      "Proven track record of exceeding revenue targets",
      "Experience selling B2B SaaS solutions",
      "Strong understanding of sales methodologies",
      "Experience building and scaling sales teams",
      "Excellent leadership and communication skills",
      "Bachelor's degree in Business or related field"
    ],
    niceToHave: [
      "MBA or advanced degree",
      "Experience in live events or entertainment industry",
      "Background in enterprise sales",
      "Experience with sales enablement tools",
      "Track record of successful fundraising"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible hybrid work arrangement",
      "Unlimited PTO",
      "Professional development budget",
      "Latest tech and equipment",
      "Team events and offsites"
    ]
  },
  {
    id: "captain-technology",
    title: "Captain, Technology",
    department: "Technology",
    location: "Hybrid - Tampa, FL",
    type: "Full-time",
    salary: "Competitive",
    description: "Lead technology vision and architecture as our VP/C-Suite level technology executive. You'll be responsible for technical strategy, innovation, and building a world-class engineering organization.",
    responsibilities: [
      "Define and execute technology strategy and vision",
      "Lead engineering organization and technical teams",
      "Drive technical architecture and infrastructure decisions",
      "Establish engineering best practices and standards",
      "Oversee product development and delivery",
      "Manage technical debt and system scalability",
      "Build and mentor engineering talent",
      "Partner with product and business teams on technical initiatives"
    ],
    qualifications: [
      "15+ years of software engineering experience",
      "5+ years in VP/CTO level roles",
      "Proven track record of scaling engineering teams",
      "Deep expertise in modern web technologies",
      "Experience with cloud infrastructure (AWS/GCP/Azure)",
      "Strong understanding of software architecture patterns",
      "Excellent leadership and communication skills",
      "Bachelor's degree in Computer Science or related field"
    ],
    niceToHave: [
      "Master's degree or PhD in Computer Science",
      "Experience with Next.js, React, and TypeScript",
      "Background in real-time systems and databases",
      "Experience in high-growth startups",
      "Open source contributions or technical thought leadership"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible hybrid work arrangement",
      "Unlimited PTO",
      "Professional development budget",
      "Latest tech and equipment",
      "Team events and offsites"
    ]
  },
  {
    id: "account-manager",
    title: "Account Manager",
    department: "Sales",
    location: "Hybrid - Tampa, FL",
    type: "Full-time",
    salary: "Competitive",
    description: "Manage and grow relationships with existing clients, ensuring their success with ATLVS. You'll serve as the primary point of contact for accounts, driving retention, expansion, and customer satisfaction.",
    responsibilities: [
      "Manage portfolio of client accounts and relationships",
      "Drive account retention and expansion revenue",
      "Conduct regular business reviews with clients",
      "Identify upsell and cross-sell opportunities",
      "Coordinate with internal teams to ensure client success",
      "Resolve client issues and escalations promptly",
      "Track account health metrics and engagement",
      "Develop account growth strategies and plans"
    ],
    qualifications: [
      "3+ years of account management or customer success experience",
      "Experience with B2B SaaS or technology products",
      "Strong relationship building and communication skills",
      "Proven track record of driving account growth",
      "Ability to manage multiple accounts simultaneously",
      "Experience with CRM systems (Salesforce, HubSpot, etc.)",
      "Problem-solving and conflict resolution skills",
      "Bachelor's degree in Business or related field"
    ],
    niceToHave: [
      "Experience in live events or entertainment industry",
      "Background in project management",
      "Technical aptitude and product knowledge",
      "Experience with account-based marketing",
      "Familiarity with production workflows"
    ],
    benefits: [
      "Competitive salary and commission structure",
      "Comprehensive health, dental, and vision insurance",
      "Flexible hybrid work arrangement",
      "Unlimited PTO",
      "Professional development budget",
      "Latest tech and equipment",
      "Team events and offsites"
    ]
  },
  {
    id: "community-manager",
    title: "Community Manager",
    department: "Community",
    location: "Hybrid - Tampa, FL",
    type: "Full-time",
    salary: "Competitive",
    description: "Build and nurture our user community, creating engaging experiences and fostering meaningful connections. You'll manage community platforms, organize events, and serve as the voice of our users.",
    responsibilities: [
      "Manage and moderate community platforms and channels",
      "Create and execute community engagement programs",
      "Organize virtual and in-person community events",
      "Respond to community questions and feedback",
      "Create community content and resources",
      "Identify and empower community advocates",
      "Track community metrics and engagement",
      "Collaborate with product and marketing teams"
    ],
    qualifications: [
      "3+ years of community management experience",
      "Experience building and growing online communities",
      "Excellent written and verbal communication skills",
      "Strong social media and content creation skills",
      "Ability to handle sensitive situations diplomatically",
      "Experience with community platforms (Discord, Slack, etc.)",
      "Data-driven approach to community engagement",
      "Bachelor's degree in Communications, Marketing, or related field"
    ],
    niceToHave: [
      "Experience in live events or entertainment industry",
      "Background in customer support or success",
      "Event planning and coordination experience",
      "Graphic design or video editing skills",
      "Experience with community analytics tools"
    ],
    benefits: [
      "Competitive salary",
      "Comprehensive health, dental, and vision insurance",
      "Flexible hybrid work arrangement",
      "Unlimited PTO",
      "Professional development budget",
      "Latest tech and equipment",
      "Team events and offsites"
    ]
  },
  {
    id: "implementation-specialist",
    title: "Implementation Specialist",
    department: "Customer Success",
    location: "Hybrid - Tampa, FL",
    type: "Full-time",
    salary: "Competitive",
    description: "Guide new customers through successful onboarding and implementation of ATLVS. You'll configure systems, train users, and ensure smooth adoption of the platform.",
    responsibilities: [
      "Lead customer onboarding and implementation projects",
      "Configure ATLVS platform to meet client requirements",
      "Conduct training sessions for new users",
      "Create implementation plans and timelines",
      "Coordinate with internal teams on customer needs",
      "Document best practices and implementation guides",
      "Troubleshoot technical issues during onboarding",
      "Ensure successful handoff to account management"
    ],
    qualifications: [
      "3+ years of implementation or onboarding experience",
      "Experience with B2B SaaS platforms",
      "Strong technical aptitude and problem-solving skills",
      "Excellent project management abilities",
      "Experience training users on software platforms",
      "Strong communication and presentation skills",
      "Ability to manage multiple implementations simultaneously",
      "Bachelor's degree in Business, IT, or related field"
    ],
    niceToHave: [
      "Experience in live events or entertainment industry",
      "Background in production or project management",
      "Technical certifications or training credentials",
      "Experience with data migration",
      "Familiarity with production workflows"
    ],
    benefits: [
      "Competitive salary",
      "Comprehensive health, dental, and vision insurance",
      "Flexible hybrid work arrangement",
      "Unlimited PTO",
      "Professional development budget",
      "Latest tech and equipment",
      "Team events and offsites"
    ]
  },
  {
    id: "product-manager",
    title: "Product Manager",
    department: "Product",
    location: "Hybrid - Tampa, FL",
    type: "Full-time",
    salary: "Competitive",
    description: "Drive product strategy and execution for key features and initiatives. You'll work with cross-functional teams to deliver exceptional value to our customers.",
    responsibilities: [
      "Define and prioritize product roadmap and features",
      "Conduct user research and gather customer feedback",
      "Write detailed product requirements and specifications",
      "Collaborate with engineering and design teams",
      "Analyze product metrics and user behavior",
      "Manage product launches and releases",
      "Communicate product vision to stakeholders",
      "Balance customer needs with business objectives"
    ],
    qualifications: [
      "5+ years of product management experience",
      "Experience with B2B SaaS products",
      "Strong analytical and problem-solving skills",
      "Excellent communication and collaboration abilities",
      "Experience with agile development methodologies",
      "Data-driven approach to product decisions",
      "Understanding of UX/UI principles",
      "Bachelor's degree in Computer Science, Business, or related field"
    ],
    niceToHave: [
      "Experience in live events or entertainment industry",
      "Technical background or engineering degree",
      "MBA or advanced degree",
      "Experience with product analytics tools",
      "Background in production workflows"
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible hybrid work arrangement",
      "Unlimited PTO",
      "Professional development budget",
      "Latest tech and equipment",
      "Team events and offsites"
    ]
  },
  {
    id: "project-manager",
    title: "Project Manager",
    department: "Operations",
    location: "Hybrid - Tampa, FL",
    type: "Full-time",
    salary: "Competitive",
    description: "Lead cross-functional projects and initiatives, ensuring successful delivery on time and within budget. You'll coordinate teams, manage resources, and drive project execution.",
    responsibilities: [
      "Plan and execute cross-functional projects",
      "Define project scope, goals, and deliverables",
      "Create and manage project timelines and budgets",
      "Coordinate resources across multiple teams",
      "Track project progress and report to stakeholders",
      "Identify and mitigate project risks",
      "Facilitate meetings and communication",
      "Ensure projects meet quality standards"
    ],
    qualifications: [
      "5+ years of project management experience",
      "PMP or similar project management certification",
      "Experience managing complex, cross-functional projects",
      "Strong organizational and time management skills",
      "Excellent communication and leadership abilities",
      "Proficiency with project management tools",
      "Experience with agile and waterfall methodologies",
      "Bachelor's degree in Business, Management, or related field"
    ],
    niceToHave: [
      "Experience in live events or entertainment industry",
      "Background in production management",
      "Scrum Master or Agile certification",
      "Experience with remote team coordination",
      "Technical background or understanding"
    ],
    benefits: [
      "Competitive salary",
      "Comprehensive health, dental, and vision insurance",
      "Flexible hybrid work arrangement",
      "Unlimited PTO",
      "Professional development budget",
      "Latest tech and equipment",
      "Team events and offsites"
    ]
  },
  {
    id: "sales-manager",
    title: "Sales Manager",
    department: "Sales",
    location: "Hybrid - Tampa, FL",
    type: "Full-time",
    salary: "Competitive",
    description: "Lead and develop our sales team, driving revenue growth and building a high-performing sales organization. You'll coach team members, optimize processes, and ensure we exceed our targets.",
    responsibilities: [
      "Lead and mentor sales team members",
      "Develop and execute sales strategies and plans",
      "Set and track team sales targets and KPIs",
      "Conduct regular coaching and performance reviews",
      "Optimize sales processes and methodologies",
      "Collaborate with marketing on lead generation",
      "Manage sales pipeline and forecasting",
      "Recruit and onboard new sales talent"
    ],
    qualifications: [
      "7+ years of sales experience with 3+ years in management",
      "Proven track record of exceeding sales targets",
      "Experience with B2B SaaS or technology sales",
      "Strong leadership and team development skills",
      "Excellent communication and presentation abilities",
      "Experience with CRM systems and sales tools",
      "Data-driven approach to sales management",
      "Bachelor's degree in Business or related field"
    ],
    niceToHave: [
      "Experience in live events or entertainment industry",
      "Background in enterprise sales",
      "MBA or advanced degree",
      "Experience with sales enablement platforms",
      "Track record of building sales teams from scratch"
    ],
    benefits: [
      "Competitive salary and commission structure",
      "Comprehensive health, dental, and vision insurance",
      "Flexible hybrid work arrangement",
      "Unlimited PTO",
      "Professional development budget",
      "Latest tech and equipment",
      "Team events and offsites"
    ]
  },
  {
    id: "seasonal-intern",
    title: "Seasonal Intern",
    department: "Various",
    location: "Hybrid - Tampa, FL",
    type: "Internship",
    salary: "Hourly",
    description: "Join our team for a hands-on internship experience in live event production technology. You'll work on real projects, learn from experienced professionals, and contribute to building the future of production management.",
    responsibilities: [
      "Support team projects and initiatives",
      "Conduct research and analysis",
      "Assist with documentation and content creation",
      "Participate in team meetings and planning sessions",
      "Learn and apply industry best practices",
      "Complete assigned projects and deliverables",
      "Collaborate with cross-functional teams",
      "Present findings and recommendations"
    ],
    qualifications: [
      "Currently enrolled in or recently graduated from college",
      "Pursuing degree in relevant field (varies by department)",
      "Strong academic performance (3.0+ GPA preferred)",
      "Excellent communication and interpersonal skills",
      "Eagerness to learn and take initiative",
      "Ability to work independently and in teams",
      "Basic proficiency with Microsoft Office or Google Workspace",
      "Available for 10-12 weeks during summer or semester"
    ],
    niceToHave: [
      "Interest in live events or entertainment industry",
      "Previous internship or work experience",
      "Relevant coursework or projects",
      "Technical skills (varies by department)",
      "Involvement in campus organizations or activities"
    ],
    benefits: [
      "Competitive hourly compensation",
      "Hands-on experience with cutting-edge technology",
      "Mentorship from industry professionals",
      "Flexible hybrid work arrangement",
      "Networking opportunities",
      "Potential for full-time employment",
      "Team events and activities"
    ]
  },
  {
    id: "social-media-manager",
    title: "Social Media Manager",
    department: "Marketing",
    location: "Hybrid - Tampa, FL",
    type: "Full-time",
    salary: "Competitive",
    description: "Develop and execute our social media strategy, building brand awareness and engagement across all platforms. You'll create compelling content, manage communities, and drive social growth.",
    responsibilities: [
      "Develop and execute social media strategy",
      "Create and schedule engaging content across platforms",
      "Manage social media calendar and campaigns",
      "Monitor and respond to social media engagement",
      "Analyze social media metrics and performance",
      "Collaborate with marketing team on campaigns",
      "Stay current with social media trends and best practices",
      "Manage social media advertising and budgets"
    ],
    qualifications: [
      "3+ years of social media management experience",
      "Experience with B2B social media marketing",
      "Strong content creation and copywriting skills",
      "Proficiency with social media management tools",
      "Understanding of social media analytics and metrics",
      "Excellent visual design sense and attention to detail",
      "Experience with paid social advertising",
      "Bachelor's degree in Marketing, Communications, or related field"
    ],
    niceToHave: [
      "Experience in live events or entertainment industry",
      "Graphic design or video editing skills",
      "Experience with influencer marketing",
      "Background in community management",
      "Familiarity with social media advertising platforms"
    ],
    benefits: [
      "Competitive salary",
      "Comprehensive health, dental, and vision insurance",
      "Flexible hybrid work arrangement",
      "Unlimited PTO",
      "Professional development budget",
      "Latest tech and equipment",
      "Team events and offsites"
    ]
  }
]

export function getJobById(id: string): Job | undefined {
  return jobs.find(job => job.id === id)
}

export function getJobBySlug(slug: string): Job | undefined {
  return jobs.find(job => job.id === slug)
}
