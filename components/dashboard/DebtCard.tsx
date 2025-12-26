import { CreditCard, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Debt } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DebtCardProps {
  debt: Debt;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

export function DebtCard({ debt, onEdit, onDelete }: DebtCardProps) {
  const paidPercent = ((debt.principal - debt.remainingBalance) / debt.principal) * 100;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: debt.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mortgage':
        return '🏠';
      case 'auto':
        return '🚗';
      case 'student':
        return '🎓';
      case 'credit':
        return '💳';
      default:
        return '📋';
    }
  };

  return (
    <div className="group rounded-xl bg-card border border-border p-5 transition-all duration-300 hover:border-destructive/30 hover:shadow-lg animate-scale-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-xl">
            {getTypeIcon(debt.type)}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{debt.name}</h4>
            <span className="text-xs font-medium text-muted-foreground uppercase">
              {debt.type}
            </span>
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
            <DropdownMenuItem onClick={() => onEdit(debt)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(debt.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Paid Off</span>
            <span className="text-sm font-medium text-foreground">{paidPercent.toFixed(1)}%</span>
          </div>
          <Progress value={paidPercent} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Remaining</p>
            <p className="text-lg font-bold text-destructive">{formatCurrency(debt.remainingBalance)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Monthly</p>
            <p className="text-lg font-semibold text-foreground">{formatCurrency(debt.monthlyPayment)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Interest Rate</span>
          <span className="text-sm font-semibold text-foreground">{debt.interestRate}%</span>
        </div>
      </div>
    </div>
  );
}
