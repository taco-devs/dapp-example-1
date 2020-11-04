import React, { Component } from 'react';
import * as Drawer from '@accessible/drawer'
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styled from 'styled-components';

import { Icon } from 'react-icons-kit';
import {lineChart} from 'react-icons-kit/fa/lineChart';
import {exchange} from 'react-icons-kit/fa/exchange';
import {suitcase} from 'react-icons-kit/fa/suitcase';
import {logout} from 'react-icons-kit/iconic/logout';
import {ic_menu} from 'react-icons-kit/md/ic_menu'
import {ic_settings} from 'react-icons-kit/md/ic_settings'

import {Link} from 'react-router-dom';


const Burger = styled.a`
  color: white;

  &:hover {
    cursor: pointer;
    color: #00d395;
  }
`

const MaskContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  height: 100vh;
  width: 100vw;
  z-index: 120;
`

const Mask = styled.div`
  height: 100vh;
  width: 35vw;
  background-color: black;
  opacity: 0.35;
`

const StyledDrawerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 65vw;
  background: rgb(22,29,107);
  background: radial-gradient(circle, rgba(22,29,107,1) 0%, rgba(11,15,60,1) 100%);
  -webkit-box-shadow: -5px 0px 10px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: -5px 0px 10px 0px rgba(0,0,0,0.75);
  box-shadow: -5px 0px 10px 0px rgba(0,0,0,0.75);
  height: 100vh;
  z-index: 121;
  padding: 2em 1em 1em 1em;
`

const WalletContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 5px;
  background-color: white;
  width: 100%;
  -webkit-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
  box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
  font-size: 0.75em;
`


const BalanceContainer = styled.div`
  display: flex;
  flex: 1.25;
  flex-direction: row;
  justify-content: center;
  background-color: white;
  border-radius: 5px;
  color: black;
  padding: 0.5em 1em 0.5em 1em;
  flex: ${props => props.flex || '1'};
`

const AddressContainer = styled.div`
  display: flex;
  flex: 1.25;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #00d395;
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

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 0 0;
`

const MenuTab = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 120px;
  justify-content: center;
  align-items: center;
  margin: 1em 0 1em 0;
  padding: 0.5em 0 0.5em 0;
  border-radius: 5px;

  &:focus {
    outline-style: none;
    box-shadow: none;
    border-color: transparent;
    background-color: black;
    color: white;
  }

  ${props => props.active && `
    background-color: #00d395;
    -webkit-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 5px 5px rgba(0,0,0,0.75);
  `}
  -moz-transition: background-color 0.15s linear;
  -webkit-transition: background-color 0.15s linear;
  -o-transition: background-color 0.15s linear;
  transition: background-color 0.15s linear;

  &:hover {
    cursor: pointer;
    opacity: ${props => !props.active && '0.65'};
  }
`

const StyledMessage = styled.div`
  margin: 0 1em 0 1em;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
`

const NetworkLabel = styled.p`
  margin: 0 0 0 5px;
  font-size: 0.7em;
  color: #00d395;
`

const NetworkRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 10px 0;
`

const NetworkColumn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 10px 0;
`

const Divider = styled.div`
  height: 2px;
  background-color: white;
  width: 100%;
  margin: 1em 0 1em 0;
`

export default class MenuDrawer extends Component {

    constructor (props) {
        super(props);

        this.containerRef = React.createRef();
    }

    state = {
        open: false,
        active: '/'
    }

    // Detect the active key depending on the route
    componentDidMount = () => {
        const {pathname} = window.location;
        this.setState({active: pathname});
    }

    selectActive = (active) => {
        this.setState({active});
    }


    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }
  
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.containerRef && !this.containerRef.current.contains(event.target)) {
            this.setState({open: false});
        }
    }
  

    toggle = () => {
        this.setState({open: !this.state.open});
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

    connectedNetwork = () => {
        const {network_id} = this.props;
        if (!network_id) return '-';
    
        if (network_id === 'eth') return 'Mainnet';
        if (network_id === 'ropsten') return 'Ropsten';
        if (network_id === 'kovan') return 'Kovan';
        if (network_id === 'rinkeby') return 'Rinkeby';
    
        return network_id;
    }

    
    

    render() {
        const {address, GrowTokenInstance} = this.props;
        const {open, balance, active} = this.state;

        if (GrowTokenInstance && !balance) {
            this.getBalance(GrowTokenInstance);
        }
      
        return (
            <div ref={this.containerRef}>
                <Drawer.Drawer 
                    open={open}
                >
                    <Drawer.Trigger>
                        <Burger
                            onClick={() => this.toggle()}
                        >
                            <Icon icon={ic_menu} size="1.5em"/>
                        </Burger>
                    </Drawer.Trigger>
                
                    <Drawer.Target 
                        placement="right"
                        preventScroll={true}
                    >
                        <MaskContainer>
                            <Mask 
                                onClick={() => this.toggle()}
                            />
                            <StyledDrawerContainer>
                                <NetworkRow>
                                    <NetworkColumn>
                                        <div class="livenow">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>
                                        <NetworkLabel>Connected ( {this.connectedNetwork()} )</NetworkLabel>
                                    </NetworkColumn>
                                    <NetworkColumn
                                        onClick={() => {
                                            this.toggle();
                                            this.props.resetApp();
                                        }}
                                    >
                                        <Icon icon={logout} size="1.25em" style={{color: 'white'}} />
                                    </NetworkColumn>
                                </NetworkRow>
                                <WalletContainer>
                                    <BalanceContainer>
                                        {balance && `${balance} GRO`}
                                    </BalanceContainer>
                                    <AddressContainer flex="1.5">
                                        {address && this.parseAddress(address)}
                                    </AddressContainer>
                                </WalletContainer>
                                <Divider />
                                <Menu>
                                    <StyledLink to="/">
                                        <MenuTab 
                                            active={active === '/'}
                                            onClick={() => this.selectActive('/')}
                                        >
                                            <Icon icon={lineChart} />
                                            <StyledMessage>
                                            <FormattedMessage {...messages.invest} />
                                            </StyledMessage>
                                        </MenuTab>
                                    </StyledLink>
                                    <StyledLink to="/transactions">
                                        <MenuTab
                                            active={active === '/transactions'}
                                            onClick={() => this.selectActive('/transactions')}
                                        >
                                            <Icon icon={exchange} />
                                            <StyledMessage>
                                            <FormattedMessage {...messages.transactions} />
                                            </StyledMessage>
                                        </MenuTab>
                                    </StyledLink>
                                    <StyledLink to="/balance">
                                        <MenuTab
                                            active={active === '/balance'}
                                            onClick={() => this.selectActive('/balance')}
                                        >
                                            <Icon icon={suitcase} />
                                            <StyledMessage>
                                            <FormattedMessage {...messages.balance} />
                                            </StyledMessage>
                                        </MenuTab>
                                    </StyledLink>
                                </Menu>
                            </StyledDrawerContainer>
                        </MaskContainer>
                    </Drawer.Target>
                </Drawer.Drawer>
            </div>
            
        )
    }
}
