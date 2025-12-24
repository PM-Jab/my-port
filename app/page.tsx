"use client";

import { useState } from "react";

type AssetType = "stock" | "gold" | "cryptocurrency" | "cash" | "credit_card_debt";

interface Asset {
  id: string;
  type: AssetType;
  name: string;
  amount: number;
  value: number;
  notes?: string;
}

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "stock" as AssetType,
    name: "",
    amount: "",
    value: "",
    notes: "",
  });

  const assetTypes = [
    { value: "stock", label: "Stock", icon: "📈" },
    { value: "gold", label: "Gold", icon: "🥇" },
    { value: "cryptocurrency", label: "Cryptocurrency", icon: "₿" },
    { value: "cash", label: "Cash", icon: "💵" },
    { value: "credit_card_debt", label: "Credit Card Debt", icon: "💳" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const value = parseFloat(formData.value);
    
    if (isNaN(amount) || isNaN(value)) {
      alert("Please enter valid numbers for amount and value");
      return;
    }
    
    const newAsset: Asset = {
      id: crypto.randomUUID(),
      type: formData.type,
      name: formData.name,
      amount,
      value,
      notes: formData.notes,
    };
    setAssets([...assets, newAsset]);
    setFormData({
      type: "stock",
      name: "",
      amount: "",
      value: "",
      notes: "",
    });
    setShowForm(false);
  };

  const deleteAsset = (id: string) => {
    setAssets(assets.filter((asset) => asset.id !== id));
  };

  const totalAssets = assets
    .filter((a) => a.type !== "credit_card_debt")
    .reduce((sum, asset) => sum + asset.value, 0);

  const totalDebts = assets
    .filter((a) => a.type === "credit_card_debt")
    .reduce((sum, asset) => sum + asset.value, 0);

  const netWorth = totalAssets - totalDebts;

  const getAssetsByType = (type: AssetType) => {
    return assets.filter((asset) => asset.type === type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            My Portfolio
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your assets and expenses
          </p>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Total Assets
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              ${totalAssets.toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Total Debts
            </h3>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              ${totalDebts.toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Net Worth
            </h3>
            <p className={`text-3xl font-bold ${
              netWorth >= 0 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              ${netWorth.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Add Asset Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
          >
            {showForm ? "Cancel" : "+ Add Asset/Expense"}
          </button>
        </div>

        {/* Add Asset Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Add New Asset/Expense
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as AssetType })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  {assetTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Apple Stock, Bitcoin, Chase Credit Card"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount/Quantity
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="e.g., 10 shares, 0.5 oz"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Total Value ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    placeholder="e.g., 1500.00"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Additional notes..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200"
              >
                Add to Portfolio
              </button>
            </form>
          </div>
        )}

        {/* Assets List by Type */}
        <div className="space-y-6">
          {assetTypes.map((typeInfo) => {
            const typeAssets = getAssetsByType(typeInfo.value as AssetType);
            if (typeAssets.length === 0) return null;

            const typeTotal = typeAssets.reduce((sum, asset) => sum + asset.value, 0);

            return (
              <div
                key={typeInfo.value}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {typeInfo.icon} {typeInfo.label}
                  </h2>
                  <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                    Total: ${typeTotal.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-3">
                  {typeAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {asset.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Amount: {asset.amount}
                        </p>
                        {asset.notes && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {asset.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-gray-800 dark:text-white">
                          ${asset.value.toFixed(2)}
                        </span>
                        <button
                          onClick={() => deleteAsset(asset.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-150"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {assets.length === 0 && !showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              No assets or expenses yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by adding your first asset or expense to track your portfolio
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200"
            >
              + Add Your First Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
