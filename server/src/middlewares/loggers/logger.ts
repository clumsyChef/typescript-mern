import type { Request, Response, NextFunction } from "express";

import { format } from "date-fns";
import { v4 } from "uuid";
import fs from "fs";
import path from "path";

const fsPromises = fs.promises;
const uuid = v4;

export const logEvents = async (message: string, logFileName: string) => {
    const dateTime = format(new Date(), "dd-MM-yyyy\tHH:mm:ss");
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, "..", "..", "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, "..", "..", "logs"));
        }
        await fsPromises.appendFile(
            path.join(__dirname, "..", "..", "logs", logFileName),
            logItem
        );
    } catch (err) {
        console.log(err);
    }
};

export const logger = (req: Request, res: Response, next: NextFunction) => {
    logEvents(
        `${req.method}\t${req.url}\t${req.headers.origin ?? "Same Origin"}`,
        "reqLog.log"
    );
    // console.log(`${req.method} ${req.path}`);
    next();
};
