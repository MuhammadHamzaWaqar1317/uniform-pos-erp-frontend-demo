import React from 'react';
import { Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/data/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  manager: 'Branch Manager',
  sales: 'Sales Associate',
};

const roleColors: Record<UserRole, string> = {
  admin: 'bg-primary/10 text-primary',
  manager: 'bg-accent/10 text-accent',
  sales: 'bg-warning/10 text-warning',
};

const TopBar: React.FC = () => {
  const { user, logout, switchRole } = useAuth();

  if (!user) return null;

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      {/* Left - Breadcrumb / Title */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Welcome back, {user.name.split(' ')[0]}</h2>
        <p className="text-sm text-muted-foreground">{user.branch}</p>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-4">
        {/* Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${roleColors[user.role]}`}>
              {roleLabels[user.role]}
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => switchRole('admin')}>
              <span className={`w-2 h-2 rounded-full mr-2 ${user.role === 'admin' ? 'bg-primary' : 'bg-muted'}`} />
              Administrator
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchRole('manager')}>
              <span className={`w-2 h-2 rounded-full mr-2 ${user.role === 'manager' ? 'bg-accent' : 'bg-muted'}`} />
              Branch Manager
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchRole('sales')}>
              <span className={`w-2 h-2 rounded-full mr-2 ${user.role === 'sales' ? 'bg-warning' : 'bg-muted'}`} />
              Sales Associate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-muted transition-colors">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
