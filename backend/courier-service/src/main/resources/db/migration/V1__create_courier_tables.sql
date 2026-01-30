-- ============================================
-- Courier Service - Initial Database Schema
-- ============================================
-- Migration: V1__create_courier_tables.sql
-- Description: Creates initial tables with PostGIS support
-- Author: FoodRush Team
-- Date: 2026-01-30
-- ============================================

-- Enable PostGIS extension for spatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- Table: couriers
-- Description: Stores courier profiles and status
-- ============================================
CREATE TABLE couriers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    vehicle_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OFFLINE',
    rating DECIMAL(3,2) NOT NULL DEFAULT 5.00,
    total_deliveries INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_rating CHECK (rating >= 0 AND rating <= 5),
    CONSTRAINT chk_vehicle_type CHECK (vehicle_type IN ('BICYCLE', 'MOTORCYCLE', 'CAR')),
    CONSTRAINT chk_status CHECK (status IN ('OFFLINE', 'AVAILABLE', 'BUSY', 'ON_DELIVERY'))
);

-- Indexes for couriers table
CREATE INDEX idx_courier_status ON couriers(status);
CREATE INDEX idx_courier_email ON couriers(email);
CREATE INDEX idx_courier_phone ON couriers(phone);

COMMENT ON TABLE couriers IS 'Courier profiles with status and ratings';
COMMENT ON COLUMN couriers.vehicle_type IS 'Type of vehicle: BICYCLE, MOTORCYCLE, or CAR';
COMMENT ON COLUMN couriers.status IS 'Current status: OFFLINE, AVAILABLE, BUSY, or ON_DELIVERY';
COMMENT ON COLUMN couriers.rating IS 'Average rating from 0 to 5';

-- ============================================
-- Table: courier_locations
-- Description: GPS tracking history with PostGIS Point geometry
-- ============================================
CREATE TABLE courier_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    courier_id UUID NOT NULL REFERENCES couriers(id) ON DELETE CASCADE,
    location geometry(Point, 4326) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accuracy DECIMAL(10, 2),
    speed DECIMAL(10, 2),
    
    CONSTRAINT chk_latitude CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT chk_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

-- Spatial index for fast geoqueries (CRITICAL for performance)
CREATE INDEX idx_courier_location_spatial ON courier_locations USING GIST(location);

-- Temporal indexes
CREATE INDEX idx_courier_location_courier ON courier_locations(courier_id);
CREATE INDEX idx_courier_location_timestamp ON courier_locations(timestamp DESC);

-- Composite index for latest location queries
CREATE INDEX idx_courier_location_courier_timestamp ON courier_locations(courier_id, timestamp DESC);

COMMENT ON TABLE courier_locations IS 'GPS tracking history with PostGIS spatial support';
COMMENT ON COLUMN courier_locations.location IS 'PostGIS Point geometry in WGS84 (SRID 4326)';
COMMENT ON COLUMN courier_locations.accuracy IS 'GPS accuracy in meters';
COMMENT ON COLUMN courier_locations.speed IS 'Speed in km/h';

