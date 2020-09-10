import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.jpg';
import messages from './messages';

import styled from 'styled-components';

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 1em 0 0 0;
`

const StyledLogo = styled.img`
  display: flex;
  height: 60px;
  width: auto;
`

class Header extends React.Component {

  render () {
    return (
      <StyledHeader>
          <StyledLogo src="https://growthdefi.com/img/logo.png" />
          <StyledLogo src="https://growthdefi.com/img/logo.png" />
      </StyledHeader>
    )
  }

}

export default Header;
