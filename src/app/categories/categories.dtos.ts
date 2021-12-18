export class Category {
    constructor(
        name: string, 
        description: string,
        userIdent: string
    ) {
        let id = Math.random() * 1000;
        this.ident = name.replace(/\s/g,'') + "-" + id.toString();
        this.name = name;
        this.description = description;
        this.userIdent = userIdent;
    }

    public ident: string;
    public name: string;
    public description: string;
    public userIdent: string;
}
