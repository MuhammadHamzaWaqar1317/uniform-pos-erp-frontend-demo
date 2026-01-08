import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { generateDailySales, generateWeeklySales, topItems, lowStockItems, branches } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Reports: React.FC = () => {
  const dailySales = generateDailySales();
  const weeklySales = generateWeeklySales();

  const totalWeeklySales = weeklySales.reduce((sum, d) => sum + d.sales, 0);
  const avgDailySales = totalWeeklySales / 7;
  const bestDay = weeklySales.reduce((max, d) => d.sales > max.sales ? d : max, weeklySales[0]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground">Analytics and insights for your uniform business</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <span className="flex items-center gap-1 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              +12.5%
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">₹{totalWeeklySales.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Weekly Revenue</p>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-accent" />
            </div>
            <span className="flex items-center gap-1 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              +8.2%
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">₹{Math.round(avgDailySales).toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Avg Daily Sales</p>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-success" />
            </div>
            <span className="badge-success">{bestDay.date}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₹{bestDay.sales.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Best Day This Week</p>
        </div>

        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-warning" />
            </div>
            <span className="flex items-center gap-1 text-sm text-destructive">
              <TrendingDown className="h-4 w-4" />
              -2.1%
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{branches.length}</p>
          <p className="text-sm text-muted-foreground">Active Branches</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Chart */}
        <div className="card-elevated p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-foreground">Daily Sales Trend</h3>
            <p className="text-sm text-muted-foreground">Last 30 days performance</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
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
                  dot={false}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Sales Bar Chart */}
        <div className="card-elevated p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-foreground">Weekly Sales</h3>
            <p className="text-sm text-muted-foreground">This week's performance by day</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
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
                <Bar 
                  dataKey="sales" 
                  fill="hsl(var(--accent))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Items */}
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Top 5 Selling Items</h3>
            <p className="text-sm text-muted-foreground">Best performers this month</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header py-2 px-0">#</th>
                  <th className="table-header py-2">Item</th>
                  <th className="table-header py-2">Category</th>
                  <th className="table-header py-2 text-right">Units</th>
                  <th className="table-header py-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="table-cell py-3 px-0">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                        {index + 1}
                      </span>
                    </td>
                    <td className="table-cell py-3 font-medium">{item.name}</td>
                    <td className="table-cell py-3 text-muted-foreground text-sm">{item.category}</td>
                    <td className="table-cell py-3 text-right">{item.unitsSold}</td>
                    <td className="table-cell py-3 text-right font-semibold">₹{(item.revenue / 1000).toFixed(0)}k</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Low Stock Alerts</h3>
            <p className="text-sm text-muted-foreground">Items requiring attention</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header py-2">Item</th>
                  <th className="table-header py-2">SKU</th>
                  <th className="table-header py-2">Branch</th>
                  <th className="table-header py-2 text-right">Stock</th>
                  <th className="table-header py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.slice(0, 5).map((item) => (
                  <tr key={item.id} className="border-b border-border">
                    <td className="table-cell py-3 font-medium">{item.name}</td>
                    <td className="table-cell py-3 text-muted-foreground text-xs font-mono">{item.sku}</td>
                    <td className="table-cell py-3 text-sm text-muted-foreground">{item.branch}</td>
                    <td className="table-cell py-3 text-right font-semibold text-warning">{item.stock}</td>
                    <td className="table-cell py-3 text-right">
                      {item.status === 'out-of-stock' ? (
                        <span className="badge-danger">Out</span>
                      ) : (
                        <span className="badge-warning">Low</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
