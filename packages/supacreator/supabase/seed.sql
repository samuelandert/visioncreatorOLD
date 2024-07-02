-- Insert a default user with a hardcoded UUID and set email as verified
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, email_confirmed_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'vision@creator.me',
    jsonb_build_object('full_name', 'Visioncreator', 'avatar_url', ''),
    now(),
    now() 
)
ON CONFLICT (id) DO NOTHING;

-- Insert the corresponding profile with the same hardcoded UUID
INSERT INTO public.profiles (id, full_name, avatar_url, created_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Visioncreator',
    '',
    now()
)
ON CONFLICT (id) DO NOTHING;