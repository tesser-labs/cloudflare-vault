import { describe, it, expect } from 'vitest';

import { encrypt, decrypt, deriveKeyFromSalt } from './crypto';
describe('crypto', () => {
	it('should encrypt and decrypt a message', async () => {
		const message = 'Hello, World!';
		const encodedMessage = new TextEncoder().encode(message);
		const salt = 'secret';
		const key = await deriveKeyFromSalt(salt);
		const { ciphertext: encryptedMessage, iv } = await encrypt(key, message);
		expect(encryptedMessage).not.toBe(message);
		expect(encryptedMessage).not.toBe(encodedMessage);
		const decryptedMessage = await decrypt(key, encryptedMessage, iv);
		expect(decryptedMessage).toBe(message);
	});
});
