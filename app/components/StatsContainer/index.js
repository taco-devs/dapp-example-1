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
import {isMobile} from 'react-device-detect';

import { Icon } from 'react-icons-kit';
import {ic_visibility_off} from 'react-icons-kit/md/ic_visibility_off';
import {ic_visibility} from 'react-icons-kit/md/ic_visibility'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: ${props => props.isMobile ? '100%' : '275px'};
  width: 100%;
  background-color: rgba(0, 0, 0, .15);
  border-radius: 5px;
  margin: 1.5em 0 0 0;
`

const StatRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 1em 0 1em;
  width: 100%;
  height: 100%;
  font-size: 0.85em;
`

const StatsHeader = styled.p`
  color: white;
`

const StatCol = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
`


class StatsContainer extends React.Component {

  toggleHideStats = () => {
    const {toggleHideStats} = this.props;
    toggleHideStats();
  }

  render () {
    const {hideStats} = this.props;
    return (
      <Container isMobile={isMobile}>
        {isMobile && (
          <StatRow>
            <StatsHeader>STATS</StatsHeader>
            <StatCol>
              <Icon style={{margin: '0 5px 0 0'}} icon={hideStats ? ic_visibility : ic_visibility_off}/>
              <StatsHeader onClick={this.toggleHideStats}>{hideStats ? 'SHOW' : 'HIDE'}</StatsHeader>
            </StatCol> 
          </StatRow>
        )}
        {(!isMobile || !hideStats) && (
          <WalletDashboard {...this.props} />
        )}
        {(!isMobile || !hideStats) && (
          <GrowthDashboard 
            {...this.props} 
            isMobile={isMobile}
          />
        )}
      </Container>
    );
  }
  
}

StatsContainer.propTypes = {};

export default StatsContainer;
