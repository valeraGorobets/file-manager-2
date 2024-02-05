import process from 'node:process';
import path from 'path';
import fs from 'fs';

export function unknownInput(_input) {
	console.log('Invalid input');
}

export function operationFailed(_input) {
	console.log('Operation failed');
}

export function getUserName() {
	return process.argv[2].split('=')[1];
}

export function safeParseArgument(arg, supportedArguments) {
	if (!arg?.startsWith('--')) {
		return;
	}
	const parsedArgument = arg?.slice(2);
	if (!supportedArguments[parsedArgument]) {
		return;
	}
	return parsedArgument;
}

export function resolvePathToAbsolute(pathToFile) {
	return path.resolve(pathToFile);
}

export function doesPathExists(absolutePath) {
	return fs.promises
		.access(absolutePath)
		.then(r => true)
		.catch(e => false);
}
