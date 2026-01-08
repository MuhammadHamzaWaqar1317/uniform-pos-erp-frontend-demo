import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Building2,
  BarChart3,
  Shield,
  Settings,
  Shirt,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  permission: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    permission: "Dashboard",
  },
  {
    label: "POS",
    path: "/pos",
    icon: <ShoppingCart className="h-5 w-5" />,
    permission: "POS",
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: <Package className="h-5 w-5" />,
    permission: "Inventory",
  },
  {
    label: "Branches",
    path: "/branches",
    icon: <Building2 className="h-5 w-5" />,
    permission: "Branch Management",
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <BarChart3 className="h-5 w-5" />,
    permission: "Reports",
  },
  {
    label: "Security",
    path: "/security",
    icon: <Shield className="h-5 w-5" />,
    permission: "Security & Roles",
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { hasPermission } = useAuth();

  const filteredNavItems = navItems.filter((item) =>
    hasPermission(item.permission)
  );

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="h-16 px-6 flex items-center border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Shirt className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">UniformHub</h1>
            <p className="text-xs text-muted-foreground">POS & Inventory</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={isActive ? "nav-item-active" : "nav-item"}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="card-elevated p-3 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-1">Today's Sales</p>
          <p className="text-lg font-semibold text-foreground">₹3,41,750</p>
          <p className="text-xs text-success">↑ 12% from yesterday</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
