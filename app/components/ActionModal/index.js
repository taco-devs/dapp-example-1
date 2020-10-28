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

import ApproveContainer from 'components/ApproveContainer';
import Loader from 'react-loader-spinner';


const ActionButton = styled.div`
  display: flex; 
  flex-direction: row;
  justify-content: center;
  font-size: 0.85em;

  ${props => {
    if (props.type === 'mint') {
      return `
        background-color: #00d395;
        border-color: #00d395;
        border-width: 3px;
        border-style: solid;
        margin: 0 0.5em  0 0.5em;
        padding: 0.5em 1em 0.5em 1em;
        color: white;
        border-radius: 5px;
        min-width: 100px;
      
        &:hover {
          cursor: pointer;
          background-color: white;
          color: #00d395;
        }
      `
    } 
    if (props.type === 'redeem') {
      return `
        background-color: white;
        border-color: #161d6b;
        border-width: 3px;
        border-style: solid;
        margin: 0 0.5em 0 0.5em ;
        padding: 0.5em 0 0.5em 0;
        color: #161d6b;
        border-radius: 5px;
        min-width: 100px;
      
        &:hover {
          cursor: pointer;
          background-color: #161d6b;
          color: white;
        }
      `
    }
  } 
}
`
const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  height: 70px;
`

const ModalHeaderOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  background-color: ${props => props.active ? props.defaultColor : 'white'};
  color: ${props => props.active ? 'white' : props.defaultColor};
  transition: background-color .4s ease;

  &:hover {
    cursor: pointer;
    opacity: 0.75;
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

const PrimaryLabel = styled.b`
  color: #161d6b;
  opacity: 0.75; 
  margin: ${props => props.margin || '0'};
  text-align: ${props => props.align || 'left'};
  letter-spacing: ${props => props.spacing || '0'};∫
`

const TotalLabel = styled.p`
  color: #161d6b;
  opacity: 0.75; 
  font-size: 0.85em;
  margin: ${props => props.margin || '0'};
`

const InputRow = styled.div`
  display: flex;
  flex-direction: row;
`

const AmountInput = styled.div`
  display: flex;
  flex: 3;
`

const StyledInput = styled.input`
  width: 100%;
  border: 0;
  outline: none;
  font-size: 1.2em;
`

const MaxButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 5px 10px 5px 10px;
  color: white;
  border-radius: 5px;
  flex: 1;
  transition: background-color .4s ease;
  background-color: ${props => {
    if (props.modal_type === 'mint') return '#00d395';
    if (props.modal_type === 'redeem') return '#161d6b';
  }};

  &:hover {
    opacity: 0.85;
    cursor: pointer;
  }
`

const BalanceLabel = styled.b`
  color: #161d6b;
  text-align: ${props => props.align || 'left'};
  margin: ${props => props.margin || '0'};
`

const AssetLabel = styled.b`
  color: #161d6b;
  font-size: 0.85em;
`

/* const SelectorRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border-radius: 5px;
  padding: 5px 0 5px 0;

  &:hover {
    background-color: #E8E8E8;
    cursor: pointer;
  }
` */ 

const SelectorRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border-radius: 5px;
  padding: 5px 0 5px 0;
`

const IconLogo = styled.img`
  height: 25px;
  width: 25px;
`

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #E8E8E8;
  flex: 1;
  height: calc(550px - 260px);
  padding: 2em 1.5em 1em 1.5em;
`

const SummaryRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: ${props => props.flex || '1'};
  align-items: center;
  justify-content: ${props => props.justify || 'space-between'};
`

const SummaryColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${props => props.flex || '1'};
  align-items: ${props => props.align || 'flex-start'};
`

const ActionConfirmButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-radius: 5px;
  background-color: ${props => {
    if (props.disabled) return '#BEBEBE';
    if (props.modal_type === 'mint') return '#00d395';
    if (props.modal_type === 'redeem') return '#161d6b';
  }};
  padding: 1em 1em 1em 1em;
  margin: 1em 0 0 0;
  width: 300px;
  color: white;
  border-width: 3px;
  border-style: solid;
  border-color: ${props => {
    if (props.disabled) return '#BEBEBE';
    if (props.modal_type === 'mint') return '#00d395';
    if (props.modal_type === 'redeem') return '#161d6b';
  }};
  
  &:hover {
    opacity: 0.85;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  }
`

const AssetTypeToggle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 50px;
`

