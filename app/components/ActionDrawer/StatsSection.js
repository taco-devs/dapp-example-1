import React, { Component } from 'react'
import styled from 'styled-components';
import moment from 'moment';
import types from 'contracts/token_types.json';
import { apy_gDAI } from 'containers/InvestPage/apyCalculator';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Loader from 'react-loader-spinner';


const StatsContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    color: white;
    overflow-y: scroll;
`

const StatsDisplay = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #21262b;
    width: 90%;
    margin: 1em;
    border-radius: 5px;
    padding: 1em 0 0 0;
`

const ChartSection = styled.div`
    display: flex;
    flex-direction: column;
`

const StyledTooltip = styled.div`
  background: ${props => props.asset.type === types.STKGRO ? '#ffe391' : 'rgb(22,29,107)'};
  border-radius: 5px;
  padding: 0 1em 0 1em;
  font-size: 0.85em;
  color: ${props => props.asset.type === types.STKGRO ? '#21262b' : 'white'};
  border-style: solid;
  border-width: 1px;
  border-color: ${props => props.asset.type === types.STKGRO ? '#ffe391' : 'rgb(22,29,107)'};
`

const HeaderRow = styled.div`
    display: flex; 
    flex-direction: row;
    justify-content: space-between;
    padding: 1em;
`

const StatRow = styled.div`
    display: flex; 
    flex-direction: row;
    justify-content: space-between;
    flex: 1;
    max-height: 40px;
    padding: 0 1em 0 1em;
`

const TokenContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
`

const Logo = styled.img`
    height: 25px;
    width: auto;
    margin: 0 10px 0 0;
    border-radius: 50%;
    background-color: white;
`

const LoaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    margin: 1em 0 1em 0;
`

const ExtensionRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: ${props => props.justify || 'space-between'};
    margin: ${props => props.margin || '0'};
    ${props => props.color && 'color: white;'}
`

const ExtensionColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: ${props => props.align || 'center'};
    padding: 0 1em 0 1em;
`

const PrimaryLabel = styled.p`
    color: white;
    margin: 0 1em 0 1em;
    text-align: center;
    ${props => props.size && `font-size: ${props.size}`}
    ${props => props.spacing && `letter-spacing: ${props.spacing};`}
`

const SecondaryLabel = styled.p`
    color: white;
    opacity: 0.75;
    margin: 0 1em 0 1em;
    text-align: center;
    font-size: 0.80em;
    ${props => props.spacing && `letter-spacing: ${props.spacing};`}
`

const ContractButton = styled.a`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
    background-color: blue;
    border-radius: 5px;
    text-decoration: none;
    background-color: ${props => props.asset.type === types.STKGRO ? '#ffe391' : '#00d395'};
    color: #21262b;
    margin: 10px 0 10px 0;
`

const CustomTooltip = ({ active, payload, type, label, asset, base, g_asset, hasMiningToken }) => {
    if (active) {
        return (
            <StyledTooltip
                asset={asset}
            >
                <p>{`${label}`}</p>
                {(type === types.TYPE2 || type === types.TYPE_ETH) && (
                    <p>Rate (COMP + gDAI): {`${payload[0].value} ${base}`}</p>
                )}
                {hasMiningToken && (
                    <p>Rate (COMP): {`${payload[1].value} ${base}`}</p>
                )}
                <p>Rate: {`${payload[2].value} ${base}`}</p>
            </StyledTooltip>
        );
    }
  
    return null;
};

export default class StatsSection extends Component {

    componentDidMount = () => {
        const {getTokenStats, asset} = this.props;
        getTokenStats({token: asset.gtoken_address});
    }

    parseAddress = (address) => {
        const front_tail = address.substring(0,5);
        const end_tail = address.substring(address.length - 5, address.length);
        return `${front_tail}...${end_tail}`; 
    }

    getMiningTokenPrice = () => {
        const {relevantPrices} = this.props;
        if (!relevantPrices) return 0;

        const miningToken = relevantPrices['compound-governance-token'];

        if (miningToken) {
            return miningToken.usd;
        } else {
            return 0;
        }
    }

    getGDAIPrice = () => {
        const {relevantPrices} = this.props;
        if (!relevantPrices) return 0;

        return relevantPrices['dai'].usd;
    }

    getDailyDaiFactor = () => {
        const {tokens, relevantPrices} = this.props;
        const apy = apy_gDAI(tokens, relevantPrices) / 365 / 100;
        return apy;
    }

