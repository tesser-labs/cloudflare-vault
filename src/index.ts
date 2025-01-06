import { AutoRouter } from 'itty-router';
import { encrypt, decrypt, deriveKeyFromSalt } from './crypto/crypto';
import { b64Serialize, b64Deserialize } from './crypto/b64';

const SALT = 'your-secret-salt';
const router = AutoRouter();

router.post('/vault/:key1/:key2', async (request, { env }) => {
	const { key1, key2 } = request.params;
	const { secret } = await request.json<{ secret?: string }>();
	if (!secret) {
		return new Response('secret is required', { status: 400 });
	}
	const sharedKey = await deriveKeyFromSalt(SALT);
	const encrypted = await encrypt(sharedKey, secret);
	const serialized = b64Serialize(encrypted);
	await env.TESSER_VAULT.put(`${key1}:${key2}`, JSON.stringify(serialized));
	return new Response('Secret stored successfully');
});

router.get('/vault/:key1/:key2', async ({ params }, { env }) => {
	const { key1, key2 } = params;
	const value = await env.TESSER_VAULT.get(`${key1}:${key2}`);
	if (!value) {
		return new Response('Secret not found', { status: 404 });
	}
	const serialized = JSON.parse(value);
	const { encryptedSecret, iv } = b64Deserialize(serialized);
	const sharedKey = await deriveKeyFromSalt(SALT);
	const decryptedSecret = await decrypt(sharedKey, encryptedSecret, iv);
	return new Response(decryptedSecret);
});

router.get('/vault/:key1', async ({ params }, { env }) => {
	const { key1 } = params;
	const keys = await env.TESSER_VAULT.list({ prefix: `${key1}:` });
	const sharedKey = await deriveKeyFromSalt(SALT);
	const secrets = await Promise.all(
		keys.keys.map(async ({ name }: { name: string }) => {
			const value = await env.TESSER_VAULT.get(`${name}`);
			if (value) {
				const serialized = JSON.parse(value);
				const { encryptedSecret, iv } = b64Deserialize(serialized);
				const decryptedSecret = await decrypt(sharedKey, encryptedSecret, iv);
				return { key: name.split(':')[1], secret: decryptedSecret };
			}
		})
	);
	return new Response(JSON.stringify(secrets), { headers: { 'Content-Type': 'application/json' } });
});

export default {
	async fetch(request: Request, env: { TESSER_VAULT: KVNamespace }): Promise<Response> {
		return router.fetch(request, { env });
	},
};
