import React, { Component } from 'react';
import styled from 'styled-components';
import SwapModal from 'components/SwapModal';
import PoolLogo from './PoolLogo';
import { Icon } from 'react-icons-kit';
import {areaChart} from 'react-icons-kit/fa/areaChart'


const ActionButton = styled.div`
  display: flex; 
  flex-direction: row;
  justify-content: center;
  font-size: 0.85em;

  ${props => {
    if (props.type === 'mint') {
      return `
        background-color: #00d395;
        border-color: #00d395;
        border-width: 3px;
        border-style: solid;
        margin: 0 0.5em  0 0.5em;
        padding: 0.5em 1em 0.5em 1em;
        color: white;
        border-radius: 5px;
        min-width: 100px;
      
        &:hover {
          cursor: pointer;
          background-color: white;
          color: #00d395;
        }
      `
    } 
    if (props.type === 'redeem') {
      return `
        background-color: white;
        border-color: #161d6b;
        border-width: 3px;
        border-style: solid;
        margin: 0 0.5em 0 0.5em ;
        padding: 0.5em 0 0.5em 0;
        color: #161d6b;
        border-radius: 5px;
        min-width: 100px;
      
        &:hover {
          cursor: pointer;
          background-color: #161d6b;
          color: white;
        }
      `
    }
  } 
}
`

const Card = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 5px;
    height: ${props => props.isOpen ? '100%' : '65px'};
    font-size: ${props => props.isMobile ? '0.75em' : '1em'};
    margin: ${props => props.isMobile ? '0.25em 0 0.25em 0' : '0.5em 2em 0.5em 2em'};
    -webkit-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);

    &:hover {
        cursor: pointer;
        -webkit-box-shadow: 0px 0px 5px 5px rgba(0,211,149,0.75);
        -moz-box-shadow: 0px 0px 5px 5px rgba(0,211,149,0.75);
        box-shadow: 0px 0px 5px 5px rgba(0,211,149,0.75);
    }
`

const CardRow = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    height: 100%;
    padding: 0.5em 0 0.5em 0;
`

const CardColumn = styled.div`
    display: flex;
    flex-direction: ${props => props.direction || 'column'};
    flex: ${props => props.flex || '1'};
    justify-content: ${props => props.justify || 'center'};
    align-items: ${props => props.align || 'center'};
    margin: ${props => props.margin || '0'};
`


const PrimaryLabel = styled.p`
    color: #161d6b;
    margin: 0 1em 0 1em;
    text-align: center;
`

const SecondaryLabel = styled.p`
    color: #161d6b;
    opacity: 0.75;
    margin: 0 1em 0 1em;
    text-align: center;
`

const ChartButton = styled.div`
    display: flex;
    flex-direction: row;
    font-size: 0.85em;
    background-color: #21262b;
    border-color: #21262b;
    border-width: 3px;
    border-style: solid;
    margin: 0 0.5em  0 0.5em;
    padding: 0.5em;
    color: white;
    border-radius: 5px;
    min-width: 50px;
    align-items: center;
    justify-content: center;
    height: 40px;

    &:hover {
        cursor: pointer;
        background-color: black;
        opacity: 0.75em;
    }
`



