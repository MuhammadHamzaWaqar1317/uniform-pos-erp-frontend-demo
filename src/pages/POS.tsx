import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  X,
  Check,
  Printer,
} from "lucide-react";
import { inventoryItems, InventoryItem } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const POS: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "upi">(
    "cash"
  );

  const {
    items: cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    total,
  } = useCart();

  // Get available items (in stock)
  const availableItems = useMemo(() => {
    return inventoryItems.filter((item) => item.stock > 0);
  }, []);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return availableItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [availableItems, searchQuery, selectedCategory]);

  const categories = [
    "all",
    ...new Set(inventoryItems.map((item) => item.category)),
  ];

  const getStockBadge = (item: InventoryItem) => {
    if (item.stock < 10) {
      return <span className="badge-warning">Low</span>;
    }
    return <span className="badge-success">In Stock</span>;
  };

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) return;
    setShowPayment(true);
  };

  const handleConfirmPayment = () => {
    setShowPayment(false);
    setShowReceipt(true);
  };

  const handleCompleteTransaction = () => {
    clearCart();
    setShowReceipt(false);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 animate-fade-in">
      {/* Left Panel - Item Grid */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search & Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search items by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-search pl-11 w-full"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category === "all" ? "All Items" : category}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="empty-state h-full">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No items found
              </h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredItems.slice(0, 24).map((item) => (
                <button
                  key={item.id}
                  onClick={() => addItem(item)}
                  className="card-interactive p-4 text-left group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-muted-foreground">
                      {item.sku}
                    </span>
                    {getStockBadge(item)}
                  </div>
                  <h4 className="font-medium text-foreground mb-1 line-clamp-2">
                    {item.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {item.size} • {item.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-foreground">
                      Rs{item.price}
                    </p>
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="w-96 flex flex-col card-elevated">
        {/* Cart Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              <h3 className="font-semibold text-foreground">Current Order</h3>
            </div>
            {cartItems.length > 0 && (
              <span className="badge-neutral">{cartItems.length} items</span>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="empty-state h-full">
              <ShoppingCart className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Cart is empty</p>
              <p className="text-xs text-muted-foreground mt-1">
                Click on items to add them
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.size} • Rs{item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-7 w-7 rounded-md bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-7 w-7 rounded-md bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-foreground w-16 text-right">
                    Rs{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="h-7 w-7 rounded-md hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="p-4 border-t border-border space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">
                Rs{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="text-foreground">Rs{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">
                Rs{total.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={clearCart}
              disabled={cartItems.length === 0}
              className="btn-outline disabled:opacity-50"
            >
              Clear Cart
            </button>
            <button
              onClick={handleProceedToPayment}
              disabled={cartItems.length === 0}
              className="btn-primary disabled:opacity-50"
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Payment Methods */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "cash", label: "Cash", icon: Banknote },
                { id: "card", label: "Card", icon: CreditCard },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() =>
                    setPaymentMethod(method.id as typeof paymentMethod)
                  }
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <method.icon
                    className={`h-6 w-6 ${
                      paymentMethod === method.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      paymentMethod === method.id
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {method.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Amount Summary */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">
                  Rs{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GST (18%)</span>
                <span className="text-foreground">
                  Rs{tax.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-2 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-primary">Rs{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              className="btn-accent w-full h-12 text-base"
            >
              <Check className="mr-2 h-5 w-5" />
              Confirm Payment
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <Check className="h-5 w-5" />
              Payment Successful
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {/* Receipt Preview */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="text-center pb-4 border-b border-dashed border-border">
                <h4 className="font-bold text-foreground">UniformHub</h4>
                <p className="text-xs text-muted-foreground">
                  Downtown Central Branch
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date().toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="space-y-2 pb-4 border-b border-dashed border-border">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-foreground">
                      Rs{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    Rs{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span className="text-foreground">
                    Rs{tax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-border">
                  <span className="text-foreground">Total Paid</span>
                  <span className="text-foreground">
                    Rs{total.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Paid via {paymentMethod.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="btn-outline flex-1">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </button>
              <button
                onClick={handleCompleteTransaction}
                className="btn-primary flex-1"
              >
                New Order
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POS;
