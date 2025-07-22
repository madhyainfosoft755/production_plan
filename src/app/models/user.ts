
interface CUser{
    id: number;
    email: string;
    name: string;
    emp_id: string;
    token: string;
    role: number;
}

export class User {
    id: number;
    name: string;
    email: string;
    role: number;
    emp_id: string;
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
        return this.role == 1;
    }

    public get isForging() {
      return this.role == 2;
    }

    public get isHeating() {
        return this.role == 3;
    }

    public get isFinish() {
        return this.role == 4;
    }

    public get isRM() {
      return this.role == 5;
    }


}