const SwapTitle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
`

export default class SwapCard extends Component {

    state = {
        isMobileDrawerOpen: false,
    }

    getGRORate = (gro) => {
        const {ethPrice, balances} = this.props;
        
        if (!balances) return 0;

        const GROPrice = balances.find(balance => balance.name === 'GRO');

        return ethPrice / GROPrice.price_eth * gro.balance;
    }

    getGTokenRate = (gtoken_pool) => {
        const {prices, tokens} = this.props;
        const {markets} = prices;

        if (!markets || !tokens)  return null;
        
        const symbol = gtoken_pool.symbol.substring(1);
        
        const gToken = tokens.find(token => token.symbol.toUpperCase() === gtoken_pool.symbol.toUpperCase());
        const gToken_market = markets.find(market => market.symbol.toUpperCase() === symbol.toUpperCase());

        const gTokenPrice = gToken.totalReserve / gToken.totalSupply;
        const basePrice = gToken_market.exchangeRate * gToken_market.underlyingPriceUSD;

        return gTokenPrice * basePrice * gtoken_pool.balance;
    }

    // Get Liquidity
    getLiquidity = () => {
        const {asset, pools, prices, ethPrice, balances} = this.props;

        if (!pools || !prices || !balances || !ethPrice) return '-';
        if (pools.length < 1 || prices.length < 1) return '-';

        // Search by id
        const pool = pools.find(pool => pool.id === asset.liquidity_pool_address);
        
        const GROLiquidity = this.getGRORate(pool.tokens[0]);
        const GTokenLiquidty = this.getGTokenRate(pool.tokens[1]);

        const TotalLiquidity = Math.round(GROLiquidity + GTokenLiquidty);

        return `$ ${TotalLiquidity.toLocaleString('en-En')} USD`;
    }
    
    // Get Volume
    getVolume = () => {
        const {asset, pools, prices, ethPrice} = this.props;

        if (!pools || !prices || !ethPrice) return '-';
        if (pools.length < 1 || prices.length < 1) return '-';

        // Search by id
        const pool = pools.find(pool => pool.id === asset.liquidity_pool_address);

        return `$ ${Math.round(pool.totalSwapVolume)} USD`;
    }
    
    // Get Volume
    getFees = () => {
        const {asset, pools, prices, ethPrice} = this.props;

        if (!pools || !prices || !ethPrice) return '-';
        if (pools.length < 1 || prices.length < 1) return '-';

        // Search by id
        const pool = pools.find(pool => pool.id === asset.liquidity_pool_address);

        return `$ ${Math.round(pool.totalSwapVolume)} USD`;
    }

    // Handle Input asset
    handleToggleModal = () => {
        const {asset, toggleModal} = this.props;
        
        // TO CHANGE
        // Set initial asset to GRO
        const assetIn = 'GRO';
        const assetOut = asset.g_asset;
        const {liquidity_pool_address} = asset;

        // Toggle
        toggleModal(assetIn, assetOut, liquidity_pool_address);
    }

    // Format the numbers for K, M, B
    abbreviateNumber = (value) => {
        var newValue = value;
        if (value >= 1000) {
            var suffixes = ["", "K", "M", "B","T"];
            var suffixNum = Math.floor( (""+value).length/3 );
            var shortValue = '';
            for (var precision = 2; precision >= 1; precision--) {
                shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
                var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
                if (dotLessShortValue.length <= 2) { break; }
            }
            if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
            newValue = shortValue+suffixes[suffixNum];
        }
        return newValue;
    }

    render() {
        const {asset, data, isMobile, asset_key, currentOpenExtension, web3} = this.props;
        const {isMobileDrawerOpen} = this.state;
        
        return (
            <React.Fragment>
                {isMobile ? (
                    <div />
                ) : (
                    <Card 
                        isMobile={isMobile}
                        isOpen={false}
                        onClick={(e) => {
                            e.stopPropagation();
                            this.handleToggleExtension(asset_key)
                        }}
                    >
                        <CardRow>
                            <CardColumn
                                direction="row"
                                align="center"
                                justify="flex-start"
                                margin="0 0 0 1em"
                                flex="1.75"
                            >                           
                                      
                                <PoolLogo 
                                    asset={asset}
                                />
                                <SwapTitle>
                                  <PrimaryLabel>GRO {'/'} {asset.g_asset}</PrimaryLabel>  
                                  <SecondaryLabel>Balancer</SecondaryLabel>
                                </SwapTitle>
                                
                            </CardColumn>
                            <CardColumn 
                                direction="column"
                                
                            >
                                <PrimaryLabel>{this.getLiquidity()}</PrimaryLabel>
                                {/*<SecondaryLabel>{this.getSupply()} {asset.g_asset}</SecondaryLabel> */}
                            </CardColumn>
                            <CardColumn 
                                direction="column"
                            >
                                <PrimaryLabel>{this.getVolume()}</PrimaryLabel>
                                {/*<SecondaryLabel>{this.calculate7DAPY()}% 7D</SecondaryLabel> */}
                            </CardColumn>
                            <CardColumn 
                                direction="column"
                            >
                                <PrimaryLabel>{this.getVolume()}</PrimaryLabel>
                                {/*<SecondaryLabel>{this.calculate7DAPY()}% 7D</SecondaryLabel> */}
                            </CardColumn>
                            <CardColumn 
                                direction="row"
                            >
                                <ActionButton
                                    type="mint"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        this.handleToggleModal();
                                    }}
                                    >
                                        SWAP
                                </ActionButton>
                            </CardColumn>
                        </CardRow>
                    </Card>
                )}
            </React.Fragment>
        )
    }
}
