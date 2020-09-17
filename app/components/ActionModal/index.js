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
        width: 90px;
      
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
        padding: 0.5em 1em 0.5em 1em;
        color: #161d6b;
        border-radius: 5px;
        min-width: 120px;
      
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
  padding: 0.5em 1em 0.25em 1em;
  justify-content: space-around;
`

const PrimaryLabel = styled.b`
  color: #161d6b;
  opacity: 0.75; 
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
  width: 100px;
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
  }}
`

const BalanceLabel = styled.b`
  color: #161d6b;
  font-size: 0.85em;
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
  height: calc(50vh - 210px);
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
  width: 300px;
  color: white;
  
  &:hover {
    opacity: 0.85;
    cursor: pointer;
  }
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
    height: '50vh',
  },
  overlay: {
    backgroundColor: 'rgb(0,0,0, 0.50)'
  }
};

class ActionModal extends React.Component {

  state = {
    show: false,
    modal_type: 'mint',
    value: null,
  }

  componentDidMount = () => {
    const {type} = this.props;
    this.setState({ modal_type: type });
  }

  toggleModal = (modal_type) => {
    this.setState({show: !this.state.show});

    if (modal_type) {
      this.changeType(modal_type);
    }
  }

  changeType = (modal_type) => {
    this.setState({modal_type});
  }

  handleInputChange = (value) => {
    if (value < 0) {
      this.setState({value: 0});
    } else {
      this.setState({value});
    }
  }

  calculateMintingFee = () => {
    const {asset} = this.props;
    const total_minting = ((1 + asset.minting_fee) * asset.base_total_supply) / asset.total_supply;
    return total_minting;
  }

  calculateBurningFee = () => {
    const {asset} = this.props;
    const total_minting = ((1 - asset.burning_fee) * asset.base_total_supply) / asset.total_supply;
    return total_minting;
  }

  calculateMintingTotal = () => {
    const {value} = this.state;
  
    const minting_ratio = this.calculateMintingFee();
    return value / minting_ratio;
  }

  calculateBurningTotal = () => {
    const {value} = this.state;
  
    const burning_ratio = this.calculateBurningFee();
    return value / burning_ratio;
  }
  
  render () {
    const {type, asset} = this.props;
    const {show, modal_type, value} = this.state;
    return (
      <React.Fragment>
        <ActionButton
          type={type}
          onClick={() => this.toggleModal()}
        >
          {this.props.text}
        </ActionButton>
        <Modal
          isOpen={show}
          // onAfterOpen={afterOpenModal}
          onRequestClose={() => this.toggleModal(type)}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <ModalHeader>
            <ModalHeaderOption
              active={modal_type === 'mint'}
              defaultColor="#00d395"
              onClick={() => this.changeType('mint')} 
            >
              <p>MINT</p>
            </ModalHeaderOption>
            <ModalHeaderOption
              active={modal_type === 'redeem'}
              defaultColor="#161d6b"
              onClick={() => this.changeType('redeem')} 
            >
              <p>REDEEM</p>
            </ModalHeaderOption>
          </ModalHeader>
          <InputContainer>
            <InputSection>
              <InputSectionColumn
                flex="2"
              >
                <PrimaryLabel>TOTAL</PrimaryLabel>
                <InputRow>
                  <AmountInput>
                    <StyledInput
                      value={value}
                      placeholder="0.0"
                      type="number"
                      onChange={e => this.handleInputChange(e.target.value)}
                    />
                  </AmountInput>
                  <MaxButton
                    modal_type={modal_type}
                  >
                    MAX
                  </MaxButton>
                </InputRow>
              </InputSectionColumn>
              <InputSectionColumn
                flex="1"
              >
                <BalanceLabel>BALANCE 80.12</BalanceLabel>
                <SelectorRow>
                  <IconLogo src={asset.img_url} />
                  <AssetLabel>{modal_type === 'mint' ? asset.base_asset : asset.g_asset}</AssetLabel>
                  <FaChevronDown />
                </SelectorRow>
              </InputSectionColumn>
            </InputSection>
          </InputContainer>
          <Summary>
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
                <PrimaryLabel>{asset.base_asset} SUPPLY</PrimaryLabel>
              </SummaryColumn>
              <SummaryColumn align="flex-end">
                <PrimaryLabel>{asset.base_total_supply.toLocaleString('En-en')} {asset.base_asset}</PrimaryLabel>
              </SummaryColumn>
            </SummaryRow>
            <SummaryRow>
              <SummaryColumn>
                <PrimaryLabel>{asset.g_asset} SUPPLY</PrimaryLabel>
              </SummaryColumn>
              <SummaryColumn align="flex-end">
                <PrimaryLabel>{asset.total_supply.toLocaleString('En-en')} {asset.g_asset}</PrimaryLabel>
              </SummaryColumn>
            </SummaryRow>
            <SummaryRow>
              <SummaryColumn>
                <SummaryRow>
                  <PrimaryLabel margin="0 5px 0 0">BURNING FEE</PrimaryLabel>
                  <BsInfoCircleFill style={{color: '#BEBEBE' }} />
                </SummaryRow>
              </SummaryColumn>
              <SummaryColumn align="flex-end">
                {modal_type === 'mint' && <PrimaryLabel> {Math.round(this.calculateMintingFee() * 100) / 100} {asset.native}  ({(asset.minting_fee * 100).toFixed(2)}%)</PrimaryLabel>}
                {modal_type === 'redeem' && <PrimaryLabel> {Math.round(this.calculateBurningFee() * 100) / 100} {asset.native}  ({(asset.burning_fee * 100).toFixed(2)}%)</PrimaryLabel>}   
              </SummaryColumn>
            </SummaryRow>
            <SummaryRow>
              <SummaryColumn>
                <SummaryRow>
                  <PrimaryLabel margin="0 5px 0 0">TOTAL</PrimaryLabel>
                  <BsInfoCircleFill style={{color: '#BEBEBE' }} />
                </SummaryRow>
              </SummaryColumn>
              <SummaryColumn align="flex-end">
                {modal_type === 'mint' && <PrimaryLabel>{Math.round(this.calculateMintingTotal() * 100) / 100} {asset.g_asset}</PrimaryLabel>}
                {modal_type === 'redeem' && <PrimaryLabel>{Math.round(this.calculateBurningTotal() * 100) / 100} {asset.base_asset}</PrimaryLabel>}
              </SummaryColumn>
            </SummaryRow>
            <SummaryRow justify="center" flex="2">
                <ActionConfirmButton modal_type={modal_type}>
                    CONFIRM 
                    {modal_type === 'mint' && ' MINT'}
                    {modal_type === 'redeem' && ' REDEEM'}
                </ActionConfirmButton>
            </SummaryRow>
          </Summary>
        </Modal>
      </React.Fragment>
    );
  }
  
}

ActionModal.propTypes = {};

export default ActionModal;
