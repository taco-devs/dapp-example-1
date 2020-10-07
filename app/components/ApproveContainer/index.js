/**
 *
 * ApproveContainer
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

class ApproveContainer extends React.Component {
  render() {
    return (
    <div>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
  
}

ApproveContainer.propTypes = {};

export default ApproveContainer;
