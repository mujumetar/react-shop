import { ShoppingBag, Trash2, Plus, Minus, Lock, Tag, Truck, ArrowLeft, Clock, Sparkles, Wallet, Gift, Check, TrendingUp, Trophy, Zap } from 'lucide-react';
import React, { useState } from 'react'

const Offersect = () => {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const cashbackOffers = [
    {
      id: 1,
      title: "Complete 3 Orders",
      cashback: "₹50",
      description: "Get ₹50 cashback on completing your first 3 orders",
      orders: 3,
      minOrderValue: 500,
      validTill: "31 Dec 2025",
      icon: Gift,
      color: "blue",
      progress: 1,
      terms: [
        "Valid on orders above ₹500",
        "Cashback credited within 24 hours",
        "Valid for new users only"
      ]
    },
    {
      id: 2,
      title: "Complete 5 Orders",
      cashback: "₹150",
      description: "Unlock ₹150 cashback by completing 5 orders this month",
      orders: 5,
      minOrderValue: 800,
      validTill: "30 Nov 2025",
      icon: TrendingUp,
      color: "purple",
      progress: 2,
      terms: [
        "Each order must be above ₹800",
        "Valid for this month only",
        "Cashback auto-credited to wallet"
      ]
    },
    {
      id: 3,
      title: "Complete 10 Orders",
      cashback: "₹500",
      description: "Super saver! Get ₹500 cashback on 10 successful orders",
      orders: 10,
      minOrderValue: 1000,
      validTill: "31 Jan 2026",
      icon: Trophy,
      color: "orange",
      progress: 4,
      featured: true,
      terms: [
        "Minimum ₹1000 per order",
        "Valid for 3 months",
        "Additional bonus for early completion"
      ]
    },
    {
      id: 4,
      title: "Weekend Special",
      cashback: "₹100",
      description: "Complete 2 orders this weekend and earn ₹100 cashback",
      orders: 2,
      minOrderValue: 600,
      validTill: "27 Oct 2025",
      icon: Zap,
      color: "green",
      progress: 0,
      terms: [
        "Valid only on Saturday & Sunday",
        "Orders above ₹600 only",
        "Instant cashback"
      ]
    },
    {
      id: 5,
      title: "Monthly Marathon",
      cashback: "₹300",
      description: "Shop 7 times this month and get ₹300 cashback reward",
      orders: 7,
      minOrderValue: 700,
      validTill: "30 Nov 2025",
      icon: Sparkles,
      color: "pink",
      progress: 3,
      terms: [
        "7 orders in current month",
        "Each order min ₹700",
        "Cashback on month end"
      ]
    },
    {
      id: 6,
      title: "Mega Shopper",
      cashback: "₹1000",
      description: "Complete 15 orders and unlock massive ₹1000 cashback",
      orders: 15,
      minOrderValue: 1200,
      validTill: "28 Feb 2026",
      icon: Trophy,
      color: "red",
      progress: 6,
      featured: true,
      terms: [
        "15 orders in 3 months",
        "Each order above ₹1200",
        "Highest cashback reward"
      ]
    }
  ];

  const colorClasses = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
      progress: "bg-blue-500"
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-200",
      progress: "bg-purple-500"
    },
    orange: {
      gradient: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-200",
      progress: "bg-orange-500"
    },
    green: {
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
      progress: "bg-green-500"
    },
    pink: {
      gradient: "from-pink-500 to-pink-600",
      bg: "bg-pink-50",
      text: "text-pink-600",
      border: "border-pink-200",
      progress: "bg-pink-500"
    },
    red: {
      gradient: "from-red-500 to-red-600",
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
      progress: "bg-red-500"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wallet className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Cashback Offers</h1>
          </div>
          <p className="text-purple-100 text-lg md:text-xl">Complete orders and earn amazing cashback rewards!</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold">₹2100</p>
              <p className="text-sm text-purple-100">Total Cashback</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold">6</p>
              <p className="text-sm text-purple-100">Active Offers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold">15</p>
              <p className="text-sm text-purple-100">Days Left</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 mb-8 text-white shadow-xl">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">How it works?</h3>
              <p className="text-blue-50">Complete the required number of orders, meet the minimum order value, and your cashback will be automatically credited to your wallet!</p>
            </div>
          </div>
        </div>

        {/* Cashback Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cashbackOffers.map((offer) => {
            const colors = colorClasses[offer.color];
            const Icon = offer.icon;
            const progressPercent = (offer.progress / offer.orders) * 100;

            return (
              <div
                key={offer.id}
                className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${colors.border} transform hover:-translate-y-1 ${offer.featured ? 'ring-4 ring-yellow-400' : ''}`}
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${colors.gradient} p-6 text-white relative`}>
                  {offer.featured && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      BEST OFFER
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{offer.title}</h3>
                      <p className="text-sm opacity-90">Earn Cashback</p>
                    </div>
                  </div>
                  <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl py-3 mt-4">
                    <p className="text-4xl font-bold">{offer.cashback}</p>
                    <p className="text-sm opacity-90">Cashback Reward</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-700 mb-4">{offer.description}</p>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Your Progress</span>
                      <span className={`text-sm font-bold ${colors.text}`}>
                        {offer.progress}/{offer.orders} Orders
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${colors.progress} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className={`${colors.bg} border ${colors.border} rounded-xl p-4 mb-4 space-y-2`}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Min. Order Value:</span>
                      <span className="font-bold text-gray-900">₹{offer.minOrderValue}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Valid Till:</span>
                      <span className="font-bold text-gray-900">{offer.validTill}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Orders Remaining:</span>
                      <span className={`font-bold ${colors.text}`}>
                        {offer.orders - offer.progress} more
                      </span>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="mb-4">
                    <button
                      onClick={() => setSelectedOffer(selectedOffer === offer.id ? null : offer.id)}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      View Terms & Conditions
                    </button>
                    {selectedOffer === offer.id && (
                      <ul className="mt-3 space-y-1 text-xs text-gray-600 pl-6">
                        {offer.terms.map((term, idx) => (
                          <li key={idx} className="list-disc">{term}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Action Button */}
                  <button className={`w-full bg-gradient-to-r ${colors.gradient} text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl`}>
                    Start Shopping
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-600" />
            Important Information
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">✓ Cashback Credit</h4>
              <p>Cashback will be credited to your wallet within 24-48 hours after completing the required orders.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">✓ Order Validity</h4>
              <p>Only delivered and non-cancelled orders count towards your cashback offer progress.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">✓ Multiple Offers</h4>
              <p>You can participate in multiple cashback offers simultaneously and earn all rewards.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">✓ Expiry Policy</h4>
              <p>Complete your orders before the offer expiry date. Incomplete offers will not carry forward.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offersect