/**
 *
 * SwapPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import NetworkData from 'contracts';
import styled from 'styled-components';
import SwapModal from 'components/SwapModal';

const Swap = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${props => props.isMobile ? '0 0.5em 0 0.5em' : '0 1em 0 1em;'}
  align-items: center;
`

const Swapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, .15);
  border-radius: 5px;
  margin: 0.5em 0 0;
  align-items: center;
  justify-content: center;
`


class SwapContainer extends React.Component {

  state = {
    show: false
  }

  toggleContainer = () => {
    this.setState({show: !this.state.show});
  }

  render() {
    return (
      <SwapModal 
        {...this.props}
        toggleContainer={this.toggleContainer}
      />
    );
  }  
}


const withReducer = injectReducer({ key: 'swapper', reducer });
const withSaga = injectSaga({ key: 'swapper', saga });

SwapContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({

});

function mapDispatchToProps(dispatch) {
  return {
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withReducer,
  withSaga,
  withConnect
)(SwapContainer);
