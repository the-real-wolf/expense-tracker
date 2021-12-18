export class BankAccount {
    constructor(
        bankName: string,
        iban: string,
        bic: string,
        userIdent: string
    ) {
        this.bankName = bankName;
        this.iban = iban;
        this.bic = bic;
        this.userIdent = userIdent;
    }

    public bankName: string;
    public iban: string;
    public bic: string;
    public userIdent: string;
}