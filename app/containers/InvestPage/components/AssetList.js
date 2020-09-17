import React, { Component } from 'react';
import AssetCard from './AssetCard';
import styled from 'styled-components';


const defaultData = [
    {
        native: 'DAI',
        base_asset: 'cDAI',
        g_asset: 'gcDAI',
        tvl: '$25.34M',
        base_total_supply: 25340000,
        total_supply: 11234110,
        apy_avg: '12.58%',
        apy_7days: '0.58%',
        img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
        minting_fee: 0.01,
        burning_fee: 0.01,
    },
    {
        native: 'ETH',
        base_asset: 'cETH',
        g_asset: 'gcETH',
        tvl: '$187.45M',
        base_total_supply: 51208,
        total_supply: 78234,
        apy_avg: '13.50%',
        apy_7days: '2.90%',
        img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        minting_fee: 0.01,
        burning_fee: 0.01,
    },
    {
        native: 'DAI',
        base_asset: 'cDAI',
        g_asset: 'gcDAI',
        tvl: '$25.34M',
        base_total_supply: 25340000,
        total_supply: 11234110,
        apy_avg: '12.58%',
        apy_7days: '0.58%',
        img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
        minting_fee: 0.01,
        burning_fee: 0.01,
    },
    {
        native: 'ETH',
        base_asset: 'cETH',
        g_asset: 'gcETH',
        tvl: '$187.45M',
        base_total_supply: 51208,
        total_supply: 78234,
        apy_avg: '13.50%',
        apy_7days: '2.90%',
        img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        minting_fee: 0.01,
        burning_fee: 0.01,
    },
    {
        native: 'DAI',
        base_asset: 'cDAI',
        g_asset: 'gcDAI',
        tvl: '$25.34M',
        base_total_supply: 25340000,
        total_supply: 11234110,
        apy_avg: '12.58%',
        apy_7days: '0.58%',
        img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
        minting_fee: 0.01,
        burning_fee: 0.01,
    },
    {
        native: 'ETH',
        base_asset: 'cETH',
        g_asset: 'gcETH',
        tvl: '$187.45M',
        base_total_supply: 51208,
        total_supply: 78234,
        apy_avg: '13.50%',
        apy_7days: '2.90%',
        img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        minting_fee: 0.01,
        burning_fee: 0.01,
    },
    {
        native: 'DAI',
        base_asset: 'cDAI',
        g_asset: 'gcDAI',
        tvl: '$25.34M',
        base_total_supply: 25340000,
        total_supply: 11234110,
        apy_avg: '12.58%',
        apy_7days: '0.58%',
        img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
        minting_fee: 0.01,
        burning_fee: 0.01,
    },
    {
        native: 'ETH',
        base_asset: 'cETH',
        g_asset: 'gcETH',
        tvl: '$187.45M',
        base_total_supply: 51208,
        total_supply: 78234,
        apy_avg: '13.50%',
        apy_7days: '2.90%',
        img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        minting_fee: 0.01,
        burning_fee: 0.01,
    },
    {
        native: 'DAI',
        base_asset: 'cDAI',
        g_asset: 'gcDAI',
        tvl: '$25.34M',
        base_total_supply: 25340000,
        total_supply: 11234110,
        apy_avg: '12.58%',
        apy_7days: '0.58%',
        img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
        minting_fee: 0.01,
        burning_fee: 0.01,
    },
    {
        native: 'ETH',
        base_asset: 'cETH',
        g_asset: 'gcETH',
        tvl: '$187.45M',
        base_total_supply: 51208,
        total_supply: 78234,
        apy_avg: '13.50%',
        apy_7days: '2.90%',
        img_url: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        minting_fee: 0.01,
        burning_fee: 0.01,
    },
]


const AssetContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 1em 0 1em 0;
`

const AssetHeader = styled.div`
    display: flex;
    flex-direction: row;
    color: white;
    margin: 0 2em 0em 2em;
    font-size: 0.80em;
`

const AssetHeaderColumn = styled.div`
    display: flex;
    justify-content: center;
    flex: ${props => props.flex || '1'};
    margin: ${props => props.margin || '0'};
`


export default class AssetList extends Component {
    render() {
        const data = defaultData;
        return (
            <AssetContainer>
                <AssetHeader>
                    <AssetHeaderColumn margin="0 0 0 1em">
                        <p>ASSET</p>
                    </AssetHeaderColumn>
                    <AssetHeaderColumn>
                        <p>MARKET SIZE</p>
                    </AssetHeaderColumn>
                    <AssetHeaderColumn>
                        <p>APY</p>
                    </AssetHeaderColumn>
                    <AssetHeaderColumn>
                        <p>ACTIONS</p>
                    </AssetHeaderColumn>
                </AssetHeader>
                {data && data.length > 0 &&
                    data.map(asset => {
                        return (
                            <AssetCard 
                                data={data}
                                asset={asset}
                            />
                        )
                    })
                }
            </AssetContainer>     
        )
    }
}
