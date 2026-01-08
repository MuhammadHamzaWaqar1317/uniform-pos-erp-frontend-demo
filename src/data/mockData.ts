// Mock Data for UniformHub POS & Inventory System

export type UserRole = 'admin' | 'manager' | 'sales';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch: string;
  avatar?: string;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  manager: string;
  phone: string;
  address: string;
  todaySales: number;
  totalItems: number;
  lowStockItems: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  size: string;
  price: number;
  stock: number;
  branch: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export interface CartItem extends InventoryItem {
  quantity: number;
}

export interface SalesData {
  date: string;
  sales: number;
}

export interface TopItem {
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
}

// Categories
export const categories = [
  'School Uniforms',
  'Corporate Wear',
  'Sports Uniforms',
  'Medical Scrubs',
  'Hospitality',
  'Industrial',
];

// Sizes
export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40'];

// Branches
export const branches: Branch[] = [
  { id: 'B001', name: 'Downtown Central', city: 'Mumbai', manager: 'Rajesh Kumar', phone: '+91 22 2345 6789', address: '123 MG Road, Fort', todaySales: 45250, totalItems: 312, lowStockItems: 8 },
  { id: 'B002', name: 'Bandra West', city: 'Mumbai', manager: 'Priya Sharma', phone: '+91 22 2987 6543', address: '45 Hill Road, Bandra', todaySales: 38900, totalItems: 289, lowStockItems: 5 },
  { id: 'B003', name: 'Koramangala Hub', city: 'Bangalore', manager: 'Vikram Singh', phone: '+91 80 4567 8901', address: '78 100 Feet Road', todaySales: 52100, totalItems: 345, lowStockItems: 12 },
  { id: 'B004', name: 'Indiranagar', city: 'Bangalore', manager: 'Ananya Patel', phone: '+91 80 3456 7890', address: '12 CMH Road', todaySales: 41800, totalItems: 298, lowStockItems: 6 },
  { id: 'B005', name: 'Connaught Place', city: 'Delhi', manager: 'Amit Verma', phone: '+91 11 2345 6789', address: 'Block F, CP', todaySales: 67500, totalItems: 421, lowStockItems: 15 },
  { id: 'B006', name: 'Salt Lake', city: 'Kolkata', manager: 'Sneha Das', phone: '+91 33 4567 8901', address: 'Sector V', todaySales: 29400, totalItems: 256, lowStockItems: 4 },
  { id: 'B007', name: 'Anna Nagar', city: 'Chennai', manager: 'Karthik Rajan', phone: '+91 44 2345 6789', address: '2nd Avenue', todaySales: 35600, totalItems: 278, lowStockItems: 7 },
  { id: 'B008', name: 'Aundh', city: 'Pune', manager: 'Meera Joshi', phone: '+91 20 4567 8901', address: 'DP Road', todaySales: 31200, totalItems: 245, lowStockItems: 3 },
];

// Item name generators
const itemPrefixes: Record<string, string[]> = {
  'School Uniforms': ['Classic', 'Premium', 'Standard', 'Elite', 'Basic'],
  'Corporate Wear': ['Executive', 'Professional', 'Business', 'Formal', 'Modern'],
  'Sports Uniforms': ['Athletic', 'Performance', 'Active', 'Dynamic', 'Pro'],
  'Medical Scrubs': ['Medical', 'Clinical', 'Healthcare', 'Hospital', 'Comfort'],
  'Hospitality': ['Hotel', 'Restaurant', 'Service', 'Hospitality', 'Classic'],
  'Industrial': ['Heavy-Duty', 'Safety', 'Work', 'Industrial', 'Durable'],
};

const itemTypes: Record<string, string[]> = {
  'School Uniforms': ['Shirt', 'Trousers', 'Skirt', 'Blazer', 'Sweater', 'Tie', 'Socks'],
  'Corporate Wear': ['Shirt', 'Trousers', 'Blazer', 'Vest', 'Tie', 'Dress'],
  'Sports Uniforms': ['Jersey', 'Shorts', 'Track Pants', 'T-Shirt', 'Jacket'],
  'Medical Scrubs': ['Top', 'Pants', 'Lab Coat', 'Jacket', 'Cap'],
  'Hospitality': ['Shirt', 'Trousers', 'Apron', 'Vest', 'Chef Coat'],
  'Industrial': ['Coverall', 'Jacket', 'Trousers', 'Vest', 'Gloves'],
};

