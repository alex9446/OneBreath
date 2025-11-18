create view public.pretty_attendances
with
  (security_invoker = true) as
select
  a.user_id,
  to_char(a.marked_day, 'DD/MM/YY') as marked_day,
  g.name as group_name
from
  public.attendances as a
  join public.groups as g on a.group_id = g.id
order by
  a.marked_day desc;
