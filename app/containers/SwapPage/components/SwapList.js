import React, { Component } from 'react';
import SwapCard from './SwapCard';
import styled from 'styled-components';

const AssetContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: ${props => props.isMobile ? '0' : '1em 0 1em 0'} ;
`

const AssetHeader = styled.div`
    display: flex;
    flex-direction: row;
    color: white;
    margin: ${props => props.isMobile ? '0' : '0 2em 0 2em'};
    font-size: 0.80em;
`

const AssetHeaderColumn = styled.div`
    display: flex;
    justify-content: center;
    flex: ${props => props.flex || '1'};
    margin: ${props => props.margin || '0'};
`


export default class SwapList extends Component {

    state = {
        currentOpenExtension: null,
    }

    showAvailableAssets = (currentOpenExtension) => {
        const {assets, pagination, Network, search} = this.props;
        if (!assets || !Network) return;

        return assets
            .filter(asset_key => Network.available_assets[asset_key].liquidity_pool_address)
            .map((asset_key) => (
                <SwapCard  
                    {...this.props} 
                    asset_key={asset_key}
                    currentOpenExtension={currentOpenExtension}
                    asset={Network.available_assets[asset_key]} 
                />
                )
            )
    } 


    toggleExtension = (asset) => {
        const {getTokenStats} = this.props;
        const {currentOpenExtension} = this.state;
        
        if (asset.g_asset === currentOpenExtension) {
            this.setState({currentOpenExtension: null});
        } else {
            getTokenStats({token: asset.gtoken_address});
            this.setState({currentOpenExtension: asset.g_asset});
        }        
    }


    render() {
        const {currentOpenExtension} = this.state;
        const {isMobile, web3} = this.props;
        return (
            <AssetContainer isMobile={isMobile}>
                <AssetHeader isMobile={isMobile}>
                    {/* !isMobile && (
                        <AssetHeaderColumn flex="0.5"/>
                    ) */}
                    <AssetHeaderColumn flex="1.75" margin="0 0 0 1em">
                        <p>POOL</p>
                    </AssetHeaderColumn>
                    <AssetHeaderColumn flex="1">
                        <p>LIQUIDITY</p>
                    </AssetHeaderColumn>
                    <AssetHeaderColumn>
                        <p>24H VOLUME</p>
                    </AssetHeaderColumn>
                    <AssetHeaderColumn>
                        <p>24H FEES</p>
                    </AssetHeaderColumn>
                    {!isMobile && (
                        <AssetHeaderColumn>
                            <p>ACTIONS</p>
                        </AssetHeaderColumn>
                    )}
                </AssetHeader>
                {this.showAvailableAssets(currentOpenExtension)}
            </AssetContainer>     
        )
    }
}
