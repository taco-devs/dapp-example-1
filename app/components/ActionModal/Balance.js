import React, { Component } from 'react';
import styled from 'styled-components'; 
import Loader from 'react-loader-spinner';
import { numberToBN, BNtoNumber } from 'utils/utilities';

const BalanceLabel = styled.b`
  color: #161d6b;
  text-align: ${props => props.align || 'left'};
  margin: ${props => props.margin || '0'};
`

const BalanceRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
`

export default class Balance extends Component {

    showBalance = (is_native) => {
        const { asset, underlying_balance, asset_balance, g_balance, modal_type, calcFromCost } = this.props;
        if (!underlying_balance || !asset_balance || !g_balance ) return (
          <Loader
            type="TailSpin"
            color={is_native ? '#00d395' : '#161d6b'}
            height={20}
            width={20}
          />
        );
  
        if (modal_type === 'mint') {
        
          if (is_native) {
            return Math.round(underlying_balance / asset.underlying_decimals * 1e8) / 1e8;
          } else {
            return Math.round(asset_balance / asset.base_decimals * 1e8) / 1e8; 
          }
        }
  
        if (modal_type === 'redeem') {
          return Math.round((g_balance / asset.base_decimals) * 1e8) / 1e8;
        }      
    }

    render() {
        const {is_native, calcFromCost} = this.props;
        return (
            <BalanceRow>
                <BalanceLabel>BALANCE:</BalanceLabel>
                <BalanceLabel margin="0 10px 0 10px">{this.showBalance(is_native)}</BalanceLabel>
            </BalanceRow>
        )
    }
}
