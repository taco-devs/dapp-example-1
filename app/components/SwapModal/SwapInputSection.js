import React, { Component } from 'react'
import styled from 'styled-components';
import SwapInputIn from './SwapInputIn';
import SwapInputOut from './SwapInputOut';
import {Icon} from 'react-icons-kit';
import {arrowDown} from 'react-icons-kit/fa/arrowDown';
import BPool from 'contracts/Interop/Bpool.json';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    padding: 0 1.5em 0 1.5em;
    height: 100%;
`

const IconSection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: #161d6b;
    height: 50px;
`

const IconButton = styled.div`
    &:hover {
        cursor: pointer;
        opacity: 0.75;
    }
`

const SlippageSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.85em;
    height: 30px;
    letter-spacing: 1px;
    color: ${props => {
        if (props.slippage < 5) return 'black';
        if (props.slippage >= 5 && props.slippage < 10) return '#ea9010';
        if (props.slippage >= 10 ) return '#ee6055';
    }}
`

export default class SwapInputSection extends Component {

    componentDidMount = () => {
        this.props.hasEnoughAllowance();
        this.getCurrentRate();
    }

    invertAssets = async () => {
        const { assetIn, assetOut, balanceIn, balanceOut, handleMultipleChange, hasEnoughAllowance, updateParent } = this.props;

        await updateParent({
            assetIn: assetOut,
            assetOut: assetIn,
        })

        await handleMultipleChange({
            balanceIn: balanceOut,
            balanceOut: balanceIn, 
            amountInput: "",
            amountOutput: ""
        })
        await this.getCurrentRate();
        await hasEnoughAllowance();
    }

    getSlippage = () => {
        const {spotPrice, amountInput, amountOutput, isLoadingCalc} = this.props;
        const realRate = amountOutput / amountInput;

        if (isLoadingCalc) return '-'
        if (!spotPrice || !amountInput || !amountOutput) return '-';

        let effectiveSlippage = (spotPrice / realRate) - 1;
        return Math.round(effectiveSlippage * 10000) / 100;
    }


    getCurrentRate = async () => {
        const {assetIn, assetOut, web3, liquidity_pool_address, Network, handleMultipleChange} = this.props;
        const BPoolInstance = await new web3.eth.Contract(BPool, liquidity_pool_address);
        
        if (assetIn === 'GRO') {
            const inputAsset = Network.growth_token;
            const outputAsset = Network.available_assets[assetOut];
    
            const spotPrice_rate = await BPoolInstance.methods.getSpotPrice(inputAsset.address, outputAsset.gtoken_address).call();
            const spotPrice = (1 * 1e18) / (spotPrice_rate / 1e18) / 1e8;        
            handleMultipleChange({spotPrice, spotPrice_rate});
        } else {
            const inputAsset = Network.available_assets[assetIn];
            const outputAsset = Network.growth_token;
    
            const spotPrice_rate = await BPoolInstance.methods.getSpotPrice(inputAsset.gtoken_address, outputAsset.address).call();
            
            const spotPrice = 1 / (spotPrice_rate / 1e8);
            
            handleMultipleChange({spotPrice, spotPrice_rate});
        }
    }

    render() {
        const {slippage} = this.props;
        return (
            <Wrapper>
                <SwapInputIn {...this.props}/>
                <IconSection>
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            this.invertAssets();
                        }}
                    >
                        <Icon 
                            icon={arrowDown} 
                            size="1.5em"
                        />
                    </IconButton>
                </IconSection>
                <SwapInputOut {...this.props} />
                <SlippageSection
                    slippage={this.getSlippage()}
                >
                    <p>Pool Slippage: {this.getSlippage()}% + {slippage}%</p>
                </SlippageSection>
            </Wrapper>
        )
    }
}
