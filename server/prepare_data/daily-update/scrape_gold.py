import yfinance as yf

def get_gold_price():
    """
    Scrapes the latest Gold Futures (GC=F) price using yfinance.
    
    Returns:
        float: The latest market price of gold.
    """
    try:
        # 'GC=F' is the ticker symbol for Gold Futures
        gold_ticker = yf.Ticker("GC=F")
        
        # Get the market data for the last 1 day
        data = gold_ticker.history(period="1d")
        
        # Check if data is available
        if data.empty:
            print("No data found for symbol GC=F")
            return None
            
        # Extract the latest 'Close' price
        latest_price = data['Close'].iloc[-1]
        
        return float(latest_price)

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

# --- Usage Example ---
current_price = get_gold_price()
if current_price:
    print(f"Current Gold Price: ${current_price:.2f}")