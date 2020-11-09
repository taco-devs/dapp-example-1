import React, { Component } from 'react';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import {exchange} from 'react-icons-kit/fa/exchange';


const PrimaryLabel = styled.b`
  color: #161d6b;
  opacity: 0.75; 
  margin: ${props => props.margin || '0'};
  text-align: ${props => props.align || 'left'};
  letter-spacing: ${props => props.spacing || '0'};∫
`


const ToggleCalcContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-end;
`

/* const ToggleButton = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-end;
  padding: 2px 3px 2px 3px;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
    background-color: #E8E8E8;
  } 
`*/

const ToggleButton = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-end;
  padding: 2px 3px 2px 3px;
  border-radius: 5px;
`

export default class CalcToggle extends Component {

    handleToggleCalc = () => {
        const {handleChange} = this.props;
        handleChange('calcFromCost', !this.props.calcFromCost);
    }

    render() {
        const {calcFromCost} = this.props;
        return (
            <ToggleCalcContainer>
                <ToggleButton
                    //onClick={this.handleToggleCalc}
                >
                    {calcFromCost ? (
                        <PrimaryLabel align="right">SEND</PrimaryLabel>
                    ) : (
                        <PrimaryLabel align="right">RECEIVE</PrimaryLabel>
                    )}
                    {/* <Icon icon={exchange} style={{color: '#161d6b', margin: '-3px 0 0 5px'}}/> */}
                </ToggleButton>
            </ToggleCalcContainer>
        )
    }
}
