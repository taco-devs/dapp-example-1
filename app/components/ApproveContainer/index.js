/**
 *
 * ApproveContainer
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

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
  background-color: #00d395;
  padding: 0;
  margin: 1em 0 0 0;
  width: 300px;
  color: white;
  border-width: 3px;
  border-style: solid;
  border-color:#161d6b;
  
  &:hover {
    opacity: 0.85;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  }
`

const ApproveConfirmButton = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #00d395;
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
    color: #161d6b;
    text-decoration: none;

    margin: 0 15px 10px 0;

    &:hover {
      cursor: pointer;
      color: black;
    }
`


class ApproveContainer extends React.Component {

  handleApprove = async () => {
    const { web3, asset, is_native, approveToken, address, updateApprovalBalance } = this.props;

    // const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);

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
      const BaseContractInstance = await new web3.eth.Contract(asset.base_abi, asset.base_address);
      const total_supply = await BaseContractInstance.methods.totalSupply().call();
      await approveToken({
        Contract: BaseContractInstance,
        total_supply,
        address,
        asset,
        updateApprovalBalance
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
    const {currentApproval} = this.props;
    return (
      <ApproveRow
        onClick={() => {
          if (!currentApproval) this.handleApprove();
          if (currentApproval && currentApproval.status === 'receipt') return this.openLink(currentApproval.hash);
        }}
      >
          <ApproveConfirmButton >
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
                    <CustomLink>{this.parseHash(currentApproval.hash)}</CustomLink>
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