// Generate 200 mock inventory items
export const generateInventoryItems = (): InventoryItem[] => {
  const items: InventoryItem[] = [];
  let idCounter = 1;

  categories.forEach((category) => {
    const prefixes = itemPrefixes[category];
    const types = itemTypes[category];
    
    for (let i = 0; i < 34; i++) {
      if (items.length >= 200) break;
      
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const branch = branches[Math.floor(Math.random() * branches.length)];
      const stock = Math.floor(Math.random() * 100);
      const price = Math.floor(Math.random() * 2500) + 200;
      
      let status: 'in-stock' | 'low-stock' | 'out-of-stock';
      if (stock === 0) status = 'out-of-stock';
      else if (stock < 10) status = 'low-stock';
      else status = 'in-stock';

      items.push({
        id: `ITM${String(idCounter).padStart(4, '0')}`,
        name: `${prefix} ${type}`,
        sku: `SKU-${category.substring(0, 3).toUpperCase()}-${String(idCounter).padStart(4, '0')}`,
        category,
        size,
        price,
        stock,
        branch: branch.name,
        status,
      });
      
      idCounter++;
    }
  });

  return items;
};

export const inventoryItems = generateInventoryItems();

// Generate daily sales data (last 30 days)
export const generateDailySales = (): SalesData[] => {
  const data: SalesData[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: Math.floor(Math.random() * 80000) + 20000,
    });
  }
  
  return data;
};

// Generate weekly sales data
export const generateWeeklySales = (): SalesData[] => {
  return [
    { date: 'Mon', sales: 45200 },
    { date: 'Tue', sales: 52800 },
    { date: 'Wed', sales: 48900 },
    { date: 'Thu', sales: 61200 },
    { date: 'Fri', sales: 58400 },
    { date: 'Sat', sales: 72100 },
    { date: 'Sun', sales: 38600 },
  ];
};

// Top selling items
export const topItems: TopItem[] = [
  { name: 'Premium School Shirt', category: 'School Uniforms', unitsSold: 342, revenue: 171000 },
  { name: 'Executive Blazer', category: 'Corporate Wear', unitsSold: 128, revenue: 384000 },
  { name: 'Athletic Jersey', category: 'Sports Uniforms', unitsSold: 256, revenue: 153600 },
  { name: 'Medical Scrub Top', category: 'Medical Scrubs', unitsSold: 198, revenue: 118800 },
  { name: 'Classic Hotel Shirt', category: 'Hospitality', unitsSold: 145, revenue: 87000 },
];

// Low stock items for alerts
export const lowStockItems = inventoryItems
  .filter(item => item.status === 'low-stock' || item.status === 'out-of-stock')
  .slice(0, 10);

// Role permissions
export const rolePermissions: Record<UserRole, string[]> = {
  admin: ['Dashboard', 'POS', 'Inventory', 'Branch Management', 'Reports', 'Security & Roles', 'Settings'],
  manager: ['Dashboard', 'POS', 'Inventory', 'Reports'],
  sales: ['POS'],
};

// Sample users
export const users: User[] = [
  { id: 'U001', name: 'Rajesh Kumar', email: 'rajesh@uniformhub.com', role: 'admin', branch: 'Downtown Central' },
  { id: 'U002', name: 'Priya Sharma', email: 'priya@uniformhub.com', role: 'manager', branch: 'Bandra West' },
  { id: 'U003', name: 'Arun Mehta', email: 'arun@uniformhub.com', role: 'sales', branch: 'Downtown Central' },
];

// Generate branch sales chart data
export const generateBranchSalesData = (branchId: string): SalesData[] => {
  const data: SalesData[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      sales: Math.floor(Math.random() * 30000) + 15000,
    });
  }
  
  return data;
};
