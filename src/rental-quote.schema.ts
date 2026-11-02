import { z } from 'zod';

export const rentalQuoteSchema = z.strictObject({
  equipment: z.enum(['projector', 'speaker']),
  days: z.number().int().min(1).max(14),
  quantity: z.number().int().min(1).max(5).default(1),
  email: z.email(),
});

export type RentalQuoteRequest = z.infer<typeof rentalQuoteSchema>;
