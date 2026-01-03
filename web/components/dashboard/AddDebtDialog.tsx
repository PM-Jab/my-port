import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Debt } from '@/types/finance';
import { useToast } from '@/hooks/use-toast';

interface AddDebtDialogProps {
  onAdd: (debt: Omit<Debt, 'id'>) => void;
  editDebt?: Debt | null;
  onUpdate?: (id: string, updates: Partial<Debt>) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddDebtDialog({ onAdd, editDebt, onUpdate, open, onOpenChange }: AddDebtDialogProps) {
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  const [formData, setFormData] = useState({
    name: editDebt?.name || '',
    type: editDebt?.type || 'mortgage',
    principal: editDebt?.principal.toString() || '',
    interestRate: editDebt?.interestRate.toString() || '',
    remainingBalance: editDebt?.remainingBalance.toString() || '',
    monthlyPayment: editDebt?.monthlyPayment.toString() || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const debt = {
      name: formData.name,
      type: formData.type,
      principal: parseFloat(formData.principal),
      interestRate: parseFloat(formData.interestRate),
      remainingBalance: parseFloat(formData.remainingBalance),
      monthlyPayment: parseFloat(formData.monthlyPayment),
      currency: 'USD',
    };

    if (editDebt && onUpdate) {
      onUpdate(editDebt.id, debt);
      toast({
        title: 'Debt updated',
        description: `${debt.name} has been updated successfully.`,
      });
    } else {
      onAdd(debt);
      toast({
        title: 'Debt added',
        description: `${debt.name} has been added to your records.`,
      });
    }

    setIsOpen(false);
    setFormData({
      name: '',
      type: 'mortgage',
      principal: '',
      interestRate: '',
      remainingBalance: '',
      monthlyPayment: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Debt
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editDebt ? 'Edit Debt' : 'Add New Debt'}</DialogTitle>
          <DialogDescription>
            {editDebt ? 'Update your debt details below.' : 'Add a new debt to track.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="debtName">Name</Label>
            <Input
              id="debtName"
              placeholder="e.g., Home Mortgage"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="debtType">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mortgage">Mortgage</SelectItem>
                <SelectItem value="auto">Auto Loan</SelectItem>
                <SelectItem value="student">Student Loan</SelectItem>
                <SelectItem value="credit">Credit Card</SelectItem>
                <SelectItem value="personal">Personal Loan</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="principal">Principal ($)</Label>
              <Input
                id="principal"
                type="number"
                step="any"
                placeholder="0"
                value={formData.principal}
                onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="any"
                placeholder="0.0"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="remainingBalance">Remaining Balance ($)</Label>
              <Input
                id="remainingBalance"
                type="number"
                step="any"
                placeholder="0"
                value={formData.remainingBalance}
                onChange={(e) => setFormData({ ...formData, remainingBalance: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyPayment">Monthly Payment ($)</Label>
              <Input
                id="monthlyPayment"
                type="number"
                step="any"
                placeholder="0"
                value={formData.monthlyPayment}
                onChange={(e) => setFormData({ ...formData, monthlyPayment: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editDebt ? 'Update Debt' : 'Add Debt'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
