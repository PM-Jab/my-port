SET SCHEMA 'asset';

CREATE TABLE IF NOT EXISTS stock_books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    sub_industry VARCHAR(50) NOT NULL,
    amount INT NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'THB',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50) DEFAULT 'system',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50) DEFAULT 'system'
);

CREATE TABLE IF NOT EXISTS crypto_books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount INT NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'THB',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50) DEFAULT 'system',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50) DEFAULT 'system'
);

CREATE TABLE IF NOT EXISTS gold_books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    gold_purity VARCHAR(50) NOT NULL,
    amount INT NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'THB',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50) DEFAULT 'system',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50) DEFAULT 'system'
);