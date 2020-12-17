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
  background-color: rgb(0,0,0,0.25);
  height: 100%;
  width: 100%;
  border-radius: 5px;
  margin: 0.5em 0 0 0;
  padding: 0 1em 0 1em;
  color: white;
  text-align: center;
`

const StyledLink = styled.a`
  color: #00d395;

  &:hover {
    cursor: pointer;
  }
`

const StyledImage = styled.img`
  height: 30px;
  width: auto;
  margin: 0 1em 0 1em;
`

class Announcement extends React.Component {
  render() {
    return (
      <AnnouncementContainer>
        <p>
          Growth DeFi was <span style={{color: '#00d395'}}>successfully</span> audited by 
          <StyledLink href="https://consensys.net/diligence/" target="_blank">
            <StyledImage src="https://consensys.net/diligence/images/logo/logo.svg" />
          </StyledLink>
          Read the full report{' '}
          <StyledLink href="https://consensys.net/diligence/audits/2020/12/growth-defi-v1/" target="_blank">
            here
          </StyledLink>
        </p>
      </AnnouncementContainer>
    )
  }
}

Announcement.propTypes = {};

export default Announcement;
