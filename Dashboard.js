import React, { useState, useEffect } from 'react';

const url = 'https://json-storage-api.p.rapidapi.com/datalake';
const headers = {
  'content-type': 'application/json',
  'X-RapidAPI-Key': '3106896c28msh0505e01ebf8fe18p1bc25fjsn1f6cd90cbb0b',
  'X-RapidAPI-Host': 'json-storage-api.p.rapidapi.com',
};

// Static account number
const accountId = 'USERID-4712';

const Dashboard = () => {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const storeTransaction = async (transaction) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          '@context': [
            'http://schema4i.org/Thing.jsonld',
            'http://schema4i.org/Action.jsonld',
            'http://schema4i.org/CreateAction.jsonld'
          ],
          '@type': 'CreateAction',
          Result: {
            '@context': [
              'http://schema4i.org/DataLakeItem.jsonld',
              'http://schema4i.org/UserAccount.jsonld',
              'http://schema4i.org/OfferForPurchase.jsonld',
              'http://schema4i.org/Offer.jsonld',
              'http://schema4i.org/Organization.jsonld',
              'http://schema4i.org/PostalAddress.jsonld'
            ],
            '@type': 'DataLakeItem',
            Name: 'Transaction',
            Creator: {
              '@type': 'UserAccount',
              Identifier: accountId // Use static account number
            },
            About: {
              '@type': 'Organization'
            },
            Amount: transaction.amount,
            Balance: transaction.balance,
            Type: transaction.type,
            SerialNumber: transaction.serial // Add serial number to the transaction
          }
        })
      });

      const data = await response.json();
      console.log(data);
      // After each transaction, load the latest transactions to update the balance
      loadTransactions();
    } catch (error) {
      console.error('Error storing transaction:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          '@context': [
            'http://schema4i.org/Thing.jsonld',
            'http://schema4i.org/Action.jsonld',
            'http://schema4i.org/SearchAction.jsonld'
          ],
          '@type': 'SearchAction',
          Object: {
            '@context': [
              'http://schema4i.org/Thing.jsonld',
              'http://schema4i.org/Filter',
              'http://schema4i.org/DataLakeItem',
              'http://schema4i.org/UserAccount'
            ],
            '@type': 'Filter',
            FilterItem: {
              '@type': 'DataLakeItem',
              Creator: {
                '@type': 'UserAccount',
                Identifier: accountId // Use static account number
              }
            }
          }
        })
      });

      const data = await response.json();
      const result = data.Result.ItemListElement.map(item => item.Item);
      // Sort transactions by serial number in ascending order
      result.sort((a, b) => a.SerialNumber - b.SerialNumber);
      setTransactions(result);
      if (result.length > 0) {
        // Update balance to the latest transaction's balance
        const latestBalance = result[result.length - 1].Balance;
        setBalance(latestBalance);
        if (latestBalance < 0) {
          setErrorMessage('Insufficient balance for withdrawal');
        } else {
          setErrorMessage('');
        }
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const clearTransactions = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          '@context': [
            'http://schema4i.org/Thing.jsonld',
            'http://schema4i.org/Action.jsonld',
            'http://schema4i.org/DeleteAction.jsonld'
          ],
          '@type': 'DeleteAction',
          Object: {
            '@context': [
              'http://schema4i.org/Thing.jsonld',
              'http://schema4i.org/Filter',
              'http://schema4i.org/DataLakeItem',
              'http://schema4i.org/UserAccount'
            ],
            '@type': 'Filter',
            FilterItem: {
              '@type': 'DataLakeItem',
              Creator: {
                '@type': 'UserAccount',
                Identifier: accountId // Use static account number
              }
            }
          }
        })
      });

      const data = await response.json();
      console.log(data);
      setTransactions([]);
      setBalance(0);
      setErrorMessage('');
    } catch (error) {
      console.error('Error clearing transactions:', error);
    }
  };

  const handleDeposit = async () => {
    const newBalance = balance + parseFloat(amount);
    await storeTransaction({ amount: parseFloat(amount), balance: newBalance, type: 'Deposit', serial: transactions.length + 1 });
    setBalance(newBalance); // Update balance state
    setAmount(''); // Reset input field
    loadTransactions(); // Reload transactions to update balance
  };

  const handleWithdraw = async () => {
    if (amount > balance) {
      setErrorMessage('Insufficient balance for withdrawal');
      return;
    }
    const newBalance = balance - parseFloat(amount);
    await storeTransaction({ amount: parseFloat(amount), balance: newBalance, type: 'Withdraw', serial: transactions.length + 1 });
    setBalance(newBalance); // Update balance state
    setAmount(''); // Reset input field
    loadTransactions(); // Reload transactions to update balance
  };

  return (
    <div className="App">
      <h1>Transaction App</h1>
      <div>
        <input
          type="number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Account Number"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <br>
        </br>
        <button onClick={handleDeposit}>Deposit</button>
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>
      <div>
        <h2>Current Balance: ${balance}</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
      <div>
         <button onClick={loadTransactions}>Load Transactions</button>
         <button onClick={clearTransactions}>Clear Transactions</button>
         <br>
         </br>
         <h2>Transactions:</h2>
        <table>
          <thead>
            <tr>
              <th>Ser No.</th>
              <br></br>
              <th>Account Number</th>
              <br></br>
              <th>Type</th>
              <br></br>
              <th>Amount</th>
              <br>
              </br>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
              {transactions.map((transaction, index) => (
               <tr key={index}>
                 <td>{transaction.SerialNumber}</td>
                 <br></br>
                 <td>{transaction.Creator.Identifier}</td>
                 <br></br>
                 <td>{transaction.Type}</td>
                 <br></br>
                 <td>${transaction.Amount}</td>
                 <br></br>
                 <td>${transaction.Balance}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
