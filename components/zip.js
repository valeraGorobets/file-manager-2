import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import { doesPathExists, operationFailed, resolvePathToAbsolute, unknownInput } from '../utils.js';

export const ZIP_COMMAND = {
	'compress': 'compress',
	'decompress': 'decompress',
};

export async function executeZipCompressCommand(input) {
	let [command, pathToFile, pathToDestination] = input.split(' ');
	if (!pathToFile || !pathToDestination) {
		unknownInput(input);
		return;
	}
	if (!pathToDestination.endsWith('.gz')) {
		pathToDestination = path.join(pathToDestination, 'arc.gz');
	}
	const absolutePathToFile = resolvePathToAbsolute(pathToFile);
	const absolutePathToDestination = resolvePathToAbsolute(pathToDestination);

	if (!(await doesPathExists(absolutePathToFile))) {
		operationFailed(input);
		return;
	}
	const brotliCompress = zlib.createBrotliCompress();
	const inputStream = fs.createReadStream(absolutePathToFile);
	const outputStream = fs.createWriteStream(absolutePathToDestination);

	inputStream
		.pipe(brotliCompress)
		.pipe(outputStream);
}

export async function executeZipDecompressCommand(input) {
	let [command, pathToFile, pathToDestination] = input.split(' ');
	if (!pathToFile || !pathToDestination) {
		unknownInput(input);
		return;
	}

	const absolutePathToFile = resolvePathToAbsolute(pathToFile);
	const absolutePathToDestination = resolvePathToAbsolute(pathToDestination);

	if (!(await doesPathExists(absolutePathToFile))) {
		operationFailed(input);
		return;
	}
	const brotliDecompress = zlib.createBrotliDecompress();
	const inputStream = fs.createReadStream(absolutePathToFile);
	const outputStream = fs.createWriteStream(absolutePathToDestination);

	inputStream
		.pipe(brotliDecompress)
		.pipe(outputStream);
}
