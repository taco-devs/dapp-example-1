import React, { Component } from 'react';
import * as Drawer from '@accessible/drawer'
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import {chevronDown} from 'react-icons-kit/fa/chevronDown'
/* import { HiSwitchHorizontal } from 'react-icons/hi';
import { BsInfoCircleFill } from 'react-icons/bs';
import { AiOutlineArrowLeft } from 'react-icons/ai'; */
import Loader from 'react-loader-spinner';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: white;
  z-index: 120;
`

const ActionRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1em 1em 0.5em 1em;
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
  padding: 1em 1em 1em 1em;
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

export default class ActionDrawer extends Component {

    state = {
        open: false,
        modal_type: 'mint',
        value: null,
        is_native: true,
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
  
    toggleNativeSelector = () => {
      this.setState({is_native: !this.state.is_native})
    }

    render() {
        const {type, asset, isMobileDrawerOpen, toggleMobileDrawer} = this.props;
        const {modal_type, value, is_native} = this.state;
        return (
            <div>
                <Drawer.Drawer 
                    open={isMobileDrawerOpen}
                >
                   <Drawer.Trigger>
                        {this.props.children}
                    </Drawer.Trigger>
                    <Drawer.Target 
                        placement="right"
                        preventScroll={true}
                    >
                      <Container>
                        <ActionRow>
                          {/* <AiOutlineArrowLeft style={{margin: '0 5px 0 5px'}} onClick={() => toggleMobileDrawer()}/> */}
                          <PrimaryLabel onClick={() => toggleMobileDrawer()}>RETURN</PrimaryLabel>
                        </ActionRow>
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
                                <IconLogo src={modal_type === 'mint' && is_native ? asset.native_img_url : asset.img_url} />
                                <AssetLabel>{modal_type === 'mint' ? is_native ? asset.native : asset.base_asset : asset.g_asset}</AssetLabel>
                                <Icon icon={chevronDown} />
                              </SelectorRow>
                            </InputSectionColumn>
                          </InputSection>            
                        </InputContainer>
                        <AssetTypeToggle>
                          <SwitchBox modal_type={modal_type}>
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
                        <Summary>
                          <SummaryRow>
                            <SummaryColumn>
                              <PrimaryLabel>PRICE</PrimaryLabel>
                            </SummaryColumn>
                            <SummaryColumn align="flex-end">
                              <SummaryRow>
                                <PrimaryLabel margin="0 5px 0 5px">10.78 {asset.native} = 1 ETH</PrimaryLabel>
                                {/* <HiSwitchHorizontal /> */}
                              </SummaryRow>
                            </SummaryColumn>
                          </SummaryRow>
                          <SummaryRow>
                            <SummaryColumn>
                              <PrimaryLabel>{asset.base_asset} SUPPLY</PrimaryLabel>
                            </SummaryColumn>
                            <SummaryColumn align="flex-end">
                              {/* <PrimaryLabel>{asset.base_total_supply.toLocaleString('En-en')} {asset.base_asset}</PrimaryLabel> */}
                            </SummaryColumn>
                          </SummaryRow>
                          <SummaryRow>
                            <SummaryColumn>
                              <PrimaryLabel>{asset.g_asset} SUPPLY</PrimaryLabel>
                            </SummaryColumn>
                            <SummaryColumn align="flex-end">
                              {/* <PrimaryLabel>{asset.total_supply.toLocaleString('En-en')} {asset.g_asset}</PrimaryLabel> */}
                            </SummaryColumn>
                          </SummaryRow>
                          <SummaryRow>
                            <SummaryColumn>
                              <SummaryRow>
                                <PrimaryLabel margin="0 5px 0 0">BURNING FEE</PrimaryLabel>
                                {/* <BsInfoCircleFill style={{color: '#BEBEBE' }} /> */}
                              </SummaryRow>
                            </SummaryColumn>
                            <SummaryColumn align="flex-end">
                              {modal_type === 'mint' && <PrimaryLabel> {Math.round(this.calculateMintingFee() * 100) / 100} {asset.native}  ({(asset.minting_fee * 100).toFixed(2)}%)</PrimaryLabel>}
                              {modal_type === 'redeem' && <PrimaryLabel> {Math.round(this.calculateBurningFee() * 100) / 100} {asset.native}  ({(asset.burning_fee * 100).toFixed(2)}%)</PrimaryLabel>}   
                            </SummaryColumn>
                          </SummaryRow>
                          {is_native && (
                            <SummaryRow>
                              <SummaryColumn>
                                <SummaryRow>
                                  <PrimaryLabel margin="0 5px 0 0">EXCHANGE FEE</PrimaryLabel>
                                  {/* <BsInfoCircleFill style={{color: '#BEBEBE' }} /> */}
                                </SummaryRow>
                              </SummaryColumn>
                              <SummaryColumn align="flex-end">
                                <PrimaryLabel>0.1 ETH</PrimaryLabel>
                              </SummaryColumn>
                            </SummaryRow>
                          )}
                          <SummaryRow>
                            <SummaryColumn>
                              <SummaryRow>
                                <PrimaryLabel margin="0 5px 0 0">TOTAL</PrimaryLabel>
                                {/* <BsInfoCircleFill style={{color: '#BEBEBE' }} /> */}
                              </SummaryRow>
                            </SummaryColumn>
                            <SummaryColumn align="flex-end">
                              {modal_type === 'mint' && <PrimaryLabel>{Math.round(this.calculateMintingTotal() * 100) / 100} {asset.g_asset}</PrimaryLabel>}
                              {modal_type === 'redeem' && <PrimaryLabel>{Math.round(this.calculateBurningTotal() * 100) / 100} {is_native ? asset.native : asset.base_asset}</PrimaryLabel>}
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
                      </Container>
                    </Drawer.Target>
                </Drawer.Drawer>
            </div>
            
        )
    }
}
