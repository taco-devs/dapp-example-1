/**
 *
 * StatsContainer
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styled from 'styled-components';

import WalletDashboard from '../WalletDashboard';
import GrowthDashboard from '../GrowthDashboard';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 25vh;
  width: 100%;
  background-color: rgba(0, 0, 0, .15);
  border-radius: 5px;
  margin: 1.5em 0 0 0;
`

class StatsContainer extends React.Component {
  render () {
    return (
      <Container>
        <WalletDashboard {...this.props}/>
        <GrowthDashboard />
      </Container>
    );
  }
  
}

StatsContainer.propTypes = {};

export default StatsContainer;
