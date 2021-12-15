
export class Transaction {
    constructor(
        date: Date,
        categoryName: string,
        amount: number,
        type: "expense" | "income"
    ) {
        let id = Math.random() * 1000;
        this.ident = amount.toString() + "-" + id.toString();
        this.date = date;
        this.categoryName = categoryName;
        this.amount = amount;
        this.type = type;
    }

    public ident: string;
    public date: Date;
    public categoryName: string;
    public amount: number;
    public type: "expense" | "income";
}