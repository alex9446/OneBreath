#!/bin/sh

set -e

echo "Job \"backup-db\" started!"

DT=$(date -uIs)
FILENAME=dump_$DT.sql
FILEPATH=./$FILENAME

pg_dump -f $FILEPATH $READ_ALL_CONNECTION_URI

rclone copy $FILEPATH scw-fr-par:supabase-backups/

echo "Dump filename: $FILENAME"

echo "Job \"backup-db\" finished!"
