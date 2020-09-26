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

const data = [
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
  if (active) {
    return (
      <StyledTooltip>
        <p className="label">{`${data[label].name} - $${payload[0].value.toLocaleString('En-en')} USD`}</p>
      </StyledTooltip>
    );
  }

  return null;
};

class GrowthDashboard extends React.Component {
  render () {
    return (
      <GrowthContainer>
        <GrowthDashboardHeader>
          <FormattedMessage 
            {...messages.tvl} 
            values={{
              growth: isMobile ? 'TVL' : 'GROWTH TVL', 
              value: '$1,237,766.23'
            }}
          />
          <FormattedMessage {...messages.more} />
        </GrowthDashboardHeader>
        <GrowthDashboardStats>
          <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer>
              <AreaChart
                height={180}
                data={data}
                margin={{
                  top: 10, right: 0, left: 0, bottom: 0,
                }}
              >
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                {/* <XAxis dataKey="name" />
                <YAxis /> */}
                <Tooltip content={<CustomTooltip />}/>
                <Area type="monotone" dataKey="uv" stroke="#161d6b" fill="#00d395" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GrowthDashboardStats>
      </GrowthContainer>
    );
  }
}

GrowthDashboard.propTypes = {};

export default GrowthDashboard;
