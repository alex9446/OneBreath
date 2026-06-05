#!/bin/sh

set -e

echo "Job \"backup-db\" started!"

DT=$(date -uIs)
FILENAME=dump_$DT.sql
FILEPATH=./$FILENAME

pg_dump -f $FILEPATH $READ_ALL_CONNECTION_URI

rclone copy $FILEPATH scw-fr-par:supabase-backups/

echo "Dump filename: $FILENAME"

[ -n "$HEARTBEAT_URL" ] && curl -m 10 -s -o /dev/null "$HEARTBEAT_URL"

echo "Job \"backup-db\" finished!"
