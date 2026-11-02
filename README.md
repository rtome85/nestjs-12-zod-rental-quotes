# NestJS 12 + Zod: equipment-rental quotes

A fresh, standalone tutorial project demonstrating NestJS 12's built-in Standard Schema validation with Zod. It is not derived from another application.

## Run it

Tested with Node.js **26.12.1** and npm **12.0.2**. Use Node 26 for the walkthrough. Dependencies are pinned in `package.json` and `package-lock.json`.

```bash
npm ci
npm test
npm start
```

`npm test` compiles the project and runs HTTP integration tests using Node's built-in test runner. `npm start` serves the compiled application on `http://127.0.0.1:3000`. Override `PORT` if needed. Run `npm run build` after changing TypeScript files.

## Try it

```bash
curl -i http://127.0.0.1:3000/rental-quotes \
  -H 'Content-Type: application/json' \
  -d '{"equipment":"projector","days":3,"quantity":2,"email":"alex@example.com"}'
```

The response is HTTP 200 and a quote of `21000` EUR cents. Omit `quantity` to default to one. Set `days` to zero, supply a numeric string, or add an unexpected property to receive HTTP 400.

## What to read

- `src/rental-quote.schema.ts`: Zod rules and the inferred handler type.
- `src/rental-quotes.controller.ts`: `@Body({ schema })` and server-owned prices.
- `src/app.ts`: the built-in `StandardSchemaValidationPipe`, shared by startup and tests.
- `test/validation.test.ts`: the small HTTP test shown in the article.
- `test/rental-quotes.test.ts`: additional boundaries, defaults, pricing and malformed JSON.

The complete test suite has 19 integration checks. Tests bind to available loopback ports and close their servers. No database, credentials or external service is needed.

## Deliberate limits

All prices and customer details are synthetic. This is a quote calculator, not a reservation system. It does not store customer data, send email, check stock or rental dates, take payments, calculate taxes, or implement authentication and abuse controls. Those concerns are intentionally outside this validation tutorial.

NestJS 12's addition is Standard Schema support, not an official Zod-specific adapter package. `@Body({ schema })` attaches metadata; the global pipe is what validates requests. Existing class-based validation remains supported.

## Official references

- [NestJS 12.0.0 release notes](https://github.com/nestjs/nest/releases/tag/v12.0.0)
- [NestJS validation documentation](https://docs.nestjs.com/application/validation)
- [NestJS 12 migration guide](https://docs.nestjs.com/migration-guide)
- [Zod basics](https://zod.dev/basics)
- [Zod strict objects](https://zod.dev/api#zstrictobject)
