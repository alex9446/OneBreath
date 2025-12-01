create view public.leaderboard
with
  (security_invoker = true) as
select
  p.first_name,
  p.last_name,
  a.group_id,
  count(a.user_id) as apg  -- AttendancesPerGroup
from
  public.attendances as a
  inner join public.profiles as p on a.user_id = p.id
where
  p.leaderboard is true
group by
  p.id,
  a.group_id
order by
  apg desc,
  p.first_name;
