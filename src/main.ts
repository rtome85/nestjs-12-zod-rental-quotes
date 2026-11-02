import { createApp } from './app.js';

const app = await createApp();
app.enableShutdownHooks();
await app.listen(process.env.PORT ?? 3000, '127.0.0.1');
console.log(`Rental quote API: ${await app.getUrl()}`);
