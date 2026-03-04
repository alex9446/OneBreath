create table public.midweek_holidays (
  date date not null,
  constraint midweek_holidays_pkey primary key (date)
) TABLESPACE pg_default;
