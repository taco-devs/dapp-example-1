import React, { Component } from 'react'
import styled from 'styled-components';
import SwapInputSection from './SwapInputSection';

const SwapSectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 2;
`

export default class SwapSection extends Component {
    render() {
        return (
            <SwapSectionContainer>
                <SwapInputSection {...this.props} />
            </SwapSectionContainer>
        )
    }
}
