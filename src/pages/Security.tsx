import React, { useState } from 'react';
import { Shield, User, UserCheck, ShoppingCart, Check, X, Eye, EyeOff } from 'lucide-react';
import { rolePermissions, UserRole } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

interface RoleInfo {
  id: UserRole;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  userCount: number;
}

const roles: RoleInfo[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access including security settings and user management',
    icon: <Shield className="h-6 w-6" />,
    color: 'bg-primary/10 text-primary',
    userCount: 2,
  },
  {
    id: 'manager',
    name: 'Branch Manager',
    description: 'Access to branch operations, inventory, and reports',
    icon: <UserCheck className="h-6 w-6" />,
    color: 'bg-accent/10 text-accent',
    userCount: 8,
  },
  {
    id: 'sales',
    name: 'Sales Associate',
    description: 'Point of sale access only for daily transactions',
    icon: <ShoppingCart className="h-6 w-6" />,
    color: 'bg-warning/10 text-warning',
    userCount: 24,
  },
];

const allScreens = [
  'Dashboard',
  'POS',
  'Inventory',
  'Branch Management',
  'Reports',
  'Security & Roles',
  'Settings',
];

const Security: React.FC = () => {
  const { user, switchRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  const handleDemoSwitch = (role: UserRole) => {
    switchRole(role);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Security & Roles</h1>
        <p className="text-muted-foreground">Manage user roles and access permissions</p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setSelectedRole(role.id)}
            className={`card-elevated p-5 text-left transition-all ${
              selectedRole === role.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`h-12 w-12 rounded-xl ${role.color} flex items-center justify-center`}>
                {role.icon}
              </div>
              {selectedRole === role.id && (
                <span className="badge-success">Selected</span>
              )}
            </div>
            <h3 className="font-semibold text-foreground mb-1">{role.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
            <p className="text-xs text-muted-foreground">
              {role.userCount} users with this role
            </p>
          </button>
        ))}
      </div>

      {/* Permissions Table */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">Permission Matrix</h3>
            <p className="text-sm text-muted-foreground">Screen access by role</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="h-4 w-4 rounded bg-success/20 flex items-center justify-center">
                <Check className="h-3 w-3 text-success" />
              </div>
              <span className="text-muted-foreground">Allowed</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-4 w-4 rounded bg-destructive/20 flex items-center justify-center">
                <X className="h-3 w-3 text-destructive" />
              </div>
              <span className="text-muted-foreground">Denied</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header py-3 text-left">Screen</th>
                {roles.map((role) => (
                  <th key={role.id} className="table-header py-3 text-center">{role.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allScreens.map((screen) => (
                <tr key={screen} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="table-cell py-4 font-medium">{screen}</td>
                  {roles.map((role) => {
                    const hasAccess = rolePermissions[role.id].includes(screen);
                    return (
                      <td key={role.id} className="table-cell py-4 text-center">
                        {hasAccess ? (
                          <div className="h-6 w-6 rounded bg-success/20 flex items-center justify-center mx-auto">
                            <Check className="h-4 w-4 text-success" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded bg-destructive/10 flex items-center justify-center mx-auto">
                            <X className="h-4 w-4 text-destructive/60" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demo Mode */}
      <div className="card-elevated p-6 bg-muted/30">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Eye className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Demo Mode: Experience Different Roles</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click a button below to switch your current role and see how the navigation changes based on permissions.
              Currently viewing as: <span className="font-semibold text-foreground">{user?.role}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleDemoSwitch(role.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    user?.role === role.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border hover:bg-muted'
                  }`}
                >
                  Switch to {role.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Role Details */}
      <div className="card-elevated p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-foreground">
            {roles.find(r => r.id === selectedRole)?.name} Permissions
          </h3>
          <p className="text-sm text-muted-foreground">Detailed access list for selected role</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {allScreens.map((screen) => {
            const hasAccess = rolePermissions[selectedRole].includes(screen);
            return (
              <div
                key={screen}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  hasAccess ? 'bg-success/10' : 'bg-muted/50'
                }`}
              >
                {hasAccess ? (
                  <Check className="h-5 w-5 text-success" />
                ) : (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                )}
                <span className={hasAccess ? 'text-foreground' : 'text-muted-foreground'}>
                  {screen}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Security;
