create table public.certificates (
  object_id uuid not null,
  user_id uuid not null,
  expiration date not null,
  constraint certificates_pkey primary key (object_id),
  constraint certificates_user_id_key unique (user_id),
  constraint certificates_object_id_fkey foreign KEY (object_id) references storage.objects (id) on update CASCADE on delete CASCADE,
  constraint certificates_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;
