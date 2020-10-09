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

  calculatePortfolio = () => {
    const { balances, eth_price } = this.props;

    if (!balances) return '-';
    if (balances.length < 1) return;
    
    console.log(balances);

    // Calculate price by eth
    const total_eth = 
        balances
          .reduce((acc, curr) => {
             // If not available balance
             if (Number(curr.balance) <= 0 ) return acc; 
             // If it GRO
             if (curr.name === 'GRO') {
               return acc + Number(curr.balance / 1e18) / Number(curr.price_eth) * eth_price; 
             } 
             if (curr.base_price_eth && curr.liquidation_price ) {
                return acc + Number(curr.liquidation_price._cost / 1e8) * (eth_price / Number(curr.base_price_eth));
             }
             return acc;
          }, 0);
        
    return total_eth.toLocaleString('en-En');
  }


  render () {
    const {address, isMobileSized} = this.props;
    this.calculatePortfolio();
    return (
      <WalletContainer isMobileSized={isMobileSized} >
        <WalletDashboardHeader>
          <FormattedMessage {...messages.balance} />
          <FormattedMessage {...messages.more} />
        </WalletDashboardHeader>
        <WalletDashboardStats>
          <InfoRow>
            {address ? (
              <StatLabel>${this.calculatePortfolio()}</StatLabel>
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
