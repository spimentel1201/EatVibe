-- Insert Users (Password is 'password123' hashed with BCrypt)
-- Admin
INSERT INTO users (id, email, password_hash, full_name, role) 
VALUES (
    gen_random_uuid(),
    'admin@foodrush.com', 
    '$2a$10$wS2/7h.S8u/v.r.s.t.u.v.w.x.y.z.1.2.3.4.5.6.7.8.9.0', 
    'Super Admin', 
    'ROLE_ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Restaurant Admins
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    gen_random_uuid(),
    'manager.bk@foodrush.com', 
    '$2a$10$wS2/7h.S8u/v.r.s.t.u.v.w.x.y.z.1.2.3.4.5.6.7.8.9.0', 
    'BK Manager', 
    'ROLE_RESTAURANT_ADMIN'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    gen_random_uuid(),
    'manager.sushi@foodrush.com', 
    '$2a$10$wS2/7h.S8u/v.r.s.t.u.v.w.x.y.z.1.2.3.4.5.6.7.8.9.0', 
    'Sushi Manager', 
    'ROLE_RESTAURANT_ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Couriers
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    gen_random_uuid(),
    'courier.juan@foodrush.com', 
    '$2a$10$wS2/7h.S8u/v.r.s.t.u.v.w.x.y.z.1.2.3.4.5.6.7.8.9.0', 
    'Juan Perez', 
    'ROLE_COURIER'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    gen_random_uuid(),
    'courier.maria@foodrush.com', 
    '$2a$10$wS2/7h.S8u/v.r.s.t.u.v.w.x.y.z.1.2.3.4.5.6.7.8.9.0', 
    'Maria Gomez', 
    'ROLE_COURIER'
) ON CONFLICT (email) DO NOTHING;

-- Customers
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    gen_random_uuid(),
    'customer.alex@foodrush.com', 
    '$2a$10$wS2/7h.S8u/v.r.s.t.u.v.w.x.y.z.1.2.3.4.5.6.7.8.9.0', 
    'Alex Customer', 
    'ROLE_CUSTOMER'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, email, password_hash, full_name, role)
VALUES (
    gen_random_uuid(),
    'customer.laura@foodrush.com', 
    '$2a$10$wS2/7h.S8u/v.r.s.t.u.v.w.x.y.z.1.2.3.4.5.6.7.8.9.0', 
    'Laura Client', 
    'ROLE_CUSTOMER'
) ON CONFLICT (email) DO NOTHING;
