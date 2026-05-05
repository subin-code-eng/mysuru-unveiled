
-- Artisan profiles table
CREATE TABLE public.artisan_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  craft text NOT NULL,
  specialty text NOT NULL,
  story text NOT NULL,
  experience text NOT NULL,
  location text NOT NULL,
  contact text,
  products text[] NOT NULL DEFAULT '{}',
  photo_url text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.artisan_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published artisan profiles are viewable by everyone"
  ON public.artisan_profiles FOR SELECT
  USING (published = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own artisan profile"
  ON public.artisan_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own artisan profile"
  ON public.artisan_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own artisan profile"
  ON public.artisan_profiles FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_artisan_profiles_updated_at
  BEFORE UPDATE ON public.artisan_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Public storage bucket for artisan photos
INSERT INTO storage.buckets (id, name, public) VALUES ('artisan-photos', 'artisan-photos', true);

CREATE POLICY "Artisan photos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'artisan-photos');

CREATE POLICY "Users can upload their own artisan photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'artisan-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own artisan photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'artisan-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own artisan photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'artisan-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
