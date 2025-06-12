-- Make location and country nullable
ALTER TABLE posts ALTER COLUMN location DROP NOT NULL;
ALTER TABLE posts ALTER COLUMN country DROP NOT NULL; 