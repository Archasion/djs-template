import { describe, expect, test } from "bun:test";
import EventListener from "@/handlers/events/EventListener";
import Component from "@/handlers/components/Component";
import Command from "@/handlers/commands/Command";
import path from "path";
import fs from "fs";

describe("exports", () => {
	verifyModule("components", Component);
	verifyModule("commands", Command);
	verifyModule("events", EventListener);
});

/**
 * Verifies that all modules in the specified directory are of the expected class.
 *
 * @param dirname The directory name.
 * @param expectedClass The expected class.
 */
function verifyModule(dirname: string, expectedClass: Function): void {
	// Resolve the path to the module directory [src/{dirname}]
	const moduleDirpath = path.resolve("src", dirname);

	// Skip if the directory does not exist
	if (!fs.existsSync(moduleDirpath)) return;

	const moduleFiles = fs.readdirSync(moduleDirpath);

	test.each(moduleFiles)(`${dirname}: %s`, async moduleFile => {
		const moduleFilepath = path.resolve(moduleDirpath, moduleFile);
		const module = await import(moduleFilepath);
		const defaultExport = module.default;

		expect(Object.getPrototypeOf(defaultExport)).toStrictEqual(expectedClass);
	});
}