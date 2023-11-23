import { expect, test, describe } from "bun:test";

import fs from "fs";
import path from "path";
import Command from "../src/handlers/commands/Command";
import Component from "../src/handlers/components/Component";
import EventListener from "../src/handlers/events/EventListener";

describe("exports", async (): Promise<void> => {
    verifyModule("components", Component);
    verifyModule("commands", Command);
    verifyModule("events", EventListener);
});

function verifyModule(dirName: string, expectedClass: Function): void {
    const modulesDirectoryPath = path.resolve(__dirname, "../src", dirName);
    const moduleFiles = fs.readdirSync(modulesDirectoryPath);

    test.each(moduleFiles)(`${dirName}: %s`, moduleFile => {
        const moduleFilePath = path.resolve(modulesDirectoryPath, moduleFile);
        const module = require(moduleFilePath).default;

        expect(Object.getPrototypeOf(module)).toStrictEqual(expectedClass);
    });
}