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
  justify-content: center;
  background-color: #00d395;
  border-radius: 5px;
  color: white;
  padding: 0.5em 1em 0.5em 1em;
  -webkit-box-shadow: -5px -1px 5px -1px rgba(0,0,0,0.75);
  -moz-box-shadow: -5px -1px 5px -1px rgba(0,0,0,0.75);
  box-shadow: -5px -1px 5px -1px rgba(0,0,0,0.75);
`

class ConnectWallet extends React.Component {

  state = {
    balance: null,
  }

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

  render () {
    const {address, GrowTokenInstance} = this.props;
    const {balance} = this.state;

    if (GrowTokenInstance && !balance) {
      this.getBalance(GrowTokenInstance);
    }

    return (
      <>
        {address && address.length > 0 ? (
          <WalletContainer>
            <BalanceContainer>
              {balance && `${balance} GRO`}
            </BalanceContainer>
            <AddressContainer>
              {this.parseAddress(address)}
            </AddressContainer>
          </WalletContainer>
        ) : (
          <ConnectButton onClick={this.handleToggleModal}>
            <FormattedMessage {...messages.header} />
          </ConnectButton>
        )}
      </>
    )
  }
}


ConnectWallet.propTypes = {};

export default ConnectWallet;
