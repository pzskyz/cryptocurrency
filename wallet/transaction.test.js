const Transaction = require('./transaction');
const Wallet = require('./index');
const { intFromLE } = require('elliptic/lib/elliptic/utils');

describe('Transaction', () => {
    let transactions, wallet, recipient, amount;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recipient = 'e3c1p13nt';
        transactions = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('outputs the `amount` subtracted from the wallet balance', () => {
        expect(transactions.outputs.find(output => output.address == wallet.publicKey).amount).toEqual(wallet.balance - amount);
    })

    it('outputs the `amount` added to the recipient', () => {
        expect(transactions.outputs.find(output => output.address === recipient).amount).toEqual(amount);
    })

    it('inputs the balance ò the wallet', () => {
        expect(transactions.input.amount).toEqual(wallet.balance);
    })

    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transactions)).toBe(true);
    });

    it('invalid a corrupt transaction', () => {
        transactions.outputs[0].amount = 50000;
        expect(Transaction.verifyTransaction(transactions)).toBe(false);
    })

    describe('Transacting with an amount that exceeds the balance', () => {
        beforeEach(() => {
            amount = 50000;
            transactions = Transaction.newTransaction(wallet, recipient, amount);
        })

        it('does not create the transaction', () => {
            expect(transactions).toEqual(undefined);
        })
    })

    describe('and updateing a transaction', () => {
        let nextAmount, nextRecipient;

        beforeEach(() => {
            nextAmount = 20;
            nextRecipient = 'nextRecipient';
            transactions = transactions.update(wallet, nextRecipient, nextAmount);
        });

        it('subtracts the next amount from the sender output', () => {
            expect(transactions.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - amount - nextAmount);
        });

        it('outputs an amount for the next recipient', () => {
            expect(transactions.outputs.find(output => output.address === nextRecipient).amount)
                .toEqual(nextAmount);
        })
    })
})