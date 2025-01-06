const ENCRYPTION_ALGORITHM = 'aes-gcm';
const IV_LENGTH = 12; // 96 bits

export async function deriveKeyFromSalt(salt: string): Promise<Uint8Array> {
	const key = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt));
	return new Uint8Array(key);
}

/**
 * Encrypt a message using AES-GCM.
 * @param key - The encryption key as a Uint8Array.
 * @param plaintext - The message to encrypt.
 * @returns An object containing the ciphertext and initialization vector (IV).
 */
export async function encrypt(key: Uint8Array, plaintext: string): Promise<{ ciphertext: Uint8Array; iv: Uint8Array }> {
	const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

	// Import the key into the Web Crypto API
	const cryptoKey = await crypto.subtle.importKey('raw', key, { name: ENCRYPTION_ALGORITHM }, false, ['encrypt']);

	// Encrypt the plaintext
	const encodedPlaintext = new TextEncoder().encode(plaintext);
	let encrypted = await crypto.subtle.encrypt(
		{
			name: ENCRYPTION_ALGORITHM,
			iv,
		},
		cryptoKey,
		encodedPlaintext
	);
	let ciphertext = new Uint8Array(encrypted);
	return { ciphertext, iv };
}

/**
 * Decrypt a message using AES-GCM.
 * @param key - The encryption key as a Uint8Array.
 * @param ciphertext - The encrypted data.
 * @param iv - The initialization vector (IV) used during encryption.
 * @returns The decrypted plaintext as a string.
 */
export async function decrypt(key: Uint8Array, ciphertext: Uint8Array, iv: Uint8Array): Promise<string> {
	// Import the key into the Web Crypto API
	const cryptoKey = await crypto.subtle.importKey('raw', key, { name: ENCRYPTION_ALGORITHM }, false, ['decrypt']);

	// Decrypt the ciphertext
	const decryptedData = await crypto.subtle.decrypt(
		{
			name: ENCRYPTION_ALGORITHM,
			iv,
		},
		cryptoKey,
		ciphertext
	);

	return new TextDecoder().decode(decryptedData);
}
