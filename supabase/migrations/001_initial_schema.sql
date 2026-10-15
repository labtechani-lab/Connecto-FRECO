-- CONNECTO Multi-Business Platform
-- Migration: 001_initial_schema.sql
-- Description: Core schema with Row Level Security (RLS) for multi-tenant businesses, owners, and public access.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Role Enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'admin', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role user_role DEFAULT 'customer' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Businesses Table (Multi-Business Tenant Core)
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    tagline TEXT,
    identity TEXT,
    badge TEXT,
    theme_config JSONB DEFAULT '{"primaryColor": "#e63946", "bgColor": "#0b0c0e", "textColor": "#fdfbf7"}'::jsonb NOT NULL,
    address JSONB NOT NULL,
    contact JSONB NOT NULL,
    operating_hours JSONB NOT NULL,
    amenities JSONB DEFAULT '[]'::jsonb,
    profile_data JSONB DEFAULT '{}'::jsonb NOT NULL,
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'customer';
ALTER TABLE public.profiles ALTER COLUMN email DROP NOT NULL;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS profile_data JSONB DEFAULT '{}'::jsonb NOT NULL;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now() NOT NULL;

-- Explicit owner assignments support businesses with more than one operator.
CREATE TABLE IF NOT EXISTS public.business_owner_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (business_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    address JSONB DEFAULT '{}'::jsonb NOT NULL,
    contact JSONB DEFAULT '{}'::jsonb NOT NULL,
    operating_hours JSONB DEFAULT '[]'::jsonb NOT NULL,
    is_primary BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (business_id, slug)
);

-- 5. Menu / Services / Products Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    source_key TEXT,
    name TEXT NOT NULL,
    japanese_name TEXT,
    description TEXT,
    category TEXT NOT NULL,
    price DECIMAL(10, 2),
    price_formatted TEXT,
    is_verified_price BOOLEAN DEFAULT false NOT NULL,
    is_popular BOOLEAN DEFAULT false NOT NULL,
    dietary TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS source_key TEXT;
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now() NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS menu_items_business_source_key_uidx ON public.menu_items (business_id, source_key);

-- 6. Events & Community Schedules Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    day_or_date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    description TEXT,
    is_verified_schedule BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 7. Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    alt_text TEXT,
    tag TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;

-- 8. Analytics Events Table (QR scans, pageviews, outbound clicks)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- 'page_view', 'qr_scan', 'link_click'
    source TEXT,             -- 'qr', 'direct', 'search'
    target_link_type TEXT,   -- 'google_maps', 'instagram', 'phone', 'whatsapp'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Offers & Loyalty Table
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    code TEXT,
    discount_description TEXT NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now() NOT NULL;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now() NOT NULL;

CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    label TEXT,
    url TEXT NOT NULL,
    display_order INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (business_id, branch_id, platform)
);

CREATE TABLE IF NOT EXISTS public.opening_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    opens_at TIME,
    closes_at TIME,
    is_closed BOOLEAN DEFAULT false NOT NULL,
    note TEXT,
    display_order INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (business_id, branch_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS public.amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0 NOT NULL,
    is_available BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    author_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    moderation_status TEXT DEFAULT 'pending' NOT NULL CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    source TEXT DEFAULT 'customer' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.loyalty_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    points_per_visit INT DEFAULT 0 NOT NULL CHECK (points_per_visit >= 0),
    reward_threshold INT NOT NULL CHECK (reward_threshold > 0),
    reward_description TEXT NOT NULL,
    duplicate_safeguard_hours INT DEFAULT 4 NOT NULL CHECK (duplicate_safeguard_hours >= 0),
    is_active BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (business_id)
);

CREATE TABLE IF NOT EXISTS public.loyalty_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    points_balance INT DEFAULT 0 NOT NULL CHECK (points_balance >= 0),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (business_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.loyalty_members(id) ON DELETE CASCADE,
    points_delta INT NOT NULL CHECK (points_delta <> 0),
    transaction_reference TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (business_id, transaction_reference)
);

