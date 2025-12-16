FROM alpine:3.23

RUN apk add --no-cache postgresql18-client rclone

RUN adduser -D lp-user

WORKDIR /home/lp-user

# Prefer not to run as root.
USER lp-user

COPY ./supabase/jobs/backup-db/prod-ca-2021.crt .postgresql/root.crt
COPY ./supabase/jobs/backup-db/rclone.conf .config/rclone/rclone.conf

COPY ./supabase/jobs/backup-db/run.sh ./

CMD ["sh", "./run.sh"]
