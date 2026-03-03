import { Bson } from 'https://deno.land/x/mongo@v0.31.2/mod.ts';
import { Router } from 'https://deno.land/x/oak/mod.ts';

import { getDb } from '../helpers/db_client.ts';

const router = new Router();

interface Todo {
	_id?: Bson.ObjectId;

	text: string;
}

router.get('/todos', async ctx => {
	const todos = await getDb().collection<Todo>('todos').find().toArray();

	const transformedTodos = todos.map(todo => {
		return { id: todo._id?.toString(), text: todo.text };
	});

	ctx.response.body = { todos: transformedTodos };
});

router.post('/todos', async ctx => {
	const data = await ctx.request.body.json();

	const newTodo: Todo = {
		text: data.text,
	};

	const id = await getDb().collection<Todo>('todos').insertOne(newTodo);

	ctx.response.status = 201;
	ctx.response.body = {
		message: 'Created todo!',
		todo: { id: id.toString(), text: newTodo.text },
	};
});

router.put('/todos/:todoId', async ctx => {
	const tid = ctx.params.todoId;
	const data = await ctx.request.body.json();

	const updateResult = await getDb()
		.collection<Todo>('todos')
		.updateOne({ _id: new Bson.ObjectId(tid) }, { $set: { text: data.text } });

	if (updateResult.matchedCount > 0) {
		ctx.response.status = 200;
		ctx.response.body = { message: 'Updated todo' };
	} else {
		ctx.response.status = 404;
		ctx.response.body = { message: 'Could not find todo for this id.' };
	}
});

router.delete('/todos/:todoId', async ctx => {
	const tid = ctx.params.todoId;

	const deleteCount = await getDb()
		.collection<Todo>('todos')
		.deleteOne({
			_id: new Bson.ObjectId(tid),
		});

	if (deleteCount > 0) {
		ctx.response.status = 200;
		ctx.response.body = { message: 'Deleted todo' };
	} else {
		ctx.response.status = 404;
		ctx.response.body = { message: 'Could not find todo for this id.' };
	}
});

export default router;
