-- Supabase Table Initialization Script for Travel Itinerary App
-- All tables are prefixed with tb_ to avoid conflicts with existing tables.

CREATE TABLE IF NOT EXISTS public.tb_trips (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    status TEXT DEFAULT 'In progress',
    cover_image TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tb_itineraries (
    id TEXT PRIMARY KEY,
    trip_id TEXT REFERENCES public.tb_trips(id) ON DELETE CASCADE,
    day_label TEXT,
    location_name TEXT NOT NULL,
    category TEXT DEFAULT '⛱ 景點',
    description TEXT,
    cost_twd NUMERIC DEFAULT 0,
    cost_foreign NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'TWD',
    image_url TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tb_expenses (
    id TEXT PRIMARY KEY,
    trip_id TEXT REFERENCES public.tb_trips(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    amount NUMERIC DEFAULT 0,
    is_paid BOOLEAN DEFAULT true,
    category TEXT DEFAULT '雜項',
    payer TEXT DEFAULT '公費',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tb_packing (
    id TEXT PRIMARY KEY,
    trip_id TEXT REFERENCES public.tb_trips(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    category TEXT DEFAULT '一般',
    is_packed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and public policies
ALTER TABLE public.tb_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tb_packing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read tb_trips" ON public.tb_trips FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete tb_trips" ON public.tb_trips FOR ALL USING (true);

CREATE POLICY "Allow public read tb_itineraries" ON public.tb_itineraries FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete tb_itineraries" ON public.tb_itineraries FOR ALL USING (true);

CREATE POLICY "Allow public read tb_expenses" ON public.tb_expenses FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete tb_expenses" ON public.tb_expenses FOR ALL USING (true);

CREATE POLICY "Allow public read tb_packing" ON public.tb_packing FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete tb_packing" ON public.tb_packing FOR ALL USING (true);