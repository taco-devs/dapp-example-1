import React, { Component } from 'react'
import styled from 'styled-components';
import TransactionsCard from './TransactionCard';
import {isMobile} from 'react-device-detect';
/* import BalanceCard from './BalanceCard';
import GroBalanceCard from './GroBalanceCard'; */

const TransactionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: ${props => props.isMobile ? '0' : '1em 0 1em 0'} ;
`

const TransactionsHeader = styled.div`
    display: flex;
    flex-direction: row;
    color: white;
    margin: ${props => props.isMobile ? '0' : '0 2em 0 2em'};
    font-size: 0.80em;
`

const TransactionsHeaderColumn = styled.div`
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

export default class TransactionsList extends Component {


    showTransactions = (currentOpenExtension) => {
        const {assets, pagination, Network, search, balances, transactions} = this.props;
        if (!transactions) return;
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
        /* const filtered_asset = balances
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
                    }); */
                    
        return transactions.map((transaction) => (
                <TransactionsCard
                    {...this.props}
                    transaction={transaction}
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
        return (
            <TransactionsContainer isMobile={isMobile}>
                <TransactionsHeader isMobile={isMobile}>
                    {isMobile && (
                        <TransactionsHeaderColumn>
                            <p>Transactions</p>
                        </TransactionsHeaderColumn>
                    )}
                    {!isMobile && (
                        <TransactionsHeaderColumn margin="0 0 0 0" flex="1.5">
                            <p>DATE</p>
                        </TransactionsHeaderColumn>
                    )}
                    {!isMobile && (
                        <TransactionsHeaderColumn>
                            <p>FROM</p>
                        </TransactionsHeaderColumn>
                    )}
                    {!isMobile && (
                        <TransactionsHeaderColumn>
                            <p>TO</p>
                        </TransactionsHeaderColumn>
                    )}
                    {!isMobile && (
                        <TransactionsHeaderColumn>
                            <p>ACTIONS</p>
                        </TransactionsHeaderColumn>
                    )}
                </TransactionsHeader>
                {this.showTransactions()}
            </TransactionsContainer>
        )
    }
}
