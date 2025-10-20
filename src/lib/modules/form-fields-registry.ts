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
    title: 'Schedule Event',
    description: 'Add a new event to your personal agenda',
    submitLabel: 'Add to Agenda',
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
    title: 'Add Job',
    description: 'Track a new job opportunity or contract',
    submitLabel: 'Add Job',
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
    title: 'Add Task',
    description: 'Create a new personal task',
    submitLabel: 'Add Task',
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
  },
  'my-assets': {
    title: 'Add Personal Asset',
    description: 'Register personal equipment or asset',
    submitLabel: 'Add Asset',
    fields: [
      { name: 'name', label: 'Asset Name', type: 'text', required: true },
      { name: 'asset_id', label: 'Serial Number/ID', type: 'text' },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'audio', label: 'Audio Equipment' },
        { value: 'lighting', label: 'Lighting' },
        { value: 'video', label: 'Video' },
        { value: 'computer', label: 'Computer/Tech' },
        { value: 'tools', label: 'Tools' },
        { value: 'vehicle', label: 'Vehicle' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
      { name: 'purchase_date', label: 'Purchase Date', type: 'date' },
      { name: 'purchase_price', label: 'Purchase Price', type: 'currency' },
      { name: 'rental_rate', label: 'Daily Rental Rate', type: 'currency' },
      { name: 'condition', label: 'Condition', type: 'select', defaultValue: 'good', options: [
        { value: 'excellent', label: 'Excellent' },
        { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' },
        { value: 'needs_repair', label: 'Needs Repair' }
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'my-orders': {
    title: 'Create Order',
    description: 'Place a new marketplace order',
    submitLabel: 'Create Order',
    fields: [
      { name: 'vendor', label: 'Vendor', type: 'autocomplete', required: true },
      { name: 'order_type', label: 'Order Type', type: 'select', required: true, options: [
        { value: 'rental', label: 'Equipment Rental' },
        { value: 'purchase', label: 'Purchase' },
        { value: 'service', label: 'Service' }
      ]},
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true, defaultValue: 1 },
      { name: 'unit_price', label: 'Unit Price', type: 'currency', required: true },
      { name: 'delivery_date', label: 'Needed By', type: 'date', required: true },
      { name: 'delivery_location', label: 'Delivery Location', type: 'location' },
      { name: 'project', label: 'Project', type: 'autocomplete' },
      { name: 'notes', label: 'Special Instructions', type: 'textarea' }
    ]
  },
  'my-advances': {
    title: 'Request Production Advance',
    description: 'Request equipment, materials, or assets for production',
    submitLabel: 'Submit Request',
    fields: [
      { name: 'project', label: 'Project', type: 'autocomplete', required: true },
      { name: 'company', label: 'Company', type: 'autocomplete' },
      { name: 'department_team', label: 'Department/Team', type: 'text' },
      { name: 'asset_category', label: 'Asset Category', type: 'select', required: true, options: [
        { value: 'site_infrastructure', label: 'Site Infrastructure' },
        { value: 'site_services', label: 'Site Services' },
        { value: 'site_safety', label: 'Site Safety' },
        { value: 'site_vehicles', label: 'Site Vehicles' },
        { value: 'heavy_equipment', label: 'Heavy Equipment' },
        { value: 'consumables', label: 'Consumables' },
        { value: 'event_rentals', label: 'Event Rentals' },
        { value: 'signage', label: 'Signage' },
        { value: 'backline', label: 'Backline' },
        { value: 'access', label: 'Access (Apps/Systems)' },
        { value: 'credentials', label: 'Credentials' },
        { value: 'parking', label: 'Parking' },
        { value: 'meals', label: 'Meals' },
        { value: 'flights', label: 'Flights' },
        { value: 'lodging', label: 'Lodging' },
        { value: 'rental_cars', label: 'Rental Cars' }
      ]},
      { name: 'asset_item', label: 'Asset/Item', type: 'autocomplete', required: true, description: 'Search from catalog or enter new item' },
      { name: 'accessories', label: 'Accessories', type: 'tags', description: 'List any accessories needed with this item' },
      { name: 'quantity', label: 'Quantity', type: 'number', defaultValue: 1, required: true },
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
      { name: 'end_date', label: 'End Date', type: 'date' },
      { name: 'site_location', label: 'Site Location', type: 'location', required: true },
      { name: 'operational_purpose', label: 'Operational Purpose', type: 'textarea', required: true, description: 'Describe how this will be used' },
      { name: 'special_considerations', label: 'Special Considerations', type: 'textarea' },
      { name: 'additional_information', label: 'Additional Information', type: 'textarea' },
      { name: 'assigned_users', label: 'Assigned Users', type: 'multiuser', description: 'People approved to collect/use these items' }
    ]
  },
  'my-travel': {
    title: 'Add Travel',
    description: 'Create a travel arrangement or itinerary',
    submitLabel: 'Add Travel',
    fields: [
      { name: 'trip_name', label: 'Trip Name', type: 'text', required: true },
      { name: 'travel_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'flight', label: 'Flight' },
        { value: 'train', label: 'Train' },
        { value: 'bus', label: 'Bus' },
        { value: 'car', label: 'Car/Driving' },
        { value: 'accommodation', label: 'Accommodation' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'departure_location', label: 'From', type: 'location', required: true },
      { name: 'arrival_location', label: 'To', type: 'location', required: true },
      { name: 'departure_date', label: 'Departure Date & Time', type: 'datetime', required: true },
      { name: 'arrival_date', label: 'Arrival Date & Time', type: 'datetime' },
      { name: 'confirmation_number', label: 'Confirmation #', type: 'text' },
      { name: 'carrier', label: 'Airline/Carrier', type: 'text' },
      { name: 'seat_number', label: 'Seat/Room #', type: 'text' },
      { name: 'project', label: 'Project', type: 'autocomplete' },
      { name: 'cost', label: 'Cost', type: 'currency' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'my-expenses': {
    title: 'Submit Expense',
    description: 'Submit a personal expense for reimbursement',
    submitLabel: 'Submit Expense',
    fields: [
      { name: 'expense_date', label: 'Date', type: 'date', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'meals', label: 'Meals & Entertainment' },
        { value: 'travel', label: 'Travel' },
        { value: 'accommodation', label: 'Accommodation' },
        { value: 'transportation', label: 'Transportation' },
        { value: 'equipment', label: 'Equipment' },
        { value: 'materials', label: 'Materials/Supplies' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'merchant', label: 'Merchant/Vendor', type: 'text', required: true },
      { name: 'amount', label: 'Amount', type: 'currency', required: true },
      { name: 'project', label: 'Project', type: 'autocomplete', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'receipt', label: 'Receipt', type: 'file' },
      { name: 'billable', label: 'Billable to Client', type: 'switch' },
      { name: 'payment_method', label: 'Payment Method', type: 'select', options: [
        { value: 'personal_card', label: 'Personal Card' },
        { value: 'cash', label: 'Cash' },
        { value: 'company_card', label: 'Company Card' }
      ]}
    ]
  },
  'my-reports': {
    title: 'Save Report',
    description: 'Save a custom or recurring report',
    submitLabel: 'Save Report',
    fields: [
      { name: 'report_name', label: 'Report Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'report_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'financial', label: 'Financial' },
        { value: 'project', label: 'Project' },
        { value: 'personnel', label: 'Personnel' },
        { value: 'operations', label: 'Operations' },
        { value: 'custom', label: 'Custom' }
      ]},
      { name: 'schedule', label: 'Schedule', type: 'select', options: [
        { value: 'one_time', label: 'One Time' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
      ]},
      { name: 'format', label: 'Export Format', type: 'select', options: [
        { value: 'pdf', label: 'PDF' },
        { value: 'excel', label: 'Excel' },
        { value: 'csv', label: 'CSV' }
      ]},
      { name: 'favorite', label: 'Add to Favorites', type: 'switch' }
    ]
  },
  'my-files': {
    title: 'Upload File',
    description: 'Upload a document or file',
    submitLabel: 'Upload File',
    fields: [
      { name: 'file', label: 'File', type: 'file', required: true },
      { name: 'name', label: 'File Name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'contract', label: 'Contract' },
        { value: 'invoice', label: 'Invoice' },
        { value: 'receipt', label: 'Receipt' },
        { value: 'report', label: 'Report' },
        { value: 'photo', label: 'Photo' },
        { value: 'drawing', label: 'Drawing/Plan' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'project', label: 'Project', type: 'autocomplete' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  }
}

// Projects Module Forms
const projectsForms: Record<string, TabFormConfig> = {
  'productions': {
    title: 'Create Production',
    description: 'Start a new production project',
    submitLabel: 'Create Production',
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
    description: 'Design a new stage, installation, or brand activation',
    submitLabel: 'Create Activation',
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
    title: 'Add Project Task',
    description: 'Create a new task for this project',
    submitLabel: 'Add Task',
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
    title: 'Add Milestone',
    description: 'Define a key project milestone or deliverable',
    submitLabel: 'Add Milestone',
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
    title: 'Add Compliance Requirement',
    description: 'Track a licensing, permit, or regulatory requirement',
    submitLabel: 'Add Requirement',
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
    title: 'Add Safety Item',
    description: 'Document a safety assessment or emergency procedure',
    submitLabel: 'Add Safety Item',
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
    title: 'Add Team Member',
    description: 'Add a new crew member or staff to your team',
    submitLabel: 'Add Team Member',
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
    description: 'Form a new team or department',
    submitLabel: 'Create Team',
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
    title: 'Post Job Opening',
    description: 'Create a new job posting to recruit talent',
    submitLabel: 'Post Opening',
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
  },
  'assignments': {
    title: 'Create Assignment',
    description: 'Assign personnel to project tasks',
    submitLabel: 'Create Assignment',
    fields: [
      { name: 'person', label: 'Team Member', type: 'user', required: true },
      { name: 'project', label: 'Project', type: 'autocomplete', required: true },
      { name: 'task', label: 'Task', type: 'autocomplete' },
      { name: 'role', label: 'Role on Project', type: 'text', required: true },
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
      { name: 'end_date', label: 'End Date', type: 'date' },
      { name: 'estimated_hours', label: 'Estimated Hours', type: 'number' },
      { name: 'hourly_rate', label: 'Rate', type: 'currency' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'timekeeping': {
    title: 'Log Time',
    description: 'Record time worked by crew member',
    submitLabel: 'Log Time',
    fields: [
      { name: 'person', label: 'Team Member', type: 'user', required: true },
      { name: 'project', label: 'Project', type: 'autocomplete', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'clock_in', label: 'Clock In', type: 'time', required: true },
      { name: 'clock_out', label: 'Clock Out', type: 'time', required: true },
      { name: 'break_duration', label: 'Break Duration (minutes)', type: 'number' },
      { name: 'total_hours', label: 'Total Hours', type: 'number', required: true },
      { name: 'overtime_hours', label: 'Overtime Hours', type: 'number' },
      { name: 'time_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'regular', label: 'Regular Time' },
        { value: 'overtime', label: 'Overtime' },
        { value: 'double_time', label: 'Double Time' },
        { value: 'holiday', label: 'Holiday Pay' }
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'scheduling': {
    title: 'Create Schedule',
    description: 'Schedule crew availability and shifts',
    submitLabel: 'Create Schedule',
    fields: [
      { name: 'schedule_name', label: 'Schedule Name', type: 'text', required: true },
      { name: 'person', label: 'Team Member', type: 'user', required: true },
      { name: 'project', label: 'Project', type: 'autocomplete', required: true },
      { name: 'start_datetime', label: 'Start Date & Time', type: 'datetime', required: true },
      { name: 'end_datetime', label: 'End Date & Time', type: 'datetime', required: true },
      { name: 'shift_type', label: 'Shift Type', type: 'select', options: [
        { value: 'day', label: 'Day Shift' },
        { value: 'night', label: 'Night Shift' },
        { value: 'split', label: 'Split Shift' },
        { value: 'on_call', label: 'On-Call' }
      ]},
      { name: 'location', label: 'Location', type: 'location' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'training': {
    title: 'Schedule Training',
    description: 'Create a training session or program',
    submitLabel: 'Schedule Training',
    fields: [
      { name: 'training_title', label: 'Training Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'training_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'safety', label: 'Safety Training' },
        { value: 'technical', label: 'Technical Skills' },
        { value: 'equipment', label: 'Equipment Training' },
        { value: 'certification', label: 'Certification Program' },
        { value: 'compliance', label: 'Compliance' },
        { value: 'soft_skills', label: 'Soft Skills' }
      ]},
      { name: 'instructor', label: 'Instructor', type: 'user', required: true },
      { name: 'attendees', label: 'Attendees', type: 'multiuser' },
      { name: 'start_date', label: 'Start Date', type: 'datetime', required: true },
      { name: 'end_date', label: 'End Date', type: 'datetime' },
      { name: 'location', label: 'Location', type: 'location' },
      { name: 'capacity', label: 'Max Capacity', type: 'number' },
      { name: 'certification_provided', label: 'Provides Certification', type: 'switch' },
      { name: 'materials', label: 'Training Materials', type: 'file' }
    ]
  },
  'onboarding': {
    title: 'Create Onboarding',
    description: 'Set up new hire onboarding process',
    submitLabel: 'Create Onboarding',
    fields: [
      { name: 'employee', label: 'New Hire', type: 'user', required: true },
      { name: 'position', label: 'Position', type: 'text', required: true },
      { name: 'department', label: 'Department', type: 'select', required: true, options: [
        { value: 'production', label: 'Production' },
        { value: 'audio', label: 'Audio' },
        { value: 'lighting', label: 'Lighting' },
        { value: 'video', label: 'Video' },
        { value: 'management', label: 'Management' }
      ]},
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
      { name: 'onboarding_buddy', label: 'Onboarding Buddy', type: 'user' },
      { name: 'manager', label: 'Direct Manager', type: 'user', required: true },
      { name: 'orientation_date', label: 'Orientation Date', type: 'date' },
      { name: 'equipment_needed', label: 'Equipment Needed', type: 'tags' },
      { name: 'access_required', label: 'Access/Credentials Required', type: 'tags' },
      { name: 'training_modules', label: 'Required Training', type: 'multiselect' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'applicants': {
    title: 'Add Applicant',
    description: 'Track a new job applicant',
    submitLabel: 'Add Applicant',
    fields: [
      { name: 'full_name', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'phone' },
      { name: 'position_applied', label: 'Position Applied For', type: 'autocomplete', required: true },
      { name: 'application_date', label: 'Application Date', type: 'date', required: true },
      { name: 'resume', label: 'Resume', type: 'file' },
      { name: 'cover_letter', label: 'Cover Letter', type: 'file' },
      { name: 'years_experience', label: 'Years of Experience', type: 'number' },
      { name: 'skills', label: 'Skills', type: 'tags' },
      { name: 'referral_source', label: 'How did they hear about us?', type: 'select', options: [
        { value: 'website', label: 'Website' },
        { value: 'referral', label: 'Employee Referral' },
        { value: 'job_board', label: 'Job Board' },
        { value: 'social_media', label: 'Social Media' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'applied', options: [
        { value: 'applied', label: 'Applied' },
        { value: 'screening', label: 'Screening' },
        { value: 'interviewing', label: 'Interviewing' },
        { value: 'offer_extended', label: 'Offer Extended' },
        { value: 'hired', label: 'Hired' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'withdrawn', label: 'Withdrawn' }
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  }
}

// Finance Module Forms
const financeForms: Record<string, TabFormConfig> = {
  'budgets': {
    title: 'Create Budget',
    description: 'Set up a new budget for tracking finances',
    submitLabel: 'Create Budget',
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
    title: 'Generate Invoice',
    description: 'Create and send a new invoice to a client',
    submitLabel: 'Generate Invoice',
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
    title: 'Submit Expense',
    description: 'Record a new expense for reimbursement',
    submitLabel: 'Submit Expense',
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
  },
  'transactions': {
    title: 'Record Transaction',
    description: 'Log a financial transaction or entry',
    submitLabel: 'Record Transaction',
    fields: [
      { name: 'transaction_date', label: 'Date', type: 'date', required: true },
      { name: 'transaction_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'income', label: 'Income' },
        { value: 'expense', label: 'Expense' },
        { value: 'transfer', label: 'Transfer' },
        { value: 'adjustment', label: 'Adjustment' }
      ]},
      { name: 'description', label: 'Description', type: 'text', required: true },
      { name: 'amount', label: 'Amount', type: 'currency', required: true },
      { name: 'account', label: 'Account', type: 'select', required: true, options: [
        { value: 'operating', label: 'Operating' },
        { value: 'payroll', label: 'Payroll' },
        { value: 'production', label: 'Production' },
        { value: 'capital', label: 'Capital' }
      ]},
      { name: 'category', label: 'Category', type: 'autocomplete' },
      { name: 'gl_code', label: 'GL Code', type: 'text' },
      { name: 'project', label: 'Project', type: 'autocomplete' },
      { name: 'vendor', label: 'Vendor/Payee', type: 'autocomplete' },
      { name: 'reference', label: 'Reference Number', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'revenue': {
    title: 'Record Revenue',
    description: 'Log revenue or income stream',
    submitLabel: 'Record Revenue',
    fields: [
      { name: 'revenue_date', label: 'Date', type: 'date', required: true },
      { name: 'source', label: 'Revenue Source', type: 'text', required: true },
      { name: 'amount', label: 'Amount', type: 'currency', required: true },
      { name: 'revenue_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'ticket_sales', label: 'Ticket Sales' },
        { value: 'sponsorship', label: 'Sponsorship' },
        { value: 'merchandise', label: 'Merchandise' },
        { value: 'services', label: 'Services' },
        { value: 'licensing', label: 'Licensing' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'client', label: 'Client', type: 'autocomplete', required: true },
      { name: 'project', label: 'Project', type: 'autocomplete' },
      { name: 'payment_method', label: 'Payment Method', type: 'select', options: [
        { value: 'cash', label: 'Cash' },
        { value: 'check', label: 'Check' },
        { value: 'wire', label: 'Wire Transfer' },
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'ach', label: 'ACH' }
      ]},
      { name: 'invoice_number', label: 'Invoice #', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'payroll': {
    title: 'Process Payroll',
    description: 'Create a payroll entry for crew payment',
    submitLabel: 'Process Payroll',
    fields: [
      { name: 'pay_period_start', label: 'Pay Period Start', type: 'date', required: true },
      { name: 'pay_period_end', label: 'Pay Period End', type: 'date', required: true },
      { name: 'pay_date', label: 'Pay Date', type: 'date', required: true },
      { name: 'employee', label: 'Employee', type: 'user', required: true },
      { name: 'project', label: 'Project', type: 'autocomplete' },
      { name: 'hours_worked', label: 'Hours Worked', type: 'number', required: true },
      { name: 'hourly_rate', label: 'Hourly Rate', type: 'currency', required: true },
      { name: 'overtime_hours', label: 'Overtime Hours', type: 'number' },
      { name: 'overtime_rate', label: 'Overtime Rate', type: 'currency' },
      { name: 'gross_pay', label: 'Gross Pay', type: 'currency', required: true },
      { name: 'deductions', label: 'Deductions', type: 'currency' },
      { name: 'net_pay', label: 'Net Pay', type: 'currency', required: true },
      { name: 'payment_method', label: 'Payment Method', type: 'select', options: [
        { value: 'direct_deposit', label: 'Direct Deposit' },
        { value: 'check', label: 'Check' },
        { value: 'cash', label: 'Cash' }
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'payments': {
    title: 'Process Payment',
    description: 'Record an outgoing payment',
    submitLabel: 'Process Payment',
    fields: [
      { name: 'payment_date', label: 'Payment Date', type: 'date', required: true },
      { name: 'payee', label: 'Payee', type: 'autocomplete', required: true },
      { name: 'amount', label: 'Amount', type: 'currency', required: true },
      { name: 'payment_method', label: 'Payment Method', type: 'select', required: true, options: [
        { value: 'check', label: 'Check' },
        { value: 'ach', label: 'ACH Transfer' },
        { value: 'wire', label: 'Wire Transfer' },
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'cash', label: 'Cash' }
      ]},
      { name: 'payment_type', label: 'Payment Type', type: 'select', required: true, options: [
        { value: 'invoice', label: 'Invoice Payment' },
        { value: 'expense', label: 'Expense Reimbursement' },
        { value: 'payroll', label: 'Payroll' },
        { value: 'vendor', label: 'Vendor Payment' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'reference', label: 'Reference/Check #', type: 'text' },
      { name: 'invoice', label: 'Invoice', type: 'autocomplete' },
      { name: 'project', label: 'Project', type: 'autocomplete' },
      { name: 'account', label: 'Account', type: 'select', options: [
        { value: 'operating', label: 'Operating Account' },
        { value: 'payroll', label: 'Payroll Account' },
        { value: 'production', label: 'Production Account' }
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'reconciliation': {
    title: 'Create Reconciliation',
    description: 'Reconcile project finances and settlements',
    submitLabel: 'Create Reconciliation',
    fields: [
      { name: 'reconciliation_name', label: 'Name', type: 'text', required: true },
      { name: 'project', label: 'Project/Show', type: 'autocomplete', required: true },
      { name: 'reconciliation_date', label: 'Reconciliation Date', type: 'date', required: true },
      { name: 'period_start', label: 'Period Start', type: 'date', required: true },
      { name: 'period_end', label: 'Period End', type: 'date', required: true },
      { name: 'budgeted_amount', label: 'Budgeted Amount', type: 'currency', required: true },
      { name: 'actual_spent', label: 'Actual Spent', type: 'currency', required: true },
      { name: 'variance', label: 'Variance', type: 'currency' },
      { name: 'reconciliation_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'project', label: 'Project Settlement' },
        { value: 'show', label: 'Show Settlement' },
        { value: 'monthly', label: 'Monthly Reconciliation' },
        { value: 'final', label: 'Final Settlement' }
      ]},
      { name: 'prepared_by', label: 'Prepared By', type: 'user', required: true },
      { name: 'approved_by', label: 'Approved By', type: 'user' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'taxes': {
    title: 'Add Tax Document',
    description: 'Record tax document or filing',
    submitLabel: 'Add Tax Document',
    fields: [
      { name: 'tax_year', label: 'Tax Year', type: 'number', required: true },
      { name: 'tax_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'income_tax', label: 'Income Tax' },
        { value: 'sales_tax', label: 'Sales Tax' },
        { value: 'payroll_tax', label: 'Payroll Tax' },
        { value: 'property_tax', label: 'Property Tax' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'tax_form', label: 'Tax Form', type: 'select', options: [
        { value: '1040', label: 'Form 1040' },
        { value: '1099', label: 'Form 1099' },
        { value: 'w2', label: 'Form W-2' },
        { value: 'w4', label: 'Form W-4' },
        { value: '941', label: 'Form 941' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'filing_date', label: 'Filing Date', type: 'date' },
      { name: 'due_date', label: 'Due Date', type: 'date', required: true },
      { name: 'amount', label: 'Amount', type: 'currency' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'pending', options: [
        { value: 'pending', label: 'Pending' },
        { value: 'filed', label: 'Filed' },
        { value: 'paid', label: 'Paid' },
        { value: 'overdue', label: 'Overdue' }
      ]},
      { name: 'document', label: 'Document', type: 'file' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'accounts': {
    title: 'Add Account',
    description: 'Create a new accounting category',
    submitLabel: 'Add Account',
    fields: [
      { name: 'account_name', label: 'Account Name', type: 'text', required: true },
      { name: 'account_number', label: 'Account Number', type: 'text', required: true },
      { name: 'account_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'asset', label: 'Asset' },
        { value: 'liability', label: 'Liability' },
        { value: 'equity', label: 'Equity' },
        { value: 'revenue', label: 'Revenue' },
        { value: 'expense', label: 'Expense' }
      ]},
      { name: 'sub_type', label: 'Sub-type', type: 'text' },
      { name: 'parent_account', label: 'Parent Account', type: 'autocomplete' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'active', label: 'Active', type: 'switch', defaultValue: true }
    ]
  },
  'gl-codes': {
    title: 'Add GL Code',
    description: 'Create a general ledger code',
    submitLabel: 'Add GL Code',
    fields: [
      { name: 'gl_code', label: 'GL Code', type: 'text', required: true },
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'account_type', label: 'Account Type', type: 'select', required: true, options: [
        { value: 'asset', label: 'Asset' },
        { value: 'liability', label: 'Liability' },
        { value: 'equity', label: 'Equity' },
        { value: 'revenue', label: 'Revenue' },
        { value: 'expense', label: 'Expense' }
      ]},
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'active', label: 'Active', type: 'switch', defaultValue: true }
    ]
  }
}

// Assets Module Forms
const assetsForms: Record<string, TabFormConfig> = {
  'inventory': {
    title: 'Add Asset',
    description: 'Register a new asset in your inventory',
    submitLabel: 'Add Asset',
    fields: [
      { name: 'name', label: 'Asset Name', type: 'text', required: true },
      { name: 'asset_id', label: 'Asset ID/Serial Number', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'site_infrastructure', label: 'Site Infrastructure' },
        { value: 'site_services', label: 'Site Services' },
        { value: 'site_safety', label: 'Site Safety' },
        { value: 'site_vehicles', label: 'Site Vehicles' },
        { value: 'heavy_equipment', label: 'Heavy Equipment' },
        { value: 'consumables', label: 'Consumables' },
        { value: 'event_rentals', label: 'Event Rentals' },
        { value: 'signage', label: 'Signage' },
        { value: 'backline', label: 'Backline' },
        { value: 'access', label: 'Access (Apps/Systems)' },
        { value: 'credentials', label: 'Credentials' },
        { value: 'parking', label: 'Parking' },
        { value: 'meals', label: 'Meals' },
        { value: 'flights', label: 'Flights' },
        { value: 'lodging', label: 'Lodging' },
        { value: 'rental_cars', label: 'Rental Cars' },
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
    title: 'Schedule Maintenance',
    description: 'Schedule maintenance or log a repair',
    submitLabel: 'Schedule Maintenance',
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
  },
  'tracking': {
    title: 'Check Out Asset',
    description: 'Check out or track asset movement',
    submitLabel: 'Check Out',
    fields: [
      { name: 'asset', label: 'Asset', type: 'autocomplete', required: true },
      { name: 'action', label: 'Action', type: 'select', required: true, options: [
        { value: 'check_out', label: 'Check Out' },
        { value: 'check_in', label: 'Check In' },
        { value: 'transfer', label: 'Transfer Location' }
      ]},
      { name: 'person', label: 'Checked Out To', type: 'user', required: true },
      { name: 'project', label: 'Project', type: 'autocomplete' },
      { name: 'checkout_date', label: 'Check-Out Date', type: 'datetime', required: true },
      { name: 'expected_return', label: 'Expected Return', type: 'datetime' },
      { name: 'from_location', label: 'From Location', type: 'location' },
      { name: 'to_location', label: 'To Location', type: 'location' },
      { name: 'condition_out', label: 'Condition at Check-Out', type: 'select', options: [
        { value: 'excellent', label: 'Excellent' },
        { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' },
        { value: 'needs_attention', label: 'Needs Attention' }
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'approvals': {
    title: 'Request Approval',
    description: 'Submit an approval request for production advance',
    submitLabel: 'Submit Request',
    fields: [
      { name: 'request_type', label: 'Request Type', type: 'select', required: true, options: [
        { value: 'equipment', label: 'Equipment Request' },
        { value: 'purchase', label: 'Purchase Request' },
        { value: 'rental', label: 'Rental Request' },
        { value: 'access', label: 'Access Request' }
      ]},
      { name: 'project', label: 'Project', type: 'autocomplete', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'requested_by', label: 'Requested By', type: 'user', required: true },
      { name: 'justification', label: 'Business Justification', type: 'richtext', required: true },
      { name: 'estimated_cost', label: 'Estimated Cost', type: 'currency' },
      { name: 'needed_by', label: 'Needed By Date', type: 'date', required: true },
      { name: 'priority', label: 'Priority', type: 'select', defaultValue: 'normal', options: [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]},
      { name: 'approver', label: 'Approver', type: 'user', required: true },
      { name: 'attachments', label: 'Supporting Documents', type: 'file' }
    ]
  },
  'advances': {
    title: 'Create Production Advance',
    description: 'Issue production advance for equipment/materials',
    submitLabel: 'Create Advance',
    fields: [
      { name: 'project', label: 'Project', type: 'autocomplete', required: true },
      { name: 'company', label: 'Company', type: 'autocomplete' },
      { name: 'department_team', label: 'Department/Team', type: 'text' },
      { name: 'asset_category', label: 'Asset Category', type: 'select', required: true, options: [
        { value: 'site_infrastructure', label: 'Site Infrastructure' },
        { value: 'site_services', label: 'Site Services' },
        { value: 'site_safety', label: 'Site Safety' },
        { value: 'site_vehicles', label: 'Site Vehicles' },
        { value: 'heavy_equipment', label: 'Heavy Equipment' },
        { value: 'consumables', label: 'Consumables' },
        { value: 'event_rentals', label: 'Event Rentals' },
        { value: 'signage', label: 'Signage' },
        { value: 'backline', label: 'Backline' },
        { value: 'access', label: 'Access (Apps/Systems)' },
        { value: 'credentials', label: 'Credentials' },
        { value: 'parking', label: 'Parking' },
        { value: 'meals', label: 'Meals' },
        { value: 'flights', label: 'Flights' },
        { value: 'lodging', label: 'Lodging' },
        { value: 'rental_cars', label: 'Rental Cars' }
      ]},
      { name: 'asset_item', label: 'Asset/Item', type: 'autocomplete', required: true, description: 'Search from catalog or enter new item' },
      { name: 'accessories', label: 'Accessories', type: 'tags', description: 'List any accessories included with this item' },
      { name: 'quantity', label: 'Quantity', type: 'number', defaultValue: 1, required: true },
      { name: 'start_date', label: 'Rental Start Date', type: 'date', required: true },
      { name: 'end_date', label: 'Rental End Date', type: 'date' },
      { name: 'site_location', label: 'Site Location', type: 'location', required: true },
      { name: 'operational_purpose', label: 'Operational Purpose', type: 'textarea', required: true, description: 'Business justification and intended use' },
      { name: 'special_considerations', label: 'Special Considerations', type: 'textarea', description: 'Any special handling, setUp, or requirements' },
      { name: 'additional_information', label: 'Additional Information', type: 'textarea' },
      { name: 'requestor', label: 'Requestor', type: 'user', required: true },
      { name: 'assigned_users', label: 'Assigned Users', type: 'multiuser', description: 'People approved to collect/use these items' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'pending', options: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'fulfilled', label: 'Fulfilled' },
        { value: 'active', label: 'Active' },
        { value: 'returned', label: 'Returned' },
        { value: 'partially_returned', label: 'Partially Returned' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'denied', label: 'Denied' }
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'catalog': {
    title: 'Add to Catalog',
    description: 'Add item to complete asset catalog',
    submitLabel: 'Add to Catalog',
    fields: [
      { name: 'item_name', label: 'Item Name', type: 'text', required: true },
      { name: 'catalog_category', label: 'Category', type: 'select', required: true, options: [
        { value: 'site_infrastructure', label: 'Site Infrastructure' },
        { value: 'site_services', label: 'Site Services' },
        { value: 'site_safety', label: 'Site Safety' },
        { value: 'site_vehicles', label: 'Site Vehicles' },
        { value: 'heavy_equipment', label: 'Heavy Equipment' },
        { value: 'consumables', label: 'Consumables' },
        { value: 'event_rentals', label: 'Event Rentals' },
        { value: 'signage', label: 'Signage' },
        { value: 'backline', label: 'Backline' },
        { value: 'access', label: 'Access (Apps/Systems)' },
        { value: 'credentials', label: 'Credentials' },
        { value: 'parking', label: 'Parking' },
        { value: 'meals', label: 'Meals' },
        { value: 'flights', label: 'Flights' },
        { value: 'lodging', label: 'Lodging' },
        { value: 'rental_cars', label: 'Rental Cars' },
        { value: 'infrastructure', label: 'Infrastructure' },
        { value: 'equipment', label: 'Equipment' },
        { value: 'vehicle', label: 'Vehicle' },
        { value: 'tool', label: 'Tool' },
        { value: 'credential', label: 'Credential/Badge' },
        { value: 'consumable', label: 'Consumable' }
      ]},
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'specifications', label: 'Technical Specifications', type: 'richtext' },
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model_number', label: 'Model Number', type: 'text' },
      { name: 'unit_cost', label: 'Unit Cost', type: 'currency' },
      { name: 'rental_rate_daily', label: 'Daily Rental Rate', type: 'currency' },
      { name: 'availability', label: 'Availability', type: 'select', options: [
        { value: 'in_stock', label: 'In Stock' },
        { value: 'limited', label: 'Limited Availability' },
        { value: 'out_of_stock', label: 'Out of Stock' },
        { value: 'discontinued', label: 'Discontinued' }
      ]},
      { name: 'image', label: 'Product Image', type: 'file' },
      { name: 'datasheet', label: 'Datasheet/Manual', type: 'file' },
      { name: 'tags', label: 'Tags', type: 'tags' }
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
  insightsForms,
  filesForms,
  resourcesForms,
  communityForms,
  jobsForms
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
  files: filesForms,
  resources: resourcesForms,
  community: communityForms,
  jobs: jobsForms,
}

// Helper function to get form config for a module tab
export function getFormConfig(moduleId: string, tabSlug: string): TabFormConfig | undefined {
  const moduleForms = MODULE_FORMS[moduleId]
  if (!moduleForms) return undefined
  return moduleForms[tabSlug]
}

// Helper function to get the create button label for a module tab
export function getCreateButtonLabel(moduleId: string, tabSlug: string): string | undefined {
  const config = getFormConfig(moduleId, tabSlug)
  if (!config) return undefined
  
  // Use the form title without "Create", "Add", etc. prefix for a cleaner button
  // Or return the submitLabel if you want the full action text
  return config.title
}
