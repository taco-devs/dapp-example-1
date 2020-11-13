import React, { Component } from 'react'
import styled from 'styled-components';
import SwapInputSection from './SwapInputSection';
import SwapApproveSection from './SwapApproveSection';

const SwapSectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 2;
`

export default class SwapSection extends Component {
    render() {
        const {status} = this.props;
        return (
            <SwapSectionContainer>
                {status === 'INPUT' && (
                    <SwapInputSection {...this.props} />
                )}
                {status === 'APPROVE' && (
                    <SwapApproveSection {...this.props} />
                )}
            </SwapSectionContainer>
        )
    }
}
