import { describe, expect, test } from "bun:test";
import { pluralize } from "@/utils";

describe("utils", () => {
    test("pluralize", () => {
        expect(pluralize(0, "car")).toBe("cars");
        expect(pluralize(1, "car")).toBe("car");
        expect(pluralize(2, "car")).toBe("cars");
        expect(pluralize(2, "index", "indices")).toBe("indices");
    });
});