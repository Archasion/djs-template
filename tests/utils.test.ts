import { describe, expect, test } from "bun:test";
import { partition, pluralize } from "@/utils";

describe("utils", () => {
    test("pluralize", () => {
        expect(pluralize(0, "car")).toBe("cars");
        expect(pluralize(1, "car")).toBe("car");
        expect(pluralize(2, "car")).toBe("cars");
        expect(pluralize(2, "index", "indices")).toBe("indices");
    });

    test("partition", () => {
       const expectedArray: [number[], number[]] = [[4, 5, 6], [1, 2, 3]];

       // Split array into values > 3 and values <= 3
       const partitionedArray = partition(expectedArray.flat(), val => val > 3);

       expect(partitionedArray).toStrictEqual(expectedArray);
    });
});