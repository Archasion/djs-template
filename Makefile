install:
	bun install --frozen-lockfile

ci:
	bun run ci

start run:
	bun start

production prod: install test start