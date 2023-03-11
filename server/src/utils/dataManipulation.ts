import path from "path";
import fs from "fs";

export const appendToUsers = async (data: string) => {
    const filePath = path.join(__dirname, "..", "..", "db", "users.json");
    const done = await fs.promises.writeFile(filePath, data);
};
