import { Router } from 'oak';

const router = new Router();

interface Todo {
	id: string;
	text: string;
}

let todos: Todo[] = [];

router.get('/todos', ctx => {
	ctx.response.body = { todos: todos };
});

router.post('/todos', async ctx => {
	const result = ctx.request.body;
	const data = await result.json();

	const newTodo: Todo = {
		id: new Date().toISOString(),
		text: data.text,
	};

	todos.push(newTodo);
	ctx.response.status = 201;
	ctx.response.body = { message: 'Created todo!', todo: newTodo };
});

router.put('/todos/:todoId', async ctx => {
	const tid = ctx.params.todoId;
	const result = ctx.request.body;
	const data = await result.json();

	const todoIndex = todos.findIndex(todo => todo.id === tid);

	if (todoIndex >= 0) {
		todos[todoIndex] = { id: todos[todoIndex]!.id, text: data.text };
		ctx.response.status = 200;
		ctx.response.body = { message: 'Updated todo', todos: todos };
	} else {
		ctx.response.status = 404;
		ctx.response.body = { message: 'Could not find todo for this id.' };
	}
});

router.delete('/todos/:todoId', ctx => {
	const tid = ctx.params.todoId;
	todos = todos.filter(todo => todo.id !== tid);

	ctx.response.status = 200;
	ctx.response.body = { message: 'Deleted todo', todos: todos };
});

export default router;
