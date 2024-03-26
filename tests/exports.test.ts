import { expect, test, describe } from "bun:test";

import EventListener from "@/handlers/events/EventListener.ts";
import Component from "@/handlers/components/Component.ts";
import Command from "../src/handlers/commands/Command";
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
    const moduleDirpath = path.resolve(__dirname, "../src", dirname);
    const moduleFiles = fs.readdirSync(moduleDirpath);

    test.each(moduleFiles)(`${dirname}: %s`, moduleFile => {
        const moduleFilepath = path.resolve(moduleDirpath, moduleFile);
        const module = require(moduleFilepath).default;

        expect(Object.getPrototypeOf(module)).toStrictEqual(expectedClass);
    });
}