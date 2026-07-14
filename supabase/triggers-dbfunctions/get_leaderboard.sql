create function public.get_leaderboard(group_id_param smallint, min_date date, max_date date)
returns table(fullname text, attendances bigint)
language sql
security invoker set search_path = ''
as $$
  select
    concat(p.first_name, ' ', p.last_name) as fullname,
    count(*) as attendances
  from
    public.attendances as a
    join public.profiles as p on a.user_id = p.id
  where
    a.group_id = group_id_param
    and a.marked_day >= min_date
    and a.marked_day <= max_date
    and p.leaderboard is true
  group by
    p.id
  order by
    attendances desc,
    fullname;
$$;

revoke execute on function public.get_leaderboard from public;
revoke execute on function public.get_leaderboard from anon, authenticated;