CREATE INDEX IF NOT EXISTS analytics_events_business_created_idx ON public.analytics_events (business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS reviews_business_status_created_idx ON public.reviews (business_id, moderation_status, created_at DESC);

-- Seed only the existing FreCo demo identity and menu keys. Prices remain unverified placeholders.
INSERT INTO public.businesses (slug, name, tagline, identity, badge, address, contact, operating_hours, amenities, is_published)
VALUES (
    'freco-cafe', 'FreCo Cafe', 'Eat. Play. Read. Repeat.',
    'A sanctuary for anime enthusiasts, coffee lovers, and gamers in suburban Mumbai.',
    'Mumbai''s Ultimate Anime Cafe',
    '{"line1":"Shop No. 4, 5, 6, A-1","line2":"Saraf Choudhary Nagar CHSL","road":"Mahatma Jyotiba Phule Road","area":"Thakur Complex, Kandivali East","city":"Mumbai","state":"Maharashtra","pincode":"400101","fullFormatted":"Shop No. 4, 5, 6, A-1, Saraf Choudhary Nagar CHSL, Mahatma Jyotiba Phule Road, Thakur Complex, Kandivali East, Mumbai, Maharashtra 400101","googleMapsSearchQuery":"FreCo+Cafe+Thakur+Complex+Kandivali+East+Mumbai+400101"}'::jsonb,
    '{"phonePlaceholder":"+91 (Contact Number to be verified)","isVerifiedPhone":false,"emailPlaceholder":"contact@frecocafe.placeholder.in","isVerifiedEmail":false,"instagramHandle":"@frecocafe","instagramUrl":"https://instagram.com","whatsappNumberPlaceholder":"+91 (WhatsApp to be verified)","isVerifiedWhatsapp":false}'::jsonb,
    '[]'::jsonb, '[]'::jsonb, true
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.menu_items (business_id, source_key, name, category, price, price_formatted, is_verified_price, is_popular, display_order)
SELECT b.id, item.source_key, item.name, item.category, NULL, 'INR [Price TBD]', false, item.is_popular, item.display_order
FROM public.businesses b
CROSS JOIN (VALUES
    ('c-1', 'Kyoto Cold Brew', 'coffee', true, 1),
    ('c-2', 'Tokyo Charcoal Vanilla Latte', 'coffee', true, 2),
    ('c-3', 'Shibuya Matcha Espresso Cloud', 'coffee', false, 3),
    ('i-1', 'Black Sesame & Roasted Miso Gelato', 'ice-cream', true, 4),
    ('i-2', 'Hokkaido Milk & Strawberry Compote', 'ice-cream', true, 5),
    ('i-3', 'Yuzu Sorbet with Shiso Mint', 'ice-cream', false, 6),
    ('b-1', 'Crispy Furikake Fries', 'bites', true, 7)
) AS item(source_key, name, category, is_popular, display_order)
WHERE b.slug = 'freco-cafe'
ON CONFLICT (business_id, source_key) DO NOTHING;

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_owner_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is platform admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_business(target_business_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
    SELECT public.is_admin() OR EXISTS (
        SELECT 1 FROM public.businesses b
        WHERE b.id = target_business_id AND b.owner_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.business_owner_assignments a
        WHERE a.business_id = target_business_id AND a.user_id = auth.uid()
    );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_manage_business(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage_business(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name', 'customer')
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_connecto_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_connecto_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

GRANT SELECT (id, slug, name, tagline, identity, badge, theme_config, address, contact,
    operating_hours, amenities, profile_data, is_published) ON public.businesses TO anon, authenticated;
GRANT SELECT ON public.menu_items, public.events, public.gallery_items, public.offers,
    public.branches, public.social_links, public.opening_hours, public.amenities,
    public.reviews, public.loyalty_programs TO anon, authenticated;
GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT SELECT ON public.profiles, public.business_owner_assignments, public.loyalty_members,
    public.loyalty_transactions, public.analytics_events TO authenticated;
GRANT UPDATE (full_name) ON public.profiles TO authenticated;
GRANT INSERT, DELETE ON public.businesses TO authenticated;
GRANT UPDATE (profile_data) ON public.businesses TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.menu_items, public.events,
    public.gallery_items, public.offers, public.branches, public.social_links,
    public.opening_hours, public.amenities, public.reviews, public.loyalty_programs,
    public.loyalty_members, public.loyalty_transactions, public.business_owner_assignments
    TO authenticated;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 2. Businesses Policies
-- Public visitors can read only published businesses
DROP POLICY IF EXISTS "Public can view published businesses" ON public.businesses;
CREATE POLICY "Public can view published businesses"
    ON public.businesses FOR SELECT
    USING (is_published = true);

-- Owners can view, update their assigned businesses
DROP POLICY IF EXISTS "Owners can view assigned businesses" ON public.businesses;
CREATE POLICY "Owners can view assigned businesses"
    ON public.businesses FOR SELECT TO authenticated
    USING (public.can_manage_business(id));

DROP POLICY IF EXISTS "Owners can update assigned businesses" ON public.businesses;
CREATE POLICY "Owners can update assigned businesses"
    ON public.businesses FOR UPDATE
    USING (public.can_manage_business(id))
    WITH CHECK (public.can_manage_business(id));

DROP POLICY IF EXISTS "Admins can insert businesses" ON public.businesses;
CREATE POLICY "Admins can insert businesses"
    ON public.businesses FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete businesses" ON public.businesses;
CREATE POLICY "Admins can delete businesses" ON public.businesses FOR DELETE TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Users can read own business assignments" ON public.business_owner_assignments;
CREATE POLICY "Users can read own business assignments" ON public.business_owner_assignments FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());
DROP POLICY IF EXISTS "Admins can manage business assignments" ON public.business_owner_assignments;
CREATE POLICY "Admins can manage business assignments" ON public.business_owner_assignments FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. Menu Items Policies
DROP POLICY IF EXISTS "Public can view menu items of published businesses" ON public.menu_items;
CREATE POLICY "Public can view menu items of published businesses"
    ON public.menu_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE id = menu_items.business_id AND is_published = true
        )
    );

DROP POLICY IF EXISTS "Owners can manage menu items" ON public.menu_items;
CREATE POLICY "Owners can manage menu items"
    ON public.menu_items FOR ALL
    TO authenticated USING (public.can_manage_business(business_id))
    WITH CHECK (public.can_manage_business(business_id));

-- 4. Events Policies
DROP POLICY IF EXISTS "Public can view events of published businesses" ON public.events;
CREATE POLICY "Public can view events of published businesses"
    ON public.events FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.businesses
            WHERE id = events.business_id AND is_published = true
        )
    );

