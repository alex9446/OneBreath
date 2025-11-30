create table public.subscriptions (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid not null,
  subscription_json jsonb not null,
  last_status_code smallint null,
  last_send_at timestamp with time zone null,
  constraint subscriptions_pkey primary key (id),
  constraint subscriptions_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;
