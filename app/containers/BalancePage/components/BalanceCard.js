import React, { Component } from 'react';
import styled from 'styled-components';
import ActionModal from 'components/ActionModal';
import ActionDrawer from 'components/ActionDrawer';
// import AssetExtension from './AssetExtension';

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
        return Math.round(float_number * 10000) / 10000;
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

    render() {
        const {asset, data, isMobile, asset_key, currentOpenExtension} = this.props;
        /* const {isMobileDrawerOpen} = this.state; */
        return (
            <React.Fragment>
                {isMobile ? (
                    <div>
                    {/* <ActionDrawer
                        type="mint"
                        text="MINT"
                        data={data}
                        asset={asset}
                        toggleMobileDrawer={this.toggleMobileDrawer}
                        isMobileDrawerOpen={isMobileDrawerOpen}
                    >
                        <Card 
                            isMobile={isMobile}
                            onClick={this.toggleMobileDrawer}
                        >
                            <CardRow>
                                <CardColumn
                                    direction="row"
                                    align="center"
                                    justify="flex-start"
                                    margin="0 0 0 1em"
                                >
                                    <AssetLogo src={asset.img_url} isMobile={isMobile} />
                                    <PrimaryLabel>{asset.g_asset} {!isMobile && '/'} {asset.base_asset}</PrimaryLabel>
                                </CardColumn>
                                <CardColumn 
                                    direction="column"
                                >
                                    <PrimaryLabel>{asset.tvl}</PrimaryLabel>
                                    <SecondaryLabel>{asset.total_supply.toLocaleString('En-en')} {asset.g_asset}</SecondaryLabel>
                                </CardColumn>
                                <CardColumn 
                                    direction="column"
                                >
                                    <PrimaryLabel>{asset.apy_avg} AVG</PrimaryLabel>
                                    <SecondaryLabel>{asset.apy_7days} 7D</SecondaryLabel>
                                </CardColumn>
                            </CardRow>  
                        </Card>
                    </ActionDrawer> */}
                    </div>
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
                                <PrimaryLabel>{asset.balance && this.parseNumber(asset.web3_balance, 1e8).toLocaleString('En-en')}</PrimaryLabel>
                            </CardColumn>
                            <CardColumn>
                                <PrimaryLabel>${Math.round(asset.base_price_usd * 100000) / 100000} USD</PrimaryLabel>
                                <SecondaryLabel>{Math.round(asset.total_reserve / asset.total_supply * 10000) / 10000} {asset.base_asset}</SecondaryLabel>
                            </CardColumn>
                            <CardColumn>
                                <PrimaryLabel>${(this.parseNumber(asset.web3_balance, 1e8) * asset.base_price_usd).toLocaleString('En-en')} USD</PrimaryLabel>
                                {/* <SecondaryLabel>{(this.parseNumber(asset.web3_balance, 1e8) * this.gTokenToBase(asset)).toLocaleString('En-en')} {asset.base}</SecondaryLabel> */}
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
