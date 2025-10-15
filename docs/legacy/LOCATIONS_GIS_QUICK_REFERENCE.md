# Locations GIS/CAD - Quick Reference

## Most Common Operations

### 1. Query Features Near a Point
```sql
-- Find all equipment within 50 meters of a point
SELECT * FROM find_features_near_point(
    'location-uuid',
    ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326),
    50,
    ARRAY['marker', 'point']
);
```

### 2. Export Location Data as GeoJSON
```sql
-- Export all features for a location
SELECT export_features_as_geojson('location-uuid');

-- Export specific layer
SELECT export_features_as_geojson('location-uuid', 'layer-uuid');
```

### 3. Import GeoJSON from Google Maps
```sql
SELECT import_geojson_features(
    'workspace-uuid',
    'location-uuid',
    'layer-uuid',
    '{"type":"FeatureCollection","features":[...]}'::jsonb,
    auth.uid()
);
```

### 4. Create Buffer Zone
```sql
-- Create 10-meter safety zone around feature
SELECT create_buffer_feature(
    'feature-uuid',
    10,
    'Safety Zone'
);
```

### 5. Calculate Distance Between Features
```sql
SELECT calculate_distance_between_features(
    'feature-1-uuid',
    'feature-2-uuid'
) as distance_meters;
```

### 6. Find Features in Polygon
```sql
SELECT * FROM find_features_in_polygon(
    'location-uuid',
    ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[...]}')
);
```

---

## Feature Types Reference

| Type | Use Case | Example |
|------|----------|---------|
| `point` | Single location marker | Equipment, access point |
| `marker` | Named point with icon | Camera, exit sign |
| `line` | Straight connection | Cable run, direct path |
| `polyline` | Multi-segment line | Piping, wiring route |
| `polygon` | Enclosed area | Room, zone, boundary |
| `circle` | Circular area | Coverage zone |
| `rectangle` | Rectangular area | Stage, booth |
| `annotation` | Text label | Room number |
| `dimension` | Measurement line | Wall length |

---

## Layer Types

| Type | Purpose | Example |
|------|---------|---------|
| `base_map` | Background reference | Site plan |
| `floor_plan` | Building layout | Floor 1 layout |
| `overlay` | Additional info | Staging areas |
| `annotation` | Labels/notes | Room numbers |
| `utility` | Infrastructure | Electrical, HVAC |
| `access` | Entry/exit points | Doors, gates |
| `boundary` | Property lines | Site boundary |
| `custom` | Any other use | Flexible |

---

## Route Types

| Type | Purpose |
|------|---------|
| `driving` | Vehicle routes |
| `walking` | Pedestrian paths |
| `load_in` | Equipment delivery |
| `evacuation` | Emergency exit |
| `delivery` | Package routing |
| `tour` | Guided path |
| `custom` | Any other |

---

## Example Workflows

### Workflow: Import from Google My Maps

1. **Export from Google:**
   - Open Google My Maps
   - Click menu → Export to KML/KMZ
   - Choose "Export to KML" (not KMZ)

2. **Convert to GeoJSON:**
   - Use online tool: https://mygeodata.cloud/converter/kml-to-geojson
   - Or use command line: `ogr2ogr -f GeoJSON output.json input.kml`

3. **Import to Database:**
   ```sql
   SELECT import_geojson_features(
       workspace_id,
       location_id,
       layer_id,
       geojson_data::jsonb,
       auth.uid()
   );
   ```

### Workflow: Create Equipment Layout

1. **Create Layer:**
   ```sql
   INSERT INTO location_layers (workspace_id, location_id, name, layer_type)
   VALUES (workspace_id, location_id, 'Equipment', 'overlay');
   ```

2. **Add Equipment Points:**
   ```sql
   INSERT INTO location_features (
       workspace_id, location_id, layer_id,
       name, feature_type, geom
   ) VALUES (
       workspace_id, location_id, layer_id,
       'Camera 1', 'marker',
       ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326)
   );
   ```

3. **Query Nearby Equipment:**
   ```sql
   SELECT * FROM find_features_near_point(
       location_id,
       ST_SetSRID(ST_MakePoint(-74.007, 40.7130), 4326),
       100
   );
   ```

### Workflow: Zone Planning

1. **Draw Zone Polygon:**
   ```sql
   INSERT INTO location_features (
       workspace_id, location_id, layer_id,
       name, feature_type, geom
   ) VALUES (
       workspace_id, location_id, layer_id,
       'Stage Area', 'polygon',
       ST_GeomFromGeoJSON('{
           "type":"Polygon",
           "coordinates":[[[-74.01,40.71],[-74.00,40.71],[-74.00,40.72],[-74.01,40.72],[-74.01,40.71]]]
       }')
   );
   ```

2. **Find All Equipment in Zone:**
   ```sql
   SELECT * FROM find_features_in_polygon(
       location_id,
       (SELECT geom FROM location_features WHERE name = 'Stage Area')
   );
   ```

3. **Create Safety Buffer:**
   ```sql
   SELECT create_buffer_feature(
       (SELECT id FROM location_features WHERE name = 'Stage Area'),
       5,
       'Stage Safety Buffer'
   );
   ```

---

## Common Queries

### Get All Layers for Location
```sql
SELECT * FROM location_layers
WHERE location_id = 'location-uuid'
ORDER BY display_order;
```

### Get All Features on Layer
```sql
SELECT * FROM location_features
WHERE layer_id = 'layer-uuid'
AND feature_type IN ('marker', 'polygon');
```

### Get Location Summary
```sql
SELECT * FROM v_location_spatial_summary
WHERE id = 'location-uuid';
```

