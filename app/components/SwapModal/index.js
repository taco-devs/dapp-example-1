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

class SwapModal extends React.Component {

  state = {
    show: false,
  }

  toggleModal = () => {
    this.setState({show: !this.state.show});
  }

  render () {
    const {type, address} = this.props;
    const {show, is_native } = this.state;
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
          
        </Modal>
      </div>
    );
  }
  
}

SwapModal.propTypes = {
};

export default SwapModal;