const SwitchBox = styled.label`
  position: relative;
  display: inline-block;
  width: 150px;
  height: 34px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input:checked + .slider {
    background-color: ${props => {
      if (props.modal_type === 'mint') return '#00d395';
      if (props.modal_type === 'redeem') return '#161d6b';
    }};
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(73px);
    -ms-transform: translateX(73px);
    transform: translateX(73px);
  }
  
`

const SwitchSlider = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => {
    if (props.modal_type === 'mint') return '#00d395';
    if (props.modal_type === 'redeem') return '#161d6b';
  }};
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 5px;

  &:before {
    border-radius: 5px;
    position: absolute;
    content: "";
    height: 26px;
    width: 70px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }
`

const SwitchLabel = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  z-index: 99;
  color: ${props => {
    if (props.modal_type === 'mint') return props.is_native ? '#00d395' : 'white';
    if (props.modal_type === 'redeem') return props.is_native ? '#161d6b' : 'white';
  }};
  -webkit-transition: .4s;
  transition: .4s;
  font-size: 0.85em;
`

const BalanceRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
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

class ActionModal extends React.Component {

  state = {
    show: false,
    isLoading: false,
    modal_type: 'mint',
    value_base: '',
    value_native: '',
    value_redeem: '',
    is_native: true,
    underlying_balance: null,
    asset_balance: null,
    total_supply: null,
    deposit_fee: null,
    withdrawal_fee: null,
    exchange_rate: null,
    total_reserve: null,
    total_native: null,
    total_base: null,
    total_native_redeem: null,
    total_native_cost_redeem: null,
    total_base_redeem: null,
    underlying_conversion: null,
    underlying_allowance: null,
    asset_allowance: null,
  }

  componentDidMount = () => {
    const {type} = this.props;
    this.setState({ modal_type: type });
  }

  fetchBalance = async () => {

    const { asset, web3, address } = this.props;
    
    const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
    const UnderlyingContractInstance = await new web3.eth.Contract(asset.underlying_abi, asset.underlying_address);
    const BaseContractInstance = await new web3.eth.Contract(asset.base_abi, asset.base_address);

    let total_supply;    
    let deposit_fee;   
    let withdrawal_fee;  
    let exchange_rate;   
    let total_reserve;  
    let g_balance;
    
    if (GContractInstance) {
      total_supply    = await GContractInstance.methods.totalSupply().call();
      deposit_fee     = await GContractInstance.methods.depositFee().call();
      withdrawal_fee  = await GContractInstance.methods.withdrawalFee().call();
      exchange_rate   = await GContractInstance.methods.exchangeRate().call();
      total_reserve   = await GContractInstance.methods.totalReserve().call(); 
      g_balance       = await GContractInstance.methods.balanceOf(address).call(); 
    }

    let underlying_balance;
    let underlying_allowance;

    if (UnderlyingContractInstance) {
      underlying_balance = await UnderlyingContractInstance.methods.balanceOf(address).call(); 
      underlying_allowance = await UnderlyingContractInstance.methods.allowance(address, asset.gtoken_address).call();
    }
    
    let asset_balance;
    let asset_allowance;

    if (BaseContractInstance) {
      asset_balance = await BaseContractInstance.methods.balanceOf(address).call();
      asset_allowance = await BaseContractInstance.methods.allowance(address, asset.gtoken_address).call();
    }

    this.setState({total_supply, deposit_fee, withdrawal_fee, exchange_rate, total_reserve, underlying_balance, asset_balance, g_balance, isLoading: false, underlying_allowance, asset_allowance});
  }

  toggleModal = (modal_type) => {
    this.setState({show: !this.state.show, isLoading: true, is_native: true});
    this.fetchBalance();

    if (modal_type) {
      this.changeType(modal_type);
    }
  }

  changeType = (modal_type) => {
    this.setState({modal_type});
  }

  handleInputChange = (value) => {
    const {modal_type, is_native} = this.state;
    if (value < 0) {
      this.setState({value: 0});
    } else {

      // Route total logic
      if (modal_type === 'mint') {
        this.calculateMintingTotal(value);

        // Route native field
        if (is_native) {
          this.setState({value_native: value})
        } else {
          this.setState({value_base: value});
        }
      } 
    
      if (modal_type === 'redeem') {
        this.calculateBurningTotal(value, true);
        this.setState({value_redeem: value})
      }
    }
  }

