import React, { Component } from 'react';
import styled from 'styled-components';
import BPool from 'contracts/Interop/Bpool.json';
import ApproveSwapContainer from 'components/ApproveSwapContainer';

const PrimaryLabel = styled.b`
  color: #161d6b;
  opacity: 0.75; 
  margin: ${props => props.margin || '0'};
  text-align: ${props => props.align || 'left'};
  letter-spacing: ${props => props.spacing || '0'};
`

const SummarySection = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: #E8E8E8;
    padding: 1.5em;
`

const SummaryRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: ${props => props.flex || '1'};
  align-items: center;
  justify-content: ${props => props.justify || 'space-between'};
`

const SummaryColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${props => props.flex || '1'};
  align-items: ${props => props.align || 'flex-start'};
`

const ActionConfirmButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-radius: 5px;
  background-color: ${props => {
    if (props.disabled) return '#BEBEBE';
    if (props.modal_type === 'mint') return '#00d395';
    if (props.modal_type === 'redeem') return '#161d6b';
  }};
  padding: 1em 1em 1em 1em;
  margin: 1em 0 0 0;
  width: 300px;
  color: white;
  border-width: 3px;
  border-style: solid;
  border-color: ${props => {
    if (props.disabled) return '#BEBEBE';
    if (props.modal_type === 'mint') return '#00d395';
    if (props.modal_type === 'redeem') return '#161d6b';
  }};
  
  &:hover {
    opacity: 0.85;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  }
`

const initialState =  {
    balanceIn: null,
    balanceOut: null,
    amountInput: null,
    amountOutput: null,
    spotPrice: null,
    spotPrice_rate: null,
    hash: null,
    allowance: true,
    status: 'INPUT', //  INPUT -> APPROVE -> LOADING -> [Close the Modal]
    swapType: 'SEND'
  }
  

export default class SwapSummary extends Component {

    state = {
        slippage: 0.1,
    }

    toggleAllowance = () => {
        const {handleMultipleChange} = this.props;
        handleMultipleChange({allowance: true});
    }

    isDisabled = () => {
        const {balanceIn, amountInput} = this.props;
        if (Number(balanceIn) < Number(amountInput)) return true;
        return false;
    }

    getGasInfo = async (method, values, address, web3) => {
        try {
            const SAFE_MULTIPLIER = 1.15;
            const gas = await method(...values).estimateGas({from: address});
            const gasPrice = await web3.eth.getGasPrice();
            
            return {gas, gasPrice};
        } catch(e) {
            console.log(e);
            return {
                gas: null, 
                gasPrice: null
            }
        }
    }

    getWei = (value_number, decimals) => {
        const {web3} = this.props;
        if (decimals === 1e18) {
          const value = value_number.toString();
          return web3.utils.toWei(value);
        }
        if (decimals === 1e8) {
          // Horrible hack to avoid precision error on js
          const raw_value = (Math.round(value_number * 10) / 100).toString()
          return web3.utils.toWei(raw_value, 'gwei');
        }
        if (decimals === 1e6) {
          const value = value_number.toString();
          return web3.utils.toWei(value, 'mwei');
        }
    }

    handleSwapExactIn = async (BPoolInstance, args, address) => {

        const {web3, handleMultipleChange} = this.props;
        
        // Get Gas info
        const {gas, gasPrice} = await this.getGasInfo(
            BPoolInstance.methods.swapExactAmountIn,
            args,
            address,
            web3,
        )

    
        await BPoolInstance.methods.swapExactAmountIn(...args)
            .send({from: address, gas, gasPrice: gasPrice * 2})
            .on("transactionHash", (hash) => {
                handleMultipleChange({status: 'LOADING', hash});
            })
            .on("receipt",  (tx) => {
                handleMultipleChange({...initialState});
                this.props.toggleModal(null, null, null);
            })
            .on("confirmation", (confirmation) => {
              
            })
            .on("error", () => {
              handleMultipleChange({status: 'INPUT'});
            });;
    }


    handleSwapExactOut = async (BPoolInstance, args, address) => {

        const {web3, handleMultipleChange} = this.props;

        // Get Gas info
        const {gas, gasPrice} = await this.getGasInfo(
            BPoolInstance.methods.swapExactAmountOut,
            args,
            address,
            web3,
        )

    
        await BPoolInstance.methods.swapExactAmountOut(...args)
            .send({from: address, gas, gasPrice: gasPrice * 2})
            .on("transactionHash", (hash) => {
                handleMultipleChange({status: 'LOADING', hash});
            })
            .on("receipt",  (tx) => {
                // Send the confirmation receipt
                handleMultipleChange({...initialState});
                this.props.toggleModal(null, null, null);
            })
            .on("confirmation", (confirmation) => {
              
            })
            .on("error", () => {
              handleMultipleChange({status: 'INPUT'});
            });
    }

