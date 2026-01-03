"use client";

import { useState } from 'react';
import { TrendingUp, Coins, Bitcoin, CreditCard } from 'lucide-react';
import { Header } from '@/components/dashboard/Header';
import { NetWorthCard } from '@/components/dashboard/NetWorthCard';
import { AssetDistributionChart } from '@/components/dashboard/AssetDistributionChart';
import { AssetCard } from '@/components/dashboard/AssetCard';
import { DebtCard } from '@/components/dashboard/DebtCard';
import { AddAssetDialog } from '@/components/dashboard/AddAssetDialog';
import { AddDebtDialog } from '@/components/dashboard/AddDebtDialog';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Asset, Debt } from '@/types/finance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const {
    assets,
    debts,
    summary,
    addAsset,
    updateAsset,
    deleteAsset,
    addDebt,
    updateDebt,
    deleteDebt,
  } = usePortfolio();

  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [debtDialogOpen, setDebtDialogOpen] = useState(false);

  const stockAssets = assets.filter((a) => a.type === 'stock');
  const goldAssets = assets.filter((a) => a.type === 'gold');
  const cryptoAssets = assets.filter((a) => a.type === 'crypto');

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setAssetDialogOpen(true);
  };

  const handleEditDebt = (debt: Debt) => {
    setEditingDebt(debt);
    setDebtDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Overview Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-6">Portfolio Overview</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <NetWorthCard summary={summary} />
            <AssetDistributionChart summary={summary} />
          </div>
        </section>

        {/* Assets Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Assets</h2>
            <AddAssetDialog
              onAdd={addAsset}
              editAsset={editingAsset}
              onUpdate={updateAsset}
              open={assetDialogOpen}
              onOpenChange={(open) => {
                setAssetDialogOpen(open);
                if (!open) setEditingAsset(null);
              }}
            />
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 bg-secondary/50">
              <TabsTrigger value="all" className="gap-2">
                All <span className="text-muted-foreground text-xs">({assets.length})</span>
              </TabsTrigger>
              <TabsTrigger value="stocks" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Stocks <span className="text-muted-foreground text-xs">({stockAssets.length})</span>
              </TabsTrigger>
              <TabsTrigger value="gold" className="gap-2">
                <Coins className="h-4 w-4" />
                Gold <span className="text-muted-foreground text-xs">({goldAssets.length})</span>
              </TabsTrigger>
              <TabsTrigger value="crypto" className="gap-2">
                <Bitcoin className="h-4 w-4" />
                Crypto <span className="text-muted-foreground text-xs">({cryptoAssets.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {assets.map((asset) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    onEdit={handleEditAsset}
                    onDelete={deleteAsset}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stocks">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stockAssets.map((asset) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    onEdit={handleEditAsset}
                    onDelete={deleteAsset}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gold">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {goldAssets.map((asset) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    onEdit={handleEditAsset}
                    onDelete={deleteAsset}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="crypto">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cryptoAssets.map((asset) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    onEdit={handleEditAsset}
                    onDelete={deleteAsset}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Debts Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                <CreditCard className="h-5 w-5 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Debts</h2>
            </div>
            <AddDebtDialog
              onAdd={addDebt}
              editDebt={editingDebt}
              onUpdate={updateDebt}
              open={debtDialogOpen}
              onOpenChange={(open) => {
                setDebtDialogOpen(open);
                if (!open) setEditingDebt(null);
              }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {debts.map((debt) => (
              <DebtCard
                key={debt.id}
                debt={debt}
                onEdit={handleEditDebt}
                onDelete={deleteDebt}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 WealthTracker. Your personal finance companion.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
