from datetime import datetime, timedelta, timezone
from enum import IntEnum
import re


class KEEP(IntEnum):
    ALL_FROM_DAYS = 7
    WEEKS = 8
    MONTHS = 12


BACKUP_LIST = 'ls_backup.txt'
DELETE_LIST = 'to_delete.txt'


DATETIME_RE = re.compile(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}')

with open(BACKUP_LIST) as file:
    backups = [
        (datetime.fromisoformat(match.group(0)), path)
        for path in [line.strip() for line in file]
        if (match := DATETIME_RE.search(path))
    ]

backups.sort(key=lambda x: x[0], reverse=True)

keep = set()
seen_weeks = set()
seen_months = set()

keep_all_date = datetime.now(timezone.utc) - timedelta(days=KEEP.ALL_FROM_DAYS)

for dt, path in backups:
    w_key = (dt.isocalendar().year, dt.isocalendar().week)
    m_key = (dt.year, dt.month)

    def seen():
        seen_weeks.add(w_key)
        seen_months.add(m_key)

    if dt > keep_all_date:
        seen()
        keep.add(path)

    if w_key not in seen_weeks and len(seen_weeks) < KEEP.WEEKS:
        seen()
        keep.add(path)

    if m_key not in seen_months and len(seen_months) < KEEP.MONTHS:
        seen()
        keep.add(path)

with open(DELETE_LIST, 'w') as file:
    file.writelines([f'{path}\n' for dt, path in backups if path not in keep])
