/**
 *
 * SplashScreen
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';

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
        <Loader
          type="ThreeDots"
          color='#00d395'
          height={120}
          width={120}
        />
      </SplashContainer>
    )
  }
}

SplashScreen.propTypes = {};

export default SplashScreen;
