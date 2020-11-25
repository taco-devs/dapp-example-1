import React, { Component } from 'react';
import styled from 'styled-components';
import types from 'contracts/token_types.json';

const ModalHeader = styled.div`
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
  &:hover {
    cursor: pointer;
    opacity: 0.75;
  }
`

export default class MobileTabs extends Component {

    handleChangeType = (modal_type) => {
        const {handleChange, currentSwap} = this.props;
        if (currentSwap) return;
        handleChange({modal_type});
    }

    render() {
        const {modal_type, asset} = this.props;
        return (
            <ModalHeader>
                <ModalHeaderOption
                    asset={asset}
                    active={modal_type === 'mint'}
                    defaultColor={asset.type === types.STKGRO ? '#ffe391' : "#00d395"}
                    onClick={() => this.handleChangeType('mint')} 
                >
                    <p>{asset.type === types.STKGRO ? 'STAKE' : 'MINT'}</p>
                </ModalHeaderOption>
                <ModalHeaderOption
                    asset={asset}
                    active={modal_type === 'redeem'}
                    defaultColor={asset.type === types.STKGRO ? '#ffe391' : "#161d6b"}
                    onClick={() => this.handleChangeType('redeem')} 
                >
                    <p>{asset.type === types.STKGRO ? 'UNSTAKE' : 'REDEEM'}</p>
                </ModalHeaderOption>
            </ModalHeader>
        )
    }
}
