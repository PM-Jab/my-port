export type AssetType = 'stock' | 'gold' | 'crypto';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  currency: string;
}

export interface Debt {
  id: string;
  name: string;
  type: string;
  principal: number;
  interestRate: number;
  remainingBalance: number;
  monthlyPayment: number;
  currency: string;
}

export interface PortfolioSummary {
  totalAssets: number;
  totalDebts: number;
  netWorth: number;
  assetsByType: {
    stocks: number;
    gold: number;
    crypto: number;
  };
}
