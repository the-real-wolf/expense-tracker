export class BankAccount {
    constructor(
        bankName: string,
        iban: string,
        bic: string
    ) {
        this.bankName = bankName;
        this.iban = iban;
        this.bic = bic;
    }

    public bankName: string;
    public iban: string;
    public bic: string;
}