
export class Transaction {
    constructor(
        date: Date,
        categoryName: string,
        amount: number,
        type: "expense" | "income",
        userIdent: string,
        bankAccountName: string
    ) {
        let id = Math.random() * 1000;
        this.ident = amount.toString() + "-" + id.toString();
        this.date = date;
        this.categoryName = categoryName;
        this.bankAccountName = bankAccountName;
        this.amount = amount;
        this.type = type;
        this.userIdent = userIdent;
    }

    public ident: string;
    public date: Date;
    public categoryName: string;
    public bankAccountName: string;
    public amount: number;
    public type: "expense" | "income";
    public userIdent: string;
}

export class SelectItem {
    constructor(text: string) {
        this.text = text;
    }

    public text: string;
}