import { readdirSync, statSync } from "fs";
import { ApplicationCommandData, Client } from 'discord.js';
import * as path from "path";
//import * as npm from "npm"

const MODULES_PATH = "./modules/"

function getDirectories(srcpath: string): string[] {
	return readdirSync(srcpath).filter(function (file) {
		return statSync(path.join(srcpath, file)).isDirectory();
	});
}

var modules: string[] = getDirectories(MODULES_PATH);

function getDependencies(packageFilePath: string): string[] {
	var p = require(packageFilePath);

	if (!p.dependencies)
		return [];

	var deps: string[] = [];
	for (var mod in p.dependencies) {
		deps.push(mod + '@' + p.dependencies[mod]);
	}

	return deps;
}

// commands array
var commands: { [name: string]: ApplicationCommandData } = {};

// events array
var events: { [name: string]: Function[] } = {};

function addCommand(commandName: string, commandObject: ApplicationCommandData): void {
	try {
		commands[commandName] = commandObject;
	} catch (err) {
		console.log(err);
	}
}


function addEvent(eventName: string, eventObject: object) {
	try {
		/*
		if (!events.hasOwnProperty(eventName)) events[eventName] = {};
		events[eventName][eventObject.pluginName] = eventObject.process;
		*/
	} catch (err) {
		console.log(err);
	}
}


// preload Modules
export function preloadModules() {
	var deps: string[] = [];

	modules.forEach(module => {
		try {
			require(MODULES_PATH + module);
		} catch (e) {
			deps = deps.concat(getDependencies(MODULES_PATH + module + '/package.json'));
		}
	});

	/*

	// load dependencies if they are present
	if (deps.length > 0) {
		npm.load({ loaded: false }, (err) => {
			npm.commands.install(deps, (er, data) => {
				if (er) { console.log(er); }
				console.log('Modules preload complete');
				return;
			});

			if (err) { console.log('preloadModules: ' + err); }
		});
	}

	*/
}

// load Modules
export function loadModules(bot: Client): void {
	for (var module in modules) {
		var mod;
		try {
			mod = require(module)
		} catch (err) {
			console.log('Improper setup of the [' + module + '] module. : ' + err);
			continue;
		}

		// load module commands
		if ('commands' in mod) {
			for (var j = 0; j < mod.commands.length; j++) {
				if (mod.commands[j] in mod) {
					mod[mod.commands[j]].module = module;
					addCommand(mod.commands[j], mod[mod.commands[j]])
				}
			}
		}

		// load module events
		if ('events' in mod) {
			for (var j = 0; j < mod.events.length; j++) {
				if (mod.events[j] in mod) {
					var obj = {
						moduleName: module,
						process: mod[mod.events[j]]
					};
					addEvent(mod.events[j], obj)
				}
			}
		}
	};

	// Bind Commands

	// Bind Events
	for (var key in events)
	{
		bot.on(key, params => {
			events[key].forEach(event => event(params));
		});
	}
}
