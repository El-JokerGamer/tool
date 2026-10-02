import React from 'react';
import { useAuth } from '../context/AuthContext';
import { countries, treasuryEntries, revenueData } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const TreasuryPage: React.FC = () => {
  const { user } = useAuth();
  const country = countries.find(c => c.name === user?.country) || countries[0];

  const incomeEntries = treasuryEntries.filter(e => e.type === 'income');
  const expenseEntries = treasuryEntries.filter(e => e.type === 'expense');
  const totalIncome = incomeEntries.reduce((a, e) => a + e.amount, 0);
  const totalExpense = expenseEntries.reduce((a, e) => a + e.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const incomeByCategory = incomeEntries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.amount;
    return acc;
  }, {} as Record<string, number>);

  const expenseByCategory = expenseEntries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.amount;
    return acc;
  }, {} as Record<string, number>);

  const incomePieData = Object.entries(incomeByCategory).map(([name, value]) => ({ name, value }));
  const expensePieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6 slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">{country.flag}</span>
            خزينة {country.name}
          </h1>
          <p className="text-slate-400 text-sm mt-1">تتبع الإيرادات والمصروفات الحكومية</p>
        </div>
      </div>

      {/* Treasury Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-5 stat-card border-amber-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <i className="fa-solid fa-vault text-white text-sm"></i>
            </div>
            <span className="text-xs text-slate-400">الرصيد الحالي</span>
          </div>
          <p className="text-2xl font-bold text-amber-300">{(country.treasury / 1000).toFixed(0)}K 💰</p>
          <p className="text-xs text-emerald-400 mt-1">↑ 12.5% هذا الشهر</p>
        </div>
        <div className="glass-card rounded-xl p-5 stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
              <i className="fa-solid fa-arrow-down text-white text-sm"></i>
            </div>
            <span className="text-xs text-slate-400">إجمالي الإيرادات</span>
          </div>
          <p className="text-2xl font-bold text-emerald-300">{(totalIncome / 1000).toFixed(0)}K 💰</p>
          <p className="text-xs text-slate-400 mt-1">{incomeEntries.length} معاملة</p>
        </div>
        <div className="glass-card rounded-xl p-5 stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <i className="fa-solid fa-arrow-up text-white text-sm"></i>
            </div>
            <span className="text-xs text-slate-400">إجمالي المصروفات</span>
          </div>
          <p className="text-2xl font-bold text-red-300">{(totalExpense / 1000).toFixed(0)}K 💰</p>
          <p className="text-xs text-slate-400 mt-1">{expenseEntries.length} معاملة</p>
        </div>
        <div className="glass-card rounded-xl p-5 stat-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <i className="fa-solid fa-scale-balanced text-white text-sm"></i>
            </div>
            <span className="text-xs text-slate-400">الصافي</span>
          </div>
          <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
            {netBalance >= 0 ? '+' : ''}{(netBalance / 1000).toFixed(0)}K 💰
          </p>
          <p className="text-xs text-slate-400 mt-1">{netBalance >= 0 ? 'فائض' : 'عجز'}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-chart-area text-indigo-400"></i>
          تطور الإيرادات والمصروفات
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: '1px solid #4f46e5', borderRadius: '12px', direction: 'rtl' }}
              labelStyle={{ color: '#e2e8f0' }}
              formatter={(value: number) => [`${value.toLocaleString()} 💰`]}
            />
            <Legend />
            <Area type="monotone" dataKey="income" name="الإيرادات" stroke="#10b981" fill="#10b981" fillOpacity={0.3} strokeWidth={2} />
            <Area type="monotone" dataKey="expense" name="المصروفات" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-pie text-emerald-400"></i>
            توزيع الإيرادات
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={incomePieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {incomePieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #4f46e5', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="fa-solid fa-chart-pie text-red-400"></i>
            توزيع المصروفات
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={expensePieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {expensePieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #4f46e5', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-clock-rotate-left text-purple-400"></i>
          سجل المعاملات
        </h3>
        <div className="space-y-2">
          {treasuryEntries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  entry.type === 'income'
                    ? 'bg-emerald-500/20 border border-emerald-500/30'
                    : 'bg-red-500/20 border border-red-500/30'
                }`}>
                  <i className={`fa-solid ${entry.type === 'income' ? 'fa-arrow-down text-emerald-400' : 'fa-arrow-up text-red-400'}`}></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{entry.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300">{entry.category}</span>
                    <span className="text-xs text-slate-500">{entry.date}</span>
                  </div>
                </div>
              </div>
              <p className={`text-lg font-bold ${entry.type === 'income' ? 'text-emerald-300' : 'text-red-300'}`}>
                {entry.type === 'income' ? '+' : '-'}{entry.amount.toLocaleString()} 💰
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TreasuryPage;
