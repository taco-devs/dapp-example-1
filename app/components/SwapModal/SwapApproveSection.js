import React, { Component } from 'react'
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import {arrowDown} from 'react-icons-kit/fa/arrowDown';

const StyledWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: #00d395;
    justify-content: center;
    align-items: center;
`

const StyledRow = styled.div`
    display: flex; 
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 0.5em 0 0.5em 0;
`

const StyledColumn = styled.div`
    display: flex; 
    flex-direction: column;
    flex: ${props => props.flex || 1};
    align-items: center;
    margin: 0 0.5em 0 0.5em;
`

const StyledImage = styled.img`
    height: 65px;
    width: 65px;
    background-color: ${props => props.color || 'white'};
    border-radius: 50%;
    padding: 0.25em;
`

const StyledText = styled.p`
  text-align: ${props => props.textAlign || 'center'};
  min-width: 100px;
  margin: 0 5px 0 5px;
  font-size: ${props => props.size || '1em'};
  letter-spacing: 1px;
  color: ${props => {
    if (props.color === 'blue') return '#161d6b';
    if (props.color === 'green') return '#00d395';
    return 'white';
  }};
`

export default class SwapApproveSection extends Component {

    getImageName = (asset) => {
        const {Network} = this.props;

        if (asset === 'GRO') {
            return Network.growth_token.img_url;
        } else {
            return Network.available_assets[asset].gtoken_img_url;
        }
    }

    parseNumber = (amount, decimals, roundFactor) => {
        return Math.round(amount / decimals * roundFactor) / roundFactor;
    }

    render() {
        const {assetIn, assetOut, amountInput, amountOutput} = this.props;
        return (
            <StyledWrapper>
                <StyledRow>
                    <StyledColumn>
                        <StyledImage 
                            src={require(`images/tokens/${this.getImageName(assetIn)}`)}
                        />
                    </StyledColumn>
                    <StyledColumn
                        flex="2"
                    >
                        <StyledText 
                            color="blue"
                            size="1.2em"
                        >
                            {this.parseNumber(amountInput, 1, 100000)}
                        </StyledText>
                        <StyledText 
                            size="1em"
                        >
                            {assetIn}
                        </StyledText>
                    </StyledColumn>
                </StyledRow>
                <StyledRow>
                    <Icon icon={arrowDown} size="1.2em"/>
                </StyledRow>
                <StyledRow>
                    <StyledColumn>
                        <StyledImage 
                            src={require(`images/tokens/${this.getImageName(assetOut)}`)}
                        />
                    </StyledColumn>
                    <StyledColumn
                        flex="2"
                    >
                        <StyledText 
                            color="blue"
                            size="1.2em"
                        >
                            {this.parseNumber(amountOutput, 1, 100000)}
                        </StyledText>
                        <StyledText 
                            size="1em"
                        >
                            {assetOut}
                        </StyledText>
                    </StyledColumn>
                </StyledRow>
            </StyledWrapper>
        )
    }
}
