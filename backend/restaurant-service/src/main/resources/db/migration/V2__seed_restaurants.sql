-- ============================================
-- Restaurant Service - Seed Data
-- ============================================

-- Restaurant 1: Burger King (Fast Food)
INSERT INTO restaurants (id, owner_user_id, name, description, status, rating, image_url)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'aaaa1111-aaaa-1111-aaaa-111111111111', -- Random Owner ID
    'Burger King',
    'The Home of the Whopper',
    'OPEN',
    4.5,
    'https://res.cloudinary.com/demo/image/upload/v1649320265/food/burger_king.png'
) ON CONFLICT (id) DO NOTHING;

-- Categories for Burger King
INSERT INTO categories (id, restaurant_id, name, sort_order)
VALUES 
    ('11111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Burgers', 1),
    ('11111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'Drinks', 2)
ON CONFLICT (id) DO NOTHING;

-- Menu Items for Burger King
INSERT INTO menu_items (id, category_id, name, description, price, available, image_url)
VALUES
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111112', 'Whopper', 'Grilled beef patty with lettuce and tomato', 5.99, true, 'https://res.cloudinary.com/demo/image/upload/v1649320265/food/whopper.jpg'),
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111112', 'Cheeseburger', 'Classic cheeseburger', 2.99, true, 'https://res.cloudinary.com/demo/image/upload/v1649320265/food/cheeseburger.jpg'),
    (gen_random_uuid(), '11111111-1111-1111-1111-111111111113', 'Coke', 'Refreshing cola', 1.99, true, 'https://res.cloudinary.com/demo/image/upload/v1649320265/food/coke.jpg')
ON CONFLICT DO NOTHING;


-- Restaurant 2: Sushi Master (Asian)
INSERT INTO restaurants (id, owner_user_id, name, description, status, rating, image_url)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'bbbb2222-bbbb-2222-bbbb-222222222222', -- Random Owner ID
    'Sushi Master',
    'Authentic Japanese Sushi',
    'OPEN',
    4.8,
    'https://res.cloudinary.com/demo/image/upload/v1649320265/food/sushi_place.jpg'
) ON CONFLICT (id) DO NOTHING;

-- Categories for Sushi Master
INSERT INTO categories (id, restaurant_id, name, sort_order)
VALUES 
    ('22222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 'Rolls', 1),
    ('22222222-2222-2222-2222-222222222224', '22222222-2222-2222-2222-222222222222', 'Nigiri', 2)
ON CONFLICT (id) DO NOTHING;

-- Menu Items for Sushi Master
INSERT INTO menu_items (id, category_id, name, description, price, available, image_url)
VALUES
    (gen_random_uuid(), '22222222-2222-2222-2222-222222222223', 'California Roll', 'Crab, avocado, cucumber', 8.99, true, 'https://res.cloudinary.com/demo/image/upload/v1649320265/food/california_roll.jpg'),
    (gen_random_uuid(), '22222222-2222-2222-2222-222222222223', 'Spicy Tuna Roll', 'Fresh tuna with spicy mayo', 9.50, true, 'https://res.cloudinary.com/demo/image/upload/v1649320265/food/spicy_tuna.jpg'),
    (gen_random_uuid(), '22222222-2222-2222-2222-222222222224', 'Salmon Nigiri', 'Fresh salmon on rice', 4.50, true, 'https://res.cloudinary.com/demo/image/upload/v1649320265/food/salmon_nigiri.jpg')
ON CONFLICT DO NOTHING;
