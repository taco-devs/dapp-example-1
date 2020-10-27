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
import * as Drawer from '@accessible/drawer'
import MenuDrawer from './MenuDrawer';

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

const LogoContainer = styled.a`

`



class Header extends React.Component {

  render () {
    const {address} = this.props;
    return (
      <StyledHeader>
          <LogoContainer href="https://growthdefi.com" target='_blank'>
            <StyledLogo 
              src={require('images/full_logo.png')}
              isMobile={isMobile}
            />
          </LogoContainer>
          {address && isMobile ? (  
              <MenuDrawer 
                {...this.props}
              />
          ) : (
            <ConnectWallet 
              {...this.props}
              isMobile={isMobile}
            />
          )}
      </StyledHeader>
    )
  }

}

export default Header;
