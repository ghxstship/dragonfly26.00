import type { TabFormConfig } from './form-fields-registry'

// Events Module Forms
export const eventsForms: Record<string, TabFormConfig> = {
  'all-events': {
    title: 'Schedule Event',
    description: 'Create and schedule a new event',
    submitLabel: 'Schedule Event',
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
    description: 'Reserve a venue or resource',
    submitLabel: 'Create Booking',
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
  },
  'activities': {
    title: 'Create Activity',
    description: 'Schedule performance, rehearsal, class, or recreation',
    submitLabel: 'Create Activity',
    fields: [
      { name: 'activity_name', label: 'Activity Name', type: 'text', required: true },
      { name: 'activity_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'performance', label: 'Performance' },
        { value: 'rehearsal', label: 'Rehearsal' },
        { value: 'class', label: 'Class' },
        { value: 'workshop', label: 'Workshop' },
        { value: 'recreation', label: 'Recreation' }
      ]},
      { name: 'production', label: 'Production', type: 'autocomplete' },
      { name: 'start_time', label: 'Start Time', type: 'datetime', required: true },
      { name: 'duration', label: 'Duration (minutes)', type: 'number', required: true },
      { name: 'location', label: 'Location', type: 'location' },
      { name: 'instructor', label: 'Instructor/Lead', type: 'user' },
      { name: 'participants', label: 'Participants', type: 'multiuser' },
      { name: 'max_participants', label: 'Max Participants', type: 'number' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'run-of-show': {
    title: 'Create Run of Show',
    description: 'Build detailed show rundown and cue sheet',
    submitLabel: 'Create Rundown',
    fields: [
      { name: 'show_name', label: 'Show Name', type: 'text', required: true },
      { name: 'event', label: 'Event', type: 'autocomplete', required: true },
      { name: 'show_date', label: 'Show Date', type: 'date', required: true },
      { name: 'doors_time', label: 'Doors Time', type: 'time' },
      { name: 'show_start', label: 'Show Start', type: 'time', required: true },
      { name: 'show_end', label: 'Show End (estimated)', type: 'time' },
      { name: 'stage_manager', label: 'Stage Manager', type: 'user', required: true },
      { name: 'technical_director', label: 'Technical Director', type: 'user' },
      { name: 'notes', label: 'Show Notes', type: 'richtext' }
    ]
  },
  'rehearsals': {
    title: 'Schedule Rehearsal',
    description: 'Create a rehearsal session',
    submitLabel: 'Schedule Rehearsal',
    fields: [
      { name: 'rehearsal_name', label: 'Rehearsal Name', type: 'text', required: true },
      { name: 'production', label: 'Production', type: 'autocomplete', required: true },
      { name: 'rehearsal_type', label: 'Type', type: 'select', options: [
        { value: 'blocking', label: 'Blocking' },
        { value: 'technical', label: 'Technical' },
        { value: 'dress', label: 'Dress Rehearsal' },
        { value: 'full_run', label: 'Full Run-Through' }
      ]},
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'start_time', label: 'Start Time', type: 'time', required: true },
      { name: 'end_time', label: 'End Time', type: 'time', required: true },
      { name: 'location', label: 'Location', type: 'location', required: true },
      { name: 'director', label: 'Director', type: 'user' },
      { name: 'cast_crew', label: 'Required Cast/Crew', type: 'multiuser' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'blocks': {
    title: 'Create Block',
    description: 'Reserve room block, dressing room, green room, or studio',
    submitLabel: 'Create Block',
    fields: [
      { name: 'block_name', label: 'Block Name', type: 'text', required: true },
      { name: 'block_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'dressing_room', label: 'Dressing Room' },
        { value: 'green_room', label: 'Green Room' },
        { value: 'hotel_block', label: 'Hotel Block' },
        { value: 'studio_block', label: 'Studio Block' },
        { value: 'rehearsal_space', label: 'Rehearsal Space' }
      ]},
      { name: 'location', label: 'Location/Venue', type: 'location', required: true },
      { name: 'room_number', label: 'Room Number/Name', type: 'text' },
      { name: 'production', label: 'Production', type: 'autocomplete' },
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
      { name: 'end_date', label: 'End Date', type: 'date', required: true },
      { name: 'assigned_to', label: 'Assigned To', type: 'multiuser' },
      { name: 'capacity', label: 'Capacity', type: 'number' },
      { name: 'cost_per_night', label: 'Cost Per Night', type: 'currency' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'tours': {
    title: 'Create Tour',
    description: 'Schedule tour dates and multi-city schedule',
    submitLabel: 'Create Tour',
    fields: [
      { name: 'tour_name', label: 'Tour Name', type: 'text', required: true },
      { name: 'production', label: 'Production', type: 'autocomplete', required: true },
      { name: 'tour_start', label: 'Tour Start Date', type: 'date', required: true },
      { name: 'tour_end', label: 'Tour End Date', type: 'date', required: true },
      { name: 'cities', label: 'Number of Cities', type: 'number' },
      { name: 'tour_manager', label: 'Tour Manager', type: 'user', required: true },
      { name: 'production_manager', label: 'Production Manager', type: 'user' },
      { name: 'budget', label: 'Tour Budget', type: 'currency' },
      { name: 'notes', label: 'Tour Notes', type: 'richtext' }
    ]
  },
  'itineraries': {
    title: 'Create Itinerary',
    description: 'Build travel itinerary and schedule',
    submitLabel: 'Create Itinerary',
    fields: [
      { name: 'itinerary_name', label: 'Itinerary Name', type: 'text', required: true },
      { name: 'production', label: 'Production/Tour', type: 'autocomplete' },
      { name: 'travelers', label: 'Travelers', type: 'multiuser', required: true },
      { name: 'departure_location', label: 'Departure From', type: 'location', required: true },
      { name: 'arrival_location', label: 'Arrival To', type: 'location', required: true },
      { name: 'departure_date', label: 'Departure Date & Time', type: 'datetime', required: true },
      { name: 'return_date', label: 'Return Date & Time', type: 'datetime' },
      { name: 'transportation_mode', label: 'Transportation', type: 'select', options: [
        { value: 'flight', label: 'Flight' },
        { value: 'bus', label: 'Bus' },
        { value: 'train', label: 'Train' },
        { value: 'car', label: 'Car/Van' }
      ]},
      { name: 'confirmation_numbers', label: 'Confirmation Numbers', type: 'textarea' },
      { name: 'total_cost', label: 'Total Cost', type: 'currency' },
      { name: 'notes', label: 'Special Instructions', type: 'richtext' }
    ]
  },
  'reservations': {
    title: 'Make Reservation',
    description: 'Create hospitality or entertainment reservation',
    submitLabel: 'Make Reservation',
    fields: [
      { name: 'reservation_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'catering', label: 'Catering' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'hospitality', label: 'Hospitality Suite' }
      ]},
      { name: 'venue_name', label: 'Venue Name', type: 'text', required: true },
      { name: 'production', label: 'Production', type: 'autocomplete' },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'time', label: 'Time', type: 'time', required: true },
      { name: 'party_size', label: 'Party Size', type: 'number', required: true },
      { name: 'contact_name', label: 'Contact Name', type: 'text', required: true },
      { name: 'contact_phone', label: 'Contact Phone', type: 'phone', required: true },
      { name: 'confirmation_number', label: 'Confirmation #', type: 'text' },
      { name: 'budget', label: 'Budget', type: 'currency' },
      { name: 'special_requests', label: 'Special Requests', type: 'textarea' }
    ]
  },
  'equipment': {
    title: 'Assign Equipment',
    description: 'Track event equipment assignments',
    submitLabel: 'Assign Equipment',
    fields: [
      { name: 'event', label: 'Event', type: 'autocomplete', required: true },
      { name: 'equipment_item', label: 'Equipment', type: 'autocomplete', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true, defaultValue: 1 },
      { name: 'assigned_to', label: 'Assigned To', type: 'user' },
      { name: 'checkout_date', label: 'Check-Out Date', type: 'datetime', required: true },
      { name: 'return_date', label: 'Return Date', type: 'datetime' },
      { name: 'location', label: 'Location', type: 'location' },
      { name: 'condition_notes', label: 'Condition Notes', type: 'textarea' }
    ]
  },
  'shipping-receiving': {
    title: 'Create Shipment',
    description: 'Log shipment or delivery for event',
    submitLabel: 'Create Shipment',
    fields: [
      { name: 'shipment_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'outgoing', label: 'Outgoing Shipment' },
        { value: 'incoming', label: 'Incoming Delivery' },
        { value: 'freight', label: 'Freight' }
      ]},
      { name: 'event', label: 'Event', type: 'autocomplete', required: true },
      { name: 'carrier', label: 'Carrier', type: 'text', required: true },
      { name: 'tracking_number', label: 'Tracking Number', type: 'text' },
      { name: 'ship_from', label: 'Ship From', type: 'location', required: true },
      { name: 'ship_to', label: 'Ship To', type: 'location', required: true },
      { name: 'ship_date', label: 'Ship Date', type: 'date', required: true },
      { name: 'expected_delivery', label: 'Expected Delivery', type: 'date' },
      { name: 'contents', label: 'Contents', type: 'richtext', required: true },
      { name: 'weight', label: 'Weight (lbs)', type: 'number' },
      { name: 'cost', label: 'Shipping Cost', type: 'currency' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'trainings': {
    title: 'Schedule Training',
    description: 'Create training session or workshop',
    submitLabel: 'Schedule Training',
    fields: [
      { name: 'training_title', label: 'Title', type: 'text', required: true },
      { name: 'training_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'safety', label: 'Safety Training' },
        { value: 'equipment', label: 'Equipment Training' },
        { value: 'technical', label: 'Technical Skills' },
        { value: 'certification', label: 'Certification' }
      ]},
      { name: 'instructor', label: 'Instructor', type: 'user', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'start_time', label: 'Start Time', type: 'time', required: true },
      { name: 'duration', label: 'Duration (hours)', type: 'number', required: true },
      { name: 'location', label: 'Location', type: 'location', required: true },
      { name: 'attendees', label: 'Attendees', type: 'multiuser' },
      { name: 'max_capacity', label: 'Max Capacity', type: 'number' },
      { name: 'certification_provided', label: 'Provides Certification', type: 'switch' },
      { name: 'materials', label: 'Training Materials', type: 'file' }
    ]
  },
  'incidents': {
    title: 'Report Incident',
    description: 'Document incident or safety issue',
    submitLabel: 'Report Incident',
    fields: [
      { name: 'incident_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'injury', label: 'Injury' },
        { value: 'equipment_damage', label: 'Equipment Damage' },
        { value: 'safety_violation', label: 'Safety Violation' },
        { value: 'security', label: 'Security Incident' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'event', label: 'Event', type: 'autocomplete' },
      { name: 'incident_date', label: 'Date & Time', type: 'datetime', required: true },
      { name: 'location', label: 'Location', type: 'location', required: true },
      { name: 'reported_by', label: 'Reported By', type: 'user', required: true },
      { name: 'involved_parties', label: 'Involved Parties', type: 'multiuser' },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'severity', label: 'Severity', type: 'select', required: true, options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'critical', label: 'Critical' }
      ]},
      { name: 'action_taken', label: 'Immediate Action Taken', type: 'textarea' },
      { name: 'follow_up_required', label: 'Follow-up Required', type: 'switch' },
      { name: 'attachments', label: 'Photos/Documents', type: 'file' }
    ]
  },
  'internal': {
    title: 'Create Internal Event',
    description: 'Schedule administrative or internal event',
    submitLabel: 'Create Event',
    fields: [
      { name: 'event_name', label: 'Event Name', type: 'text', required: true },
      { name: 'event_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'meeting', label: 'Team Meeting' },
        { value: 'training', label: 'Staff Training' },
        { value: 'review', label: 'Performance Review' },
        { value: 'celebration', label: 'Team Celebration' },
        { value: 'admin', label: 'Administrative' }
      ]},
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'start_time', label: 'Start Time', type: 'time', required: true },
      { name: 'end_time', label: 'End Time', type: 'time' },
      { name: 'location', label: 'Location', type: 'location' },
      { name: 'organizer', label: 'Organizer', type: 'user', required: true },
      { name: 'attendees', label: 'Attendees', type: 'multiuser' },
      { name: 'agenda', label: 'Agenda', type: 'richtext' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  }
}

// Locations Module Forms
export const locationsForms: Record<string, TabFormConfig> = {
  'directory': {
    title: 'Add Location',
    description: 'Register a new venue or facility',
    submitLabel: 'Add Location',
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
  },
  'site-maps': {
    title: 'Upload Site Map',
    description: 'Add facility layout or floor plan',
    submitLabel: 'Upload Map',
    fields: [
      { name: 'map_name', label: 'Map Name', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'autocomplete', required: true },
      { name: 'map_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'floor_plan', label: 'Floor Plan' },
        { value: 'site_layout', label: 'Site Layout' },
        { value: 'venue_map', label: 'Venue Map' },
        { value: 'parking_map', label: 'Parking Map' }
      ]},
      { name: 'floor_level', label: 'Floor/Level', type: 'text' },
      { name: 'map_file', label: 'Map File', type: 'file', required: true },
      { name: 'scale', label: 'Scale', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'access': {
    title: 'Add Access Point',
    description: 'Register access point or security entry',
    submitLabel: 'Add Access Point',
    fields: [
      { name: 'access_point_name', label: 'Access Point Name', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'autocomplete', required: true },
      { name: 'access_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'main_entrance', label: 'Main Entrance' },
        { value: 'loading_dock', label: 'Loading Dock' },
        { value: 'stage_door', label: 'Stage Door' },
        { value: 'security_gate', label: 'Security Gate' },
        { value: 'emergency_exit', label: 'Emergency Exit' }
      ]},
      { name: 'access_code', label: 'Access Code', type: 'text' },
      { name: 'key_holder', label: 'Key Holder', type: 'user' },
      { name: 'hours_of_operation', label: 'Hours of Operation', type: 'text' },
      { name: 'security_level', label: 'Security Level', type: 'select', options: [
        { value: 'public', label: 'Public' },
        { value: 'staff_only', label: 'Staff Only' },
        { value: 'authorized', label: 'Authorized Personnel' },
        { value: 'restricted', label: 'Restricted' }
      ]},
      { name: 'notes', label: 'Access Notes', type: 'textarea' }
    ]
  },
  'warehousing': {
    title: 'Add Storage Location',
    description: 'Register storage facility or inventory location',
    submitLabel: 'Add Storage',
    fields: [
      { name: 'warehouse_name', label: 'Warehouse Name', type: 'text', required: true },
      { name: 'parent_location', label: 'Parent Location', type: 'autocomplete' },
      { name: 'warehouse_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'warehouse', label: 'Warehouse' },
        { value: 'storage_unit', label: 'Storage Unit' },
        { value: 'equipment_room', label: 'Equipment Room' },
        { value: 'cage', label: 'Cage/Locker' }
      ]},
      { name: 'address', label: 'Address', type: 'text', required: true },
      { name: 'square_footage', label: 'Square Footage', type: 'number' },
      { name: 'climate_controlled', label: 'Climate Controlled', type: 'switch' },
      { name: 'security_features', label: 'Security Features', type: 'tags' },
      { name: 'access_hours', label: 'Access Hours', type: 'text' },
      { name: 'monthly_cost', label: 'Monthly Cost', type: 'currency' },
      { name: 'manager', label: 'Facility Manager', type: 'user' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'logistics': {
    title: 'Plan Logistics',
    description: 'Coordinate transportation, shipping, and delivery',
    submitLabel: 'Plan Logistics',
    fields: [
      { name: 'logistics_name', label: 'Logistics Plan Name', type: 'text', required: true },
      { name: 'production', label: 'Production', type: 'autocomplete', required: true },
      { name: 'logistics_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'equipment_transport', label: 'Equipment Transport' },
        { value: 'freight', label: 'Freight' },
        { value: 'personnel_transport', label: 'Personnel Transport' },
        { value: 'delivery', label: 'Delivery' }
      ]},
      { name: 'origin', label: 'Origin', type: 'location', required: true },
      { name: 'destination', label: 'Destination', type: 'location', required: true },
      { name: 'departure_date', label: 'Departure Date', type: 'datetime', required: true },
      { name: 'arrival_date', label: 'Arrival Date', type: 'datetime' },
      { name: 'carrier', label: 'Carrier/Transport Provider', type: 'text' },
      { name: 'estimated_cost', label: 'Estimated Cost', type: 'currency' },
      { name: 'notes', label: 'Logistics Notes', type: 'richtext' }
    ]
  },
  'utilities': {
    title: 'Add Utility Connection',
    description: 'Register facility power, water, HVAC, internet',
    submitLabel: 'Add Utility',
    fields: [
      { name: 'utility_name', label: 'Utility Name', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'autocomplete', required: true },
      { name: 'utility_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'power', label: 'Power/Electrical' },
        { value: 'water', label: 'Water' },
        { value: 'hvac', label: 'HVAC' },
        { value: 'internet', label: 'Internet/Network' },
        { value: 'gas', label: 'Gas' },
        { value: 'security', label: 'Security System' }
      ]},
      { name: 'service_provider', label: 'Service Provider', type: 'text' },
      { name: 'account_number', label: 'Account Number', type: 'text' },
      { name: 'capacity', label: 'Capacity/Specifications', type: 'text' },
      { name: 'contact_name', label: 'Service Contact', type: 'text' },
      { name: 'contact_phone', label: 'Service Phone', type: 'phone' },
      { name: 'monthly_cost', label: 'Monthly Cost', type: 'currency' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  }
}

// Companies Module Forms
export const companiesForms: Record<string, TabFormConfig> = {
  'organizations': {
    title: 'Add Company',
    description: 'Register a new company or organization',
    submitLabel: 'Add Company',
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
  },
  'contacts': {
    title: 'Add Contact',
    description: 'Add contact person for company',
    submitLabel: 'Add Contact',
    fields: [
      { name: 'full_name', label: 'Full Name', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'autocomplete', required: true },
      { name: 'job_title', label: 'Job Title', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'phone' },
      { name: 'mobile', label: 'Mobile', type: 'phone' },
      { name: 'department', label: 'Department', type: 'text' },
      { name: 'primary_contact', label: 'Primary Contact', type: 'switch' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'deliverables': {
    title: 'Create Deliverable',
    description: 'Define project deliverable or milestone',
    submitLabel: 'Create Deliverable',
    fields: [
      { name: 'deliverable_name', label: 'Deliverable Name', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'autocomplete', required: true },
      { name: 'project', label: 'Project', type: 'autocomplete', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'deliverable_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'design', label: 'Design' },
        { value: 'technical', label: 'Technical Documentation' },
        { value: 'asset', label: 'Physical Asset' },
        { value: 'service', label: 'Service Completion' },
        { value: 'report', label: 'Report' }
      ]},
      { name: 'due_date', label: 'Due Date', type: 'date', required: true },
      { name: 'assigned_to', label: 'Assigned To', type: 'user' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'pending', options: [
        { value: 'pending', label: 'Pending' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'review', label: 'In Review' },
        { value: 'approved', label: 'Approved' },
        { value: 'delivered', label: 'Delivered' }
      ]}
    ]
  },
  'scopes-of-work': {
    title: 'Define Scope',
    description: 'Create scope of work document',
    submitLabel: 'Define Scope',
    fields: [
      { name: 'scope_name', label: 'Scope Name', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'autocomplete', required: true },
      { name: 'project', label: 'Project', type: 'autocomplete', required: true },
      { name: 'description', label: 'Scope Description', type: 'richtext', required: true },
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
      { name: 'end_date', label: 'End Date', type: 'date', required: true },
      { name: 'budget', label: 'Budget', type: 'currency', required: true },
      { name: 'payment_terms', label: 'Payment Terms', type: 'select', options: [
        { value: 'net_30', label: 'Net 30' },
        { value: 'net_60', label: 'Net 60' },
        { value: 'milestone', label: 'Milestone-based' },
        { value: 'upfront', label: 'Upfront Payment' }
      ]},
      { name: 'deliverables', label: 'Key Deliverables', type: 'richtext' },
      { name: 'exclusions', label: 'Exclusions', type: 'richtext' },
      { name: 'document', label: 'SOW Document', type: 'file' }
    ]
  },
  'documents': {
    title: 'Upload Document',
    description: 'Upload company-related document',
    submitLabel: 'Upload Document',
    fields: [
      { name: 'document_name', label: 'Document Name', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'autocomplete', required: true },
      { name: 'document_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'contract', label: 'Contract' },
        { value: 'insurance', label: 'Insurance Certificate' },
        { value: 'w9', label: 'W-9' },
        { value: 'nda', label: 'NDA' },
        { value: 'invoice', label: 'Invoice' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'document_file', label: 'Document File', type: 'file', required: true },
      { name: 'expiration_date', label: 'Expiration Date', type: 'date' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'bids': {
    title: 'Submit Bid',
    description: 'Create and submit bid proposal',
    submitLabel: 'Submit Bid',
    fields: [
      { name: 'bid_name', label: 'Bid Name', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'autocomplete', required: true },
      { name: 'project', label: 'Project/RFP', type: 'autocomplete', required: true },
      { name: 'bid_amount', label: 'Bid Amount', type: 'currency', required: true },
      { name: 'description', label: 'Bid Description', type: 'richtext', required: true },
      { name: 'submission_date', label: 'Submission Date', type: 'date', required: true },
      { name: 'decision_date', label: 'Decision Date', type: 'date' },
      { name: 'bid_document', label: 'Bid Document', type: 'file' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'draft', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'under_review', label: 'Under Review' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'rejected', label: 'Rejected' }
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  }
}

// Marketplace Module Forms
export const marketplaceForms: Record<string, TabFormConfig> = {
  'products': {
    title: 'List Product',
    description: 'Add a new product to the marketplace',
    submitLabel: 'List Product',
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
  },
  'sales': {
    title: 'Create Sale',
    description: 'Record marketplace sale transaction',
    submitLabel: 'Create Sale',
    fields: [
      { name: 'product', label: 'Product', type: 'autocomplete', required: true },
      { name: 'buyer', label: 'Buyer', type: 'autocomplete', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true, defaultValue: 1 },
      { name: 'unit_price', label: 'Unit Price', type: 'currency', required: true },
      { name: 'total_amount', label: 'Total Amount', type: 'currency', required: true },
      { name: 'sale_date', label: 'Sale Date', type: 'date', required: true },
      { name: 'payment_method', label: 'Payment Method', type: 'select', options: [
        { value: 'cash', label: 'Cash' },
        { value: 'check', label: 'Check' },
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'wire', label: 'Wire Transfer' }
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'purchases': {
    title: 'Make Purchase',
    description: 'Purchase item from marketplace',
    submitLabel: 'Make Purchase',
    fields: [
      { name: 'product', label: 'Product', type: 'autocomplete', required: true },
      { name: 'seller', label: 'Seller', type: 'autocomplete', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true, defaultValue: 1 },
      { name: 'unit_price', label: 'Unit Price', type: 'currency', required: true },
      { name: 'shipping_cost', label: 'Shipping Cost', type: 'currency' },
      { name: 'total_amount', label: 'Total Amount', type: 'currency', required: true },
      { name: 'purchase_date', label: 'Purchase Date', type: 'date', required: true },
      { name: 'delivery_address', label: 'Delivery Address', type: 'location' },
      { name: 'expected_delivery', label: 'Expected Delivery Date', type: 'date' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'lists': {
    title: 'Create List',
    description: 'Create marketplace wishlist or collection',
    submitLabel: 'Create List',
    fields: [
      { name: 'list_name', label: 'List Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'list_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'wishlist', label: 'Wishlist' },
        { value: 'shopping_cart', label: 'Shopping Cart' },
        { value: 'favorites', label: 'Favorites' },
        { value: 'collection', label: 'Collection' }
      ]},
      { name: 'public', label: 'Public List', type: 'switch' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'services': {
    title: 'List Service',
    description: 'Offer service in marketplace',
    submitLabel: 'List Service',
    fields: [
      { name: 'service_name', label: 'Service Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'audio', label: 'Audio Services' },
        { value: 'lighting', label: 'Lighting Design' },
        { value: 'video', label: 'Video Production' },
        { value: 'rigging', label: 'Rigging' },
        { value: 'consulting', label: 'Consulting' },
        { value: 'training', label: 'Training' }
      ]},
      { name: 'hourly_rate', label: 'Hourly Rate', type: 'currency' },
      { name: 'day_rate', label: 'Day Rate', type: 'currency' },
      { name: 'project_rate', label: 'Project Rate', type: 'currency' },
      { name: 'availability', label: 'Availability', type: 'text' },
      { name: 'portfolio', label: 'Portfolio/Samples', type: 'file' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'vendors': {
    title: 'Register Vendor',
    description: 'Register as marketplace vendor',
    submitLabel: 'Register Vendor',
    fields: [
      { name: 'vendor_name', label: 'Vendor/Business Name', type: 'text', required: true },
      { name: 'contact_name', label: 'Contact Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'phone', required: true },
      { name: 'business_type', label: 'Business Type', type: 'select', required: true, options: [
        { value: 'individual', label: 'Individual' },
        { value: 'llc', label: 'LLC' },
        { value: 'corporation', label: 'Corporation' },
        { value: 'partnership', label: 'Partnership' }
      ]},
      { name: 'address', label: 'Business Address', type: 'text' },
      { name: 'tax_id', label: 'Tax ID/EIN', type: 'text' },
      { name: 'payment_info', label: 'Payment Information', type: 'textarea' },
      { name: 'specialties', label: 'Specialties', type: 'tags' }
    ]
  },
  'reviews': {
    title: 'Write Review',
    description: 'Write product or service review',
    submitLabel: 'Submit Review',
    fields: [
      { name: 'product', label: 'Product/Service', type: 'autocomplete', required: true },
      { name: 'rating', label: 'Rating', type: 'number', required: true },
      { name: 'title', label: 'Review Title', type: 'text', required: true },
      { name: 'review_text', label: 'Review', type: 'richtext', required: true },
      { name: 'recommend', label: 'Would Recommend', type: 'switch' },
      { name: 'photos', label: 'Photos', type: 'file' }
    ]
  }
}

// Jobs/Procurement Module Forms
export const procurementForms: Record<string, TabFormConfig> = {
  'orders': {
    title: 'Create Order',
    description: 'Generate a new purchase or work order',
    submitLabel: 'Create Order',
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
  },
  'fulfillment': {
    title: 'Update Fulfillment',
    description: 'Track order fulfillment status',
    submitLabel: 'Update Status',
    fields: [
      { name: 'order', label: 'Order', type: 'autocomplete', required: true },
      { name: 'fulfillment_status', label: 'Status', type: 'select', required: true, options: [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
      ]},
      { name: 'tracking_number', label: 'Tracking Number', type: 'text' },
      { name: 'carrier', label: 'Carrier', type: 'text' },
      { name: 'shipped_date', label: 'Shipped Date', type: 'date' },
      { name: 'delivery_date', label: 'Delivery Date', type: 'date' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'agreements': {
    title: 'Create Agreement',
    description: 'Create service agreement or vendor contract',
    submitLabel: 'Create Agreement',
    fields: [
      { name: 'agreement_name', label: 'Agreement Name', type: 'text', required: true },
      { name: 'agreement_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'service_agreement', label: 'Service Agreement' },
        { value: 'vendor_contract', label: 'Vendor Contract' },
        { value: 'procurement_agreement', label: 'Procurement Agreement' },
        { value: 'msa', label: 'Master Service Agreement' }
      ]},
      { name: 'vendor', label: 'Vendor', type: 'autocomplete', required: true },
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
      { name: 'end_date', label: 'End Date', type: 'date' },
      { name: 'value', label: 'Contract Value', type: 'currency', required: true },
      { name: 'payment_terms', label: 'Payment Terms', type: 'text' },
      { name: 'renewal_terms', label: 'Renewal Terms', type: 'text' },
      { name: 'document', label: 'Contract Document', type: 'file' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'approvals': {
    title: 'Request Approval',
    description: 'Submit approval request for procurement',
    submitLabel: 'Request Approval',
    fields: [
      { name: 'request_name', label: 'Request Name', type: 'text', required: true },
      { name: 'order', label: 'Related Order', type: 'autocomplete' },
      { name: 'amount', label: 'Amount', type: 'currency', required: true },
      { name: 'requested_by', label: 'Requested By', type: 'user', required: true },
      { name: 'approver', label: 'Approver', type: 'user', required: true },
      { name: 'justification', label: 'Justification', type: 'richtext', required: true },
      { name: 'priority', label: 'Priority', type: 'select', defaultValue: 'normal', options: [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
      ]},
      { name: 'deadline', label: 'Approval Deadline', type: 'date' },
      { name: 'attachments', label: 'Supporting Documents', type: 'file' }
    ]
  },
  'requisitions': {
    title: 'Create Requisition',
    description: 'Submit purchase requisition request',
    submitLabel: 'Create Requisition',
    fields: [
      { name: 'requisition_name', label: 'Requisition Name', type: 'text', required: true },
      { name: 'requested_by', label: 'Requested By', type: 'user', required: true },
      { name: 'project', label: 'Project', type: 'autocomplete' },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'estimated_cost', label: 'Estimated Cost', type: 'currency', required: true },
      { name: 'needed_by', label: 'Needed By', type: 'date', required: true },
      { name: 'vendor_preference', label: 'Preferred Vendor', type: 'autocomplete' },
      { name: 'justification', label: 'Business Justification', type: 'textarea', required: true },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'draft', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'approved', label: 'Approved' },
        { value: 'converted_to_po', label: 'Converted to PO' },
        { value: 'rejected', label: 'Rejected' }
      ]}
    ]
  },
  'line-items': {
    title: 'Add Line Item',
    description: 'Add line item with approved rate range',
    submitLabel: 'Add Line Item',
    fields: [
      { name: 'item_name', label: 'Item Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'labor', label: 'Labor' },
        { value: 'equipment', label: 'Equipment' },
        { value: 'materials', label: 'Materials' },
        { value: 'services', label: 'Services' }
      ]},
      { name: 'unit', label: 'Unit of Measure', type: 'text', required: true },
      { name: 'min_rate', label: 'Minimum Rate', type: 'currency', required: true },
      { name: 'max_rate', label: 'Maximum Rate', type: 'currency', required: true },
      { name: 'approved_by', label: 'Approved By', type: 'user' },
      { name: 'approval_date', label: 'Approval Date', type: 'date' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'audits': {
    title: 'Create Audit',
    description: 'Create procurement audit and compliance review',
    submitLabel: 'Create Audit',
    fields: [
      { name: 'audit_name', label: 'Audit Name', type: 'text', required: true },
      { name: 'audit_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'procurement', label: 'Procurement Audit' },
        { value: 'compliance', label: 'Compliance Review' },
        { value: 'vendor', label: 'Vendor Audit' },
        { value: 'contract', label: 'Contract Review' }
      ]},
      { name: 'auditor', label: 'Auditor', type: 'user', required: true },
      { name: 'audit_date', label: 'Audit Date', type: 'date', required: true },
      { name: 'scope', label: 'Audit Scope', type: 'richtext', required: true },
      { name: 'findings', label: 'Findings', type: 'richtext' },
      { name: 'recommendations', label: 'Recommendations', type: 'richtext' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'in_progress', options: [
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'follow_up_required', label: 'Follow-up Required' }
      ]},
      { name: 'report', label: 'Audit Report', type: 'file' }
    ]
  }
}

// Reports Module Forms
export const reportsForms: Record<string, TabFormConfig> = {
  'custom-builder': {
    title: 'Build Custom Report',
    description: 'Design a custom analytics report',
    submitLabel: 'Build Report',
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
  },
  'templates': {
    title: 'Create Template',
    description: 'Save report as reusable template',
    submitLabel: 'Create Template',
    fields: [
      { name: 'template_name', label: 'Template Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'financial', label: 'Financial' },
        { value: 'operational', label: 'Operational' },
        { value: 'compliance', label: 'Compliance' },
        { value: 'executive', label: 'Executive' },
        { value: 'custom', label: 'Custom' }
      ]},
      { name: 'template_file', label: 'Template File', type: 'file' },
      { name: 'public', label: 'Share with Team', type: 'switch' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'scheduled': {
    title: 'Schedule Report',
    description: 'Set up automated report generation',
    submitLabel: 'Schedule Report',
    fields: [
      { name: 'report_name', label: 'Report Name', type: 'text', required: true },
      { name: 'template', label: 'Template', type: 'autocomplete', required: true },
      { name: 'frequency', label: 'Frequency', type: 'select', required: true, options: [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' }
      ]},
      { name: 'delivery_time', label: 'Delivery Time', type: 'time' },
      { name: 'recipients', label: 'Recipients', type: 'multiuser', required: true },
      { name: 'format', label: 'Format', type: 'select', options: [
        { value: 'pdf', label: 'PDF' },
        { value: 'excel', label: 'Excel' },
        { value: 'csv', label: 'CSV' }
      ]},
      { name: 'active', label: 'Active', type: 'switch', defaultValue: true }
    ]
  },
  'exports': {
    title: 'Export Report',
    description: 'Export report to file',
    submitLabel: 'Export Report',
    fields: [
      { name: 'report', label: 'Report', type: 'autocomplete', required: true },
      { name: 'format', label: 'Export Format', type: 'select', required: true, options: [
        { value: 'pdf', label: 'PDF' },
        { value: 'excel', label: 'Excel (XLSX)' },
        { value: 'csv', label: 'CSV' },
        { value: 'json', label: 'JSON' }
      ]},
      { name: 'date_range_start', label: 'Start Date', type: 'date' },
      { name: 'date_range_end', label: 'End Date', type: 'date' },
      { name: 'include_charts', label: 'Include Charts', type: 'switch', defaultValue: true }
    ]
  },
  'compliance': {
    title: 'Generate Compliance Report',
    description: 'Create regulatory compliance report',
    submitLabel: 'Generate Report',
    fields: [
      { name: 'report_name', label: 'Report Name', type: 'text', required: true },
      { name: 'regulation_type', label: 'Regulation Type', type: 'select', required: true, options: [
        { value: 'osha', label: 'OSHA Compliance' },
        { value: 'tax', label: 'Tax Reporting' },
        { value: 'labor', label: 'Labor Law' },
        { value: 'environmental', label: 'Environmental' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'reporting_period_start', label: 'Period Start', type: 'date', required: true },
      { name: 'reporting_period_end', label: 'Period End', type: 'date', required: true },
      { name: 'prepared_by', label: 'Prepared By', type: 'user', required: true },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'executive': {
    title: 'Create Executive Report',
    description: 'Generate C-suite or stakeholder report',
    submitLabel: 'Create Report',
    fields: [
      { name: 'report_title', label: 'Report Title', type: 'text', required: true },
      { name: 'reporting_period', label: 'Reporting Period', type: 'select', required: true, options: [
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'annual', label: 'Annual' }
      ]},
      { name: 'period_start', label: 'Period Start', type: 'date', required: true },
      { name: 'period_end', label: 'Period End', type: 'date', required: true },
      { name: 'executive_summary', label: 'Executive Summary', type: 'richtext', required: true },
      { name: 'key_metrics', label: 'Key Metrics', type: 'richtext' },
      { name: 'prepared_for', label: 'Prepared For', type: 'multiuser' },
      { name: 'confidential', label: 'Confidential', type: 'switch', defaultValue: true }
    ]
  },
  'operational': {
    title: 'Create Operational Report',
    description: 'Generate day-to-day operations report',
    submitLabel: 'Create Report',
    fields: [
      { name: 'report_name', label: 'Report Name', type: 'text', required: true },
      { name: 'department', label: 'Department', type: 'select', required: true, options: [
        { value: 'production', label: 'Production' },
        { value: 'operations', label: 'Operations' },
        { value: 'logistics', label: 'Logistics' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'all', label: 'All Departments' }
      ]},
      { name: 'report_date', label: 'Report Date', type: 'date', required: true },
      { name: 'shift', label: 'Shift', type: 'select', options: [
        { value: 'day', label: 'Day Shift' },
        { value: 'night', label: 'Night Shift' },
        { value: 'all', label: 'All Shifts' }
      ]},
      { name: 'incidents', label: 'Incidents', type: 'textarea' },
      { name: 'completed_tasks', label: 'Completed Tasks', type: 'richtext' },
      { name: 'issues', label: 'Issues/Concerns', type: 'textarea' },
      { name: 'prepared_by', label: 'Prepared By', type: 'user', required: true }
    ]
  }
}

// Analytics Module Forms
export const analyticsForms: Record<string, TabFormConfig> = {
  'custom-views': {
    title: 'Create Dashboard View',
    description: 'Design a custom analytics dashboard',
    submitLabel: 'Create View',
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
  },
  'pivot-tables': {
    title: 'Create Pivot Table',
    description: 'Build advanced data exploration pivot table',
    submitLabel: 'Create Pivot',
    fields: [
      { name: 'pivot_name', label: 'Pivot Table Name', type: 'text', required: true },
      { name: 'data_source', label: 'Data Source', type: 'select', required: true, options: [
        { value: 'projects', label: 'Projects' },
        { value: 'finance', label: 'Finance' },
        { value: 'people', label: 'People' },
        { value: 'assets', label: 'Assets' },
        { value: 'custom', label: 'Custom Query' }
      ]},
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'rows', label: 'Row Fields', type: 'tags', required: true },
      { name: 'columns', label: 'Column Fields', type: 'tags' },
      { name: 'values', label: 'Value Fields', type: 'tags', required: true },
      { name: 'filters', label: 'Filters', type: 'richtext' },
      { name: 'shared_with', label: 'Share With', type: 'multiuser' }
    ]
  },
  'metrics-library': {
    title: 'Save Metric',
    description: 'Define and save a custom metric/KPI',
    submitLabel: 'Save Metric',
    fields: [
      { name: 'metric_name', label: 'Metric Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'metric_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'financial', label: 'Financial KPI' },
        { value: 'operational', label: 'Operational KPI' },
        { value: 'performance', label: 'Performance Metric' },
        { value: 'custom', label: 'Custom Metric' }
      ]},
      { name: 'calculation_formula', label: 'Calculation Formula', type: 'text', required: true },
      { name: 'unit', label: 'Unit of Measure', type: 'text' },
      { name: 'target_value', label: 'Target Value', type: 'number' },
      { name: 'data_source', label: 'Data Source', type: 'select' },
      { name: 'update_frequency', label: 'Update Frequency', type: 'select', options: [
        { value: 'realtime', label: 'Real-time' },
        { value: 'hourly', label: 'Hourly' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' }
      ]},
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'data-sources': {
    title: 'Connect Data Source',
    description: 'Add external data source for analytics',
    submitLabel: 'Connect Source',
    fields: [
      { name: 'source_name', label: 'Data Source Name', type: 'text', required: true },
      { name: 'source_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'database', label: 'Database' },
        { value: 'api', label: 'API' },
        { value: 'file', label: 'File Upload' },
        { value: 'integration', label: 'Third-party Integration' }
      ]},
      { name: 'connection_string', label: 'Connection Details', type: 'textarea' },
      { name: 'authentication', label: 'Authentication', type: 'text' },
      { name: 'sync_frequency', label: 'Sync Frequency', type: 'select', options: [
        { value: 'realtime', label: 'Real-time' },
        { value: 'hourly', label: 'Hourly' },
        { value: 'daily', label: 'Daily' },
        { value: 'manual', label: 'Manual' }
      ]},
      { name: 'active', label: 'Active', type: 'switch', defaultValue: true }
    ]
  }
}

// Insights Module Forms
export const insightsForms: Record<string, TabFormConfig> = {
  'objectives': {
    title: 'Set Objective',
    description: 'Define a new strategic objective',
    submitLabel: 'Set Objective',
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
    title: 'Add Key Result',
    description: 'Define a measurable key result for an objective',
    submitLabel: 'Add Key Result',
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
  },
  'priorities': {
    title: 'Set Priority',
    description: 'Define strategic priority or initiative',
    submitLabel: 'Set Priority',
    fields: [
      { name: 'priority_name', label: 'Priority Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'priority_level', label: 'Priority Level', type: 'select', required: true, options: [
        { value: 'critical', label: 'Critical' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' }
      ]},
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'strategic', label: 'Strategic' },
        { value: 'operational', label: 'Operational' },
        { value: 'tactical', label: 'Tactical' },
        { value: 'emergency', label: 'Emergency' }
      ]},
      { name: 'owner', label: 'Owner', type: 'user', required: true },
      { name: 'stakeholders', label: 'Stakeholders', type: 'multiuser' },
      { name: 'target_date', label: 'Target Date', type: 'date', required: true },
      { name: 'budget', label: 'Budget Allocation', type: 'currency' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'active', options: [
        { value: 'proposed', label: 'Proposed' },
        { value: 'active', label: 'Active' },
        { value: 'on_hold', label: 'On Hold' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]},
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'reviews': {
    title: 'Create Review',
    description: 'Schedule performance or strategic review',
    submitLabel: 'Create Review',
    fields: [
      { name: 'review_name', label: 'Review Name', type: 'text', required: true },
      { name: 'review_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'performance', label: 'Performance Review' },
        { value: 'strategic', label: 'Strategic Review' },
        { value: 'quarterly', label: 'Quarterly Review' },
        { value: 'annual', label: 'Annual Review' },
        { value: 'project', label: 'Project Review' }
      ]},
      { name: 'objective', label: 'Related Objective', type: 'autocomplete' },
      { name: 'review_date', label: 'Review Date', type: 'date', required: true },
      { name: 'reviewer', label: 'Reviewer', type: 'user', required: true },
      { name: 'reviewee', label: 'Reviewee/Subject', type: 'user' },
      { name: 'participants', label: 'Participants', type: 'multiuser' },
      { name: 'agenda', label: 'Agenda', type: 'richtext', required: true },
      { name: 'notes', label: 'Notes', type: 'textarea' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'scheduled', options: [
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]}
    ]
  },
  'success-metrics': {
    title: 'Define Success Metric',
    description: 'Create measurable success criteria',
    submitLabel: 'Define Metric',
    fields: [
      { name: 'metric_name', label: 'Metric Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'objective', label: 'Related Objective', type: 'autocomplete', required: true },
      { name: 'metric_category', label: 'Category', type: 'select', required: true, options: [
        { value: 'financial', label: 'Financial' },
        { value: 'operational', label: 'Operational' },
        { value: 'customer', label: 'Customer Satisfaction' },
        { value: 'growth', label: 'Growth' },
        { value: 'quality', label: 'Quality' }
      ]},
      { name: 'measurement_type', label: 'Measurement Type', type: 'select', required: true, options: [
        { value: 'number', label: 'Number' },
        { value: 'percentage', label: 'Percentage' },
        { value: 'currency', label: 'Currency' },
        { value: 'ratio', label: 'Ratio' },
        { value: 'boolean', label: 'Yes/No' }
      ]},
      { name: 'baseline', label: 'Baseline Value', type: 'number', required: true },
      { name: 'target', label: 'Target Value', type: 'number', required: true },
      { name: 'current', label: 'Current Value', type: 'number' },
      { name: 'measurement_frequency', label: 'Measurement Frequency', type: 'select', options: [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' }
      ]},
      { name: 'owner', label: 'Metric Owner', type: 'user', required: true },
      { name: 'unit', label: 'Unit of Measure', type: 'text' }
    ]
  }
}

// Files Module Forms
export const filesForms: Record<string, TabFormConfig> = {
  'all-documents': {
    title: 'Upload Document',
    description: 'Upload and categorize a document',
    submitLabel: 'Upload Document',
    fields: [
      { name: 'document_name', label: 'Document Name', type: 'text', required: true },
      { name: 'file', label: 'File', type: 'file', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'contract', label: 'Contract' },
        { value: 'technical', label: 'Technical' },
        { value: 'administrative', label: 'Administrative' },
        { value: 'legal', label: 'Legal' },
        { value: 'financial', label: 'Financial' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'project', label: 'Related Project', type: 'autocomplete' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'confidential', label: 'Confidential', type: 'switch' },
      { name: 'expiration_date', label: 'Expiration Date', type: 'date' },
      { name: 'shared_with', label: 'Share With', type: 'multiuser' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'contracts': {
    title: 'Add Contract',
    description: 'Upload and track contract document',
    submitLabel: 'Add Contract',
    fields: [
      { name: 'contract_name', label: 'Contract Name', type: 'text', required: true },
      { name: 'contract_file', label: 'Contract File', type: 'file', required: true },
      { name: 'contract_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'employment', label: 'Employment' },
        { value: 'vendor', label: 'Vendor' },
        { value: 'client', label: 'Client' },
        { value: 'nda', label: 'NDA' },
        { value: 'service', label: 'Service Agreement' },
        { value: 'lease', label: 'Lease' }
      ]},
      { name: 'party_a', label: 'Party A', type: 'text', required: true },
      { name: 'party_b', label: 'Party B', type: 'text', required: true },
      { name: 'contract_value', label: 'Contract Value', type: 'currency' },
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
      { name: 'end_date', label: 'End Date', type: 'date' },
      { name: 'renewal_date', label: 'Renewal Date', type: 'date' },
      { name: 'auto_renew', label: 'Auto-Renew', type: 'switch' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'active', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'active', label: 'Active' },
        { value: 'expired', label: 'Expired' },
        { value: 'terminated', label: 'Terminated' }
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'riders': {
    title: 'Add Rider',
    description: 'Add technical or hospitality rider document',
    submitLabel: 'Add Rider',
    fields: [
      { name: 'rider_name', label: 'Rider Name', type: 'text', required: true },
      { name: 'rider_file', label: 'Rider File', type: 'file', required: true },
      { name: 'rider_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'technical', label: 'Technical Rider' },
        { value: 'hospitality', label: 'Hospitality Rider' },
        { value: 'stage_plot', label: 'Stage Plot' },
        { value: 'input_list', label: 'Input List' }
      ]},
      { name: 'production', label: 'Production', type: 'autocomplete', required: true },
      { name: 'artist_act', label: 'Artist/Act', type: 'text' },
      { name: 'version', label: 'Version', type: 'text' },
      { name: 'effective_date', label: 'Effective Date', type: 'date' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'tech-specs': {
    title: 'Add Tech Spec',
    description: 'Upload technical specification document',
    submitLabel: 'Add Tech Spec',
    fields: [
      { name: 'spec_name', label: 'Specification Name', type: 'text', required: true },
      { name: 'spec_file', label: 'Spec File', type: 'file', required: true },
      { name: 'spec_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'equipment', label: 'Equipment Spec' },
        { value: 'venue', label: 'Venue Spec' },
        { value: 'system', label: 'System Spec' },
        { value: 'safety', label: 'Safety Spec' },
        { value: 'rigging', label: 'Rigging Spec' }
      ]},
      { name: 'equipment_venue', label: 'Equipment/Venue', type: 'autocomplete' },
      { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { name: 'model', label: 'Model', type: 'text' },
      { name: 'version', label: 'Version/Revision', type: 'text' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'call-sheets': {
    title: 'Create Call Sheet',
    description: 'Generate production call sheet',
    submitLabel: 'Create Call Sheet',
    fields: [
      { name: 'call_sheet_name', label: 'Call Sheet Name', type: 'text', required: true },
      { name: 'production', label: 'Production', type: 'autocomplete', required: true },
      { name: 'call_date', label: 'Call Date', type: 'date', required: true },
      { name: 'call_time', label: 'Call Time', type: 'time', required: true },
      { name: 'location', label: 'Location', type: 'location', required: true },
      { name: 'crew', label: 'Crew Members', type: 'multiuser', required: true },
      { name: 'schedule', label: 'Schedule', type: 'richtext', required: true },
      { name: 'notes', label: 'Special Notes', type: 'textarea' },
      { name: 'weather', label: 'Weather Conditions', type: 'text' },
      { name: 'emergency_contacts', label: 'Emergency Contacts', type: 'richtext' },
      { name: 'parking_info', label: 'Parking Information', type: 'textarea' }
    ]
  },
  'insurance-permits': {
    title: 'Add Insurance/Permit',
    description: 'Upload insurance certificate or permit',
    submitLabel: 'Add Document',
    fields: [
      { name: 'document_name', label: 'Document Name', type: 'text', required: true },
      { name: 'document_file', label: 'File', type: 'file', required: true },
      { name: 'document_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'insurance_certificate', label: 'Insurance Certificate' },
        { value: 'liability', label: 'Liability Insurance' },
        { value: 'filming_permit', label: 'Filming Permit' },
        { value: 'event_permit', label: 'Event Permit' },
        { value: 'fire_permit', label: 'Fire Safety Permit' },
        { value: 'noise_permit', label: 'Noise Permit' }
      ]},
      { name: 'policy_number', label: 'Policy/Permit Number', type: 'text', required: true },
      { name: 'issuing_authority', label: 'Issuing Authority', type: 'text', required: true },
      { name: 'issue_date', label: 'Issue Date', type: 'date', required: true },
      { name: 'expiration_date', label: 'Expiration Date', type: 'date', required: true },
      { name: 'coverage_amount', label: 'Coverage Amount', type: 'currency' },
      { name: 'production', label: 'Related Production', type: 'autocomplete' },
      { name: 'location', label: 'Related Location', type: 'location' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'media-assets': {
    title: 'Upload Media Asset',
    description: 'Upload photo, video, or audio file',
    submitLabel: 'Upload Media',
    fields: [
      { name: 'asset_name', label: 'Asset Name', type: 'text', required: true },
      { name: 'media_file', label: 'Media File', type: 'file', required: true },
      { name: 'media_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'photo', label: 'Photo' },
        { value: 'video', label: 'Video' },
        { value: 'audio', label: 'Audio' },
        { value: 'graphic', label: 'Graphic/Design' }
      ]},
      { name: 'production', label: 'Production', type: 'autocomplete' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'photographer_creator', label: 'Photographer/Creator', type: 'text' },
      { name: 'capture_date', label: 'Capture Date', type: 'date' },
      { name: 'usage_rights', label: 'Usage Rights', type: 'select', options: [
        { value: 'full', label: 'Full Rights' },
        { value: 'limited', label: 'Limited Use' },
        { value: 'promotional', label: 'Promotional Only' },
        { value: 'internal', label: 'Internal Only' }
      ]},
      { name: 'copyright', label: 'Copyright Information', type: 'text' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'production-reports': {
    title: 'Create Production Report',
    description: 'Generate daily production report',
    submitLabel: 'Create Report',
    fields: [
      { name: 'report_name', label: 'Report Name', type: 'text', required: true },
      { name: 'production', label: 'Production', type: 'autocomplete', required: true },
      { name: 'report_date', label: 'Report Date', type: 'date', required: true },
      { name: 'shift', label: 'Shift', type: 'select', options: [
        { value: 'day', label: 'Day' },
        { value: 'night', label: 'Night' },
        { value: 'full_day', label: 'Full Day' }
      ]},
      { name: 'crew_count', label: 'Crew Count', type: 'number' },
      { name: 'hours_worked', label: 'Total Hours Worked', type: 'number' },
      { name: 'scenes_completed', label: 'Scenes/Tasks Completed', type: 'richtext' },
      { name: 'equipment_used', label: 'Equipment Used', type: 'richtext' },
      { name: 'incidents', label: 'Incidents/Issues', type: 'textarea' },
      { name: 'notes', label: 'Notes', type: 'richtext' },
      { name: 'prepared_by', label: 'Prepared By', type: 'user', required: true },
      { name: 'attachments', label: 'Attachments', type: 'file' }
    ]
  },
  'shared': {
    title: 'Share Document',
    description: 'Share document with team members',
    submitLabel: 'Share Document',
    fields: [
      { name: 'document', label: 'Document', type: 'autocomplete', required: true },
      { name: 'share_with', label: 'Share With', type: 'multiuser', required: true },
      { name: 'permission_level', label: 'Permission Level', type: 'select', required: true, options: [
        { value: 'view', label: 'View Only' },
        { value: 'comment', label: 'Can Comment' },
        { value: 'edit', label: 'Can Edit' },
        { value: 'admin', label: 'Admin' }
      ]},
      { name: 'expiration', label: 'Access Expires', type: 'date' },
      { name: 'notify', label: 'Notify Recipients', type: 'switch', defaultValue: true },
      { name: 'message', label: 'Message', type: 'textarea' }
    ]
  },
  'archive': {
    title: 'Archive Document',
    description: 'Move document to archive',
    submitLabel: 'Archive Document',
    fields: [
      { name: 'document', label: 'Document', type: 'autocomplete', required: true },
      { name: 'archive_reason', label: 'Reason', type: 'select', required: true, options: [
        { value: 'completed', label: 'Project Completed' },
        { value: 'expired', label: 'Expired' },
        { value: 'obsolete', label: 'Obsolete' },
        { value: 'retention', label: 'Retention Policy' }
      ]},
      { name: 'retention_period', label: 'Retention Period', type: 'select', options: [
        { value: '1_year', label: '1 Year' },
        { value: '3_years', label: '3 Years' },
        { value: '7_years', label: '7 Years' },
        { value: 'permanent', label: 'Permanent' }
      ]},
      { name: 'delete_after', label: 'Auto-Delete After Retention', type: 'switch' },
      { name: 'notes', label: 'Archive Notes', type: 'textarea' }
    ]
  }
}

// Resources Module Forms
export const resourcesForms: Record<string, TabFormConfig> = {
  'library': {
    title: 'Add Resource',
    description: 'Add resource to knowledge library',
    submitLabel: 'Add Resource',
    fields: [
      { name: 'resource_name', label: 'Resource Name', type: 'text', required: true },
      { name: 'resource_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'article', label: 'Article' },
        { value: 'video', label: 'Video' },
        { value: 'tutorial', label: 'Tutorial' },
        { value: 'template', label: 'Template' },
        { value: 'tool', label: 'Tool' },
        { value: 'reference', label: 'Reference Material' }
      ]},
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'technical', label: 'Technical' },
        { value: 'creative', label: 'Creative' },
        { value: 'business', label: 'Business' },
        { value: 'safety', label: 'Safety' },
        { value: 'general', label: 'General' }
      ]},
      { name: 'file', label: 'File/Attachment', type: 'file' },
      { name: 'url', label: 'External URL', type: 'url' },
      { name: 'author', label: 'Author/Creator', type: 'text' },
      { name: 'public', label: 'Public Resource', type: 'switch', defaultValue: true },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'guides': {
    title: 'Create Guide',
    description: 'Create step-by-step guide or manual',
    submitLabel: 'Create Guide',
    fields: [
      { name: 'guide_name', label: 'Guide Name', type: 'text', required: true },
      { name: 'guide_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'how_to', label: 'How-To Guide' },
        { value: 'best_practices', label: 'Best Practices' },
        { value: 'troubleshooting', label: 'Troubleshooting' },
        { value: 'setup', label: 'Setup Guide' },
        { value: 'user_manual', label: 'User Manual' }
      ]},
      { name: 'description', label: 'Brief Description', type: 'textarea', required: true },
      { name: 'content', label: 'Guide Content', type: 'richtext', required: true },
      { name: 'difficulty_level', label: 'Difficulty Level', type: 'select', options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'expert', label: 'Expert' }
      ]},
      { name: 'estimated_time', label: 'Estimated Time', type: 'text' },
      { name: 'author', label: 'Author', type: 'user', required: true },
      { name: 'attachments', label: 'Attachments', type: 'file' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'courses': {
    title: 'Create Course',
    description: 'Design educational course or curriculum',
    submitLabel: 'Create Course',
    fields: [
      { name: 'course_name', label: 'Course Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'course_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'online', label: 'Online' },
        { value: 'in_person', label: 'In-Person' },
        { value: 'hybrid', label: 'Hybrid' },
        { value: 'self_paced', label: 'Self-Paced' }
      ]},
      { name: 'instructor', label: 'Instructor', type: 'user', required: true },
      { name: 'duration', label: 'Duration', type: 'text', required: true },
      { name: 'max_participants', label: 'Max Participants', type: 'number' },
      { name: 'start_date', label: 'Start Date', type: 'date' },
      { name: 'end_date', label: 'End Date', type: 'date' },
      { name: 'prerequisites', label: 'Prerequisites', type: 'textarea' },
      { name: 'learning_objectives', label: 'Learning Objectives', type: 'richtext', required: true },
      { name: 'materials', label: 'Course Materials', type: 'file' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'trainings': {
    title: 'Schedule Training',
    description: 'Schedule training session or workshop',
    submitLabel: 'Schedule Training',
    fields: [
      { name: 'training_name', label: 'Training Name', type: 'text', required: true },
      { name: 'training_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'safety', label: 'Safety Training' },
        { value: 'equipment', label: 'Equipment Training' },
        { value: 'software', label: 'Software Training' },
        { value: 'compliance', label: 'Compliance Training' },
        { value: 'skills', label: 'Skills Development' }
      ]},
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'trainer', label: 'Trainer', type: 'user', required: true },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'start_time', label: 'Start Time', type: 'time', required: true },
      { name: 'duration', label: 'Duration (hours)', type: 'number', required: true },
      { name: 'location', label: 'Location', type: 'location', required: true },
      { name: 'max_attendees', label: 'Max Attendees', type: 'number' },
      { name: 'required_for', label: 'Required For', type: 'multiuser' },
      { name: 'certification', label: 'Provides Certification', type: 'switch' },
      { name: 'materials', label: 'Training Materials', type: 'file' }
    ]
  },
  'grants': {
    title: 'Add Grant',
    description: 'Add grant opportunity or funding source',
    submitLabel: 'Add Grant',
    fields: [
      { name: 'grant_name', label: 'Grant Name', type: 'text', required: true },
      { name: 'funder', label: 'Funding Organization', type: 'text', required: true },
      { name: 'grant_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'project', label: 'Project Grant' },
        { value: 'operating', label: 'Operating Grant' },
        { value: 'capacity', label: 'Capacity Building' },
        { value: 'emergency', label: 'Emergency Relief' },
        { value: 'research', label: 'Research Grant' }
      ]},
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'amount', label: 'Grant Amount', type: 'currency', required: true },
      { name: 'application_deadline', label: 'Application Deadline', type: 'date', required: true },
      { name: 'eligibility', label: 'Eligibility Criteria', type: 'richtext', required: true },
      { name: 'application_url', label: 'Application URL', type: 'url' },
      { name: 'contact_person', label: 'Contact Person', type: 'text' },
      { name: 'contact_email', label: 'Contact Email', type: 'email' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'publications': {
    title: 'Add Publication',
    description: 'Add industry publication or article',
    submitLabel: 'Add Publication',
    fields: [
      { name: 'publication_name', label: 'Publication Name', type: 'text', required: true },
      { name: 'publication_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'article', label: 'Article' },
        { value: 'journal', label: 'Journal' },
        { value: 'whitepaper', label: 'White Paper' },
        { value: 'case_study', label: 'Case Study' },
        { value: 'report', label: 'Report' }
      ]},
      { name: 'author', label: 'Author(s)', type: 'text', required: true },
      { name: 'publisher', label: 'Publisher', type: 'text' },
      { name: 'publication_date', label: 'Publication Date', type: 'date', required: true },
      { name: 'abstract', label: 'Abstract/Summary', type: 'richtext', required: true },
      { name: 'url', label: 'URL', type: 'url' },
      { name: 'doi', label: 'DOI', type: 'text' },
      { name: 'file', label: 'PDF/File', type: 'file' },
      { name: 'keywords', label: 'Keywords', type: 'tags' }
    ]
  },
  'glossary': {
    title: 'Add Term',
    description: 'Add term to industry glossary',
    submitLabel: 'Add Term',
    fields: [
      { name: 'term', label: 'Term', type: 'text', required: true },
      { name: 'definition', label: 'Definition', type: 'richtext', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'technical', label: 'Technical' },
        { value: 'business', label: 'Business' },
        { value: 'creative', label: 'Creative' },
        { value: 'production', label: 'Production' },
        { value: 'general', label: 'General' }
      ]},
      { name: 'synonyms', label: 'Synonyms', type: 'text' },
      { name: 'related_terms', label: 'Related Terms', type: 'tags' },
      { name: 'usage_example', label: 'Usage Example', type: 'textarea' },
      { name: 'acronym', label: 'Acronym/Abbreviation', type: 'text' },
      { name: 'contributed_by', label: 'Contributed By', type: 'user' }
    ]
  },
  'troubleshooting': {
    title: 'Add Solution',
    description: 'Add troubleshooting solution or fix',
    submitLabel: 'Add Solution',
    fields: [
      { name: 'problem_title', label: 'Problem Title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'equipment', label: 'Equipment Issue' },
        { value: 'software', label: 'Software Issue' },
        { value: 'network', label: 'Network/Connectivity' },
        { value: 'audio', label: 'Audio Issue' },
        { value: 'video', label: 'Video Issue' },
        { value: 'other', label: 'Other' }
      ]},
      { name: 'problem_description', label: 'Problem Description', type: 'richtext', required: true },
      { name: 'solution', label: 'Solution', type: 'richtext', required: true },
      { name: 'difficulty', label: 'Difficulty', type: 'select', options: [
        { value: 'easy', label: 'Easy' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'difficult', label: 'Difficult' }
      ]},
      { name: 'time_required', label: 'Time Required', type: 'text' },
      { name: 'tools_needed', label: 'Tools/Materials Needed', type: 'textarea' },
      { name: 'preventive_measures', label: 'Preventive Measures', type: 'richtext' },
      { name: 'contributed_by', label: 'Contributed By', type: 'user', required: true },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  }
}

// Community Module Forms
export const communityForms: Record<string, TabFormConfig> = {
  'news': {
    title: 'Post News',
    description: 'Share news or announcement with community',
    submitLabel: 'Post News',
    fields: [
      { name: 'headline', label: 'Headline', type: 'text', required: true },
      { name: 'content', label: 'Content', type: 'richtext', required: true },
      { name: 'news_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'announcement', label: 'Announcement' },
        { value: 'update', label: 'Update' },
        { value: 'event', label: 'Event' },
        { value: 'achievement', label: 'Achievement' },
        { value: 'opportunity', label: 'Opportunity' }
      ]},
      { name: 'featured_image', label: 'Featured Image', type: 'file' },
      { name: 'publish_date', label: 'Publish Date', type: 'datetime', required: true },
      { name: 'expiration_date', label: 'Expiration Date', type: 'datetime' },
      { name: 'author', label: 'Author', type: 'user', required: true },
      { name: 'featured', label: 'Featured Post', type: 'switch' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'showcase': {
    title: 'Add Showcase',
    description: 'Share project or work in community showcase',
    submitLabel: 'Add to Showcase',
    fields: [
      { name: 'project_name', label: 'Project Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'project_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'production', label: 'Production' },
        { value: 'design', label: 'Design' },
        { value: 'technical', label: 'Technical Innovation' },
        { value: 'creative', label: 'Creative Work' },
        { value: 'collaboration', label: 'Collaboration' }
      ]},
      { name: 'creator', label: 'Creator/Team', type: 'multiuser', required: true },
      { name: 'completion_date', label: 'Completion Date', type: 'date' },
      { name: 'media', label: 'Photos/Videos', type: 'file', required: true },
      { name: 'project_url', label: 'Project URL', type: 'url' },
      { name: 'awards', label: 'Awards/Recognition', type: 'textarea' },
      { name: 'public', label: 'Public Showcase', type: 'switch', defaultValue: true },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'connections': {
    title: 'Add Connection',
    description: 'Connect with industry professionals',
    submitLabel: 'Send Connection Request',
    fields: [
      { name: 'connection', label: 'Connect With', type: 'user', required: true },
      { name: 'connection_type', label: 'Connection Type', type: 'select', required: true, options: [
        { value: 'colleague', label: 'Colleague' },
        { value: 'collaborator', label: 'Collaborator' },
        { value: 'mentor', label: 'Mentor' },
        { value: 'client', label: 'Client' },
        { value: 'vendor', label: 'Vendor' }
      ]},
      { name: 'message', label: 'Personal Message', type: 'textarea', required: true },
      { name: 'shared_interests', label: 'Shared Interests', type: 'tags' }
    ]
  },
  'studios': {
    title: 'List Studio',
    description: 'Add studio or workspace to directory',
    submitLabel: 'List Studio',
    fields: [
      { name: 'studio_name', label: 'Studio Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'studio_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'recording', label: 'Recording Studio' },
        { value: 'rehearsal', label: 'Rehearsal Space' },
        { value: 'production', label: 'Production Facility' },
        { value: 'coworking', label: 'Coworking Space' },
        { value: 'workshop', label: 'Workshop' }
      ]},
      { name: 'location', label: 'Location', type: 'location', required: true },
      { name: 'capacity', label: 'Capacity', type: 'number' },
      { name: 'hourly_rate', label: 'Hourly Rate', type: 'currency' },
      { name: 'day_rate', label: 'Day Rate', type: 'currency' },
      { name: 'amenities', label: 'Amenities', type: 'tags', required: true },
      { name: 'equipment', label: 'Available Equipment', type: 'richtext' },
      { name: 'photos', label: 'Photos', type: 'file', required: true },
      { name: 'contact_email', label: 'Contact Email', type: 'email', required: true },
      { name: 'contact_phone', label: 'Contact Phone', type: 'phone' },
      { name: 'website', label: 'Website', type: 'url' }
    ]
  },
  'events': {
    title: 'Create Community Event',
    description: 'Organize community meetup or event',
    submitLabel: 'Create Event',
    fields: [
      { name: 'event_name', label: 'Event Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'event_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'meetup', label: 'Meetup' },
        { value: 'workshop', label: 'Workshop' },
        { value: 'networking', label: 'Networking' },
        { value: 'showcase', label: 'Showcase' },
        { value: 'conference', label: 'Conference' }
      ]},
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'start_time', label: 'Start Time', type: 'time', required: true },
      { name: 'end_time', label: 'End Time', type: 'time' },
      { name: 'location', label: 'Location', type: 'location', required: true },
      { name: 'organizer', label: 'Organizer', type: 'user', required: true },
      { name: 'max_attendees', label: 'Max Attendees', type: 'number' },
      { name: 'registration_required', label: 'Registration Required', type: 'switch' },
      { name: 'cost', label: 'Cost', type: 'currency' },
      { name: 'event_image', label: 'Event Image', type: 'file' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'discussions': {
    title: 'Start Discussion',
    description: 'Start community discussion or forum topic',
    submitLabel: 'Start Discussion',
    fields: [
      { name: 'title', label: 'Discussion Title', type: 'text', required: true },
      { name: 'content', label: 'Content', type: 'richtext', required: true },
      { name: 'category', label: 'Category', type: 'select', required: true, options: [
        { value: 'general', label: 'General Discussion' },
        { value: 'technical', label: 'Technical Help' },
        { value: 'creative', label: 'Creative Ideas' },
        { value: 'career', label: 'Career Advice' },
        { value: 'business', label: 'Business' },
        { value: 'announcements', label: 'Announcements' }
      ]},
      { name: 'poll_question', label: 'Poll Question (optional)', type: 'text' },
      { name: 'poll_options', label: 'Poll Options (comma-separated)', type: 'textarea' },
      { name: 'attachments', label: 'Attachments', type: 'file' },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  },
  'competitions': {
    title: 'Create Competition',
    description: 'Launch community challenge or competition',
    submitLabel: 'Create Competition',
    fields: [
      { name: 'competition_name', label: 'Competition Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'competition_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'design', label: 'Design Challenge' },
        { value: 'technical', label: 'Technical Challenge' },
        { value: 'creative', label: 'Creative Contest' },
        { value: 'hackathon', label: 'Hackathon' },
        { value: 'showcase', label: 'Showcase Competition' }
      ]},
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
      { name: 'end_date', label: 'End Date', type: 'date', required: true },
      { name: 'submission_deadline', label: 'Submission Deadline', type: 'datetime', required: true },
      { name: 'rules', label: 'Rules & Guidelines', type: 'richtext', required: true },
      { name: 'eligibility', label: 'Eligibility Criteria', type: 'richtext', required: true },
      { name: 'prizes', label: 'Prizes', type: 'richtext', required: true },
      { name: 'judges', label: 'Judges', type: 'multiuser' },
      { name: 'entry_fee', label: 'Entry Fee', type: 'currency' },
      { name: 'max_participants', label: 'Max Participants', type: 'number' },
      { name: 'organizer', label: 'Organizer', type: 'user', required: true },
      { name: 'tags', label: 'Tags', type: 'tags' }
    ]
  }
}

// Jobs Module Forms
export const jobsForms: Record<string, TabFormConfig> = {
  'active': {
    title: 'Add Active Job',
    description: 'Add currently active job or contract',
    submitLabel: 'Add Job',
    fields: [
      { name: 'job_title', label: 'Job Title', type: 'text', required: true },
      { name: 'job_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'full_time', label: 'Full-time' },
        { value: 'part_time', label: 'Part-time' },
        { value: 'contract', label: 'Contract' },
        { value: 'freelance', label: 'Freelance' },
        { value: 'gig', label: 'Gig/Project' }
      ]},
      { name: 'client_company', label: 'Client/Company', type: 'autocomplete', required: true },
      { name: 'description', label: 'Description', type: 'richtext', required: true },
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
      { name: 'end_date', label: 'End Date', type: 'date' },
      { name: 'rate', label: 'Rate', type: 'currency', required: true },
      { name: 'rate_type', label: 'Rate Type', type: 'select', required: true, options: [
        { value: 'hourly', label: 'Hourly' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'project', label: 'Project-based' }
      ]},
      { name: 'location', label: 'Location', type: 'location' },
      { name: 'remote', label: 'Remote Work', type: 'switch' },
      { name: 'contact_person', label: 'Contact Person', type: 'text' },
      { name: 'contact_email', label: 'Contact Email', type: 'email' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'pipeline': {
    title: 'Add to Pipeline',
    description: 'Add job opportunity to pipeline',
    submitLabel: 'Add to Pipeline',
    fields: [
      { name: 'job_title', label: 'Job Title', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'autocomplete', required: true },
      { name: 'description', label: 'Description', type: 'richtext' },
      { name: 'stage', label: 'Pipeline Stage', type: 'select', required: true, options: [
        { value: 'lead', label: 'Lead' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'interview', label: 'Interview Scheduled' },
        { value: 'negotiation', label: 'Negotiation' },
        { value: 'pending_decision', label: 'Pending Decision' }
      ]},
      { name: 'priority', label: 'Priority', type: 'select', defaultValue: 'medium', options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
      ]},
      { name: 'estimated_value', label: 'Estimated Value', type: 'currency' },
      { name: 'probability', label: 'Win Probability %', type: 'number' },
      { name: 'expected_start', label: 'Expected Start Date', type: 'date' },
      { name: 'contact_person', label: 'Contact Person', type: 'text' },
      { name: 'next_action', label: 'Next Action', type: 'text' },
      { name: 'next_action_date', label: 'Next Action Date', type: 'date' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'offers': {
    title: 'Create Offer',
    description: 'Submit job offer or proposal',
    submitLabel: 'Submit Offer',
    fields: [
      { name: 'job_title', label: 'Position/Job Title', type: 'text', required: true },
      { name: 'client', label: 'Client', type: 'autocomplete', required: true },
      { name: 'offer_date', label: 'Offer Date', type: 'date', required: true },
      { name: 'proposed_rate', label: 'Proposed Rate', type: 'currency', required: true },
      { name: 'rate_type', label: 'Rate Type', type: 'select', required: true, options: [
        { value: 'hourly', label: 'Hourly' },
        { value: 'daily', label: 'Daily' },
        { value: 'project', label: 'Project-based' },
        { value: 'salary', label: 'Annual Salary' }
      ]},
      { name: 'start_date', label: 'Proposed Start Date', type: 'date', required: true },
      { name: 'duration', label: 'Duration', type: 'text' },
      { name: 'scope_of_work', label: 'Scope of Work', type: 'richtext', required: true },
      { name: 'terms', label: 'Terms & Conditions', type: 'richtext' },
      { name: 'proposal_document', label: 'Proposal Document', type: 'file' },
      { name: 'valid_until', label: 'Offer Valid Until', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'pending', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'pending', label: 'Pending' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'declined', label: 'Declined' },
        { value: 'negotiating', label: 'Negotiating' }
      ]}
    ]
  },
  'shortlists': {
    title: 'Add to Shortlist',
    description: 'Add job or client to shortlist',
    submitLabel: 'Add to Shortlist',
    fields: [
      { name: 'item_name', label: 'Name', type: 'text', required: true },
      { name: 'item_type', label: 'Type', type: 'select', required: true, options: [
        { value: 'job', label: 'Job Opportunity' },
        { value: 'client', label: 'Client' },
        { value: 'project', label: 'Project' },
        { value: 'collaboration', label: 'Collaboration' }
      ]},
      { name: 'company', label: 'Company', type: 'autocomplete' },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'rating', label: 'Rating (1-5)', type: 'number' },
      { name: 'pros', label: 'Pros', type: 'textarea' },
      { name: 'cons', label: 'Cons', type: 'textarea' },
      { name: 'decision_date', label: 'Decision Deadline', type: 'date' },
      { name: 'notes', label: 'Notes', type: 'textarea' }
    ]
  },
  'rfps': {
    title: 'Submit RFP',
    description: 'Submit request for proposal response',
    submitLabel: 'Submit RFP',
    fields: [
      { name: 'rfp_title', label: 'RFP Title', type: 'text', required: true },
      { name: 'client', label: 'Client', type: 'autocomplete', required: true },
      { name: 'rfp_number', label: 'RFP Number', type: 'text' },
      { name: 'description', label: 'Project Description', type: 'richtext', required: true },
      { name: 'submission_date', label: 'Submission Date', type: 'date', required: true },
      { name: 'response_due', label: 'Response Due Date', type: 'date', required: true },
      { name: 'estimated_budget', label: 'Estimated Budget', type: 'currency', required: true },
      { name: 'project_duration', label: 'Project Duration', type: 'text' },
      { name: 'requirements', label: 'Requirements', type: 'richtext', required: true },
      { name: 'our_proposal', label: 'Our Proposal', type: 'richtext', required: true },
      { name: 'proposal_document', label: 'Proposal Document', type: 'file' },
      { name: 'team_members', label: 'Proposed Team', type: 'multiuser' },
      { name: 'status', label: 'Status', type: 'select', defaultValue: 'draft', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'under_review', label: 'Under Review' },
        { value: 'shortlisted', label: 'Shortlisted' },
        { value: 'won', label: 'Won' },
        { value: 'lost', label: 'Lost' }
      ]}
    ]
  },
  'completed': {
    title: 'Mark Complete',
    description: 'Archive completed job or contract',
    submitLabel: 'Mark Complete',
    fields: [
      { name: 'job', label: 'Job', type: 'autocomplete', required: true },
      { name: 'completion_date', label: 'Completion Date', type: 'date', required: true },
      { name: 'final_amount', label: 'Final Amount Earned', type: 'currency', required: true },
      { name: 'total_hours', label: 'Total Hours Worked', type: 'number' },
      { name: 'performance_rating', label: 'Self-Rating (1-5)', type: 'number' },
      { name: 'client_feedback', label: 'Client Feedback', type: 'richtext' },
      { name: 'lessons_learned', label: 'Lessons Learned', type: 'richtext' },
      { name: 'would_work_again', label: 'Would Work with Client Again', type: 'switch', defaultValue: true },
      { name: 'portfolio_worthy', label: 'Add to Portfolio', type: 'switch' },
      { name: 'final_deliverables', label: 'Final Deliverables', type: 'file' },
      { name: 'notes', label: 'Final Notes', type: 'textarea' }
    ]
  },
  'archived': {
    title: 'Archive Job',
    description: 'Move job to archive',
    submitLabel: 'Archive Job',
    fields: [
      { name: 'job', label: 'Job', type: 'autocomplete', required: true },
      { name: 'archive_reason', label: 'Archive Reason', type: 'select', required: true, options: [
        { value: 'completed', label: 'Completed Successfully' },
        { value: 'declined', label: 'Declined Offer' },
        { value: 'lost', label: 'Lost Opportunity' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'no_longer_relevant', label: 'No Longer Relevant' }
      ]},
      { name: 'archive_date', label: 'Archive Date', type: 'date', required: true },
      { name: 'final_notes', label: 'Final Notes', type: 'textarea' }
    ]
  }
}
