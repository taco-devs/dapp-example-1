/**
 *
 * SwapPage
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
import { makeSelectPools, makeSelectTokens } from './selectors';
import reducer from './reducer';
import saga from './saga';
import { makeSelectPrices, makeSelectEthPrice, makeSelectBalances } from '../GrowthStats/selectors';
import { getPools } from './actions';
import messages from './messages';
import NetworkData from 'contracts';
import styled from 'styled-components';

import { SwapHeader, SwapList } from './components';
import SwapContainer from '../SwapContainer';

const Swap = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${props => props.isMobile ? '0 0.5em 0 0.5em' : '0 1em 0 1em;'}
  align-items: center;
`

const SwapWrapper = styled.div`
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


class SwapPage extends React.Component {

  state = {
    showSwapModal: false,
    assetIn: null,
    assetOut: null,
    liquidity_pool_address: null,
  }

  componentDidMount = () => {
    const {getPools} = this.props;
    getPools();
  }

  updateParent = (state) => {
    this.setState({...state});
  }
  
  // Toggle Modal
  toggleModal = (assetIn, assetOut, liquidity_pool_address) => {
    this.setState({
      showSwapModal: !this.state.showSwapModal,
      assetIn, 
      assetOut,
      liquidity_pool_address
    });
  }

  /* Parse the assets */
  assetKeys = (Network) => {
    if (!Network || !Network.available_assets) return [];
    return Object.keys(Network.available_assets);
  }

  render() {
    const { showSwapModal } = this.state;
    const {network} = this.props;
    const Network = network ? NetworkData[network] : NetworkData['eth'];
    const assets = this.assetKeys(Network);
    return (
      <div>
        <Helmet>
          <title>Swap</title>
          <meta name="description" content="Description of SwapPage" />
        </Helmet>
        <Swap>
          <SwapHeader />
          <SwapWrapper>
            <SwapList 
              {...this.props}
              {...this.state}
              assets={assets}
              Network={Network}
              toggleModal={this.toggleModal}
            />
          </SwapWrapper>
        </Swap>
        <SwapContainer 
          {...this.props} 
          {...this.state}
          Network={Network}
          show={showSwapModal}
          toggleModal={this.toggleModal}
          updateParent={this.updateParent}
        />
      </div>
    );
  }  
}


const withReducer = injectReducer({ key: 'swapPage', reducer });
const withSaga = injectSaga({ key: 'swapPage', saga });

SwapPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  balances: makeSelectBalances(),
  pools: makeSelectPools(),
  tokens: makeSelectTokens(),
  prices: makeSelectPrices(),
  ethPrice: makeSelectEthPrice(),
});

function mapDispatchToProps(dispatch) {
  return {
    getPools: () => dispatch(getPools()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withReducer,
  withSaga,
  withConnect
)(SwapPage);
