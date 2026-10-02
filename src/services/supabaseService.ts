import { supabase } from '../lib/supabase';

// Types
export interface Country {
  id: number;
  name: string;
  flag: string;
  treasury: number;
  population: number;
  gdp: number;
  tax_rate: number;
  inflation: number;
}

export interface Resource {
  id: number;
  name: string;
  icon: string;
  base_price: number;
  current_price: number;
  change_24h: number;
  supply: number;
  demand: number;
}

export interface MarketOffer {
  id: number;
  type: 'buy' | 'sell';
  resource_name: string;
  quantity: number;
  price: number;
  country_name: string;
  seller: string;
  created_at: string;
}

export interface JobOffer {
  id: number;
  title: string;
  company: string;
  country_name: string;
  salary: number;
  type: string;
  posted_at: string;
}

export interface TreasuryEntry {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  entry_date: string;
  description: string;
}

export interface User {
  id: string;
  game_id: string;
  username: string;
  country_id: number;
  role: 'owner' | 'member';
  serial: string;
  status: 'active' | 'pending' | 'suspended';
  last_login: string | null;
  ip_address: string | null;
  device_fingerprint: string | null;
  countries?: Country;
}

export interface ActivationCode {
  id: string;
  code: string;
  duration: string;
  status: 'available' | 'used' | 'expired';
  used_by: string | null;
  created_at: string;
  expires_at: string | null;
}

export interface PriceHistory {
  id: number;
  resource_id: number;
  price: number;
  record_date: string;
}

export interface GlobalMarketComparison {
  id: number;
  resource_name: string;
  country_id: number;
  price: number;
}

export interface RevenueData {
  id: number;
  month_name: string;
  income: number;
  expense: number;
}

// ============ AUTH SERVICE ============

export const authService = {
  // تسجيل مستخدم جديد
  async signup(gameId: string, deviceFingerprint: string) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('game_id', gameId)
        .single();

      if (existingUser) {
        return { success: false, error: 'هذا الحساب مسجل بالفعل', serial: existingUser.serial };
      }

      // Generate serial
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let serial = '';
      for (let i = 0; i < 16; i++) {
        if (i > 0 && i % 4 === 0) serial += '-';
        serial += chars[Math.floor(Math.random() * chars.length)];
      }

      // Try to fetch user data from game API (mock for now)
      const username = `لاعب_${gameId}`;
      const countryId = Math.floor(Math.random() * 6) + 1;

      // Insert new user
      const { data, error } = await supabase
        .from('users')
        .insert({
          game_id: gameId,
          username,
          country_id: countryId,
          role: 'member',
          serial,
          status: 'pending',
          device_fingerprint: deviceFingerprint,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message, serial: null };
      }

      return { success: true, serial, data };
    } catch (error: any) {
      return { success: false, error: error.message, serial: null };
    }
  },

  // تسجيل الدخول
  async login(gameId: string, serial: string, deviceFingerprint: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*, countries(*)')
        .eq('game_id', gameId)
        .eq('serial', serial)
        .single();

      if (error || !data) {
        return { success: false, error: 'بيانات الدخول غير صحيحة', user: null };
      }

      if (data.status === 'suspended') {
        return { success: false, error: 'حسابك محظور. تواصل مع الإدارة.', user: null };
      }

      if (data.status === 'pending') {
        return { success: false, error: 'حسابك في انتظار التفعيل من الأدمن.', user: null };
      }

      // Check device fingerprint
      if (data.device_fingerprint && data.device_fingerprint !== deviceFingerprint) {
        return { success: false, error: 'جهاز غير معترف به. السيريال مربوط بجهاز آخر.', user: null };
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id);

      return { success: true, user: data, error: null };
    } catch (error: any) {
      return { success: false, error: error.message, user: null };
    }
  },
};

// ============ COUNTRIES SERVICE ============

export const countriesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('gdp', { ascending: false });
    return { data: data || [], error };
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async getByName(name: string) {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('name', name)
      .single();
    return { data, error };
  },
};

// ============ RESOURCES SERVICE ============

export const resourcesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('current_price', { ascending: false });
    return { data: data || [], error };
  },
};

// ============ MARKET SERVICE ============

export const marketService = {
  async getAll() {
    const { data, error } = await supabase
      .from('market_offers')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data || [], error };
  },
};

// ============ JOBS SERVICE ============

export const jobsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('job_offers')
      .select('*')
      .order('posted_at', { ascending: false });
    return { data: data || [], error };
  },
};

// ============ TREASURY SERVICE ============

export const treasuryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('treasury_entries')
      .select('*')
      .order('entry_date', { ascending: false });
    return { data: data || [], error };
  },
};

// ============ PRICE HISTORY SERVICE ============

export const priceHistoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .order('record_date', { ascending: true });
    return { data: data || [], error };
  },
};

// ============ GLOBAL MARKET SERVICE ============

export const globalMarketService = {
  async getAll() {
    const { data, error } = await supabase
      .from('global_market_comparison')
      .select('*');
    return { data: data || [], error };
  },
};

// ============ REVENUE SERVICE ============

export const revenueService = {
  async getAll() {
    const { data, error } = await supabase
      .from('revenue_data')
      .select('*')
      .order('id', { ascending: true });
    return { data: data || [], error };
  },
};

// ============ ADMIN SERVICE ============

export const adminService = {
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*, countries(*)')
      .order('created_at', { ascending: false });
    return { data: data || [], error };
  },

  async updateUserStatus(userId: string, status: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  async deleteUser(userId: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    return { error };
  },

  async getAllCodes() {
    const { data, error } = await supabase
      .from('activation_codes')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data || [], error };
  },

  async generateCode(duration: string, createdBy: string) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'ECLE-2024-';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    code += '-';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];

    const { data, error } = await supabase
      .from('activation_codes')
      .insert({ code, duration, status: 'available' })
      .select()
      .single();
    return { data, error };
  },

  async updateSerial(userId: string, newSerial: string, newFingerprint: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ serial: newSerial, device_fingerprint: newFingerprint })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },
};
