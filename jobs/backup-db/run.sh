#!/bin/sh

set -e

[ -z "$HEARTBEAT_URL" ] && echo "heartbeat url not found!"

echo "Job \"backup-db\" started!"
[ -n "$HEARTBEAT_URL" ] && curl -m 10 -s -o /dev/null "$HEARTBEAT_URL/start"

DT=$(date -uIs)
FILEPATH=./dump_$DT.sql
FILEPATH_GPG=$FILEPATH.gpg

pg_dump -f $FILEPATH $READ_ALL_CONNECTION_URI

gpg --encrypt --recipient-file ./OB-pub-key.asc --output $FILEPATH_GPG $FILEPATH

rclone copy $FILEPATH_GPG $REMOTE_BUCKET

echo "Dump file: $FILEPATH_GPG"

echo "GFS purge started"
python3 ./purge.py

[ -n "$HEARTBEAT_URL" ] && curl -m 10 -s -o /dev/null "$HEARTBEAT_URL"
echo "Job \"backup-db\" finished!"
