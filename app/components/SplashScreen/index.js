/**
 *
 * SplashScreen
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';

const SplashContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  transition: all 2s ease;
`

const Logo = styled.img`
  height: 120px;
  width: auto;
`

class SplashScreen extends React.Component {
  render() {
    return (
      <SplashContainer>
        <Logo src={require('images/full_logo.png')}/>
      </SplashContainer>
    )
  }
}

SplashScreen.propTypes = {};

export default SplashScreen;
