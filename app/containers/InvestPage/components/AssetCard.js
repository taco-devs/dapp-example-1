import React, { Component } from 'react';
import styled from 'styled-components';
import ActionModal from 'components/ActionModal';
import ActionDrawer from 'components/ActionDrawer';
import AssetExtension from './AssetExtension';
import { Icon } from 'react-icons-kit';
import {areaChart} from 'react-icons-kit/fa/areaChart'
import types from 'contracts/token_types.json';

const Card = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${props => props.type ===  types.STKGRO ? '#21262b' : 'white'};
    border-radius: 5px;
    height: ${props => props.isOpen ? '100%' : '65px'};
    font-size: ${props => props.isMobile ? '0.75em' : '1em'};
    margin: ${props => props.isMobile ? '0.25em 0 0.25em 0' : '0.5em 2em 0.5em 2em'};
    -webkit-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);

    &:hover {
        cursor: pointer;
        -webkit-box-shadow: 0px 0px 5px 5px ${props => props.type ===  types.STKGRO ? 'rgb(238,232,170)' : 'rgba(0,211,149,0.75)'};
        -moz-box-shadow: 0px 0px 5px 5px ${props => props.type ===  types.STKGRO ? 'rgb(238,232,170)' : 'rgba(0,211,149,0.75)'};
        box-shadow: 0px 0px 5px 5px ${props => props.type ===  types.STKGRO ? 'rgb(238,232,170)' : 'rgba(0,211,149,0.75)'};
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
    width: 100%;
    ${props => props.isMobile && 'min-width: 300px;'}
`

const AssetLogo = styled.img`
    width: ${props => props.isMobile ? '40px' : '50px'};
    height: auto;
    ${props => props.disabled && (
        `
        -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
        filter: grayscale(100%);
        `
    )}
`

const PrimaryLabel = styled.p`
    color: ${props => props.type ===  types.STKGRO ? 'white' : '#161d6b'};
    margin: 0 1em 0 1em;
    text-align: center;
    ${props => props.size && `font-size: ${props.size}`}
    ${props => props.spacing && `letter-spacing: ${props.spacing};`}
`

const SecondaryLabel = styled.p`
    color: ${props => props.type ===  types.STKGRO ? 'white' : '#161d6b'};
    opacity: 0.75;
    margin: 0 1em 0 1em;
    text-align: center;
    font-size: 0.85em;
    ${props => props.spacing && `letter-spacing: ${props.spacing};`}
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

const LabelContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

export default class AssetCard extends Component {

    state = {
        isMobileDrawerOpen: false,
    }

    // Open / Close mobile drawer on mobile
    toggleMobileDrawer = () => {
        this.setState({isMobileDrawerOpen: !this.state.isMobileDrawerOpen});
    }

    // Open / Close asset stats page
    handleToggleExtension = () => {
        const {toggleExtension, asset, asset_key} = this.props;
        toggleExtension(asset, asset_key);
    }

    getToken = (asset) => {
        const {tokens} = this.props;

        if (!tokens) return;

        let token;

        // Try to find by name
        token = tokens.find(token =>  token.name === asset.contract_name);

        // If not default to gtoken name
        if (!token) {
            token = tokens.find(token => token.symbol.toUpperCase() === asset.g_asset.toUpperCase());
        }

        return token;
    } 

    // Get the market size for this asset
    getMarketSize = () => {
        const {asset, tokens, prices, asset_key, relevantPrices, ethPrice} = this.props;

        if (!prices || !tokens) return '-';

        const token = this.getToken(asset);

        if (!token) return '-';

        // Check for PMT
        if (asset.type === types.PMT) {
            if (!relevantPrices || !ethPrice) return `$${Math.round(token.cumulativeTotalValueLockedUSD).toLocaleString('en-En')}`;
            const assetPrice = relevantPrices.pairs.find(pair => pair.token0.symbol.toUpperCase() === asset.native.toUpperCase());
            const price = ethPrice * assetPrice.token1Price;
            return `$${Math.round((token.totalReserve / token.totalSupply) * (token.totalSupply / asset.base_decimals) * price).toLocaleString('en-En')}`; 
        }

        if (asset.type === types.GETH) {
            if (!ethPrice) return `$${Math.round(token.cumulativeTotalValueLockedUSD).toLocaleString('en-En')}`;
            return `$${Math.round((token.totalReserve / token.totalSupply) * (token.totalSupply / asset.base_decimals) * ethPrice).toLocaleString('en-En')}`;  
        }

        // Check for stkGRO
        if (asset.type === types.STKGRO) {
            if (!relevantPrices || !ethPrice) return `$${Math.round(token.cumulativeTotalValueLockedUSD).toLocaleString('en-En')}`;
            const GRO = relevantPrices.pairs.find(price => price.token0.symbol === 'GRO');
            const groPrice = ethPrice * GRO.token1Price;
            return `$${Math.round((token.totalReserve / token.totalSupply) * (token.totalSupply / asset.base_decimals) * groPrice).toLocaleString('en-En')}`; 
        };

        // Check for type 1
        if (asset.type === types.TYPE1 || asset.type === types.TYPE_ETH) {

            const asset_data = prices.markets && prices.markets.find(market => market.id === asset.compound_id);


            if (!asset_data) return '-';
            const reservePrice = Number(asset_data.exchangeRate) * Number(asset_data.underlyingPriceUSD);
            const market_cap = (Number(token.totalReserve) / asset.base_decimals) * reservePrice;

            if (!market_cap || market_cap <= 1) return 'N/A'

            return `$${Math.round(market_cap).toLocaleString('en-En')}`;
        }

        return '-'
    }

    // Get the total supply for an asset
    getSupply = (abbreviate) => {
        const {tokens, asset, asset_key} = this.props;
        if (!tokens) return '-'
        
        const token = this.getToken(asset);

        if (!token) return '-';

        if (abbreviate) {
            return this.abbreviateNumber(Math.round(token.totalSupply / asset.base_decimals));
        } else {
            const supply = token.totalSupply / asset.base_decimals;

            if (supply < 1000) {
                return Math.round(supply * 1e4) / 1e4;
            } else {
                return Math.round(token.totalSupply / asset.base_decimals).toLocaleString('en-En');
            }
            
        }
        
    }

    // Get the weighted APY 
    calculateAvgAPY = () => {
        const {tokens, asset, asset_key} = this.props;
        if (!tokens) return '-'
        
        const token = this.getToken(asset);

        if (!token) return '-';

        // Calculate the delta from listing date to today
        const SECONDS_IN_DAY = 86400;
        let TODAY = new Date();
        TODAY = new Date(TODAY.getTime() + TODAY.getTimezoneOffset() * 60000);
        TODAY.setHours(0,0,0,0);
        const TODAY_DATE = Math.round(TODAY.getTime() / 1000);
        
        let FIRST_DAY = new Date(token.listingDate * 1000);
        FIRST_DAY.setHours(0,0,0,0);
        const FIRST_DATE = Math.round(FIRST_DAY.getTime() / 1000);

        const dayDelta = (TODAY_DATE - FIRST_DATE) / SECONDS_IN_DAY;

        const mathFactor = Math.pow(token.lastAvgPrice, 1 / (dayDelta));
        const apy = (mathFactor - 1) * 365 * 100;

        if (dayDelta < 7 && apy < 0) return '-';

        // const increase = (token.cumulativeDailyChange / (dayDelta)) * 100 * 365;
        return `${Math.round(apy * 100) / 100} % AVG`;
    } 

    // Get the 7 day % increase
    calculate1MonthAPY = () => {
        const {tokens, asset, asset_key} = this.props;
        if (!tokens) return '-'
        
        const token = this.getToken(asset);

        if (!token) return '-';

        let last30daysTDD = token.tokenDailyDatas && token.tokenDailyDatas.length > 0 && token.tokenDailyDatas[0];

        if (last30daysTDD) {
            const priceDelta = 1 + ( token.lastAvgPrice - last30daysTDD.avgPrice );
            
            const mathFactor = Math.pow(priceDelta, 1 / 30);
            const apy = (mathFactor - 1) * 365 * 100;

            return `${Math.round(apy * 100) / 100} %  30D AVG`;
        } else {
            return 'Fluid APY'
        }
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

    getSize = (asset) => {
        if (asset.mobile_card_name && asset.mobile_card_name.length > 6 ) return '0.85em';
        if (asset.g_asset && asset.g_asset.length > 6) return '0.85em';
        return '1em';
    }


    render() {
        const {asset, data, isMobile, asset_key, currentOpenExtension, web3} = this.props;
        const {isMobileDrawerOpen} = this.state;
        const size = this.getSize(asset);
        return (
            <React.Fragment>
                {isMobile ? (
                    <ActionDrawer
                        {...this.props}
                        type="mint"
                        text="MINT"
                        data={data}
                        asset={asset}
                        toggleMobileDrawer={this.toggleMobileDrawer}
                        isMobileDrawerOpen={isMobileDrawerOpen}
                    >
                        <Card 
                            isMobile={isMobile}
                            onClick={() => {
                                if (!web3) return alert('Please connect your wallet to interact with this asset');
                                this.toggleMobileDrawer();
                            }}
                            type={asset.type}
                        >
                            <CardRow>
                                <CardColumn
                                    direction="row"
                                    align="center"
                                    justify="flex-start"
                                    margin="0 0 0 5px"
                                    flex="1.2"
                                >
                                    {asset.gtoken_img_url && (
                                        <AssetLogo disabled={asset.disabled} src={require(`images/tokens/${asset.gtoken_img_url}`)} isMobile={isMobile} />
                                    )}
                                    <CardColumn align="flex-start">
                                        <PrimaryLabel 
                                            type={asset.type}
                                            size={size}
                                        >
                                            {asset.mobile_card_name || asset.g_asset}
                                        </PrimaryLabel>
                                        <SecondaryLabel type={asset.type}>{asset.label}</SecondaryLabel>
                                    </CardColumn>
                                    
                                </CardColumn>
                                <CardColumn 
                                    direction="column"
                                    flex="1.1"
                                >
                                    <PrimaryLabel spacing="1px" type={asset.type}>{this.getMarketSize()}</PrimaryLabel>
                                    <SecondaryLabel spacing="1px" type={asset.type}>{this.getSupply(true)} {asset.g_asset}</SecondaryLabel>
                                </CardColumn>
                                <CardColumn 
                                    direction="column"
                                    flex="1.2"
                                >
                                <PrimaryLabel type={asset.type}>{this.calculateAvgAPY()}</PrimaryLabel>
                                <SecondaryLabel type={asset.type}>{this.calculate1MonthAPY()}</SecondaryLabel>
                                </CardColumn>
                            </CardRow>
                            
                        </Card>
                    </ActionDrawer>
                ) : (
                    <Card 
                        isMobile={isMobile}
                        isOpen={currentOpenExtension === asset_key}
                        onClick={(e) => {
                            e.stopPropagation()
                            this.handleToggleExtension()
                        }}
                        type={asset.type}
                    >
                        <CardRow>
                            <CardColumn
                                direction="row"
                                align="center"
                                justify="flex-start"
                                margin="0 0 0 1em"
                                flex="1"
                            >                           
                                      
                                {asset.gtoken_img_url && (
                                    <AssetLogo disabled={asset.disabled} src={require(`images/tokens/${asset.gtoken_img_url}`)} isMobile={isMobile} />
                                )}
                                <LabelContainer>
                                    <PrimaryLabel type={asset.type}>{asset.card_name || `${asset.g_asset} ${!isMobile && '/'} ${asset.base_asset}`}</PrimaryLabel>
                                    {asset.label && <SecondaryLabel>{asset.label}</SecondaryLabel>}
                                </LabelContainer>
                                
                            </CardColumn>
                            <CardColumn 
                                direction="column"
                            >
                                <PrimaryLabel spacing="1.5px" type={asset.type}>{this.getMarketSize()}</PrimaryLabel>
                                <SecondaryLabel spacing="1px" type={asset.type}>{this.getSupply()} {asset.g_asset}</SecondaryLabel>
                            </CardColumn>
                            <CardColumn 
                                direction="column"
                            >
                                <PrimaryLabel spacing="1px" type={asset.type}>{this.calculateAvgAPY()}</PrimaryLabel>
                                <SecondaryLabel spacing="1px" type={asset.type}>{this.calculate1MonthAPY()}</SecondaryLabel>
                            </CardColumn>
                            <CardColumn 
                                direction="row"
                                justify="flex-end"
                                style={{minWidth: 300}}
                            >
                                {!asset.disabled && (
                                    <ActionModal 
                                        {...this.props}
                                        type="mint"
                                        text={asset.type === types.STKGRO ? "STAKE" : "MINT"}
                                        data={data}
                                        asset={asset}
                                    />
                                )}
                                <ActionModal 
                                    {...this.props}
                                    type="redeem"
                                    text={asset.type === types.STKGRO ? "UNSTAKE" : "REDEEM"}
                                    data={data}
                                    asset={asset}
                                />
                                <ChartButton
                                    asset={asset}
                                >
                                    <Icon 
                                        icon={areaChart} 
                                        style={{
                                            color: asset.type === types.STKGRO ? '#ffe391' : '#00d395', 
                                            margin: '-5px 0 0 0'
                                        }} 
                                        size="1.5em"
                                    />
                                </ChartButton>  
                            </CardColumn>
                        </CardRow>
                        {currentOpenExtension === asset_key && ( 
                            <CardRow>
                                <AssetExtension 
                                    {...this.props}
                                    {...this.state}
                                    asset={asset}
                                    getToken={this.getToken}
                                />
                            </CardRow>
                        )}
                    </Card>
                )}
            </React.Fragment>
        )
    }
}