  calculateBurningFee = () => {
    const {asset} = this.props;
    const total_minting = ((1 - asset.burning_fee) * asset.base_total_supply) / asset.total_supply;
    return total_minting;
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

  calculateMintingTotal = debounce(async (value) => {
    const { web3, asset } = this.props;
    const { modal_type, is_native, total_reserve, total_supply, exchange_rate, deposit_fee} = this.state;

    const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);


    // Handle 0 value transactions
    if (!value || value.length <= 0) {
      this.setState({
        real_fee: null,
        total: null,
      })
    }

    // Calculate the total to mint
    if (modal_type === 'mint') {
      if (is_native) {
        const netShares = this.getWei(value, asset.underlying_decimals);
        const underlying_conversion = await GContractInstance.methods.calcCostFromUnderlyingCost(netShares, exchange_rate).call();
        const result = await GContractInstance.methods.calcDepositSharesFromCost(underlying_conversion, total_reserve, total_supply, deposit_fee).call();
        const {_netShares, _feeShares} = result;
        this.setState({
          real_fee: _feeShares,
          total_native: _netShares,
        });
  
      } else {
        // CTokens only have 8 decimals 
        // NOTE: Standarized to gwei by converting it to 1e9 because .toWei() doesn't handle 1e8
        const _cost = this.getWei(value, 1e8)
        const result = await GContractInstance.methods.calcDepositSharesFromCost(_cost, total_reserve, total_supply, deposit_fee).call();
        const {_netShares, _feeShares} = result;
        this.setState({
          real_fee: _feeShares,
          total_base: _netShares,
        })
      }
    }

  }, 250);

  calculateBurningTotal = debounce(async (value) => {
    const { web3, asset } = this.props;
    const { modal_type, is_native, total_reserve, total_supply, exchange_rate, withdrawal_fee} = this.state;
  
    // Handle 0 value transactions
    if (!value || value.length <= 0) {
      this.setState({
        real_fee: null,
        total: null,
      })
    }

    const netShares = this.getWei(value, 1e8);
  
    const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
    const result = await GContractInstance.methods.calcWithdrawalCostFromShares(netShares, total_reserve, total_supply, withdrawal_fee).call();
    const rate = await GContractInstance.methods.calcUnderlyingCostFromCost(result._cost, exchange_rate).call();
    const {_cost, _feeShares} = result;
    this.setState({
      real_fee: _feeShares,
      total_native_cost_redeem: netShares,
      total_base_redeem: _cost,
      total_native_redeem: rate,
    });

  }, 250)

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

  setMax = () => {
    const { asset } = this.props;
    const {modal_type, is_native, underlying_balance, asset_balance, g_balance, deposit_fee} = this.state;
    const SAFE_MARGIN = 0.99;
    
    if (modal_type === 'mint') {
      if (is_native) {
        if ((Number(underlying_balance) / asset.underlying_decimals) < 0.01) return;
        const value_native = ((underlying_balance * SAFE_MARGIN) / asset.underlying_decimals);
        this.setState({value_native});
        this.handleInputChange(value_native)
      } else {
        if ((Number(asset_balance) / 1e8) < 0.01) return;
        const value_base = asset_balance / 1e8;
        this.setState({value_base});
        this.handleInputChange(value_base)
      }
    }

    if (modal_type === 'redeem') {
      if ((Number(g_balance) / 1e8) < 0.01) return;
      const value_redeem = g_balance / 1e8;
      this.setState({value_redeem});
      this.calculateBurningTotal(value_redeem);
    }
  }

  handleDeposit = async () => {
    const {
      asset, web3, address,
      mintGTokenFromCToken,
      mintGTokenFromUnderlying,
    } = this.props;

    const { is_native, value_base, value_native, total_native, total_base } = this.state;

    // Avoid clicks when the user is not allowed to make an action
    if (this.isDisabled()) return;
    
    // Handle depending the asset
    if (is_native) {

      const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
      const _cost = this.getWei(value_native, asset.underlying_decimals);
      mintGTokenFromUnderlying({
        GContractInstance, 
        _cost, 
        address,
        web3,
        asset: {
          from: asset.native,
          to: asset.g_asset,
          sending: _cost,
          receiving: total_native,
          fromDecimals: asset.underlying_decimals,
          toDecimals: 1e8,
          fromImage: asset.native_img_url,
          toImage: asset.gtoken_img_url,
        },
        toggle: this.toggleModal
      })

    } else {
      const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
      // const _cost = (value_base * 1e8).toString();
      const _cost = this.getWei(value_base, 1e8);
      mintGTokenFromCToken({
        GContractInstance, 
        _cost, 
        address,
        web3,
        asset: {
          from: asset.base_asset ,
          to: asset.g_asset,
          sending: _cost,
          receiving: total_base,
          fromDecimals: 1e8,
          toDecimals: 1e8,
          fromImage: asset.img_url,
          toImage: asset.gtoken_img_url,
        },
        toggle: this.toggleModal
      })
    }
  }


