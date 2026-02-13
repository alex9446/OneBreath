create table public.payments (
  user_id uuid not null,
  expiration date not null,
  constraint payments_pkey primary key (user_id),
  constraint payments_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;
