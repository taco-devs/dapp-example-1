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

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
  {
    name: 'Page A', uv: 0, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', uv: 2, pv: 1398, amt: 2210,
  },
  {
    name: 'Page C', uv: 4, pv: 9800, amt: 2290,
  },
  {
    name: 'Page D', uv: 8, pv: 3908, amt: 2000,
  },
  {
    name: 'Page E', uv: 10, pv: 4800, amt: 2181,
  },
  {
    name: 'Page F', uv: 16, pv: 3800, amt: 2500,
  },
  {
    name: 'Page G', uv: 30, pv: 4300, amt: 2100,
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
`

class GrowthDashboard extends React.Component {
  render () {
    return (
      <GrowthContainer>
        <GrowthDashboardHeader>
          <FormattedMessage {...messages.tvl} />
          <FormattedMessage {...messages.more} />
        </GrowthDashboardHeader>
        <GrowthDashboardStats>
          <div style={{ width: '100%', height: 180 }}>
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
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#00d395" />
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
