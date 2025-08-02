// CATCH ASYNC ERRORS IN EXPRESS WITHOUT USING TRY/CATCH BLOCK
require("express-async-errors");

import { startServer } from "./utility/startServer";

import { app } from "./app";

startServer(app, 3000);
