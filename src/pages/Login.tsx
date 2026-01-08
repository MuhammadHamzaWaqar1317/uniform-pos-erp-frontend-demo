import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ChevronDown, Shirt, Users, Shield, BarChart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/data/mockData';

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  { value: 'admin', label: 'Administrator', description: 'Full system access' },
  { value: 'manager', label: 'Branch Manager', description: 'Branch & inventory access' },
  { value: 'sales', label: 'Sales Associate', description: 'POS only' },
];

const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@uniformhub.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('admin');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = login(email, password, role);
    
    if (success) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  const selectedRole = roleOptions.find(r => r.value === role)!;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <Shirt className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">UniformHub</h1>
              <p className="text-sm text-muted-foreground">POS & Inventory System</p>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to manage your uniform business</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-search pl-11"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-search pl-11"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Role Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sign in as</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="w-full input-search flex items-center justify-between"
                >
                  <span className="text-foreground">{selectedRole.label}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showRoleDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg border border-border shadow-elevated z-10 animate-scale-in">
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setRole(option.value);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          role === option.value ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="text-left">
                          <p className="text-sm font-medium text-foreground">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                        {role === option.value && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-12 text-base"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>

            {/* Demo Info */}
            <p className="text-center text-xs text-muted-foreground">
              Demo mode: Any email works. Select a role to explore permissions.
            </p>
          </form>
        </div>
      </div>

      {/* Right - Illustration */}
      <div className="hidden lg:flex flex-1 bg-primary/5 items-center justify-center p-12">
        <div className="max-w-lg animate-slide-in">
          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="card-elevated p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">8 Branches</h3>
              <p className="text-sm text-muted-foreground">Across 6 cities</p>
            </div>
            
            <div className="card-elevated p-4">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                <Shirt className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">200+ Items</h3>
              <p className="text-sm text-muted-foreground">In inventory</p>
            </div>
            
            <div className="card-elevated p-4">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center mb-3">
                <BarChart className="h-5 w-5 text-success" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Real-time</h3>
              <p className="text-sm text-muted-foreground">Sales tracking</p>
            </div>
            
            <div className="card-elevated p-4">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center mb-3">
                <Shield className="h-5 w-5 text-warning" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Role-based</h3>
              <p className="text-sm text-muted-foreground">Access control</p>
            </div>
          </div>

          {/* Tagline */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Streamline Your Uniform Business
            </h2>
            <p className="text-muted-foreground">
              Complete POS and inventory management for uniform retailers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
