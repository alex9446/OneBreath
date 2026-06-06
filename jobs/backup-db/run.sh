#!/bin/sh

set -e

[ -z "$HEARTBEAT_URL" ] && echo "heartbeat url not found!"

echo "Job \"backup-db\" started!"
curl -m 10 -s -o /dev/null "$HEARTBEAT_URL/start"

DT=$(date -uIs)
FILENAME=dump_$DT.sql
FILEPATH=./$FILENAME

pg_dump -f $FILEPATH $READ_ALL_CONNECTION_URI

rclone copy $FILEPATH scw-fr-par:supabase-backups/

echo "Dump filename: $FILENAME"

curl -m 10 -s -o /dev/null "$HEARTBEAT_URL"
echo "Job \"backup-db\" finished!"
