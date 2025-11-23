create table public.admins (
  id uuid not null,
  created_at timestamp with time zone not null default now(),
  level smallint not null default '1'::smallint,
  added_by uuid not null,
  constraint admins_pkey primary key (id),
  constraint admins_added_by_fkey foreign KEY (added_by) references auth.users (id) on delete CASCADE,
  constraint admins_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;
