import React, { Component } from 'react';
import styled from 'styled-components';
import ActionModal from 'components/ActionModal';
import ActionDrawer from 'components/ActionDrawer';
// import AssetExtension from './AssetExtension';

const Card = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #21262b;
    border-radius: 5px;
    height: ${props => props.isOpen ? '100%' : '65px'};
    font-size: ${props => props.isMobile ? '0.75em' : '1em'};
    margin: ${props => props.isMobile ? '0.25em 0 0.25em 0' : '0.5em 2em 0.5em 2em'};
    -webkit-box-shadow: 0px 0px 5px 5px rgba(0,0,149,0.75);
    -moz-box-shadow: 0px 0px 5px 5px rgba(0,211,149,0.75);
    box-shadow: 0px 0px 5px 5px rgba(0,211,149,0.75);

    &:hover {
        cursor: pointer;
        -webkit-box-shadow: 0px 0px 5px 5px rgba(0,0,149,0.75);
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
    border-radius: 50%;
    margin: 0.5em;
`

const PrimaryLabel = styled.p`
    color: white;
    margin: 0 1em 0 1em;
    text-align: center;
`

const SecondaryLabel = styled.p`
    color: white;
    opacity: 0.75;
    margin: 0 1em 0 1em;
    text-align: center;
`

export default class GroBalanceCard extends Component {

    state = {
        isMobileDrawerOpen: false,
        balance: null,
        gro_price: 13.5
    }

    toggleMobileDrawer = () => {
        this.setState({isMobileDrawerOpen: !this.state.isMobileDrawerOpen});
    }

    handleToggleExtension = (asset_key) => {
        const {toggleExtension} = this.props;
        toggleExtension(asset_key);
    }

    getBalance = (balances) => {       
        if (!balances) return 0;

        // Get Grow Balance
        const GRO = balances.find((balance) => balance.name === 'GRO');
        return Math.round(GRO.balance / 1e18 * 1000 ) / 1000;
      }

    getGroPrice = (balances, eth_price) => {
        if (!balances || !eth_price) return 0;
        const GRO = balances.find((balance) => balance.name === 'GRO');
        return (Math.round((eth_price/ GRO.price_eth) * 100) / 100).toLocaleString('En-en');
    }

    getTotalPrice = (balances, eth_price) => {
        if (!balances || !eth_price) return 0;
        const GRO = balances.find((balance) => balance.name === 'GRO');
        const usd_price = eth_price / GRO.price_eth;
        return (Math.round((GRO.balance / 1e18) * usd_price * 100) / 100).toLocaleString('En-en')
    }

    render() {
        const {asset, data, isMobile, asset_key, currentOpenExtension, GrowTokenInstance, balances, eth_price} = this.props;
        const { balance, gro_price } = this.state;
      
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
                                <AssetLogo src="https://s2.coinmarketcap.com/static/img/coins/64x64/6718.png" isMobile={isMobile} />
                                <PrimaryLabel>GRO</PrimaryLabel>
                            </CardColumn>
                            <CardColumn>
                                <PrimaryLabel>{this.getBalance(balances)}</PrimaryLabel>
                            </CardColumn>
                            <CardColumn>
                                <PrimaryLabel>${this.getGroPrice(balances, eth_price)} USD</PrimaryLabel>
                            </CardColumn>
                            <CardColumn>
                                <PrimaryLabel>${this.getTotalPrice(balances, eth_price)} USD</PrimaryLabel>
                            </CardColumn>
                            <CardColumn 
                                direction="row"
                            >
                                
                            </CardColumn>
                        </CardRow>
                    </Card>
                )}
            </React.Fragment>
        )
    }
}