    // Refactor to support different trade states
    swap = async () => {
        const {amountInput, amountOutput, assetIn, assetOut, Network, asset, address, liquidity_pool_address, web3, spotPrice_rate, swapType, handleMultipleChange} = this.props;

        const SLIPPAGE = 0.1;
        const BPoolInstance = await new web3.eth.Contract(BPool, liquidity_pool_address);

        handleMultipleChange({status: 'APPROVE'});

        if (assetIn === 'GRO') {
            const _currentAssetIn = Network.growth_token;
            const _currentAssetOut = Network.available_assets[assetOut];

            // Handle SEND

            if (swapType === 'SEND') {

                // Parse Numbers
                const tokenAmountIn = this.getWei(amountInput, 1e18);
                const minAmountOut = this.getWei(amountOutput * (1 - SLIPPAGE),  1e8);
                const maxPrice = this.getWei(spotPrice_rate / 1e18 * 1.1, 1e18);
                
                await this.handleSwapExactIn(
                    BPoolInstance,
                    [
                        _currentAssetIn.address, // tokenIn
                        tokenAmountIn,
                        _currentAssetOut.gtoken_address, // tokenOut
                        minAmountOut,
                        maxPrice
                    ],
                    address
                )

            } else {
                
                const tokenAmountOut = this.getWei(amountOutput, 1e8);
                const maxAmountIn = this.getWei(amountInput * (1 + SLIPPAGE), 1e18);
                const maxPrice = this.getWei(spotPrice_rate / 1e18 * (1 + SLIPPAGE), 1e18);

                await this.handleSwapExactOut(
                    BPoolInstance,
                    [
                        _currentAssetIn.address, // tokenIn
                        maxAmountIn,
                        _currentAssetOut.gtoken_address, // tokenOut
                        tokenAmountOut,
                        maxPrice
                    ],
                    address
                )
                
            }
            

        } else {
            // Handle gToken to GRO 
            const _currentAssetOut = Network.growth_token;
            const _currentAssetIn = Network.available_assets[assetIn];
    
            if (swapType === 'SEND') { 

                // Parse Numbers
                const tokenAmountIn = this.getWei(amountInput, 1e8);
                const minAmountOut = this.getWei(amountOutput * (1 - SLIPPAGE),  1e18);
                const maxPrice = this.getWei(spotPrice_rate / 1e8 * 1.1, 1e8);

                await this.handleSwapExactIn(
                    BPoolInstance,
                    [
                        _currentAssetIn.gtoken_address, // tokenIn
                        tokenAmountIn,
                        _currentAssetOut.address, // tokenOut
                        minAmountOut,
                        maxPrice
                    ],
                    address
                )

            } else {

                const tokenAmountOut = this.getWei(amountOutput, 1e18);
                const maxAmountIn = this.getWei(amountInput * (1 + SLIPPAGE), 1e8);
                const maxPrice = this.getWei(spotPrice_rate / 1e8 * (1 + SLIPPAGE), 1e8);

                await this.handleSwapExactOut(
                    BPoolInstance,
                    [
                        _currentAssetIn.gtoken_address, // tokenIn
                        maxAmountIn,
                        _currentAssetOut.address, // tokenOut
                        tokenAmountOut,
                        maxPrice
                    ],
                    address
                )

            }
        } 
    }

    getExchangeAmount = () => {
        const { slippage } = this.state;
        const { swapType, amountOutput, amountInput, assetIn, assetOut } = this.props;


        if (swapType === 'SEND') {

            if (!amountInput) return '-';

            return Math.round(amountOutput * (1 - slippage) * 1000) / 1000;
        }

        if (swapType === 'RECEIVE') {
            if (!amountOutput) return '-';
            return Math.round(amountInput * (1 + slippage) * 1000) / 1000;
        }
    }

    getExchangeRate = (reverse) => {
        const {assetIn, assetOut, spotPrice} = this.props;

        if (!spotPrice) return '-';

        if (reverse) {
            return '-';
        } else {
            if (assetIn === 'GRO') {
                return `1 ${assetIn} = ${Math.round(spotPrice * 100) / 100} ${assetOut}`;
            } else {
                return `1 ${assetIn} = ${Math.round(spotPrice * 100000) / 100000} ${assetOut}`;
            }
        }
    }

    render() {

        const {allowance, swapType, assetIn, assetOut, status} = this.props;
        return (
            <SummarySection>
                <SummaryRow>
                    <SummaryColumn>
                        <PrimaryLabel>SLIPPAGE TOLERANCE</PrimaryLabel>
                    </SummaryColumn>
                    <SummaryColumn align="flex-end">
                        <PrimaryLabel>10%</PrimaryLabel>
                    </SummaryColumn>
                </SummaryRow>
                <SummaryRow>
                    <SummaryColumn>
                        <PrimaryLabel>EXCHANGE RATE</PrimaryLabel>
                    </SummaryColumn>
                    <SummaryColumn align="flex-end">
                        <PrimaryLabel>{this.getExchangeRate()}</PrimaryLabel>
                    </SummaryColumn>
                </SummaryRow>
                <SummaryRow>
                    <SummaryColumn>
                        <PrimaryLabel>{swapType === 'SEND' ? 'MIN RECEIVED' : 'MAX SENT'}</PrimaryLabel>
                    </SummaryColumn>
                    <SummaryColumn align="flex-end">
                        <PrimaryLabel spacing="1.5px">{this.getExchangeAmount()} {swapType === 'SEND' ? assetOut : assetIn}</PrimaryLabel>
                    </SummaryColumn>
                </SummaryRow>
                <SummaryRow>
                    <SummaryColumn align="center">
                        {allowance ? (
                            <ActionConfirmButton
                                modal_type="mint"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (status === 'INPUT') {
                                        this.swap();
                                    } 
                                }}
                                disabled={status !== 'INPUT' || this.isDisabled()}
                            >
                                {status === 'INPUT' ? this.isDisabled() ? 'NOT ENOUGH BALANCE' : 'CONFIRM SWAP' : 'WAITING FOR CONFIRMATION'}
                            </ActionConfirmButton>
                            ) : (
                                <ApproveSwapContainer 
                                    {...this.props}
                                    {...this.state}
                                    toggleAllowance={this.toggleAllowance}
                                />
                        )}
                    </SummaryColumn>
                </SummaryRow>
            </SummarySection>
        )
    }
}
