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

  state = {
    status: 'NOT_APPROVED',
    hash: null,
  }
  

  getGasInfo = async (method, values, address, web3) => {
    try {
        const gas = await method(...values).estimateGas({from: address});
        const gasPrice = await web3.eth.getGasPrice();
        
        return {gas, gasPrice};
    } catch(e) {
        console.log(e);
        return {
            gas: null, 
            gasPrice: null
        }
    }
}

  handleApprove = async () => {
    const { web3, Network, assetIn, assetOut, liquidity_pool_address, address, handleMultipleChange } = this.props;
    
    if (assetIn === 'GRO') {
      const GContractInstance = await new web3.eth.Contract(Network.growth_token.abi, Network.growth_token.address);
      const totalSupply = await GContractInstance.methods.totalSupply().call();

      const {gas, gasPrice} = await this.getGasInfo(
        GContractInstance.methods.approve,
        [
          liquidity_pool_address, 
          totalSupply
        ], 
        address, 
        web3
      )

      await GContractInstance.methods.approve(liquidity_pool_address, totalSupply).send({from: address, gas, gasPrice})
        .on("transactionHash", (hash) => {
          this.setState({
            status: 'RECEIPT',
            hash
          })
      })
      .on("receipt",  (tx) => {
          // Send the confirmation receipt
          handleMultipleChange({allowance: true});
      })
      .on("confirmation", (confirmation) => {
        handleMultipleChange({allowance: true});
      })
      .on("error", () => {
        this.setState({status: 'NOT_APPROVED'});
      });
    
    } else {

      const asset = Network.available_assets[assetIn];

      const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
      const totalSupply = await GContractInstance.methods.totalSupply().call();

      const {gas, gasPrice} = await this.getGasInfo(
        GContractInstance.methods.approve,
        [
          liquidity_pool_address, 
          totalSupply
        ], 
        address, 
        web3
      );

      await GContractInstance.methods.approve(liquidity_pool_address, totalSupply).send({from: address, gas, gasPrice})
        .on("transactionHash", (hash) => {
          this.setState({
            status: 'RECEIPT',
            hash
          })
      })
      .on("receipt",  (tx) => {
          // Send the confirmation receipt
          handleMultipleChange({allowance: true});
      })
      .on("confirmation", (confirmation) => {
        handleMultipleChange({allowance: true});
      })
      .on("error", () => {
        this.setState({status: 'NOT_APPROVED'});
      });

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
    const {status, hash } = this.state;
    return (
      <ApproveRow
        onClick={(e) => {
          e.stopPropagation();
          if (status === 'NOT_APPROVED') {
            this.setState({status: 'LOADING'});
            this.handleApprove();
          }
          if (status === 'RECEIPT') {
            this.openLink(hash);
          }
          
        }}
      >
          <ApproveConfirmButton >
            {status === 'NOT_APPROVED' && <p>APPROVE TOKENS</p>}
            {status === 'LOADING' && (
              <ApproveAction>
                <ApproveActionColumn flex="5">
                  <p>PLEASE CONFIRM</p>
                </ApproveActionColumn>
                <ApproveActionColumn>
                  <BounceLoader size={30}/>
                </ApproveActionColumn>
              </ApproveAction>
            )}
            {status === 'RECEIPT' && (
              <ApproveAction >
                <ApproveActionColumn >
                  <StyledText>APPROVAL SUBMITTED</StyledText>
                  <ApproveAction>
                    <CustomLink>{this.parseHash(hash)}</CustomLink>
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
