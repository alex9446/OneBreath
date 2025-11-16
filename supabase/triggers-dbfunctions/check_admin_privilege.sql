create function private.is_admin(min_level integer)
returns boolean
language sql
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.admins where id = (select auth.uid()) and level >= min_level
  );
$$;

revoke execute on function private.is_admin from anon, authenticated;
