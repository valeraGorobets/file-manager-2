import process from 'node:process';
import * as readline from 'readline';
import { executeOsCommand, OS_COMMAND } from './components/os.js';
import { getUserName, operationFailed, unknownInput } from './utils.js';
import { executeHashCommand, HASH_COMMAND } from './components/hash.js';
import {
	executeNavigationCdCommand,
	executeNavigationLsCommand,
	executeNavigationUpCommand,
	getCurrentDir,
	getHomeDir,
	navigateTo,
	NAVIGATION_COMMAND
} from './components/navigation.js';
import { executeZipCompressCommand, executeZipDecompressCommand, ZIP_COMMAND } from './components/zip.js';

function showGreeting() {
	const name = getUserName();
	console.log(`Welcome to the File Manager, ${ name }!`);
}

async function navigateToHomeDir() {
	const homeDir = getHomeDir();
	await navigateTo(homeDir);
	printCurDir();
}

function printCurDir() {
	const currentDir = getCurrentDir();
	console.log(`You are currently in ${ currentDir }`);
}

async function onUsersInput(input) {
	const command = input.split(' ')[0];
	switch (command) {
		case OS_COMMAND:
			executeOsCommand(input);
			break;
		case HASH_COMMAND:
			await executeHashCommand(input);
			break;
		case NAVIGATION_COMMAND.up:
			await executeNavigationUpCommand(input);
			break;
		case NAVIGATION_COMMAND.cd:
			await executeNavigationCdCommand(input);
			break;
		case NAVIGATION_COMMAND.ls:
			await executeNavigationLsCommand(input);
			break;
		case ZIP_COMMAND.compress:
			await executeZipCompressCommand(input);
			break;
		case ZIP_COMMAND.decompress:
			await executeZipDecompressCommand(input);
			break;
		default:
			unknownInput(input);
	}
}

function closeAction() {
	const name = getUserName();
	console.log(`Thank you for using File Manager, ${ name }, goodbye!`);
	process.exit(0);
}

(async function launch() {
	showGreeting();
	await navigateToHomeDir();

	const readlineStream = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	readlineStream.setPrompt('- ');
	readlineStream.prompt();

	readlineStream
		.on('line', async function (input) {
			if (input === '.exit') {
				readlineStream.close();
			}
			try {
				await onUsersInput(input);
			} catch (e) {
				operationFailed(input);
			}
			printCurDir();
			readlineStream.prompt();
		})
		.on('close', closeAction);

	process.on('SIGINT', closeAction);
})();
