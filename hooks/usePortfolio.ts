import { useState, useMemo } from 'react';
import { Asset, Debt, PortfolioSummary } from '@/types/finance';

const initialAssets: Asset[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    type: 'stock',
    symbol: 'AAPL',
    quantity: 50,
    purchasePrice: 150,
    currentPrice: 178.50,
    currency: 'USD',
  },
  {
    id: '2',
    name: 'Tesla Inc.',
    type: 'stock',
    symbol: 'TSLA',
    quantity: 20,
    purchasePrice: 200,
    currentPrice: 248.30,
    currency: 'USD',
  },
  {
    id: '3',
    name: 'Gold Bar',
    type: 'gold',
    symbol: 'XAU',
    quantity: 2,
    purchasePrice: 1800,
    currentPrice: 2050.00,
    currency: 'USD',
  },
  {
    id: '4',
    name: 'Bitcoin',
    type: 'crypto',
    symbol: 'BTC',
    quantity: 0.5,
    purchasePrice: 35000,
    currentPrice: 43250.00,
    currency: 'USD',
  },
  {
    id: '5',
    name: 'Ethereum',
    type: 'crypto',
    symbol: 'ETH',
    quantity: 5,
    purchasePrice: 1800,
    currentPrice: 2280.00,
    currency: 'USD',
  },
];

const initialDebts: Debt[] = [
  {
    id: '1',
    name: 'Home Mortgage',
    type: 'mortgage',
    principal: 300000,
    interestRate: 4.5,
    remainingBalance: 245000,
    monthlyPayment: 1520,
    currency: 'USD',
  },
  {
    id: '2',
    name: 'Car Loan',
    type: 'auto',
    principal: 25000,
    interestRate: 6.0,
    remainingBalance: 18500,
    monthlyPayment: 480,
    currency: 'USD',
  },
];

export function usePortfolio() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [debts, setDebts] = useState<Debt[]>(initialDebts);

  const summary: PortfolioSummary = useMemo(() => {
    const stocksValue = assets
      .filter((a) => a.type === 'stock')
      .reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);

    const goldValue = assets
      .filter((a) => a.type === 'gold')
      .reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);

    const cryptoValue = assets
      .filter((a) => a.type === 'crypto')
      .reduce((sum, a) => sum + a.quantity * a.currentPrice, 0);

    const totalAssets = stocksValue + goldValue + cryptoValue;
    const totalDebts = debts.reduce((sum, d) => sum + d.remainingBalance, 0);

    return {
      totalAssets,
      totalDebts,
      netWorth: totalAssets - totalDebts,
      assetsByType: {
        stocks: stocksValue,
        gold: goldValue,
        crypto: cryptoValue,
      },
    };
  }, [assets, debts]);

  const addAsset = (asset: Omit<Asset, 'id'>) => {
    setAssets((prev) => [...prev, { ...asset, id: crypto.randomUUID() }]);
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const addDebt = (debt: Omit<Debt, 'id'>) => {
    setDebts((prev) => [...prev, { ...debt, id: crypto.randomUUID() }]);
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  const deleteDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  return {
    assets,
    debts,
    summary,
    addAsset,
    updateAsset,
    deleteAsset,
    addDebt,
    updateDebt,
    deleteDebt,
  };
}
