create view public.attendances_with_name
with
  (security_invoker = true) as
select
  a.marked_day,
  a.group_id,
  concat(p.first_name, ' ', p.last_name) as name
from
  public.attendances as a
  join public.profiles as p on a.user_id = p.id
order by
  a.marked_day desc,
  name;
