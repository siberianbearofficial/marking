-- Create the users table
CREATE TABLE users (
    uuid UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL,
    records_id_list JSONB -- Storing the list of record IDs as a JSONB field
);

-- Create the records table
CREATE TABLE records (
    uuid UUID PRIMARY KEY,
    quadrilateral_barcode JSONB, -- Storing quadrilateral as JSONB
    barcode_score REAL,
    quadrilateral_logo JSONB, -- Storing quadrilateral as JSONB
    logo_score REAL,
    approved BOOLEAN NOT NULL,
    user_id UUID, -- Foreign Key to represent the relationship with users
    FOREIGN KEY (user_id) REFERENCES users (uuid)
);
