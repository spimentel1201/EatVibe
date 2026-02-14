-- Insert Users (Password is 'password123' hashed with BCrypt)
-- Admin
INSERT INTO users (id, email, password_hash, full_name, role) 
VALUES (
    'aaaa0000-aaaa-0000-aaaa-000000000000',
    'admin@foodrush.com', 
    '$2b$10$tmpxVyLm1y1Cv2rJI2GnguBEl5E0BLPGawJ26onVPrnRIMMSejYby', 
    'Super Admin', 
    'ROLE_ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Restaurant Admins
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    'aaaa1111-aaaa-1111-aaaa-111111111111',
    'manager.bk@foodrush.com', 
    '$2b$10$tmpxVyLm1y1Cv2rJI2GnguBEl5E0BLPGawJ26onVPrnRIMMSejYby', 
    'BK Manager', 
    'ROLE_RESTAURANT_ADMIN'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    'bbbb2222-bbbb-2222-bbbb-222222222222',
    'manager.sushi@foodrush.com', 
    '$2b$10$tmpxVyLm1y1Cv2rJI2GnguBEl5E0BLPGawJ26onVPrnRIMMSejYby', 
    'Sushi Manager', 
    'ROLE_RESTAURANT_ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Couriers
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    'cccc1111-cccc-1111-cccc-111111111111',
    'courier.juan@foodrush.com', 
    '$2b$10$tmpxVyLm1y1Cv2rJI2GnguBEl5E0BLPGawJ26onVPrnRIMMSejYby', 
    'Juan Perez', 
    'ROLE_COURIER'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    'cccc2222-cccc-2222-cccc-222222222222',
    'courier.maria@foodrush.com', 
    '$2b$10$tmpxVyLm1y1Cv2rJI2GnguBEl5E0BLPGawJ26onVPrnRIMMSejYby', 
    'Maria Gomez', 
    'ROLE_COURIER'
) ON CONFLICT (email) DO NOTHING;

-- Customers
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    'dddd1111-dddd-1111-dddd-111111111111',
    'customer.alex@foodrush.com', 
    '$2b$10$tmpxVyLm1y1Cv2rJI2GnguBEl5E0BLPGawJ26onVPrnRIMMSejYby', 
    'Alex Customer', 
    'ROLE_CUSTOMER'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    'dddd2222-dddd-2222-dddd-222222222222',
    'customer.laura@foodrush.com', 
    '$2b$10$tmpxVyLm1y1Cv2rJI2GnguBEl5E0BLPGawJ26onVPrnRIMMSejYby', 
    'Laura Client', 
    'ROLE_CUSTOMER'
) ON CONFLICT (email) DO NOTHING;
