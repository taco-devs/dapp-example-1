import React, { Component } from 'react';
import AssetCard from './AssetCard';
import styled from 'styled-components';
import NetworkData from 'contracts';


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


export default class AssetList extends Component {

    state = {
        currentOpenExtension: null,
    }

    showAvailableAssets = (currentOpenExtension) => {
        const {assets, pagination, Network, search} = this.props;
        if (!assets || !Network) return;
        const assets_per_page = 10;
        const slice_start = pagination * assets_per_page;
        const slice_end = (pagination + 1) * assets_per_page;
        const page_assets = 
            assets
                .filter(asset_key => {
                    if (!search) return true;
                    if (search.length < 1) return true;
                    return `g${asset_key}`.toUpperCase().indexOf(search.toUpperCase()) > -1;
                })
                .slice(slice_start, slice_end);
        return page_assets.map((asset_key) => (
            <AssetCard  
                {...this.props} 
                asset_key={asset_key}
                currentOpenExtension={currentOpenExtension}
                asset={Network.available_assets[asset_key]} 
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
        const {currentOpenExtension} = this.state;
        const {isMobile} = this.props;
        return (
            <AssetContainer isMobile={isMobile}>
                <AssetHeader isMobile={isMobile}>
                    <AssetHeaderColumn margin="0 0 0 1em">
                        <p>ASSET</p>
                    </AssetHeaderColumn>
                    <AssetHeaderColumn>
                        <p>MARKET SIZE</p>
                    </AssetHeaderColumn>
                    <AssetHeaderColumn>
                        <p>APY</p>
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