    formatData = () => {
        const {tokenData, asset} = this.props;
        if (!tokenData) return [];
        if (tokenData.length < 1) return [];

        // Get MiningTokenPrice
        const miningPriceUSD = this.getMiningTokenPrice();

        // Calculate 31 days before
        const seconds_in_day = 86400;
        let TODAY = new Date();
        TODAY = new Date(TODAY.getTime() + TODAY.getTimezoneOffset() * 60000);
        TODAY.setHours(0,0,0,0);
        const TODAY_DATE = Math.round(TODAY.getTime() / 1000);
        const FIRST_DAY = TODAY_DATE - (seconds_in_day * 30); 

        // Chart Array
        let chart_data = new Array(30);
        let current_days = 0;

        const dailyDAIFactor = this.getDailyDaiFactor();

        for (let day of chart_data) {
            const today_timestamp = FIRST_DAY + (seconds_in_day * current_days);
            const tomorrow_timestamp = today_timestamp + seconds_in_day;

            const day_data = tokenData.find(curr_day => curr_day.date > today_timestamp && curr_day.date <= tomorrow_timestamp);

            let x_axis_label;
            let y_value;
            let y_mining_value;
            let y_reserve_value;

            if (day_data) {
                x_axis_label = moment(day_data.date * 1000).utc(0).format('MMM DD');

                const check_activity = (
                    day_data.mintTotalReceived > 0 || 
                    day_data.redeemTotalReceived > 0 
                )

                if (check_activity) {
                    const avgPrice = day_data.reserve / day_data.supply;

                    // If it's a type 2 divide the gDAI factor
                    let gDAIFactor = 0;
                    if (asset.type === types.TYPE2 || asset.type === types.TYPE_ETH) {
                        const gdai_price = this.getGDAIPrice();
                        gDAIFactor = gdai_price * (day_data.gDAIReserve / 1e18) / (day_data.supply / 1e8) / day_data.currentPrice * dailyDAIFactor;
                    }

                    const miningFactor = ((day_data.miningTokenBalance / 1e18) * miningPriceUSD) / (day_data.supply / 1e8) / day_data.currentPrice;

                    y_value = Math.round(avgPrice * 10000) / 10000;
                    y_mining_value = Math.round((avgPrice + miningFactor) * 10000) / 10000;
                    y_reserve_value = Math.round((y_mining_value + gDAIFactor) * 10000) / 10000;
                } else {
                    y_value = chart_data[current_days - 1].y_value;
                    y_mining_value = chart_data[current_days - 1].y_mining_value;
                    y_reserve_value = chart_data[current_days - 1].y_reserve_value;
                }
            } else {
                x_axis_label = moment(tomorrow_timestamp * 1000).utc(0).format('MMM DD');
                if (current_days > 0) {
                    y_value = chart_data[current_days - 1].y_value;
                    y_mining_value = chart_data[current_days - 1].y_mining_value;
                    y_reserve_value = chart_data[current_days - 1].y_reserve_value;
                } else {
                    y_value = 0;
                    y_mining_value = 0;
                    y_reserve_value = 0;
                }
            }

            chart_data[current_days] = {x_axis_label, y_value, y_mining_value, y_reserve_value};
            current_days++;
        }


        return chart_data;
    }

    getDomain = (data) => {
        if (!data || data.length < 1) return [0,0];

        const min_range = 
            data
                .filter(day => day.y_value > 0)
                .map(day => day.y_value);
        
        const max_range = 
            data
                .filter(day => day.y_reserve_value > 0)
                .map(day => day.y_reserve_value);

        
        let min = Math.min(...min_range);
        let max = Math.max(...max_range);

        if (min === max) min = 0;
        
        return [min, max];

    }

    getComposition = () => {
        const {asset, Network} = this.props;
        
        if (!asset.portfolio) return '-';

        return asset.portfolio.map(portfolioAsset => {
            return (
                <ExtensionRow style={{width: 150}}>
                    <img style={{width: 35, height: 35, background: 'white', borderRadius: '50%'}} src={require(`images/tokens/${Network.available_assets[portfolioAsset.asset].gtoken_img_url}`)}/>
                    <ExtensionColumn>
                        <PrimaryLabel>
                            {portfolioAsset.percentage} %
                        </PrimaryLabel>
                        <SecondaryLabel>
                            {Network.available_assets[portfolioAsset.asset].g_asset}
                        </SecondaryLabel>
                    </ExtensionColumn>
                </ExtensionRow>
            )
        })
    }

