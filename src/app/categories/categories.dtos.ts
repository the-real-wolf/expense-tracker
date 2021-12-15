export class Category {
    constructor(name: string, description: string) {
        let id = Math.random() * 1000;
        this.ident = name.replace(/\s/g,'') + "-" + id.toString();
        this.name = name;
        this.description = description;
    }

    public ident: string;
    public name: string;
    public description: string;
}