/**
 *
 * ConnectWallet
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styled from 'styled-components';


const ConnectButton = styled.div`
  display: flex; 
  flex-direction: column;
  justify-content: center;
  border-radius: 5px;
  border-color: #00d395;
  border-width: 3px;
  border-style: solid;
  color: white;
  padding: 0.5em 1em 0.5em 1em;

  &:hover {
    cursor: pointer;
    background-color: #00d395;
  }
`

class ConnectWallet extends React.Component {

  handleToggleModal = () => {
    const {toggleModal} = this.props;
    toggleModal();
  }

  render () {
    return (
      <ConnectButton onClick={this.handleToggleModal}>
        <FormattedMessage {...messages.header} />
      </ConnectButton>
    )
  }
}


ConnectWallet.propTypes = {};

export default ConnectWallet;