  handleRedeem = async () => {
    const {
      asset, web3, address,
      redeemGTokenToCToken,
      redeemGTokenToUnderlying,
    } = this.props;

    const { is_native, value_redeem, total_native_cost_redeem, total_base_cost_redeem, total_native_redeem, total_base_redeem } = this.state;
    
    // Validate Balance
    if (this.isDisabled()) return;

    // Handle depending the asset
    if (is_native) {

      const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
      redeemGTokenToUnderlying({
        GContractInstance, 
        _grossShares: total_native_cost_redeem,
        address,
        web3,
        asset: {
          from: asset.g_asset,
          to: asset.native,
          sending: total_native_cost_redeem,
          receiving: total_native_redeem,
          fromDecimals: 1e8,
          toDecimals: 1e18,
          fromImage: asset.gtoken_img_url,
          toImage: asset.native_img_url,
        },
        toggle: this.toggleModal
      })

    } else {
      const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
      redeemGTokenToCToken({
        GContractInstance, 
        _grossShares: total_native_cost_redeem,
        address,
        web3,
        asset: {
          from: asset.g_asset,
          to: asset.base_asset,
          sending: total_native_cost_redeem,
          receiving: total_base_redeem,
          fromDecimals: 1e8,
          toDecimals: 1e8,
          fromImage: asset.gtoken_img_url,
          toImage: asset.img_url,
        },
        toggle: this.toggleModal
      })
    }
  }
  
  // Check if a button should be disabled
  isDisabled = () => {
    const { asset } = this.props;
    const {
      modal_type, is_native,
      value_base, value_native, value_redeem,
      underlying_balance, asset_balance, g_balance
    } = this.state;

    // Validate when input a mint function
    if (modal_type === 'mint') {
      // Validate against native balance
      if (is_native) {
        if (!value_native || Number(value_native) <= 0) return true;
        return  Number(value_native * asset.underlying_decimals) > Number(underlying_balance);
      } else {
        if (!value_base || Number(value_base) <= 0) return true;
        return Number(value_base * 1e8) > Number(asset_balance);
      }
    }

    if (modal_type === 'redeem') {
      if (!value_redeem) return true;
      return Number(value_redeem * 1e8) > Number(g_balance);
    }
    return true;
  }

  // Check for allowance 
  hasEnoughAllowance = () => {
    const {asset} = this.props;
    const {value_native, value_base, underlying_allowance, asset_allowance, is_native} = this.state;

    // Only apppliable on Mint
    if (is_native) {
      if (!value_native || !underlying_allowance) return true;
      return Number(value_native * asset.underlying_decimals) <= Number(underlying_allowance);
    } else {
      if (!value_base || !asset_allowance) return true;
      return Number(value_base * 1e8) <= Number(asset_allowance);
    }

  }

  // Update the current balance on allowance 
  updateApprovalBalance = (total_supply) => {
    const {is_native} = this.state;
    if (is_native) {
      this.setState({underlying_allowance: total_supply});
    } else {
      this.setState({asset_allowance: total_supply});
    }
  }

  // Calculate correct fee
  calculateFee = () => {
    const { asset } = this.props;
    const {is_native, modal_type, deposit_fee, withdrawal_fee, value_native, value_base, value_redeem } = this.state;

    if (!deposit_fee || !withdrawal_fee) return 0;

    // Validate when input a mint function
    if (modal_type === 'mint') {
      // Validate against native balance
      if (is_native) {
        if (!value_native || Number(value_native) <= 0) return true;
        return  Number(value_native * asset.underlying_decimals) * (deposit_fee / asset.underlying_decimals);
      } else {
        if (!value_base || Number(value_base) <= 0) return true;
        return Number(value_base * asset.base_decimals) * (deposit_fee / asset.base_decimals);
      }
    }

    if (modal_type === 'redeem') {
      return Number(value_redeem * 1e8) * (withdrawal_fee / asset.base_decimals);
    }
  }

