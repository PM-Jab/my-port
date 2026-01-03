import requests
from bs4 import BeautifulSoup

def scrape_set_stock_prices(symbols):
    """
    Scrapes stock prices from set.or.th based on the provided list of symbols.
    
    Args:
        symbols (list): A list of stock symbol strings, e.g., ['KTC', 'LH']
        
    Returns:
        list: A list of dictionaries with {symbol: price} or {'NON': 0} if not found.
    """
    results = []
    
    # Headers are necessary to mimic a real browser request
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    for symbol in symbols:
        # Construct the URL as requested
        url = f"https://www.set.or.th/th/market/product/stock/quote/{symbol.upper()}/price"
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Target the specific DIV class from your screenshot
                # Class: "value text-white mb-0 me-2 lh-1 stock-info"
                price_element = soup.find('div', class_="value text-white mb-0 me-2 lh-1 stock-info")
                
                if price_element:
                    # Extract text (e.g., "26.25"), remove commas, and convert to float
                    price_text = price_element.get_text(strip=True).replace(',', '')
                    price_val = float(price_text)
                    results.append({symbol.upper(): price_val})
                else:
                    # Element not found in the HTML
                    results.append({symbol.upper(): 0})
            else:
                # HTTP error (e.g., 404 if page doesn't exist)
                results.append({symbol.upper(): 0})
                
        except Exception as e:
            # Handle connection errors or parsing issues
            print(f"Error scraping {symbol}: {e}")
            results.append({symbol.upper(): 0})
            
    return results

# --- Usage Example ---
symbols_to_scrape = ['KTC', 'LH', 'KBANK', 'INVALID_SYMBOL']
prices = scrape_set_stock_prices(symbols_to_scrape)
print(prices)
# Expected Output format: [{'KTC': 43.5}, {'LH': 9.8}, {'KBANK': 130.0}, {'NON': 0}]