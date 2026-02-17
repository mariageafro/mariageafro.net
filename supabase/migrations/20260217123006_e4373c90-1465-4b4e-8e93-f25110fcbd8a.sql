INSERT INTO public.categories (name, slug, icon)
VALUES ('Cadeaux Invités', 'cadeaux-invites', '🎁')
ON CONFLICT (slug) DO NOTHING;