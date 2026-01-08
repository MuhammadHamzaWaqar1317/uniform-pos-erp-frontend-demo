import React, { useState, useMemo } from 'react';
import { Search, Filter, Package, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { inventoryItems, categories, branches, InventoryItem } from '@/data/mockData';

type StatusFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
type SortField = 'name' | 'stock' | 'price' | 'category';
type SortOrder = 'asc' | 'desc';

const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filteredItems = useMemo(() => {
    let items = [...inventoryItems];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      items = items.filter(item => item.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      items = items.filter(item => item.status === statusFilter);
    }

    // Branch filter
    if (branchFilter !== 'all') {
      items = items.filter(item => item.branch === branchFilter);
    }

    // Sorting
    items.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return items;
  }, [searchQuery, categoryFilter, statusFilter, branchFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in-stock':
        return <span className="badge-success">In Stock</span>;
      case 'low-stock':
        return <span className="badge-warning">Low Stock</span>;
      case 'out-of-stock':
        return <span className="badge-danger">Out of Stock</span>;
    }
  };

  const stats = {
    total: inventoryItems.length,
    inStock: inventoryItems.filter(i => i.status === 'in-stock').length,
    lowStock: inventoryItems.filter(i => i.status === 'low-stock').length,
    outOfStock: inventoryItems.filter(i => i.status === 'out-of-stock').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">Manage and track all uniform items</p>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Low stock alert sent to admin at 9:00 AM</p>
          <p className="text-xs text-muted-foreground">{stats.lowStock + stats.outOfStock} items need attention</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.inStock}</p>
              <p className="text-sm text-muted-foreground">In Stock</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.lowStock}</p>
              <p className="text-sm text-muted-foreground">Low Stock</p>
            </div>
          </div>
        </div>
        <div className="card-elevated p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.outOfStock}</p>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-elevated p-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-search pl-11 w-full"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-search w-48"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="input-search w-40"
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="input-search w-48"
          >
            <option value="all">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.name}>{branch.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header px-4 py-3">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Item Name
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="table-header px-4 py-3">SKU</th>
                <th className="table-header px-4 py-3">
                  <button
                    onClick={() => handleSort('category')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Category
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="table-header px-4 py-3">Size</th>
                <th className="table-header px-4 py-3">
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Price
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="table-header px-4 py-3">
                  <button
                    onClick={() => handleSort('stock')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Stock
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="table-header px-4 py-3">Branch</th>
                <th className="table-header px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr 
                  key={item.id}
                  className={`border-b border-border hover:bg-muted/30 transition-colors ${
                    index % 2 === 0 ? 'bg-card' : 'bg-muted/10'
                  }`}
                >
                  <td className="table-cell font-medium">{item.name}</td>
                  <td className="table-cell text-muted-foreground font-mono text-xs">{item.sku}</td>
                  <td className="table-cell">{item.category}</td>
                  <td className="table-cell">{item.size}</td>
                  <td className="table-cell font-medium">₹{item.price.toLocaleString()}</td>
                  <td className="table-cell">
                    <span className={`font-medium ${
                      item.stock === 0 ? 'text-destructive' :
                      item.stock < 10 ? 'text-warning' : 'text-foreground'
                    }`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="table-cell text-muted-foreground text-sm">{item.branch}</td>
                  <td className="table-cell">{getStatusBadge(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Showing {filteredItems.length} of {inventoryItems.length} items
          </p>
          <div className="flex items-center gap-2">
            <button className="btn-ghost text-sm py-1.5 px-3" disabled>Previous</button>
            <button className="btn-ghost text-sm py-1.5 px-3" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
