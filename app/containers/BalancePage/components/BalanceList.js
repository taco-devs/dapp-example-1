import React, { Component } from 'react'
import styled from 'styled-components';
import BalanceCard from './BalanceCard';
import GroBalanceCard from './GroBalanceCard';

const BalanceContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: ${props => props.isMobile ? '0' : '1em 0 1em 0'} ;
    width: 100%;
`

const BalanceHeader = styled.div`
    display: flex;
    flex-direction: row;
    color: white;
    margin: ${props => props.isMobile ? '0' : '0 2em 0 2em'};
    font-size: 0.80em;
`

const BalanceHeaderColumn = styled.div`
    display: flex;
    justify-content: center;
    flex: ${props => props.flex || '1'};
    margin: ${props => props.margin || '0'};
`

const data = {
    'gcDai': {
        name: 'gcDAI',
        img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5263.png',
        balance: 1466.68,
        price_usd: 1.22,
        price_base: 1.20,
    },
    'gcLink': {
        name: 'gaLINK',
        img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5263.png',
        balance: 80.631,
        price_usd: 1.22,
        price_base: 1.20,
    },
}

export default class BalanceList extends Component {


    showAvailableBalances = (currentOpenExtension) => {
        const {assets, pagination, Network, search, balances} = this.props;
        if (!assets || !Network || !balances) return;
        // const assets_per_page = 10;
        // const slice_start = pagination * assets_per_page;
        // const slice_end = (pagination + 1) * assets_per_page;
        /* const page_assets = 
            assets
                .filter(asset_key => {
                    if (!search) return true;
                    if (search.length < 1) return true;
                    return `g${asset_key}`.toUpperCase().indexOf(search.toUpperCase()) > -1;
                })
                .slice(slice_start, slice_end);  */

        // Get the assets that have balances greater than 0
        const filtered_asset = balances
            .filter(asset => Number(asset.balance) > 0 && asset.name !== 'GRO');
        
        if (!filtered_asset) return;

        // Construct the new balance list
        const assets_with_balances = 
                filtered_asset
                    .map((asset) => {
                        return {
                            ...Network.available_assets[asset.name],
                            ...asset
                        }
                    });
                    
        return assets_with_balances.map((asset) => (
            <BalanceCard  
                {...this.props} 
                asset_key={asset.name}
                currentOpenExtension={currentOpenExtension}
                asset={asset} 
                toggleExtension={this.toggleExtension}
            />
            )
        )
    }


    toggleExtension = (asset_key) => {
        const {currentOpenExtension} = this.state;
        
        if (asset_key === currentOpenExtension) {
            this.setState({currentOpenExtension: null});
        } else {
            this.setState({currentOpenExtension: asset_key});
        }        
    }


    render() {
        const {isMobile} = this.props;
        return (
            <BalanceContainer isMobile={isMobile}>
                <BalanceHeader isMobile={isMobile}>
                    {!isMobile && (
                        <BalanceHeaderColumn>
                            <p>ASSET</p>
                        </BalanceHeaderColumn>
                    )}
                    {!isMobile && (
                        <BalanceHeaderColumn>
                            <p>HOLDINGS</p>
                        </BalanceHeaderColumn>
                    )}
                    {!isMobile && (
                        <BalanceHeaderColumn>
                            <p>PRICE</p>
                        </BalanceHeaderColumn>
                    )}
                    {!isMobile && (
                        <BalanceHeaderColumn>
                        <p>VALUE</p>
                    </BalanceHeaderColumn>
                    )}
                    {!isMobile && (
                        <BalanceHeaderColumn>
                            <p>ACTIONS</p>
                        </BalanceHeaderColumn>
                    )}
                </BalanceHeader>
                <GroBalanceCard 
                    {...this.props}
                />
                {this.showAvailableBalances()}
            </BalanceContainer>
        )
    }
}
