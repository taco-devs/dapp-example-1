import React, { Component } from 'react';
import styled from 'styled-components';
import debounce from 'lodash.debounce';
import types from 'contracts/token_types.json';
import { numberToBN, BNtoNumber } from 'utils/utilities';

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
    if (props.asset.type === types.STKGRO) return '#ffe391';
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
            const netShares = numberToBN(value, asset.underlying_decimals);
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
            const _cost = numberToBN(value, asset.base_decimals)
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
    
        const netShares = numberToBN(value, asset.base_decimals);
      
        const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
        const result = await GContractInstance.methods.calcWithdrawalCostFromShares(netShares, total_reserve, total_supply, withdrawal_fee).call();
        const {_cost, _feeShares} = result;

        let rate;
        if (asset.type === types.TYPE1 || asset.type === types.TYPE_ETH) {
          rate = await GContractInstance.methods.calcUnderlyingCostFromCost(result._cost, exchange_rate).call();
        }

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
            modal_type, is_native, 
            getWei,
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

    setMax = async () => {
        const { 
            handleMultiChange, getWei,
            asset,
            modal_type, is_native, underlying_balance, asset_balance, g_balance, web3,
         } = this.props;
        
        if (modal_type === 'mint') {
          if (is_native) {
            let balance = asset.type === types.TYPE_ETH ? underlying_balance - (0.05 * 1e18) : underlying_balance;
            if ((Number(balance) / asset.underlying_decimals) < 0.01) return;
            const value_native = BNtoNumber(balance, asset.underlying_decimals);
            handleMultiChange({value_native, isMintUnderlyingMax: true});
            this.handleInputChange(value_native)
          } else {
            // If GETH remove 0.05 safe margin for gas
            let balance = asset.type === types.GETH ? asset_balance - (0.05 * 1e18) : asset_balance;
            const min_decimals = asset.ui_decimals ? 0.0001 : 0.01;
            const has_low_amount = (Number(balance) / asset.base_decimals) < min_decimals;
            if (has_low_amount) return;
            const value_base = BNtoNumber(balance ,asset.base_decimals);
            
            handleMultiChange({value_base, isMintMax: true});
            this.handleInputChange(value_base)
          }
        }
    
        if (modal_type === 'redeem') {
          if ((Number(g_balance) / asset.base_decimals) < 0.00001) return;

          let value_redeem;
          if (asset.base_decimals === 1e18) {
            value_redeem = BNtoNumber(g_balance, asset.base_decimals);
          } else {
            value_redeem = BNtoNumber(g_balance, asset.base_decimals);
          }
          
          handleMultiChange({value_redeem, isRedeemMax: true});
          this.calculateBurningTotal(value_redeem);
        }
      }

    render() {
        const {
            asset,
            modal_type, is_native, isLoading,
            value_native, value_base, value_redeem,
            handleMultiChange,
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
                            handleMultiChange({isMintUnderlyingMax: false});
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
                          handleMultiChange({isMintMax: false});
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
                            handleMultiChange({isRedeemMax: false});
                            this.handleInputChange(e.target.value)
                        }}
                    />
                )} 
                
                </AmountInput>
                <MaxButton
                    asset={asset}
                    modal_type={modal_type}
                    onClick={() => {
                      this.setMax();
                    }}
                > 
                    MAX
                </MaxButton>
            </InputRow>
        )
    }
}
