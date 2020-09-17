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

    /* Parse the assets */
    assetKeys = (Network) => {
        if (!Network || !Network.available_assets) return [];
        return Object.keys(Network.available_assets);
    }

    render() {
        const {network_id} = this.props;
        const Network = NetworkData[network_id];
        const assets = this.assetKeys(Network);
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
                {assets && assets.length > 0 &&
                    assets.map(asset_key => {
                        return (
                            <AssetCard 
                                data={NetworkData.available_assets}
                                asset={Network.available_assets[asset_key]}
                            />
                        )
                    })
                }
            </AssetContainer>     
        )
    }
}
