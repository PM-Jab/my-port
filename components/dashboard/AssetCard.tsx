import { TrendingUp, TrendingDown, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Asset } from '@/types/finance';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AssetCardProps {
  asset: Asset;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

export function AssetCard({ asset, onEdit, onDelete }: AssetCardProps) {
  const totalValue = asset.quantity * asset.currentPrice;
  const totalCost = asset.quantity * asset.purchasePrice;
  const profitLoss = totalValue - totalCost;
  const profitLossPercent = ((profitLoss / totalCost) * 100).toFixed(2);
  const isPositive = profitLoss >= 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: asset.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stock':
        return 'bg-chart-3/20 text-chart-3';
      case 'gold':
        return 'bg-primary/20 text-primary';
      case 'crypto':
        return 'bg-chart-4/20 text-chart-4';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="group rounded-xl bg-card border border-border p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg animate-scale-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-bold text-foreground">
            {asset.symbol.slice(0, 2)}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{asset.name}</h4>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getTypeColor(asset.type)}`}>
                {asset.type.toUpperCase()}
              </span>
              <span className="text-xs text-muted-foreground">{asset.symbol}</span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(asset)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(asset.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Quantity</span>
          <span className="text-sm font-medium text-foreground">{asset.quantity}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Price</span>
          <span className="text-sm font-medium text-foreground">{formatCurrency(asset.currentPrice)}</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total Value</span>
          <span className="text-lg font-bold text-foreground">{formatCurrency(totalValue)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Profit/Loss</span>
          <div className={`flex items-center gap-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="text-sm font-semibold">
              {isPositive ? '+' : ''}{formatCurrency(profitLoss)} ({isPositive ? '+' : ''}{profitLossPercent}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
