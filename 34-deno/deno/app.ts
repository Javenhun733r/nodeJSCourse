import { Application } from 'https://deno.land/x/oak/mod.ts';
import todosRoutes from './routes/todos.ts';
const app = new Application();
// app.use(ctx => {
// 	ctx.response.body = 'Hello World!';
// });
app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());
app.listen({ port: 3000 });
