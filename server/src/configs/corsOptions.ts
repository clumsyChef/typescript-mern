const allowedOrigins: string[] = ["https://technotes.onrender.com"];

export const corsOptions: any = {
    origin: (origin: string, callback: Function) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
