-- Insert Users (Password is 'password123' hashed with BCrypt)
-- Admin
INSERT INTO users (id, email, password_hash, full_name, role) 
VALUES (
    gen_random_uuid(),
    'admin@foodrush.com', 
    '$2b$10$tmpxVyLm1y1Cv2rJI2GnguBEl5E0BLPGawJ26onVPrnRIMMSejYby', 
    'Super Admin', 
    'ROLE_ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Restaurant Admins
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    gen_random_uuid(),
    'manager.bk@foodrush.com', 
    '$2b$10$tmpxVyLm1y1Cv2rJI2GnguBEl5E0BLPGawJ26onVPrnRIMMSejYby', 
    'BK Manager', 
    'ROLE_RESTAURANT_ADMIN'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    gen_random_uuid(),
    'manager.sushi@foodrush.com', 
    '$2b$10$tmpxVyLm1y1Cv2rJI2GnguBEl5E0BLPGawJ26onVPrnRIMMSejYby', 
    'Sushi Manager', 
    'ROLE_RESTAURANT_ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Couriers
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    gen_random_uuid(),
    'courier.juan@foodrush.com', 
    '$2b$10$tmpxVyLm1y1Cv2rJI2GnguBEl5E0BLPGawJ26onVPrnRIMMSejYby', 
    'Juan Perez', 
    'ROLE_COURIER'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    gen_random_uuid(),
    'courier.maria@foodrush.com', 
    '$2b$10$tmpxVyLm1y1Cv2rJI2GnguBEl5E0BLPGawJ26onVPrnRIMMSejYby', 
    'Maria Gomez', 
    'ROLE_COURIER'
) ON CONFLICT (email) DO NOTHING;

-- Customers
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    gen_random_uuid(),
    'customer.alex@foodrush.com', 
    '$2b$10$tmpxVyLm1y1Cv2rJI2GnguBEl5E0BLPGawJ26onVPrnRIMMSejYby', 
    'Alex Customer', 
    'ROLE_CUSTOMER'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    gen_random_uuid(),
    'customer.laura@foodrush.com', 
    '$2b$10$tmpxVyLm1y1Cv2rJI2GnguBEl5E0BLPGawJ26onVPrnRIMMSejYby', 
    'Laura Client', 
    'ROLE_CUSTOMER'
) ON CONFLICT (email) DO NOTHING;
