-- ============================================
-- Order Service - Seed Data
-- ============================================

-- Order 1: Alex orders a Whopper from Burger King
INSERT INTO orders (id, customer_id, restaurant_id, status, subtotal, delivery_fee, total_amount, created_at)
VALUES (
    'eeee1111-eeee-1111-eeee-111111111111',
    'dddd1111-dddd-1111-dddd-111111111111', -- Alex Customer
    '11111111-1111-1111-1111-111111111111', -- Burger King
    'DELIVERED',
    5.99,
    2.00,
    7.99,
    NOW() - INTERVAL '2 hours'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (id, order_id, menu_item_id, product_snapshot_name, unit_snapshot_price, quantity)
VALUES (
    gen_random_uuid(),
    'eeee1111-eeee-1111-eeee-111111111111',
    '11111111-1111-1111-1111-111111111114', -- Whopper
    'Whopper',
    5.99,
    1
) ON CONFLICT (id) DO NOTHING;


-- Order 2: Laura orders Sushi (Pending)
INSERT INTO orders (id, customer_id, restaurant_id, status, subtotal, delivery_fee, total_amount, created_at)
VALUES (
    'eeee2222-eeee-2222-eeee-222222222222',
    'dddd2222-dddd-2222-dddd-222222222222', -- Laura Client
    '22222222-2222-2222-2222-222222222222', -- Sushi Master
    'PAYMENT_PENDING',
    18.49,
    3.50,
    21.99,
    NOW()
) ON CONFLICT (id) DO NOTHING;
