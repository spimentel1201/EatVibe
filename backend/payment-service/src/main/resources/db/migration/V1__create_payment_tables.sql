-- =======================================================================================
-- Payment Service - Flyway Migration V1
-- Descripción: Crea las tablas de payment_methods y transactions
-- Autor: FoodRush Team
-- Fecha: 2026-01-29
-- =======================================================================================

-- =======================================================================================
-- Tabla: payment_methods
-- Descripción: Almacena métodos de pago tokenizados de los usuarios
-- IMPORTANTE: NUNCA guardar datos sensibles de tarjetas (PAN, CVV)
-- Solo tokens proporcionados por el gateway de pago (PCI DSS Compliance)
-- =======================================================================================
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('CARD', 'WALLET')),
    masked_number VARCHAR(20),
    token VARCHAR(255) NOT NULL,
    provider VARCHAR(20) NOT NULL CHECK (provider IN ('STRIPE', 'YAPE', 'NIUBIZ')),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Índices para payment_methods
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_is_default ON payment_methods(is_default);

-- Comentarios
COMMENT ON TABLE payment_methods IS 'Métodos de pago tokenizados de usuarios (PCI DSS compliant)';
COMMENT ON COLUMN payment_methods.token IS 'Token del proveedor de pago - NUNCA guardar PAN completo';
COMMENT ON COLUMN payment_methods.masked_number IS 'Número enmascarado para mostrar al usuario (ej: ****1234)';

-- =======================================================================================
-- Tabla: transactions
-- Descripción: Historial completo de transacciones de pago
-- Incluye: pagos exitosos, intentos fallidos, reembolsos
-- =======================================================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    user_id UUID NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'PEN',
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    provider VARCHAR(20) NOT NULL CHECK (provider IN ('STRIPE', 'YAPE', 'NIUBIZ')),
    external_transaction_id VARCHAR(255),
    error_message VARCHAR(500),
    error_code VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Índices para transactions
CREATE INDEX idx_transactions_order_id ON transactions(order_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_external_tx_id ON transactions(external_transaction_id);

-- Comentarios
COMMENT ON TABLE transactions IS 'Historial completo de transacciones de pago';
COMMENT ON COLUMN transactions.external_transaction_id IS 'ID de la transacción en el sistema externo (Stripe, Yape, etc.)';
COMMENT ON COLUMN transactions.error_code IS 'Código de error del proveedor para debugging';
COMMENT ON COLUMN transactions.error_message IS 'Mensaje de error detallado';

-- =======================================================================================
-- Fin de migración V1
-- =======================================================================================
