import type { TabFormConfig } from './form-fields-registry'

// Events Module Forms
export const eventsForms: Record<string, TabFormConfig> = {
  'all-events': {
    title: 'Create Event',
    description: 'Schedule a new event',
    fields: [
      { name: 'title', label: 'Event Title', type: 'text', required: true },
      { name: 'event_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'performance', label: 'Performance' },
        { value: 'rehearsal', label: 'Rehearsal' },
        { value: 'meeting', label: 'Meeting' },
        { value: 'workshop', label: 'Workshop' },
        { value: 'class', label: 'Class' }
      ]},
      { name: 'description', label: 'Description', type: 'richtext' },
      { name: 'production', label: 'Production', type: 'autocomplete' },
      { name: 'start_datetime', label: 'Start Date & Time', type: 'datetime', required: true },
      { name: 'end_datetime', label: 'End Date & Time', type: 'datetime', required: true },
      { name: 'location', label: 'Location', type: 'location', required: true },
      { name: 'organizer', label: 'Organizer', type: 'user' },
      { name: 'attendees', label: 'Attendees', type: 'multiuser' },
      { name: 'capacity', label: 'Capacity', type: 'number' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'scheduled', options: [
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]},
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'bookings': {
    title: 'Create Booking',
    description: 'Create venue or resource booking',
    fields: [
      { name: 'name', label: 'Booking Name', type: 'text', required: true },
      { name: 'booking_type', label: 'Type', type: 'select', options: [
        { value: 'venue', label: 'Venue' },
        { value: 'equipment', label: 'Equipment' },
        { value: 'accommodation', label: 'Accommodation' },
        { value: 'transportation', label: 'Transportation' }
      ]},
      { name: 'venue', label: 'Venue/Location', type: 'location', required: true },
      { name: 'production', label: 'Production', type: 'autocomplete' },
      { name: 'start_date', label: 'Start Date', type: 'datetime', required: true },
      { name: 'end_date', label: 'End Date', type: 'datetime', required: true },
      { name: 'cost', label: 'Cost', type: 'currency' },
      { name: 'contact_person', label: 'Contact Person', type: 'text' },
      { name: 'contact_email', label: 'Contact Email', type: 'email' },
      { name: 'contact_phone', label: 'Contact Phone', type: 'phone' },
      { name: 'confirmation_number', label: 'Confirmation Number', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'pending', options: [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  }
}

// Locations Module Forms
export const locationsForms: Record<string, TabFormConfig> = {
  'directory': {
    title: 'Add Location',
    description: 'Add a new venue or facility',
    fields: [
      { name: 'name', label: 'Location Name', type: 'text', required: true },
      { name: 'location_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'venue', label: 'Venue' },
        { value: 'office', label: 'Office' },
        { value: 'warehouse', label: 'Warehouse' },
        { value: 'studio', label: 'Studio' },
        { value: 'facility', label: 'Facility' }
      ]},
      { name: 'address', label: 'Address', type: 'text', required: true },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'state', label: 'State/Province', type: 'text' },
      { name: 'postal_code', label: 'Postal Code', type: 'text' },
      { name: 'country', label: 'Country', type: 'text', required: true },
      { name: 'capacity', label: 'Capacity', type: 'number' },
      { name: 'square_footage', label: 'Square Footage', type: 'number' },
      { name: 'contact_name', label: 'Contact Name', type: 'text' },
      { name: 'contact_phone', label: 'Contact Phone', type: 'phone' },
      { name: 'contact_email', label: 'Contact Email', type: 'email' },
      { name: 'amenities', label: 'Amenities', type: 'tags' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'active', options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]}
    ]
  }
}

// Companies Module Forms
export const companiesForms: Record<string, TabFormConfig> = {
  'organizations': {
    title: 'Add Company',
    description: 'Add a new company or organization',
    fields: [
      { name: 'name', label: 'Company Name', type: 'text', required: true },
      { name: 'company_type', label: 'Type', type: 'select', options: [
        { value: 'client', label: 'Client' },
        { value: 'vendor', label: 'Vendor' },
        { value: 'partner', label: 'Partner' },
        { value: 'contractor', label: 'Contractor' }
      ]},
      { name: 'industry', label: 'Industry', type: 'text' },
      { name: 'website', label: 'Website', type: 'url' },
      { name: 'phone', label: 'Phone', type: 'phone' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'address', label: 'Address', type: 'text' },
      { name: 'city', label: 'City', type: 'text' },
      { name: 'state', label: 'State', type: 'text' },
      { name: 'country', label: 'Country', type: 'text' },
      { name: 'tax_id', label: 'Tax ID', type: 'text' },
      { name: 'payment_terms', label: 'Payment Terms', type: 'select', options: [
        { value: 'net_30', label: 'Net 30' },
        { value: 'net_60', label: 'Net 60' },
        { value: 'due_on_receipt', label: 'Due on Receipt' }
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'active', options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]}
    ]
  }
}

// Marketplace Module Forms
export const marketplaceForms: Record<string, TabFormConfig> = {
  'products': {
    title: 'Add Product',
    description: 'List a new product',
    fields: [
      { name: 'name', label: 'Product Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'audio', label: 'Audio Equipment' },
        { value: 'lighting', label: 'Lighting' },
        { value: 'video', label: 'Video' },
        { value: 'staging', label: 'Staging' },
        { value: 'rigging', label: 'Rigging' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'price', label: 'Price', type: 'currency', required: true },
      { name: 'sku', label: 'SKU', type: 'text' },
      { name: 'stock_quantity', label: 'Stock Quantity', type: 'number', required: true },
      { name: 'condition', label: 'Condition', type: 'select', options: [
        { value: 'new', label: 'New' },
        { value: 'like_new', label: 'Like New' },
        { value: 'used', label: 'Used' },
        { value: 'refurbished', label: 'Refurbished' }
      ]},
      { name: 'shipping_weight', label: 'Shipping Weight (lbs)', type: 'number' },
      { name: 'featured', label: 'Featured Product', type: 'switch' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  }
}

// Jobs/Procurement Module Forms
export const procurementForms: Record<string, TabFormConfig> = {
  'orders': {
    title: 'Create Order',
    description: 'Create a new purchase or work order',
    fields: [
      { name: 'order_number', label: 'Order Number', type: 'text', required: true },
      { name: 'order_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'purchase_order', label: 'Purchase Order' },
        { value: 'work_order', label: 'Work Order' },
        { value: 'change_order', label: 'Change Order' },
        { value: 'talent_order', label: 'Talent Order' }
      ]},
      { name: 'vendor', label: 'Vendor', type: 'autocomplete', required: true },
      { name: 'production', label: 'Production', type: 'autocomplete' },
      { name: 'order_date', label: 'Order Date', type: 'date', required: true },
      { name: 'delivery_date', label: 'Expected Delivery', type: 'date' },
      { name: 'subtotal', label: 'Subtotal', type: 'currency', required: true },
      { name: 'tax', label: 'Tax', type: 'currency' },
      { name: 'total', label: 'Total', type: 'currency', required: true },
      { name: 'payment_terms', label: 'Payment Terms', type: 'select', options: [
        { value: 'net_30', label: 'Net 30' },
        { value: 'net_60', label: 'Net 60' },
        { value: 'prepaid', label: 'Prepaid' },
        { value: 'cod', label: 'COD' }
      ]},
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'draft', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'approved', label: 'Approved' },
        { value: 'fulfilled', label: 'Fulfilled' },
        { value: 'cancelled', label: 'Cancelled' }
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  }
}

// Reports Module Forms
export const reportsForms: Record<string, TabFormConfig> = {
  'custom-builder': {
    title: 'Create Custom Report',
    description: 'Build a custom report',
    fields: [
      { name: 'name', label: 'Report Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'report_type', label: 'Report Type', type: 'select', required: true, options: [
        { value: 'financial', label: 'Financial' },
        { value: 'operations', label: 'Operations' },
        { value: 'hr', label: 'Human Resources' },
        { value: 'compliance', label: 'Compliance' },
        { value: 'custom', label: 'Custom' }
      ]},
      { name: 'data_source', label: 'Data Source', type: 'multiselect', required: true },
      { name: 'frequency', label: 'Frequency', type: 'select', options: [
        { value: 'once', label: 'Run Once' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
      ]},
      { name: 'recipients', label: 'Recipients', type: 'multiuser' },
      { name: 'format', label: 'Export Format', type: 'select', options: [
        { value: 'pdf', label: 'PDF' },
        { value: 'xlsx', label: 'Excel' },
        { value: 'csv', label: 'CSV' },
        { value: 'html', label: 'HTML' }
      ]},
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  }
}

// Analytics Module Forms
export const analyticsForms: Record<string, TabFormConfig> = {
  'custom-views': {
    title: 'Create Custom View',
    description: 'Build a custom analytics dashboard',
    fields: [
      { name: 'name', label: 'View Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'data_sources', label: 'Data Sources', type: 'multiselect', required: true },
      { name: 'metrics', label: 'Metrics', type: 'tags', required: true },
      { name: 'date_range', label: 'Default Date Range', type: 'select', options: [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'quarter', label: 'This Quarter' },
        { value: 'year', label: 'This Year' },
        { value: 'custom', label: 'Custom' }
      ]},
      { name: 'refresh_rate', label: 'Refresh Rate', type: 'select', options: [
        { value: 'realtime', label: 'Real-time' },
        { value: '1min', label: 'Every Minute' },
        { value: '5min', label: 'Every 5 Minutes' },
        { value: '15min', label: 'Every 15 Minutes' },
        { value: 'manual', label: 'Manual' }
      ]},
      { name: 'shared_with', label: 'Share With', type: 'multiuser' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  }
}

// Insights Module Forms
export const insightsForms: Record<string, TabFormConfig> = {
  'objectives': {
    title: 'Create Objective',
    description: 'Set a strategic objective',
    fields: [
      { name: 'name', label: 'Objective Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'objective_type', label: 'Type', type: 'select', options: [
        { value: 'strategic', label: 'Strategic' },
        { value: 'operational', label: 'Operational' },
        { value: 'financial', label: 'Financial' },
        { value: 'growth', label: 'Growth' }
      ]},
      { name: 'owner', label: 'Owner', type: 'user', required: true },
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
      { name: 'target_date', label: 'Target Date', type: 'date', required: true },
      { name: 'priority', label: 'Priority', type: 'select', options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' }
      ]},
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'active', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'active', label: 'Active' },
        { value: 'on_track', label: 'On Track' },
        { value: 'at_risk', label: 'At Risk' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]},
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'key-results': {
    title: 'Create Key Result',
    description: 'Define a measurable key result',
    fields: [
      { name: 'name', label: 'Key Result Name', type: 'text', required: true },
      { name: 'objective', label: 'Objective', type: 'autocomplete', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'metric_type', label: 'Metric Type', type: 'select', required: true, options: [
        { value: 'number', label: 'Number' },
        { value: 'percentage', label: 'Percentage' },
        { value: 'currency', label: 'Currency' },
        { value: 'boolean', label: 'Yes/No' }
      ]},
      { name: 'start_value', label: 'Starting Value', type: 'number', required: true },
      { name: 'target_value', label: 'Target Value', type: 'number', required: true },
      { name: 'current_value', label: 'Current Value', type: 'number' },
      { name: 'unit', label: 'Unit', type: 'text' },
      { name: 'owner', label: 'Owner', type: 'user' },
      { name: 'due_date', label: 'Due Date', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'in_progress', options: [
        { value: 'not_started', label: 'Not Started' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'achieved', label: 'Achieved' },
        { value: 'at_risk', label: 'At Risk' }
      ]}
    ]
  }
}
