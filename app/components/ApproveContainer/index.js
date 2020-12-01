/**
 *
 * ApproveContainer
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import types from 'contracts/token_types.json';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styled from 'styled-components';
import BounceLoader from "react-spinners/BounceLoader";

import { Icon } from 'react-icons-kit';
import {shareSquareO} from 'react-icons-kit/fa/shareSquareO'
 
const ApproveRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-radius: 5px;
  background-color: ${props => {
    if (props.asset.type === types.STKGRO) return '#ffe391';
    if (props.modal_type === 'mint') return '#00d395';
    if (props.modal_type === 'redeem') return '#161d6b';
  }};
  padding: 0;
  margin: 1em 0 0 0;
  width: 300px;
  color: ${props => props.asset.type === types.STKGRO ? '#21262b' : 'white'};
  border-width: 3px;
  border-style: solid;
  border-color: ${props => {
    if (props.asset.type === types.STKGRO) return '#ffe391';
    if (props.modal_type === 'mint') return '#161d6b';
    if (props.modal_type === 'redeem') return '#00d395';
  }};
  
  &:hover {
    opacity: 0.85;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  }
`

const ApproveConfirmButton = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${props => {
    if (props.asset.type === types.STKGRO) return '#ffe391';
    if (props.modal_type === 'mint') return '#00d395';
    if (props.modal_type === 'redeem') return '#161d6b';
  }};
`

const ApproveAction = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
`

const ApproveActionColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: ${props => props.flex || '1'};
  margin: 0 1em 0 1em;
`

const StyledText = styled.p`
  margin: 10px 0 2.5px 0;
`

const CustomLink = styled.a`
    color: ${props => {
      if (props.asset.type === types.STKGRO) return 'black';
      if (props.modal_type === 'mint') return '#161d6b';
      if (props.modal_type === 'redeem') return '#00d395';
    }};
    text-decoration: none;

    margin: 0 15px 10px 0;

    &:hover {
      cursor: pointer;
      color: black;
    }
`


class ApproveContainer extends React.Component {

  handleApprove = async () => {
    const { web3, asset, is_native, approveToken, address, updateApprovalBalance, bridgeApproval } = this.props;

    if ( is_native ) {
      const UnderlyingContractInstance = await new web3.eth.Contract(asset.underlying_abi, asset.underlying_address);
      const total_supply = await UnderlyingContractInstance.methods.totalSupply().call();
      await approveToken({
        Contract: UnderlyingContractInstance,
        total_supply,
        address,
        asset,
        updateApprovalBalance,
        web3
      })
    } else {

      let abi = bridgeApproval ? asset.gtoken_abi : asset.base_abi;
      let abi_address = bridgeApproval ? asset.gtoken_address : asset.base_address;
      let approval_address = bridgeApproval ? asset.bridge_address : asset.gtoken_address;

      const Contract = await new web3.eth.Contract(abi, abi_address);
      const total_supply = await Contract.methods.totalSupply().call();

      await approveToken({
        Contract,
        total_supply,
        address,
        approval_address,
        updateApprovalBalance,
        web3
      })
    }
  }

  parseHash = (address) => {
    const front_tail = address.substring(0,10);
    const end_tail = address.substring(address.length - 10, address.length);
    return `${front_tail}...${end_tail}`; 
  }

  // open link
  openLink = (hash) => {
    const {network_id} = this.props;

    if (!network_id) window.open('https://etherscan.io');
    if (network_id === 'eth') return window.open(`https://etherscan.io/tx/${hash}`)
    if (network_id === 'kovan') return window.open(`https://kovan.etherscan.io/tx/${hash}`)
  }

  render() {
    const {currentApproval, asset, modal_type} = this.props;
    return (
      <ApproveRow
        asset={asset}
        modal_type={modal_type}
        onClick={() => {
          if (!currentApproval) this.handleApprove();
          if (currentApproval && currentApproval.status === 'receipt') return this.openLink(currentApproval.hash);
        }}
      >
          <ApproveConfirmButton asset={asset} modal_type={modal_type}>
            {!currentApproval && <p>APPROVE TOKENS</p>}
            {currentApproval && currentApproval.status === 'loading' && (
              <ApproveAction>
                <ApproveActionColumn flex="5">
                  <p>PLEASE CONFIRM</p>
                </ApproveActionColumn>
                <ApproveActionColumn>
                  <BounceLoader size={30}/>
                </ApproveActionColumn>
              </ApproveAction>
            )}
            {currentApproval && currentApproval.status === 'receipt' && (
              <ApproveAction >
                <ApproveActionColumn >
                  <StyledText>APPROVAL SUBMITTED</StyledText>
                  <ApproveAction>
                    <CustomLink asset={asset} modal_type={modal_type}>{this.parseHash(currentApproval.hash)}</CustomLink>
                    <Icon icon={shareSquareO} size="1.3em"/>
                  </ApproveAction>
                </ApproveActionColumn>
              </ApproveAction>
            )}
          </ApproveConfirmButton>
      </ApproveRow>
    );
  }
  
}

ApproveContainer.propTypes = {};

export default ApproveContainer;
