import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tumnkqggbyvjzwrffuao.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_3xMmRJFjIxy5XlBCl-e5kw_XytxHJ5b';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true },
  realtime: { disabled: false }
});

// Table Name Constants (Prefixed with tb_ as requested)
export const TB_TRIPS = 'tb_trips';
export const TB_ITINERARIES = 'tb_itineraries';
export const TB_EXPENSES = 'tb_expenses';
export const TB_PACKING = 'tb_packing';
export const TB_USERS = 'tb_users';

// User Authentication verification from Supabase `tb_users`
export async function verifyUserCredentials(username, password) {
  try {
    const { data, error } = await supabase
      .from(TB_USERS)
      .select('*')
      .eq('username', username.trim())
      .eq('password', password)
      .single();

    if (!error && data) {
      return { success: true, user: data };
    }
  } catch (err) {
    console.warn('Database user check error:', err);
  }

  return { success: false, error: '帳號或密碼錯誤！' };
}

// 1. Fetch Trips directly from Supabase `tb_trips` ordered descending by start_date (newest first)
export async function fetchTrips() {
  try {
    const { data, error } = await supabase.from(TB_TRIPS).select('*').order('start_date', { ascending: false });
    if (!error && data) {
      return { data, isSupabase: true, error: null };
    }
    if (error) {
      console.error('Supabase tb_trips error:', error.message);
      return { data: [], isSupabase: false, error: error.message };
    }
  } catch (err) {
    console.error('Supabase fetch error:', err);
  }
  return { data: [], isSupabase: false, error: 'Network or Supabase error' };
}

// 2. Fetch Itineraries directly from Supabase `tb_itineraries`
export async function fetchItineraries(tripId) {
  try {
    let query = supabase.from(TB_ITINERARIES).select('*').order('sort_order', { ascending: true });
    if (tripId) {
      query = query.eq('trip_id', tripId);
    }
    const { data, error } = await query;
    if (!error && data) {
      return { data, isSupabase: true };
    }
    if (error) {
      console.error('Supabase tb_itineraries error:', error.message);
    }
  } catch (err) {
    console.error('Supabase fetch itineraries error:', err);
  }
  return { data: [], isSupabase: false };
}

// 3. Fetch Expenses directly from Supabase `tb_expenses`
export async function fetchExpenses(tripId) {
  try {
    let query = supabase.from(TB_EXPENSES).select('*').order('created_at', { ascending: false });
    if (tripId) {
      query = query.eq('trip_id', tripId);
    }
    const { data, error } = await query;
    if (!error && data) {
      return { data, isSupabase: true };
    }
    if (error) {
      console.error('Supabase tb_expenses error:', error.message);
    }
  } catch (err) {
    console.error('Supabase fetch expenses error:', err);
  }
  return { data: [], isSupabase: false };
}

// 4. Fetch Packing List directly from Supabase `tb_packing`
export async function fetchPacking(tripId) {
  try {
    let query = supabase.from(TB_PACKING).select('*');
    if (tripId) {
      query = query.eq('trip_id', tripId);
    }
    const { data, error } = await query;
    if (!error && data) {
      return { data, isSupabase: true };
    }
    if (error) {
      console.error('Supabase tb_packing error:', error.message);
    }
  } catch (err) {
    console.error('Supabase fetch packing error:', err);
  }
  return { data: [], isSupabase: false };
}

// Save & Mutation functions writing directly to Supabase tables (tb_*)
export async function saveTrip(trip) {
  try {
    const { data, error } = await supabase.from(TB_TRIPS).upsert(trip).select();
    if (!error) return { data, isSupabase: true };
    console.error('Save trip Supabase error:', error.message);
  } catch (e) {
    console.error('Failed saving trip to Supabase:', e);
  }
  return { data: [trip], isSupabase: false };
}

export async function saveItinerary(item) {
  try {
    const { data, error } = await supabase.from(TB_ITINERARIES).upsert(item).select();
    if (!error) return { data, isSupabase: true };
    console.error('Save itinerary Supabase error:', error.message);
  } catch (e) {
    console.error('Failed saving itinerary to Supabase:', e);
  }
  return { data: [item], isSupabase: false };
}

export async function deleteItinerary(id) {
  try {
    await supabase.from(TB_ITINERARIES).delete().eq('id', id);
  } catch (e) {
    console.error('Delete itinerary error:', e);
  }
}

export async function saveExpense(expense) {
  try {
    const { data, error } = await supabase.from(TB_EXPENSES).upsert(expense).select();
    if (!error) return { data, isSupabase: true };
    console.error('Save expense Supabase error:', error.message);
  } catch (e) {
    console.error('Failed saving expense to Supabase:', e);
  }
  return { data: [expense], isSupabase: false };
}

export async function deleteExpense(id) {
  try {
    await supabase.from(TB_EXPENSES).delete().eq('id', id);
  } catch (e) {
    console.error('Delete expense error:', e);
  }
}

export async function savePackingItem(item) {
  try {
    const { data, error } = await supabase.from(TB_PACKING).upsert(item).select();
    if (!error) return { data, isSupabase: true };
    console.error('Save packing item Supabase error:', error.message);
  } catch (e) {
    console.error('Failed saving packing item to Supabase:', e);
  }
  return { data: [item], isSupabase: false };
}
