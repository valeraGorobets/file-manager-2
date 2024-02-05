import process from 'node:process';
import path from 'node:path';
import os from 'os';
import { doesPathExists, operationFailed } from '../utils.js';
import fs from 'fs/promises';

export const NAVIGATION_COMMAND = {
	'up': 'up',
	'cd': 'cd',
	'ls': 'ls',
};

const CONTENT_TYPE = {
	'file': 'file',
	'directory': 'directory',
	'other': 'other',
};

export function getHomeDir() {
	return os.homedir();
}

export function getCurrentDir() {
	return process.cwd();
}

export async function navigateTo(dir) {
	if (!(await doesPathExists(dir))) {
		operationFailed();
		return;
	}
	process.chdir(dir);
}

export async function executeNavigationUpCommand(_input) {
	let currentDir = getCurrentDir();
	if (currentDir === getHomeDir()) {
		return;
	}
	const parentPath = path.dirname(currentDir);
	await navigateTo(parentPath);
}

export async function executeNavigationCdCommand(input) {
	const [_command, pathToDir] = input.split(' ');
	await navigateTo(pathToDir);
}

function getContentType(content) {
	if (content.isFile()) {
		return CONTENT_TYPE.file;
	} else if (content.isDirectory()) {
		return CONTENT_TYPE.directory;
	} else {
		return CONTENT_TYPE.other;
	}
}

function sort(content) {
	return content.sort((a, b) => a.name < b.name);
}

export async function executeNavigationLsCommand(_input) {
	const dirContent = await fs.readdir(getCurrentDir(), { withFileTypes: true });
	const contentType = dirContent.map(content => {
		return {
			name: content.name,
			type: getContentType(content),
		};
	});
	const sortedDirs = sort(contentType.filter(({ type }) => type === CONTENT_TYPE.directory))
	const sortedFiles = sort(contentType.filter(({ type }) => type === CONTENT_TYPE.file))
	const outputView = [
		...sortedDirs,
		...sortedFiles,
	]
	console.table(outputView);
}
