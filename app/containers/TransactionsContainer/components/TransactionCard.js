import React, { Component } from 'react';
import styled from 'styled-components';
import {isMobile} from 'react-device-detect';
import ActionModal from 'components/ActionModal';
import ActionDrawer from 'components/ActionDrawer';
import { Icon } from 'react-icons-kit';
import {arrowRight} from 'react-icons-kit/fa/arrowRight'

// import AssetExtension from './AssetExtension';
import moment from 'moment';

const Card = styled.div`
    display: flex;
    flex-direction: column;
    align-content: center;
    background-color: white;
    border-radius: 5px;
    ${props => props.isMobile && 'max-width: 350px;'}
    height: ${props => props.isOpen ? '100%' : '65px'};
    font-size: ${props => props.isMobile ? '0.75em' : '1em'};
    margin: ${props => props.isMobile ? '0.25em 0 0.25em 0' : '0.5em 2em 0.5em 2em'};
    ${props => props.isMobile && 'padding: 0.25em 0 0.5em 0;'}
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
    flex-wrap: wrap;
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

const TransactionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    flex: 1;
`

const TransactionContainerColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const TransactionLogo = styled.img`
    height: 40px;
    width: auto;
`

const MoreButton = styled.a`
    font-size: 0.85em;
    text-decoration: none;
    text-align: center;
    width: ${props => props.isMobile ? '100px' : '120px'};
    margin: 0 0.5em 0 0.5em ;
    padding: 0.5em 0 0.5em 0;
    border-radius: 5px;
    border-color: ${props => {
        if (props.action === 'redeem') return '#161d6b';
        if (props.action === 'mint') return '#00d395';
    }};
    border-width: 3px;
    border-style: solid;

    background-color:${props => {
        if (props.action === 'redeem') return '#161d6b';
        if (props.action === 'mint') return '#00d395';
    }};
    color: white;
    
    &:hover {
        cursor: pointer;

        background-color: white;
        color: ${props => {
            if (props.action === 'redeem') return '#161d6b';
            if (props.action === 'mint') return '#00d395';
        }};
    }
`

export default class TransactionCard extends Component {

    state = {
        isMobileDrawerOpen: false,
        timestamp: null,
    }

    getTransactionDate = async () => {
        const {transaction} = this.props;
       
        if (!transaction) return '';

        return moment(transaction.date * 1000).format('MMMM DD YYYY, LT');
    }

    getAsset = (token_name) => {
        const {Network} = this.props;
        const { available_assets } = Network;

        return available_assets[token_name]; 
    }

    parseAmount = (amount, decimals) => {
        return Math.round(amount / decimals * 100) / 100;
    }

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
        const {transaction, Network, asset_key, currentOpenExtension} = this.props;

