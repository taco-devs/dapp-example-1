import React, { Component } from 'react';
import styled from 'styled-components';
import {BsSearch, BsArrowLeftShort, BsArrowRightShort} from 'react-icons/bs';

const InvestHeaderRow = styled.div`
    display: flex;
    flex-direction: row;
    margin: 1.5em 0 0.5em 0;
    justify-content: space-between;
`

const InvestHeaderColumn = styled.div`
    display: flex;
    flex-direction: column;
`

const SearchContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 350px;
    color: white;
    background-color: rgba(255, 255, 255, .05);
    height: 40px;
    border-radius: 5px;
`

const StyledSearchBox = styled.input`
    width: 100%;
    margin: 0 15px 0 0;
    background-color: rgba(255, 255, 255, 0);
    border: 0;
    color: white;
    outline: none;
`

const PaginationButtons = styled.div`
    display: flex;
    flex-direction: row;
    width: 150px;
    color: white;
    height: 40px;
    align-items: center;
`

export default class InvestHeader extends Component {
    render() {
        return (
            <InvestHeaderRow>
                <InvestHeaderColumn>
                    <SearchContainer>
                        <BsSearch style={{margin: '0 15px 0 15px'}} />
                        <StyledSearchBox placeholder="FILTER BY TOKEN OR PROTOCOL"/>
                    </SearchContainer>
                </InvestHeaderColumn>
                <InvestHeaderColumn>
                    <PaginationButtons>
                        <BsArrowLeftShort size="1.5em" style={{margin: '0 15px 0 0'}}/>
                        <p>1 of 10</p>
                        <BsArrowRightShort size="1.5em" style={{margin: '0 0 0 15px'}}/>
                    </PaginationButtons>
                </InvestHeaderColumn>
            </InvestHeaderRow>
        )
    }
}
