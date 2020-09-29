/**
 *
 * GrowthStats
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectGrowthStats from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import StatsContainer from 'components/StatsContainer';
import { getBalances } from './actions';
import { makeSelectBalances, makeSelectEthPrice } from '../GrowthStats/selectors';

import { makeSelectCurrrentNetwork } from '../App/selectors'
 

class GrowthStats extends React.Component {

  fetchBalances = () => {
    const { getBalances, address, web3 } = this.props;
    getBalances(address, web3);
  }

  render () {
    const {address, balances, web3, eth_price} = this.props;

    if (web3 && address && (!balances || !eth_price)) {
      this.fetchBalances();
    }

    return (
      <StatsContainer 
        {...this.props}
      />
    );
  }
  
}

GrowthStats.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


const withReducer = injectReducer({ key: 'statsPage', reducer });
const withSaga = injectSaga({ key: 'statsSaga', saga });

const mapStateToProps = createStructuredSelector({
  balances: makeSelectBalances(),
  network: makeSelectCurrrentNetwork(),
  eth_price: makeSelectEthPrice()
,});

function mapDispatchToProps(dispatch) {
  return {
    getBalances: (address, web3) => dispatch(getBalances(address, web3))
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
  )(GrowthStats);
