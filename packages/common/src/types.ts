import z from "zod";

export const User = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const Room = z.object({
  name: z.string().min(2).max(20),
});
