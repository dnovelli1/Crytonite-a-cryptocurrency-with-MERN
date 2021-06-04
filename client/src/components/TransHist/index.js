import React, { useContext, useState, useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import SessionContext from '../../utils/sessionContext';
import API from "../../utils/api";
import { Container, Card } from 'react-bootstrap';
import "./style.css";

// Table is able to be styled. This is generic boostrap styling for MVP.

// THIS IS PLACEHOLDER DATA. WE NEED TO PASS AN ARRAY OF OBJECTS WITH THE VALUES
// CHANGE THE KEYS ACCORDINGLY TO WHAT THE BLOCKCHAIN PROVIDES
// {
//   "fromAddress": "From",
//   "toAddress": "Recipient",
//   "timestamp": "Timestamp",
//   "amount": "Amount",
//   "label": "whatever"
// }

function TransHist() {

  const { publicKey, username } = useContext(SessionContext);
  const [transactions, setTransactions] = useState([]);
  const headerSortingStyle = { backgroundColor: '#353535', color: 'white' };
  const defaultSorted = [{
    dataField: 'timestamp',
    order: 'desc'
  }]; 
  // ^^^ background color of column when clicked. 


  const timeConverter = (time) => {
    const unixTime = time;
    const dateObject = new Date(unixTime);
    const dateFormat = dateObject.toLocaleString();
    return dateFormat;
  }

  useEffect(() => {
    console.log("hello");
    API.getUserTransactions(publicKey)
      .then(res => {
        console.log(res.data);
        let count = 0;
        res.data.forEach(data => {
          data.key = count;
          data.timestamp = timeConverter(data.timestamp);
          if (data.fromAddress === publicKey) {
            data.fromAddress = username;
            data.amount = " - " + data.amount;
            API.getUsername(data.toAddress)
              .then(result => {
                console.log(result.data.message);
                data.toAddress = result.data.message;
              });
          };
          if (data.toAddress === publicKey) {
            data.toAddress = username;
            data.amount = " + " + data.amount;
            if (data.fromAddress) {
              API.getUsername(data.fromAddress)
                .then(result => {
                  console.log(result.data.message);
                  data.fromAddress = result.data.message;
                })
            } else {
              data.fromAddress = "System";
            }
          };
          count++;
        });
        console.log(res.data);
        setTimeout(() => {
          setTransactions(res.data);
        }, 2000);
      }
      )
  }, [publicKey, username]);


  const columns = [{
    dataField: 'fromAddress',
    text: 'From',
    sort: true,
    headerSortingStyle,
    sortCaret: (order, column) => {
      if (!order) return (<span>&nbsp;&nbsp;<i className="fas fa-sort-up"></i><i className="fas fa-sort-down"></i></span>);
      else if (order === 'asc') return (<span>&nbsp;&nbsp;<i className="fas fa-sort-up"></i><i className="fas fa-sort-down active"></i></span>);
      else if (order === 'desc') return (<span>&nbsp;&nbsp;<i className="fas fa-sort-up active"></i><i className="fas fa-sort-down"></i></span>);
      return null;
    }
  }, {
    dataField: 'toAddress',
    text: 'Recipient',
    sort: true,
    headerSortingStyle,
    sortCaret: (order, column) => {
      if (!order) return (<span>&nbsp;&nbsp;<i className="fas fa-sort-up"></i><i className="fas fa-sort-down"></i></span>);
      else if (order === 'asc') return (<span>&nbsp;&nbsp;<i className="fas fa-sort-up"></i><i className="fas fa-sort-down active"></i></span>);
      else if (order === 'desc') return (<span>&nbsp;&nbsp;<i className="fas fa-sort-up active"></i><i className="fas fa-sort-down"></i></span>);
      return null;
    }
  }, {
    dataField: 'amount',
    text: 'Amount',
    sort: true,
    headerSortingStyle,
    sortCaret: (order, column) => {
      if (!order) return (<span>&nbsp;&nbsp;<i className="fas fa-sort-up"></i><i className="fas fa-sort-down"></i></span>);
      else if (order === 'asc') return (<span>&nbsp;&nbsp;<i className="fas fa-sort-up"></i><i className="fas fa-sort-down active"></i></span>);
      else if (order === 'desc') return (<span>&nbsp;&nbsp;<i className="fas fa-sort-up active"></i><i className="fas fa-sort-down"></i></span>);
      return null;
    }
  }, {
    dataField: 'timestamp',
    text: 'Timestamp',
    sort: true,
    headerSortingStyle,
    sortCaret: (order, column) => {
      if (!order) return (<span>&nbsp;&nbsp;<i className="fas fa-sort-up"></i><i className="fas fa-sort-down"></i></span>);
      else if (order === 'asc') return (<span>&nbsp;&nbsp;<i className="fas fa-sort-up"></i><i className="fas fa-sort-down active"></i></span>);
      else if (order === 'desc') return (<span>&nbsp;&nbsp;<i className="fas fa-sort-up active"></i><i className="fas fa-sort-down"></i></span>);
      return null;
    }
  }
  ];

  const expandRow = {
    renderer: row => (
      <div>
        <p>{row.label}</p>
      </div>
    ),
    showExpandColumn: true,
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      if (isAnyExpands) {
        return <b>-</b>;
      }
      return <b>+</b>;
    },
    expandColumnRenderer: ({ expanded }) => {
      if (expanded) {
        return (
          <b>-</b>
        );
      }
      return (
        <b>...</b>
      );
    }
  };
  console.log(transactions);
  if (transactions.length === 0) {
    return (
      <Container>
        <Card body style={{ textAlign: 'center', backgroundColor: '#D9D9D9', color: '#353535' }}><h3>You have no Transactions yet!</h3></Card>
      </Container>
    )
  } else {
    return (
      <>
        <Container>
          <BootstrapTable
            className="table"
            style={{ textAlign: 'center' }}
            keyField="key"  
            data={transactions}
            columns={columns}
            expandRow={expandRow}
            pagination={paginationFactory()}
            defaultSorted={defaultSorted}
            striped
            hover
            condensed
          />
        </Container>
      </>
    )
  }
}

export default TransHist;