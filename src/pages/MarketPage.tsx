import React, { useState } from 'react';
import { marketOffers, resources } from '../data/mockData';

const MarketPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const [resourceFilter, setResourceFilter] = useState('all');

  const filteredOffers = marketOffers.filter(offer => {
    const typeMatch = filter === 'all' || offer.type === filter;
    const resourceMatch = resourceFilter === 'all' || offer.resource === resourceFilter;
    return typeMatch && resourceMatch;
  });

  return (
    <div className="space-y-6 slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <i className="fa-solid fa-store text-purple-400"></i>
            السوق العالمي
          </h1>
          <p className="text-slate-400 text-sm mt-1">جميع عروض البيع والشراء في الأسواق</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">النوع:</span>
            <div className="flex gap-1">
              {[
                { value: 'all', label: 'الكل', icon: 'fa-solid fa-list' },
                { value: 'sell', label: 'بيع', icon: 'fa-solid fa-arrow-down' },
                { value: 'buy', label: 'شراء', icon: 'fa-solid fa-arrow-up' },
              ].map(item => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === item.value
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50'
                  }`}
                >
                  <i className={`${item.icon} ml-1`}></i>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">المورد:</span>
            <select
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">جميع الموارد</option>
              {resources.map(r => (
                <option key={r.id} value={r.name}>{r.icon} {r.name}</option>
              ))}
            </select>
          </div>

          <div className="mr-auto flex items-center gap-2 text-xs text-slate-400">
            <i className="fa-solid fa-filter"></i>
            <span>{filteredOffers.length} عرض</span>
          </div>
        </div>
      </div>

      {/* Offers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOffers.map((offer) => {
          const resource = resources.find(r => r.name === offer.resource);
          return (
            <div key={offer.id} className="glass-card rounded-xl p-5 stat-card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{resource?.icon || '📦'}</span>
                  <div>
                    <p className="text-lg font-bold text-white">{offer.resource}</p>
                    <p className="text-xs text-slate-400">{offer.country}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                  offer.type === 'sell'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {offer.type === 'sell' ? '🔴 بيع' : '🟢 شراء'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-slate-400">السعر</p>
                  <p className="text-sm font-bold text-indigo-300">{offer.price} 💰</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-slate-400">الكمية</p>
                  <p className="text-sm font-bold text-white">{offer.quantity}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-slate-400">الإجمالي</p>
                  <p className="text-sm font-bold text-amber-300">{(offer.price * offer.quantity).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {offer.seller.charAt(0)}
                  </div>
                  <span className="text-xs text-slate-300">{offer.seller}</span>
                </div>
                <span className="text-xs text-slate-400">
                  <i className="fa-solid fa-clock ml-1"></i>
                  {offer.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Market Stats */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-chart-bar text-amber-400"></i>
          إحصائيات السوق
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
            <p className="text-2xl font-bold text-emerald-300">{marketOffers.filter(o => o.type === 'buy').length}</p>
            <p className="text-xs text-slate-400 mt-1">عروض شراء</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
            <p className="text-2xl font-bold text-red-300">{marketOffers.filter(o => o.type === 'sell').length}</p>
            <p className="text-xs text-slate-400 mt-1">عروض بيع</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
            <p className="text-2xl font-bold text-indigo-300">{marketOffers.reduce((a, o) => a + o.quantity, 0).toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">إجمالي الكميات</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
            <p className="text-2xl font-bold text-amber-300">{(marketOffers.reduce((a, o) => a + o.price * o.quantity, 0) / 1000).toFixed(0)}K</p>
            <p className="text-xs text-slate-400 mt-1">حجم التداول 💰</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
