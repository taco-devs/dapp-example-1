/**
 *
 * ActionModal
 *
 */

import React from 'react';
import Modal from 'react-modal';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import debounce from 'lodash.debounce';
import messages from './messages';
import styled from 'styled-components';
import {FaChevronDown} from 'react-icons/fa';
import { HiSwitchHorizontal } from 'react-icons/hi';
import { BsInfoCircleFill } from 'react-icons/bs';



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

const SelectorRow = styled.div`
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
  height: calc(55vh - 260px);
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
    if (props.modal_type === 'mint') return '#00d395';
    if (props.modal_type === 'redeem') return '#161d6b';
  }};
  padding: 1em 1em 1em 1em;
  margin: 1em 0 0 0;
  width: 300px;
  color: white;
  
  &:hover {
    opacity: 0.85;
    cursor: pointer;
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
  justify-content: space-between;
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
    height: '55vh',
  },
  overlay: {
    backgroundColor: 'rgb(0,0,0, 0.50)'
  }
};

class ActionModal extends React.Component {

  state = {
    show: false,
    modal_type: 'mint',
    value_base: '',
    value_native: '',
    is_native: true,
    underlying_balance: null,
    asset_balance: null,
    total_supply: null,
    deposit_fee: null,
    exchange_rate: null,
    total_reserve: null,
    total_native: null,
    total_base: null,
    underlying_conversion: null,
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
    
     const total_supply = await GContractInstance.methods.totalSupply().call();
     const deposit_fee = await GContractInstance.methods.depositFee().call();
     const exchange_rate = await GContractInstance.methods.exchangeRate().call();
     const total_reserve = await GContractInstance.methods.totalReserve().call(); 

     // Balance of the underlying asset
     const underlying_balance = await UnderlyingContractInstance.methods.balanceOf(address).call(); 
     const asset_balance = await BaseContractInstance.methods.balanceOf(address).call(); 

     this.setState({total_supply, deposit_fee, exchange_rate, total_reserve, underlying_balance, asset_balance});
  }

  toggleModal = (modal_type) => {
    this.setState({show: !this.state.show});
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
    }
  }

  calculateBurningFee = () => {
    const {asset} = this.props;
    const total_minting = ((1 - asset.burning_fee) * asset.base_total_supply) / asset.total_supply;
    return total_minting;
  }

  calculateMintingTotal = debounce(async (value) => {
    const { web3, asset } = this.props;
    const { is_native, total_reserve, total_supply, exchange_rate, deposit_fee} = this.state;

    const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);

    // Handle 0 value transactions
    if (!value || value.length <= 0) {
      this.setState({
        real_fee: null,
        total: null,
      })
    }

    if (is_native) {
      const netShares = await web3.utils.toWei(value).toString();
      const underlying_conversion = await GContractInstance.methods.calcCostFromUnderlyingCost(netShares, exchange_rate).call();
      const result = await GContractInstance.methods.calcDepositSharesFromCost(underlying_conversion, total_reserve, total_supply, deposit_fee).call();
      const {_netShares, _feeShares} = result;
      this.setState({
        real_fee: _feeShares,
        total_native: _netShares,
      });

    } else {
      // CTokens only have 8 decimals
      const _cost = value * 1e8;
      const result = await GContractInstance.methods.calcDepositSharesFromCost(_cost, total_reserve, total_supply, deposit_fee).call();
      const {_netShares, _feeShares} = result;
      this.setState({
        real_fee: _feeShares,
        total_base: _netShares,
      })
    }
  }, 250);

  calculateBurningTotal = () => {
    const {value} = this.state;
  
    const burning_ratio = this.calculateBurningFee();
    return value / burning_ratio;
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
      const { underlying_balance, asset_balance } = this.state;
      if (!underlying_balance || !asset_balance) return '-';
      if (is_native) {
        return (underlying_balance / asset.underlying_decimals).toFixed(2);
      } else {
        return (asset_balance / 1e8).toFixed(2);
      }
  }

  setMax = () => {
    const {modal_type, is_native, underlying_balance, asset_balance} = this.state;
    
    if (modal_type === 'mint') {
      if (is_native) {
        const value_native = underlying_balance / 1e18;
        this.setState({value_native});
        this.handleInputChange(value_native)
      } else {
        const value_base = asset_balance / 1e8;
        this.setState({value_base});
        this.handleInputChange(value_base)
      }
    }
  }

  handleDeposit = async () => {
    const {
      asset, web3, address,
      mintGTokenFromCToken,
      mintGTokenFromUnderlying,
    } = this.props;

    const { is_native, value_base, value_native } = this.state;
    
    // Handle depending the asset
    if (is_native) {

      const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
      const _cost = (value_native * 1e18).toString();
      mintGTokenFromUnderlying({
        GContractInstance, 
        _cost, 
        address
      })

    } else {
      const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
      const _cost = (value_base * 1e8).toString();
      mintGTokenFromCToken({
        GContractInstance, 
        _cost, 
        address
      })
    }
  }
  
  render () {
    const {type, asset} = this.props;
    const {show, modal_type, value_base, value_native, is_native, total_supply, total_reserve, deposit_fee, total_base, total_native, exchange_rate } = this.state;
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          this.setState({is_native: true});
          this.toggleModal()
        }}
      >
        <ActionButton
          type={type}
          onClick={(e) => {
            e.stopPropagation();
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
                <BalanceLabel>BALANCE: {this.showBalance(is_native)}</BalanceLabel>
                <InputRow>
                  <AmountInput>
                    {is_native ? (
                      <StyledInput
                        value={value_native}
                        placeholder="0.0"
                        type="number"
                        onClick={e => e.stopPropagation()}
                        onChange={e => {
                          this.handleInputChange(e.target.value)
                        }}
                      />
                    ) : (
                      <StyledInput
                        value={value_base}
                        placeholder="0.0"
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
                  <IconLogo src={modal_type === 'mint' && is_native ? asset.native_img_url : asset.img_url} />
                  <AssetLabel>{modal_type === 'mint' ? is_native ? asset.native : asset.base_asset : asset.g_asset}</AssetLabel>
                  <FaChevronDown />
                </SelectorRow>
              </InputSectionColumn>
            </InputSection>            
          </InputContainer>
          <AssetTypeToggle
            onClick={e => e.stopPropagation()}
          >
            <SwitchBox modal_type={modal_type} onClick={e => e.stopPropagation()}>
              <input type="checkbox" />
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
            <SummaryRow>
              <SummaryColumn>
                <PrimaryLabel>PRICE</PrimaryLabel>
              </SummaryColumn>
              <SummaryColumn align="flex-end">
                <SummaryRow>
                  <PrimaryLabel margin="0 5px 0 5px">10.78 {asset.native} = 1 ETH</PrimaryLabel>
                  <HiSwitchHorizontal />
                </SummaryRow>
              </SummaryColumn>
            </SummaryRow>
            <SummaryRow>
              <SummaryColumn>
                <PrimaryLabel>{asset.base_asset} RESERVE</PrimaryLabel>
              </SummaryColumn>
              <SummaryColumn align="flex-end">
                <PrimaryLabel>{total_reserve ?  this.parseNumber(total_reserve, 1e8).toLocaleString('En-en') : '-'} {asset.base_asset}</PrimaryLabel>
              </SummaryColumn>
            </SummaryRow>
            <SummaryRow>
              <SummaryColumn>
                <PrimaryLabel>{asset.g_asset} SUPPLY</PrimaryLabel>
              </SummaryColumn>
              <SummaryColumn align="flex-end">
                <PrimaryLabel>{total_supply ? this.parseNumber(total_supply, 1e8).toLocaleString('En-en') : '-'} {asset.g_asset}</PrimaryLabel>
              </SummaryColumn>
            </SummaryRow>
            <SummaryRow>
              <SummaryColumn>
                <SummaryRow>
                  <PrimaryLabel margin="0 5px 0 0">FEE</PrimaryLabel>
                  <BsInfoCircleFill style={{color: '#BEBEBE' }} />
                </SummaryRow>
              </SummaryColumn>
              <SummaryColumn align="flex-end">
                {modal_type === 'mint' && <PrimaryLabel> {this.parseNumber(deposit_fee, 1e18)} {asset.native}  ({this.parseNumber(deposit_fee, 1e16).toFixed(2)}%)</PrimaryLabel>}
                {modal_type === 'redeem' && <PrimaryLabel> {Math.round(this.calculateBurningFee() * 100) / 100} {asset.native}  ({(asset.burning_fee * 100).toFixed(2)}%)</PrimaryLabel>}   
              </SummaryColumn>
            </SummaryRow>
            {/* is_native && (
              <SummaryRow>
                <SummaryColumn>
                  <SummaryRow>
                    <PrimaryLabel margin="0 5px 0 0">SWAP RATE</PrimaryLabel>
                    <BsInfoCircleFill style={{color: '#BEBEBE' }} />
                  </SummaryRow>
                </SummaryColumn>
                <SummaryColumn align="flex-end">
                  <PrimaryLabel>{exchange_rate ? `${this.parseNumber(exchange_rate, 1e8)} ${asset.base_asset} = 1 ${asset.native}` : '-'}</PrimaryLabel>
                </SummaryColumn>
              </SummaryRow>
            ) */}
            <SummaryRow>
              <SummaryColumn>
                <SummaryRow>
                  <BalanceLabel margin="0 5px 0 0">TOTAL</BalanceLabel>
                  <BsInfoCircleFill style={{color: '#BEBEBE' }} />
                </SummaryRow>
              </SummaryColumn>
              <SummaryColumn align="flex-end">
                {modal_type === 'mint'&& is_native && <PrimaryLabel>{total_native ? this.parseNumber(total_native, 1e8) : '-'} {asset.g_asset}</PrimaryLabel>}
                {modal_type === 'mint'&& !is_native && <PrimaryLabel>{total_base ? this.parseNumber(total_base, 1e8) : '-'} {asset.g_asset}</PrimaryLabel>}
                {modal_type === 'redeem' && <PrimaryLabel>{Math.round(this.calculateBurningTotal() * 100) / 100} {is_native ? asset.native : asset.base_asset}</PrimaryLabel>}
              </SummaryColumn>
            </SummaryRow>
            <SummaryRow justify="center" flex="2">
                {modal_type === 'mint' &&  (
                  <ActionConfirmButton
                    modal_type={modal_type}
                    onClick={() => this.handleDeposit()}
                  >
                    CONFIRM MINT
                  </ActionConfirmButton>
                )}
                {modal_type === 'redeem' &&  (
                  <ActionConfirmButton modal_type={modal_type}>
                    CONFIRM REDEEM
                  </ActionConfirmButton>
                )}
            </SummaryRow>
          </Summary>
        </Modal>
      </div>
    );
  }
  
}

ActionModal.propTypes = {};

export default ActionModal;
