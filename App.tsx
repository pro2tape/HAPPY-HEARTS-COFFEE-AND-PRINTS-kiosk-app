import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Utensils, User, Clock, TrendingUp, Home, Coffee, Sparkles, Trash2, Plus, Minus, CheckCircle, LogOut, Play, Pause, Grid, IceCream, Sandwich, Soup, GlassWater, Beer, Printer, X, Settings, Download, FileSpreadsheet, Monitor, Lock, AlertCircle, Image as ImageIcon, Upload } from 'lucide-react';
import { MENU_ITEMS as INITIAL_MENU_ITEMS, STAFF_MEMBERS as INITIAL_STAFF_MEMBERS } from './constants';
import { CartItem, Category, MenuItem, MenuItemVariant, Order, OrderStatus, StaffLog, StaffMember } from './types';
import { getRecommendation } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Components ---

// 0. Receipt Component (Hidden until print)
const Receipt = ({ order }: { order: Order | null }) => {
  if (!order) return null;
  
  // Format order number to 3 digits (e.g., 001)
  const orderNum = order.orderNumber.toString().padStart(3, '0');

  return (
    <div className="hidden print:block print:w-full font-mono text-xs leading-tight">
       {/* Customer Copy */}
       <div className="mb-8 pb-4">
         <h2 className="text-center font-bold text-xl mb-1">Happy Hearts</h2>
         <p className="text-center text-sm mb-4">Coffee & Prints</p>
         <p className="text-center font-bold mb-2 border-b border-black pb-1">CUSTOMER COPY</p>
         
         <div className="flex justify-between mb-1 text-lg font-bold">
            <span>Order #:</span>
            <span>{orderNum}</span>
         </div>
         <div className="flex justify-between mb-4">
            <span>{new Date(order.timestamp).toLocaleString()}</span>
         </div>
         {order.customerName && <p className="mb-2">Customer: {order.customerName}</p>}

         <hr className="border-dashed border-black my-2"/>
         
         {order.items.map((item, i) => (
           <div key={i} className="mb-2">
             <div className="flex justify-between font-bold">
               <span>{item.quantity}x {item.name}</span>
               <span>P{((item.selectedVariant?.price || item.basePrice || 0) * item.quantity).toFixed(2)}</span>
             </div>
             {item.selectedVariant && (
                <div className="text-[10px] pl-4">- {item.selectedVariant.name}</div>
             )}
           </div>
         ))}
         
         <hr className="border-black my-2"/>
         <div className="flex justify-between font-bold text-sm">
           <span>TOTAL</span>
           <span>P{order.total.toFixed(2)}</span>
         </div>
         <p className="text-center mt-4">Thank you for your support!</p>
       </div>

       {/* Cut Line */}
       <div className="text-center mb-8 text-[10px] border-b-2 border-dashed border-gray-400 py-2">
         - - - - - CUT HERE - - - - -
       </div>

       {/* Shop Copy */}
       <div>
         <h2 className="text-center font-bold text-xl mb-1">Happy Hearts</h2>
         <p className="text-center font-bold mb-2 border-b border-black pb-1">SHOP COPY</p>
         
         <div className="flex justify-between mb-1 text-lg font-bold">
            <span>Order #:</span>
            <span>{orderNum}</span>
         </div>
         <div className="flex justify-between mb-4">
            <span>{new Date(order.timestamp).toLocaleString()}</span>
         </div>
         {order.customerName && <p className="mb-2 font-bold text-lg">NAME: {order.customerName}</p>}

         <hr className="border-dashed border-black my-2"/>
         
         {order.items.map((item, i) => (
           <div key={i} className="mb-2">
             <div className="flex justify-between font-bold">
               <span>{item.quantity}x {item.name}</span>
               <span>P{((item.selectedVariant?.price || item.basePrice || 0) * item.quantity).toFixed(2)}</span>
             </div>
             {item.selectedVariant && (
                <div className="text-[10px] pl-4">- {item.selectedVariant.name}</div>
             )}
           </div>
         ))}
         
         <hr className="border-black my-2"/>
         <div className="flex justify-between font-bold text-sm">
           <span>TOTAL</span>
           <span>P{order.total.toFixed(2)}</span>
         </div>
       </div>
    </div>
  );
}

