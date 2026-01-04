-- 1. Setup Schema and Enum Types
CREATE SCHEMA IF NOT EXISTS asset;

-- Create a custom type for transaction side to ensure data consistency
-- This prevents typos like 'buy', 'Buy', 'purchase', etc.
DO $$ BEGIN
    CREATE TYPE asset.transaction_side AS ENUM ('BUY', 'SELL', 'DIVIDEND', 'TRANSFER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- --------------------------------------------------------
-- 2. Create Tables
-- --------------------------------------------------------

-- TABLE: STOCK BOOKS
CREATE TABLE IF NOT EXISTS asset.stock_books (
    id SERIAL PRIMARY KEY,
    side asset.transaction_side NOT NULL, -- New: BUY or SELL
    symbol VARCHAR(10) NOT NULL,
    title VARCHAR(100) NOT NULL,
    industry VARCHAR(100),
    sub_industry VARCHAR(50),
    market VARCHAR(50),
    amount DECIMAL(18, 4) NOT NULL,       -- Precision for fractional shares
    price DECIMAL(18, 2) NOT NULL,        -- Standard currency precision
    currency VARCHAR(10) DEFAULT 'THB',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50) DEFAULT 'system',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50) DEFAULT 'system'
);

-- TABLE: CRYPTO BOOKS
CREATE TABLE IF NOT EXISTS asset.crypto_books (
    id SERIAL PRIMARY KEY,
    side asset.transaction_side NOT NULL, -- New: BUY or SELL
    symbol VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    amount DECIMAL(28, 18) NOT NULL,      -- High precision for small crypto units (e.g. 0.00000001 BTC)
    price DECIMAL(28, 18) NOT NULL,       -- High precision for low price tokens
    currency VARCHAR(10) DEFAULT 'THB',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50) DEFAULT 'system',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50) DEFAULT 'system'
);

-- TABLE: GOLD BOOKS
CREATE TABLE IF NOT EXISTS asset.gold_books (
    id SERIAL PRIMARY KEY,
    side asset.transaction_side NOT NULL, -- New: BUY or SELL
    title VARCHAR(100) NOT NULL,
    gold_purity DECIMAL(5, 2) NOT NULL,   -- Numeric: 96.50 or 99.99
    amount DECIMAL(18, 4) NOT NULL,       -- Weight
    unit VARCHAR(20) DEFAULT 'GRAM',      -- New: GRAM, BAHT, OUNCE
    price DECIMAL(18, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'THB',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50) DEFAULT 'system',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50) DEFAULT 'system'
);
