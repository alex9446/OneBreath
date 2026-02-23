FROM denoland/deno:alpine-2.6.10

RUN apk add --no-cache jq

WORKDIR /app

COPY ./jobs/_shared/import_map.json ./shared_map.json
COPY ./jobs/attendance-exporter/import_map.json ./own_map.json

# merge import files
RUN jq -s '.[0] * .[1]' ./shared_map.json ./own_map.json > ./import_map.json

# prefer not to run as root
USER deno

RUN deno install --import-map ./import_map.json

COPY ./shared/database.types.ts ../_shared/
COPY ./jobs/attendance-exporter/*.ts ./

CMD ["run", "--import-map", "./import_map.json", "--allow-env", "--allow-net", "--unstable-temporal", "./index.ts"]
