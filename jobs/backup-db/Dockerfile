FROM alpine:3.23

RUN apk add --no-cache postgresql18-client rclone

RUN adduser -D lp-user

WORKDIR /home/lp-user

# prefer not to run as root
USER lp-user

COPY ./jobs/backup-db/prod-ca-2021.crt .postgresql/root.crt
COPY ./jobs/backup-db/rclone.conf .config/rclone/rclone.conf

COPY ./jobs/backup-db/run.sh ./

CMD ["sh", "./run.sh"]
