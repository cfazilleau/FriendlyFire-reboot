import { readFileSync, writeFileSync } from "fs";

const CONFIG_PATH = "config/config.json"

export class Configuration {
    debug: boolean = false;
    prefix: string = "!";
}

export function loadConfig(): Configuration {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
}

export function saveConfig(configuration: Configuration): void {
    writeFileSync(CONFIG_PATH, JSON.stringify(configuration, null, 4), "utf8");
}

export var configuration: Configuration = new Configuration();

try {
    configuration = loadConfig();
} catch (e) {
    console.error("can't find a valid configuration file, generating a new one as " + CONFIG_PATH);
}

saveConfig(configuration);