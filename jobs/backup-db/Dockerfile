ARG ALPINE_VERSION

FROM alpine:${ALPINE_VERSION:?}

RUN apk add --no-cache postgresql18-client rclone curl gpg python3

RUN adduser -D lp-user

WORKDIR /home/lp-user

# prefer not to run as root
USER lp-user

COPY ./jobs/backup-db/OB-pub-key.asc ./
COPY ./jobs/backup-db/prod-ca-2021.crt .postgresql/root.crt
COPY ./jobs/backup-db/rclone.conf .config/rclone/rclone.conf

COPY ./jobs/backup-db/run.sh ./
COPY ./jobs/backup-db/purge.py ./

ENV REMOTE_BUCKET=scw-it-mil:supabase-db-backups/

CMD ["sh", "./run.sh"]
