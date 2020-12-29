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
    height: ${props => (props.isOpen || props.isMobile) ? '100%' : '65px'};
    font-size: ${props => props.isMobile ? '0.85em' : '1em'};
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

const ActionButton = styled.a`
    text-decoration: none;
    font-size: 0.85em;
    display: flex;
    flex-direction: row;
    justify-content: center;
    min-width: 100px;
    margin: 0 0.5em 0 0.5em;
    padding: 0.5em 1em 0.5em 1em;
    border-radius: 5px;
    background-color: #00d395;
    border-color: #00d395;
    border-width: 3px;
    border-style: solid;
    color: white;

    &:hover {
        cursor: pointer;
        background-color: white;
        color: #00d395;
        border-color: #00d395;
        border-width: 3px;
        border-style: solid;
    }
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
        return GRO.balance > 0.001 ? (Math.round(GRO.balance / 1e18 * 1000 ) / 1000).toLocaleString('En-en') : '0.00';
      }

    getGroPrice = (balances) => {
        if (!balances) return 0;
        const GRO = balances.find((balance) => balance.name === 'GRO');
        return (Math.round(GRO.base_price_usd * 100) / 100).toLocaleString('En-en');
    }

    getTotalPrice = (balances) => {
        if (!balances) return 0;
        const GRO = balances.find((balance) => balance.name === 'GRO');
        const usd_price = GRO.base_price_usd;
        return GRO.balance > 0.001 ? (Math.round((GRO.balance / 1e18) * usd_price * 100) / 100).toLocaleString('En-en') : '0.00'
    }

    getPercentage = () => {

        const { balances, eth_price, asset } = this.props;

        if (!balances) return '-';
        if (balances.length < 1) return;
        const GRO = balances.find((balance) => balance.name === 'GRO');
        
        const portfolio_value = 
            balances
                .reduce((acc, curr) => {
                    // If not available balance
                    if (Number(curr.balance) <= 0 ) return acc; 
                    if (curr.name === 'GRO') {
                        return acc + Number(curr.balance / 1e18) / Number(curr.price_eth) * eth_price; 
                    } 
                    // Balances
                    if (curr.balance > 0 && curr.base_price_usd) {
                    return acc + Number(curr.web3_balance / curr.decimals * curr.base_price_usd);
                    }
                    return acc;
                }, 0);            

        const allocPercentage = (Number(GRO.balance) / 1e18) * (eth_price / Number(GRO.price_eth)) / portfolio_value * 100;
              
        return Math.round(allocPercentage * 100) / 100;
    }

    render() {
        const {asset, data, isMobile, asset_key, currentOpenExtension, balances, eth_price, hideBalances, addGRO} = this.props;
      
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
                                <AssetLogo src="https://s2.coinmarketcap.com/static/img/coins/64x64/6718.png" isMobile={isMobile} />
                                <PrimaryLabel>GRO</PrimaryLabel>
                            </CardColumn>
                            <CardColumn align="flex-start">
                                <SecondaryLabel>{hideBalances ? 'PERCENTAGE' : 'HOLDINGS'}</SecondaryLabel>
                                <PrimaryLabel>{hideBalances ? addGRO ? `${this.getPercentage()} %` : '-' : this.getBalance(balances)}</PrimaryLabel>
                            </CardColumn>
                        </CardRow>
                        <CardRow>
                            <CardColumn align="flex-start">
                                <SecondaryLabel>PRICE</SecondaryLabel>
                                <PrimaryLabel>${this.getGroPrice(balances, eth_price)} USD</PrimaryLabel>
                            </CardColumn>
                            <CardColumn align="flex-start">
                                <SecondaryLabel>VALUE</SecondaryLabel>
                                {hideBalances ? (
                                    <PrimaryLabel>***** USD</PrimaryLabel>
                                ) : (
                                    <PrimaryLabel>${this.getTotalPrice(balances, eth_price)} USD</PrimaryLabel>
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
                                <AssetLogo src="https://s2.coinmarketcap.com/static/img/coins/64x64/6718.png" isMobile={isMobile} />
                                <PrimaryLabel>GRO</PrimaryLabel>
                            </CardColumn>
                            <CardColumn>
                                <PrimaryLabel>{hideBalances ? addGRO ? `${this.getPercentage()} %` : '-' : this.getBalance(balances)}</PrimaryLabel>
                            </CardColumn>
                            <CardColumn>
                                <PrimaryLabel>${this.getGroPrice(balances)} USD</PrimaryLabel>
                            </CardColumn>
                            <CardColumn>
                                {hideBalances ? (
                                    <PrimaryLabel>***** USD</PrimaryLabel>
                                ) : (
                                    <PrimaryLabel>${this.getTotalPrice(balances)} USD</PrimaryLabel>
                                )}
                                
                            </CardColumn>
                            <CardColumn 
                                direction="row"
                            >
                                <ActionButton
                                    href="https://info.uniswap.org/pair/0x208Bd5Dc470EbA21571ddB439801A614ed346376"
                                    target="_blank"
                                >
                                    GET GRO
                                </ActionButton>
                            </CardColumn>
                        </CardRow>
                    </Card>
                )}
            </React.Fragment>
        )
    }
}
