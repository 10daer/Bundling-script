// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TxnBundler {
    struct Transaction {
        address from;
        address to;
        uint amount;
    }

    Transaction[] public transactions;

    event TransactionBundled(address from, address to, uint amount);
    event BundleExecuted(uint totalAmount, uint txnCount);

    function bundleTransaction(address _to) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        
        transactions.push(Transaction({
            from: msg.sender,
            to: _to,
            amount: msg.value
        }));

        emit TransactionBundled(msg.sender, _to, msg.value);
    }

    function executeBundle() external {
        uint totalAmount = 0;
        uint txnCount = transactions.length;

        for (uint i = 0; i < transactions.length; i++) {
            Transaction memory txn = transactions[i];
            totalAmount += txn.amount;
            payable(txn.to).transfer(txn.amount);
        }

        delete transactions;

        emit BundleExecuted(totalAmount, txnCount);
    }
}
