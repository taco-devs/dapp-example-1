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


class TransactionsContainer extends React.Component {
  render () {
    return (
      <React.Fragment>
        <p>Transactions</p>
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
});

function mapDispatchToProps(dispatch) {
  return {
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
