import React, { useState } from 'react';
import { MapPin, Phone, User, TrendingUp, Package, AlertTriangle, ArrowLeft, ExternalLink } from 'lucide-react';
import { branches, generateBranchSalesData, inventoryItems, Branch } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Branches: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const branchSalesData = selectedBranch ? generateBranchSalesData(selectedBranch.id) : [];
  const branchInventory = selectedBranch 
    ? inventoryItems.filter(item => item.branch === selectedBranch.name)
    : [];

  const branchStats = selectedBranch ? {
    totalItems: branchInventory.length,
    inStock: branchInventory.filter(i => i.status === 'in-stock').length,
    lowStock: branchInventory.filter(i => i.status === 'low-stock').length,
    outOfStock: branchInventory.filter(i => i.status === 'out-of-stock').length,
  } : null;

  if (selectedBranch) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Back Button */}
        <button
          onClick={() => setSelectedBranch(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Branches</span>
        </button>

        {/* Branch Header */}
        <div className="card-elevated p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{selectedBranch.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4" />
                {selectedBranch.address}, {selectedBranch.city}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">₹{selectedBranch.todaySales.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Today's Sales</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Manager</p>
                <p className="font-medium text-foreground">{selectedBranch.manager}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{selectedBranch.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="font-medium text-foreground">{branchStats?.totalItems}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="font-medium text-foreground">{selectedBranch.lowStockItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="card-elevated p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-foreground">Weekly Sales</h3>
            <p className="text-sm text-muted-foreground">Last 7 days performance</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={branchSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-elevated p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{branchStats?.inStock}</p>
                <p className="text-sm text-muted-foreground">In Stock</p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-success rounded-full"
                style={{ width: `${((branchStats?.inStock || 0) / (branchStats?.totalItems || 1)) * 100}%` }}
              />
            </div>
          </div>
          <div className="card-elevated p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{branchStats?.lowStock}</p>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-warning rounded-full"
                style={{ width: `${((branchStats?.lowStock || 0) / (branchStats?.totalItems || 1)) * 100}%` }}
              />
            </div>
          </div>
          <div className="card-elevated p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{branchStats?.outOfStock}</p>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-destructive rounded-full"
                style={{ width: `${((branchStats?.outOfStock || 0) / (branchStats?.totalItems || 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Branch Management</h1>
        <p className="text-muted-foreground">Monitor and manage all 8 branches across 6 cities</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-elevated p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Branches</p>
          <p className="text-3xl font-bold text-foreground">{branches.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Across 6 cities</p>
        </div>
        <div className="card-elevated p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Today's Sales</p>
          <p className="text-3xl font-bold text-foreground">
            ₹{branches.reduce((sum, b) => sum + b.todaySales, 0).toLocaleString()}
          </p>
          <p className="text-sm text-success mt-1">↑ 8.3% from yesterday</p>
        </div>
        <div className="card-elevated p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Inventory</p>
          <p className="text-3xl font-bold text-foreground">
            {branches.reduce((sum, b) => sum + b.totalItems, 0).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Items across all branches</p>
        </div>
        <div className="card-elevated p-5">
          <p className="text-sm text-muted-foreground mb-1">Low Stock Alerts</p>
          <p className="text-3xl font-bold text-warning">
            {branches.reduce((sum, b) => sum + b.lowStockItems, 0)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Items need attention</p>
        </div>
      </div>

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {branches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => setSelectedBranch(branch)}
            className="card-interactive p-5 text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{branch.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {branch.city}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{branch.manager}</span>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Today's Sales</p>
                <p className="text-xl font-bold text-foreground">₹{branch.todaySales.toLocaleString()}</p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{branch.totalItems} items</span>
                {branch.lowStockItems > 0 && (
                  <span className="badge-warning">{branch.lowStockItems} low</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Branches;
