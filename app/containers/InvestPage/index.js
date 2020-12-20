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
import { makeSelectPagination, makeSelectSearch, makeSelectTokenData, makeSelectIsLoadingChart, makeSelectTokens, makeSelectError } from './selectors';
import { makeSelectCurrrentNetwork, makeSelectCurrrentSwap, makeSelectCurrrentApproval } from '../App/selectors';
import { makeSelectBalances, makeSelectEthPrice, makeSelectPrices, makeSelectRelevantPrices } from '../GrowthStats/selectors';
import {isMobile} from 'react-device-detect';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import styled from 'styled-components';
import ConfirmationModal from 'components/ConfirmationModal';
import {AssetList, InvestHeader} from './components';
import NetworkData from 'contracts';
import { 
  getTokens, changePage, searchAssets, 
  mintGTokenFromCToken, mintGTokenFromUnderlying, mintGTokenFromBridge, mintGTokenFromUnderlyingBridge,
  redeemGTokenToCToken, redeemGTokenToUnderlying, redeemGTokenToBridge, redeemGTokenToUnderlyingBridge,
  approveToken, getTokenStats 
} from './actions';
import { addCurrentSwap, dismissSwap, addCurrentApproval, dismissApproval } from '../App/actions';
import Loader from 'react-loader-spinner';
import { stubTrue } from 'lodash';

const Invest = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${props => props.isMobile ? '0 0.5em 0 0.5em' : '0 1em 0 1em;'}
  align-items: center;
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

const ErrorMessage = styled.b`
  margin: 1em 0 1em 0;
  color: #E56B70;
`

const Title = styled.p`
  display: flex-direction;
  justify-content: center;
  color: white;
  text-align: center;
`

class InvestPage extends React.Component {

  componentDidMount = () => {
    const {tokens} = this.props; 

    if (!tokens) {
      this.handleGetTokens();
    }
  }

  /* Parse the assets */
  assetKeys = (Network) => {
    if (!Network || !Network.available_assets) return [];
    return Object.keys(Network.available_assets);
  }

  handleGetTokens = () => {
    const {getTokens} = this.props;

    const DAYS_RANGE = 30;
    let last_month = new Date(Date.now() - DAYS_RANGE * 24 * 60 * 60 * 1000);
    last_month.setHours(0,0,0,0);
    const last_month_date = Math.round(last_month.getTime() / 1000);
    
    const FIFTEEN_DAYS_RANGE = 7;
    let LAST_TWO_WEEKS = new Date(Date.now() - FIFTEEN_DAYS_RANGE * 24 * 60 * 60 * 1000);
    LAST_TWO_WEEKS.setHours(0,0,0,0);
    const two_weeks_date = Math.round(LAST_TWO_WEEKS.getTime() / 1000);
    
    getTokens({last_month_date, two_weeks_date});
  }

  render () {
    const {network, web3, balances, tokens, error} = this.props;
    const Network = network ? NetworkData[network] : NetworkData['eth'];
    const assets = this.assetKeys(Network);

    if (!tokens && !error) {
      this.handleGetTokens();
    }

    return (
      <React.Fragment>
        <Invest isMobile={isMobile}>
          {isMobile && <Title>ASSETS</Title>}
          <InvestHeader 
            {...this.props} 
            isMobile={isMobile}
            assets={assets}
            isTop={true}
          />
          <InvestContainer>
            {true ? (
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
          <InvestHeader 
            {...this.props} 
            isMobile={isMobile}
            assets={assets}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Invest>
        {!isMobile && (
          <ConfirmationModal {...this.props} />
        )}
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
  tokens: makeSelectTokens(),
  pagination: makeSelectPagination(),
  search: makeSelectSearch(),
  isLoadingChart: makeSelectIsLoadingChart(),
  tokenData: makeSelectTokenData(),
  error: makeSelectError(),
  // Stats
  balances: makeSelectBalances(),
  ethPrice: makeSelectEthPrice(),
  prices: makeSelectPrices(),
  relevantPrices: makeSelectRelevantPrices(),
});

function mapDispatchToProps(dispatch) {
  return {
    // App
    addCurrentSwap: (swap) => dispatch(addCurrentSwap(swap)),
    dismissSwap: () => dispatch(dismissSwap()),
    addCurrentApproval: (approval) => dispatch(addCurrentApproval(approval)),
    dismissApproval: () => dispatch(dismissApproval()),
    // Invest
    getTokens: (dateRange) => dispatch(getTokens(dateRange)),
    changePage: (pagination) => dispatch(changePage(pagination)),
    searchAssets: (search) => dispatch(searchAssets(search)),
    mintGTokenFromCToken: (payload) => dispatch(mintGTokenFromCToken(payload)),
    mintGTokenFromUnderlying: (payload) => dispatch(mintGTokenFromUnderlying(payload)),
    mintGTokenFromBridge: (payload) => dispatch(mintGTokenFromBridge(payload)),
    mintGTokenFromUnderlyingBridge: (payload) => dispatch(mintGTokenFromUnderlyingBridge(payload)),
    redeemGTokenToCToken: (payload) => dispatch(redeemGTokenToCToken(payload)),
    redeemGTokenToUnderlying: (payload) => dispatch(redeemGTokenToUnderlying(payload)),
    redeemGTokenToBridge: (payload) => dispatch(redeemGTokenToBridge(payload)),
    redeemGTokenToUnderlyingBridge: (payload) => dispatch(redeemGTokenToUnderlyingBridge(payload)),
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
