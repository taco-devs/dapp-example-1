/**
 *
 * WalletDashboard
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styled from 'styled-components';
import {isMobile} from 'react-device-detect';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import moment from 'moment';

const data_dummy = [
  {
    name: 'SEPT 01', uv: 0, pv: 2400, amt: 2400,
  },
  {
    name: 'SEPT 03', uv: 200000, pv: 1398, amt: 2210,
  },
  {
    name: 'SEPT 05', uv: 400000, pv: 9800, amt: 2290,
  },
  {
    name: 'SEPT 07', uv: 800000, pv: 3908, amt: 2000,
  },
  {
    name: 'SEPT 08', uv: 1000000, pv: 4800, amt: 2181,
  },
  {
    name: 'SEPT 09', uv: 1600000, pv: 3800, amt: 2500,
  },
  {
    name: 'SEPT 11', uv: 3000000, pv: 4300, amt: 2100,
  },
  {
    name: 'SEPT 13', uv: 1800000, pv: 4500, amt: 2400,
  },
  {
    name: 'SEPT 15', uv: 2000000, pv: 4700, amt: 2210,
  },
  {
    name: 'SEPT 17', uv: 2500000, pv: 5000, amt: 2290,
  },
  {
    name: 'SEPT 01', uv: 3200000, pv: 4600, amt: 2000,
  },
  {
    name: 'SEPT 01', uv: 4500000, pv: 4800, amt: 2181,
  },
  {
    name: 'SEPT 01', uv: 4000000, pv: 4000, amt: 2500,
  },
  {
    name: 'SEPT 01', uv: 3000000, pv: 6000, amt: 2100,
  },
];

const GrowthContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
  margin: 1em;
  border-radius: 5px;
`
const GrowthDashboardHeader = styled.div`
  display: flex;
  font-size: ${props => props.isMobile ? '0.85em' : '1em'}
  flex-direction: row;
  justify-content: space-between;
  padding: 0.5em 0.5em 0 0.5em;
  color: white;
`

const GrowthDashboardStats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  background-color: white;
  border-radius: 5px;
  margin: 0.5em 0 0 0;
  width: 100%;
  color: white;
  -webkit-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
  box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
`

const StyledTooltip = styled.div`
  background: rgb(22,29,107);
  border-radius: 5px;
  padding: 0 1em 0 1em;
  color: white;
  border-style: solid;
  border-width: 1px;
  border-color: rgb(22,29,107);
`

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload[0]) {
    return (
      <StyledTooltip>
       <p className="label">{`${payload[0].payload.x_axis_label} - $${(Math.round(payload[0].payload.y_value * 100) / 100).toLocaleString('En-en')} USD`}</p> 
      </StyledTooltip>
    );
  }

  return null;
};

class GrowthDashboard extends React.Component {

  parseTVL = (value) => {
    return Math.round(value).toLocaleString('en-En')
  }

  formatData = () => {
    const {tokenData} = this.props;
    if (!tokenData) return [];
    if (tokenData.length < 1) return [];

    // Calculate 31 days before
    const seconds_in_day = 86400;
    let TODAY = new Date();
    TODAY = new Date(TODAY.getTime() + TODAY.getTimezoneOffset() * 60000);
    TODAY.setHours(0,0,0,0);
    const TODAY_DATE = Math.round(TODAY.getTime() / 1000);
    const FIRST_DAY = TODAY_DATE - (seconds_in_day * 30);

    // Chart Array
    let chart_data = new Array(90);
    let current_days = 0;


    for (let day of chart_data) {
        const today_timestamp = FIRST_DAY + (seconds_in_day * current_days);
        const tomorrow_timestamp = today_timestamp + seconds_in_day;

        const day_data = tokenData.find(curr_day => curr_day.date > today_timestamp && curr_day.date <= tomorrow_timestamp);

        let x_axis_label;
        let y_value;

        if (day_data) {
            x_axis_label = moment(day_data.date * 1000).utc(0).format('MMM DD');

            if (day_data.mintTotalReceived > 0 && day_data.mintTotalSent > 0) {
                y_value = Math.round(day_data.avgPrice * 10000) / 10000;
            } else {
                y_value = chart_data[current_days - 1].y_value;
            }
        } else {
            x_axis_label = moment(tomorrow_timestamp * 1000).utc(0).format('MMM DD');
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

  parseTVLData = (tvl_history) => {
    try {

    if (!tvl_history) return [];
    if (tvl_history.length < 1) return [];

    const SECONDS_IN_DAY = 86400;
    let TODAY = new Date();
    TODAY = new Date(TODAY.getTime() + TODAY.getTimezoneOffset() * 60000);
    TODAY.setHours(0,0,0,0);
    const TODAY_DATE = Math.round(TODAY.getTime() / 1000);
    
    let FIRST_DAY = new Date(tvl_history[0].date * 1000);
    FIRST_DAY.setHours(0,0,0,0);
    const FIRST_DATE = Math.round(FIRST_DAY.getTime() / 1000);

    const dayDelta = (TODAY_DATE - FIRST_DATE) / SECONDS_IN_DAY;
    
    // Chart Array
    let chart_data = new Array(dayDelta);
    let current_days = 0;


    for (let day of chart_data) {
      const today_timestamp = FIRST_DATE + (SECONDS_IN_DAY * current_days);
      const tomorrow_timestamp = today_timestamp + SECONDS_IN_DAY;

      const day_data = tvl_history.find(curr_day => curr_day.date > today_timestamp && curr_day.date <= tomorrow_timestamp);

      let x_axis_label;
      let y_value;

      if (day_data) {
          x_axis_label = moment((day_data.date + SECONDS_IN_DAY) * 1000).format('MMM DD');
          y_value = day_data.cumulativeTotalValueLockedUSD;
      } else {
          x_axis_label = moment(tomorrow_timestamp * 1000).utc(0).format('MMM DD');
          y_value = chart_data[current_days - 1].y_value;
      }

      chart_data[current_days] = {x_axis_label, y_value};
      current_days++;
    }

    return chart_data;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  getMax = (tvl_history) => {

    const data = 
      tvl_history
        .map(dayData => Number(Math.round(dayData.cumulativeTotalValueLockedUSD)));


    
    return Math.max(...data);
  }



    render () {
    const {tvl, tvl_history} = this.props;
    const data = this.parseTVLData(tvl_history);
    const growth = isMobile ? 'TVL' : 'GROWTH TVL';
    const value = tvl ? this.parseTVL(tvl.totalValueLockedUSD) : '-';
    return (
      <GrowthContainer>
        <GrowthDashboardHeader>
          {/* <FormattedMessage 
            {...messages.tvl} 
            values={{
              growth: isMobile ? 'TVL' : 'GROWTH TVL', 
              value: tvl ? `$ ${this.parseTVL(tvl.totalValueLockedUSD)} USD` : '-'
            }}
          /> */}
          <span>{growth} ( <span style={{letterSpacing: '2.5px'}}>$ {value} USD</span> )</span>
        </GrowthDashboardHeader>
        <GrowthDashboardStats>
          {data && data.length > 0 && (
            <div style={{ width: '100%', height: isMobile ? '180px' : '100%' }}>
              <ResponsiveContainer>
                <AreaChart
                  height={180}
                  data={data}
                  margin={{
                    top: 10, right: 0, left: 0, bottom: 0,
                  }}
                >
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey="x_axis_label" hide={true}/>
                  <YAxis hide={true} domain={[0, this.getMax(tvl_history)]}/>
                  <Tooltip content={<CustomTooltip />}/>
                  <Area type="monotone" dataKey="y_value" stroke="#161d6b" fill="#00d395" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </GrowthDashboardStats>
      </GrowthContainer>
    );
  }
}

GrowthDashboard.propTypes = {};

export default GrowthDashboard;
