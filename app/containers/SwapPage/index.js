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
import makeSelectSwapPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import styled from 'styled-components';

import { SwapHeader, SwapList } from './components';

const Swap = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${props => props.isMobile ? '0 0.5em 0 0.5em' : '0 1em 0 1em;'}
  align-items: center;
`

const SwapContainer = styled.div`
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


class SwapPage extends React.Component {

  render() {
    return (
      <div>
        <Helmet>
          <title>Swap</title>
          <meta name="description" content="Description of SwapPage" />
        </Helmet>
        <Swap>
          <SwapHeader />
          <SwapContainer>
            <SwapList 
              {...this.props}
              {...this.state}
            />
          </SwapContainer>
        </Swap>
        
      </div>
    );
  }  
}


const withReducer = injectReducer({ key: 'swapPage', reducer });
const withSaga = injectSaga({ key: 'swapPage', saga });

SwapPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  swapPage: makeSelectSwapPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
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
)(SwapPage);
