import pandas as pd
import requests
from io import StringIO
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL
import datetime

# --- 1. Database Configuration ---
DB_CONFIG = {
    "drivername": "postgresql",
    "username": "appuser",      
    "password": "asset",        
    "host": "localhost",        
    "port": 6001,               
    "database": "asset_db"      
}

def get_db_engine():
    url = URL.create(**DB_CONFIG)
    return create_engine(url)

# --- 2. Database Initialization ---
def init_db(engine):
    create_schema_sql = text("CREATE SCHEMA IF NOT EXISTS asset;")
    
    create_table_sql = text("""
        CREATE TABLE IF NOT EXISTS asset.sp500_symbols (
            symbol VARCHAR(10) PRIMARY KEY,
            security_name VARCHAR(255),
            gics_sector VARCHAR(100),
            gics_sub_industry VARCHAR(100),
            headquarters VARCHAR(255),
            date_added DATE,
            cik VARCHAR(20),
            founded VARCHAR(50),
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    with engine.connect() as conn:
        conn.execute(create_schema_sql)
        conn.execute(create_table_sql)
        conn.commit()
    print("Schema 'asset' and table 'sp500_symbols' are ready.")

# --- 3. Scraping Logic (ROBUST FIX) ---
def fetch_sp500_data():
    url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    print(f"Fetching data from {url}...")
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        dfs = pd.read_html(StringIO(response.text))
        df = dfs[0]
        
        # DEBUG: Print columns to see what Wikipedia is currently using
        # print(f"Raw Columns Found: {df.columns.tolist()}")

        # Robust Renaming: Handles multiple variations of column names
        rename_map = {
            "Symbol": "symbol",
            "Security": "security_name",
            "Company": "security_name",       # Variation
            "GICS Sector": "gics_sector",
            "GICS Sub-Industry": "gics_sub_industry",
            "Headquarters Location": "headquarters",
            "Date first added": "date_added", # Old variation
            "Date added": "date_added",       # New variation (The Fix)
            "CIK": "cik",
            "Founded": "founded"
        }
        df = df.rename(columns=rename_map)
        
        # CHECK: If 'date_added' is still missing, create it as empty to prevent crash
        if 'date_added' not in df.columns:
            print("Warning: 'date_added' column not found. Setting to NULL.")
            df['date_added'] = None

        # Clean up data
        df['date_added'] = pd.to_datetime(df['date_added'], errors='coerce')
        df['cik'] = df['cik'].astype(str)
        df['updated_at'] = datetime.datetime.now()
        
        print(f"Successfully fetched {len(df)} symbols.")
        return df
        
    except Exception as e:
        print(f"Error scraping Wikipedia: {e}")
        # Print columns if available to help debug
        if 'df' in locals():
            print(f"Current DataFrame Columns: {df.columns.tolist()}")
        return pd.DataFrame()

# --- 4. Saving to Database ---
def save_to_database(df, engine):
    if df.empty:
        print("No data to save.")
        return

    print("Saving to database...")
    
    upsert_sql = text("""
        INSERT INTO asset.sp500_symbols (symbol, security_name, gics_sector, gics_sub_industry, headquarters, date_added, cik, founded, updated_at)
        VALUES (:symbol, :security_name, :gics_sector, :gics_sub_industry, :headquarters, :date_added, :cik, :founded, :updated_at)
        ON CONFLICT (symbol) 
        DO UPDATE SET 
            security_name = EXCLUDED.security_name,
            gics_sector = EXCLUDED.gics_sector,
            gics_sub_industry = EXCLUDED.gics_sub_industry,
            headquarters = EXCLUDED.headquarters,
            date_added = EXCLUDED.date_added,
            cik = EXCLUDED.cik,
            founded = EXCLUDED.founded,
            updated_at = EXCLUDED.updated_at;
    """)

    with engine.connect() as conn:
        data_to_insert = df.to_dict(orient='records')
        
        for row in data_to_insert:
            if pd.isna(row['date_added']):
                row['date_added'] = None
        
        try:
            conn.execute(upsert_sql, data_to_insert)
            conn.commit()
            print("Database update successful.")
        except Exception as e:
            print(f"Error writing to database: {e}")

# --- Main Execution ---
if __name__ == "__main__":
    db_engine = get_db_engine()
    init_db(db_engine)
    sp500_df = fetch_sp500_data()
    save_to_database(sp500_df, db_engine)