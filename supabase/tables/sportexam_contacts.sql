create table public.sportexam_contacts (
  id smallint not null,
  name text not null,
  phone_number text not null,
  notes text null,
  constraint sportexam_contacts_pkey primary key (id),
  constraint sportexam_contacts_phone_number_check check ((phone_number ~ '^(\+\d\d)?\d{10}$'::text))
) TABLESPACE pg_default;
