import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { currentUser } from "@sdgittickets/common";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("return the ticket if the ticket is found (1st type)", async () => {
  const title = "Rachel Platten's Lon Angeles Tour";
  const price = 12345;

  const ticket = Ticket.build({
    title: title,
    price: price,
    userId: "1234",
  });

  const ticketResponse = await ticket.save();

  const response = await request(app)
    .get(`/api/tickets/${ticketResponse.id}`)
    .send()
    .expect(200);
  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(price);
});

it("return the ticket if the ticket is found (2nd type)", async () => {
  const title = "Rachel Platten's Lon Angeles Tour";
  const price = 12345;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(price);
});
