"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.logger = exports.logEvents = void 0;
const logger_1 = require("./loggers/logger");
Object.defineProperty(exports, "logEvents", { enumerable: true, get: function () { return logger_1.logEvents; } });
Object.defineProperty(exports, "logger", { enumerable: true, get: function () { return logger_1.logger; } });
const errorLogger_1 = require("./loggers/errorLogger");
Object.defineProperty(exports, "errorLogger", { enumerable: true, get: function () { return errorLogger_1.errorLogger; } });
