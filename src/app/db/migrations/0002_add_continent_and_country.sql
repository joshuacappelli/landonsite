-- Add country column to posts table
ALTER TABLE posts ADD COLUMN country TEXT NOT NULL DEFAULT 'Unknown';

-- Add continent column to locations table
ALTER TABLE locations ADD COLUMN continent TEXT NOT NULL DEFAULT 'Unknown'; 