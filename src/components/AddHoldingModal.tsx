"use client";

import { useState, useMemo } from "react";
import { ASSETS } from "@/lib/data";
import { usePortfolio } from "@/context/PortfolioContext";
import { X, Search, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AddHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddHoldingModal({ isOpen, onClose }: AddHoldingModalProps) {
  const { addHolding, portfolio } = usePortfolio();
  const [step, setStep] = useState<"select" | "details">("select");
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [quantity, setQuantity] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const availableAssets = useMemo(() => {
    const heldIds = new Set(portfolio.holdings.map((h) => h.assetId));
    let assets = ASSETS.filter((a) => !heldIds.has(a.id));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      assets = assets.filter(
        (a) =>
          a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q)
      );
    }
    return assets;
  }, [portfolio, searchQuery]);

  const selectedAsset = ASSETS.find((a) => a.id === selectedAssetId);

  const handleSubmit = () => {
    if (!selectedAssetId || !quantity || parseFloat(quantity) <= 0) return;
    addHolding({
      assetId: selectedAssetId,
      quantity: parseFloat(quantity),
      avgBuyPrice: parseFloat(avgPrice) || selectedAsset?.price || 0,
    });
    handleClose();
  };

  const handleClose = () => {
    setStep("select");
    setSelectedAssetId("");
    setQuantity("");
    setAvgPrice("");
    setSearchQuery("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">
            {step === "select" ? "Select Asset" : `Add ${selectedAsset?.name}`}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <X size={20} className="text-text-muted" />
          </button>
        </div>

        {step === "select" ? (
          <div className="p-4">
            <div className="flex items-center bg-background border border-border rounded-lg px-3 py-2 gap-2 mb-4">
              <Search size={16} className="text-text-muted" />
              <input
                type="text"
                placeholder="Search assets..."
                className="bg-transparent text-sm outline-none w-full text-text-primary placeholder-text-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {availableAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => {
                    setSelectedAssetId(asset.id);
                    setAvgPrice(asset.price.toString());
                    setStep("details");
                  }}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-sm">
                    {asset.icon}
                  </span>
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm font-medium">{asset.name}</div>
                    <div className="text-xs text-text-muted">
                      {asset.symbol} · {asset.class}
                    </div>
                  </div>
                  <div className="text-sm text-text-secondary">
                    {formatCurrency(asset.price)}
                  </div>
                </button>
              ))}
              {availableAssets.length === 0 && (
                <div className="text-center text-text-muted py-8 text-sm">
                  No assets available
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <span className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center text-lg">
                {selectedAsset?.icon}
              </span>
              <div>
                <div className="font-medium">{selectedAsset?.name}</div>
                <div className="text-sm text-text-muted">
                  Current: {selectedAsset && formatCurrency(selectedAsset.price)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                autoFocus
                min="0"
                step="any"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Average Buy Price (USD)
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                value={avgPrice}
                onChange={(e) => setAvgPrice(e.target.value)}
                min="0"
                step="any"
              />
            </div>

            {quantity && parseFloat(quantity) > 0 && (
              <div className="p-3 bg-background rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Total Cost</span>
                  <span className="font-medium">
                    {formatCurrency(
                      parseFloat(quantity) * (parseFloat(avgPrice) || 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Current Value</span>
                  <span className="font-medium">
                    {formatCurrency(
                      parseFloat(quantity) * (selectedAsset?.price || 0)
                    )}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep("select")}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-surface-hover transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!quantity || parseFloat(quantity) <= 0}
                className="flex-1 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Add Holding
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
