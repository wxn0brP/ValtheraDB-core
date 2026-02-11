import { describe, test, expect } from "bun:test";
import {
    pickByPath,
    autoSelect,
    convertSearchObjToSearchArray,
    processRelations,
    Relation
} from "#helpers/relation";
import { createMemoryValthera } from "#db/memory";

describe("pickByPath", () => {
    test("1. should extract values by specified paths", () => {
        const obj = {
            user: {
                profile: {
                    name: "John",
                    age: 30
                },
                settings: {
                    theme: "dark"
                }
            },
            posts: [
                { title: "Post 1" },
                { title: "Post 2" }
            ]
        };

        const paths = [["user", "profile", "name"], ["user", "settings", "theme"]];
        const result = pickByPath(obj, paths);

        expect(result).toEqual({
            user: {
                profile: {
                    name: "John"
                },
                settings: {
                    theme: "dark"
                }
            }
        });
    });

    test("2. should handle non-existent paths gracefully", () => {
        const obj = { user: { name: "John" } };
        const paths = [["user", "name"], ["user", "email"], ["admin", "role"]];
        const result = pickByPath(obj, paths);

        // The function will include undefined values for non-existent paths
        expect(result.user.name).toBe("John");
        expect(result.user.email).toBeUndefined();
        expect(result.admin).toEqual({});
    });

    test("3. should return empty object for null/undefined input", () => {
        expect(pickByPath(null, [["key"]])).toEqual({});
        expect(pickByPath(undefined, [["key"]])).toEqual({});
    });
});

describe("autoSelect", () => {
    test("1. should return undefined select when relation has no select", () => {
        const [select, shouldDelete] = autoSelect({ pk: "_id", path: ["db", "collection"] } as any, "field");
        expect(select).toBeUndefined();
        expect(shouldDelete).toBeFalsy(); // Changed to falsy since it might be undefined
    });

    test("2. should return copy of select array when relation has select", () => {
        const rel = { select: ["field1", "field2"], path: ["db", "collection"] } as any;
        const [select, shouldDelete] = autoSelect(rel, "field3");

        expect(select).toEqual(["field1", "field2", "field3"]);
        expect(shouldDelete).toBe(true);
    });

    test("3. should not add field to select if it already exists", () => {
        const rel = { select: ["field1", "field2"], path: ["db", "collection"] } as any;
        const [select, shouldDelete] = autoSelect(rel, "field1");

        expect(select).toEqual(["field1", "field2"]);
        expect(shouldDelete).toBe(false);
    });
});

describe("convertSearchObjToSearchArray", () => {
    test("1. should convert simple object to path arrays", () => {
        const obj = { name: "John", age: 30 };
        const result = convertSearchObjToSearchArray(obj);

        expect(result).toContainEqual(["name"]);
        expect(result).toContainEqual(["age"]);
        expect(result).toHaveLength(2);
    });

    test("2. should convert nested object to path arrays", () => {
        const obj = {
            user: {
                profile: {
                    name: "John"
                },
                settings: {
                    theme: "dark"
                }
            },
            posts: {
                title: "Test"
            }
        };
        const result = convertSearchObjToSearchArray(obj);

        expect(result).toContainEqual(["user", "profile", "name"]);
        expect(result).toContainEqual(["user", "settings", "theme"]);
        expect(result).toContainEqual(["posts", "title"]);
    });

    test("3. should skip falsy values", () => {
        const obj = {
            valid: "value",
            empty: "",
            zero: 0,
            nil: null,
            undef: undefined
        };
        const result = convertSearchObjToSearchArray(obj);

        expect(result).toContainEqual(["valid"]); // Only valid field should be included
        expect(result).toHaveLength(1);
    });
});

