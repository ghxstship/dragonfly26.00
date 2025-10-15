// =============================================
// PROFILE MODULE - MOCK DATA
// Comprehensive mock data for user profile module
// =============================================

export const mockBasicInfo = {
  id: 'user-123',
  firstName: 'John',
  lastName: 'Doe',
  displayName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  dateOfBirth: '1990-05-15',
  gender: 'Male',
  pronouns: 'he/him',
  location: 'Los Angeles, CA',
  timezone: 'America/Los_Angeles',
  language: 'English',
  avatar: '/avatars/john-doe.jpg',
  bio: 'Production manager with 10+ years of experience in live events, concerts, and festivals. Specialized in large-scale event production and technical coordination.',
  website: 'https://johndoe.com',
  linkedIn: 'https://linkedin.com/in/johndoe',
  twitter: 'https://twitter.com/johndoe',
  instagram: 'https://instagram.com/johndoe',
}

export const mockProfessionalInfo = {
  currentTitle: 'Senior Production Manager',
  currentCompany: 'Live Nation',
  yearsOfExperience: 12,
  hourlyRate: 125.00,
  dailyRate: 1000.00,
  availability: 'Available',
  preferredRoles: ['Production Manager', 'Technical Director', 'Event Coordinator'],
  skills: [
    'Event Production',
    'Technical Direction',
    'Budget Management',
    'Vendor Coordination',
    'Risk Management',
    'Team Leadership',
    'Audio Systems',
    'Lighting Design',
    'Stage Management',
    'Logistics',
  ],
  industries: ['Live Events', 'Concerts', 'Festivals', 'Corporate Events', 'Theater'],
  languages: [
    { language: 'English', proficiency: 'Native' },
    { language: 'Spanish', proficiency: 'Professional' },
    { language: 'French', proficiency: 'Basic' },
  ],
}

export const mockWorkExperience = [
  {
    id: '1',
    title: 'Senior Production Manager',
    company: 'Live Nation',
    location: 'Los Angeles, CA',
    startDate: '2020-03-01',
    endDate: null,
    isCurrent: true,
    description: 'Lead production manager for major touring artists and large-scale festivals. Manage teams of 50+ crew members, coordinate with venues, oversee technical aspects, and ensure successful execution of events with budgets up to $5M.',
    achievements: [
      'Successfully managed 120+ large-scale events',
      'Reduced production costs by 15% through vendor optimization',
      'Implemented new safety protocols adopted company-wide',
    ],
  },
  {
    id: '2',
    title: 'Production Manager',
    company: 'AEG Presents',
    location: 'Los Angeles, CA',
    startDate: '2017-06-01',
    endDate: '2020-02-28',
    isCurrent: false,
    description: 'Managed production for mid-size concerts and special events. Coordinated technical teams, managed vendor relationships, and oversaw load-in/load-out operations.',
    achievements: [
      'Managed 80+ successful events',
      'Improved load-in efficiency by 25%',
      'Received Excellence in Production award 2019',
    ],
  },
  {
    id: '3',
    title: 'Assistant Production Manager',
    company: 'Goldenvoice',
    location: 'Los Angeles, CA',
    startDate: '2014-01-15',
    endDate: '2017-05-31',
    isCurrent: false,
    description: 'Assisted senior production managers with festival and concert production. Coordinated logistics, managed vendor communications, and supervised load-in operations.',
    achievements: [
      'Assisted with Coachella production for 3 years',
      'Coordinated 150+ vendor relationships',
    ],
  },
]

export const mockEducation = [
  {
    id: '1',
    institution: 'University of Southern California',
    degree: 'Bachelor of Arts',
    field: 'Theatre Arts - Technical Production',
    location: 'Los Angeles, CA',
    startDate: '2008-09-01',
    endDate: '2012-05-31',
    gpa: '3.7',
    achievements: [
      'Dean\'s List all semesters',
      'President of Technical Theatre Society',
      'Lead technician for 20+ theatrical productions',
    ],
  },
  {
    id: '2',
    institution: 'ETCP Certification Program',
    degree: 'Certification',
    field: 'Rigging',
    location: 'Online',
    startDate: '2016-01-01',
    endDate: '2016-03-31',
    achievements: [
      'ETCP Certified Theatre Rigger',
    ],
  },
]

