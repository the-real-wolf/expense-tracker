export class User {
    constructor(email: string = undefined, password: string = undefined){
        this.email = email;
        this.password = password;
    }

    public email: string;
    public password: string;
}