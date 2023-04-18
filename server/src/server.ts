import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import { logger } from "./middlewares";
import cors from "cors";
import { corsOptions } from "./configs/corsOptions";
import { rootRouter, userRouter, authRouter } from "./routes";
// import session from "express-session";
import { verifyUser } from "./middlewares/auth/verifyUser";
import cookieParser from "cookie-parser";

// getting environment variables
dotenv.config();

const app = express();
const PORT: string = process.env.BACKEND_PORT || "3500";

// remove the code below afterwards
app.disable("view cache");
// calling middlewares
app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(verifyUser);

// app.use(
//     session({
//         // @ts-ignore
//         secret: process.env.SESSION_KEY,
//         resave: false,
//         saveUninitialized: false,
//     })
// );

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
