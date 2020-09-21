/**
 *
 * WalletDashboard
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styled from 'styled-components';

const WalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 1em;
  border-radius: 5px;
  min-width: 300px;
`

const WalletDashboardHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.5em 0.5em 0 0.5em;
  color: white;
`

const WalletDashboardStats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  background-color: #00d395;
  border-radius: 5px;
  margin: 0.5em 0 0 0;
  width: 100%;
  color: white;
  -webkit-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
  box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
`

const WalletDashboardDivider = styled.div`
  width: 90%;
  height: 2px;
  background-color: white;
`

const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1em 0 1em 0;
`

const StatLabel = styled.h3`
  margin: 0 3px 0 3px;
  color: ${props => props.color};
`

class WalletDashboard extends React.Component {
  render () {
    const {address, isMobileSized} = this.props;
    return (
      <WalletContainer isMobileSized={isMobileSized} >
        <WalletDashboardHeader>
          <FormattedMessage {...messages.balance} />
          <FormattedMessage {...messages.more} />
        </WalletDashboardHeader>
        <WalletDashboardStats>
          <InfoRow>
            {address ? (
              <StatLabel>$3,233.25</StatLabel>
            ) : (
              <StatLabel>-</StatLabel>
            )}            
            <StatLabel color="#161d6b">USD</StatLabel>
          </InfoRow>
          <WalletDashboardDivider />
          <InfoRow>
            {address ? (
              <StatLabel>1,235%</StatLabel>
            ) : (
              <StatLabel>-</StatLabel>
            )}   
            <StatLabel color="#161d6b">APY</StatLabel>
          </InfoRow>
        </WalletDashboardStats>
      </WalletContainer>
    );
  }
}

WalletDashboard.propTypes = {};

export default WalletDashboard;
