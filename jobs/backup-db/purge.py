from datetime import datetime, timedelta, timezone
from enum import IntEnum
from os import environ
from re import compile as re_compile
from subprocess import run as proc_run


class KEEP(IntEnum):
    ALL_FROM_DAYS = 14
    WEEKS = 16
    MONTHS = 12


DATETIME_RE = re_compile(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}')

REMOTE_BUCKET = environ['REMOTE_BUCKET']

paths = proc_run(
    ['rclone', 'lsf', REMOTE_BUCKET], capture_output=True, text=True
).stdout.split('\n')

backups = [
    (datetime.fromisoformat(match.group(0)), path.strip())
    for path in paths if (match := DATETIME_RE.search(path))
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

for dt, path in backups:
    if path not in keep:
        print(f'deleting: {path}')
        proc_run(['rclone', 'deletefile', REMOTE_BUCKET + path])
