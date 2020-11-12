import React, { Component } from 'react';
import styled from 'styled-components';
import BPool from 'contracts/Interop/Bpool.json';
import ApproveSwapContainer from 'components/ApproveSwapContainer';

const PrimaryLabel = styled.b`
  color: #161d6b;
  opacity: 0.75; 
  margin: ${props => props.margin || '0'};
  text-align: ${props => props.align || 'left'};
  letter-spacing: ${props => props.spacing || '0'};∫
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

export default class SwapSummary extends Component {

    state = {
        allowance: true,
    }

    componentDidMount = () => {
        this.hasEnoughAllowance();
    }

    hasEnoughAllowance = async () => {
        const {assetIn, Network, asset, address, liquidity_pool_address, web3} = this.props;
        
        // Check if its trying to change GRO
        if (assetIn === 'GRO') {
            const asset = Network.growth_token;
            const GContractInstance = await new web3.eth.Contract(asset.abi, asset.address);
            const allowance = await GContractInstance.methods.allowance(address, liquidity_pool_address).call();
            this.setState({
                allowance: allowance > 0,
            })
        }
    }

    toggleAllowance = () => {
        this.setState({allowance: true});
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

    // Refactor to support different trade states
    swap = async () => {
        const {amountInput, amountOutput, assetOut, Network, asset, address, liquidity_pool_address, web3, spotPrice_rate} = this.props;

        const SLIPPAGE = 0.1;

        const _currentAssetIn = Network.growth_token;
        const _currentAssetOut = Network.available_assets[assetOut];
 
        const BPoolInstance = await new web3.eth.Contract(BPool, liquidity_pool_address);

        // Parse Numbers
        const tokenAmountIn = this.getWei(amountInput, 1e18);
        const minAmountOut = this.getWei(amountOutput * (1 - SLIPPAGE),  1e8);
        const maxPrice = this.getWei(spotPrice_rate / 1e18 * 1.1, 1e18);

        // Get Gas info
        const {gas, gasPrice} = await this.getGasInfo(
                BPoolInstance.methods.swapExactAmountIn,
                [
                    _currentAssetIn.address, // tokenIn
                    tokenAmountIn,
                    _currentAssetOut.gtoken_address, // tokenOut
                    minAmountOut,
                    maxPrice
                ],
                address,
                web3,
            )

        
        await BPoolInstance.methods.swapExactAmountIn(
            _currentAssetIn.address, // tokenIn
            tokenAmountIn,
            _currentAssetOut.gtoken_address, // tokenOut
            minAmountOut,
            maxPrice
        )
        .send({from: address, gas, gasPrice: gasPrice * 2});
    }

    render() {
        const {assetIn, assetOut, spotPrice} = this.props;
        const {allowance} = this.state;
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
                        <PrimaryLabel>1 {assetIn} = {Math.round(spotPrice * 100) / 100} {assetOut}</PrimaryLabel>
                    </SummaryColumn>
                </SummaryRow>
                <SummaryRow>
                    <SummaryColumn align="center">
                        {allowance ? (
                            <ActionConfirmButton
                                modal_type="mint"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    this.swap();
                                }}
                                disabled={this.isDisabled()}
                            >
                                {this.isDisabled() ? 'NOT ENOUGH BALANCE' : 'CONFIRM SWAP'}
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
