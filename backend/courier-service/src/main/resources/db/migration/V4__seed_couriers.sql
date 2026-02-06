-- ============================================
-- Courier Service - Seed Data
-- ============================================

-- Courier 1: Juan Perez (Bicycle, Available)
INSERT INTO couriers (id, first_name, last_name, phone, email, vehicle_type, status, rating)
VALUES (
    'cccc1111-cccc-1111-cccc-111111111111',
    'Juan',
    'Perez',
    '+51900000001',
    'juan.perez@foodrush.com',
    'BICYCLE',
    'AVAILABLE',
    4.8
) ON CONFLICT (email) DO NOTHING;

-- Location for Juan Perez (Lima Centro)
INSERT INTO courier_locations (courier_id, location, latitude, longitude)
VALUES (
    'cccc1111-cccc-1111-cccc-111111111111',
    ST_SetSRID(ST_MakePoint(-77.0428, -12.0464), 4326),
    -12.0464,
    -77.0428
) ON CONFLICT DO NOTHING;


-- Courier 2: Maria Lopez (Motorcycle, On Delivery)
INSERT INTO couriers (id, first_name, last_name, phone, email, vehicle_type, status, rating)
VALUES (
    'cccc2222-cccc-2222-cccc-222222222222',
    'Maria',
    'Lopez',
    '+51900000002',
    'maria.lopez@foodrush.com',
    'MOTORCYCLE',
    'ON_DELIVERY',
    4.9
) ON CONFLICT (email) DO NOTHING;

-- Location for Maria Lopez (Miraflores)
INSERT INTO courier_locations (courier_id, location, latitude, longitude)
VALUES (
    'cccc2222-cccc-2222-cccc-222222222222',
    ST_SetSRID(ST_MakePoint(-77.0300, -12.1100), 4326),
    -12.1100,
    -77.0300
) ON CONFLICT DO NOTHING;


-- Courier 3: Carlos Ramos (Car, Offline)
INSERT INTO couriers (id, first_name, last_name, phone, email, vehicle_type, status, rating)
VALUES (
    'cccc3333-cccc-3333-cccc-333333333333',
    'Carlos',
    'Ramos',
    '+51900000003',
    'carlos.ramos@foodrush.com',
    'CAR',
    'OFFLINE',
    4.5
) ON CONFLICT (email) DO NOTHING;
