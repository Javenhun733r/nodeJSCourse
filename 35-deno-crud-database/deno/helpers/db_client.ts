import {
	Database,
	MongoClient,
} from 'https://deno.land/x/mongo@v0.31.2/mod.ts';

let db: Database;

export async function connect() {
	const dbUrl = Deno.env.get('DB_URL');

	if (!dbUrl) {
		throw new Error('DB_URL is not defined in the .env file');
	}

	console.log(
		'Attempting to connect to DB (Protocol):',
		dbUrl.substring(0, 11),
	);

	const client = new MongoClient();

	try {
		await client.connect(dbUrl);

		db = client.database('todo-app');

		console.log('✅ Connected to MongoDB successfully!');
	} catch (error) {
		console.error(
			'❌ Failed to connect to MongoDB. Please check your password and IP whitelist in MongoDB Atlas.',
		);
		console.error('Error Details:', error);
		throw error;
	}
}

export function getDb() {
	if (!db) {
		throw new Error('Database not initialized. Please call connect() first.');
	}
	return db;
}
