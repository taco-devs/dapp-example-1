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
import { } from './selectors';
import { BalanceList } from './components';
import {isMobile} from 'react-device-detect';
import ConfirmationModal from 'components/ConfirmationModal';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import styled from 'styled-components';
import NetworkData from 'contracts';
import { makeSelectBalances, makeSelectEthPrice } from '../GrowthStats/selectors';
import { makeSelectCurrrentNetwork, makeSelectCurrrentApproval, makeSelectCurrrentSwap } from '../App/selectors';
import { addCurrentApproval, addCurrentSwap, dismissApproval, dismissSwap } from '../App/actions'
import { mintGTokenFromCToken, mintGTokenFromUnderlying, redeemGTokenToCToken, redeemGTokenToUnderlying } from '../InvestPage/actions'


const Balance = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${props => props.isMobile ? '0 0.5em 0 0.5em' : '0 1em 0 1em;'}
`

const BalanceContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, .15);
  border-radius: 5px;
  margin: 0.5em 0 0;
`


class BalancePage extends React.Component {

  /* Parse the assets */
  assetKeys = (Network) => {
    if (!Network || !Network.available_assets) return [];
    return Object.keys(Network.available_assets);
  }

  render () {
    const {network_id} = this.props;
    const Network = network_id ? NetworkData[network_id] : NetworkData['eth'];
    const assets = this.assetKeys(Network);
    return (
      <Balance>
        <BalanceContainer>
          <BalanceList 
            {...this.props}
            isMobile={isMobile}
            assets={assets}
            Network={Network}
          />
        </BalanceContainer>
        <ConfirmationModal {...this.props} />
      </Balance>
    );
  }
  
}

BalancePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


const withReducer = injectReducer({ key: 'balancePage', reducer });
const withSaga = injectSaga({ key: 'balancePage', saga });

const mapStateToProps = createStructuredSelector({
  // App
  network_id: makeSelectCurrrentNetwork(),
  currentSwap: makeSelectCurrrentSwap(),
  currentApproval: makeSelectCurrrentApproval(),
  balances: makeSelectBalances(),
  eth_price: makeSelectEthPrice()
});

function mapDispatchToProps(dispatch) {
  return {
    // App
    addCurrentSwap: (swap) => dispatch(addCurrentSwap(swap)),
    dismissSwap: () => dispatch(dismissSwap()),
    addCurrentApproval: (approval) => dispatch(addCurrentApproval(approval)),
    dismissApproval: () => dispatch(dismissApproval()),
    // Invest
    mintGTokenFromCToken: (payload) => dispatch(mintGTokenFromCToken(payload)),
    mintGTokenFromUnderlying: (payload) => dispatch(mintGTokenFromUnderlying(payload)),
    redeemGTokenToCToken: (payload) => dispatch(redeemGTokenToCToken(payload)),
    redeemGTokenToUnderlying: (payload) => dispatch(redeemGTokenToUnderlying(payload)),
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
  )(BalancePage);
