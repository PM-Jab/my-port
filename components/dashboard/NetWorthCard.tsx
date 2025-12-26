import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { PortfolioSummary } from '@/types/finance';

interface NetWorthCardProps {
  summary: PortfolioSummary;
}

export function NetWorthCard({ summary }: NetWorthCardProps) {
  const isPositive = summary.netWorth >= 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-card p-8 border border-border glow-gold animate-fade-in">
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Net Worth</p>
            <div className="flex items-center gap-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={`text-xs font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
                {isPositive ? '+12.5%' : '-12.5%'} this month
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-5xl font-bold text-gradient-gold mb-8">
          {formatCurrency(summary.netWorth)}
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Assets</p>
            <p className="text-2xl font-semibold text-success">
              {formatCurrency(summary.totalAssets)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Debts</p>
            <p className="text-2xl font-semibold text-destructive">
              {formatCurrency(summary.totalDebts)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