        // Hardcoded until implemented on the graph
        const asset = this.getAsset(transaction.token.symbol);
        return (
            <React.Fragment>
                {isMobile ? (
                    <Card 
                        isMobile={isMobile}
                        isOpen={currentOpenExtension === asset_key}
                    >
                        <CardRow
                            isMobile={isMobile}
                        >
                            <CardColumn
                                flex="2"
                                direction="column"
                                align="flex-start"
                                justify="flex-start"
                                margin="0 0 0 0.5em"
                            >
                                <PrimaryLabel>{transaction && moment(transaction.date * 1000).format('DD/MM/YYYY LT')}</PrimaryLabel>
                                {transaction && (
                                    <SecondaryLabel>#{transaction.block}</SecondaryLabel>
                                )}
                            </CardColumn>
                            <CardColumn 
                                flex="1"
                                direction="row"
                            >
                                <MoreButton
                                    isMobile={isMobile}
                                    action={transaction.action}
                                    href={`https://etherscan.io/tx/${transaction.id}`}
                                    target="_blank"
                                >
                                    {transaction.action === 'mint' && 'VIEW MINT'}
                                    {transaction.action === 'redeem' && 'VIEW REDEEM'}
                                </MoreButton>
                            </CardColumn>
                        </CardRow>
                        <CardRow
                            isMobile={isMobile}
                        >
                            <CardColumn
                                flex="3"
                                direction="column"
                                align="center"
                                justify="center"
                                margin="0 0 0 2em"
                            >
                                { asset && transaction.action === 'redeem' && (
                                    <TransactionContainer>
                                        <TransactionContainerColumn>
                                            <TransactionLogo src={require(`images/tokens/${asset.gtoken_img_url}`)}/>
                                        </TransactionContainerColumn>
                                        <TransactionContainerColumn>
                                            <PrimaryLabel>{this.abbreviateNumber(transaction.sent / asset.base_decimals)}</PrimaryLabel>
                                            <SecondaryLabel>{asset.g_asset}</SecondaryLabel>
                                        </TransactionContainerColumn>
                                    </TransactionContainer>
                                )}
                                { asset && transaction.action === 'mint' && (
                                    <TransactionContainer>
                                        <TransactionContainerColumn>
                                            {transaction.type === 'base' && <TransactionLogo src={require(`images/tokens/${asset.img_url}`)} />}
                                            {transaction.type === 'underlying' && <TransactionLogo src={require(`images/tokens/${asset.native_img_url}`)} />}
                                        </TransactionContainerColumn>
                                        {transaction.type === 'base' && (
                                            <TransactionContainerColumn>
                                                <PrimaryLabel>{this.abbreviateNumber(this.parseAmount(transaction.sent, asset.base_decimals))}</PrimaryLabel>
                                                <SecondaryLabel>{asset.base_asset}</SecondaryLabel>
                                            </TransactionContainerColumn>
                                        )}
                                        {transaction.type === 'underlying' && (
                                            <TransactionContainerColumn>
                                                <PrimaryLabel>{this.abbreviateNumber(this.parseAmount(transaction.sent, asset.underlying_decimals))}</PrimaryLabel>
                                                <SecondaryLabel>{asset.native}</SecondaryLabel>
                                            </TransactionContainerColumn>
                                        )}
                                        
                                    </TransactionContainer>
                                )}
                            </CardColumn>
                            <CardColumn
                                flex="0.5"
                            >
                                <Icon icon={arrowRight} style={{color: '#161d6b'}} />
                            </CardColumn>
                            <CardColumn
                                flex="3"
                                direction="column"
                                align="center"
                                justify="center"
                                margin="0 0 0 2em"
                            >
                                { asset && transaction.action === 'mint' && (
                                    <TransactionContainer>
                                        <TransactionContainerColumn>
                                            <TransactionLogo src={require(`images/tokens/${asset.gtoken_img_url}`)}/>
                                        </TransactionContainerColumn>
                                        <TransactionContainerColumn>
                                            <PrimaryLabel>{this.abbreviateNumber(this.parseAmount(transaction.received, asset.base_decimals))}</PrimaryLabel>
                                            <SecondaryLabel>{asset.g_asset}</SecondaryLabel>
                                        </TransactionContainerColumn>
                                    </TransactionContainer>
                                )}
                                { asset && transaction.action === 'redeem' && (
                                    <TransactionContainer>
                                        <TransactionContainerColumn>
                                            {transaction.type === 'base' && <TransactionLogo src={require(`images/tokens/${asset.img_url}`)} />}
                                            {transaction.type === 'underlying' && <TransactionLogo src={require(`images/tokens/${asset.native_img_url}`)} />}
                                        </TransactionContainerColumn>
                                        { transaction.type === 'base' && (
                                            <TransactionContainerColumn>
                                                <PrimaryLabel>{this.abbreviateNumber(this.parseAmount(transaction.received, asset.base_decimals))}</PrimaryLabel>
                                                <SecondaryLabel>{asset.base_asset}</SecondaryLabel>
                                            </TransactionContainerColumn>
                                        )}
                                        { transaction.type === 'underlying' && (
                                            <TransactionContainerColumn>
                                                <PrimaryLabel>{this.abbreviateNumber(this.parseAmount(transaction.received, asset.underlying_decimals))}</PrimaryLabel>
                                                <SecondaryLabel>{asset.native}</SecondaryLabel>
                                            </TransactionContainerColumn>
                                        )}
                                        
                                    </TransactionContainer>
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
                                flex="1.5"
                                direction="column"
                                align="flex-start"
                                justify="flex-start"
                                margin="0 0 0 2em"
                            >
                                <PrimaryLabel>{moment(transaction.date * 1000).format('DD/MM/YYYY LT')}</PrimaryLabel>
                                <SecondaryLabel>#{transaction.block}</SecondaryLabel>
                            </CardColumn>
                            <CardColumn
                                direction="column"
                                align="center"
                                justify="center"
                                margin="0 0 0 2em"
                            >
                                { asset && transaction.action === 'redeem' && (
                                    <TransactionContainer>
                                        <TransactionContainerColumn>
                                            <TransactionLogo src={require(`images/tokens/${asset.gtoken_img_url}`)}/>
                                        </TransactionContainerColumn>
                                        <TransactionContainerColumn>
                                            <PrimaryLabel>- {transaction.sent / asset.base_decimals}</PrimaryLabel>
                                            <SecondaryLabel>{asset.g_asset}</SecondaryLabel>
                                        </TransactionContainerColumn>
                                    </TransactionContainer>
                                )}
                                { asset && transaction.action === 'mint' && (
                                    <TransactionContainer>
                                        <TransactionContainerColumn>
                                            {transaction.type === 'base' && <TransactionLogo src={require(`images/tokens/${asset.img_url}`)} />}
                                            {transaction.type === 'underlying' && <TransactionLogo src={require(`images/tokens/${asset.native_img_url}`)} />}
                                        </TransactionContainerColumn>
                                        {transaction.type === 'base' && (
                                            <TransactionContainerColumn>
                                                <PrimaryLabel>- {this.parseAmount(transaction.sent, asset.base_decimals)}</PrimaryLabel>
                                                <SecondaryLabel>{asset.base_asset}</SecondaryLabel>
                                            </TransactionContainerColumn>
                                        )}
                                        {transaction.type === 'underlying' && (
                                            <TransactionContainerColumn>
                                                <PrimaryLabel>- {this.parseAmount(transaction.sent, asset.underlying_decimals)}</PrimaryLabel>
                                                <SecondaryLabel>{asset.native}</SecondaryLabel>
                                            </TransactionContainerColumn>
                                        )}
                                        
                                    </TransactionContainer>
                                )}
                            </CardColumn>
                            <CardColumn
                                direction="column"
                                align="center"
                                justify="center"
                                margin="0 0 0 2em"
                            >
                                { asset && transaction.action === 'mint' && (
                                    <TransactionContainer>
                                        <TransactionContainerColumn>
                                            <TransactionLogo src={require(`images/tokens/${asset.gtoken_img_url}`)}/>
                                        </TransactionContainerColumn>
                                        <TransactionContainerColumn>
                                            <PrimaryLabel>+ {this.parseAmount(transaction.received,asset.base_decimals)}</PrimaryLabel>
                                            <SecondaryLabel>{asset.g_asset}</SecondaryLabel>
                                        </TransactionContainerColumn>
                                    </TransactionContainer>
                                )}
                                { asset && transaction.action === 'redeem' && (
                                    <TransactionContainer>
                                        <TransactionContainerColumn>
                                            {transaction.type === 'base' && <TransactionLogo src={require(`images/tokens/${asset.img_url}`)} />}
                                            {transaction.type === 'underlying' && <TransactionLogo src={require(`images/tokens/${asset.native_img_url}`)} />}
                                        </TransactionContainerColumn>
                                        { transaction.type === 'base' && (
                                            <TransactionContainerColumn>
                                                <PrimaryLabel>+ {this.parseAmount(transaction.received, asset.base_decimals)}</PrimaryLabel>
                                                <SecondaryLabel>{asset.base_asset}</SecondaryLabel>
                                            </TransactionContainerColumn>
                                        )}
                                        { transaction.type === 'underlying' && (
                                            <TransactionContainerColumn>
                                                <PrimaryLabel>+ {this.parseAmount(transaction.received, asset.underlying_decimals)}</PrimaryLabel>
                                                <SecondaryLabel>{asset.native}</SecondaryLabel>
                                            </TransactionContainerColumn>
                                        )}
                                        
                                    </TransactionContainer>
                                )}
                            </CardColumn>
                            <CardColumn 
                                direction="row"
                            >
                                <MoreButton
                                    action={transaction.action}
                                    href={`https://etherscan.io/tx/${transaction.id}`}
                                    target="_blank"
                                >
                                    {transaction.action === 'mint' && 'VIEW MINT'}
                                    {transaction.action === 'redeem' && 'VIEW REDEEM'}
                                </MoreButton>
                            </CardColumn>
                        </CardRow>
                    </Card>
                )}
            </React.Fragment>
        )
    }
}