    getToken = (asset) => {
        const {tokens} = this.props;

        if (!tokens) return;

        let token;

        // Try to find by name
        token = tokens.find(token =>  token.name === asset.contract_name);

        // If not default to gtoken name
        if (!token) {
            token = tokens.find(token => token.symbol.toUpperCase() === asset.g_asset.toUpperCase());
        }

        return token;
    } 

    render() {
        const {asset, tokens, getToken} = this.props;
        const data= this.formatData();
        const domain = this.getDomain(data);
        let token;
        if (tokens) {
            token = this.getToken(asset);
        }
        return (
            <StatsContainer>
                <StatsDisplay>
                    <HeaderRow>
                        <TokenContainer>
                            <Logo src={require(`images/tokens/${asset.gtoken_img_url}`)}/>
                            {asset.g_asset}
                        </TokenContainer>
                        <p style={{margin: 0}}>
                            {`${Math.round(token.totalReserve / token.totalSupply * 1e4) / 1e4} ${asset.base_asset}`}
                        </p>
                    </HeaderRow>
                    {data && data.length > 0 ? (
                        <div style={{ width: '100%', height: 200}}>
                            <ResponsiveContainer>
                                <AreaChart
                                        height={180}
                                        data={data}
                                        margin={{
                                            top: 10, right: 0, left: 0, bottom: 0,
                                        }}
                                >
                                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                                    <XAxis 
                                        dataKey="x_axis_label"
                                        tickLine={false}
                                        interval={15}
                                        padding={{left: 0, right: 0}}
                                        tickMargin={5}
                                        hide
                                    />
                                    <YAxis allowDataOverflow type="number" domain={domain} hide />
                                    <Tooltip content={<CustomTooltip asset={asset} type={asset.type} base={asset.base_asset} g_asset={asset.g_asset} hasMiningToken={token && token.hasMiningToken}/>}/>
                                    <Area type="monotone" dataKey="y_reserve_value" stroke="#ffe391" fill="#ffe391" />
                                    <Area type="monotone" dataKey="y_mining_value" stroke="#00d395" fill="#161d6b" />
                                    <Area 
                                        type="monotone" 
                                        dataKey="y_value" 
                                        stroke={asset.type === types.STKGRO ? '#ffe391' : "#161d6b"} 
                                        fill={asset.type === types.STKGRO ? '#ffe391' : "#00d395"}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <LoaderContainer>
                            <Loader
                                type="TailSpin"
                                color={asset.type === types.STKGRO ? '#ffe391' : '#00d395'}
                                height={120}
                                width={120}
                            />
                        </LoaderContainer>
                    )}
                    {(asset.type === types.PMT || asset.type === types.GETH) && (
                        <ExtensionColumn>
                            <div style={{width: '300px'}}>
                                <p>TOKEN COMPOSITION</p>
                            </div>
                            <ExtensionRow justify="flex-start">
                                {this.getComposition()}
                            </ExtensionRow>
                        </ExtensionColumn>
                    )}
                    <StatRow>
                        <p>Total Supply</p>
                        <p>{token ? `${(Math.round(token.totalSupply / asset.base_decimals * 100) / 100).toLocaleString('en-En')} ${asset.g_asset}` : '-'}</p>
                    </StatRow>
                    <StatRow>
                        <p>Total Reserve</p>
                        <p>{token ? `${(Math.round(token.totalReserve / asset.underlying_decimals * 100) / 100).toLocaleString('en-En')} ${asset.base_asset}` : '-'}</p>
                    </StatRow>
                    <StatRow>
                        <p>Deposit Fee</p>
                        <p>{token ? `${token.depositFee / 1e18 * 100} %` : '-'}</p>
                    </StatRow>
                    <StatRow>
                        <p>Withdraw Fee</p>
                        <p>{token ? `${token.withdrawalFee / 1e18 * 100} %` : '-'}</p>
                    </StatRow>
                    {token && token.hasMiningToken && (
                        <StatRow>
                            <p>Threshold</p>
                            <p>{token ? `${Math.round(token.miningTokenBalance / 1e18 * 100) / 100} / 20 COMP` : '-'}</p>
                        </StatRow>
                    )}
                    <StatRow>
                        <p>Contract</p>
                        <p>{this.parseAddress(token.id)}</p>
                    </StatRow>
                    <StatRow>
                        <ContractButton asset={asset} href={`https://etherscan.io/address/${token.id}`} target="_blank">
                            VIEW CONTRACT
                        </ContractButton>
                    </StatRow>
                </StatsDisplay>
            </StatsContainer>
        )
    }
}
