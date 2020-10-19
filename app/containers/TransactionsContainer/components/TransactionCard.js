import React, { Component } from 'react';
import styled from 'styled-components';
import ActionModal from 'components/ActionModal';
import ActionDrawer from 'components/ActionDrawer';
// import AssetExtension from './AssetExtension';
import moment from 'moment';

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

export default class BalanceCard extends Component {

    state = {
        isMobileDrawerOpen: false,
        timestamp: null,
    }

    getTransactionDate = async () => {
        const {transaction, web3} = this.props;
        if (!transaction || !web3) return;

        const date = await web3.eth.getBlock(transaction.block);
        const { timestamp } = date;
        this.setState({timestamp});
    }

    getAsset = (token_name) => {
        const {Network} = this.props;
        const { available_assets } = Network;

        return available_assets[token_name]; 
    }

    parseAmount = (amount, decimals) => {
        return Math.round(amount / decimals * 1000) / 1000;
    }

    render() {
        const {transaction, Network, isMobile, asset_key, currentOpenExtension} = this.props;
        const { timestamp } = this.state;
        if (!timestamp) {
            this.getTransactionDate()
        }

        // Hardcoded until implemented on the graph
        const token_name = 'gcDAI'
        const asset = this.getAsset(token_name);

        return (
            <React.Fragment>
                {isMobile ? (
                    <div>
                    {/* <ActionDrawer
                        type="mint"
                        text="MINT"
                        data={data}
                        asset={asset}
                        toggleMobileDrawer={this.toggleMobileDrawer}
                        isMobileDrawerOpen={isMobileDrawerOpen}
                    >
                        <Card 
                            isMobile={isMobile}
                            onClick={this.toggleMobileDrawer}
                        >
                            <CardRow>
                                <CardColumn
                                    direction="row"
                                    align="center"
                                    justify="flex-start"
                                    margin="0 0 0 1em"
                                >
                                    <AssetLogo src={asset.img_url} isMobile={isMobile} />
                                    <PrimaryLabel>{asset.g_asset} {!isMobile && '/'} {asset.base_asset}</PrimaryLabel>
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
                            </CardRow>  
                        </Card>
                    </ActionDrawer> */}
                    </div>
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
                                <PrimaryLabel>{timestamp && moment(timestamp * 1000).format('MMMM DD YYYY, LT')}</PrimaryLabel>
                                <SecondaryLabel>#{transaction.block}</SecondaryLabel>
                            </CardColumn>
                            <CardColumn
                                direction="column"
                                align="center"
                                justify="center"
                                margin="0 0 0 2em"
                            >
                                { transaction.action === 'redeem' && (
                                    <TransactionContainer>
                                        <TransactionContainerColumn>
                                            <TransactionLogo src={require(`images/tokens/${asset.gtoken_img_url}`)}/>
                                        </TransactionContainerColumn>
                                        <TransactionContainerColumn>
                                            <PrimaryLabel>- {transaction.sent / 1e8}</PrimaryLabel>
                                            <SecondaryLabel>{asset.g_asset}</SecondaryLabel>
                                        </TransactionContainerColumn>
                                    </TransactionContainer>
                                )}
                                { transaction.action === 'mint' && (
                                    <TransactionContainer>
                                        <TransactionContainerColumn>
                                            {transaction.type === 'base' && <TransactionLogo src={asset.img_url} />}
                                            {transaction.type === 'underlying' && <TransactionLogo src={asset.native_img_url} />}
                                        </TransactionContainerColumn>
                                        {transaction.type === 'base' && (
                                            <TransactionContainerColumn>
                                                <PrimaryLabel>- {transaction.sent / asset.base_decimals}</PrimaryLabel>
                                                <SecondaryLabel>{asset.base_asset}</SecondaryLabel>
                                            </TransactionContainerColumn>
                                        )}
                                        {transaction.type === 'underlying' && (
                                            <TransactionContainerColumn>
                                                <PrimaryLabel>- {transaction.sent / asset.underlying_decimals}</PrimaryLabel>
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
                                { transaction.action === 'mint' && (
                                    <TransactionContainer>
                                        <TransactionContainerColumn>
                                            <TransactionLogo src={require(`images/tokens/${asset.gtoken_img_url}`)}/>
                                        </TransactionContainerColumn>
                                        <TransactionContainerColumn>
                                            <PrimaryLabel>+ {this.parseAmount(transaction.received,1e8)}</PrimaryLabel>
                                            <SecondaryLabel>{asset.g_asset}</SecondaryLabel>
                                        </TransactionContainerColumn>
                                    </TransactionContainer>
                                )}
                                { transaction.action === 'redeem' && (
                                    <TransactionContainer>
                                        <TransactionContainerColumn>
                                            {transaction.type === 'base' && <TransactionLogo src={asset.img_url} />}
                                            {transaction.type === 'underlying' && <TransactionLogo src={asset.native_img_url} />}
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
                                {/* <ActionModal 
                                    {...this.props}
                                    type="redeem"
                                    text="REDEEM"
                                    data={data}
                                    asset={asset}
                                /> */}
                            </CardColumn>
                        </CardRow>
                    </Card>
                )}
            </React.Fragment>
        )
    }
}
