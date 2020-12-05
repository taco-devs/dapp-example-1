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
import types from 'contracts/token_types.json';

import Loader from 'react-loader-spinner';

import ModalHeader from './ModalHeader';
import Balance from './Balance';
import AmountInput from './AmountInput';
import CalcToggle from './CalcToggle';
import SelectedAsset from './SelectedAsset';
import AssetTypeToggle from './AssetTypeToggle';
import Summary from './Summary';

const ActionButton = styled.div`
  display: flex; 
  flex-direction: row;
  justify-content: center;
  font-size: 0.85em;

  ${props => {
    if (props.type === 'mint') {
      return `
        background-color: ${props.asset.type === types.STKGRO ? '#ffe391' : '#00d395'};
        border-color: ${props.asset.type === types.STKGRO ? '#ffe391' : '#00d395'};
        border-width: 3px;
        border-style: solid;
        margin: 0 0.5em  0 0.5em;
        padding: 0.5em 1em 0.5em 1em;
        color: ${props.asset.type === types.STKGRO ? '#21262b' : 'white'};
        border-radius: 5px;
        min-width: 100px;
      
        &:hover {
          cursor: pointer;
          background-color: ${props.asset.type === types.STKGRO ? '#21262b' : 'white'};
          color: ${props.asset.type === types.STKGRO ? '#ffe391' : '#00d395'};
        }
      `
    } 
    if (props.type === 'redeem') {
      return `
        background-color: ${props.asset.type === types.STKGRO ? '#21262b' : 'white'};
        border-color: ${props.asset.type === types.STKGRO ? '#ffe391' : '#161d6b'};
        border-width: 3px;
        border-style: solid;
        margin: 0 0.5em 0 0.5em ;
        padding: 0.5em 0 0.5em 0;
        color: ${props.asset.type === types.STKGRO ? '#ffe391' : '#161d6b'};
        border-radius: 5px;
        min-width: 100px;
      
        &:hover {
          cursor: pointer;
          background-color: ${props.asset.type === types.STKGRO ? '#ffe391' : '#161d6b'};
          color: ${props.asset.type === types.STKGRO ? '#21262b' : 'white'};
        }
      `
    }
  } 
}
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

const toggleNativeAvailable = [
  types.TYPE1,
  types.TYPE_ETH
]

class ActionModal extends React.Component {

  state = {
    show: false,
    isLoadingCalc: false,
    isLoading: false,
    modal_type: 'mint',
    // Calc from Cost
    value_base: '',
    value_native: '',
    value_redeem: '',
    // Calc from Shares
    shares_value_base: '',
    shares_value_native: '',
    shares_value_base_redeem: '',
    shares_value_native_redeem: '',
    is_native: false,
    underlying_balance: null,
    asset_balance: null,
    total_supply: null,
    deposit_fee: null,
    withdrawal_fee: null,
    exchange_rate: null,
    total_reserve: null,
    total_reserve_underlying: null,
    total_native: null,
    total_base: null,
    total_native_redeem: null,
    total_native_cost_redeem: null,
    total_base_redeem: null,
    underlying_conversion: null,
    underlying_allowance: null,
    asset_allowance: null,
    bridge_allowance: null,
    calcFromCost: true,
  }

  componentDidMount = () => {
    const {type} = this.props;
    this.setState({ modal_type: type });
  }

  fetchBalance = async () => {

    const { asset, web3, address } = this.props;

    
    const GContract = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
    const UnderlyingContractInstance = await new web3.eth.Contract(asset.underlying_abi, asset.underlying_address);
    const BaseContractInstance = await new web3.eth.Contract(asset.base_abi, asset.base_address);

    let total_supply;    
    let deposit_fee;   
    let withdrawal_fee;  
    let exchange_rate;   
    let total_reserve;  
    let total_reserve_underlying;  
    let g_balance;
    
    if (GContract) {
      total_supply    = await GContract.methods.totalSupply().call();
      deposit_fee     = await GContract.methods.depositFee().call();
      withdrawal_fee  = await GContract.methods.withdrawalFee().call();
      total_reserve   = await GContract.methods.totalReserve().call(); 
      g_balance       = await GContract.methods.balanceOf(address).call(); 

      // Exclusive type 1 function [gcDAI, gcUSDC]
      if (toggleNativeAvailable.indexOf(asset.type) > -1) {
        exchange_rate   = await GContract.methods.exchangeRate().call();
        total_reserve_underlying = await GContract.methods.totalReserveUnderlying().call();
      }
    }

    let underlying_balance;
    let underlying_allowance;
    let bridge_allowance;

    if (UnderlyingContractInstance) {

      if (asset.type === types.TYPE_ETH) {
        underlying_balance = await web3.eth.getBalance(address);
        underlying_allowance = 1000000 * 1e18;
        bridge_allowance = await GContract.methods.allowance(address, asset.bridge_address).call();
      } else {
        underlying_balance = await UnderlyingContractInstance.methods.balanceOf(address).call(); 
        underlying_allowance = await UnderlyingContractInstance.methods.allowance(address, asset.gtoken_address).call();
      }
      
    }
    
    let asset_balance;
    let asset_allowance;

    if (BaseContractInstance) {

      if (asset.type === types.GETH) {
        asset_balance = await web3.eth.getBalance(address);
        asset_allowance = 1000000 * 1e18;
        bridge_allowance = await GContract.methods.allowance(address, asset.bridge_address).call();
      } else {
        asset_balance = await BaseContractInstance.methods.balanceOf(address).call();
        asset_allowance = await BaseContractInstance.methods.allowance(address, asset.gtoken_address).call();
      }
    }

    this.setState({total_supply, deposit_fee, withdrawal_fee, exchange_rate, total_reserve, total_reserve_underlying, underlying_balance, asset_balance, g_balance, isLoading: false, underlying_allowance, asset_allowance, bridge_allowance});
  }

  toggleModal = (modal_type) => {
    this.setState({show: !this.state.show, isLoading: true, is_native: false});
    this.fetchBalance();

    if (modal_type) {
      this.changeType(modal_type);
    }
  }

  handleChange = (name, value) => {
      this.setState({[name]: value});
  }

  handleMultiChange = (newState) => {
    this.setState({...newState});
  }

  changeType = (modal_type) => {
    this.setState({modal_type});
  }

  getWei = (value_number, decimals) => {
    const {web3} = this.props;
    if (decimals === 1e18) {
      const value = value_number.toString();
      return web3.utils.toWei(value);
    }
    if (decimals === 1e8) {
      return value_number * 1e8;
    }
    if (decimals === 1e6) {
      console.log(value_number)
      const value = value_number.toString();
      return web3.utils.toWei(value, 'mwei');
    }
  }

  toggleNativeSelector = () => {
    this.setState({is_native: !this.state.is_native})

  }

  parseNumber = (number, decimals) => {
    const float_number = number / decimals;
    return Math.round(float_number * 10000) / 10000;
  }

  showBalance = (is_native) => {
      const {asset} = this.props;
      const { underlying_balance, asset_balance, g_balance, modal_type } = this.state;
      if (!underlying_balance || !asset_balance || !g_balance ) return (
        <Loader
          type="TailSpin"
          color={is_native ? '#00d395' : '#161d6b'}
          height={20}
          width={20}
        />
      );

      if (modal_type === 'mint') {
        if (is_native) {
          return (underlying_balance / asset.underlying_decimals).toFixed(2);
        } else {
          return (asset_balance / 1e8).toFixed(2);
        }
      }

      if (modal_type === 'redeem') {
        return Math.round((g_balance / 1e8) * 10000) / 10000;
      }      
  }

  // Update the current balance on allowance 
  updateApprovalBalance = (total_supply) => {
    const {is_native} = this.state;
    if (is_native) {
      this.setState({underlying_allowance: total_supply, bridge_allowance: total_supply});
    } else {
      this.setState({asset_allowance: total_supply, bridge_allowance: total_supply});
    }
  }

  render () {
    const {type, address, asset} = this.props;
    const {show } = this.state;
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (!address) return alert('Please connect a wallet');
          this.setState({is_native: true});
          this.toggleModal()
        }}
      >
        <ActionButton
          asset={asset}
          address={address}
          type={type}
          onClick={(e) => {
            e.stopPropagation();
            if (!address) return alert('Please connect your wallet');
            this.toggleModal()
          }}
        >
          {this.props.text}
        </ActionButton>
        <Modal
          isOpen={show}
          // onAfterOpen={afterOpenModal}
          onRequestClose={(e) => {
            this.toggleModal(type);
          }}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <ModalHeader 
            {...this.props}
            {...this.state}
            handleChange={this.handleChange}
          />
          <InputContainer
            onClick={e => e.stopPropagation()}
          >
            <InputSection>
              <InputSectionColumn
                flex="3"
              >
                <Balance 
                  {...this.props}
                  {...this.state}
                />
                <InputRow>
                  <AmountInput 
                    {...this.props}
                    {...this.state}
                    handleChange={this.handleChange}
                    handleMultiChange={this.handleMultiChange}
                    getWei={this.getWei}
                  />
                </InputRow>
              </InputSectionColumn>
              <InputSectionColumn
                flex="1"
              >
                <CalcToggle 
                  {...this.props}
                  {...this.state}
                  handleChange={this.handleChange}
                />
                <SelectedAsset 
                  {...this.props}
                  {...this.state}
                />
              </InputSectionColumn>
            </InputSection>            
          </InputContainer>
          {asset && toggleNativeAvailable.indexOf(asset.type) > -1 && (
            <AssetTypeToggle 
              {...this.props}
              {...this.state}
              handleChange={this.handleChange}
            />
          )}
          <Summary 
            {...this.props}
            {...this.state}
            toggleNativeAvailable={toggleNativeAvailable}
            getWei={this.getWei}
            toggleModal={this.toggleModal}
            updateApprovalBalance={this.updateApprovalBalance}
          />
        </Modal>
      </div>
    );
  }
  
}

ActionModal.propTypes = {
  asset: PropTypes.object, 
  web3: PropTypes.object, 
  address: PropTypes.string.isRequired,
  redeemGTokenToCToken: PropTypes.func.isRequired,
  redeemGTokenToUnderlying: PropTypes.func.isRequired,
};

export default ActionModal;
