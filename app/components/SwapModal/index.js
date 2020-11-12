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
    height: '500px',
  },
  overlay: {
    backgroundColor: 'rgb(0,0,0, 0.50)'
  }
};

class SwapModal extends React.Component {

  state = {
    balanceIn: null,
    balanceOut: null,
    amountInput: null,
    amountOutput: null,
    spotPrice: null,
    spotPrice_rate: null,
  }

  handleMultipleChange = (values) => {
    this.setState({...values})
  }

  render () {
    const {type, show} = this.props;
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          this.props.toggleModal()
        }}
      >
        <Modal
          isOpen={show}
          // onAfterOpen={afterOpenModal}
          onRequestClose={(e) => {
            this.props.toggleModal(type);
          }}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <Swapper>
            <SwapSection
              {...this.props}
              {...this.state}
              handleMultipleChange={this.handleMultipleChange}
            />
            <SwapSummary 
              {...this.props}
              {...this.state}
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
