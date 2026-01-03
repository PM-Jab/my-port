import pytest
from get_th_stock import get_set_prices

def test_get_set_prices():
    # Test with known SET symbols
    test_symbols = ['KTC', 'LH', 'KBANK']
    prices = get_set_prices(test_symbols)
    
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