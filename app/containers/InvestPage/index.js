/**
 *
 * InvestPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectInvestPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import styled from 'styled-components';
import {AssetList, InvestHeader} from './components';

const Invest = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 1em 0 1em;
`

const InvestContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 30vh;
  width: 100%;
  background-color: rgba(0, 0, 0, .15);
  border-radius: 5px;
  margin: 0.5em 0 0 0;
`

class InvestPage extends React.Component {

  render () {
    return (
      <Invest>
        <InvestHeader />
        <InvestContainer>
          <AssetList />
        </InvestContainer>
      </Invest>
    
  );
  }
  
}

InvestPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


const withReducer = injectReducer({ key: 'investPage', reducer });
const withSaga = injectSaga({ key: 'investSaga', saga });

const mapStateToProps = createStructuredSelector({
  investPage: makeSelectInvestPage(),
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
    withConnect,
    withReducer,
    withSaga,
  )(InvestPage);