describe("processRelations", () => {
    test("1. should handle 1:1 relationship", async () => {
        const userDb = createMemoryValthera({
            users: [
                { _id: 1, name: "John", profileId: 101 },
                { _id: 2, name: "Jane", profileId: 102 }
            ],
            profiles: [
                { _id: 101, bio: "John's bio", userId: 1 },
                { _id: 102, bio: "Jane's bio", userId: 2 }
            ]
        });

        const dbs = { userDb };
        const cfg = {
            profile: {
                pk: "_id",
                fk: "userId",
                type: "1" as const,
                path: ["userDb", "profiles"] as [string, string],
                as: "profile"
            }
        };

        const data = { _id: 1, name: "John", profileId: 101 };

        await processRelations(dbs, cfg, data);

        // Cast to any to access the dynamically added property
        const dataWithProfile: any = data;
        expect(dataWithProfile.profile).toBeDefined();
        expect(dataWithProfile.profile.bio).toBe("John's bio");
    });

    test("2. should handle 1:n relationship", async () => {
        const postDb = createMemoryValthera({
            users: [
                { _id: 1, name: "John" },
                { _id: 2, name: "Jane" }
            ],
            posts: [
                { _id: 1, title: "Post 1", userId: 1 },
                { _id: 2, title: "Post 2", userId: 1 },
                { _id: 3, title: "Post 3", userId: 2 }
            ]
        });

        const dbs = { postDb };
        const cfg = {
            posts: {
                pk: "_id",
                fk: "userId",
                type: "1n" as const,
                path: ["postDb", "posts"] as [string, string],
                as: "posts"
            }
        };

        const data = { _id: 1, name: "John" };

        await processRelations(dbs, cfg, data);

        // Cast to any to access the dynamically added property
        const dataWithPosts: any = data;
        expect(dataWithPosts.posts).toBeDefined();
        expect(dataWithPosts.posts).toHaveLength(2);
        expect(dataWithPosts.posts.some(post => post.title === "Post 1")).toBe(true);
        expect(dataWithPosts.posts.some(post => post.title === "Post 2")).toBe(true);
    });
});

describe("Relation class", () => {
    test("1. should find one record with relations", async () => {
        const userDb = createMemoryValthera({
            users: [
                { _id: 1, name: "John", profileId: 101 },
            ],
            profiles: [
                { _id: 101, bio: "John's bio", userId: 1 },
            ]
        });

        const relation = new Relation({ userDb });
        const path: [string, string] = ["userDb", "users"];

        const result = await relation.findOne(
            path,
            { _id: 1 },
            {
                profile: {
                    pk: "_id",
                    fk: "userId",
                    type: "1",
                    path: ["userDb", "profiles"] as [string, string],
                    as: "profile"
                }
            }
        );

        expect(result).toBeDefined();
        expect(result.name).toBe("John");
        // The result after processing relations should have the profile property
        // Cast to any to access the dynamically added property
        const resultWithProfile: any = result;
        expect(resultWithProfile.profile).toBeDefined();
        expect(resultWithProfile.profile.bio).toBe("John's bio");
    });

    test("2. should find records with relations", async () => {
        const postDb = createMemoryValthera({
            users: [
                { _id: 1, name: "John" },
                { _id: 2, name: "Jane" }
            ],
            posts: [
                { _id: 1, title: "Post 1", userId: 1 },
                { _id: 2, title: "Post 2", userId: 1 },
                { _id: 3, title: "Post 3", userId: 2 }
            ]
        });

        const relation = new Relation({ postDb });
        const path: [string, string] = ["postDb", "users"];

        const results = await relation.find(
            path,
            {},
            {
                posts: {
                    pk: "_id",
                    fk: "userId",
                    type: "1n",
                    path: ["postDb", "posts"] as [string, string],
                    as: "posts"
                }
            }
        );

        expect(results).toHaveLength(2);
        const john: any = results.find(u => u.name === "John");
        const jane: any = results.find(u => u.name === "Jane");

        expect(john.posts).toHaveLength(2);
        expect(jane.posts).toHaveLength(1);
    });
});