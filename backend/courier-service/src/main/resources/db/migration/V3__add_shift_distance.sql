-- V3: Add total_distance_km to courier_shifts
ALTER TABLE courier_shifts ADD COLUMN total_distance_km DOUBLE PRECISION DEFAULT 0;
