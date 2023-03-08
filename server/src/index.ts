import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { logger } from "./middlewares/logger";
import cors from "cors";
import { corsOptions } from "./configs/corsOptions";

// getting environment variables
dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3500;

// calling middlewares
app.use(logger);
app.use(cors(corsOptions));

// Routes and stuff

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Henlo World" });
});

app.all("*", (req: Request, res: Response) => {
    res.status(404);
    if (req.accepts("html")) {
        // res.sendFile(path.join(__dirname, 'views', '404.html'))
        res.json({ message: "404 Not Found" });
    } else if (req.accepts("json")) {
        res.json({ message: "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on the port: ${PORT}`);
});
