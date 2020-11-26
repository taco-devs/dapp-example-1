/**
 *
 * ActionModal
 *
 */

import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';


import { FormattedMessage } from 'react-intl';
import debounce from 'lodash.debounce';
import messages from './messages';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import {info} from 'react-icons-kit/icomoon/info';
import {exchange} from 'react-icons-kit/fa/exchange'

import SwapSection from './SwapSection';
import SwapSummary from './SwapSummary';

import Loader from 'react-loader-spinner';

const Swapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const InputContainer = styled.div`
  display: flex; 
  flex-direction: row;
  height: 140px;
  padding: 1em 2em 1em 2em;
`

const InputSection = styled.div`
  display: flex; 
  flex-direction: row;
  border-color: #DCDCDC;
  border-width: 3px;
  border-style: solid;
  width: 100%;
  border-radius: 5px;
`

const InputSectionColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${props => props.flex || '1'};
  padding: 0.5em 0.75em 0.25em 0.5em;
  justify-content: space-around;
`

const InputRow = styled.div`
  display: flex;
  flex-direction: row;
`


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    borderWidth: 0,
    padding: 0,
    borderRadius: '5px',
    width: '450px',
    height: '550px',
  },
  overlay: {
    backgroundColor: 'rgb(0,0,0, 0.50)'
  }
};

const initialState =  {
  balanceIn: null,
  balanceOut: null,
  amountInput: null,
  amountOutput: null,
  spotPrice: null,
  spotPrice_rate: null,
  hash: null,
  allowance: true,
  status: 'INPUT', //  INPUT -> APPROVE -> LOADING -> [Close the Modal]
  swapType: 'SEND'
}

class SwapModal extends React.Component {

  state = {
    ...initialState
  }

  handleMultipleChange = (values) => {
    this.setState({...values})
  }

  hasEnoughAllowance = async () => {
    const {assetIn, Network, address, liquidity_pool_address, web3} = this.props;

    if (!assetIn) return;
     
    // Check if its trying to change GRO
    if (assetIn === 'GRO') {
        const asset = Network.growth_token;
        const GContractInstance = await new web3.eth.Contract(asset.abi, asset.address);
        const allowance = await GContractInstance.methods.allowance(address, liquidity_pool_address).call();
        this.setState({
            allowance: allowance > 0,
        })
    } else {
        const asset = Network.available_assets[assetIn];
        const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
        const allowance = await GContractInstance.methods.allowance(address, liquidity_pool_address).call();
        this.setState({
            allowance: allowance > 0,
        })
    }
  } 

  getWei = (value_number, decimals) => {
    const {web3} = this.props;
    if (decimals === 1e18) {
      const value = value_number.toString();
      return web3.utils.toWei(value);
    }
    if (decimals === 1e8) {
      // Horrible hack to avoid precision error on js
      const raw_value = (Math.round(value_number * 10) / 100).toString()
      return web3.utils.toWei(raw_value, 'gwei');
    }
    if (decimals === 1e6) {
      const value = value_number.toString();
      return web3.utils.toWei(value, 'mwei');
    }
  }

  render () {
    const {type, show} = this.props;
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          this.setState({...initialState})
          this.props.toggleModal(null, null, null)
        }}
      >
        <Modal
          isOpen={show}
          // onAfterOpen={afterOpenModal}
          onRequestClose={(e) => {
            e.stopPropagation()
            this.setState({...initialState})
            this.props.toggleModal(null, null, null);
          }}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <Swapper>
            <SwapSection
              {...this.props}
              {...this.state}
              handleMultipleChange={this.handleMultipleChange}
              hasEnoughAllowance={this.hasEnoughAllowance}
              getWei={this.getWei}
            />
            <SwapSummary 
              {...this.props}
              {...this.state}
              handleMultipleChange={this.handleMultipleChange}
            />
          </Swapper>
        </Modal>
      </div>
    );
  }
  
}

SwapModal.propTypes = {
};

export default SwapModal;
