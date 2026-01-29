-- ============================================
-- Order Service - Database Migration V1
-- Descripción: Crea las tablas orders y order_items
-- ============================================

-- Tabla de pedidos
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL,
    restaurant_id UUID NOT NULL,
    courier_id UUID,
    status VARCHAR(30) NOT NULL CHECK (status IN (
        'CREATED', 'PAYMENT_PENDING', 'PAYMENT_CONFIRMED', 'PAYMENT_FAILED',
        'ACCEPTED_BY_RESTAURANT', 'REJECTED_BY_RESTAURANT', 'PREPARING',
        'READY_FOR_PICKUP', 'COURIER_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT',
        'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED'
    )),
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    estimated_delivery_time TIMESTAMP
);

-- Índices para mejorar el rendimiento de consultas
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_courier_id ON orders(courier_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Tabla de items del pedido
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL,
    product_snapshot_name VARCHAR(100) NOT NULL,
    unit_snapshot_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    special_instructions TEXT
);

-- Índice para consultas de items por pedido
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Comentarios para documentación
COMMENT ON TABLE orders IS 'Tabla principal de pedidos del sistema';
COMMENT ON TABLE order_items IS 'Items individuales de cada pedido con snapshot de precios';
COMMENT ON COLUMN order_items.product_snapshot_name IS 'Nombre del producto al momento de la compra';
COMMENT ON COLUMN order_items.unit_snapshot_price IS 'Precio unitario al momento de la compra';
