import React, { useEffect, useState } from 'react';
import { jobsService, countriesService } from '../services/supabaseService';
import type { JobOffer, Country } from '../services/supabaseService';

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryFilter, setCountryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [jRes, cRes] = await Promise.all([
        jobsService.getAll(),
        countriesService.getAll(),
      ]);
      if (jRes.data) setJobs(jRes.data);
      if (cRes.data) setCountries(cRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const countryMatch = countryFilter === 'all' || job.country_name === countryFilter;
    const typeMatch = typeFilter === 'all' || job.type === typeFilter;
    return countryMatch && typeMatch;
  });

  const avgSalary = jobs.length > 0 ? Math.round(jobs.reduce((a, j) => a + j.salary, 0) / jobs.length) : 0;
  const maxSalary = jobs.length > 0 ? Math.max(...jobs.map(j => j.salary)) : 0;
  const minSalary = jobs.length > 0 ? Math.min(...jobs.map(j => j.salary)) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-indigo-400 mb-4"></i>
          <p className="text-slate-400">جاري تحميل عروض العمل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 slide-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <i className="fa-solid fa-briefcase text-cyan-400"></i>
          سوق العمل
        </h1>
        <p className="text-slate-400 text-sm mt-1">عروض العمل والأجور في جميع الدول (بيانات Supabase)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-5 stat-card">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-3">
            <i className="fa-solid fa-briefcase text-white text-sm"></i>
          </div>
          <p className="text-2xl font-bold text-white">{jobs.length}</p>
          <p className="text-xs text-slate-400 mt-1">عرض عمل متاح</p>
        </div>
        <div className="glass-card rounded-xl p-5 stat-card">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-3">
            <i className="fa-solid fa-money-bill-trend-up text-white text-sm"></i>
          </div>
          <p className="text-2xl font-bold text-white">{avgSalary}</p>
          <p className="text-xs text-slate-400 mt-1">متوسط الأجر 💰/يوم</p>
        </div>
        <div className="glass-card rounded-xl p-5 stat-card">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center mb-3">
            <i className="fa-solid fa-arrow-trend-up text-white text-sm"></i>
          </div>
          <p className="text-2xl font-bold text-white">{maxSalary}</p>
          <p className="text-xs text-slate-400 mt-1">أعلى أجر 💰/يوم</p>
        </div>
        <div className="glass-card rounded-xl p-5 stat-card">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
            <i className="fa-solid fa-arrow-trend-down text-white text-sm"></i>
          </div>
          <p className="text-2xl font-bold text-white">{minSalary}</p>
          <p className="text-xs text-slate-400 mt-1">أدنى أجر 💰/يوم</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">الدولة:</span>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="all">جميع الدول</option>
              {countries.map(c => (
                <option key={c.id} value={c.name}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">نوع العمل:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="all">الكل</option>
              <option value="دوام كامل">دوام كامل</option>
              <option value="جزئي">جزئي</option>
              <option value="حر">حر</option>
            </select>
          </div>
          <span className="mr-auto text-xs text-slate-400">{filteredJobs.length} عرض</span>
        </div>
      </div>

      {/* Average Salary by Country */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-chart-bar text-emerald-400"></i>
          متوسط الأجور حسب الدولة
        </h3>
        <div className="space-y-3">
          {countries.map(country => {
            const countryJobs = jobs.filter(j => j.country_name === country.name);
            const avg = countryJobs.length > 0 ? Math.round(countryJobs.reduce((a, j) => a + j.salary, 0) / countryJobs.length) : 0;
            const percentage = maxSalary > 0 ? (avg / maxSalary) * 100 : 0;

            return (
              <div key={country.id} className="flex items-center gap-4">
                <div className="w-28 flex items-center gap-2">
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm text-slate-300">{country.name}</span>
                </div>
                <div className="flex-1">
                  <div className="h-6 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-cyan-500 to-blue-500 flex items-center justify-end px-2 transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 10)}%` }}
                    >
                      {avg > 0 && <span className="text-xs font-bold text-white">{avg} 💰</span>}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-400 w-16 text-left">{countryJobs.length} عروض</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Job Listings */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <i className="fa-solid fa-list-check text-indigo-400"></i>
          عروض العمل المتاحة
        </h3>
        <div className="space-y-3">
          {filteredJobs.map((job) => {
            const country = countries.find(c => c.name === job.country_name);
            return (
              <div key={job.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/20">
                    <i className="fa-solid fa-building text-cyan-400 text-lg"></i>
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">{job.title}</p>
                    <p className="text-sm text-slate-400">{job.company}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500">{country?.flag} {job.country_name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">{job.type}</span>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-emerald-300">{job.salary} 💰</p>
                  <p className="text-xs text-slate-400">/ يوم</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(job.posted_at).toLocaleDateString('ar')}</p>
                </div>
              </div>
            );
          })}
          {filteredJobs.length === 0 && (
            <p className="text-slate-400 text-center py-10">لا توجد عروض عمل مطابقة</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