DROP POLICY IF EXISTS "Owners can manage events" ON public.events;
CREATE POLICY "Owners can manage events"
    ON public.events FOR ALL
    TO authenticated USING (public.can_manage_business(business_id))
    WITH CHECK (public.can_manage_business(business_id));

DROP POLICY IF EXISTS "Public can view gallery of published businesses" ON public.gallery_items;
CREATE POLICY "Public can view gallery of published businesses" ON public.gallery_items FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.is_published));
DROP POLICY IF EXISTS "Owners can manage gallery" ON public.gallery_items;
CREATE POLICY "Owners can manage gallery" ON public.gallery_items FOR ALL TO authenticated
    USING (public.can_manage_business(business_id)) WITH CHECK (public.can_manage_business(business_id));

DROP POLICY IF EXISTS "Public can view offers of published businesses" ON public.offers;
CREATE POLICY "Public can view offers of published businesses" ON public.offers FOR SELECT
    USING (is_active AND EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.is_published));
DROP POLICY IF EXISTS "Owners can manage offers" ON public.offers;
CREATE POLICY "Owners can manage offers" ON public.offers FOR ALL TO authenticated
    USING (public.can_manage_business(business_id)) WITH CHECK (public.can_manage_business(business_id));

DROP POLICY IF EXISTS "Public can view branches of published businesses" ON public.branches;
CREATE POLICY "Public can view branches of published businesses" ON public.branches FOR SELECT
    USING (is_active AND EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.is_published));
DROP POLICY IF EXISTS "Owners can manage branches" ON public.branches;
CREATE POLICY "Owners can manage branches" ON public.branches FOR ALL TO authenticated
    USING (public.can_manage_business(business_id)) WITH CHECK (public.can_manage_business(business_id));

