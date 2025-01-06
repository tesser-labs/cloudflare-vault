export function b64Serialize({ encryptedSecret, iv }: { encryptedSecret: Uint8Array; iv: Uint8Array }) {
	return {
		encryptedSecret: Buffer.from(encryptedSecret).toString('base64'),
		iv: Buffer.from(iv).toString('base64'),
	};
}

export function b64Deserialize({ encryptedSecret, iv }: { encryptedSecret: string; iv: string }) {
	return {
		encryptedSecret: new Uint8Array(Buffer.from(encryptedSecret, 'base64')),
		iv: new Uint8Array(Buffer.from(iv, 'base64')),
	};
}
