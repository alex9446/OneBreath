create table public.profiles (
  id uuid not null,
  first_name text not null,
  last_name text not null,
  group_id smallint not null,
  watchword text not null,
  leaderboard boolean not null default true,
  constraint profiles_pkey primary key (id),
  constraint profiles_group_id_fkey foreign KEY (group_id) references groups (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;
