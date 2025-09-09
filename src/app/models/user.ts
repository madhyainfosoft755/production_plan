
interface CUser{
    id: number;
    email: string;
    name: string;
    emp_id: string;
    token: string;
    role: string;
    permissions: string[] | null;
}

export class User {
    id: number;
    name: string;
    email: string;
    role: string;
    emp_id: string;
    permissions: string[] | null = null;
    private _token: string;

    constructor(current_user: CUser | null) {
        if (current_user)
        { 
            this.id = current_user.id;
            this.email = current_user.email;
            this.name = current_user.name;
            this.role = current_user.role;
            this.emp_id = current_user.emp_id;
            this._token = current_user.token;
            this.permissions = current_user.permissions;
        }
    }

    public get token(){
        if(this._token){
            return this._token;
        }
        return '';
    }

    public get isAuthenticated(): boolean {
        return !!this.id;
    }

    public get isAdmin() {
        return this.role == 'ADMIN';
    }

    public get isUSER() {
      return this.role == 'USER';
    }

    public get isPLANNER() {
        return this.role == 'PLANNER';
    }

    public get isMASTER() {
        return this.role == 'MASTER';
    }

    public get isVIEWER() {
      return this.role == 'VIEWER';
    }


}
