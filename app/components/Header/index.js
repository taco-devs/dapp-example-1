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

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${props => props.margin || 0};
  cursor: pointer;
  color: white;
  height: 40px;
  justify-content: center;

  &:hover {
    color: #00d395;
    ${props => props.isSelector && `
        border-bottom-style: solid;
        border-bottom-width: 5px;
        border-bottom-color: #00d395;
    `}
  }

  ${props => props.width || '100%'}
  ${props => props.isSelector && (
    `
      ${props.isSelected && `
        border-bottom-style: solid;
        border-bottom-width: 5px;
        border-bottom-color: #00d395;
      `}
    `
  )}
`

const Text = styled.a`
  text-decoration: none;
  font-size: 1em;
  height: 25px;
  margin: 0.5em 0 0 0;
  color: white;

  &:hover {
    color: #00d395;
  }

`


const LogoContainer = styled.a`

`



class Header extends React.Component {

  render () {
    const {address} = this.props;
    return (
      <StyledHeader>
          <Row>
            <LogoContainer href="https://growthdefi.com" target='_blank'>
              <StyledLogo 
                src={require('images/full_logo.png')}
                isMobile={isMobile}
              />
            </LogoContainer>
            {!isMobile && (
              <Column 
                isSelector
                margin="0 1em 0 1em"
              >
                <Text href="https://governance.growthdefi.com" target="_blank">Governance</Text>
              </Column>
            )}
          </Row>
          
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
