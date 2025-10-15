# Locations BIM - Quick Reference

## Quick Start

### Import BIM Model
```sql
INSERT INTO location_bim_models (
    workspace_id, location_id, name, model_type,
    file_url, ifc_schema, version, lod
) VALUES (
    'workspace-uuid', 'location-uuid',
    'Building A', 'ifc',
    'https://storage.../model.ifc', 'IFC4', '1.0', 'LOD300'
);
```

### Add Building Level
```sql
INSERT INTO location_bim_levels (
    workspace_id, location_id, name,
    level_number, elevation_m, height_m
) VALUES (
    'workspace-uuid', 'location-uuid', 'Ground Floor',
    0, 0.0, 3.5
);
```

### Add BIM Element
```sql
INSERT INTO location_bim_elements (
    workspace_id, location_id, bim_model_id, level_id,
    name, element_type, geom, material
) VALUES (
    'workspace-uuid', 'location-uuid', 'model-uuid', 'level-uuid',
    'Wall 001', 'wall',
    ST_GeomFromText('POLYGON((...))', 4326),
    'Concrete CMU'
);
```

### Add Space/Room
```sql
INSERT INTO location_bim_spaces (
    workspace_id, location_id, level_id,
    name, number, space_type, geom,
    floor_area_sqm, ceiling_height_m, max_occupancy
) VALUES (
    'workspace-uuid', 'location-uuid', 'level-uuid',
    'Conference Room A', '101', 'conference',
    ST_GeomFromText('POLYGON((...))', 4326),
    45.5, 2.8, 20
);
```

---

## Common Queries

### Get Building Summary
```sql
SELECT * FROM get_building_summary('location-uuid');
```

### List Elements by Level
```sql
SELECT * FROM get_elements_by_level('level-uuid');
```

### List Spaces by Level
```sql
SELECT * FROM get_spaces_by_level('level-uuid');
```

### Find Specific Element Types
```sql
SELECT * FROM find_elements_by_type(
    'location-uuid',
    ARRAY['door', 'window']
);
```

### Find Elements in Space
```sql
SELECT * FROM find_elements_in_space('space-uuid');
```

### Get Elements by System
```sql
SELECT * FROM get_elements_by_system('system-uuid');
```

### Calculate Space Utilization
```sql
SELECT * FROM calculate_space_utilization('location-uuid');
```

---

## Clash Detection

### Detect Clashes Automatically
```sql
SELECT * FROM detect_element_clashes(
    'location-uuid',
    0.05  -- 5cm tolerance
);
```

### Record Clash Manually
```sql
SELECT record_clash(
    'workspace-uuid',
    'location-uuid',
    'element-a-uuid',
    'element-b-uuid',
    'hard',       -- clash_type
    'high',       -- severity
    'Duct intersects with beam',
    auth.uid()
);
```

### View Active Clashes
```sql
SELECT * FROM v_bim_active_clashes
WHERE location_id = 'location-uuid'
  AND severity IN ('critical', 'high')
ORDER BY detected_at DESC;
```

---

## Construction Scheduling (4D BIM)

### Add Schedule to Elements
```sql
UPDATE location_bim_elements
SET construction_phase = 'foundations',
    scheduled_start_date = '2025-03-01',
    scheduled_end_date = '2025-04-15'
WHERE element_type IN ('foundation', 'slab')
  AND location_id = 'location-uuid';
```

### Track Actual Progress
```sql
UPDATE location_bim_elements
SET actual_start_date = CURRENT_DATE
WHERE construction_phase = 'foundations'
  AND scheduled_start_date <= CURRENT_DATE
  AND actual_start_date IS NULL;
```

### Get Construction Schedule
```sql
SELECT * FROM get_construction_schedule(
    'location-uuid',
    'foundations'  -- optional phase filter
);
```

### View Progress by Phase
```sql
SELECT * FROM v_bim_construction_progress
WHERE location_id = 'location-uuid'
ORDER BY construction_phase;
```

---

## Cost Management (5D BIM)

### Add Cost Data to Elements
```sql
UPDATE location_bim_elements
SET unit_cost = 150.00,
    total_cost = unit_cost * area_sqm,
    cost_currency = 'USD'
WHERE element_type = 'wall'
  AND location_id = 'location-uuid';
```

### Calculate Project Cost
```sql
SELECT * FROM calculate_project_cost(
    'location-uuid',
    ARRAY['new', 'existing']  -- status filter
);
```

