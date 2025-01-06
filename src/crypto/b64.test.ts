import { describe, expect, it } from 'vitest';
import { b64Serialize, b64Deserialize } from './b64';
describe('b64', () => {
	it('should serialize and deserialize', () => {
		const encryptedSecret = new Uint8Array([1, 2, 3, 4]);
		const iv = new Uint8Array([5, 6, 7, 8]);
		const serialized = b64Serialize({ encryptedSecret, iv });
		expect(serialized).toEqual({
			encryptedSecret: 'AQIDBA==',
			iv: 'BAUG',
		});
		const deserialized = b64Deserialize(serialized);
		expect(deserialized).toEqual({
			encryptedSecret,
			iv,
		});
	});
});
