import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@sdgittickets/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
    domain: ".multik8s.site",
  }),
);
app.use(currentUser);

app.use(indexTicketRouter);
app.use(createTicketRouter);
app.use(updateTicketRouter);
app.use(showTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler as express.ErrorRequestHandler);

export { app };