### Get Cost by Phase
```sql
SELECT 
    construction_phase,
    SUM(total_cost) as phase_cost,
    COUNT(*) as element_count
FROM location_bim_elements
WHERE location_id = 'location-uuid'
  AND total_cost IS NOT NULL
GROUP BY construction_phase
ORDER BY SUM(total_cost) DESC;
```

---

## MEP Systems

### Create System
```sql
INSERT INTO location_bim_systems (
    workspace_id, location_id, name,
    system_type, capacity
) VALUES (
    'workspace-uuid', 'location-uuid',
    'HVAC-01 Supply Air', 'hvac', '10,000 CFM'
);
```

### Assign Elements to System
```sql
UPDATE location_bim_elements
SET system_id = 'system-uuid'
WHERE element_type IN ('duct', 'hvac_equipment')
  AND name LIKE 'HVAC-01%';
```

### Calculate System Lengths
```sql
SELECT * FROM calculate_system_lengths(
    'location-uuid',
    'hvac'
);
```

---

## Space Management

### Update Space Occupancy
```sql
UPDATE location_bim_spaces
SET current_occupancy = 15
WHERE id = 'space-uuid';
```

### Find Underutilized Spaces
```sql
SELECT * FROM v_bim_spaces_with_occupancy
WHERE utilization_percent < 30
  AND max_occupancy > 0
ORDER BY floor_area_sqm DESC;
```

### Get Spaces by Type
```sql
SELECT name, floor_area_sqm, max_occupancy
FROM location_bim_spaces
WHERE space_type = 'office'
  AND location_id = 'location-uuid'
ORDER BY floor_area_sqm DESC;
```

---

## Asset Placement

### Place Asset in BIM
```sql
INSERT INTO location_bim_asset_placements (
    workspace_id, asset_id, bim_element_id,
    space_id, level_id, position, elevation_m
) VALUES (
    'workspace-uuid', 'asset-uuid', 'element-uuid',
    'space-uuid', 'level-uuid',
    ST_MakePoint(-74.006, 40.7128),
    5.5  -- 5.5m elevation
);
```

### Find Assets in Space
```sql
SELECT a.name, a.serial_number, p.elevation_m
FROM location_bim_asset_placements p
JOIN assets a ON p.asset_id = a.id
WHERE p.space_id = 'space-uuid'
  AND p.placement_type = 'installed';
```

### Find Assets on Level
```sql
SELECT a.name, s.name as space_name, p.position
FROM location_bim_asset_placements p
JOIN assets a ON p.asset_id = a.id
LEFT JOIN location_bim_spaces s ON p.space_id = s.id
WHERE p.level_id = 'level-uuid';
```

---

## BIM to GIS Conversion

### Convert BIM Elements to GIS Features
```sql
-- Create layer first
INSERT INTO location_layers (
    workspace_id, location_id, name, layer_type
) VALUES (
    'workspace-uuid', 'location-uuid',
    'BIM Elements', 'overlay'
);

-- Convert
SELECT create_gis_features_from_bim(
    'bim-model-uuid',
    'layer-uuid',
    auth.uid()
);
```

---

## COBie Export

### Export Space Data
```sql
SELECT export_cobie_spaces('location-uuid');
```

### Export Format (JSON)
```json
{
  "spaces": [
    {
      "name": "Conference Room A",
      "number": "101",
      "type": "conference",
      "category": "Meeting",
      "floor_name": "Ground Floor",
      "description": "Main conference room",
      "area_sqm": 45.5,
      "max_occupancy": 20
    }
  ]
}
```

---

## Helpful Views

### Building Summary
```sql
SELECT * FROM v_bim_building_summary;
```

### Elements with Details
```sql
SELECT * FROM v_bim_elements_with_details
WHERE level_name = 'Ground Floor'
  AND element_type = 'door';
```

### Active Clashes
```sql
SELECT * FROM v_bim_active_clashes
WHERE severity = 'critical';
```

### Space Occupancy
```sql
SELECT * FROM v_bim_spaces_with_occupancy
WHERE location_id = 'location-uuid';
```

### Construction Progress
```sql
SELECT * FROM v_bim_construction_progress;
```

---

## Element Types Reference

### Architectural
- `wall`, `floor`, `ceiling`, `roof`
- `door`, `window`, `curtain_wall`
- `column`, `beam`, `stair`, `railing`
- `slab`, `foundation`

### MEP
- `hvac_equipment`, `duct`, `pipe`
- `electrical_equipment`, `cable_tray`
- `lighting_fixture`, `plumbing_fixture`
- `fire_protection`

