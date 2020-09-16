import React, { Component } from 'react';
import styled from 'styled-components';
import ActionModal from 'components/ActionModal';

const Card = styled.div`
    display: flex;
    flex-direction: row;
    background-color: white;
    border-radius: 5px;
    height: 65px;
    margin: 0.5em 2em 0.5em 2em;
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

const CardColumn = styled.div`
    display: flex;
    flex-direction: ${props => props.direction || 'column'};
    flex: ${props => props.flex || '1'};
    justify-content: ${props => props.justify || 'center'};
    align-items: ${props => props.align || 'center'};
    margin: ${props => props.margin || '0'};
`

const AssetLogo = styled.img`
    width: 40px;
    height: 40px;
`

const PrimaryLabel = styled.p`
    color: #161d6b;
    margin: 0 1em 0 1em;
`

const SecondaryLabel = styled.p`
    color: #161d6b;
    opacity: 0.75;
    margin: 0 1em 0 1em;
`

export default class AssetCard extends Component {

    render() {
        const {asset, data} = this.props;
        return (
            <Card>
                <CardColumn
                    direction="row"
                    align="center"
                    justify="flex-start"
                    margin="0 0 0 1em"
                >
                    <AssetLogo src={asset.img_url} />
                    <PrimaryLabel>{asset.g_asset} / {asset.base_asset}</PrimaryLabel>
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
                <CardColumn 
                    direction="row"
                >
                    <ActionModal 
                        type="mint"
                        text="MINT"
                        data={data}
                        asset={asset}
                    />
                    <ActionModal 
                        type="redeem"
                        text="REDEEM"
                        data={data}
                        asset={asset}
                    />
                </CardColumn>
            </Card>
        )
    }
}
