import yfinance as yf

def get_nasdaq_prices(symbols):
    """
    Fetches the latest market price for a list of NASDAQ symbols.
    
    Args:
        symbols (list): A list of symbol strings, e.g., ['NVDA', 'AAPL', 'TSLA']
        
    Returns:
        list: A list of dictionaries, e.g., [{'NVDA': 120.50}, {'AAPL': 180.00}]
    """
    results = []
    
    for symbol in symbols:
        try:
            # Initialize the Ticker object
            ticker = yf.Ticker(symbol)
            
            # fast_info is the most efficient way to get the latest price 
            # without downloading historical dataframes.
            # 'last_price' covers the most recent close or real-time price if market is open.
            price = ticker.fast_info.last_price
            
            if price:
                results.append({symbol: round(price, 2)})
            else:
                # Fallback if fast_info fails (e.g., delisted stock)
                results.append({symbol: None})
                
        except Exception as e:
            # Handle invalid symbols or connection errors
            print(f"Error fetching {symbol}: {e}")
            results.append({symbol: None})
            
    return results

def get_nyse_prices(symbols):
    """
    Fetches the latest market price for a list of NYSE symbols.
    
    Args:
        symbols (list): A list of symbol strings, e.g., ['BA', 'JPM', 'KO']
        
    Returns:
        list: A list of dictionaries, e.g., [{'BA': 145.20}, {'JPM': 170.50}]
    """
    results = []
    
    for symbol in symbols:
        try:
            # Initialize the Ticker object
            ticker = yf.Ticker(symbol)
            
            # fast_info.last_price provides the most recent trade price
            # This works for both Real-time (during market hours) and Closing price
            price = ticker.fast_info.last_price
            
            if price:
                results.append({symbol: round(price, 2)})
            else:
                results.append({symbol: None})
                
        except Exception as e:
            print(f"Error fetching {symbol}: {e}")
            results.append({symbol: None})
            
    return results

# --- Usage Example ---

def test_nasdaq():
    my_portfolio = ['NVDA', 'MSFT', 'TSLA', 'INVALID_SYM']
    current_prices = get_nasdaq_prices(my_portfolio)

    print(current_prices)
    # Output example: [{'NVDA': 124.32}, {'MSFT': 415.10}, {'TSLA': 175.44}, {'INVALID_SYM': None}]

def test_nyse():
    my_portfolio = ['BA', 'JPM', 'KO', 'INVALID_SYM']
    current_prices = get_nyse_prices(my_portfolio)

    print(current_prices)
    # Output example: [{'BA': 145.20}, {'JPM': 170.50}, {'KO': 62.30}, {'INVALID_SYM': None}]

# test_nasdaq()
# test_nyse()