  render () {
    const {type, asset, address} = this.props;
    const {show, isLoading, modal_type, value_base, value_native, is_native, total_supply, total_reserve, deposit_fee, total_base, total_native, value_redeem, total_native_redeem, total_base_redeem, withdrawal_fee } = this.state;
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
            onClick={e => e.stopPropagation()}
          >
            <ModalHeaderOption
              active={modal_type === 'mint'}
              defaultColor="#00d395"
              onClick={(e) => {
                e.stopPropagation();
                this.changeType('mint')
              }} 
            >
              <p>MINT</p>
            </ModalHeaderOption>
            <ModalHeaderOption
              active={modal_type === 'redeem'}
              defaultColor="#161d6b"
              onClick={(e) => {
                e.stopPropagation();
                this.changeType('redeem')
              }} 
            >
              <p>REDEEM</p>
            </ModalHeaderOption>
          </ModalHeader>
          <InputContainer
            onClick={e => e.stopPropagation()}
          >
            <InputSection>
              <InputSectionColumn
                flex="2"
              >
                <BalanceRow>
                  <BalanceLabel>BALANCE:</BalanceLabel>
                  <BalanceLabel margin="0 10px 0 10px">{this.showBalance(is_native)}</BalanceLabel>
                </BalanceRow>
                <InputRow>
                  <AmountInput>
                    {modal_type === 'mint' && is_native && (
                      <StyledInput
                        value={value_native}
                        disabled={isLoading}
                        placeholder="0.0"
                        type="number"
                        onClick={e => e.stopPropagation()}
                        onChange={e => {
                          this.handleInputChange(e.target.value)
                        }}
                      />
                    )} 
                    {modal_type === 'mint' && !is_native && (
                      <StyledInput
                        value={value_base}
                        placeholder="0.0"
                        disabled={isLoading}
                        type="number"
                        onClick={e => e.stopPropagation()}
                        onChange={e => {
                          this.handleInputChange(e.target.value)
                        }}
                      />
                    )}
                    {modal_type === 'redeem' && (
                      <StyledInput
                        value={value_redeem}
                        placeholder="0.0"
                        disabled={isLoading}
                        type="number"
                        onClick={e => e.stopPropagation()}
                        onChange={e => {
                          this.handleInputChange(e.target.value)
                        }}
                      />
                    )} 
                    
                  </AmountInput>
                  <MaxButton
                    modal_type={modal_type}
                    onClick={() => this.setMax()}
                  > 
                    MAX
                  </MaxButton>
                </InputRow>
              </InputSectionColumn>
              <InputSectionColumn
                flex="1"
              >
                <PrimaryLabel align="right">ASSET</PrimaryLabel>
                <SelectorRow>
                  <IconLogo src={modal_type === 'mint' ? is_native ? asset.native_img_url : asset.img_url : require(`images/tokens/${asset.gtoken_img_url}`)} />
                  <AssetLabel>{modal_type === 'mint' ? is_native ? asset.native : asset.base_asset : asset.g_asset}</AssetLabel>
                 {/*  <FaChevronDown /> */}
                </SelectorRow>
              </InputSectionColumn>
            </InputSection>            
          </InputContainer>
          <AssetTypeToggle
            onClick={e => e.stopPropagation()}
          >
            <SwitchBox modal_type={modal_type} onClick={e => e.stopPropagation()}>
              <input type="checkbox" value={is_native} />
              <SwitchSlider className="slider" modal_type={modal_type} onClick={() => this.toggleNativeSelector()}>
                <SwitchLabel is_native={is_native} modal_type={modal_type}>
                  <p>NATIVE</p>
                </SwitchLabel>
                <SwitchLabel is_native={!is_native} modal_type={modal_type}>
                  <p>ASSET</p>
                </SwitchLabel>
              </SwitchSlider>
            </SwitchBox>
          </AssetTypeToggle>
          <Summary
            onClick={e => e.stopPropagation()}
          >
            {/* <SummaryRow>
              <SummaryColumn>
                <PrimaryLabel>PRICE</PrimaryLabel>
              </SummaryColumn>
              <SummaryColumn align="flex-end">
                <SummaryRow>
                  <PrimaryLabel margin="0 5px 0 5px">10.78 {asset.native} = 1 ETH</PrimaryLabel>
                  <HiSwitchHorizontal />
                </SummaryRow>
              </SummaryColumn>
            </SummaryRow> */}
            <SummaryRow>
              <SummaryColumn>
                <PrimaryLabel>{asset.base_asset} RESERVE</PrimaryLabel>
              </SummaryColumn>
              <SummaryColumn align="flex-end">
                <PrimaryLabel spacing="1px">{total_reserve ?  this.parseNumber(total_reserve, 1e8).toLocaleString('En-en') : '-'} {asset.base_asset}</PrimaryLabel>
              </SummaryColumn>
            </SummaryRow>
            <SummaryRow>
              <SummaryColumn>
                <PrimaryLabel>{asset.g_asset} SUPPLY</PrimaryLabel>
              </SummaryColumn>
              <SummaryColumn align="flex-end">
                <PrimaryLabel spacing="1px">{total_supply ? this.parseNumber(total_supply, 1e8).toLocaleString('En-en') : '-'} {asset.g_asset}</PrimaryLabel>
              </SummaryColumn>
            </SummaryRow>
            <SummaryRow>
              <SummaryColumn>
                <SummaryRow>
                  <PrimaryLabel margin="0 5px 0 0">FEE</PrimaryLabel>
                  <Icon icon={info} style={{color: '#BEBEBE' }} />
                </SummaryRow>
              </SummaryColumn>
              <SummaryColumn align="flex-end">
                {modal_type === 'mint' && <PrimaryLabel spacing="1px">{this.parseNumber(this.calculateFee(), 1e18)} {is_native ? asset.native : asset.base_asset}  ({this.parseNumber(deposit_fee, 1e16).toFixed(2)}%)</PrimaryLabel>}
                {modal_type === 'redeem' && <PrimaryLabel spacing="1px">{this.parseNumber(this.calculateFee(), 1e18)} {asset.g_asset}  ({this.parseNumber(withdrawal_fee, 1e16).toFixed(2)}%)</PrimaryLabel>}   
              </SummaryColumn>
            </SummaryRow>
            <SummaryRow>
              <SummaryColumn>
                <SummaryRow>
                  <BalanceLabel margin="0 5px 0 0">TOTAL</BalanceLabel>
                  <Icon icon={info} style={{color: '#BEBEBE' }} />
                </SummaryRow>
              </SummaryColumn>
              <SummaryColumn align="flex-end">
                {modal_type === 'mint'&& is_native && <PrimaryLabel spacing="1px">{total_native ? this.parseNumber(total_native, 1e8).toLocaleString('en-En') : '-'} {asset.g_asset}</PrimaryLabel>}
                {modal_type === 'mint'&& !is_native && <PrimaryLabel spacing="1px">{total_base ? this.parseNumber(total_base, 1e8).toLocaleString('en-En') : '-'} {asset.g_asset}</PrimaryLabel>}
                {modal_type === 'redeem'&& is_native && <PrimaryLabel spacing="1px">{total_native_redeem ? this.parseNumber(total_native_redeem, asset.underlying_decimals).toLocaleString('en-En') : '-'} {asset.native}</PrimaryLabel>}
                {modal_type === 'redeem'&& !is_native && <PrimaryLabel spacing="1px">{total_base_redeem ? this.parseNumber(total_base_redeem, 1e8).toLocaleString('en-En') : '-'} {asset.base_asset}</PrimaryLabel>}
                 
              </SummaryColumn>
            </SummaryRow>
            <SummaryRow justify="center" flex="2">
                {modal_type === 'mint' &&  (
                  <React.Fragment>
                    {this.hasEnoughAllowance() ? (
                      <ActionConfirmButton
                        modal_type={modal_type}
                        onClick={() => this.handleDeposit()}
                        disabled={this.isDisabled()}
                      >
                        {this.isDisabled() ? 'NOT ENOUGH BALANCE' : 'CONFIRM MINT'}
                      </ActionConfirmButton>
                    ) : (
                      <ApproveContainer 
                        {...this.props}
                        {...this.state}
                        updateApprovalBalance={this.updateApprovalBalance}
                      />
                    )}
                  </React.Fragment>
                )}
                {modal_type === 'redeem' &&  (
                  <ActionConfirmButton 
                    modal_type={modal_type}
                    onClick={() => this.handleRedeem()}
                    disabled={this.isDisabled()}
                  >
                    {this.isDisabled() ? 'NOT ENOUGH BALANCE' : 'CONFIRM REDEEM'}
                  </ActionConfirmButton>
                )}
            </SummaryRow>
          </Summary>
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
