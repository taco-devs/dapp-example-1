import React, { Component } from 'react';
import styled from 'styled-components';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
  } from 'recharts';

import { Icon } from 'react-icons-kit';
import {shareSquareO} from 'react-icons-kit/fa/shareSquareO';

import Loader from 'react-loader-spinner';
import moment from 'moment';
import types from 'contracts/token_types.json';

const dummy = [
    {x_axis_label: 'SEPT 01', y_value: 0, y_mining_value: 0},
    {x_axis_label: 'SEPT 02', y_value: 100, y_mining_value: 0},
]
   
const data = [
    {
        name: 'SEPT 01', uv: 1.1, pv: 2400, amt: 2400,
    },
    {
        name: 'SEPT 03', uv: 1.23, pv: 1398, amt: 2210,
    },
    {
        name: 'SEPT 05', uv: 1.24, pv: 9800, amt: 2290,
    },
    {
        name: 'SEPT 07', uv: 1.3, pv: 3908, amt: 2000,
    },
    {
        name: 'SEPT 08', uv: 1.28, pv: 4800, amt: 2181,
    },
    {
        name: 'SEPT 09', uv: 1.5, pv: 3800, amt: 2500,
    },
    {
        name: 'SEPT 11', uv: 1.645, pv: 4300, amt: 2100,
    },
    {
        name: 'SEPT 13', uv: 1.4, pv: 4500, amt: 2400,
    },
    {
        name: 'SEPT 15', uv: 1.8, pv: 4700, amt: 2210,
    },
    {
        name: 'SEPT 17', uv: 1.7, pv: 5000, amt: 2290,
    },
    {
        name: 'SEPT 19', uv: 1.6, pv: 4600, amt: 2000,
    },
    {
        name: 'SEPT 22', uv: 1.7, pv: 4800, amt: 2181,
    },
    {
        name: 'SEPT 23', uv: 1.75, pv: 4000, amt: 2500,
    },
    {
        name: 'SEPT 24', uv: 2, pv: 6000, amt: 2100,
    }
];


const PrimaryLabel = styled.p`
    color: ${props => props.type ===  types.STKGRO ? 'white' : '#161d6b'};
    margin: 0 1em 0 1em;
    text-align: center;
    ${props => props.size && `font-size: ${props.size}`}
    ${props => props.spacing && `letter-spacing: ${props.spacing};`}
`

const SecondaryLabel = styled.p`
    color: ${props => props.type ===  types.STKGRO ? 'white' : '#161d6b'};
    opacity: 0.75;
    margin: 0 1em 0 1em;
    text-align: center;
    font-size: 0.85em;
    ${props => props.spacing && `letter-spacing: ${props.spacing};`}
`


const ExtensionContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    margin: 0 2em 0 2em;
    color: #161d6b;
`

const Divider = styled.div`
    width: 100%;
    height: 2px;
    background-color: ${props => props.color || '#00d395'}; 
    margin: ${props => props.margin || '0.5em 0 0.5em 0'};
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
    flex: 1;
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

 
const StatLabel = styled.b`
    margin: 0 0 5x 0;
    opacity: 0.75;
`

const Stat = styled.p`
    margin: 0;
`

const IconContainer = styled.a`
    
    color: ${props => props.color || '#00d395'};

    &:hover {
        cursor: pointer;
        color: #161d6b;
    }
`

const LoaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    margin: 1em 0 1em 0;
`

const CustomTooltip = ({ active, payload, label, asset, base, g_asset, hasMiningToken }) => {
    if (active) {
        return (
            <StyledTooltip
                asset={asset}
            >
                <p>{`${label}`}</p>
                {hasMiningToken && (
                    <p>Rate (COMP): {`${payload[0].value} ${base}`}</p>
                )}
                <p>Rate: {`${payload[1].value} ${base}`}</p>
            </StyledTooltip>
        );
    }
  
    return null;
};

export default class AssetExtension extends Component {

    parseAddress = (address) => {
        const front_tail = address.substring(0,5);
        const end_tail = address.substring(address.length - 5, address.length);
        return `${front_tail}...${end_tail}`; 
    }

    getMiningTokenPrice = () => {
        const {relevantPrices} = this.props;
        if (!relevantPrices) return 0;

        const ethPrice = relevantPrices.pairs && relevantPrices.pairs.find(pair => pair.token0.symbol === 'WETH');
        const miningToken = relevantPrices.pairs && relevantPrices.pairs.find(pair => pair.token0.symbol === 'COMP');

        if (ethPrice && miningToken) {
            return ethPrice.token1Price * miningToken.token1Price;
        } else {
            return 0;
        }
    }

    formatData = () => {
        const {tokenData} = this.props;
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

        for (let day of chart_data) {
            const today_timestamp = FIRST_DAY + (seconds_in_day * current_days);
            const tomorrow_timestamp = today_timestamp + seconds_in_day;

            const day_data = tokenData.find(curr_day => curr_day.date > today_timestamp && curr_day.date <= tomorrow_timestamp);

            let x_axis_label;
            let y_value;
            let y_mining_value;

            if (day_data) {
                x_axis_label = moment(day_data.date * 1000).utc(0).format('MMM DD');

                const check_activity = (
                    day_data.mintTotalReceived > 0 || 
                    day_data.redeemTotalReceived > 0 
                )

                if (check_activity) {
                    const avgPrice = day_data.reserve / day_data.supply;

                    const miningFactor = ((day_data.miningTokenBalance / 1e18) * miningPriceUSD) / (day_data.supply / 1e8) / day_data.currentPrice;

                    y_value = Math.round(avgPrice * 10000) / 10000;
                    y_mining_value = Math.round((avgPrice + miningFactor) * 10000) / 10000;
                } else {
                    y_value = chart_data[current_days - 1].y_value;
                    y_mining_value = chart_data[current_days - 1].y_mining_value;
                }
            } else {
                x_axis_label = moment(tomorrow_timestamp * 1000).utc(0).format('MMM DD');
                if (current_days > 0) {
                    y_value = chart_data[current_days - 1].y_value;
                    y_mining_value = chart_data[current_days - 1].y_mining_value;
                } else {
                    y_value = 0;
                    y_mining_value = 0;
                }
            }

            chart_data[current_days] = {x_axis_label, y_value, y_mining_value};
            current_days++;
        }


        return chart_data;
    }

    getDomain = (data) => {
        if (!data || data.length < 1) return [0,0];

        const range = 
            data
                .filter(day => day.y_mining_value > 0)
                .map(day => day.y_mining_value);

        
        let min = Math.min(...range);
        let max = Math.max(...range);

        if (min === max) min = 0;
        
        return [min, max];

    }

    getComposition = () => {
        const {asset, Network} = this.props;
        
        if (!asset.portfolio) return '-';

        return asset.portfolio.map(portfolioAsset => {
            return (
                <ExtensionRow style={{width: 150}}>
                    <img style={{width: 35, height: 35}} src={require(`images/tokens/${Network.available_assets[portfolioAsset.asset].gtoken_img_url}`)}/>
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

    render() {
        const {asset, asset_key, isLoadingChart, tokenData, total_supply, total_reserve, deposit_fee, withdrawal_fee, tokens, getToken} = this.props;
        const data= this.formatData();
        const domain = this.getDomain(data);
        let token;
        if (tokens) {
            token = getToken(asset);
        }
        return (
            <ExtensionContainer>
                {(asset.type === types.PMT || asset.type === types.GETH) && (
                    <Divider />
                )}
                {(asset.type === types.PMT || asset.type === types.GETH) && (
                    <ExtensionRow>
                        <div style={{width: '300px'}}>
                            <p>TOKEN COMPOSITION</p>
                        </div>
                        <ExtensionRow justify="flex-start">
                            {this.getComposition()}
                        </ExtensionRow>
                    </ExtensionRow>
                )}
                <Divider
                    color={asset.type === types.STKGRO && '#ffe391'}
                />
                <ExtensionRow color={asset.type === types.STKGRO && 'white'}>
                    <ExtensionColumn align="flex-start">
                        <p>{asset.g_asset} PERFORMANCE</p>
                    </ExtensionColumn>
                    <ExtensionColumn align="flex-end">
                        {data && data.length > 0 && (
                            <p>1 {asset.g_asset} = {data[data.length - 1].y_value} {asset.base_asset}</p>
                        )}
                    </ExtensionColumn>
                </ExtensionRow >
                <ExtensionRow justify="center" color={asset.type === types.STKGRO && 'white'}>
                    {isLoadingChart && (
                        <LoaderContainer>
                            <Loader
                            type="TailSpin"
                            color={asset.type === types.STKGRO ? '#ffe391' : '#00d395'}
                            height={120}
                            width={120}
                            />
                        </LoaderContainer>
                    )} 
                    {data && data.length > 0 && (
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
                                        interval={2}
                                        padding={{left: 30, right: 30}}
                                        tickMargin={5}

                                    />
                                    <YAxis allowDataOverflow type="number" domain={domain} hide />
                                    <Tooltip content={<CustomTooltip asset={asset} base={asset.base_asset} g_asset={asset.g_asset} hasMiningToken={token && token.hasMiningToken}/>}/>
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
                    )}
                </ExtensionRow>
                <Divider 
                    color={asset.type === types.STKGRO && '#ffe391'}
                />
                <ExtensionRow
                    margin="1em 0 1em 0"
                    color={asset.type === types.STKGRO && 'white'}
                >
                    {token && token.hasMiningToken && (
                        <ExtensionColumn align="flex-start">
                            <StatLabel>THRESHOLD</StatLabel>
                            <Stat>{token && tokenData && tokenData[tokenData.length - 1] && (Math.round(tokenData[tokenData.length - 1].miningTokenBalance / 1e18 * 100) / 100).toLocaleString('En-en')} / 20 COMP</Stat>
                        </ExtensionColumn>
                    )}
                    <ExtensionColumn align="flex-start">
                        <StatLabel>TOTAL SUPPLY</StatLabel>
                        <Stat>{token && Math.round(token.totalSupply / asset.base_decimals).toLocaleString('En-en')} {asset.g_asset}</Stat>
                    </ExtensionColumn>
                    <ExtensionColumn>
                        <StatLabel>TOTAL RESERVE</StatLabel>
                        <Stat>{token && Math.round(token.totalReserve / asset.base_decimals).toLocaleString('En-en')} {asset.base_asset}</Stat>
                    </ExtensionColumn>
                    <ExtensionColumn>
                        <StatLabel>MINTING FEE</StatLabel>
                        <Stat>{token && ((token.depositFee / 1e18) * 100).toFixed(2)}%</Stat>
                    </ExtensionColumn>
                    <ExtensionColumn>
                        <StatLabel>WITHDRAW FEE</StatLabel>
                        <Stat>{token && ((token.withdrawalFee / 1e18) * 100).toFixed(2)}%</Stat>
                    </ExtensionColumn>
                    <ExtensionColumn align="flex-end">
                        <StatLabel>TOKEN ADDRESS</StatLabel>
                        <ExtensionRow justify="flex-end">
                            <Stat>{this.parseAddress(asset.gtoken_address)}</Stat>
                            <IconContainer href={`https://etherscan.io/token/${asset.gtoken_address}`} target="_blank" color={asset.type === types.STKGRO && '#ffe391'}>
                                <Icon icon={shareSquareO} size="1.25em" style={{ margin: '0 5px 0 10px'}}/>
                            </IconContainer>
                        </ExtensionRow>
                        
                    </ExtensionColumn>
                </ExtensionRow>
            </ExtensionContainer>
        )
    }
}