export const mockCertifications = [
  {
    id: '1',
    name: 'ETCP Certified Theatre Rigger',
    issuingOrganization: 'ETCP',
    issueDate: '2016-04-15',
    expiryDate: '2026-04-15',
    credentialId: 'ETCP-2016-12345',
    credentialUrl: 'https://etcp.esta.org/verify/12345',
    status: 'active',
    category: 'Technical',
  },
  {
    id: '2',
    name: 'OSHA 30-Hour Construction Safety',
    issuingOrganization: 'OSHA',
    issueDate: '2019-08-20',
    expiryDate: null,
    credentialId: 'OSHA-30-67890',
    status: 'active',
    category: 'Safety',
  },
  {
    id: '3',
    name: 'CPR/AED/First Aid Certified',
    issuingOrganization: 'American Red Cross',
    issueDate: '2024-01-10',
    expiryDate: '2026-01-10',
    credentialId: 'ARC-2024-54321',
    status: 'active',
    category: 'Health & Safety',
  },
  {
    id: '4',
    name: 'Project Management Professional (PMP)',
    issuingOrganization: 'PMI',
    issueDate: '2021-06-01',
    expiryDate: '2024-06-01',
    credentialId: 'PMI-2021-98765',
    status: 'expired',
    category: 'Management',
  },
]

export const mockTravel = {
  passportNumber: 'US123456789',
  passportIssueDate: '2020-03-15',
  passportExpiryDate: '2030-03-14',
  passportCountry: 'United States',
  tsaPrecheck: {
    hasPrecheck: true,
    knownTravelerNumber: 'TSA12345678',
    expiryDate: '2027-01-15',
  },
  globalEntry: {
    hasGlobalEntry: true,
    passId: 'GE98765432',
    expiryDate: '2028-05-20',
  },
  travelPreferences: {
    seatPreference: 'Aisle',
    mealPreference: 'No preference',
    hotelChain: 'Marriott',
    loyaltyPrograms: [
      { airline: 'Delta', number: 'DL123456789' },
      { airline: 'United', number: 'UA987654321' },
      { hotel: 'Marriott Bonvoy', number: 'MB456789123' },
      { rental: 'Hertz Gold Plus', number: 'HZ789123456' },
    ],
  },
  visas: [
    {
      id: '1',
      country: 'United Kingdom',
      type: 'Work',
      issueDate: '2023-01-10',
      expiryDate: '2028-01-09',
      visaNumber: 'UK-WORK-123456',
    },
  ],
}

