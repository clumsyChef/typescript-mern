"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const middlewares_1 = require("./middlewares");
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = require("./configs/corsOptions");
const routes_1 = require("./routes");
// import session from "express-session";
const verifyUser_1 = require("./middlewares/auth/verifyUser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// getting environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.BACKEND_PORT || "3500";
// remove the code below afterwards
app.disable("view cache");
// calling middlewares
app.use(middlewares_1.logger);
app.use((0, cors_1.default)(corsOptions_1.corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(verifyUser_1.verifyUser);
// app.use(
//     session({
//         // @ts-ignore
//         secret: process.env.SESSION_KEY,
//         resave: false,
//         saveUninitialized: false,
//     })
// );
// Routes and stuff
app.use("/", routes_1.rootRouter);
app.use("/users", routes_1.userRouter);
app.use("/auth", routes_1.authRouter);
// all other routes
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        // res.sendFile(path.join(__dirname, 'views', '404.html'))
        res.json({ message: "404 Not Found" });
    }
    else if (req.accepts("json")) {
        res.json({ message: "404 Not Found" });
    }
    else {
        res.type("txt").send("404 Not Found");
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on the port: ${PORT}`);
});
