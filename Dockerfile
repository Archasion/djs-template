# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.2.3@sha256:1ab5cdebde9995e8221290c13c89a473840b53131170951c63c2359b980208d0 as base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/ .
COPY src .

# run the app
USER bun
ENTRYPOINT [ "bun", "index.ts" ]