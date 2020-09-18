import React, { Component } from 'react';
import AssetCard from './AssetCard';
import styled from 'styled-components';
import NetworkData from 'contracts';


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

    showAvailableAssets = () => {
        const {assets, pagination, Network} = this.props;
        if (!assets || !Network) return;
        const assets_per_page = 10;
        const slice_start = pagination * assets_per_page;
        const slice_end = (pagination + 1) * assets_per_page;
        const page_assets = assets.slice(slice_start, slice_end);
        return page_assets.map(asset_key => <AssetCard asset={Network.available_assets[asset_key]} />)
    }

    render() {
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
                {this.showAvailableAssets()}
            </AssetContainer>     
        )
    }
}
