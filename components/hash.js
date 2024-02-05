import { doesPathExists, operationFailed, unknownInput, resolvePathToAbsolute } from '../utils.js';
import fs from 'fs';
import { createHash } from 'node:crypto';

export const HASH_COMMAND = 'hash';

async function calculateHash(absolutePath) {
	return new Promise((resolve, reject) => {
		const hash = createHash('sha256');
		const stream = fs.createReadStream(absolutePath);
		stream.on('data', data => hash.update(data));
		stream.on('end', () => resolve(hash.digest('hex')));
		stream.on('error', err => reject(err));
	});
}

export async function executeHashCommand(input) {
	const [command, pathToFile] = input.split(' ');
	if (!pathToFile) {
		unknownInput(input);
		return;
	}
	const absolutePath = resolvePathToAbsolute(pathToFile);

	if (!(await doesPathExists(absolutePath))) {
		operationFailed(input);
		return;
	}
	const hash = await calculateHash(absolutePath);
	console.log(hash);
}
