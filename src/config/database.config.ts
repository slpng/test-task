import { registerAs } from "@nestjs/config";

export const databaseConfig = registerAs("database", () => {
    const key = "MONGO_URL";
    const value = process.env[key];
    if (value === undefined) {
        throw new Error(`${key} not set`);
    }

    return {
        uri: value,
    };
});
