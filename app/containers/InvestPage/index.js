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
import { makeSelectPagination, makeSelectSearch } from './selectors';
import {isMobile} from 'react-device-detect';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import styled from 'styled-components';
import {AssetList, InvestHeader} from './components';
import NetworkData from 'contracts';
import { changePage, searchAssets } from './actions';

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
`

class InvestPage extends React.Component {

  /* Parse the assets */
  assetKeys = (Network) => {
    if (!Network || !Network.available_assets) return [];
    return Object.keys(Network.available_assets);
  }

  render () {
    const {network_id} = this.props;
    const Network = NetworkData[network_id];
    const assets = this.assetKeys(Network);
    return (
      <Invest isMobile={isMobile}>
        <InvestHeader 
          {...this.props} 
          isMobile={isMobile}
          assets={assets}
        />
        <InvestContainer>
          <AssetList 
            {...this.props}
            isMobile={isMobile}
            assets={assets}
            Network={Network}
          />
        </InvestContainer>
      </Invest>
    
    );
  }
  
}

InvestPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


const withReducer = injectReducer({ key: 'investPage', reducer });
const withSaga = injectSaga({ key: 'investSaga', saga });

const mapStateToProps = createStructuredSelector({
  pagination: makeSelectPagination(),
  search: makeSelectSearch()
});

function mapDispatchToProps(dispatch) {
  return {
    changePage: (pagination) => dispatch(changePage(pagination)),
    searchAssets: (search) => dispatch(searchAssets(search))
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
