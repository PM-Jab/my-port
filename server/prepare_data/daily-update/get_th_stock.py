import yfinance as yf

def get_set_prices(symbols):
    """
    Fetches the current price for a list of SET (Thailand) stocks using yfinance.
    
    Args:
        symbols (list): List of symbol strings, e.g., ['KTC', 'LH', 'KBANK']
        
    Returns:
        list: List of dictionaries, e.g., [{'KTC': 43.50}, {'LH': 9.80}]
    """
    results = []
    
    for symbol in symbols:
        # 1. Append the suffix '.BK' for Thailand stocks
        ticker_symbol = f"{symbol.upper()}.BK"
        
        try:
            stock = yf.Ticker(ticker_symbol)
            
            # 2. Get the latest price efficiently
            # fast_info.last_price gets the most recent trade or closing price
            price = stock.fast_info.last_price
            
            if price is not None:
                # Return the original symbol as key (without .BK)
                results.append({symbol.upper(): round(price, 2)})
            else:
                results.append({symbol.upper(): None})
                
        except Exception as e:
            print(f"Error fetching {symbol}: {e}")
            results.append({symbol.upper(): None})
            
    return results

# --- Usage Example ---
def test_set_prices():
    set_symbols = ['KTC', 'LH', 'KBANK', 'PTT']
    prices = get_set_prices(set_symbols)

    print(prices)
    # Example Output: [{'KTC': 43.5}, {'LH': 9.8}, {'KBANK': 130.0}, {'PTT': 34.25}]