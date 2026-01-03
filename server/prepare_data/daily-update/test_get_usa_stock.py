import pytest
from get_usa_stock import get_nasdaq_prices, get_nyse_prices

def test_get_nasdaq_prices():
    # Test with known NASDAQ symbols
    test_symbols = ['AAPL', 'MSFT', 'GOOGL']
    prices = get_nasdaq_prices(test_symbols)
    
    # Check that we received a list of the correct length
    assert isinstance(prices, list)
    assert len(prices) == len(test_symbols)
    
    # Check that each entry is a dictionary with the correct key
    for symbol, price_dict in zip(test_symbols, prices):
        assert isinstance(price_dict, dict)
        assert symbol.upper() in price_dict
        
        # Check that the price is either a float or None
        price = price_dict[symbol.upper()]
        assert price is None or isinstance(price, float)

def test_get_nyse_prices():
    # Test with known NYSE symbols
    test_symbols = ['IBM', 'GE', 'BA']
    prices = get_nyse_prices(test_symbols)
    
    # Check that we received a list of the correct length
    assert isinstance(prices, list)
    assert len(prices) == len(test_symbols)
    
    # Check that each entry is a dictionary with the correct key
    for symbol, price_dict in zip(test_symbols, prices):
        assert isinstance(price_dict, dict)
        assert symbol.upper() in price_dict
        
        # Check that the price is either a float or None
        price = price_dict[symbol.upper()]
        assert price is None or isinstance(price, float)