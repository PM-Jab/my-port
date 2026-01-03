import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PortfolioSummary } from '@/types/finance';
import { TrendingUp, Coins, Bitcoin } from 'lucide-react';

interface AssetDistributionChartProps {
  summary: PortfolioSummary;
}

const COLORS = [
  'hsl(220, 70%, 60%)',   // stocks - blue
  'hsl(45, 93%, 58%)',    // gold - gold
  'hsl(280, 70%, 60%)',   // crypto - purple
];

export function AssetDistributionChart({ summary }: AssetDistributionChartProps) {
  const data = [
    { name: 'Stocks', value: summary.assetsByType.stocks, icon: TrendingUp },
    { name: 'Gold', value: summary.assetsByType.gold, icon: Coins },
    { name: 'Crypto', value: summary.assetsByType.crypto, icon: Bitcoin },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg px-4 py-2">
          <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
          <p className="text-sm text-primary">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-gradient-card p-6 border border-border animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <h3 className="text-lg font-semibold text-foreground mb-6">Asset Distribution</h3>
      
      <div className="flex items-center gap-6">
        <div className="h-48 w-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-4">
          {data.map((item, index) => {
            const Icon = item.icon;
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
            
            return (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${COLORS[index]}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: COLORS[index] }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{percentage}%</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(item.value)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
