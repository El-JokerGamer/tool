import React, { useState } from 'react';
import { countries, resources, globalMarketComparison } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const GlobalDashboard: React.FC = () => {
  const [selectedResource, setSelectedResource] = useState('خشب');

  const resourcePrices = globalMarketComparison.find(r => r.resource === selectedResource);

  const radarData = countries.map(c => ({
    country: c.name,
    اقتصاد: (c.gdp / 1000000) * 10,
    سكان: (c.population / 1000) * 10,
    خزينة: (c.treasury / 1000000) * 10,
  }));

  const comparisonChartData = resourcePrices ? [
    { name: 'نوفاريا 🏔️', price: resourcePrices.novaria },
    { name: 'أركاديا 🌊', price: resourcePrices.arcadia },
    { name: 'سولاريا ☀️', price: resourcePrices.solaria },
    { name: 'فروستلاند ❄️', price: resourcePrices.frostland },
    { name: 'إيمريون 🌿', price: resourcePrices.emrion },
    { name: 'ثاندوريا ⚡', price: resourcePrices.thandoria },
  ] : [];

  const cheapestMarket = resourcePrices ? Object.entries(resourcePrices)
    .filter(([key]) => key !== 'resource')
    .sort(([, a], [, b]) => (a as number) - (b as number))[0] : null;

  const expensiveMarket = resourcePrices ? Object.entries(resourcePrices)
    .filter(([key]) => key !== 'resource')
    .sort(([, a], [, b]) => (b as number) - (a as number))[0] : null;

  const countryNameMap: Record<string, string> = {
    novaria: 'نوفاريا', arcadia: 'أركاديا', solaria: 'سولاريا',
    frostland: 'فروستلاند', emrion: 'إيمريون', thandoria: 'ثاندوريا'
  };

  return (
    <div className="space-y-6 slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <i className="fa-solid fa-globe text-indigo-400"></i>
            الاقتصاد العالمي
          </h1>
          <p className="text-slate-400 text-sm mt-1">مقارنة وتحليل اقتصادات جميع الدول</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">آخر تحديث:</span>
          <span className="text-xs text-emerald-400 font-medium">منذ 3 دقائق</span>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-5 stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <i className="fa-solid fa-earth-americas text-white text-sm"></i>
            </div>
            <span className="text-xs text-slate-400">إجمالي الدول</span>
          </div>
          <p className="text-2xl font-bold text-white">{countries.length}</p>
        </div>
        <div className="glass-card rounded-xl p-5 stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
              <i className="fa-solid fa-coins text-white text-sm"></i>
            </div>
            <span className="text-xs text-slate-400">إجمالي الخزائن</span>
          </div>
          <p className="text-2xl font-bold text-white">{(countries.reduce((a, c) => a + c.treasury, 0) / 1000000).toFixed(1)}M</p>
        </div>
        <div className="glass-card rounded-xl p-5 stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <i className="fa-solid fa-users text-white text-sm"></i>
            </div>
            <span className="text-xs text-slate-400">إجمالي السكان</span>
          </div>
          <p className="text-2xl font-bold text-white">{(countries.reduce((a, c) => a + c.population, 0) / 1000).toFixed(1)}K</p>
        </div>
        <div className="glass-card rounded-xl p-5 stat-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <i className="fa-solid fa-chart-pie text-white text-sm"></i>
            </div>
            <span className="text-xs text-slate-400">متوسط التضخم</span>
          </div>
          <p className="text-2xl font-bold text-white">{(countries.reduce((a, c) => a + c.inflation, 0) / countries.length).toFixed(1)}%</p>
        </div>
      </div>

      {/* Resource Price Comparison */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-scale-balanced text-amber-400"></i>
            مقارنة الأسعار بين الدول
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              {resources.map(r => (
                <option key={r.id} value={r.name}>{r.icon} {r.name}</option>
              ))}
            </select>
          </div>
        </div>

        {cheapestMarket && expensiveMarket && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <p className="text-xs text-emerald-400 mb-1">🏷️ أرخص سوق</p>
              <p className="text-lg font-bold text-white">{countryNameMap[cheapestMarket[0]]} - {cheapestMarket[1]} 💰</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
              <p className="text-xs text-red-400 mb-1">💸 أغلى سوق</p>
              <p className="text-lg font-bold text-white">{countryNameMap[expensiveMarket[0]]} - {expensiveMarket[1]} 💰</p>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #4f46e5', borderRadius: '12px', direction: 'rtl' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Bar dataKey="price" name="السعر" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Countries Comparison Table */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-table-list text-cyan-400"></i>
          جدول مقارنة الدول
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-right py-3 px-4 text-slate-400 font-medium">الدولة</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">الخزينة</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">الناتج المحلي</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">السكان</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">الضريبة</th>
                <th className="text-right py-3 px-4 text-slate-400 font-medium">التضخم</th>
              </tr>
            </thead>
            <tbody>
              {countries.sort((a, b) => b.gdp - a.gdp).map((country, i) => (
                <tr key={country.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{country.flag}</span>
                      <span className="font-medium text-white">{country.name}</span>
                      {i === 0 && <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">🏆 الأولى</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-amber-300 font-mono">{(country.treasury / 1000).toFixed(0)}K</td>
                  <td className="py-3 px-4 text-emerald-300 font-mono">{(country.gdp / 1000).toFixed(0)}K</td>
                  <td className="py-3 px-4 text-blue-300 font-mono">{country.population.toLocaleString()}</td>
                  <td className="py-3 px-4 text-orange-300">{country.taxRate}%</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${country.inflation <= 3 ? 'bg-emerald-500/20 text-emerald-400' : country.inflation <= 4 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                      {country.inflation}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resources Overview */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-cubes-stacked text-purple-400"></i>
          نظرة عامة على الموارد العالمية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((resource) => {
            const prices = globalMarketComparison.find(r => r.resource === resource.name);
            const allPrices = prices ? Object.entries(prices).filter(([k]) => k !== 'resource').map(([, v]) => v as number) : [];
            const avgPrice = allPrices.length ? Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length) : 0;
            const minPrice = allPrices.length ? Math.min(...allPrices) : 0;
            const maxPrice = allPrices.length ? Math.max(...allPrices) : 0;

            return (
              <div key={resource.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{resource.icon}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${resource.change24h >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {resource.change24h >= 0 ? '↑' : '↓'} {Math.abs(resource.change24h)}%
                  </span>
                </div>
                <p className="text-sm font-medium text-white mb-1">{resource.name}</p>
                <p className="text-lg font-bold text-indigo-300 mb-2">{avgPrice} 💰 <span className="text-xs text-slate-400">متوسط</span></p>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>أدنى: {minPrice}</span>
                  <span>أعلى: {maxPrice}</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-l from-indigo-500 to-purple-500" style={{ width: `${((avgPrice - minPrice) / (maxPrice - minPrice || 1)) * 100}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-chart-simple text-emerald-400"></i>
          مؤشر الأداء الاقتصادي
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="country" stroke="#94a3b8" fontSize={12} />
            <PolarRadiusAxis stroke="#475569" fontSize={10} />
            <Radar name="اقتصاد" dataKey="اقتصاد" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
            <Radar name="سكان" dataKey="سكان" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            <Radar name="خزينة" dataKey="خزينة" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
            <Legend />
            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #4f46e5', borderRadius: '12px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GlobalDashboard;
