// Form field configuration registry for all module tabs
// Defines comprehensive, enterprise-grade form fields for Create New dialogs

export type FieldType = 
  | "text" 
  | "textarea" 
  | "email"
  | "phone"
  | "url"
  | "number"
  | "currency"
  | "percentage"
  | "date"
  | "datetime"
  | "time"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "switch"
  | "file"
  | "color"
  | "rating"
  | "slider"
  | "tags"
  | "autocomplete"
  | "richtext"
  | "location"
  | "user"
  | "multiuser"

export interface FormFieldConfig {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  description?: string
  defaultValue?: any
  options?: Array<{ value: string; label: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
    minLength?: number
    maxLength?: number
  }
  conditional?: {
    field: string
    value: any
  }
}

export interface TabFormConfig {
  title: string
  description: string
  fields: FormFieldConfig[]
  submitLabel?: string
}

// Dashboard Module Forms
const dashboardForms: Record<string, TabFormConfig> = {
  'my-agenda': {
    title: 'Create Event',
    description: 'Add a new event to your agenda',
    fields: [
      { name: 'title', label: 'Event Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'event_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'meeting', label: 'Meeting' },
        { value: 'rehearsal', label: 'Rehearsal' },
        { value: 'performance', label: 'Performance' },
        { value: 'call', label: 'Call Time' },
        { value: 'travel', label: 'Travel' },
        { value: 'personal', label: 'Personal' }
      ]},
      { name: 'start_date', label: 'Start Date & Time', type: 'datetime', required: true },
      { name: 'end_date', label: 'End Date & Time', type: 'datetime', required: true },
      { name: 'location', label: 'Location', type: 'location' },
      { name: 'attendees', label: 'Attendees', type: 'multiuser' },
      { name: 'all_day', label: 'All Day Event', type: 'switch' },
      { name: 'reminder', label: 'Reminder', type: 'select', options: [
        { value: 'none', label: 'No Reminder' },
        { value: '15min', label: '15 minutes before' },
        { value: '1hour', label: '1 hour before' },
        { value: '1day', label: '1 day before' }
      ]},
      { name: 'priority', label: 'Priority', type: 'select', options: [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]},
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'my-jobs': {
    title: 'Create Job',
    description: 'Add a new job or contract',
    fields: [
      { name: 'title', label: 'Job Title', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'autocomplete', required: true },
      { name: 'role', label: 'Role/Position', type: 'text', required: true },
      { name: 'description', label: 'Scope of Work', type: 'richtext' },
      { name: 'contract_type', label: 'Contract Type', type: 'select', required: true, options: [
        { value: 'full_time', label: 'Full Time' },
        { value: 'part_time', label: 'Part Time' },
        { value: 'contract', label: 'Contract' },
        { value: 'freelance', label: 'Freelance' },
        { value: 'per_diem', label: 'Per Diem' }
      ]},
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
      { name: 'end_date', label: 'End Date', type: 'date' },
      { name: 'rate', label: 'Rate', type: 'currency' },
      { name: 'rate_type', label: 'Rate Type', type: 'select', options: [
        { value: 'hourly', label: 'Hourly' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'project', label: 'Project' }
      ]},
      { name: 'location', label: 'Location', type: 'location' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'active', options: [
        { value: 'pipeline', label: 'Pipeline' },
        { value: 'negotiating', label: 'Negotiating' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]},
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'my-tasks': {
    title: 'Create Task',
    description: 'Add a new task',
    fields: [
      { name: 'title', label: 'Task Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'project', label: 'Project', type: 'autocomplete' },
      { name: 'assignee', label: 'Assignee', type: 'user' },
      { name: 'priority', label: 'Priority', type: 'select', defaultValue: 'normal', options: [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]},
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'todo', options: [
        { value: 'todo', label: 'To Do' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'review', label: 'In Review' },
        { value: 'done', label: 'Done' }
      ]},
      { name: 'due_date', label: 'Due Date', type: 'date' },
      { name: 'estimated_hours', label: 'Estimated Hours', type: 'number' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  }
}

// Projects Module Forms
const projectsForms: Record<string, TabFormConfig> = {
  'productions': {
    title: 'Create Production',
    description: 'Start a new production project',
    fields: [
      { name: 'name', label: 'Production Name', type: 'text', required: true },
      { name: 'production_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'concert', label: 'Concert' },
        { value: 'festival', label: 'Festival' },
        { value: 'tour', label: 'Tour' },
        { value: 'corporate', label: 'Corporate Event' },
        { value: 'theater', label: 'Theater Production' },
        { value: 'broadcast', label: 'Broadcast' }
      ]},
      { name: 'description', label: 'Description', type: 'richtext' },
      { name: 'client', label: 'Client', type: 'autocomplete' },
      { name: 'production_manager', label: 'Production Manager', type: 'user', required: true },
      { name: 'phase', label: 'Phase', type: 'select', defaultValue: 'pre-production', options: [
        { value: 'pre-production', label: 'Pre-Production' },
        { value: 'in_production', label: 'In Production' },
        { value: 'load-in', label: 'Load-In' },
        { value: 'live', label: 'Live' },
        { value: 'post-production', label: 'Post-Production' }
      ]},
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
      { name: 'end_date', label: 'End Date', type: 'date' },
      { name: 'venue', label: 'Venue', type: 'location' },
      { name: 'budget', label: 'Budget', type: 'currency' },
      { name: 'crew_size', label: 'Estimated Crew Size', type: 'number' },
      { name: 'priority', label: 'Priority', type: 'select', options: [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]},
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'activations': {
    title: 'Create Activation',
    description: 'Create a new stage, installation, or brand activation',
    fields: [
      { name: 'name', label: 'Activation Name', type: 'text', required: true },
      { name: 'activation_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'stage', label: 'Stage' },
        { value: 'installation', label: 'Art Installation' },
        { value: 'activation', label: 'Brand Activation' },
        { value: 'amenity', label: 'Guest Amenity' },
        { value: 'experience', label: 'Immersive Experience' }
      ]},
      { name: 'description', label: 'Description', type: 'richtext' },
      { name: 'production', label: 'Parent Production', type: 'autocomplete', required: true },
      { name: 'designer', label: 'Designer', type: 'user' },
      { name: 'project_manager', label: 'Project Manager', type: 'user' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'design', options: [
        { value: 'concept', label: 'Concept' },
        { value: 'design', label: 'Design' },
        { value: 'approved', label: 'Approved' },
        { value: 'build', label: 'Build' },
        { value: 'ready', label: 'Ready' },
        { value: 'active', label: 'Active' },
        { value: 'strike', label: 'Strike' }
      ]},
      { name: 'dimensions', label: 'Dimensions (L×W×H)', type: 'text' },
      { name: 'location', label: 'Location', type: 'location' },
      { name: 'install_date', label: 'Install Date', type: 'date' },
      { name: 'strike_date', label: 'Strike Date', type: 'date' },
      { name: 'budget', label: 'Budget', type: 'currency' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'tasks': {
    title: 'Create Task',
    description: 'Add a new project task',
    fields: [
      { name: 'title', label: 'Task Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'project', label: 'Project', type: 'autocomplete', required: true },
      { name: 'assignee', label: 'Assignee', type: 'user' },
      { name: 'priority', label: 'Priority', type: 'select', defaultValue: 'normal', options: [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]},
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'todo', options: [
        { value: 'todo', label: 'To Do' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'review', label: 'In Review' },
        { value: 'done', label: 'Done' }
      ]},
      { name: 'due_date', label: 'Due Date', type: 'date' },
      { name: 'estimated_hours', label: 'Estimated Hours', type: 'number' },
      { name: 'dependencies', label: 'Dependencies', type: 'multiselect' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'milestones': {
    title: 'Create Milestone',
    description: 'Add a key project milestone',
    fields: [
      { name: 'name', label: 'Milestone Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'project', label: 'Project', type: 'autocomplete', required: true },
      { name: 'milestone_type', label: 'Type', type: 'select', options: [
        { value: 'approval', label: 'Approval' },
        { value: 'contract', label: 'Contract' },
        { value: 'delivery', label: 'Delivery' },
        { value: 'phase_completion', label: 'Phase Completion' },
        { value: 'event', label: 'Event' }
      ]},
      { name: 'owner', label: 'Owner', type: 'user', required: true },
      { name: 'due_date', label: 'Due Date', type: 'date', required: true },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'pending', options: [
        { value: 'pending', label: 'Pending' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'achieved', label: 'Achieved' },
        { value: 'at_risk', label: 'At Risk' },
        { value: 'missed', label: 'Missed' }
      ]},
      { name: 'priority', label: 'Priority', type: 'select', defaultValue: 'high', options: [
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]},
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'compliance': {
    title: 'Create Compliance Item',
    description: 'Add licensing, permit, or regulatory requirement',
    fields: [
      { name: 'name', label: 'Item Name', type: 'text', required: true },
      { name: 'compliance_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'permit', label: 'Permit' },
        { value: 'license', label: 'License' },
        { value: 'inspection', label: 'Inspection' },
        { value: 'certification', label: 'Certification' },
        { value: 'insurance', label: 'Insurance' }
      ]},
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'project', label: 'Project', type: 'autocomplete' },
      { name: 'issuing_authority', label: 'Issuing Authority', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'pending', options: [
        { value: 'not_started', label: 'Not Started' },
        { value: 'pending', label: 'Pending' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'expired', label: 'Expired' }
      ]},
      { name: 'responsible_party', label: 'Responsible Party', type: 'user', required: true },
      { name: 'application_date', label: 'Application Date', type: 'date' },
      { name: 'due_date', label: 'Due Date', type: 'date', required: true },
      { name: 'expiration_date', label: 'Expiration Date', type: 'date' },
      { name: 'fee', label: 'Fee', type: 'currency' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'safety': {
    title: 'Create Safety Item',
    description: 'Add safety assessment or emergency procedure',
    fields: [
      { name: 'name', label: 'Item Name', type: 'text', required: true },
      { name: 'safety_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'risk_assessment', label: 'Risk Assessment' },
        { value: 'safety_plan', label: 'Safety Plan' },
        { value: 'emergency_procedure', label: 'Emergency Procedure' },
        { value: 'inspection', label: 'Inspection' },
        { value: 'protocol', label: 'Protocol' },
        { value: 'training', label: 'Training' }
      ]},
      { name: 'description', label: 'Description', type: 'richtext' },
      { name: 'project', label: 'Project', type: 'autocomplete' },
      { name: 'risk_level', label: 'Risk Level', type: 'select', options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' }
      ]},
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'draft', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'review', label: 'In Review' },
        { value: 'approved', label: 'Approved' },
        { value: 'implemented', label: 'Implemented' }
      ]},
      { name: 'safety_officer', label: 'Safety Officer', type: 'user', required: true },
      { name: 'priority', label: 'Priority', type: 'select', defaultValue: 'high', options: [
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]},
      { name: 'due_date', label: 'Due Date', type: 'date' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  }
}

// People Module Forms
const peopleForms: Record<string, TabFormConfig> = {
  'personnel': {
    title: 'Add Personnel',
    description: 'Add a new crew member or staff',
    fields: [
      { name: 'full_name', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'phone' },
      { name: 'role', label: 'Primary Role', type: 'select', required: true, options: [
        { value: 'production_manager', label: 'Production Manager' },
        { value: 'stage_manager', label: 'Stage Manager' },
        { value: 'audio_engineer', label: 'Audio Engineer' },
        { value: 'lighting_designer', label: 'Lighting Designer' },
        { value: 'video_engineer', label: 'Video Engineer' },
        { value: 'rigger', label: 'Rigger' },
        { value: 'carpenter', label: 'Carpenter' },
        { value: 'electrician', label: 'Electrician' },
        { value: 'technician', label: 'Technician' }
      ]},
      { name: 'department', label: 'Department', type: 'select', options: [
        { value: 'production', label: 'Production' },
        { value: 'audio', label: 'Audio' },
        { value: 'lighting', label: 'Lighting' },
        { value: 'video', label: 'Video' },
        { value: 'rigging', label: 'Rigging' },
        { value: 'stage', label: 'Stage' },
        { value: 'management', label: 'Management' }
      ]},
      { name: 'employment_type', label: 'Employment Type', type: 'select', options: [
        { value: 'full_time', label: 'Full Time' },
        { value: 'part_time', label: 'Part Time' },
        { value: 'contractor', label: 'Contractor' },
        { value: 'freelance', label: 'Freelance' }
      ]},
      { name: 'hire_date', label: 'Hire Date', type: 'date' },
      { name: 'hourly_rate', label: 'Hourly Rate', type: 'currency' },
      { name: 'skills', label: 'Skills', type: 'tags' },
      { name: 'certifications', label: 'Certifications', type: 'tags' },
      { name: 'experience_years', label: 'Years of Experience', type: 'number' },
      { name: 'emergency_contact', label: 'Emergency Contact', type: 'text' },
      { name: 'emergency_phone', label: 'Emergency Phone', type: 'phone' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'active', options: [
        { value: 'active', label: 'Active' },
        { value: 'on_leave', label: 'On Leave' },
        { value: 'contracted', label: 'Contracted' },
        { value: 'inactive', label: 'Inactive' }
      ]}
    ]
  },
  'teams': {
    title: 'Create Team',
    description: 'Create a new team or department',
    fields: [
      { name: 'name', label: 'Team Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'team_type', label: 'Type', type: 'select', options: [
        { value: 'production', label: 'Production Team' },
        { value: 'audio', label: 'Audio Team' },
        { value: 'lighting', label: 'Lighting Team' },
        { value: 'video', label: 'Video Team' },
        { value: 'rigging', label: 'Rigging Team' },
        { value: 'stage', label: 'Stage Crew' }
      ]},
      { name: 'team_lead', label: 'Team Lead', type: 'user', required: true },
      { name: 'members', label: 'Team Members', type: 'multiuser' },
      { name: 'target_size', label: 'Target Team Size', type: 'number' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'active', options: [
        { value: 'planning', label: 'Planning' },
        { value: 'active', label: 'Active' },
        { value: 'on_project', label: 'On Project' },
        { value: 'available', label: 'Available' },
        { value: 'archived', label: 'Archived' }
      ]},
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'openings': {
    title: 'Create Job Opening',
    description: 'Post a new job opening',
    fields: [
      { name: 'title', label: 'Job Title', type: 'text', required: true },
      { name: 'description', label: 'Job Description', type: 'richtext', required: true },
      { name: 'department', label: 'Department', type: 'select', required: true, options: [
        { value: 'production', label: 'Production' },
        { value: 'audio', label: 'Audio' },
        { value: 'lighting', label: 'Lighting' },
        { value: 'video', label: 'Video' },
        { value: 'rigging', label: 'Rigging' },
        { value: 'technical', label: 'Technical' }
      ]},
      { name: 'employment_type', label: 'Employment Type', type: 'select', required: true, options: [
        { value: 'full_time', label: 'Full Time' },
        { value: 'part_time', label: 'Part Time' },
        { value: 'contract', label: 'Contract' },
        { value: 'seasonal', label: 'Seasonal' }
      ]},
      { name: 'salary_range_min', label: 'Salary Range (Min)', type: 'currency' },
      { name: 'salary_range_max', label: 'Salary Range (Max)', type: 'currency' },
      { name: 'location', label: 'Location', type: 'location' },
      { name: 'required_experience', label: 'Years Experience Required', type: 'number' },
      { name: 'required_skills', label: 'Required Skills', type: 'tags' },
      { name: 'preferred_skills', label: 'Preferred Skills', type: 'tags' },
      { name: 'posting_date', label: 'Posting Date', type: 'date' },
      { name: 'application_deadline', label: 'Application Deadline', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'open', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'open', label: 'Open' },
        { value: 'interviewing', label: 'Interviewing' },
        { value: 'on_hold', label: 'On Hold' },
        { value: 'filled', label: 'Filled' },
        { value: 'cancelled', label: 'Cancelled' }
      ]}
    ]
  }
}

// Finance Module Forms
const financeForms: Record<string, TabFormConfig> = {
  'budgets': {
    title: 'Create Budget',
    description: 'Create a new production budget',
    fields: [
      { name: 'name', label: 'Budget Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'production', label: 'Production', type: 'autocomplete', required: true },
      { name: 'budget_type', label: 'Type', type: 'select', options: [
        { value: 'production', label: 'Production Budget' },
        { value: 'department', label: 'Department Budget' },
        { value: 'event', label: 'Event Budget' },
        { value: 'capital', label: 'Capital Budget' }
      ]},
      { name: 'fiscal_year', label: 'Fiscal Year', type: 'number' },
      { name: 'total_amount', label: 'Total Budget Amount', type: 'currency', required: true },
      { name: 'currency', label: 'Currency', type: 'select', defaultValue: 'USD', options: [
        { value: 'USD', label: 'USD - US Dollar' },
        { value: 'EUR', label: 'EUR - Euro' },
        { value: 'GBP', label: 'GBP - British Pound' },
        { value: 'CAD', label: 'CAD - Canadian Dollar' }
      ]},
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
      { name: 'end_date', label: 'End Date', type: 'date', required: true },
      { name: 'owner', label: 'Budget Owner', type: 'user', required: true },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'draft', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'pending_approval', label: 'Pending Approval' },
        { value: 'approved', label: 'Approved' },
        { value: 'active', label: 'Active' },
        { value: 'closed', label: 'Closed' }
      ]},
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'invoices': {
    title: 'Create Invoice',
    description: 'Create a new invoice',
    fields: [
      { name: 'invoice_number', label: 'Invoice Number', type: 'text', required: true },
      { name: 'client', label: 'Client', type: 'autocomplete', required: true },
      { name: 'production', label: 'Production', type: 'autocomplete' },
      { name: 'invoice_date', label: 'Invoice Date', type: 'date', required: true },
      { name: 'due_date', label: 'Due Date', type: 'date', required: true },
      { name: 'subtotal', label: 'Subtotal', type: 'currency', required: true },
      { name: 'tax_rate', label: 'Tax Rate', type: 'percentage' },
      { name: 'tax_amount', label: 'Tax Amount', type: 'currency' },
      { name: 'total_amount', label: 'Total Amount', type: 'currency', required: true },
      { name: 'currency', label: 'Currency', type: 'select', defaultValue: 'USD', options: [
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
        { value: 'GBP', label: 'GBP' }
      ]},
      { name: 'payment_terms', label: 'Payment Terms', type: 'select', options: [
        { value: 'net_30', label: 'Net 30' },
        { value: 'net_60', label: 'Net 60' },
        { value: 'due_on_receipt', label: 'Due on Receipt' },
        { value: 'net_15', label: 'Net 15' }
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'draft', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'sent', label: 'Sent' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'cancelled', label: 'Cancelled' }
      ]}
    ]
  },
  'expenses': {
    title: 'Create Expense',
    description: 'Submit a new expense',
    fields: [
      { name: 'description', label: 'Description', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'travel', label: 'Travel' },
        { value: 'meals', label: 'Meals & Entertainment' },
        { value: 'accommodation', label: 'Accommodation' },
        { value: 'equipment', label: 'Equipment' },
        { value: 'materials', label: 'Materials' },
        { value: 'services', label: 'Services' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'amount', label: 'Amount', type: 'currency', required: true },
      { name: 'expense_date', label: 'Expense Date', type: 'date', required: true },
      { name: 'production', label: 'Production/Project', type: 'autocomplete' },
      { name: 'vendor', label: 'Vendor/Merchant', type: 'text' },
      { name: 'payment_method', label: 'Payment Method', type: 'select', options: [
        { value: 'cash', label: 'Cash' },
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'debit_card', label: 'Debit Card' },
        { value: 'check', label: 'Check' }
      ]},
      { name: 'receipt_attached', label: 'Receipt Attached', type: 'switch' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'pending', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'pending', label: 'Pending Approval' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'reimbursed', label: 'Reimbursed' }
      ]}
    ]
  }
}

// Assets Module Forms
const assetsForms: Record<string, TabFormConfig> = {
  'inventory': {
    title: 'Add Asset',
    description: 'Add a new asset to inventory',
    fields: [
      { name: 'name', label: 'Asset Name', type: 'text', required: true },
      { name: 'asset_id', label: 'Asset ID/Serial Number', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'audio', label: 'Audio Equipment' },
        { value: 'lighting', label: 'Lighting Equipment' },
        { value: 'video', label: 'Video Equipment' },
        { value: 'rigging', label: 'Rigging Equipment' },
        { value: 'staging', label: 'Staging' },
        { value: 'vehicle', label: 'Vehicle' },
        { value: 'tool', label: 'Tool' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
      { name: 'purchase_date', label: 'Purchase Date', type: 'date' },
      { name: 'purchase_price', label: 'Purchase Price', type: 'currency' },
      { name: 'current_value', label: 'Current Value', type: 'currency' },
      { name: 'location', label: 'Current Location', type: 'location' },
      { name: 'condition', label: 'Condition', type: 'select', options: [
        { value: 'excellent', label: 'Excellent' },
        { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' },
        { value: 'poor', label: 'Poor' },
        { value: 'needs_repair', label: 'Needs Repair' }
      ]},
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'available', options: [
        { value: 'available', label: 'Available' },
        { value: 'checked_out', label: 'Checked Out' },
        { value: 'in_maintenance', label: 'In Maintenance' },
        { value: 'retired', label: 'Retired' }
      ]},
      { name: 'assigned_to', label: 'Assigned To', type: 'user' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'maintenance': {
    title: 'Create Maintenance Record',
    description: 'Schedule maintenance or log repair',
    fields: [
      { name: 'asset', label: 'Asset', type: 'autocomplete', required: true },
      { name: 'maintenance_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'routine', label: 'Routine Maintenance' },
        { value: 'preventive', label: 'Preventive Maintenance' },
        { value: 'repair', label: 'Repair' },
        { value: 'inspection', label: 'Inspection' },
        { value: 'calibration', label: 'Calibration' }
      ]},
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'scheduled_date', label: 'Scheduled Date', type: 'date', required: true },
      { name: 'completed_date', label: 'Completed Date', type: 'date' },
      { name: 'technician', label: 'Technician', type: 'user' },
      { name: 'cost', label: 'Cost', type: 'currency' },
      { name: 'parts_replaced', label: 'Parts Replaced', type: 'textarea' },
      { name: 'next_service_date', label: 'Next Service Date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'scheduled', options: [
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]},
      { name: 'priority', label: 'Priority', type: 'select', options: [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]}
    ]
  }
}

// Import extended form configurations
import {
  eventsForms,
  locationsForms,
  companiesForms,
  marketplaceForms,
  procurementForms,
  reportsForms,
  analyticsForms,
  insightsForms
} from './form-fields-extended'

// Export all form configurations
export const MODULE_FORMS: Record<string, Record<string, TabFormConfig>> = {
  dashboard: dashboardForms,
  projects: projectsForms,
  people: peopleForms,
  finance: financeForms,
  assets: assetsForms,
  events: eventsForms,
  locations: locationsForms,
  companies: companiesForms,
  marketplace: marketplaceForms,
  procurement: procurementForms,
  reports: reportsForms,
  analytics: analyticsForms,
  insights: insightsForms,
}

// Helper function to get form config for a module tab
export function getFormConfig(moduleId: string, tabSlug: string): TabFormConfig | undefined {
  const moduleForms = MODULE_FORMS[moduleId]
  if (!moduleForms) return undefined
  return moduleForms[tabSlug]
}
