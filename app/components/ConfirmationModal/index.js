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
  height: calc(40vh - 4em);
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
    height: '40vh',
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

  render() {
    const {currentSwap} = this.props;
    return (
      <Modal
            isOpen={currentSwap}
            style={customStyles}
            contentLabel="Confirmation"
      >
        <ConfirmationBody >
          <HeaderSection>
            <h3>Waiting for Confirmation</h3>
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
            <DataBodyRow flex="5">
              <BounceLoader 
                size={120}
              />
            </DataBodyRow>
          </DataBody>
        </ConfirmationBody>
      </Modal>
    );
  }
  
}

ConfirmationModal.propTypes = {};

export default ConfirmationModal;
