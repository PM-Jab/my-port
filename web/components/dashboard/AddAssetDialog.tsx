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
import { Asset, AssetType } from '@/types/finance';
import { useToast } from '@/hooks/use-toast';

interface AddAssetDialogProps {
  onAdd: (asset: Omit<Asset, 'id'>) => void;
  editAsset?: Asset | null;
  onUpdate?: (id: string, updates: Partial<Asset>) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddAssetDialog({ onAdd, editAsset, onUpdate, open, onOpenChange }: AddAssetDialogProps) {
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

  const [formData, setFormData] = useState<{
    name: string;
    type: AssetType;
    symbol: string;
    quantity: string;
    purchasePrice: string;
    currentPrice: string;
  }>({
    name: editAsset?.name || '',
    type: editAsset?.type || 'stock',
    symbol: editAsset?.symbol || '',
    quantity: editAsset?.quantity.toString() || '',
    purchasePrice: editAsset?.purchasePrice.toString() || '',
    currentPrice: editAsset?.currentPrice.toString() || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assetType = formData.type as AssetType;
    const asset: Omit<Asset, 'id'> = {
      name: formData.name,
      type: assetType,
      symbol: formData.symbol.toUpperCase(),
      quantity: parseFloat(formData.quantity),
      purchasePrice: parseFloat(formData.purchasePrice),
      currentPrice: parseFloat(formData.currentPrice),
      currency: 'USD',
    };

    if (editAsset && onUpdate) {
      onUpdate(editAsset.id, asset);
      toast({
        title: 'Asset updated',
        description: `${asset.name} has been updated successfully.`,
      });
    } else {
      onAdd(asset);
      toast({
        title: 'Asset added',
        description: `${asset.name} has been added to your portfolio.`,
      });
    }

    setIsOpen(false);
    setFormData({
      name: '',
      type: 'stock',
      symbol: '',
      quantity: '',
      purchasePrice: '',
      currentPrice: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Asset
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editAsset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
          <DialogDescription>
            {editAsset ? 'Update your asset details below.' : 'Add a new asset to your portfolio.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="e.g., Apple Inc."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: AssetType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                placeholder="e.g., AAPL"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              step="any"
              placeholder="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
              <Input
                id="purchasePrice"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPrice">Current Price ($)</Label>
              <Input
                id="currentPrice"
                type="number"
                step="any"
                placeholder="0.00"
                value={formData.currentPrice}
                onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editAsset ? 'Update Asset' : 'Add Asset'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
