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
import { makeSelectPagination, makeSelectSearch, makeSelectTokenData, makeSelectIsLoadingChart } from './selectors';
import { makeSelectCurrrentNetwork, makeSelectCurrrentSwap, makeSelectCurrrentApproval } from '../App/selectors';
import { makeSelectBalances, makeSelectEthPrice } from '../GrowthStats/selectors';
import {isMobile} from 'react-device-detect';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import styled from 'styled-components';
import ConfirmationModal from 'components/ConfirmationModal';
import {AssetList, InvestHeader} from './components';
import NetworkData from 'contracts';
import { changePage, searchAssets, mintGTokenFromCToken, mintGTokenFromUnderlying, redeemGTokenToCToken, redeemGTokenToUnderlying, approveToken, getTokenStats } from './actions';
import { addCurrentSwap, dismissSwap, addCurrentApproval, dismissApproval } from '../App/actions';
import Loader from 'react-loader-spinner';

const Invest = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${props => props.isMobile ? '0 0.5em 0 0.5em' : '0 1em 0 1em;'}
`

const InvestContainer = styled.div`
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

const LoaderContainer = styled.div`
  margin: 1em 0 1em 0;
`

class InvestPage extends React.Component {

  /* Parse the assets */
  assetKeys = (Network) => {
    if (!Network || !Network.available_assets) return [];
    return Object.keys(Network.available_assets);
  }

  render () {
    const {network, web3, balances} = this.props;
    const Network = network ? NetworkData[network] : NetworkData['eth'];
    const assets = this.assetKeys(Network);
    return (
      <React.Fragment>
        <Invest isMobile={isMobile}>
          <InvestHeader 
            {...this.props} 
            isMobile={isMobile}
            assets={assets}
          />
          <InvestContainer>
            {web3 && balances ? (
              <AssetList 
                {...this.props}
                isMobile={isMobile}
                assets={assets}
                Network={Network}
              />
            ) : (
              <LoaderContainer>
                <Loader
                  type="TailSpin"
                  color='#00d395'
                  height={120}
                  width={120}
                />
              </LoaderContainer>
              
            )}
            
          </InvestContainer>
        </Invest>
        <ConfirmationModal {...this.props} />
      </React.Fragment>
    );
  }
  
}

InvestPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


const withReducer = injectReducer({ key: 'investPage', reducer });
const withSaga = injectSaga({ key: 'investSaga', saga });

const mapStateToProps = createStructuredSelector({
  // App
  network: makeSelectCurrrentNetwork(),
  currentSwap: makeSelectCurrrentSwap(),
  currentApproval: makeSelectCurrrentApproval(),
  // Invest
  pagination: makeSelectPagination(),
  search: makeSelectSearch(),
  isLoadingChart: makeSelectIsLoadingChart(),
  tokenData: makeSelectTokenData(),
  // Stats
  balances: makeSelectBalances(),
  ethPrice: makeSelectEthPrice()
});

function mapDispatchToProps(dispatch) {
  return {
    // App
    addCurrentSwap: (swap) => dispatch(addCurrentSwap(swap)),
    dismissSwap: () => dispatch(dismissSwap()),
    addCurrentApproval: (approval) => dispatch(addCurrentApproval(approval)),
    dismissApproval: () => dispatch(dismissApproval()),
    // Invest
    changePage: (pagination) => dispatch(changePage(pagination)),
    searchAssets: (search) => dispatch(searchAssets(search)),
    mintGTokenFromCToken: (payload) => dispatch(mintGTokenFromCToken(payload)),
    mintGTokenFromUnderlying: (payload) => dispatch(mintGTokenFromUnderlying(payload)),
    redeemGTokenToCToken: (payload) => dispatch(redeemGTokenToCToken(payload)),
    redeemGTokenToUnderlying: (payload) => dispatch(redeemGTokenToUnderlying(payload)),
    approveToken: (payload) => dispatch(approveToken(payload)),
    getTokenStats: (payload) => dispatch(getTokenStats(payload))
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
  )(InvestPage);
