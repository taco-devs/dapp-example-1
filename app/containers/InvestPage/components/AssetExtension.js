import React, { Component } from 'react';
import styled from 'styled-components';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
  } from 'recharts';

import { Icon } from 'react-icons-kit';
import {shareSquareO} from 'react-icons-kit/fa/shareSquareO';

import Loader from 'react-loader-spinner';
import moment from 'moment';
  
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
`

const ExtensionColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: ${props => props.align || 'center'};
    flex: 1;
`

const StyledTooltip = styled.div`
  background: rgb(22,29,107);
  border-radius: 5px;
  padding: 0 1em 0 1em;
  font-size: 0.85em;
  color: white;
  border-style: solid;
  border-width: 1px;
  border-color: rgb(22,29,107);
`

 
const StatLabel = styled.b`
    margin: 0 0 5x 0;
    opacity: 0.75;
`

const Stat = styled.p`
    margin: 0;
`

const IconContainer = styled.a`
    
    color: #00d395;

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

const CustomTooltip = ({ active, payload, label, base, g_asset }) => {
    if (active) {
        return (
            <StyledTooltip>
                <p>{`${label}`}</p>
                <p>(G) Rate: {`${payload[0].value} ${base}`}</p>
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

    formatData = () => {
        const {tokenData} = this.props;
        if (!tokenData) return [];
        if (tokenData.length < 1) return [];

        // Calculate 31 days before
        const seconds_in_day = 86400;
        const FIRST_DAY = tokenData[tokenData.length - 1].date - (seconds_in_day * 30);

        // Chart Array
        let chart_data = new Array(30);
        let current_days = 0;

        for (let day of chart_data) {
            const today_timestamp = FIRST_DAY + (seconds_in_day * current_days) + 1;
            const tomorrow_timestamp = today_timestamp + seconds_in_day + 1;
            const day_data = tokenData.find(curr_day => curr_day.date >= today_timestamp && curr_day.date < tomorrow_timestamp );

            let x_axis_label;
            let y_value;

            

            if (day_data) {
                x_axis_label = moment(day_data.date * 1000).format('MMM DD');

                if (day_data.mintTotalReceived > 0 && day_data.mintTotalSent > 0) {
                    y_value = Math.round(day_data.mintTotalSent / day_data.mintTotalReceived * 10000) / 10000;
                } else {
                    y_value = chart_data[current_days - 1].y_value;
                }
            } else {
                x_axis_label = moment(today_timestamp * 1000).format('MMM DD');
                if (current_days > 0) {
                    y_value = chart_data[current_days - 1].y_value;
                } else {
                    y_value = 0;
                }
            }

            chart_data[current_days] = {x_axis_label, y_value};
            current_days++;
        }

        return chart_data;

    }

    render() {
        const {asset, isLoadingChart, total_supply, total_reserve, deposit_fee, withdrawal_fee, tokens} = this.props;
        const data= this.formatData();
        let token;
        if (tokens) {
            token = tokens.find(token => token.symbol === asset.g_asset);
        }
        console.log(token);
        return (
            <ExtensionContainer>
                <Divider />
                <ExtensionRow>
                    <ExtensionColumn align="flex-start">
                        <p>{asset.g_asset} PERFORMANCE</p>
                    </ExtensionColumn>
                    <ExtensionColumn align="flex-end">
                        {data && data.length > 0 && (
                            <p>1 {asset.g_asset} = {data[data.length - 1].y_value} {asset.base_asset}</p>
                        )}
                    </ExtensionColumn>
                </ExtensionRow>
                <ExtensionRow justify="center">
                    {isLoadingChart && (
                        <LoaderContainer>
                            <Loader
                            type="TailSpin"
                            color='#00d395'
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
                                    <YAxis allowDataOverflow type="number" domain={[data[data.length -1].y_value * 0.95, 'dataMax']} hide />
                                    <Tooltip content={<CustomTooltip base={asset.base_asset} g_asset={asset.g_asset} />}/>
                                    <Area type="monotone" dataKey="y_value" stroke="#161d6b" fill="#00d395" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </ExtensionRow>
                <Divider />
                <ExtensionRow
                    margin="1em 0 1em 0"
                >
                    <ExtensionColumn align="flex-start">
                        <StatLabel>TOTAL SUPPLY</StatLabel>
                        <Stat>{token && (token.totalSupply / 1e8).toLocaleString('En-en')} {asset.g_asset}</Stat>
                    </ExtensionColumn>
                    <ExtensionColumn>
                        <StatLabel>TOKENS LOCKED</StatLabel>
                        <Stat>{token && (token.totalReserve / asset.base_decimals).toLocaleString('En-en')} {asset.base_asset}</Stat>
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
                            <IconContainer href={`https://etherscan.io/token/${asset.gtoken_address}`} target="_blank">
                                <Icon icon={shareSquareO} size="1.25em" style={{ margin: '0 5px 0 10px'}}/>
                            </IconContainer>
                        </ExtensionRow>
                        
                    </ExtensionColumn>
                </ExtensionRow>
            </ExtensionContainer>
        )
    }
}
