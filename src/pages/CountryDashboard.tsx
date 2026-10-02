import React from 'react';
import { useAuth } from '../context/AuthContext';
import { countries, resources, revenueData, priceHistory, marketOffers, jobOffers } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const CountryDashboard: React.FC = () => {
  const { user } = useAuth();
  const country = countries.find(c => c.name === user?.country) || countries[0];

  const stats = [
    { label: 'الخزينة', value: `${(country.treasury / 1000000).toFixed(2)}M`, icon: 'fa-solid fa-vault', color: 'from-amber-500 to-yellow-500', change: '+12.5%', positive: true },
    { label: 'الناتج المحلي', value: `${(country.gdp / 1000000).toFixed(1)}M`, icon: 'fa-solid fa-chart-line', color: 'from-emerald-500 to-green-500', change: '+8.3%', positive: true },
    { label: 'عدد السكان', value: country.population.toLocaleString(), icon: 'fa-solid fa-users', color: 'from-blue-500 to-cyan-500', change: '+2.1%', positive: true },
    { label: 'معدل التضخم', value: `${country.inflation}%`, icon: 'fa-solid fa-fire', color: 'from-red-500 to-orange-500', change: '-0.5%', positive: false },
  ];

  return (
    <div className="space-y-6 slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">{country.flag}</span>
            اقتصاد {country.name}
          </h1>
          <p className="text-slate-400 text-sm mt-1">نظرة شاملة على الوضع الاقتصادي لبلدك</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs text-slate-300">بيانات مباشرة</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card rounded-xl p-5 stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <i className={`${stat.icon} text-white text-sm`}></i>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.positive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-area text-indigo-400"></i>
            الإيرادات والمصروفات
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #4f46e5', borderRadius: '12px', direction: 'rtl' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Area type="monotone" dataKey="income" name="الإيرادات" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              <Area type="monotone" dataKey="expense" name="المصروفات" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Price Trend */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-emerald-400"></i>
            اتجاه أسعار الموارد
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #4f46e5', borderRadius: '12px', direction: 'rtl' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Bar dataKey="price" name="السعر" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-cubes text-amber-400"></i>
          أسعار الموارد المحلية
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-indigo-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{resource.icon}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${resource.change24h >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {resource.change24h >= 0 ? '↑' : '↓'} {Math.abs(resource.change24h)}%
                </span>
              </div>
              <p className="text-sm font-medium text-white">{resource.name}</p>
              <p className="text-lg font-bold text-indigo-300">{resource.currentPrice} 💰</p>
              <div className="mt-2 flex items-center gap-1">
                <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-indigo-500 to-emerald-500"
                    style={{ width: `${Math.min((resource.demand / resource.supply) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400">طلب/عرض</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Offers & Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Market Offers */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-store text-purple-400"></i>
            آخر عروض السوق
          </h3>
          <div className="space-y-3">
            {marketOffers.slice(0, 5).map((offer) => (
              <div key={offer.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${offer.type === 'sell' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {offer.type === 'sell' ? 'بيع' : 'شراء'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{offer.resource}</p>
                    <p className="text-xs text-slate-400">{offer.country} • {offer.timestamp}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-indigo-300">{offer.price} 💰</p>
                  <p className="text-xs text-slate-400">×{offer.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Offers */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-briefcase text-cyan-400"></i>
            عروض العمل
          </h3>
          <div className="space-y-3">
            {jobOffers.slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <i className="fa-solid fa-building text-cyan-400 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{job.title}</p>
                    <p className="text-xs text-slate-400">{job.company} • {job.type}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-emerald-300">{job.salary} 💰/يوم</p>
                  <p className="text-xs text-slate-400">{job.posted}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tax Info */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-percent text-orange-400"></i>
          نظام الضرائب
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-1">معدل الضريبة</p>
            <p className="text-2xl font-bold text-orange-300">{country.taxRate}%</p>
            <div className="mt-2 h-2 rounded-full bg-slate-700 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-l from-orange-500 to-amber-500" style={{ width: `${country.taxRate * 5}%` }}></div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-1">إيرادات الضرائب الشهرية</p>
            <p className="text-2xl font-bold text-emerald-300">125,000 💰</p>
            <p className="text-xs text-emerald-400 mt-1">↑ 5.2% عن الشهر السابق</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-1">عدد المكلفين</p>
            <p className="text-2xl font-bold text-blue-300">{(country.population * 0.65).toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">65% من السكان</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDashboard;
