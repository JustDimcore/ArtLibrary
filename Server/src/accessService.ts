
export enum Permission {
    View,
    Upload,
    ForceDelete,
    GivePermissions
}

export class AccessService {

    private _permissions: {[email: string]: Permission[]} = {};

    getUserPermissions(email: string): Permission[] {
        return this._permissions[email];
    }

    grantPermissions(email: string, permissions: Permission | Permission[]) {
        let userPermissions = this.getUserPermissions(email);
        if(!userPermissions) {
            userPermissions = [];
            this._permissions[email] = userPermissions;
        }
        if (Array.isArray(permissions)) {
            permissions.forEach(p => this.grantPermission(p, userPermissions));
        } else {
            this.grantPermission(permissions, userPermissions);
        }
    }

    private grantPermission(permission: Permission, list: Permission[]) {
        if (!list.includes(permission)) {
            list.push(permission);
        }
    }

    hasPermission(email: string, permission: Permission) {
        const userPermissions = this.getUserPermissions(email);
        if (!userPermissions) {
            return false;
        }

        return userPermissions.includes(permission);
    }    
}