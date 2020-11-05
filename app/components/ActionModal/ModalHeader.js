import React, { Component } from 'react'
import styled from 'styled-components';

const ModalHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 70px;
`

const ModalHeaderOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  background-color: ${props => props.active ? props.defaultColor : 'white'};
  color: ${props => props.active ? 'white' : props.defaultColor};
  transition: background-color .4s ease;

  &:hover {
    cursor: pointer;
    opacity: 0.75;
  }
`

export default class ModalHeader extends Component {

    changeType = (modal_type) => {
        const {handleChange} = this.props;
        handleChange('modal_type', modal_type);
    }

    render() {
        const {modal_type} = this.props;
        return (
            <ModalHeaderContainer
                onClick={e => e.stopPropagation()}
            >
                <ModalHeaderOption
                active={modal_type === 'mint'}
                defaultColor="#00d395"
                onClick={(e) => {
                    e.stopPropagation();
                    this.changeType('mint')
                }} 
                >
                    <p>MINT</p>
                </ModalHeaderOption>
                <ModalHeaderOption
                active={modal_type === 'redeem'}
                defaultColor="#161d6b"
                onClick={(e) => {
                    e.stopPropagation();
                    this.changeType('redeem')
                }} 
                >
                    <p>REDEEM</p>
                </ModalHeaderOption>
            </ModalHeaderContainer>
        )
    }
}