DROP POLICY IF EXISTS "Public can view social links of published businesses" ON public.social_links;
CREATE POLICY "Public can view social links of published businesses" ON public.social_links FOR SELECT
    USING (is_active AND EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.is_published));
DROP POLICY IF EXISTS "Owners can manage social links" ON public.social_links;
CREATE POLICY "Owners can manage social links" ON public.social_links FOR ALL TO authenticated
    USING (public.can_manage_business(business_id)) WITH CHECK (public.can_manage_business(business_id));

DROP POLICY IF EXISTS "Public can view hours of published businesses" ON public.opening_hours;
CREATE POLICY "Public can view hours of published businesses" ON public.opening_hours FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.is_published));
DROP POLICY IF EXISTS "Owners can manage hours" ON public.opening_hours;
CREATE POLICY "Owners can manage hours" ON public.opening_hours FOR ALL TO authenticated
    USING (public.can_manage_business(business_id)) WITH CHECK (public.can_manage_business(business_id));

DROP POLICY IF EXISTS "Public can view amenities of published businesses" ON public.amenities;
CREATE POLICY "Public can view amenities of published businesses" ON public.amenities FOR SELECT
    USING (is_available AND EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.is_published));
DROP POLICY IF EXISTS "Owners can manage amenities" ON public.amenities;
CREATE POLICY "Owners can manage amenities" ON public.amenities FOR ALL TO authenticated
    USING (public.can_manage_business(business_id)) WITH CHECK (public.can_manage_business(business_id));

DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;
CREATE POLICY "Public can view approved reviews" ON public.reviews FOR SELECT
    USING (moderation_status = 'approved' AND EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.is_published));
DROP POLICY IF EXISTS "Customers can submit reviews" ON public.reviews;
CREATE POLICY "Customers can submit reviews" ON public.reviews FOR INSERT TO authenticated
    WITH CHECK (author_user_id = auth.uid() AND moderation_status = 'pending'
        AND EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.is_published));
DROP POLICY IF EXISTS "Owners can manage reviews" ON public.reviews;
CREATE POLICY "Owners can manage reviews" ON public.reviews FOR ALL TO authenticated
    USING (public.can_manage_business(business_id)) WITH CHECK (public.can_manage_business(business_id));

DROP POLICY IF EXISTS "Public can view active loyalty programs" ON public.loyalty_programs;
CREATE POLICY "Public can view active loyalty programs" ON public.loyalty_programs FOR SELECT
    USING (is_active AND EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.is_published));
DROP POLICY IF EXISTS "Owners can manage loyalty programs" ON public.loyalty_programs;
CREATE POLICY "Owners can manage loyalty programs" ON public.loyalty_programs FOR ALL TO authenticated
    USING (public.can_manage_business(business_id)) WITH CHECK (public.can_manage_business(business_id));

DROP POLICY IF EXISTS "Owners can manage loyalty members" ON public.loyalty_members;
CREATE POLICY "Owners can manage loyalty members" ON public.loyalty_members FOR ALL TO authenticated
    USING (public.can_manage_business(business_id)) WITH CHECK (public.can_manage_business(business_id));
DROP POLICY IF EXISTS "Members can read own loyalty account" ON public.loyalty_members;
CREATE POLICY "Members can read own loyalty account" ON public.loyalty_members FOR SELECT TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Owners can manage loyalty transactions" ON public.loyalty_transactions;
CREATE POLICY "Owners can manage loyalty transactions" ON public.loyalty_transactions FOR ALL TO authenticated
    USING (public.can_manage_business(business_id)) WITH CHECK (public.can_manage_business(business_id));

DROP POLICY IF EXISTS "Owners can view analytics" ON public.analytics_events;
CREATE POLICY "Owners can view analytics" ON public.analytics_events FOR SELECT TO authenticated
    USING (public.can_manage_business(business_id));

-- 5. Analytics Policies
-- Anyone (including public visitors) can insert analytics events (page views, link clicks)
DROP POLICY IF EXISTS "Public can log analytics" ON public.analytics_events;
CREATE POLICY "Public can log analytics"
    ON public.analytics_events FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.is_published));


