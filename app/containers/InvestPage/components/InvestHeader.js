import React, { Component } from 'react';
import styled from 'styled-components';
import {BsSearch, BsArrowLeftShort, BsArrowRightShort} from 'react-icons/bs';

const InvestHeaderRow = styled.div`
    display: flex;
    flex-direction: row;
    margin: 1em 0 0.5em 0;
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
    font-size: 0.85em;
`

const PaginationButtons = styled.div`
    display: flex;
    flex-direction: row;
    width: 150px;
    color: white;
    height: 40px;
    align-items: center;

    .hover-item {
        &:hover {
            cursor: pointer;
            color: #00d395;
        }
    }
`

const StyledIcon = ({Icon}) => {
    return styled(Icon)`
        margin: 0 15px 0 0;
    `
}

export default class InvestHeader extends Component {

    showPagination = () => {
        const {pagination, assets} = this.props;
        if (!assets) return '-'
        const page_number = Math.ceil(assets.length / 10);
        return `${pagination + 1} / ${page_number}`;
    }

    handlePagination = (direction) => {
        const {changePage, pagination, assets} = this.props;
        const page_number = Math.ceil(assets.length / 10);
        if (direction === 'back') {
            if (pagination < 1) return;
            changePage(pagination - 1);
        }
        if (direction === 'forward') {
            if ((pagination + 1) === page_number) return;
            changePage(pagination + 1);
        }
    }

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
                        <BsArrowLeftShort class="hover-item" size="1.5em" style={{margin: '0 15px 0 0'}} onClick={() => this.handlePagination('back')} />
                        <p>{this.showPagination()}</p>
                        <BsArrowRightShort class="hover-item" size="1.5em" style={{margin: '0 0 0 15px'}} onClick={() => this.handlePagination('forward')} />
                    </PaginationButtons>
                </InvestHeaderColumn>
            </InvestHeaderRow>
        )
    }
}
