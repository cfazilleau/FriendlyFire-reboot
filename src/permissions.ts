import { Guild, Role, User } from 'discord.js';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

const CONFIG_DIRPATH = 'config/';
const PERMS_PATH = CONFIG_DIRPATH + 'permissions.json'

//#region Exports

export class Permissions {
    roles : { [name: string]: { [name: string]: boolean } } = { 'everyone': { 'help': true } };
    users : { [name: string]: { [name: string]: boolean } } = {};
    
    hasPermission(user: User, guild: Guild, permission: string) : boolean {
        var allowed : boolean = false;
        
        // for each role
        guild.roles.cache.forEach(role => {
            // if the user has this role
            if (role.members.find(u => u.id == user.id)) {
                // if the role is in the list
                if (this.roles.hasOwnProperty(role.name) &&
                // and if the role has the permission
                this.roles[role.name].hasOwnProperty(permission)) {
                    // override 'allowed'
                    allowed = this.roles[role.name][permission] === true;
                }
            }
        });
        
        // if the user is in the users list
        if (this.users.hasOwnProperty(user.id) &&
        // and this permission has an override
        this.users[user.id].hasOwnProperty(permission)) {
            // override 'allowed'
            allowed = this.users[user.id][permission] === true;
        }
        
        return allowed;
    };

    setRolePermission(role: Role, name: string, value: boolean) : void
    {
        this.roles[role.id][name] = value;
    }

    setUserPermission(user: User, name: string, value: boolean) : void
    {
        this.users[user.id][name] = value;
    }
}

class AllPermissions {
    guilds : { [name: string]: Permissions } = {};
}

// Import permissions from file
export function importPerms() : AllPermissions {
    return JSON.parse(readFileSync(PERMS_PATH, 'utf8'));
}

// Export permissions to file
export function exportPerms() : void {
    mkdirSync(CONFIG_DIRPATH, { recursive: true });
    writeFileSync(PERMS_PATH, JSON.stringify(permissions, null, 4), { encoding: 'utf8' });
}

// Gets the Permissions for a given Guild
export function getGuildPermissions(guild : Guild) : Permissions {
    if (permissions.guilds.hasOwnProperty(guild.id))
        return permissions.guilds[guild.id];

    return null;
}

// Add guild to permissions and export
export function addGuild(guild : Guild, doExport : boolean = true) : void {
    // if the guild is not referenced, Add it to the permissions
    if (!permissions.guilds.hasOwnProperty(guild.id))
    {
        permissions.guilds[guild.id] = new Permissions();
        
        if (doExport)
            exportPerms();
    }
}

// Remove guild from permissions and export
export function removeGuild(guild : Guild, doExport : boolean = true) : void {
    // if the guild is referenced, Remove it
    if (permissions.guilds.hasOwnProperty(guild.id))
    {
        delete permissions.guilds[guild.id];

        if (doExport)
            exportPerms();
    }
}

//#endregion

//#region Execution

var permissions: AllPermissions = new AllPermissions();

try {
    permissions = importPerms();
} catch (e) {
    console.error('cant find a valid Permissions file, generating a new one as ' + PERMS_PATH);
}

exportPerms();

//#endregion