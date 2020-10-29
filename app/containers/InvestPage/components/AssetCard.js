import React, { Component } from 'react';
import styled from 'styled-components';
import ActionModal from 'components/ActionModal';
import ActionDrawer from 'components/ActionDrawer';
import AssetExtension from './AssetExtension';

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

export default class AssetCard extends Component {

    state = {
        isMobileDrawerOpen: false,
        total_supply: null, 
        deposit_fee: null, 
        withdrawal_fee: null,
        total_reserve: null,
    }

    componentDidMount = () => {
        // this.fetchSupply();
    }

    fetchSupply = async () => {

        const { asset, web3, address } = this.props;

        const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);

         const total_supply = await GContractInstance.methods.totalSupply().call();
         const deposit_fee = await GContractInstance.methods.depositFee().call();
         const withdrawal_fee = await GContractInstance.methods.withdrawalFee().call();
         const total_reserve = await GContractInstance.methods.totalReserve().call(); 
    
         this.setState({
             total_supply, 
             deposit_fee, 
             withdrawal_fee,
             total_reserve,
        });
    }

    toggleMobileDrawer = () => {
        this.setState({isMobileDrawerOpen: !this.state.isMobileDrawerOpen});
    }

    handleToggleExtension = () => {
        const {toggleExtension, asset} = this.props;
        toggleExtension(asset);
    }

    calculateMarketCap = (asset, balances, total_supply) => {
        const {ethPrice} = this.props;
        
        if (!balances || !total_supply) return '-';

        const asset_data = balances.find(balance => balance.name === asset.g_asset);
    
        if (!asset_data || asset_data.base_price_eth <= 0) return 'N/A'

        const market_cap = (Number(total_supply) / 1e8) / Number(asset_data.base_price_eth) * ethPrice;

        if (!market_cap || market_cap <= 1) return 'N/A'


        return `$${market_cap.toLocaleString('en-En')}`;
    }

    getMarketSize = () => {
        const {asset, tokens, prices} = this.props;

        if (!prices || !tokens) return '-';

        const token = tokens.find(token => token.symbol === asset.g_asset);

        if (!token) return '-';
        const asset_data = prices.markets && prices.markets.find(market => market.symbol === asset.base_asset);

        if (!asset_data) return '-';
        const reservePrice = Number(asset_data.exchangeRate) / Number(asset_data.underlyingPriceUSD);
        const market_cap = (Number(token.totalReserve) / 1e8) * reservePrice;

        if (!market_cap || market_cap <= 1) return 'N/A'

        return `$${Math.round(market_cap).toLocaleString('en-En')}`;
    }

    getSupply = () => {
        const {tokens, asset} = this.props;
        if (!tokens) return '-'
        
        const token = tokens.find(token => token.symbol === asset.g_asset);

        if (!token) return '-';

        return (Math.round(token.totalSupply / 1e8)).toLocaleString('En-en');
    }

    calculateAvgAPY = () => {
        const {tokens, asset} = this.props;
        if (!tokens) return '-'
        
        const token = tokens.find(token => token.symbol === asset.g_asset);

        if (!token) return '-';

        const {tokenDailyDatas} = token;
        if (!token) return '-';

        const today = tokenDailyDatas[0];
        const yesterday = tokenDailyDatas[1];

        const increase = ((today.avgPrice / yesterday.avgPrice) - 1) * 100;
        return Math.round(increase * 1000) / 1000;
    }

    calculate7DAPY = () => {
        const {tokens, asset} = this.props;
        if (!tokens) return '-'
        
        const token = tokens.find(token => token.symbol === asset.g_asset);

        if (!token) return '-';

        const {tokenDailyDatas} = token;
        if (!token) return '-';

        const today = tokenDailyDatas[0];
        const yesterday = tokenDailyDatas[tokenDailyDatas.length - 1];

        const increase = ((today.avgPrice / yesterday.avgPrice) - 1) * 100;
        return Math.round(increase * 1000) / 1000;
    }

    render() {
        const {asset, data, balances, isMobile, asset_key, currentOpenExtension} = this.props;
        const {isMobileDrawerOpen, total_supply} = this.state;
        
        return (
            <React.Fragment>
                {isMobile ? (
                    <ActionDrawer
                        type="mint"
                        text="MINT"
                        data={data}
                        asset={asset}
                        // toggleMobileDrawer={this.toggleMobileDrawer}
                        isMobileDrawerOpen={isMobileDrawerOpen}
                    >
                        <Card 
                            isMobile={isMobile}
                            // onClick={this.toggleMobileDrawer}
                        >
                            <CardRow>
                                <CardColumn
                                    direction="row"
                                    align="center"
                                    justify="flex-start"
                                    margin="0 0 0 1em"
                                >
                                    {asset.gtoken_img_url && (
                                        <AssetLogo src={require(`images/tokens/${asset.gtoken_img_url}`)} isMobile={isMobile} />
                                    )}
                                    <CardColumn>
                                        <PrimaryLabel>{asset.g_asset}</PrimaryLabel>
                                        <SecondaryLabel>{asset.base_asset}</SecondaryLabel>
                                    </CardColumn>
                                    
                                </CardColumn>
                                <CardColumn 
                                    direction="column"
                                >
                                    <PrimaryLabel>{this.getMarketSize()}</PrimaryLabel>
                                    <SecondaryLabel>{this.getSupply()} {asset.g_asset}</SecondaryLabel>
                                </CardColumn>
                                <CardColumn 
                                    direction="column"
                                >
                                <PrimaryLabel>{this.calculateAvgAPY()}% AVG</PrimaryLabel>
                                <SecondaryLabel>{this.calculate7DAPY()}% 7D</SecondaryLabel>
                                </CardColumn>
                            </CardRow>
                            
                        </Card>
                    </ActionDrawer>
                ) : (
                    <Card 
                        isMobile={isMobile}
                        isOpen={currentOpenExtension === asset_key}
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
                            >   
                                {asset.gtoken_img_url && (
                                    <AssetLogo src={require(`images/tokens/${asset.gtoken_img_url}`)} isMobile={isMobile} />
                                )}
                                <PrimaryLabel>{asset.g_asset} {!isMobile && '/'} {asset.base_asset}</PrimaryLabel>
                            </CardColumn>
                            <CardColumn 
                                direction="column"
                            >
                                <PrimaryLabel>{this.getMarketSize()}</PrimaryLabel>
                                <SecondaryLabel>{this.getSupply()} {asset.g_asset}</SecondaryLabel>
                            </CardColumn>
                            <CardColumn 
                                direction="column"
                            >
                                <PrimaryLabel>{this.calculateAvgAPY()}% AVG</PrimaryLabel>
                                <SecondaryLabel>{this.calculate7DAPY()}% 7D</SecondaryLabel>
                            </CardColumn>
                            <CardColumn 
                                direction="row"
                            >
                                <ActionModal 
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
                            </CardColumn>
                        </CardRow>
                        {currentOpenExtension === asset_key && ( 
                            <CardRow>
                                <AssetExtension 
                                    {...this.props}
                                    {...this.state}
                                    asset={asset}
                                />
                            </CardRow>
                        )}
                    </Card>
                )}
            </React.Fragment>
        )
    }
}