// 1. Navigation / Layout
const Layout = ({ children, role }: { children?: React.ReactNode; role: 'customer' | 'admin' }) => {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans print:bg-white">
      <nav className="bg-white shadow-sm border-b border-stone-100 p-4 sticky top-0 z-50 print:hidden">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl font-handwriting shadow-sm">
              H
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 hidden md:block tracking-tight">
              Happy Hearts <span className="text-orange-600 text-base font-normal">Coffee & Prints</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {role === 'customer' ? (
               <div className="flex gap-4">
                 <Link to="/" className="flex items-center gap-1 text-gray-600 hover:text-orange-600 font-medium transition-colors">
                   <Home size={20} /> <span className="hidden sm:inline">Menu</span>
                 </Link>
                 <Link to="/cart" className="flex items-center gap-1 text-gray-600 hover:text-orange-600 font-medium transition-colors">
                   <ShoppingCart size={20} /> <span className="hidden sm:inline">Cart</span>
                 </Link>
                 <Link to="/admin-login" className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm transition-colors">
                   <User size={16} /> Staff
                 </Link>
               </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/admin/dashboard" className="flex items-center gap-1 text-gray-600 hover:text-orange-600 font-medium transition-colors">
                   <TrendingUp size={20} /> <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link to="/admin/orders" className="flex items-center gap-1 text-gray-600 hover:text-orange-600 font-medium transition-colors">
                   <Utensils size={20} /> <span className="hidden sm:inline">Kitchen</span>
                </Link>
                <Link to="/admin/attendance" className="flex items-center gap-1 text-gray-600 hover:text-orange-600 font-medium transition-colors">
                   <Clock size={20} /> <span className="hidden sm:inline">Time Clock</span>
                </Link>
                <Link to="/admin/settings" className="flex items-center gap-1 text-gray-600 hover:text-orange-600 font-medium transition-colors">
                   <Settings size={20} /> <span className="hidden sm:inline">Settings</span>
                </Link>
                 <Link to="/" className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium ml-4 transition-colors">
                   <LogOut size={20} /> <span className="hidden sm:inline">Exit</span>
                 </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-grow container mx-auto p-4 md:p-6 print:p-0 print:w-full print:max-w-none">
        {children}
      </main>
      <footer className="bg-stone-800 text-stone-300 p-6 text-center text-sm mt-auto print:hidden">
        <p>© 2024 Happy Hearts Coffee & Prints. All rights reserved.</p>
      </footer>
    </div>
  );
};

const CategoryIcon = ({ category, className, size }: { category: Category; className?: string; size?: number }) => {
  switch (category) {
    case Category.IcedCoffee: return <Coffee className={className} size={size} />;
    case Category.HotCoffee: return <Coffee className={className} size={size} />;
    case Category.Frappe: return <IceCream className={className} size={size} />;
    case Category.MilkTea: return <GlassWater className={className} size={size} />;
    case Category.FruitSoda: return <Beer className={className} size={size} />;
    case Category.Meals: return <Soup className={className} size={size} />;
    case Category.Snacks: return <Sandwich className={className} size={size} />;
    case Category.Dessert: return <IceCream className={className} size={size} />;
    default: return <Utensils className={className} size={size} />;
  }
};

const KioskMenu = ({ 
  items,
  addToCart 
}: { 
  items: MenuItem[],
  addToCart: (item: MenuItem, variant?: MenuItemVariant) => void 
}) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [mood, setMood] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(i => i.category === activeCategory);

  const handleAiRecommend = async () => {
    if(!mood) return;
    setIsThinking(true);
    const rec = await getRecommendation(mood, items);
    setRecommendation(rec);
    setIsThinking(false);
  };

  const getCategoryColor = (cat: Category) => {
    switch(cat) {
      case Category.IcedCoffee: return 'bg-amber-900 text-amber-50';
      case Category.HotCoffee: return 'bg-amber-800 text-amber-50';
      case Category.Frappe: return 'bg-pink-500 text-white';
      case Category.MilkTea: return 'bg-orange-300 text-orange-900';
      case Category.FruitSoda: return 'bg-lime-500 text-white';
      case Category.Meals: return 'bg-yellow-500 text-white';
      case Category.Snacks: return 'bg-red-500 text-white';
      case Category.Dessert: return 'bg-purple-500 text-white';
      default: return 'bg-gray-800 text-white';
    }
  };

  return (
    <div>
      {/* AI Section */}
      <div className="bg-white p-6 rounded-2xl mb-8 shadow-sm border border-stone-200 print:hidden">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-3">
          <Sparkles className="text-orange-500" size={20} /> Not sure what to order?
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            placeholder="How are you feeling? (e.g., Sleepy, Happy, Hungry)" 
            className="flex-grow p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none transition-shadow"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
          <button 
            onClick={handleAiRecommend}
            disabled={isThinking || !mood}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isThinking ? 'Asking Chef...' : 'Get Recommendation'}
          </button>
        </div>
        {recommendation && (
          <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100 text-orange-800 italic animate-fade-in">
             "{recommendation}"
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar mask-linear-fade print:hidden">
        <button 
          onClick={() => setActiveCategory('All')}
          className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${activeCategory === 'All' ? 'bg-gray-900 text-white shadow-lg scale-105' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          All Menu
        </button>
        {Object.values(Category).map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all flex items-center gap-2 ${activeCategory === cat ? 'bg-orange-600 text-white shadow-lg scale-105' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            <CategoryIcon category={cat} className="w-4 h-4" />
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 print:hidden">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col group h-full overflow-hidden">
            {item.image ? (
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                 <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                 <div className={`absolute top-2 right-2 p-1.5 rounded-full shadow-sm ${getCategoryColor(item.category)}`}>
                    <CategoryIcon category={item.category} className="w-4 h-4" />
                 </div>
              </div>
            ) : (
              <div className={`p-3 flex items-center justify-between ${getCategoryColor(item.category)}`}>
                 <span className="text-xs font-bold uppercase tracking-wider opacity-90">{item.category}</span>
                 <CategoryIcon category={item.category} className="w-4 h-4 opacity-75" />
              </div>
            )}
            
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-gray-800 text-lg mb-1 leading-tight group-hover:text-orange-600 transition-colors">{item.name}</h3>
              {item.description && (
                <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">{item.description}</p>
              )}
              
              <div className="mt-auto pt-4">
                 <div className="flex items-end justify-between mb-4">
                   <span className="text-gray-400 text-sm">Starting at</span>
                   <span className="font-bold text-xl text-gray-900">
                      {item.variants ? `P${item.variants[0].price}` : `P${item.basePrice}`}
                   </span>
                 </div>

                 {item.variants ? (
                   <button 
                    onClick={() => setSelectedItem(item)}
                    className="w-full py-2.5 bg-orange-50 text-orange-700 font-bold rounded-lg hover:bg-orange-100 transition border border-orange-100"
                   >
                     Select Options
                   </button>
                 ) : (
                   <button 
                    onClick={() => addToCart(item)}
                    className="w-full py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-sm"
                   >
                     <Plus size={18} /> Add to Cart
                   </button>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Variants */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                 {selectedItem.image && (
                   <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                     <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                   </div>
                 )}
                 <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h3>
                    <p className="text-gray-500 text-sm">{selectedItem.category}</p>
                 </div>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={24} />
              </button>
            </div>
            
            <p className="mb-4 font-medium text-gray-700">Select an option:</p>
            <div className="space-y-3 mb-6">
              {selectedItem.variants?.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    addToCart(selectedItem, variant);
                    setSelectedItem(null);
                  }}
                  className="w-full flex justify-between items-center p-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition group"
                >
                  <span className="font-medium text-gray-700 group-hover:text-orange-700">{variant.name}</span>
                  <span className="font-bold text-gray-900 group-hover:text-orange-700">P{variant.price}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CartPage = ({ 
  cart, 
  updateQuantity, 
  removeFromCart, 
  placeOrder 
}: { 
  cart: CartItem[], 
  updateQuantity: (id: string, delta: number) => void, 
  removeFromCart: (id: string) => void,
  placeOrder: (name: string) => void
}) => {
  const [customerName, setCustomerName] = useState('');
  const total = cart.reduce((sum, item) => sum + ((item.selectedVariant?.price || item.basePrice || 0) * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <ShoppingCart size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/" className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-200">
          Start Ordering
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart className="text-orange-600" /> Your Order
      </h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {cart.map(item => (
          <div key={item.cartId} className="p-4 border-b border-gray-100 flex items-center gap-4 last:border-0">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 flex-shrink-0 overflow-hidden">
               {item.image ? (
                 <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
               ) : (
                 <CategoryIcon category={item.category} size={20} />
               )}
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-gray-800">{item.name}</h3>
              {item.selectedVariant && (
                <p className="text-sm text-gray-500">{item.selectedVariant.name}</p>
              )}
              <p className="text-orange-600 font-bold mt-1">
                P{((item.selectedVariant?.price || item.basePrice || 0) * item.quantity).toFixed(2)}
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
              <button 
                onClick={() => updateQuantity(item.cartId, -1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-orange-600 disabled:opacity-50"
                disabled={item.quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="font-bold w-4 text-center">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.cartId, 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-orange-600"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <button 
              onClick={() => removeFromCart(item.cartId)}
              className="text-gray-400 hover:text-red-500 p-2 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center text-xl font-bold mb-6">
          <span>Total Amount</span>
          <span className="text-orange-600">P{total.toFixed(2)}</span>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name (Optional)</label>
          <input 
            type="text" 
            placeholder="Enter your name for the order"
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <button 
          onClick={() => placeOrder(customerName)}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

const SuccessPage = ({ autoPrint }: { autoPrint: boolean }) => {
  const location = useLocation();
  const order = location.state?.order as Order;

  // Auto-print logic if enabled
  useEffect(() => {
    if (autoPrint && order) {
      const timer = setTimeout(() => {
        window.print();
      }, 800); // Slight delay to ensure DOM is ready
      return () => clearTimeout(timer);
    }
  }, [autoPrint, order]);

  const handlePrint = () => {
    window.print();
  };

  const orderNumDisplay = order ? order.orderNumber.toString().padStart(3, '0') : '---';

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
       {/* This section hides during print */}
      <div className="print:hidden flex flex-col items-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-bounce-slow">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Received!</h2>
        <div className="my-6 bg-orange-50 p-8 rounded-2xl border border-orange-100">
           <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Your Order Number</p>
           <h1 className="text-6xl font-bold text-orange-600">#{orderNumDisplay}</h1>
        </div>
        <p className="text-gray-500 mb-8 max-w-md">
          Thank you {order?.customerName || 'Customer'}! Your order is being prepared. Please wait for your number to be called.
        </p>
        
        <div className="flex gap-4">
          <button 
            onClick={handlePrint}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg flex items-center gap-2"
          >
            <Printer size={20} /> Print Receipt
          </button>
          <Link to="/" className="bg-white text-gray-900 border border-gray-200 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
            Back to Menu
          </Link>
        </div>
      </div>

      {/* Receipt Component - Visible only when printing */}
      <Receipt order={order} />
    </div>
  );
};

// 3. Admin Pages

const AdminLogin = ({ onLogin, correctPin }: { onLogin: () => void, correctPin: string }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === correctPin) { 
      onLogin();
      navigate('/admin/dashboard');
    } else {
      setError('Invalid PIN');
      setPin('');
    }
  };

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl border border-stone-100 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            <User />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Staff Access</h2>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">{error}</div>}
        
        <input
          type="password"
          placeholder="Enter PIN"
          className="w-full p-4 text-center text-2xl tracking-widest rounded-xl border border-gray-200 mb-6 focus:ring-2 focus:ring-gray-900 outline-none"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={4}
          autoFocus
        />
        
        <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition">
          Login
        </button>
      </form>
    </div>
  );
};

const KitchenView = ({ orders, updateStatus }: { orders: Order[], updateStatus: (id: string, status: OrderStatus) => void }) => {
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  const handlePrint = (order: Order) => {
    setPrintingOrder(order);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleCancel = (order: Order) => {
    if (window.confirm(`Are you sure you want to cancel Order #${order.orderNumber}?`)) {
      updateStatus(order.id, OrderStatus.Cancelled);
    }
  };

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => b.timestamp - a.timestamp);
  }, [orders]);

  const activeOrders = sortedOrders.filter(o => o.status !== OrderStatus.Completed && o.status !== OrderStatus.Cancelled);

  return (
    <div className="relative">
      <div className="print:hidden">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Utensils className="text-orange-600" /> Kitchen Display
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeOrders.map(order => (
            <div key={order.id} className={`bg-white rounded-xl shadow-sm border-l-4 p-4 ${
              order.status === OrderStatus.Ready ? 'border-green-500 ring-2 ring-green-100' : 
              order.status === OrderStatus.Preparing ? 'border-blue-500' : 'border-orange-500'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-bold text-2xl text-gray-900">#{order.orderNumber.toString().padStart(3, '0')}</span>
                  {order.customerName && <span className="block text-sm text-gray-500">{order.customerName}</span>}
                </div>
                <div className="flex items-center gap-2">
                   <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    order.status === OrderStatus.Ready ? 'bg-green-100 text-green-700' :
                    order.status === OrderStatus.Preparing ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {order.status}
                  </span>
                  <button 
                    onClick={() => handlePrint(order)}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition"
                    title="Print Receipt"
                  >
                    <Printer size={16} />
                  </button>
                  <button 
                    onClick={() => handleCancel(order)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 rounded text-red-500 transition"
                    title="Cancel Order"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm border-b border-dashed border-gray-100 pb-1">
                    <span className="font-medium text-gray-800">{item.quantity}x {item.name}</span>
                    {item.selectedVariant && <span className="text-gray-500 text-xs">{item.selectedVariant.name}</span>}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 mt-auto">
                {order.status === OrderStatus.Pending && (
                  <button 
                    onClick={() => updateStatus(order.id, OrderStatus.Preparing)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === OrderStatus.Preparing && (
                  <button 
                    onClick={() => updateStatus(order.id, OrderStatus.Ready)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-700"
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === OrderStatus.Ready && (
                  <button 
                    onClick={() => updateStatus(order.id, OrderStatus.Completed)}
                    className="flex-1 bg-gray-800 text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-900"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
          {activeOrders.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
              <CheckCircle className="mx-auto mb-2" size={32} />
              <p>All active orders completed!</p>
            </div>
          )}
        </div>
      </div>

      {/* Invisible Print Container for Kitchen View */}
      <Receipt order={printingOrder} />
    </div>
  );
};

const AdminDashboard = ({ orders }: { orders: Order[] }) => {
  // Exclude cancelled orders from metrics
  const validOrders = orders.filter(o => o.status !== OrderStatus.Cancelled);
  const cancelledOrders = orders.filter(o => o.status === OrderStatus.Cancelled).length;

  const totalRevenue = validOrders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = validOrders.filter(o => o.status === OrderStatus.Completed).length;
  
  // --- Sales Analysis Config ---
  const TARGETS = {
    Daily: 5000,
    Weekly: 35000,
    Yearly: 1500000
  };

  const getPerformance = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return { label: "Excellent 🚀", color: "text-green-600", bg: "bg-green-50" };
    if (percentage >= 75) return { label: "Good 👍", color: "text-blue-600", bg: "bg-blue-50" };
    return { label: "Needs Improvement 📉", color: "text-orange-600", bg: "bg-orange-50" };
  };

  // Calculate Aggregated Item Sales
  const getAggregatedItems = (ordersList: Order[]) => {
    const stats: Record<string, { name: string; category: string; quantity: number; total: number }> = {};
    
    // Exclude cancelled items
    ordersList.filter(o => o.status !== OrderStatus.Cancelled).forEach(order => {
      order.items.forEach(item => {
        const variantName = item.selectedVariant ? ` (${item.selectedVariant.name})` : '';
        const fullName = item.name + variantName;
        const key = item.id + (item.selectedVariant ? `-${item.selectedVariant.name}` : '');
        const price = (item.selectedVariant?.price || item.basePrice || 0);
        
        if (!stats[key]) {
          stats[key] = {
            name: fullName,
            category: item.category,
            quantity: 0,
            total: 0
          };
        }
        stats[key].quantity += item.quantity;
        stats[key].total += item.quantity * price;
      });
    });

    return Object.values(stats).sort((a, b) => b.total - a.total);
  };

  const aggregatedItems = getAggregatedItems(orders);

  // Filter for Daily Stats
  const todayRevenue = validOrders
    .filter(o => new Date(o.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + o.total, 0);
  
  const performance = getPerformance(todayRevenue, TARGETS.Daily);

  // --- Export Logic ---
  const downloadReport = (period: 'Daily' | 'Weekly' | 'Yearly') => {
    const now = new Date();
    let filteredOrders = validOrders;
    let target = 0;
    let filename = `sales-report-${period.toLowerCase()}-${now.toISOString().split('T')[0]}.csv`;

    if (period === 'Daily') {
      filteredOrders = validOrders.filter(o => new Date(o.timestamp).toDateString() === now.toDateString());
      target = TARGETS.Daily;
    } else if (period === 'Weekly') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredOrders = validOrders.filter(o => o.timestamp >= oneWeekAgo.getTime());
      target = TARGETS.Weekly;
    } else {
      filteredOrders = validOrders.filter(o => new Date(o.timestamp).getFullYear() === now.getFullYear());
      target = TARGETS.Yearly;
    }

    const periodRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
    const periodPerformance = getPerformance(periodRevenue, target).label;
    const reportItems = getAggregatedItems(filteredOrders);

    // CSV Header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Happy Hearts Coffee & Prints - ${period} Sales Report\n`;
    csvContent += `Generated on,${now.toLocaleString()}\n\n`;
    
    csvContent += "Order #,Date,Time,Customer,Items,Total Amount,Status\n";
    
    // CSV Rows
    filteredOrders.forEach(o => {
      const date = new Date(o.timestamp).toLocaleDateString();
      const time = new Date(o.timestamp).toLocaleTimeString();
      const items = o.items.map(i => `${i.quantity}x ${i.name}`).join('; ');
      // Escape quotes in items
      const escapedItems = items.replace(/"/g, '""');
      csvContent += `${o.orderNumber},${date},${time},${o.customerName || 'Guest'},"${escapedItems}",${o.total.toFixed(2)},${o.status}\n`;
    });

    // CSV Summary
    csvContent += `\nSUMMARY STATISTICS\n`;
    csvContent += `Total Orders,${filteredOrders.length}\n`;
    csvContent += `Total Revenue,${periodRevenue.toFixed(2)}\n`;
    csvContent += `Target Revenue,${target.toFixed(2)}\n`;
    csvContent += `Performance Verdict,${periodPerformance}\n`;

    // CSV Item Breakdown
    csvContent += `\nITEM SALES BREAKDOWN\n`;
    csvContent += `Item Name,Category,Quantity Sold,Total Sales\n`;
    reportItems.forEach(item => {
      csvContent += `"${item.name}",${item.category},${item.quantity},${item.total.toFixed(2)}\n`;
    });

    // Trigger Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sample chart data
  const data = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp className="text-orange-600" /> Dashboard
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium uppercase">Total Revenue</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">P{totalRevenue.toFixed(2)}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium uppercase">Orders Completed</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">{completedOrders}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium uppercase">Avg Order Value</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">
             P{validOrders.length ? (totalRevenue / validOrders.length).toFixed(0) : 0}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium uppercase text-red-500">Cancelled</p>
          <h3 className="text-3xl font-bold text-red-500 mt-1">{cancelledOrders}</h3>
        </div>
      </div>

      {/* Sales Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Performance Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-4">
             <Sparkles className="text-orange-500" size={20}/>
             <h3 className="font-bold text-gray-800">Sales Health (Daily)</h3>
           </div>
           <div className={`p-4 rounded-lg mb-4 ${performance.bg}`}>
              <p className="text-sm text-gray-600 mb-1">Performance Verdict:</p>
              <p className={`text-xl font-bold ${performance.color}`}>{performance.label}</p>
           </div>
           <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                 <span>Current Sales:</span>
                 <span className="font-medium text-gray-900">P{todayRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                 <span>Daily Target:</span>
                 <span className="font-medium text-gray-900">P{TARGETS.Daily.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${todayRevenue >= TARGETS.Daily ? 'bg-green-500' : 'bg-orange-500'}`} 
                  style={{ width: `${Math.min((todayRevenue / TARGETS.Daily) * 100, 100)}%` }}
                ></div>
              </div>
           </div>
        </div>

        {/* Download Reports Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-2 mb-4">
             <FileSpreadsheet className="text-green-600" size={20}/>
             <h3 className="font-bold text-gray-800">Export Sales Reports</h3>
           </div>
           <p className="text-gray-500 text-sm mb-6">Download CSV reports compatible with Excel. Includes calculated totals, performance metrics, and item breakdown.</p>
           
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <button 
              onClick={() => downloadReport('Daily')}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-green-500 hover:text-green-700 transition group"
             >
               <Download className="mb-2 text-gray-400 group-hover:text-green-600" />
               <span className="font-bold">Daily Report</span>
               <span className="text-xs text-gray-400">Today's Data</span>
             </button>
             <button 
              onClick={() => downloadReport('Weekly')}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-green-500 hover:text-green-700 transition group"
             >
               <Download className="mb-2 text-gray-400 group-hover:text-green-600" />
               <span className="font-bold">Weekly Report</span>
               <span className="text-xs text-gray-400">Last 7 Days</span>
             </button>
             <button 
              onClick={() => downloadReport('Yearly')}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-green-500 hover:text-green-700 transition group"
             >
               <Download className="mb-2 text-gray-400 group-hover:text-green-600" />
               <span className="font-bold">Yearly Report</span>
               <span className="text-xs text-gray-400">Current Year</span>
             </button>
           </div>
        </div>
      </div>

      {/* Item Sales Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">Product Performance (All Time)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="p-3 font-semibold">Item Name</th>
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold text-center">Qty Sold</th>
                <th className="p-3 font-semibold text-right">Total Sales</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {aggregatedItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{item.name}</td>
                   <td className="p-3 text-gray-500">
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100">{item.category}</span>
                   </td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right font-bold">P{item.total.toFixed(2)}</td>
                </tr>
              ))}
              {aggregatedItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400">No sales data yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
        <h3 className="font-bold text-gray-800 mb-4">Weekly Sales Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
            <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
            <Bar dataKey="sales" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StaffClock = ({ logs, staffMembers, onClockIn, onClockOut }: { logs: StaffLog[], staffMembers: StaffMember[], onClockIn: (id: string) => void, onClockOut: (logId: string) => void }) => {
  const [selectedStaff, setSelectedStaff] = useState('');
  
  // Check if selected staff is currently clocked in
  const activeLog = logs.find(l => l.staffName === staffMembers.find(s => s.id === selectedStaff)?.name && !l.clockOut);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Clock className="text-orange-600" /> Staff Time Clock
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex gap-4 mb-6">
          <select 
            className="flex-grow p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
          >
            <option value="">Select Staff Member</option>
            {staffMembers.map(staff => (
              <option key={staff.id} value={staff.id}>{staff.name}</option>
            ))}
          </select>
          
          {!activeLog ? (
            <button 
              onClick={() => onClockIn(selectedStaff)}
              disabled={!selectedStaff}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Play size={18} /> Clock In
            </button>
          ) : (
            <button 
              onClick={() => onClockOut(activeLog.id)}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition flex items-center gap-2"
            >
              <Pause size={18} /> Clock Out
            </button>
          )}
        </div>
        
        {activeLog && (
           <div className="bg-green-50 text-green-800 p-4 rounded-lg flex items-center gap-3 border border-green-100">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             Currently working since {new Date(activeLog.clockIn).toLocaleTimeString()}
           </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Staff Name</th>
              <th className="p-4 font-semibold text-gray-600">Date</th>
              <th className="p-4 font-semibold text-gray-600">Time In</th>
              <th className="p-4 font-semibold text-gray-600">Time Out</th>
              <th className="p-4 font-semibold text-gray-600">Hours</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Est. Pay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {logs.map(log => {
              const hours = log.clockOut ? (log.clockOut - log.clockIn) / (1000 * 60 * 60) : 0;
              const pay = hours * log.hourlyRate;
              
              return (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{log.staffName}</td>
                  <td className="p-4 text-gray-500">{log.date}</td>
                  <td className="p-4 text-gray-500">{new Date(log.clockIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                  <td className="p-4 text-gray-500">
                    {log.clockOut ? new Date(log.clockOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                  </td>
                  <td className="p-4 text-gray-900 font-mono">
                    {log.clockOut ? hours.toFixed(2) : 'On-going'}
                  </td>
                   <td className="p-4 text-right font-bold text-gray-900">
                    {log.clockOut ? `P${pay.toFixed(2)}` : '-'}
                  </td>
                </tr>
              );
            })}
            {logs.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">No logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SettingsPage = ({ 
  staffMembers, 
  onAddStaff, 
  onRemoveStaff, 
  autoPrint, 
  onToggleAutoPrint,
  adminPin,
  onUpdateAdminPin,
  menuItems,
  onUpdateMenuItem
}: { 
  staffMembers: StaffMember[], 
  onAddStaff: (staff: StaffMember) => void,
  onRemoveStaff: (id: string) => void,
  autoPrint: boolean,
  onToggleAutoPrint: (val: boolean) => void,
  adminPin: string,
  onUpdateAdminPin: (newPin: string) => void,
  menuItems: MenuItem[],
  onUpdateMenuItem: (id: string, image: string | undefined) => void
}) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [rate, setRate] = useState('');

  // Password Change State
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && pin && rate) {
      onAddStaff({
        id: Date.now().toString(),
        name,
        pin,
        hourlyRate: parseFloat(rate)
      });
      setName('');
      setPin('');
      setRate('');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (currentPinInput !== adminPin) {
      setPwdError('Incorrect current PIN');
      return;
    }
    if (newPinInput.length < 4) {
      setPwdError('New PIN must be at least 4 digits');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPwdError('New PINs do not match');
      return;
    }

    onUpdateAdminPin(newPinInput);
    setPwdSuccess('Admin PIN updated successfully!');
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
  };

  const launchKiosk = () => {
    window.open('/#/', '_blank', 'popup=yes,width=1024,height=768');
  };

  // Handle image file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateMenuItem(itemId, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="text-orange-600" /> Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Kiosk Configuration Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Kiosk Display</h3>
          
          <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-bold text-gray-900">Auto-print Receipt on Order</p>
              <p className="text-sm text-gray-500">Automatically open print dialog when customer places order</p>
            </div>
            <button 
              onClick={() => onToggleAutoPrint(!autoPrint)}
              className={`w-12 h-6 rounded-full transition-colors relative ${autoPrint ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${autoPrint ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <button 
            onClick={launchKiosk}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Monitor size={20} /> Launch Customer Kiosk Window
          </button>
        </div>

        {/* Admin Security Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
          <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
            <Lock size={18} /> Admin Security
          </h3>
          
          {pwdError && <div className="bg-red-50 text-red-600 text-sm p-2 rounded mb-3">{pwdError}</div>}
          {pwdSuccess && <div className="bg-green-50 text-green-600 text-sm p-2 rounded mb-3">{pwdSuccess}</div>}

          <form onSubmit={handlePasswordChange} className="space-y-3">
            <input 
              type="password" 
              placeholder="Current PIN" 
              className="w-full p-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-gray-900"
              value={currentPinInput}
              onChange={e => setCurrentPinInput(e.target.value)}
              required
            />
            <div className="flex gap-3">
              <input 
                type="password" 
                placeholder="New PIN" 
                className="w-full p-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-gray-900"
                value={newPinInput}
                onChange={e => setNewPinInput(e.target.value)}
                required
              />
              <input 
                type="password" 
                placeholder="Confirm" 
                className="w-full p-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-gray-900"
                value={confirmPinInput}
                onChange={e => setConfirmPinInput(e.target.value)}
                required
              />
            </div>
            <button className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-900 transition">
              Update Admin PIN
            </button>
          </form>
        </div>
      </div>

      {/* Menu Image Management Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
         <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
            <ImageIcon size={20} className="text-orange-600"/> Menu Image Management
         </h3>
         <p className="text-sm text-gray-500 mb-4">Upload images for your menu items. These will be displayed on the customer kiosk.</p>
         
         <div className="h-96 overflow-y-auto custom-scrollbar border border-gray-100 rounded-xl">
           <table className="w-full text-left text-sm">
             <thead className="bg-gray-50 sticky top-0 z-10">
               <tr>
                 <th className="p-3 font-semibold">Item Name</th>
                 <th className="p-3 font-semibold">Category</th>
                 <th className="p-3 font-semibold text-center">Image Preview</th>
                 <th className="p-3 font-semibold text-center">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
               {menuItems.map(item => (
                 <tr key={item.id} className="hover:bg-gray-50">
                   <td className="p-3 font-medium">{item.name}</td>
                   <td className="p-3 text-gray-500">
                     <span className="px-2 py-1 bg-gray-100 rounded text-xs">{item.category}</span>
                   </td>
                   <td className="p-3 text-center">
                     {item.image ? (
                       <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg mx-auto border border-gray-200" />
                     ) : (
                       <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto flex items-center justify-center text-gray-400">
                         <ImageIcon size={16} />
                       </div>
                     )}
                   </td>
                   <td className="p-3 text-center">
                     <div className="flex justify-center gap-2">
                       <label className="cursor-pointer bg-white border border-gray-200 hover:bg-orange-50 hover:border-orange-200 text-gray-600 hover:text-orange-600 px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1">
                         <Upload size={14} /> Upload
                         <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, item.id)} />
                       </label>
                       {item.image && (
                         <button 
                           onClick={() => onUpdateMenuItem(item.id, undefined)}
                           className="bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 text-red-500 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                         >
                           <Trash2 size={14} />
                         </button>
                       )}
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Staff Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Add New Staff</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
                placeholder="e.g. Juan Dela Cruz"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code (Login)</label>
              <input 
                type="text" 
                value={pin}
                onChange={e => setPin(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
                placeholder="e.g. 1234"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (PHP)</label>
              <input 
                type="number" 
                value={rate}
                onChange={e => setRate(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
                placeholder="e.g. 65"
                required
              />
            </div>
            <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-lg font-bold hover:bg-gray-800 transition">
              Add Staff Member
            </button>
          </form>
        </div>

        {/* Staff List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Manage Staff</h3>
          <div className="space-y-3">
            {staffMembers.map(staff => (
              <div key={staff.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                 <div>
                   <p className="font-bold text-gray-900">{staff.name}</p>
                   <p className="text-xs text-gray-500">PIN: **** | Rate: P{staff.hourlyRate}/hr</p>
                 </div>
                 <button 
                  onClick={() => onRemoveStaff(staff.id)}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                 >
                   <Trash2 size={18} />
                 </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [staffLogs, setStaffLogs] = useState<StaffLog[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF_MEMBERS);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [kioskSettings, setKioskSettings] = useState({ autoPrint: false });
  // New state for Admin PIN
  const [adminPin, setAdminPin] = useState('1234');
  // New state for Menu Items
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  
  const navigate = useNavigate();

  const addToCart = (item: MenuItem, variant?: MenuItemVariant) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.selectedVariant?.name === variant?.name);
      if (existing) {
        return prev.map(i => i.cartId === existing.cartId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, cartId: Date.now().toString(), quantity: 1, selectedVariant: variant }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const placeOrder = (customerName: string) => {
    const total = cart.reduce((sum, item) => sum + ((item.selectedVariant?.price || item.basePrice || 0) * item.quantity), 0);
    
    // Generate sequential order number
    const orderNumber = orders.length + 1;

    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: orderNumber, // Add the sequential number
      items: [...cart],
      total,
      status: OrderStatus.Pending,
      timestamp: Date.now(),
      customerName
    };
    
    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    navigate('/success', { state: { order: newOrder } });
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const clockIn = (staffId: string) => {
    const staff = staffList.find(s => s.id === staffId);
    if (!staff) return;

    const newLog: StaffLog = {
      id: Date.now().toString(),
      staffName: staff.name,
      clockIn: Date.now(),
      date: new Date().toISOString().split('T')[0],
      hourlyRate: staff.hourlyRate
    };
    setStaffLogs(prev => [newLog, ...prev]);
  };

  const clockOut = (logId: string) => {
    setStaffLogs(prev => prev.map(l => l.id === logId ? { ...l, clockOut: Date.now() } : l));
  };

  const addStaff = (staff: StaffMember) => {
    setStaffList(prev => [...prev, staff]);
  };

  const removeStaff = (id: string) => {
    setStaffList(prev => prev.filter(s => s.id !== id));
  };

  const updateMenuItemImage = (id: string, image: string | undefined) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, image } : item));
  };

  return (
    <Routes>
      {/* Public Customer Routes */}
      <Route path="/" element={
        <Layout role="customer">
          <KioskMenu items={menuItems} addToCart={addToCart} />
        </Layout>
      } />
      <Route path="/cart" element={
        <Layout role="customer">
          <CartPage 
            cart={cart} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} 
            placeOrder={placeOrder} 
          />
        </Layout>
      } />
      <Route path="/success" element={
        <Layout role="customer">
          <SuccessPage autoPrint={kioskSettings.autoPrint} />
        </Layout>
      } />
      <Route path="/admin-login" element={
        <Layout role="customer">
          <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} correctPin={adminPin} />
        </Layout>
      } />

      {/* Admin Routes */}
      {isAdminLoggedIn ? (
        <>
          <Route path="/admin/dashboard" element={
            <Layout role="admin">
              <AdminDashboard orders={orders} />
            </Layout>
          } />
          <Route path="/admin/orders" element={
            <Layout role="admin">
              <KitchenView orders={orders} updateStatus={updateOrderStatus} />
            </Layout>
          } />
          <Route path="/admin/attendance" element={
            <Layout role="admin">
              <StaffClock 
                logs={staffLogs} 
                staffMembers={staffList} 
                onClockIn={clockIn} 
                onClockOut={clockOut} 
              />
            </Layout>
          } />
          <Route path="/admin/settings" element={
            <Layout role="admin">
              <SettingsPage 
                staffMembers={staffList} 
                onAddStaff={addStaff} 
                onRemoveStaff={removeStaff} 
                autoPrint={kioskSettings.autoPrint}
                onToggleAutoPrint={(val) => setKioskSettings(p => ({...p, autoPrint: val}))}
                adminPin={adminPin}
                onUpdateAdminPin={setAdminPin}
                menuItems={menuItems}
                onUpdateMenuItem={updateMenuItemImage}
              />
            </Layout>
          } />
        </>
      ) : (
         <Route path="/admin/*" element={<AdminLogin onLogin={() => setIsAdminLoggedIn(true)} correctPin={adminPin} />} />
      )}
    </Routes>
  );
}