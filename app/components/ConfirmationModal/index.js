/**
 *
 * ConfirmationModal
 *
 */

import React from 'react';
import Modal from 'react-modal';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import BounceLoader from "react-spinners/BounceLoader";
import { FaArrowRight } from 'react-icons/fa'
import {MdOpenInNew} from 'react-icons/md'
import {TiTick} from 'react-icons/ti'

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { extend } from 'lodash';

const ConfirmationBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const HeaderSection = styled.div`
  display: flex;
  height: 4em;
`

const DataBody = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(35vh - 4em - 15px);
  width: 100%;
  align-items: center;
  background-color: ${props => {
    if (props.modal_type === 'mint') return '#00d395';
    if (props.modal_type === 'redeem') return '#161d6b';
  }};
  padding: 1.5em 0 1.5em 0;
`

const DataBodyRow = styled.div`
  display: flex;
  flex: ${props => props.flex || 1};
  flex-direction: row;
  justify-items: center;
  align-items: center;
  color: white;
`

const Divider = styled.div`
  width: 90%;
  height: 2px;
  background-color: white;
  margin: 1em 0 0 0;
`

const DataBodyColumn = styled.div`
  display: flex;
  flex: ${props => props.flex || 1};
  flex-direction: column;  
  align-items: ${props => props.align || 'center'};
  margin: ${props => props.margin || '0'};
  color: ${props => props.color || 'white'};
`

const StyledText = styled.p`
  text-align: ${props => props.textAlign || 'center'};
  width: 100px;
  margin: 0 5px 0 5px;
  font-size: ${props => props.size || '1em'};
  letter-spacing: 1px;
  color: ${props => props.color || 'white'};
`

const StyledLogo = styled.img`
  height: 50px;
  width: auto;
`

const StyledTitle = styled.h3`
  color: ${props => props.color || 'white'};
`

const StyledTransactionReceipt = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 400px;
  margin: 1em;
  height: 80%;
  border-radius: 5px;
  background-color: rgba(0,0,0,0.15);
`

const StyledTransactionReceiptColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${props => props.flex || '1'};
  align-items: ${props => props.align || 'center'};
  justify-content: center;
`

const StyledTransactionReceiptRow = styled.div`
  display: flex;
  flex-direction: column;
  color: white;

  ${props => props.hoverable && `
    &:hover {
      cursor: pointer;
      color: black;
    }
  `}
`

const CustomLink = styled.a`
    color: #161d6b;
    text-decoration: none;

    &:hover {
      cursor: pointer;
      color: black;
    }
`

const IconContainer = styled.div`
    color: white;
`

const LoaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    background-color: #00d395;
    height: 15px;
    width: 100%;
`

