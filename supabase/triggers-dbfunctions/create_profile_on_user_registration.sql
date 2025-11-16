-- inserts a row into public.profiles
create function private.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name, group_id, watchword)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', (new.raw_user_meta_data ->> 'group_id')::int2, new.raw_user_meta_data ->> 'watchword');
  return new;
end;
$$;

revoke execute on function private.handle_new_user from anon, authenticated;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure private.handle_new_user();
