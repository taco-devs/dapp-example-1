import React, { Component } from 'react';
import styled from 'styled-components';
import PoolLogo from './PoolLogo';
import { Icon } from 'react-icons-kit';
import {areaChart} from 'react-icons-kit/fa/areaChart'

const Card = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 5px;
    height: ${props => props.isOpen ? '100%' : '65px'};
    font-size: ${props => props.isMobile ? '0.75em' : '1em'};
    margin: ${props => props.isMobile ? '0.25em 0 0.25em 0' : '0.5em 2em 0.5em 2em'};
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
    width: ${props => props.isMobile ? '40px' : '50px'};
    height: auto;
`

const PrimaryLabel = styled.p`
    color: #161d6b;
    margin: 0 1em 0 1em;
    text-align: center;
`

const SecondaryLabel = styled.p`
    color: #161d6b;
    opacity: 0.75;
    margin: 0 1em 0 1em;
    text-align: center;
`

const ChartButton = styled.div`
    display: flex;
    flex-direction: row;
    font-size: 0.85em;
    background-color: #21262b;
    border-color: #21262b;
    border-width: 3px;
    border-style: solid;
    margin: 0 0.5em  0 0.5em;
    padding: 0.5em;
    color: white;
    border-radius: 5px;
    min-width: 50px;
    align-items: center;
    justify-content: center;
    height: 40px;

    &:hover {
        cursor: pointer;
        background-color: black;
        opacity: 0.75em;
    }
`



const SwapTitle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
`

export default class SwapCard extends Component {

    state = {
        isMobileDrawerOpen: false,
    }

    // Format the numbers for K, M, B
    abbreviateNumber = (value) => {
        var newValue = value;
        if (value >= 1000) {
            var suffixes = ["", "K", "M", "B","T"];
            var suffixNum = Math.floor( (""+value).length/3 );
            var shortValue = '';
            for (var precision = 2; precision >= 1; precision--) {
                shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
                var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
                if (dotLessShortValue.length <= 2) { break; }
            }
            if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
            newValue = shortValue+suffixes[suffixNum];
        }
        return newValue;
    }

    render() {
        const {asset, data, isMobile, asset_key, currentOpenExtension, web3} = this.props;
        const {isMobileDrawerOpen} = this.state;
        
        return (
            <React.Fragment>
                {isMobile ? (
                    <div />
                ) : (
                    <Card 
                        isMobile={isMobile}
                        isOpen={false}
                        onClick={(e) => {
                            e.stopPropagation()
                            this.handleToggleExtension(asset_key)
                        }}
                    >
                        <CardRow>
                            <CardColumn
                                direction="row"
                                align="center"
                                justify="flex-start"
                                margin="0 0 0 1em"
                                flex="1"
                            >                           
                                      
                                <PoolLogo 
                                    asset={asset}
                                />
                                <SwapTitle>
                                  <PrimaryLabel>GRO {!isMobile && '/'} {asset.g_asset}</PrimaryLabel>  
                                  <SecondaryLabel>Balancer</SecondaryLabel>
                                </SwapTitle>
                                
                            </CardColumn>
                            <CardColumn 
                                direction="column"
                            >
                                {/* <PrimaryLabel>{this.getMarketSize()}</PrimaryLabel>
                                <SecondaryLabel>{this.getSupply()} {asset.g_asset}</SecondaryLabel> */}
                            </CardColumn>
                            <CardColumn 
                                direction="column"
                            >
                                {/* <PrimaryLabel>{this.calculateAvgAPY()}% AVG</PrimaryLabel>
                                <SecondaryLabel>{this.calculate7DAPY()}% 7D</SecondaryLabel> */}
                            </CardColumn>
                            <CardColumn 
                                direction="row"
                            >
                               {/*  <ActionModal 
                                    {...this.props}
                                    type="mint"
                                    text="MINT"
                                    data={data}
                                    asset={asset}
                                />
                                <ActionModal 
                                    {...this.props}
                                    type="redeem"
                                    text="REDEEM"
                                    data={data}
                                    asset={asset}
                                />
                                <ChartButton>
                                    <Icon icon={areaChart} style={{color: '#00d395', margin: '-5px 0 0 0'}} size="1.5em"/>
                                </ChartButton> */}  
                            </CardColumn>
                        </CardRow>
                    </Card>
                )}
            </React.Fragment>
        )
    }
}
