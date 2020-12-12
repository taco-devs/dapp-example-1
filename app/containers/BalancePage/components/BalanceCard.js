import React, { Component } from 'react';
import styled from 'styled-components';
import ActionModal from 'components/ActionModal';
import ActionDrawer from 'components/ActionDrawer';
import types from 'contracts/token_types.json';
// import AssetExtension from './AssetExtension';

const Card = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 5px;
    height: ${props => (props.isOpen || props.isMobile )? '100%' : '65px'};
    font-size: ${props => props.isMobile ? '0.85em' : '1em'};
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

const AssetLogo = styled.img`
    width: ${props => props.isMobile ? '25px' : '40px'};
    height: auto;
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

export default class BalanceCard extends Component {

    state = {
        isMobileDrawerOpen: false,
    }

    toggleMobileDrawer = () => {
        this.setState({isMobileDrawerOpen: !this.state.isMobileDrawerOpen});
    }

    handleToggleExtension = (asset_key) => {
        const {toggleExtension} = this.props;
        toggleExtension(asset_key);
    }

    parseNumber = (number, decimals) => {
        const float_number = number / decimals;
        if (float_number < 1000) {
            return Math.round(float_number * 1e6) / 1e6;
        }
        return (Math.round(float_number * 1e6) / 1e6).toLocaleString('en-En');
    }

    gTokenToBase = (asset) => {
        if (asset.liquidation_price) {
            return Math.round(asset.liquidation_price._cost / Number(asset.balance) * 1000) / 1000;
        } else {
            return '-';
        }
    }

    gTokenToUsd = (asset) => {
        const {eth_price} = this.props;
        if (asset.liquidation_price) {
            const base_conversion = this.gTokenToBase(asset);
            const usd_to_token = eth_price / asset.base_price_eth;
            const gcMarketPrice = Math.round(usd_to_token * base_conversion * 1000) / 1000;
            return gcMarketPrice;
        } else {
            return '-';
        }
    }

    getGroPrice = () => {
        const {balances, eth_price} = this.props;
        if (!balances || !eth_price) return 0;
        const GRO = balances.find((balance) => balance.name === 'GRO');
        return (Math.round((eth_price/ GRO.price_eth) * 100) / 100).toLocaleString('En-en');
    }

    stkGROPrice = () => {
        const {asset} = this.props;

        let price = asset.total_reserve / asset.total_supply;
        let groPrice = this.getGroPrice();
        return Math.round(price * groPrice * 100) / 100; 
    }

    getPercentage = () => {

        const { balances, eth_price, asset, addGRO } = this.props;

        if (!balances) return '-';
        if (balances.length < 1) return;

        const blacklisted_balance = [
            'GRO'
        ]

        let gToken_balances;

        if (!addGRO) {
            gToken_balances = 
                balances
                .filter(balance => blacklisted_balance.indexOf(balance.name) < 0);

            if (gToken_balances.length < 1) return '-'; 
        }
       
        let std_balances = addGRO ? balances : gToken_balances;
        

        const portfolio_value = 
            std_balances
                .reduce((acc, curr) => {
                    // If not available balance
                    if (Number(curr.balance) <= 0 ) return acc; 
                    if (curr.name === 'GRO') {
                        return acc + Number(curr.balance / 1e18) / Number(curr.price_eth) * eth_price; 
                    } 
                    // Balances
                    if (curr.balance > 0 && curr.base_price_usd) {
                        return acc + Number(curr.web3_balance / asset.decimals * curr.base_price_usd);
                    }
                    return acc;
                }, 0);            

        const allocPercentage = Number(asset.web3_balance / asset.decimals * asset.base_price_usd) / portfolio_value * 100;
        
                
        return Math.round(allocPercentage * 100) / 100;
    }

    render() {
        const {asset, data, isMobile, asset_key, currentOpenExtension, hideBalances} = this.props;
        /* const {isMobileDrawerOpen} = this.state; */
        return (
            <React.Fragment>
                {isMobile ? (
                    <Card 
                        isMobile={isMobile}
                        isOpen={currentOpenExtension === asset_key}
                    >
                        <CardRow>
                            <CardColumn
                                direction="row"
                                align="center"
                                justify="flex-start"
                                margin="0 0 0 1em"
                            >
                                <AssetLogo src={require(`images/tokens/${asset.gtoken_img_url}`)} isMobile={isMobile} />
                                <PrimaryLabel>{asset.g_asset}</PrimaryLabel>
                            </CardColumn>
                            <CardColumn flex="1" align="flex-start">
                                {asset.balance && (
                                    <React.Fragment>
                                        <SecondaryLabel>
                                            {hideBalances ? 'PERCENTAGE' : 'HOLDINGS'}
                                        </SecondaryLabel>
                                        <PrimaryLabel>
                                            {hideBalances ? `${this.getPercentage()} %` : this.parseNumber(asset.web3_balance, asset.base_decimals)}
                                        </PrimaryLabel>
                                    </React.Fragment>
                                    
                                )}
                                
                                
                            </CardColumn>
                        </CardRow>
                        <CardRow>
                            <CardColumn align="flex-start" flex="1">
                                <PrimaryLabel>
                                    {asset.type === types.STKGRO ? (
                                        `$${this.stkGROPrice()} USD`
                                    ) : (
                                        `$${Math.round(asset.base_price_usd * 100000) / 100000} USD`
                                    )}
                                    
                                </PrimaryLabel>
                                <SecondaryLabel>{Math.round(asset.total_reserve / asset.total_supply * 10000) / 10000} {asset.base_asset}</SecondaryLabel>
                            </CardColumn>
                            <CardColumn flex="1" align="flex-start">
                                <SecondaryLabel>VALUE</SecondaryLabel>
                                {hideBalances ? (
                                    <PrimaryLabel>***** USD</PrimaryLabel>
                                ) : (
                                    <PrimaryLabel>{asset.type === types.STKGRO ? (
                                        `$${(Math.round(this.parseNumber(asset.web3_balance, asset.base_decimals) * this.stkGROPrice() * 100) / 100).toLocaleString('En-en')} USD`
                                    ) : (
                                        `$${(Math.round(this.parseNumber(asset.web3_balance, asset.base_decimals) * asset.base_price_usd * 100) / 100).toLocaleString('En-en')} USD`
                                    )}</PrimaryLabel>
                                )}
                            </CardColumn>
                        </CardRow>
                    </Card>
                ) : (
                    <Card 
                        isMobile={isMobile}
                        isOpen={currentOpenExtension === asset_key}
                    >
                        <CardRow>
                            <CardColumn
                                direction="row"
                                align="center"
                                justify="flex-start"
                                margin="0 0 0 1em"
                            >
                                <AssetLogo src={require(`images/tokens/${asset.gtoken_img_url}`)} isMobile={isMobile} />
                                <PrimaryLabel>{asset.g_asset}</PrimaryLabel>
                            </CardColumn>
                            <CardColumn>
                                {asset.balance && (
                                    <PrimaryLabel>
                                        {hideBalances ? `${this.getPercentage()} %` : this.parseNumber(asset.web3_balance, asset.base_decimals)}
                                    </PrimaryLabel>
                                )}
                                
                            </CardColumn>
                            <CardColumn>
                                <PrimaryLabel>
                                    {asset.type === types.STKGRO ? (
                                        `$${this.stkGROPrice()} USD`
                                    ) : (
                                        `$${Math.round(asset.base_price_usd * 100) / 100} USD`
                                    )}
                                    
                                </PrimaryLabel>
                                <SecondaryLabel>{Math.round(asset.total_reserve / asset.total_supply * 10000) / 10000} {asset.base_asset}</SecondaryLabel>
                            </CardColumn>
                            <CardColumn>
                                {hideBalances ? (
                                    <PrimaryLabel>***** USD</PrimaryLabel>
                                ) : (
                                    <PrimaryLabel>{asset.type === types.STKGRO ? (
                                        `$${(Math.round(this.parseNumber(asset.web3_balance, asset.base_decimals) * this.stkGROPrice() * 100) / 100).toLocaleString('En-en')} USD`
                                    ) : (
                                        `$${(Math.round(this.parseNumber(asset.web3_balance, asset.base_decimals) * asset.base_price_usd * 100) / 100).toLocaleString('En-en')} USD`
                                    )}</PrimaryLabel>
                                )}
                            </CardColumn>
                            <CardColumn 
                                direction="row"
                            >
                                <ActionModal 
                                    {...this.props}
                                    type="redeem"
                                    text="REDEEM"
                                    data={data}
                                    asset={asset}
                                />
                            </CardColumn>
                        </CardRow>
                    </Card>
                )}
            </React.Fragment>
        )
    }
}
