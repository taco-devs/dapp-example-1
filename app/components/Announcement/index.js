/**
 *
 * Announcement
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';

const AnnouncementContainer = styled.div`
  font-size: 0.85em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #21262b;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  margin: 0.5em 0 0 0;
  padding: 0 1em 0 1em;
  color: white;
  -webkit-box-shadow: 0px 0px 2.5px 2.5px rgba(0,0,149,0.75);
  -moz-box-shadow: 0px 0px 2.5px 2.5px rgba(0,211,149,0.75);
  box-shadow: 0px 0px 2.5px 2.5px rgba(0,211,149,0.75);
`

const StyledLink = styled.a`
  color: #00d395;

  &:hover {
    cursor: pointer;
  }
`

class Announcement extends React.Component {
  render() {
    return (
      <AnnouncementContainer>
        <p>Growth DeFi will be running a Bug Bounty from 28/10/2020 to 28/11/2020. Check the details <StyledLink>here</StyledLink>. This is a project currently on BETA, please use at your own risk.</p>
      </AnnouncementContainer>
    )
  }
}

Announcement.propTypes = {};

export default Announcement;
