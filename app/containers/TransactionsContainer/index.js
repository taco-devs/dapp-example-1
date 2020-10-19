/**
 *
 * InvestPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {isMobile} from 'react-device-detect';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import styled from 'styled-components';
import { getTransactions } from './actions';
import { makeSelectTransactions } from './selectors';
 
const TransactionsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${props => props.isMobile ? '0 0.5em 0 0.5em' : '0 1em 0 1em;'}
`

const Transactions = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, .15);
  border-radius: 5px;
  margin: 0.5em 0 0;
  align-items: center;
  justify-content: center;
`

class TransactionsContainer extends React.Component {

  componentDidMount = () => {
    this.fetchTransactions();
  }

  fetchTransactions = () => {
    const {getTransactions, address} = this.props;
    getTransactions({address});
  }

  render () {
    const { transactions } = this.props;
    if (!transactions) {
      this.fetchTransactions();
    }
    return (
      <React.Fragment>
        <TransactionsSection>
          <Transactions>
            <p>Transactions</p>
          </Transactions>
        </TransactionsSection>
      </React.Fragment>
    );
  }
  
}

TransactionsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


const withReducer = injectReducer({ key: 'transactions', reducer });
const withSaga = injectSaga({ key: 'transactionsSaga', saga });

const mapStateToProps = createStructuredSelector({
  transactions: makeSelectTransactions()
});

function mapDispatchToProps(dispatch) {
  return {
    getTransactions: (payload) => dispatch(getTransactions(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
    withReducer,
    withSaga,
    withConnect,
  )(TransactionsContainer);
