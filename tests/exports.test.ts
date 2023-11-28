import { AbstractInstanceType } from "../src/utils/types.ts";
import { Snowflake } from "discord-api-types/v10";
import { expect, test, describe } from "bun:test";

import fs from "fs";
import path from "path";
import Command from "../src/handlers/commands/Command";
import Component from "../src/handlers/components/Component";
import EventListener from "../src/handlers/events/EventListener";

const customIDs: Snowflake[] = [];

describe("exports", () => {
    verifyModule("components", Component);
    verifyModule("commands", Command);
    verifyModule("events", EventListener);
});

function verifyModule(dirname: string, expectedClass: Function): void {
    const modulesDirectoryPath = path.resolve(__dirname, "../src", dirname);
    const moduleFiles = fs.readdirSync(modulesDirectoryPath);

    test.each(moduleFiles)(`${dirname}: %s`, moduleFile => {
        const moduleFilePath = path.resolve(modulesDirectoryPath, moduleFile);
        const module = require(moduleFilePath).default;

        expect(Object.getPrototypeOf(module)).toStrictEqual(expectedClass);

        const instance: AbstractInstanceType<typeof Command | typeof Component> = new module();

        if (instance instanceof Component) customIDs.push(instance.customId);
        if (instance instanceof Command) customIDs.push(instance.data.name);
    });
}