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

    describe('Transacting with an amount that exceeds the balance', () => {
        beforeEach(() => {
            amount = 50000;
            transactions = Transaction.newTransaction(wallet, recipient, amount);
        })

        it('does not create the transaction', () => {
            expect(transactions).toEqual(undefined);
        })
    })
})