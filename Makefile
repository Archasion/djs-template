install:
	bun install --frozen-lockfile

test:
	bun test

start run:
	bun start

production prod: install test start