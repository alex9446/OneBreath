FROM denoland/deno:2.5.6

WORKDIR /app

COPY attendance-reminder/package* ./

RUN deno install

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
COPY _shared/database.types.ts ./_shared/
COPY attendance-reminder/index.ts ./attendance-reminder/

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache ./attendance-reminder/index.ts

CMD ["run", "--allow-env", "--allow-net", "./attendance-reminder/index.ts"]
