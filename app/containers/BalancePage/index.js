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
import { BalanceList, BalanceHeader } from './components';
import {isMobile} from 'react-device-detect';
import ConfirmationModal from 'components/ConfirmationModal';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import styled from 'styled-components';
import NetworkData from 'contracts';
import { makeSelectBalances, makeSelectEthPrice } from '../GrowthStats/selectors';
import { makeSelectCurrrentNetwork, makeSelectCurrrentApproval, makeSelectCurrrentSwap, makeSelectHideBalances } from '../App/selectors';
import { makeSelectIsLoadingBalances, makeSelectBalancesError } from '../GrowthStats/selectors';
import { addCurrentApproval, addCurrentSwap, dismissApproval, dismissSwap, toggleHideBalances } from '../App/actions'
import { getBalances } from '../GrowthStats/actions';
import { mintGTokenFromCToken, mintGTokenFromUnderlying, redeemGTokenToCToken, redeemGTokenToUnderlying } from '../InvestPage/actions'
import Loader from 'react-loader-spinner';

const Balance = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${props => props.isMobile ? '0 0.5em 0 0.5em' : '0 1em 0 1em;'}
`

const BalanceContainer = styled.div`
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
  margin: 1em 0 1em 0;
  color: #E56B70;
`


class BalancePage extends React.Component {

  state = {
    openSettingsMenu: false,
  }

  componentDidMount = () => {
    this.handleGetBalances();
  }

  toggleSettings = () => {
    this.setState({openSettingsMenu: !this.state.openSettingsMenu});
  }

  /* Parse the assets */
  assetKeys = (Network) => {
    if (!Network || !Network.available_assets) return [];
    return Object.keys(Network.available_assets);
  }


  handleGetBalances = () => {
    const {web3, address, getBalances} = this.props;
    getBalances(address, web3);
  }

  render () {
    const {network_id, isLoadingBalances, balancesError, balances} = this.props;
    const Network = network_id ? NetworkData[network_id] : NetworkData['eth'];
    const assets = this.assetKeys(Network);
    return (
      <Balance>
        <BalanceHeader  
          {...this.state}
          {...this.props}
          toggleSettings={this.toggleSettings}
        />
        <BalanceContainer>
          {isLoadingBalances && !balances && (
            <LoaderContainer>
              <Loader
                type="TailSpin"
                color='#00d395'
                height={120}
                width={120}
              />
            </LoaderContainer>
          )}
          { balances && (
            <BalanceList 
              {...this.props}
              isMobile={isMobile}
              assets={assets}
              Network={Network}
            />
          )}
        </BalanceContainer>
        {balancesError && <ErrorMessage>{balancesError}</ErrorMessage>}
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
  eth_price: makeSelectEthPrice(),
  hideBalances: makeSelectHideBalances(),
  // Stats
  isLoadingBalances: makeSelectIsLoadingBalances(),
  balancesError: makeSelectBalancesError()
});

function mapDispatchToProps(dispatch) {
  return {
    // App
    addCurrentSwap: (swap) => dispatch(addCurrentSwap(swap)),
    dismissSwap: () => dispatch(dismissSwap()),
    addCurrentApproval: (approval) => dispatch(addCurrentApproval(approval)),
    dismissApproval: () => dispatch(dismissApproval()),
    toggleHideBalances: () => dispatch(toggleHideBalances()),
    // Invest
    mintGTokenFromCToken: (payload) => dispatch(mintGTokenFromCToken(payload)),
    mintGTokenFromUnderlying: (payload) => dispatch(mintGTokenFromUnderlying(payload)),
    redeemGTokenToCToken: (payload) => dispatch(redeemGTokenToCToken(payload)),
    redeemGTokenToUnderlying: (payload) => dispatch(redeemGTokenToUnderlying(payload)),
    // Stats
    getBalances: (address, web3) => dispatch(getBalances(address, web3)),
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
