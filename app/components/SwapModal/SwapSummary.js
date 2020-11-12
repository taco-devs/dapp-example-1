import React, { Component } from 'react';
import styled from 'styled-components';
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
        allowance: false,
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
        return false;
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
                                onClick={() => this.handleDeposit()}
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
