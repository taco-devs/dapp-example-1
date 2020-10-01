/**
 *
 * ConnectWallet
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styled from 'styled-components';
import {FaChevronDown} from 'react-icons/fa';
import {BiExit} from 'react-icons/Bi';
import { HiSwitchHorizontal } from 'react-icons/hi';


const ConnectButton = styled.div`
  display: flex; 
  flex-direction: column;
  justify-content: center;
  border-radius: 5px;
  border-color: #00d395;
  border-width: 3px;
  border-style: solid;
  color: white;
  padding: 0.5em 1em 0.5em 1em;
  font-size: ${props => props.isMobile ? '0.80em' : '1em'};

  &:hover {
    cursor: pointer;
    background-color: #00d395;
  }
`

const WalletContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 5px;
  background-color: white;
  width: 300px;
  -webkit-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
  box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
`


const BalanceContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  background-color: white;
  border-radius: 5px;
  color: black;
  padding: 0.5em 1em 0.5em 1em;
`

const AddressContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.mainnet ? '#00d395' : 'gray'};
  border-radius: 5px;
  color: white;
  padding: 0.5em 1em 0.5em 1em;
  -webkit-box-shadow: -5px -1px 5px -1px rgba(0,0,0,0.75);
  -moz-box-shadow: -5px -1px 5px -1px rgba(0,0,0,0.75);
  box-shadow: -5px -1px 5px -1px rgba(0,0,0,0.75);

  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`

const DropDownContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
`;

const DropDownHeader = styled.div`
  margin-bottom: 0.8em;
  padding: 0.4em 2em 0.4em 1em;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  font-size: 1.3rem;
  color: #3faffa;
  background: #ffffff;
`;

const DropDownListContainer = styled.div`
  position: absolute;
  top: 5em;
  width: 300px;
  z-index: 999;
`;

const DropDownList = styled.ul`
  padding: 0 0 0.25em 0;
  margin: 0;
  padding-left: 1em;
  background-color: ${props => props.mainnet ? '#161d6b' : 'white'};
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 1.3rem;
  font-weight: 500;
  color: ${props => props.mainnet ? 'white' : 'black'};
  -webkit-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
  box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);

  &:first-child {
    padding-top: 0.8em;
  }

`;

const ListItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  list-style: none;
  margin-bottom: 1em;
  font-size: 0.85em;
  
  &:hover {
    ${props => props.hoverable && 'cursor: pointer;' }
    color: ${props => props.mainnet ? '#00d395' : '#161d6b'};
  }
`;

const DropdownLabel = styled.p`
  margin: 0 0 0 1em;
  font-size: 0.85em;
`

const NetworkLabel = styled.p`
  margin: 0 0 0 1em;
  font-size: 0.85em;
  color: ${props => props.mainnet ? '#00d395' : 'black'};
`



class ConnectWallet extends React.Component {

  constructor (props) {
    super(props);
    this.containerRef = React.createRef();
  }

  state = {
    balance: null,
    isOpen: false,
    scroll_y: null,
  }

  componentDidMount() {
      this.prev = window.scrollY;
      document.addEventListener('mousedown', this.handleClickOutside);
      window.addEventListener('scroll', this.handleNavigation);
  }

  componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside);
      window.removeEventListener('scroll', this.handleNavigation);
  }

  handleNavigation = (e) => {
    const window = e.currentTarget;

    if (this.prev < window.scrollY) {
      this.setState({isOpen: false});
    }

    this.prev = window.scrollY;
  };


  handleToggleModal = () => {
    const {toggleModal} = this.props;
    toggleModal();
  }

  parseAddress = (address) => {
    const front_tail = address.substring(0,5);
    const end_tail = address.substring(address.length - 5, address.length);
    return `${front_tail}...${end_tail}`; 
  }

  getBalance = async (GrowTokenInstance) => {
    const {address} = this.props;
    const GROBalance = await GrowTokenInstance.methods.balanceOf(address).call();
    const balance = (GROBalance / 1e18).toLocaleString('En-en');
    this.setState({balance});
  }

  toggleDropdown = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  handleExit = () => {
    const {resetApp} = this.props;
    resetApp();
    this.setState({ isOpen: false });
  }

  handleClickOutside = (event) => {
    if (this.containerRef && !this.containerRef.current.contains(event.target)) {
        this.setState({isOpen: false});
    }
  }

  connectedNetwork = () => {
    const {network_id} = this.props;
    if (!network_id) return '-';

    if (network_id === 'eth') return 'Mainnet';
    if (network_id === 'ropsten') return 'Ropsten';
    if (network_id === 'kovan') return 'Kovan';
    if (network_id === 'rinkeby') return 'Rinkeby';

    return network_id;
  }

  render () {
    const {address, GrowTokenInstance, isMobile, network_id} = this.props;
    const {balance, isOpen} = this.state;

    if (GrowTokenInstance && !balance) {
      this.getBalance(GrowTokenInstance);
    }

    return (
      <div ref={this.containerRef}>
        {address && address.length > 0 ? (
          <DropDownContainer>
            <WalletContainer>
              <BalanceContainer>
                {balance && `${balance} GRO`}
              </BalanceContainer>
              <AddressContainer 
                onClick={this.toggleDropdown}
                mainnet={network_id === 'eth'}
              >
                {this.parseAddress(address)}
                <FaChevronDown />
              </AddressContainer>
            </WalletContainer>

            {isOpen && (
              <DropDownListContainer>
                <DropDownList
                  mainnet={network_id === 'eth'}
                >
                  <ListItem>
                    <div class="livenow">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <NetworkLabel mainnet={network_id === 'eth'}>Connected ( {this.connectedNetwork()} )</NetworkLabel>
                  </ListItem>
                  <ListItem hoverable>
                    <HiSwitchHorizontal />
                    <DropdownLabel>Switch Wallet Provider</DropdownLabel>
                  </ListItem>
                  <ListItem onClick={this.handleExit} hoverable>
                    <BiExit />
                    <DropdownLabel>Exit</DropdownLabel>
                  </ListItem>
                </DropDownList>
              </DropDownListContainer>
            )}
          </DropDownContainer>
          
        ) : (
          <ConnectButton 
            isMobile={isMobile}
            onClick={this.handleToggleModal}
          >
            <FormattedMessage {...messages.header} />
          </ConnectButton>
        )}
      </div>
    )
  }
}


ConnectWallet.propTypes = {};

export default ConnectWallet;
