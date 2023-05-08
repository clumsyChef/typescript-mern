// getting environment variables
import dotenv from "dotenv";

import express from "express";
import type { Request, Response } from "express";
import { logger } from "./middlewares";
import cors from "cors";
import { corsOptions } from "./configs/corsOptions";
import { rootRouter, userRouter, authRouter } from "./routes";
// import session from "express-session";
import { verifyUser } from "./middlewares/auth/verifyUser";
import cookieParser from "cookie-parser";

import { Collection, Db, MongoClient, MongoClientOptions } from "mongodb";
import { blogRouter } from "./routes/blogs/blogRouter";

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

// Routes
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/blogs", blogRouter);

// all other routes
app.all("*", (req: Request, res: Response) => {
	res.status(404);
	if (req.accepts("html")) {
		res.json({ message: "404 Not Found" });
	} else if (req.accepts("json")) {
		res.json({ message: "404 Not Found" });
	} else {
		res.type("txt").send("404 Not Found");
	}
});

export const createMongoConnection = async () => {
	const mongoOptions: MongoClientOptions = {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	} as MongoClientOptions;

	// maybe put below in a variable and then return it ??
	return await new Promise((resolve, reject) => {
		try {
			const client: MongoClient = new MongoClient(process.env.MONGO_CONNECTION_URI as string, mongoOptions);
			const database: Db = client.db("BlogDB");
			const collection = database.collection("users");
			resolve(collection);
		} catch (err) {
			resolve(false);
		}
	});
};

export let userCollection: any;

const StartServer = async () => {
	const collection = (await createMongoConnection()) as Collection<Document>;
	if (collection) {
		userCollection = collection;
		app.listen(PORT, () => {
			console.log(`Server is running on the port: ${PORT}`);
		});
		return collection;
	} else {
		console.log("MONGO CONNECTION FAILED");
	}
};

StartServer();
