export interface Country {
  id: number;
  name: string;
  flag: string;
  treasury: number;
  population: number;
  gdp: number;
  taxRate: number;
  inflation: number;
}

export interface Resource {
  id: number;
  name: string;
  icon: string;
  basePrice: number;
  currentPrice: number;
  change24h: number;
  supply: number;
  demand: number;
}

export interface MarketOffer {
  id: number;
  type: 'buy' | 'sell';
  resource: string;
  quantity: number;
  price: number;
  country: string;
  seller: string;
  timestamp: string;
}

export interface JobOffer {
  id: number;
  title: string;
  company: string;
  country: string;
  salary: number;
  type: string;
  posted: string;
}

export interface TreasuryEntry {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface User {
  id: string;
  gameId: string;
  username: string;
  country: string;
  countryFlag: string;
  role: 'owner' | 'member';
  serial: string;
  status: 'active' | 'pending' | 'suspended';
  lastLogin: string;
  ip: string;
  deviceFingerprint: string;
}

export interface PriceHistory {
  date: string;
  price: number;
}

export const countries: Country[] = [
  { id: 1, name: 'نوفاريا', flag: '🏔️', treasury: 2450000, population: 15420, gdp: 8900000, taxRate: 12, inflation: 3.2 },
  { id: 2, name: 'أركاديا', flag: '🌊', treasury: 3120000, population: 22100, gdp: 12500000, taxRate: 15, inflation: 2.8 },
  { id: 3, name: 'سولاريا', flag: '☀️', treasury: 1890000, population: 9800, gdp: 5600000, taxRate: 10, inflation: 4.1 },
  { id: 4, name: 'فروستلاند', flag: '❄️', treasury: 4200000, population: 31000, gdp: 18200000, taxRate: 18, inflation: 1.9 },
  { id: 5, name: 'إيمريون', flag: '🌿', treasury: 1560000, population: 7200, gdp: 3800000, taxRate: 8, inflation: 5.3 },
  { id: 6, name: 'ثاندوريا', flag: '⚡', treasury: 2780000, population: 18900, gdp: 10200000, taxRate: 14, inflation: 3.7 },
];

export const resources: Resource[] = [
  { id: 1, name: 'خشب', icon: '🪵', basePrice: 45, currentPrice: 52, change24h: 5.2, supply: 12500, demand: 9800 },
  { id: 2, name: 'حديد', icon: '⛏️', basePrice: 120, currentPrice: 135, change24h: -2.1, supply: 5400, demand: 7200 },
  { id: 3, name: 'ذهب', icon: '🥇', basePrice: 850, currentPrice: 920, change24h: 8.4, supply: 1200, demand: 1800 },
  { id: 4, name: 'قمح', icon: '🌾', basePrice: 25, currentPrice: 22, change24h: -4.5, supply: 28000, demand: 22000 },
  { id: 5, name: 'نفط', icon: '🛢️', basePrice: 200, currentPrice: 215, change24h: 3.8, supply: 3200, demand: 4100 },
  { id: 6, name: 'ألماس', icon: '💎', basePrice: 2500, currentPrice: 2680, change24h: 12.3, supply: 340, demand: 520 },
  { id: 7, name: 'قماش', icon: '🧵', basePrice: 35, currentPrice: 38, change24h: 1.2, supply: 18000, demand: 15000 },
  { id: 8, name: 'حجر', icon: '🪨', basePrice: 15, currentPrice: 14, change24h: -1.8, supply: 45000, demand: 38000 },
];

export const marketOffers: MarketOffer[] = [
  { id: 1, type: 'sell', resource: 'خشب', quantity: 500, price: 50, country: 'نوفاريا', seller: 'Player_X', timestamp: 'منذ 5 دقائق' },
  { id: 2, type: 'buy', resource: 'حديد', quantity: 200, price: 130, country: 'أركاديا', seller: 'IronLord', timestamp: 'منذ 12 دقيقة' },
  { id: 3, type: 'sell', resource: 'ذهب', quantity: 50, price: 900, country: 'سولاريا', seller: 'GoldMiner', timestamp: 'منذ 23 دقيقة' },
  { id: 4, type: 'buy', resource: 'قمح', quantity: 1000, price: 20, country: 'فروستلاند', seller: 'FarmKing', timestamp: 'منذ 34 دقيقة' },
  { id: 5, type: 'sell', resource: 'نفط', quantity: 100, price: 210, country: 'ثاندوريا', seller: 'OilBaron', timestamp: 'منذ 45 دقيقة' },
  { id: 6, type: 'sell', resource: 'ألماس', quantity: 10, price: 2600, country: 'إيمريون', seller: 'DiamondHands', timestamp: 'منذ ساعة' },
  { id: 7, type: 'buy', resource: 'خشب', quantity: 800, price: 48, country: 'أركاديا', seller: 'BuilderPro', timestamp: 'منذ ساعة' },
  { id: 8, type: 'sell', resource: 'قماش', quantity: 300, price: 36, country: 'نوفاريا', seller: 'TextileKing', timestamp: 'منذ ساعتين' },
];

export const jobOffers: JobOffer[] = [
  { id: 1, title: 'عامل مناجم', company: 'شركة التعدين المتحدة', country: 'نوفاريا', salary: 450, type: 'دوام كامل', posted: 'منذ يوم' },
  { id: 2, title: 'مزارع', company: 'مزارع أركاديا', country: 'أركاديا', salary: 320, type: 'دوام كامل', posted: 'منذ يومين' },
  { id: 3, title: 'تاجر', company: 'سوق الذهب الكبير', country: 'سولاريا', salary: 680, type: 'حر', posted: 'منذ 3 أيام' },
  { id: 4, title: 'مهندس بناء', company: 'بنّاءو فروستلاند', country: 'فروستلاند', salary: 550, type: 'دوام كامل', posted: 'منذ 4 أيام' },
  { id: 5, title: 'حارس غابة', company: 'حماية إيمريون', country: 'إيمريون', salary: 380, type: 'جزئي', posted: 'منذ 5 أيام' },
  { id: 6, title: 'عامل نفط', company: 'طاقة ثاندوريا', country: 'ثاندوريا', salary: 720, type: 'دوام كامل', posted: 'منذ أسبوع' },
];

export const treasuryEntries: TreasuryEntry[] = [
  { id: 1, type: 'income', category: 'ضرائب', amount: 125000, date: '2024-01-15', description: 'إيرادات ضريبية شهرية' },
  { id: 2, type: 'income', category: 'رسوم تجارية', amount: 45000, date: '2024-01-14', description: 'رسوم معاملات السوق' },
  { id: 3, type: 'expense', category: 'رواتب', amount: 89000, date: '2024-01-13', description: 'رواتب الموظفين الحكوميين' },
  { id: 4, type: 'expense', category: 'بنية تحتية', amount: 156000, date: '2024-01-12', description: 'بناء طرق جديدة' },
  { id: 5, type: 'income', category: 'موارد طبيعية', amount: 78000, date: '2024-01-11', description: 'إيرادات استخراج الموارد' },
  { id: 6, type: 'expense', category: 'دفاع', amount: 210000, date: '2024-01-10', description: 'تجهيزات عسكرية' },
  { id: 7, type: 'income', category: 'استثمارات', amount: 34000, date: '2024-01-09', description: 'أرباح استثمارات خارجية' },
];

export const priceHistory: PriceHistory[] = [
  { date: 'يناير', price: 42 },
  { date: 'فبراير', price: 45 },
  { date: 'مارس', price: 48 },
  { date: 'أبريل', price: 44 },
  { date: 'مايو', price: 51 },
  { date: 'يونيو', price: 55 },
  { date: 'يوليو', price: 52 },
  { date: 'أغسطس', price: 58 },
  { date: 'سبتمبر', price: 54 },
  { date: 'أكتوبر', price: 60 },
  { date: 'نوفمبر', price: 57 },
  { date: 'ديسمبر', price: 52 },
];

export const users: User[] = [
  { id: '1', gameId: '10001', username: 'أحمد_نوفاريا', country: 'نوفاريا', countryFlag: '🏔️', role: 'member', serial: 'A1B2-C3D4-E5F6-G7H8', status: 'active', lastLogin: '2024-01-15 14:30', ip: '192.168.1.1', deviceFingerprint: 'fp_abc123' },
  { id: '2', gameId: '10002', username: 'سارة_أركاديا', country: 'أركاديا', countryFlag: '🌊', role: 'member', serial: 'I9J0-K1L2-M3N4-O5P6', status: 'active', lastLogin: '2024-01-15 12:15', ip: '192.168.1.2', deviceFingerprint: 'fp_def456' },
  { id: '3', gameId: '10003', username: 'خالد_سولاريا', country: 'سولاريا', countryFlag: '☀️', role: 'member', serial: 'Q7R8-S9T0-U1V2-W3X4', status: 'pending', lastLogin: '-', ip: '-', deviceFingerprint: 'fp_ghi789' },
  { id: '4', gameId: '10004', username: 'نور_فروستلاند', country: 'فروستلاند', countryFlag: '❄️', role: 'member', serial: 'Y5Z6-A7B8-C9D0-E1F2', status: 'suspended', lastLogin: '2024-01-10 09:00', ip: '192.168.1.4', deviceFingerprint: 'fp_jkl012' },
  { id: '5', gameId: '10005', username: 'مالك_إيمريون', country: 'إيمريون', countryFlag: '🌿', role: 'owner', serial: 'G3H4-I5J6-K7L8-M9N0', status: 'active', lastLogin: '2024-01-15 16:45', ip: '192.168.1.5', deviceFingerprint: 'fp_mno345' },
];

export const globalMarketComparison = [
  { resource: 'خشب', novaria: 52, arcadia: 48, solaria: 55, frostland: 44, emrion: 58, thandoria: 50 },
  { resource: 'حديد', novaria: 135, arcadia: 128, solaria: 142, frostland: 120, emrion: 148, thandoria: 130 },
  { resource: 'ذهب', novaria: 920, arcadia: 880, solaria: 950, frostland: 850, emrion: 980, thandoria: 900 },
  { resource: 'قمح', novaria: 22, arcadia: 20, solaria: 25, frostland: 18, emrion: 28, thandoria: 23 },
  { resource: 'نفط', novaria: 215, arcadia: 200, solaria: 225, frostland: 190, emrion: 235, thandoria: 210 },
];

export const revenueData = [
  { month: 'يناير', income: 245000, expense: 180000 },
  { month: 'فبراير', income: 268000, expense: 195000 },
  { month: 'مارس', income: 290000, expense: 210000 },
  { month: 'أبريل', income: 275000, expense: 225000 },
  { month: 'مايو', income: 310000, expense: 240000 },
  { month: 'يونيو', income: 335000, expense: 255000 },
];

export const activationCodes = [
  { id: '1', code: 'ECLE-2024-ABCD-1234', duration: '30 يوم', createdBy: 'المالك', usedBy: 'أحمد_نوفاريا', status: 'مستخدم', createdAt: '2024-01-10' },
  { id: '2', code: 'ECLE-2024-EFGH-5678', duration: 'مفتوح', createdBy: 'المالك', usedBy: '-', status: 'متاح', createdAt: '2024-01-12' },
  { id: '3', code: 'ECLE-2024-IJKL-9012', duration: '7 أيام', createdBy: 'المالك', usedBy: 'سارة_أركاديا', status: 'منتهي', createdAt: '2024-01-05' },
];
