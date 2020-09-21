import React from 'react';
import { FormattedMessage } from 'react-intl';
import {isMobile} from 'react-device-detect';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.jpg';
import messages from './messages';
import ConnectWallet from '../ConnectWallet';
import {GiHamburgerMenu} from 'react-icons/gi'
import {withWindowDimensions} from '../../utils/withWindowDimensions.js';

import styled from 'styled-components';



const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 1em 0 0 0;
`

const StyledLogo = styled.img`
  display: flex;
  height: ${props => props.isMobile ? '45px' : '60px'};
  width: auto;

  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
`

const Burger = styled.a`
  color: white;

  &:hover {
    cursor: pointer;
    color: #00d395;
  }
`

class Header extends React.Component {

  render () {
    return (
      <StyledHeader>
          <StyledLogo 
            src="https://growthdefi.com/img/logo.png" 
            isMobile={isMobile}
          />
          {isMobile ? (  
            <Burger>
              <GiHamburgerMenu size="1.5em"/>
            </Burger>
          ) : (
            <ConnectWallet {...this.props}/>
          )}
          
      </StyledHeader>
    )
  }

}

export default Header;
