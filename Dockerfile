# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.1.42@sha256:9a45ebd9a1e5403177064592e1564791443b1a459356c905d1112e32758dd454 as base
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