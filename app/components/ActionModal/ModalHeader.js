import React, { Component } from 'react'
import styled from 'styled-components';
import types from 'contracts/token_types.json'

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
  color: ${props => props.active ? 
    (props.asset.type === types.STKGRO ? '#21262b' : 'white')
    : 
    (props.asset.type === types.STKGRO ? '#21262b' : props.defaultColor)
  };
  transition: background-color .4s ease;

  &:hover {
    cursor: pointer;
    opacity: 0.75;
  }
`

const HeaderText = styled.p`
  display: flex;
`

export default class ModalHeader extends Component {

    changeType = (modal_type) => {
        const {handleChange} = this.props;
        handleChange('modal_type', modal_type);
    }

    render() {
        const {modal_type, asset} = this.props;
        return (
            <ModalHeaderContainer
                onClick={e => e.stopPropagation()}
            >
                <ModalHeaderOption
                    asset={asset}
                    active={modal_type === 'mint'}
                    defaultColor={asset.type === types.STKGRO ? '#ffe391' : "#00d395"}
                    onClick={(e) => {
                        e.stopPropagation();
                        this.changeType('mint')
                    }} 
                >
                    <p>
                        {asset.type === types.STKGRO ? 'STAKE' : 'MINT'}
                    </p>
                </ModalHeaderOption>
                <ModalHeaderOption
                    asset={asset}
                    active={modal_type === 'redeem'}
                    defaultColor={asset.type === types.STKGRO ? '#ffe391' : "#161d6b"}
                    onClick={(e) => {
                        e.stopPropagation();
                        this.changeType('redeem')
                    }} 
                >
                     <p>
                        {asset.type === types.STKGRO ? 'UNSTAKE' : 'REDEEM'}
                    </p>
                </ModalHeaderOption>
            </ModalHeaderContainer>
        )
    }
}
