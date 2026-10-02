import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asvhpyfzdtzuygoivcmd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdmhweWZ6ZHR6dXlnb2l2Y21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4OTI4NTIsImV4cCI6MjEwNjQ2ODg1Mn0.gVd7lXdqnDSlpXzRbMNRBbjavR5CGNqsyQd1Jm52Qg4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to explore tables
export const exploreDatabase = async () => {
  const tables = ['users', 'countries', 'resources', 'market_offers', 'job_offers', 'treasury_entries', 'activation_codes', 'price_history'];
  const results: Record<string, any> = {};
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table as any)
        .select('*', { count: 'exact', head: false })
        .limit(1);
      
      results[table] = {
        exists: !error || error?.message?.includes('not found') === false,
        error: error?.message,
        sample: data?.[0] || null,
        count: count
      };
    } catch (e: any) {
      results[table] = { exists: false, error: e.message };
    }
  }
  
  return results;
};