const LoaderBar = styled.div`
    height: 15px;
    width: ${props => props.progress ? `450px` : 0};
    background-color: #161d6b;
    transition: width 5s ease;
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
    height: '35vh',
  },
  overlay: {
    backgroundColor: 'rgb(0,0,0, 0.50)'
  }
};

class ConfirmationModal extends React.Component {

  parseNumber = (number, decimals) => {
    const float_number = Number(number) / Number(decimals);
    return Math.round(float_number * 10000) / 10000;
  }

  parseHash = (address) => {
    const front_tail = address.substring(0,10);
    const end_tail = address.substring(address.length - 10, address.length);
    return `${front_tail}...${end_tail}`; 
  }

  getEtherscanLink = (hash) => {
    const {network_id} = this.props;

    if (!network_id) return 'https://etherscan.io';
    if (network_id === 'eth') return `https://etherscan.io/tx/${hash}`
    if (network_id === 'kovan') return `https://kovan.etherscan.io/tx/${hash}`
  }

  calculateWidth = (progress) => {
    const CONFIRMATION_WIDTH = 450;
    return Math.round((Number(progress) / 100) * CONFIRMATION_WIDTH);
  }

  render() {
    const {currentSwap} = this.props;
    console.log(currentSwap);
    return (
      <Modal
            isOpen={currentSwap}
            style={customStyles}
            contentLabel="Confirmation"
      >
        <ConfirmationBody >
          <HeaderSection>
            {currentSwap && currentSwap.status === 'loading' && <h3>Waiting for Confirmation</h3>}
            {currentSwap && currentSwap.status === 'receipt' && <h3>Transaction Submitted</h3>}
            {currentSwap && currentSwap.status === 'confirmed' && <h3>Transaction Confirmed</h3>}
          </HeaderSection>
          <DataBody modal_type='mint'>
            <DataBodyRow>
              <DataBodyColumn>
                <StyledTitle color="#161d6b">Minting</StyledTitle>
                {currentSwap && (
                  <DataBodyRow shadow>
                    <DataBodyColumn align="right">
                        <StyledLogo src={currentSwap.fromImage}/>
                    </DataBodyColumn>
                    <DataBodyColumn flex="3" margin="0 1.5em 0 0">
                      <StyledText size="1.2em" color="#161d6b">{this.parseNumber(currentSwap.sending, currentSwap.fromDecimals)}</StyledText>
                      <StyledText>{`${currentSwap.from}`}</StyledText>
                    </DataBodyColumn>
                    <DataBodyColumn flex="1" color="#161d6b">
                      <FaArrowRight size="2em"/>
                    </DataBodyColumn>
                    <DataBodyColumn flex="3" margin="0 0 0 1.5em">
                      <StyledText size="1.2em" color="#161d6b">{this.parseNumber(currentSwap.receiving, currentSwap.toDecimals)}</StyledText>
                      <StyledText>{currentSwap.to}</StyledText>
                    </DataBodyColumn>
                    <DataBodyColumn align="left">
                      <StyledLogo src={currentSwap.toImage}/>
                    </DataBodyColumn>
                  </DataBodyRow>
                )}
              </DataBodyColumn>
            </DataBodyRow>
            <Divider />
            <DataBodyRow flex="2">
              {currentSwap && currentSwap.status === 'loading' && (
                <BounceLoader 
                  size={60}
                />
              )}
              {currentSwap && (currentSwap.status === 'receipt' || currentSwap.status === 'confirmed') && currentSwap.hash && (
                <StyledTransactionReceipt>
                    <StyledTransactionReceiptColumn>
                      <StyledTransactionReceiptRow>
                        {currentSwap.status === 'receipt' && (
                          <BounceLoader 
                          size={25}
                        />
                        )}
                        {currentSwap.status === 'confirmed' && (
                          <IconContainer><TiTick size="2em"/></IconContainer>
                        )}
                      </StyledTransactionReceiptRow>
                    </StyledTransactionReceiptColumn>
                    <StyledTransactionReceiptColumn flex="3" align="flex-start">
                      <StyledTransactionReceiptRow>Transaction ID</StyledTransactionReceiptRow>
                      <StyledTransactionReceiptRow>
                        <CustomLink
                          href={this.getEtherscanLink(currentSwap.hash)}
                          target='_blank'
                        >
                          {this.parseHash(currentSwap.hash)}
                        </CustomLink>
                      </StyledTransactionReceiptRow>
                    </StyledTransactionReceiptColumn>
                    <StyledTransactionReceiptColumn>
                      <StyledTransactionReceiptRow flex="2">
                        <StyledTransactionReceiptRow hoverable={true}>
                          <CustomLink
                            href={this.getEtherscanLink(currentSwap.hash)}
                            target='_blank'
                          >
                            <MdOpenInNew size="2em"/>
                          </CustomLink>
                        </StyledTransactionReceiptRow>
                      </StyledTransactionReceiptRow>
                    </StyledTransactionReceiptColumn>
                </StyledTransactionReceipt>
              )}
            </DataBodyRow>
          </DataBody>
          <LoaderContainer>
            {currentSwap && (
              <LoaderBar progress={currentSwap.progress} />
            )}
          </LoaderContainer>
        </ConfirmationBody>
      </Modal>
    );
  }
  
}

ConfirmationModal.propTypes = {};

export default ConfirmationModal;
