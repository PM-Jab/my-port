import time
import urllib.parse
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from sqlalchemy import create_engine, text
import pandas as pd

# --- 1. Database Configuration ---
DB_HOST = 'localhost'
DB_PORT = '6001'
DB_USER = 'appuser'
DB_PASS = 'asset'
DB_NAME = 'asset_db'

DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}'

# --- 2. Database Functions ---

def get_db_engine():
    return create_engine(DATABASE_URI)

def init_db(engine):
    """Creates the symbols table if it doesn't exist."""
    create_table_sql = """
    SET SCHEMA 'asset';
    CREATE TABLE IF NOT EXISTS set_symbols (
        symbol VARCHAR(20) PRIMARY KEY,
        industry_group VARCHAR(50),
        sector VARCHAR(50),
        market VARCHAR(10) DEFAULT 'SET',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    with engine.connect() as conn:
        conn.execute(text(create_table_sql))
        conn.commit()
    print("Database table 'set_symbols' check complete.")

def save_symbols_to_db(symbols_list):
    if not symbols_list:
        print("No symbols to save.")
        return

    engine = get_db_engine()
    init_db(engine)
    
    insert_sql = text("""
        INSERT INTO set_symbols (symbol, industry_group, sector, market, updated_at)
        VALUES (:symbol, :group, :sector, 'SET', NOW())
        ON CONFLICT (symbol) 
        DO UPDATE SET 
            industry_group = EXCLUDED.industry_group,
            sector = EXCLUDED.sector,
            updated_at = NOW();
    """)

    print(f"Saving {len(symbols_list)} symbols to database...")
    
    with engine.connect() as conn:
        for item in symbols_list:
            try:
                conn.execute(insert_sql, {
                    "symbol": item['symbol'], 
                    "group": item['group'],
                    "sector": item['sector']
                })
            except Exception as e:
                print(f"Error saving {item['symbol']}: {e}")
        conn.commit()
    print("Database update successful.")

# --- 3. Scraping Logic (FIXED) ---

def scrape_set_symbols():
    industry_groups = [
        {'agro': ['agri', 'food']}, 
        {'consump': ['fashion', 'home', 'person']}, 
        {'fincial': ['bank', 'fin', 'insur']}, 
        {'indus': ['auto', 'imm', 'paper', 'petro', 'pkg', 'steel']}, 
        {'propcon': ['conmat', 'prop', 'pf&reit', 'cons']}, 
        {'resourc': ['energ', 'mine']}, 
        {'service': ['comm', 'helth', 'media', 'prof', 'tourism', 'trans']},
        {'tech': ['etron', 'ict']}
    ]

    options = webdriver.ChromeOptions()
    options.add_argument("--headless") 
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    # Adding window size ensures elements are rendered in view (sometimes helps with lazy loading)
    options.add_argument("--window-size=1920,1080")
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    collected_data = []
    
    print(f"Starting scrape of {len(industry_groups)} industry groups...")
    
    try:
        for entry in industry_groups:
            group_key = list(entry.keys())[0]
            subgroups = entry[group_key]
            
            for subgroup in subgroups:
                # Handle special chars like & in URL
                safe_subgroup = urllib.parse.quote(subgroup)
                url = f"https://www.set.or.th/th/market/index/set/{group_key}/{safe_subgroup}"
                print(f"Scraping: {group_key} -> {subgroup} ...")

                driver.get(url)
                time.sleep(5) # Wait for Vue.js

                # --- NEW SELECTOR STRATEGY BASED ON IMAGE ---
                # Strategy 1: Find the div with class "symbol" (visible text)
                elements = driver.find_elements(By.CSS_SELECTOR, "div.symbol")
                
                # Strategy 2: If that fails, find the anchor tag with data-symbol attribute
                if not elements:
                    elements = driver.find_elements(By.CSS_SELECTOR, "a[data-symbol]")

                count = 0
                for elem in elements:
                    # If we found the div.symbol, elem.text is the symbol (e.g. "AAI")
                    # If we found the a[data-symbol], we need to get the attribute
                    symbol = elem.text.strip()
                    
                    if not symbol:
                        # Try getting from attribute if text is empty (fallback)
                        symbol = elem.get_attribute("data-symbol")

                    if symbol and len(symbol) < 15:
                        collected_data.append({
                            'symbol': symbol,
                            'group': group_key.upper(),
                            'sector': subgroup.upper()
                        })
                        count += 1

                print(f"   -> Found {count} symbols.")
            
    except Exception as e:
        print(f"Scraping Error: {e}")
    finally:
        driver.quit()
        
    return collected_data

# --- Main Execution ---

if __name__ == "__main__":
    symbols = scrape_set_symbols()
    if symbols:
        save_symbols_to_db(symbols)
    else:
        print("No symbols found. Check internet connection or selectors.")