### Get Features with Layer Info
```sql
SELECT * FROM v_location_features_with_layers
WHERE location_id = 'location-uuid';
```

### Find Closest Location
```sql
SELECT * FROM find_locations_near_point(
    40.7128,  -- latitude
    -74.0060, -- longitude
    5000,     -- distance in meters
    'workspace-uuid'
)
LIMIT 1;
```

---

## Geometry Creation Examples

### Create Point
```sql
ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
```

### Create Line
```sql
ST_GeomFromText('LINESTRING(-74.006 40.7128, -74.007 40.7130)', 4326)
```

### Create Polygon
```sql
ST_GeomFromGeoJSON('{
    "type":"Polygon",
    "coordinates":[[
        [lng1,lat1], [lng2,lat2], [lng3,lat3], [lng1,lat1]
    ]]
}')
```

### Create Circle (Buffer around point)
```sql
ST_Buffer(
    ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326)::geography,
    50  -- radius in meters
)::geometry
```

---

## Measurement Functions

### Calculate Area
```sql
-- Returns area in square meters
SELECT ST_Area(geom::geography)
FROM location_features
WHERE id = 'feature-uuid';
```

### Calculate Length
```sql
-- Returns length in meters
SELECT ST_Length(geom::geography)
FROM location_features
WHERE id = 'feature-uuid';
```

### Calculate Distance
```sql
-- Returns distance in meters
SELECT ST_Distance(
    f1.geom::geography,
    f2.geom::geography
)
FROM location_features f1, location_features f2
WHERE f1.id = 'feature-1-uuid' AND f2.id = 'feature-2-uuid';
```

---

## Tips & Best Practices

### Performance
- ✅ Use layers to organize features
- ✅ Use spatial indexes (already created)
- ✅ Filter by layer_id before spatial queries
- ✅ Use geography cast for accurate distance/area
- ❌ Avoid full table scans on geometry columns

### Data Organization
- Create layers for different categories
- Lock layers when not editing
- Use consistent naming conventions
- Tag features for easy filtering

### Compatibility
- Always use EPSG:4326 (WGS84) for web compatibility
- Export as GeoJSON for maximum compatibility
- Test imports with small datasets first
- Validate geometry before importing

### Spatial Queries
- Use geography for distance/area (meters)
- Use geometry for intersections/contains
- Add bounding box filters for large datasets
- Use prepared statements for repeated queries

---

## Coordinate Reference Systems

### EPSG:4326 (WGS84) - Default
- Standard for web mapping (Google Maps, etc.)
- Coordinates in latitude/longitude
- Global coverage
- **Use for:** Web maps, GPS data, general purpose

### Converting Coordinates
```sql
-- From other CRS to EPSG:4326
ST_Transform(geometry, 4326)

-- Example: Convert from State Plane to WGS84
ST_Transform(
    ST_SetSRID(geom, 2263), -- NY State Plane
    4326
)
```

---

## Troubleshooting

### Feature Not Appearing in Query
1. Check if feature's geom is valid: `SELECT ST_IsValid(geom)`
2. Check if layer is visible: `SELECT visible FROM location_layers`
3. Verify coordinate order: longitude first, then latitude
4. Check SRID: `SELECT ST_SRID(geom)` should be 4326

### Import Failing
1. Validate GeoJSON structure
2. Check for invalid geometries
3. Ensure all coordinates are in valid range (lat: -90 to 90, lng: -180 to 180)
4. Test with single feature first

### Slow Queries
1. Ensure spatial indexes exist: `\d location_features`
2. Use layer_id filters
3. Add bounding box filters with ST_Intersects
4. Analyze query plan: `EXPLAIN ANALYZE SELECT ...`

---

## API Integration Examples

### Google Maps JavaScript API
```javascript
// Fetch GeoJSON from database
const response = await fetch('/api/locations/{id}/geojson');
const geojson = await response.json();

// Add to Google Maps
map.data.addGeoJson(geojson);
```

### Mapbox GL JS
```javascript
map.addSource('location-features', {
    type: 'geojson',
    data: geojsonFromDatabase
});

map.addLayer({
    id: 'features',
    type: 'fill',
    source: 'location-features',
    paint: { 'fill-color': '#088', 'fill-opacity': 0.5 }
});
```

### Leaflet
```javascript
L.geoJSON(geojsonFromDatabase).addTo(map);
```

---

## SQL Function Signatures

### Spatial Queries
```sql
find_features_near_point(location_id, point, distance_meters, feature_types[])
find_features_in_polygon(location_id, polygon)
find_locations_near_point(lat, lng, distance_meters, workspace_id)
```

### Geometry Operations
```sql
create_buffer_feature(feature_id, buffer_distance_meters, name)
calculate_intersection(feature_id_1, feature_id_2, name)
```

### Measurements
```sql
calculate_distance_between_features(feature_id_1, feature_id_2)
calculate_area_of_polygon_feature(feature_id)
```

### Import/Export
```sql
export_features_as_geojson(location_id, layer_id)
import_geojson_features(workspace_id, location_id, layer_id, geojson, created_by)
```

---

## Resources

### Tools
- **QGIS**: Free GIS software for advanced editing
- **ogr2ogr**: Command-line tool for format conversion
- **geojson.io**: Online GeoJSON editor and validator
- **PostGIS Documentation**: https://postgis.net/docs/

### Specifications
- **GeoJSON RFC 7946**: https://tools.ietf.org/html/rfc7946
- **PostGIS**: https://postgis.net/
- **WKT Format**: https://en.wikipedia.org/wiki/Well-known_text

### Conversion Tools
- **MyGeoData**: https://mygeodata.cloud/converter/
- **GDAL/OGR**: https://gdal.org/
- **Mapshaper**: https://mapshaper.org/