export const mockHealth = {
  bloodType: 'O+',
  allergies: [
    { allergen: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis' },
    { allergen: 'Peanuts', severity: 'Moderate', reaction: 'Hives' },
  ],
  medications: [
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', reason: 'Blood pressure' },
  ],
  medicalConditions: [
    { condition: 'Hypertension', diagnosedDate: '2018-05-15', notes: 'Well-controlled with medication' },
  ],
  dietaryRestrictions: [
    { restriction: 'Vegetarian', notes: 'Preference, not allergy' },
  ],
  healthInsurance: {
    provider: 'Blue Cross Blue Shield',
    policyNumber: 'BCBS123456789',
    groupNumber: 'GRP456789',
    effectiveDate: '2024-01-01',
    expiryDate: '2024-12-31',
  },
  primaryPhysician: {
    name: 'Dr. Sarah Johnson',
    phone: '+1 (555) 987-6543',
    address: '456 Medical Center Dr, Los Angeles, CA 90001',
  },
}

export const mockEmergencyContacts = [
  {
    id: '1',
    name: 'Jane Doe',
    relationship: 'Spouse',
    phone: '+1 (555) 234-5678',
    alternatePhone: '+1 (555) 345-6789',
    email: 'jane.doe@example.com',
    address: '789 Home St, Los Angeles, CA 90001',
    isPrimary: true,
  },
  {
    id: '2',
    name: 'Robert Doe',
    relationship: 'Father',
    phone: '+1 (555) 456-7890',
    alternatePhone: null,
    email: 'robert.doe@example.com',
    address: '321 Parents Ave, San Diego, CA 92101',
    isPrimary: false,
  },
  {
    id: '3',
    name: 'Maria Doe',
    relationship: 'Mother',
    phone: '+1 (555) 567-8901',
    alternatePhone: null,
    email: 'maria.doe@example.com',
    address: '321 Parents Ave, San Diego, CA 92101',
    isPrimary: false,
  },
]

export const mockPerformance = {
  overallRating: 4.7,
  totalReviews: 48,
  categories: {
    technical: 4.8,
    communication: 4.9,
    reliability: 4.6,
    problemSolving: 4.7,
    leadership: 4.5,
  },
  recentReviews: [
    {
      id: '1',
      projectName: 'Summer Music Festival 2024',
      reviewer: 'Sarah Chen',
      reviewerRole: 'Event Director',
      rating: 5,
      date: '2024-09-15',
      comment: 'John exceeded expectations. His attention to detail and problem-solving skills were instrumental in the festival\'s success.',
      categories: {
        technical: 5,
        communication: 5,
        reliability: 5,
        problemSolving: 5,
        leadership: 5,
      },
    },
    {
      id: '2',
      projectName: 'Corporate Awards Show',
      reviewer: 'Michael Torres',
      reviewerRole: 'Producer',
      rating: 4,
      date: '2024-08-20',
      comment: 'Great work overall. John managed the technical crew effectively and kept everything on schedule.',
      categories: {
        technical: 4,
        communication: 5,
        reliability: 4,
        problemSolving: 4,
        leadership: 4,
      },
    },
  ],
  achievements: [
    { id: '1', title: 'Perfect Safety Record', description: '500+ events without incident', date: '2024-01-01' },
    { id: '2', title: 'Top Performer 2023', description: 'Highest-rated production manager', date: '2023-12-31' },
    { id: '3', title: 'Innovation Award', description: 'New load-in process adopted company-wide', date: '2022-06-15' },
  ],
}

export const mockEndorsements = [
  {
    id: '1',
    skill: 'Event Production',
    endorsers: ['Sarah Chen', 'Michael Torres', 'Jennifer Smith', 'David Lee', 'Amanda White'],
    count: 28,
  },
  {
    id: '2',
    skill: 'Technical Direction',
    endorsers: ['Michael Torres', 'Robert Johnson', 'Lisa Brown'],
    count: 22,
  },
  {
    id: '3',
    skill: 'Team Leadership',
    endorsers: ['Sarah Chen', 'Jennifer Smith', 'Amanda White'],
    count: 19,
  },
  {
    id: '4',
    skill: 'Budget Management',
    endorsers: ['David Lee', 'Robert Johnson'],
    count: 15,
  },
]

export const mockTags = [
  { id: '1', tag: 'Production Manager', category: 'Role', isVerified: true },
  { id: '2', tag: 'Live Events', category: 'Industry', isVerified: true },
  { id: '3', tag: 'Large Scale', category: 'Project Type', isVerified: true },
  { id: '4', tag: 'Festivals', category: 'Event Type', isVerified: true },
  { id: '5', tag: 'Concerts', category: 'Event Type', isVerified: true },
  { id: '6', tag: 'Technical', category: 'Specialty', isVerified: true },
  { id: '7', tag: 'West Coast', category: 'Location', isVerified: false },
  { id: '8', tag: 'Rigging', category: 'Skill', isVerified: true },
  { id: '9', tag: 'Audio', category: 'Skill', isVerified: true },
  { id: '10', tag: 'Lighting', category: 'Skill', isVerified: true },
]

export const mockProjectHistory = [
  {
    id: '1',
    projectName: 'Summer Music Festival 2024',
    client: 'Festival Productions Inc',
    role: 'Production Manager',
    startDate: '2024-06-01',
    endDate: '2024-09-30',
    location: 'Los Angeles, CA',
    budget: 3500000,
    teamSize: 75,
    description: 'Managed production for 3-day music festival with 50,000 attendees',
    achievements: ['Zero safety incidents', 'Under budget by 5%', 'Perfect weather contingency execution'],
  },
  {
    id: '2',
    projectName: 'World Tour 2024',
    client: 'Major Artist Management',
    role: 'Tour Production Manager',
    startDate: '2024-01-15',
    endDate: '2024-05-30',
    location: 'North America (25 cities)',
    budget: 8000000,
    teamSize: 120,
    description: 'Managed technical production for 25-city arena tour',
    achievements: ['All shows on schedule', 'Excellent artist satisfaction', 'Vendor partnership optimization'],
  },
  {
    id: '3',
    projectName: 'Corporate Summit 2023',
    client: 'Tech Company',
    role: 'Production Manager',
    startDate: '2023-10-01',
    endDate: '2023-10-15',
    location: 'San Francisco, CA',
    budget: 1200000,
    teamSize: 40,
    description: 'Managed production for 5-day corporate event with 5,000 attendees',
    achievements: ['Flawless execution', 'Client repeat booking', 'Live streaming success'],
  },
]

export const mockSocialLinks = {
  linkedin: 'https://linkedin.com/in/johndoe',
  twitter: 'https://twitter.com/johndoe',
  instagram: 'https://instagram.com/johndoe',
  facebook: 'https://facebook.com/johndoe',
  tiktok: '',
  youtube: 'https://youtube.com/@johndoe',
  website: 'https://johndoe.com',
  portfolio: 'https://portfolio.johndoe.com',
  blog: 'https://blog.johndoe.com',
  github: '',
}

// Helper function to simulate async data loading
export const simulateDelay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