-- ============================================
-- Table: deliveries
-- Description: Delivery records with pickup and delivery locations
-- ============================================
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    courier_id UUID REFERENCES couriers(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    pickup_location geometry(Point, 4326),
    delivery_location geometry(Point, 4326),
    delivery_pin VARCHAR(6),
    earnings DECIMAL(10, 2),
    distance DECIMAL(10, 2),
    assigned_at TIMESTAMP,
    picked_up_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_delivery_status CHECK (status IN ('PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
    CONSTRAINT chk_delivery_pin CHECK (delivery_pin ~ '^[0-9]{6}$')
);

-- Indexes for deliveries table
CREATE INDEX idx_delivery_order ON deliveries(order_id);
CREATE INDEX idx_delivery_courier ON deliveries(courier_id);
CREATE INDEX idx_delivery_status ON deliveries(status);
CREATE INDEX idx_delivery_created ON deliveries(created_at DESC);

-- Spatial indexes for delivery locations
CREATE INDEX idx_delivery_pickup_location ON deliveries USING GIST(pickup_location);
CREATE INDEX idx_delivery_delivery_location ON deliveries USING GIST(delivery_location);

COMMENT ON TABLE deliveries IS 'Delivery records with spatial pickup and delivery locations';
COMMENT ON COLUMN deliveries.delivery_pin IS '6-digit PIN for delivery verification';
COMMENT ON COLUMN deliveries.earnings IS 'Courier earnings for this delivery';
COMMENT ON COLUMN deliveries.distance IS 'Total distance traveled in kilometers';

-- ============================================
-- Table: courier_shifts
-- Description: Work sessions for couriers (clock in/out)
-- ============================================
CREATE TABLE courier_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    courier_id UUID NOT NULL REFERENCES couriers(id) ON DELETE CASCADE,
    clock_in_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    clock_out_at TIMESTAMP,
    total_earnings DECIMAL(10, 2) DEFAULT 0.00,
    total_deliveries INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_shift_times CHECK (clock_out_at IS NULL OR clock_out_at > clock_in_at)
);

-- Indexes for shifts table
CREATE INDEX idx_shift_courier ON courier_shifts(courier_id);
CREATE INDEX idx_shift_clock_in ON courier_shifts(clock_in_at DESC);
CREATE INDEX idx_shift_active ON courier_shifts(courier_id, clock_out_at) WHERE clock_out_at IS NULL;

COMMENT ON TABLE courier_shifts IS 'Work sessions tracking clock in/out and earnings';
COMMENT ON COLUMN courier_shifts.clock_out_at IS 'NULL indicates active shift';

-- ============================================
-- Table: zones
-- Description: Operational coverage zones with PostGIS Polygon
-- ============================================
CREATE TABLE zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    boundary geometry(Polygon, 4326) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Spatial index for zone queries
CREATE INDEX idx_zone_boundary ON zones USING GIST(boundary);
CREATE INDEX idx_zone_active ON zones(is_active);

COMMENT ON TABLE zones IS 'Operational coverage zones with polygon boundaries';
COMMENT ON COLUMN zones.boundary IS 'PostGIS Polygon defining the zone boundary';

-- ============================================
-- Functions and Triggers
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_couriers_updated_at
    BEFORE UPDATE ON couriers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at
    BEFORE UPDATE ON deliveries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zones_updated_at
    BEFORE UPDATE ON zones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Sample Data for Development
-- ============================================

-- Insert sample zone (Lima Centro)
INSERT INTO zones (name, description, boundary, is_active)
VALUES (
    'Lima Centro',
    'Zona de cobertura del centro de Lima',
    ST_GeomFromText('POLYGON((-77.0500 -12.0400, -77.0300 -12.0400, -77.0300 -12.0600, -77.0500 -12.0600, -77.0500 -12.0400))', 4326),
    true
);

-- ============================================
-- Verification Queries (for testing)
-- ============================================

-- Verify PostGIS is installed
-- SELECT PostGIS_Version();

-- Verify spatial indexes
-- SELECT tablename, indexname FROM pg_indexes WHERE indexname LIKE '%spatial%';

-- Test spatial query (find couriers within 5km of a point)
-- SELECT c.name, ST_Distance(cl.location::geography, ST_SetSRID(ST_MakePoint(-77.0428, -12.0464), 4326)::geography) / 1000 as distance_km
-- FROM couriers c
-- INNER JOIN LATERAL (SELECT * FROM courier_locations WHERE courier_id = c.id ORDER BY timestamp DESC LIMIT 1) cl ON true
-- WHERE ST_DWithin(cl.location::geography, ST_SetSRID(ST_MakePoint(-77.0428, -12.0464), 4326)::geography, 5000);
