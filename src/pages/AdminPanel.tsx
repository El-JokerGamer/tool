import React, { useEffect, useState } from 'react';
import { adminService } from '../services/supabaseService';
import type { User, ActivationCode } from '../services/supabaseService';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'codes' | 'stats'>('users');
  const [users, setUsers] = useState<(User & { countries?: any })[]>([]);
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [uRes, cRes] = await Promise.all([
      adminService.getAllUsers(),
      adminService.getAllCodes(),
    ]);
    if (uRes.data) setUsers(uRes.data as any);
    if (cRes.data) setCodes(cRes.data);
    setLoading(false);
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const { data } = await adminService.updateUserStatus(userId, newStatus);
    if (data) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus as any } : u));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      await adminService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleGenerateCode = async () => {
    const { data } = await adminService.generateCode('30 يوم', '');
    if (data) {
      setCodes(prev => [data, ...prev]);
    }
  };

  const tabs = [
    { id: 'users', label: 'المستخدمين', icon: 'fa-solid fa-users' },
    { id: 'codes', label: 'أكواد التفعيل', icon: 'fa-solid fa-key' },
    { id: 'stats', label: 'إحصائيات', icon: 'fa-solid fa-chart-simple' },
  ];

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    pendingUsers: users.filter(u => u.status === 'pending').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length,
    totalCodes: codes.length,
    availableCodes: codes.filter(c => c.status === 'available').length,
    usedCodes: codes.filter(c => c.status === 'used').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-indigo-400 mb-4"></i>
          <p className="text-slate-400">جاري تحميل بيانات لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <i className="fa-solid fa-shield-halved text-amber-400"></i>
            لوحة التحكم
          </h1>
          <p className="text-slate-400 text-sm mt-1">إدارة المستخدمين وأكواد التفعيل (Supabase)</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <i className="fa-solid fa-crown text-amber-400 text-sm"></i>
          <span className="text-xs text-amber-300 font-medium">صلاحيات المالك</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 stat-card">
          <p className="text-xs text-slate-400 mb-1">إجمالي المستخدمين</p>
          <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
        </div>
        <div className="glass-card rounded-xl p-4 stat-card">
          <p className="text-xs text-slate-400 mb-1">نشط</p>
          <p className="text-2xl font-bold text-emerald-300">{stats.activeUsers}</p>
        </div>
        <div className="glass-card rounded-xl p-4 stat-card">
          <p className="text-xs text-slate-400 mb-1">في الانتظار</p>
          <p className="text-2xl font-bold text-amber-300">{stats.pendingUsers}</p>
        </div>
        <div className="glass-card rounded-xl p-4 stat-card">
          <p className="text-xs text-slate-400 mb-1">محظور</p>
          <p className="text-2xl font-bold text-red-300">{stats.suspendedUsers}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card rounded-xl p-2">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <i className={tab.icon}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-users text-indigo-400"></i>
              إدارة المستخدمين
            </h3>
            <button onClick={fetchData} className="text-xs text-indigo-400 hover:text-indigo-300">
              <i className="fa-solid fa-rotate ml-1"></i> تحديث
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-right py-3 px-3 text-slate-400 font-medium">المستخدم</th>
                  <th className="text-right py-3 px-3 text-slate-400 font-medium">الدولة</th>
                  <th className="text-right py-3 px-3 text-slate-400 font-medium">الدور</th>
                  <th className="text-right py-3 px-3 text-slate-400 font-medium">الحالة</th>
                  <th className="text-right py-3 px-3 text-slate-400 font-medium">آخر دخول</th>
                  <th className="text-right py-3 px-3 text-slate-400 font-medium">IP</th>
                  <th className="text-right py-3 px-3 text-slate-400 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                          {u.username?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{u.username}</p>
                          <p className="text-xs text-slate-500 font-mono">ID: {u.game_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-300">{u.countries?.flag || '🌍'} {u.countries?.name || '-'}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${u.role === 'owner' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300'}`}>
                        {u.role === 'owner' ? '👑 مالك' : '👤 عضو'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        u.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {u.status === 'active' ? '✅ نشط' : u.status === 'pending' ? '⏳ انتظار' : '🚫 محظور'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-slate-400">{u.last_login ? new Date(u.last_login).toLocaleString('ar') : '-'}</td>
                    <td className="py-3 px-3 text-xs text-slate-400 font-mono">{u.ip_address || '-'}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            u.status === 'active' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                          title={u.status === 'active' ? 'تعطيل' : 'تفعيل'}
                        >
                          <i className={`fa-solid ${u.status === 'active' ? 'fa-ban' : 'fa-check'} text-xs`}></i>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          title="حذف"
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="text-slate-400 text-center py-10">لا يوجد مستخدمين</p>
            )}
          </div>
        </div>
      )}

      {/* Codes Tab */}
      {activeTab === 'codes' && (
        <div className="space-y-6">
          {/* Generate Code */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-plus-circle text-emerald-400"></i>
              توليد كود تفعيل جديد
            </h3>
            <div className="flex items-end gap-4">
              <button
                onClick={handleGenerateCode}
                className="px-6 py-2 rounded-lg bg-gradient-to-l from-emerald-600 to-emerald-500 text-white font-medium text-sm hover:from-emerald-500 hover:to-emerald-400 transition-all flex items-center gap-2"
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span>توليد كود جديد</span>
              </button>
              <span className="text-xs text-slate-400">سيتم توليد كود بمدة 30 يوم</span>
            </div>
          </div>

          {/* Codes List */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-key text-amber-400"></i>
              أكواد التفعيل
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-right py-3 px-3 text-slate-400 font-medium">الكود</th>
                    <th className="text-right py-3 px-3 text-slate-400 font-medium">المدة</th>
                    <th className="text-right py-3 px-3 text-slate-400 font-medium">الحالة</th>
                    <th className="text-right py-3 px-3 text-slate-400 font-medium">تاريخ الإنشاء</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((code) => (
                    <tr key={code.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3">
                        <code className="text-indigo-300 font-mono text-xs bg-slate-800 px-2 py-1 rounded">{code.code}</code>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{code.duration}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          code.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' :
                          code.status === 'used' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          {code.status === 'available' ? 'متاح' : code.status === 'used' ? 'مستخدم' : 'منتهي'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs text-slate-400">{new Date(code.created_at).toLocaleDateString('ar')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {codes.length === 0 && (
                <p className="text-slate-400 text-center py-10">لا توجد أكواد</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <i className="fa-solid fa-chart-pie text-indigo-400"></i>
                توزيع المستخدمين
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    <span className="text-sm text-slate-300">نشط</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-white">{stats.activeUsers}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <span className="text-sm text-slate-300">في الانتظار</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${stats.totalUsers > 0 ? (stats.pendingUsers / stats.totalUsers) * 100 : 0}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-white">{stats.pendingUsers}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <span className="text-sm text-slate-300">محظور</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: `${stats.totalUsers > 0 ? (stats.suspendedUsers / stats.totalUsers) * 100 : 0}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-white">{stats.suspendedUsers}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <i className="fa-solid fa-key text-amber-400"></i>
                حالة أكواد التفعيل
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    <span className="text-sm text-slate-300">متاح</span>
                  </div>
                  <span className="text-sm font-bold text-white">{stats.availableCodes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span className="text-sm text-slate-300">مستخدم</span>
                  </div>
                  <span className="text-sm font-bold text-white">{stats.usedCodes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                    <span className="text-sm text-slate-300">منتهي</span>
                  </div>
                  <span className="text-sm font-bold text-white">{stats.totalCodes - stats.usedCodes - stats.availableCodes}</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-server text-cyan-400"></i>
              معلومات النظام
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                <p className="text-xs text-slate-400 mb-1">الإصدار</p>
                <p className="text-sm font-bold text-white">v2.0.0</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                <p className="text-xs text-slate-400 mb-1">قاعدة البيانات</p>
                <p className="text-sm font-bold text-emerald-300">Supabase ✅</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                <p className="text-xs text-slate-400 mb-1">المصادقة</p>
                <p className="text-sm font-bold text-emerald-300">Device FP ✅</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                <p className="text-xs text-slate-400 mb-1">آخر مزامنة</p>
                <p className="text-sm font-bold text-white">الآن</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
