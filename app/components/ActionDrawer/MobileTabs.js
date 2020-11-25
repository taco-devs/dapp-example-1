import React, { Component } from 'react';
import styled from 'styled-components';
import types from 'contracts/token_types.json';

const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  height: 70px;
`

const ModalHeaderOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  background-color: ${props => props.active ? props.defaultColor : 'white'};
  color: ${props => props.active ? 
    (props.asset.type === types.STKGRO ? '#21262b' : 'white')
    : 
    (props.asset.type === types.STKGRO ? '#21262b' : props.defaultColor)
  };
  &:hover {
    cursor: pointer;
    opacity: 0.75;
  }
`

export default class MobileTabs extends Component {

    handleChangeType = (modal_type) => {
        const {handleChange, currentSwap} = this.props;
        if (currentSwap) return;
        handleChange({modal_type});
    }

    setMax = () => {
        const { asset, modal_type, is_native, underlying_balance, asset_balance, g_balance } = this.props;
        
        if (modal_type === 'mint') {
          if (is_native) {
            const SAFE_MARGIN = 0.0001 * asset.underlying_decimals;
            if ((Number(underlying_balance) / asset.underlying_decimals) < 0.01) return;
            const value_native = ((underlying_balance - SAFE_MARGIN) / asset.underlying_decimals);
            this.setState({value_native});
            this.handleInputChange(value_native)
          } else {
            if ((Number(asset_balance) / asset.base_decimals) < 0.01) return;
            const value_base = asset_balance / asset.base_decimals;
            this.setState({value_base});
            this.handleInputChange(value_base)
          }
        }
    
        if (modal_type === 'redeem') {
          if ((Number(g_balance) / asset.base_decimals) < 0.01) return;
          const value_redeem = g_balance / asset.base_decimals;
          this.setState({value_redeem});
          this.calculateBurningTotal(value_redeem);
        }
      }

    render() {
        const {modal_type, asset} = this.props;
        return (
            <ModalHeader>
                <ModalHeaderOption
                    asset={asset}
                    active={modal_type === 'mint'}
                    defaultColor={asset.type === types.STKGRO ? '#ffe391' : "#00d395"}
                    onClick={() => this.handleChangeType('mint')} 
                >
                    <p>{asset.type === types.STKGRO ? 'STAKE' : 'MINT'}</p>
                </ModalHeaderOption>
                <ModalHeaderOption
                    asset={asset}
                    active={modal_type === 'redeem'}
                    defaultColor={asset.type === types.STKGRO ? '#ffe391' : "#161d6b"}
                    onClick={() => this.handleChangeType('redeem')} 
                >
                    <p>{asset.type === types.STKGRO ? 'UNSTAKE' : 'REDEEM'}</p>
                </ModalHeaderOption>
            </ModalHeader>
        )
    }
}
