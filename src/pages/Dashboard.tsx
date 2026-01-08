import React from 'react';
import { TrendingUp, TrendingDown, Package, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { branches, inventoryItems, generateDailySales, topItems } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const dailySales = generateDailySales();
  
  const totalSales = branches.reduce((sum, b) => sum + b.todaySales, 0);
  const totalItems = inventoryItems.length;
  const lowStockCount = inventoryItems.filter(i => i.status === 'low-stock' || i.status === 'out-of-stock').length;
  const activeBranches = branches.length;

  const stats = [
    {
      label: "Today's Sales",
      value: `₹${totalSales.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Total Items',
      value: totalItems.toString(),
      change: '+8',
      trend: 'up',
      icon: Package,
      color: 'bg-accent/10 text-accent',
    },
    {
      label: 'Low Stock Items',
      value: lowStockCount.toString(),
      change: '-3',
      trend: 'down',
      icon: AlertTriangle,
      color: 'bg-warning/10 text-warning',
    },
    {
      label: 'Active Branches',
      value: activeBranches.toString(),
      change: '0',
      trend: 'neutral',
      icon: ShoppingCart,
      color: 'bg-success/10 text-success',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your uniform business performance</p>
      </div>

      {/* Alert Banner */}
      <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-warning" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Low stock alert sent to admin at 9:00 AM</p>
          <p className="text-xs text-muted-foreground">{lowStockCount} items need attention across all branches</p>
        </div>
        <button className="btn-ghost text-sm">View Items</button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="card-elevated p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stat.trend === 'up' ? 'text-success' : stat.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {stat.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                {stat.trend === 'down' && <TrendingDown className="h-4 w-4" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 card-elevated p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Sales Trend</h3>
              <p className="text-sm text-muted-foreground">Last 30 days performance</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary text-sm py-1.5 px-3">Daily</button>
              <button className="btn-ghost text-sm py-1.5 px-3">Weekly</button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySales}>
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
                    boxShadow: 'var(--shadow-md)'
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

        {/* Top Items */}
        <div className="card-elevated p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-foreground">Top Selling Items</h3>
            <p className="text-sm text-muted-foreground">This month</p>
          </div>
          <div className="space-y-4">
            {topItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.unitsSold} units</p>
                </div>
                <p className="text-sm font-semibold text-foreground">₹{(item.revenue / 1000).toFixed(0)}k</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branch Performance */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">Branch Performance</h3>
            <p className="text-sm text-muted-foreground">Today's sales across all branches</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branches} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis 
                type="number"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                width={120}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-md)'
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
              />
              <Bar 
                dataKey="todaySales" 
                fill="hsl(var(--accent))" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
