/**
 *
 * Navbar
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styled from 'styled-components';
import { BiLineChart, BiTransfer } from 'react-icons/bi';
import { FaVoteYea } from 'react-icons/fa';
import { MdAccountBalanceWallet } from 'react-icons/md';

const NavbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1.5em 1em 0 1em;
  padding: 0 0 1em 0;
  color: white;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: white;
`

const NavbarTab = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 120px;
  justify-content: space-around;
  align-items: center;
  margin: 0 1.5em 0 1.5em;
  padding: 0.5em 1em 0.5em 1em;
  border-radius: 5px;
  ${props => props.active && `
    background-color: #00d395;
    -webkit-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
  `}
  -moz-transition: background-color 0.25 linear;
  -webkit-transition: background-color 0.25s linear;
  -o-transition: background-color 0.25 linear;
  transition: background-color 0.25 linear;

  &:hover {
    cursor: pointer;
    opacity: ${props => !props.active && '0.65'};
  }
`



const StyledMessage = styled.div`
  margin: 0 1em 0 1em;
`

class Navbar extends React.Component {

  state = {
    active: '1',
  }

  selectActive = (active) => {
    this.setState({active})
;  }

  render () {
    const {active} = this.state;
     return ( 
      <NavbarContainer>
        <NavbarTab 
          active={active === '1'}
          onClick={() => this.selectActive('1')}
        >
          <BiLineChart />
          <StyledMessage>
            <FormattedMessage {...messages.invest} />
          </StyledMessage>
        </NavbarTab>
        <NavbarTab
          active={active === '2'}
          onClick={() => this.selectActive('2')}
        >
          <FaVoteYea />
          <StyledMessage>
            <FormattedMessage {...messages.vote} />
          </StyledMessage>
        </NavbarTab>
        <NavbarTab
          active={active === '3'}
          onClick={() => this.selectActive('3')}
        >
          <BiTransfer />
          <StyledMessage>
            <FormattedMessage {...messages.transactions} />
          </StyledMessage>
        </NavbarTab>
        <NavbarTab
          active={active === '4'}
          onClick={() => this.selectActive('4')}
        >
          <MdAccountBalanceWallet />
          <StyledMessage>
            <FormattedMessage {...messages.balance} />
          </StyledMessage>
        </NavbarTab>
      </NavbarContainer>
    );
  }
 
}

Navbar.propTypes = {};

export default Navbar;
