import React, { Component } from 'react';
import styled from 'styled-components';
import debounce from 'lodash.debounce';

const InputRow = styled.div`
  display: flex;
  flex-direction: row;
`

const AmountInput = styled.div`
  display: flex;
  flex: 3;
`

const StyledInput = styled.input`
  width: 100%;
  border: 0;
  outline: none;
  font-size: 1.2em;
`

const MaxButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 5px 10px 5px 10px;
  color: white;
  border-radius: 5px;
  flex: 1;
  transition: background-color .4s ease;
  background-color: ${props => {
    if (props.modal_type === 'mint') return '#00d395';
    if (props.modal_type === 'redeem') return '#161d6b';
  }};

  &:hover {
    opacity: 0.85;
    cursor: pointer;
  }
`

export default class AmountInpunt extends Component {

    calculateMintingTotal = debounce(async (value) => {
        const { 
            handleMultiChange, getWei,
            web3, asset,
            modal_type, is_native, total_reserve, total_supply, exchange_rate, deposit_fee
        } = this.props;
    
        const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);  
    
        // Handle 0 value transactions
        if (!value || value.length <= 0) {
          handleMultiChange({
            real_fee: null,
            total: null,
          })
        }
    
        // Calculate the total to mint
        if (modal_type === 'mint') {
          if (is_native) {
            const netShares = getWei(value, asset.underlying_decimals);
            const underlying_conversion = await GContractInstance.methods.calcCostFromUnderlyingCost(netShares, exchange_rate).call();
            const result = await GContractInstance.methods.calcDepositSharesFromCost(underlying_conversion, total_reserve, total_supply, deposit_fee).call();
            const {_netShares, _feeShares} = result;
            handleMultiChange({
              real_fee: _feeShares,
              total_native: _netShares,
            });
      
          } else {
            // CTokens only have 8 decimals 
            // NOTE: Standarized to gwei by converting it to 1e9 because .toWei() doesn't handle 1e8
            const _cost = getWei(value, 1e8)
            const result = await GContractInstance.methods.calcDepositSharesFromCost(_cost, total_reserve, total_supply, deposit_fee).call();
            const {_netShares, _feeShares} = result;
            // Change
            handleMultiChange({
              real_fee: _feeShares,
              total_base: _netShares,
            })
          }
        }
    
      }, 250);
    
      calculateBurningTotal = debounce(async (value) => {
        const { 
            handleMultiChange, getWei,
            web3, asset,
            total_reserve, total_supply, exchange_rate, withdrawal_fee
        } = this.props;
      
        // Handle 0 value transactions
        if (!value || value.length <= 0) {
            // Change
            handleMultiChange({
                real_fee: null,
                total: null,
            })
        }
    
        const netShares = getWei(value, 1e8);
      
        const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
        const result = await GContractInstance.methods.calcWithdrawalCostFromShares(netShares, total_reserve, total_supply, withdrawal_fee).call();
        const rate = await GContractInstance.methods.calcUnderlyingCostFromCost(result._cost, exchange_rate).call();
        const {_cost, _feeShares} = result;
        // Change
        handleMultiChange({
          real_fee: _feeShares,
          total_native_cost_redeem: netShares,
          total_base_redeem: _cost,
          total_native_redeem: rate,
        });
    
      }, 250)

    handleInputChange = (value) => {
        const {
            handleChange,
            modal_type, is_native
        } = this.props;
        
        if (value < 0) {
          handleChange('value', 0);
        } else {
    
          // Route total logic
          if (modal_type === 'mint') {
            this.calculateMintingTotal(value);
    
            // Route native field
            if (is_native) {
              handleChange('value_native', value);
            } else {
              handleChange('value_base', value);
            }
          } 
        
          if (modal_type === 'redeem') {
            this.calculateBurningTotal(value, true);
            handleChange('value_redeem', value);
          }
        }
    }

    setMax = () => {
        const { 
            handleMultiChange, 
            asset,
            modal_type, is_native, underlying_balance, asset_balance, g_balance,
         } = this.props;
        
        if (modal_type === 'mint') {
          if (is_native) {
            const SAFE_MARGIN = 0.0001 * asset.underlying_decimals;
            if ((Number(underlying_balance) / asset.underlying_decimals) < 0.01) return;
            const value_native = ((underlying_balance - SAFE_MARGIN) / asset.underlying_decimals);
            handleMultiChange({value_native});
            this.handleInputChange(value_native)
          } else {
            if ((Number(asset_balance) / 1e8) < 0.01) return;
            const value_base = asset_balance / 1e8;
            handleMultiChange({value_base});
            this.handleInputChange(value_base)
          }
        }
    
        if (modal_type === 'redeem') {
          if ((Number(g_balance) / 1e8) < 0.01) return;
          const value_redeem = g_balance / 1e8;
          handleMultiChange({value_redeem});
          this.calculateBurningTotal(value_redeem);
        }
      }

    render() {
        const {
            modal_type, is_native, isLoading,
            value_native, value_base, value_redeem
        } = this.props;
        return (
            <InputRow>
                <AmountInput>
                {modal_type === 'mint' && is_native && (
                    <StyledInput
                        value={value_native}
                        disabled={isLoading}
                        placeholder="0.0"
                        type="number"
                        onClick={e => e.stopPropagation()}
                        onChange={e => {
                            this.handleInputChange(e.target.value)
                        }}
                    />
                )} 
                {modal_type === 'mint' && !is_native && (
                    <StyledInput
                        value={value_base}
                        placeholder="0.0"
                        disabled={isLoading}
                        type="number"
                        onClick={e => e.stopPropagation()}
                        onChange={e => {
                            this.handleInputChange(e.target.value)
                        }}
                    />
                )}
                {modal_type === 'redeem' && (
                    <StyledInput
                        value={value_redeem}
                        placeholder="0.0"
                        disabled={isLoading}
                        type="number"
                        onClick={e => e.stopPropagation()}
                        onChange={e => {
                            this.handleInputChange(e.target.value)
                        }}
                    />
                )} 
                
                </AmountInput>
                <MaxButton
                    modal_type={modal_type}
                    onClick={() => this.setMax()}
                > 
                    MAX
                </MaxButton>
            </InputRow>
        )
    }
}
