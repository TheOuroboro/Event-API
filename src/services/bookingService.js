await prisma.$transaction(async (tx) => {
  const event = await tx.event.findUnique({
    where: { id: eventId }
  });

  if (!event) throw new Error("Event not found");
  if (event.status !== "PUBLISHED") throw new Error("Event not available");
  if (event.date < new Date()) throw new Error("Event already passed");
  if (event.remainingSeats < quantity) throw new Error("Not enough seats");

  await tx.event.update({
    where: { id: eventId },
    data: {
      remainingSeats: {
        decrement: quantity
      }
    }
  });

  await tx.booking.create({
    data: {
      eventId,
      userId,
      quantity,
      status: "CONFIRMED"
    }
  });
});
