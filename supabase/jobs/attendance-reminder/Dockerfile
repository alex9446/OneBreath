FROM denoland/deno:2.5.6

WORKDIR /app

# Prefer not to run as root.
USER deno

COPY ./supabase/import_map.json ./

RUN deno install --import-map ./import_map.json

COPY ./shared/database.types.ts ../_shared/
COPY ./supabase/jobs/attendance-reminder/index.ts ./

CMD ["run", "--import-map", "./import_map.json", "--allow-env", "--allow-net", "./index.ts"]
