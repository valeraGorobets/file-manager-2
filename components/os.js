import { safeParseArgument, unknownInput } from '../utils.js';
import os from 'os';
import { getHomeDir } from './navigation.js';

export const OS_COMMAND = 'os';

const OS_ARGUMENT = {
	'EOL': 'EOL',
	'cpus': 'cpus',
	'homedir': 'homedir',
	'username': 'username',
	'architecture': 'architecture',
}

function executeEOLArgument() {
	const eolSymbol = os.EOL;
	const eolSymbolStringified = JSON.stringify(eolSymbol).replaceAll('"','');
	console.log(eolSymbolStringified);
}

function executeCPUSArgument() {
	const cpusInfo = os.cpus()
		.map(cpu => cpu.model);
	console.log(cpusInfo);
}

function executeHomedirArgument() {
	console.log(getHomeDir());
}

function executeUsernameArgument() {
	console.log(os.userInfo().username);
}

function executeArchitectureArgument() {
	console.log(os.arch());
}

export function executeOsCommand(input) {
	const [command, ...args] = input.split(' ');
	const arg = safeParseArgument(args[0], OS_ARGUMENT);
	if (!arg) {
		unknownInput(input);
		return;
	}

	switch (arg) {
		case OS_ARGUMENT.EOL:
			executeEOLArgument();
			break;
		case OS_ARGUMENT.cpus:
			executeCPUSArgument();
			break;
		case OS_ARGUMENT.homedir:
			executeHomedirArgument();
			break;
		case OS_ARGUMENT.username:
			executeUsernameArgument();
			break;
		case OS_ARGUMENT.architecture:
			executeArchitectureArgument();
			break;
		default:
			unknownInput(input);
	}
}
