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
import { getTransactions, changePage } from './actions';
import { makeSelectTransactions, makeSelectPagination, makeSelectIsLoading, makeSelectError } from './selectors';
import { TransactionsList, TransactionsHeader } from './components';
import { makeSelectUser } from '../GrowthStats/selectors';
import NetworkData from 'contracts';
import Loader from 'react-loader-spinner';

 
const TransactionsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${props => props.isMobile ? '0 0.5em 0 0.5em' : '0 1em 0 1em;'}
`

const Transactions = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  min-height: 200px;
  width: 100%;
  background-color: rgba(0, 0, 0, .15);
  border-radius: 5px;
  margin: 0.5em 0 0;
  align-items: center;
  justify-content: center;
`

const LoaderContainer = styled.div`
  margin: 1em 0 1em 0;
`

const ErrorMessage = styled.b`
  color: #E56B70;
`

const InfoMessage = styled.b`
  color: white;
`

class TransactionsContainer extends React.Component {

  componentDidMount = () => {
    this.fetchTransactions();
  }

  fetchTransactions = () => {
    const {getTransactions, address} = this.props;
    getTransactions({address});
  }


  /* Parse the assets */
  assetKeys = (Network) => {
    if (!Network || !Network.available_assets) return [];
    return Object.keys(Network.available_assets);
  }

  render () {
    const { transactions, network_id, isLoading, error, address } = this.props;
    const Network = network_id ? NetworkData[network_id] : NetworkData['eth'];
    const assets = this.assetKeys(Network);
    if (!transactions && !error) {
      this.fetchTransactions();
    }
    return (
      <React.Fragment>
        <TransactionsSection>
          <TransactionsHeader 
            {...this.props}
            fetchTransactions={this.fetchTransactions}
          />
          <Transactions>
              {isLoading && !transactions && (
                <LoaderContainer>
                  <Loader
                    type="TailSpin"
                    color='#00d395'
                    height={120}
                    width={120}
                  />
                </LoaderContainer>
              )}
              {address && transactions && transactions.length > 0 && (
                <TransactionsList 
                  {...this.props}
                  Network={Network}
                  assets={assets}
                />
              )} 
              {transactions && transactions.length < 1 && (
                <InfoMessage>No transactions</InfoMessage>
              )}
              {error && <ErrorMessage>{error}</ErrorMessage>}
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
  user: makeSelectUser(),
  transactions: makeSelectTransactions(),
  pagination: makeSelectPagination(),
  isLoading: makeSelectIsLoading(),
  error: makeSelectError(),
});

function mapDispatchToProps(dispatch) {
  return {
    getTransactions: (payload) => dispatch(getTransactions(payload)),
    changePage: (pagination) => dispatch(changePage(pagination))
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
