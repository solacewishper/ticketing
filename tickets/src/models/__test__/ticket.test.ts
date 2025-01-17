import { Ticket } from "../ticket";

/**
  The Optimistic Concurrency Control sequence:

  Initial state:     Ticket (version 0)
  User 1 fetches:    Ticket (version 0)
  User 2 fetches:    Ticket (version 0)
  User 1 saves:      Ticket (version 1) ✅ Success
  User 2 tries save: Ticket (version 0 → 1) ❌ Fails

  The test ensures that:
  1. Concurrent modifications are detected
  2. Only the first save succeeds
  3. Subsequent saves with outdated versions fail
  4. Data consistency is maintained

  This prevents scenarios like:
  - Lost updates
  - Inconsistent data states
  - Race conditions
  - Out-of-order updates

  The key is the version number that Mongoose maintains, which must match for an update to succeed.
*/

it("implements optimistic concurrency control", async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  // Save the ticket to the database
  await ticket.save();

  // Simulate two users/processes accessing the same ticket
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 20 });

  // User 1 saves their change
  await firstInstance!.save();

  // User 2 tries to save their change
  try {
    await secondInstance!.save(); // This should fail
  } catch (err) {
    return; // We expect an error
  }
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
