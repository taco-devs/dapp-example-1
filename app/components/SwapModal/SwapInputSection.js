import React, { Component } from 'react'
import styled from 'styled-components';
import SwapInputIn from './SwapInputIn';
import SwapInputOut from './SwapInputOut';
import {Icon} from 'react-icons-kit';
import {arrowDown} from 'react-icons-kit/fa/arrowDown';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    padding: 0 1.5em 0 1.5em;
    height: 100%;
`

const IconSection = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: #161d6b;
    height: 50px;
`

const IconButton = styled.div`
    &:hover {
        cursor: pointer;
        opacity: 0.75;
    }
`

export default class SwapInputSection extends Component {
    render() {
        return (
            <Wrapper>
                <SwapInputIn {...this.props}/>
                <IconSection>
                    <IconButton>
                        <Icon 
                            icon={arrowDown} 
                            size="1.5em"
                        />
                    </IconButton>
                </IconSection>
                <SwapInputOut {...this.props} />
            </Wrapper>
        )
    }
}
