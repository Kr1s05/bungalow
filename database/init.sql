-- Create a new user
CREATE USER bungalow_user WITH PASSWORD '1234';

-- Create a new database
CREATE DATABASE bungalow;

-- Grant all privileges on the new database to the new user
GRANT ALL PRIVILEGES ON DATABASE bungalow TO bungalow_user;
