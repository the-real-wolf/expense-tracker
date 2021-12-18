export class User {
    constructor(email: string = undefined, password: string = undefined) {
        let id = Math.random() * 1999;
        this.ident = email + "-" + id.toString();
        this.email = email;
        this.password = password;
    }

    public ident: string;
    public email: string;
    public password: string;
}