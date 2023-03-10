import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import { logger } from "./middlewares";
import cors from "cors";
import { corsOptions } from "./configs/corsOptions";
import { rootRouter, userRouter, authRouter } from "./routes";

// getting environment variables
dotenv.config();

const app = express();
const PORT: string = process.env.BACKEND_PORT || "3500";

// calling middlewares
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());

// Routes and stuff
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);

// all other routes
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
