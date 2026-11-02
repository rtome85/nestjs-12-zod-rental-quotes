import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { rentalQuoteSchema, type RentalQuoteRequest } from './rental-quote.schema.js';

const dailyRates = { projector: 3500, speaker: 2000 } as const;

@Controller('rental-quotes')
export class RentalQuotesController {
  @Post()
  @HttpCode(HttpStatus.OK)
  quote(@Body({ schema: rentalQuoteSchema }) request: RentalQuoteRequest) {
    return {
      ...request,
      currency: 'EUR',
      totalCents: dailyRates[request.equipment] * request.days * request.quantity,
    };
  }
}
