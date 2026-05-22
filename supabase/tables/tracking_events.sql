create table public.tracking_events (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  event_name text not null,
  metadata jsonb null,
  created_at timestamp with time zone not null default now(),
  constraint tracking_events_pkey primary key (id),
  constraint tracking_events_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;