### Structural
- `structural_column`, `structural_beam`
- `structural_foundation`, `brace`

### Other
- `furniture`, `equipment`
- `space`, `zone`, `room`
- `site`

---

## Space Types Reference

- `office`, `conference`, `restroom`
- `kitchen`, `storage`, `mechanical`
- `electrical`, `circulation`, `lobby`
- `parking`, `exterior`, `other`

---

## System Types Reference

- `hvac` - Heating, ventilation, AC
- `plumbing` - Water and drainage
- `electrical` - Power distribution
- `fire_protection` - Sprinklers, alarms
- `security` - Access control, cameras
- `lighting` - Lighting systems
- `data` - Network/communications
- `gas`, `compressed_air`, `vacuum`

---

## Clash Types Reference

- `hard` - Physical interference
- `soft` - Clearance violation
- `clearance` - Insufficient space
- `workflow` - Schedule conflict
- `duplicate` - Duplicate elements

---

## Severity Levels

- `critical` - Must fix immediately
- `high` - Fix before construction
- `medium` - Should fix
- `low` - Minor issue
- `info` - Informational only

---

## LOD (Level of Development)

- **LOD100**: Conceptual (boxes)
- **LOD200**: Approximate geometry
- **LOD300**: Precise geometry
- **LOD350**: Coordination
- **LOD400**: Fabrication
- **LOD500**: As-built

---

## Status Values

### Element Status
- `existing` - Already exists
- `new` - To be constructed
- `demolition` - To be removed
- `temporary` - Temporary installation
- `proposed` - Proposed design

### Clash Status
- `active` - Needs review
- `reviewed` - Under review
- `approved` - Approved conflict
- `resolved` - Fixed
- `ignored` - Not applicable

### Placement Type
- `installed` - Permanently installed
- `temporary` - Temporary placement
- `planned` - Future installation
- `removed` - Historical record

---

## Tips & Best Practices

### Performance
- ✅ Query by level_id to reduce search space
- ✅ Use spatial indexes (automatically created)
- ✅ Archive old model versions
- ✅ Batch import large models

### Data Quality
- ✅ Maintain consistent naming conventions
- ✅ Use external_id (IFC GUID) for traceability
- ✅ Document construction phases
- ✅ Keep costs updated

### Coordination
- ✅ Run clash detection regularly
- ✅ Assign clashes to responsible parties
- ✅ Track resolution status
- ✅ Document resolution notes

### Facility Management
- ✅ Complete space data for COBie
- ✅ Link assets to BIM elements
- ✅ Track maintenance schedules
- ✅ Update occupancy regularly

---

## Common Workflows

### 1. Model Import Workflow
```
Export IFC → Upload file → Insert model record → 
Parse IFC → Import elements/spaces/systems
```

### 2. Coordination Workflow
```
Import models (arch + MEP) → Detect clashes → 
Review issues → Resolve → Update models
```

### 3. Construction Tracking
```
Add schedule dates → Track start dates → 
Monitor progress → Mark completion → Calculate delays
```

### 4. Cost Management
```
Add unit costs → Calculate totals → 
Group by phase → Track actual costs → Analyze variances
```

### 5. Facility Handover
```
Complete BIM data → Export COBie → 
Generate spreadsheet → Import to FM system
```

---

## Resources

### IFC Resources
- **buildingSMART**: https://www.buildingsmart.org/
- **IFC Documentation**: https://standards.buildingsmart.org/
- **IFC.js**: https://ifcjs.github.io/info/

### COBie Resources
- **COBie Guide**: https://www.nibs.org/page/bsa_cobie
- **COBie Toolkit**: https://www.nibs.org/page/bsa_cobietoolkit

### BIM Standards
- **ISO 19650**: BIM information management
- **LOD Specification**: BIMForum LOD Spec
- **Uniclass**: Classification system

---

## Troubleshooting

### Model Won't Import
1. Check IFC schema version compatibility
2. Validate IFC file with IFC validator
3. Check file size and server limits
4. Review parser error logs

### Clashes Not Detected
1. Verify elements have geometry (geom not null)
2. Check tolerance setting (may be too small)
3. Ensure elements are on same location
4. Run detection on specific levels first

### Performance Issues
1. Add level_id filters to queries
2. Check spatial indexes exist
3. Archive old model versions
4. Use materialized views for dashboards

### COBie Export Incomplete
1. Verify space data completeness
2. Check for null required fields
3. Validate space types
4. Ensure levels are properly defined
