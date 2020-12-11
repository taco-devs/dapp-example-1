import React, { Component } from 'react';
import styled from 'styled-components';

import { Icon } from 'react-icons-kit';
import {ic_arrow_forward} from 'react-icons-kit/md/ic_arrow_forward';
import {ic_arrow_back} from 'react-icons-kit/md/ic_arrow_back'


const TransactionsHeaderRow = styled.div`
    display: flex;
    flex-direction: row;
    margin: 1em 0 0.5em 0;
    flex: 1;
    width: 100%;
    justify-content: space-between;
    font-size: ${props => props.isMobile ? '0.8em' : '1em'};
`

const TransactionsHeaderColumn = styled.div`
    display: flex;
    flex-direction: column;
    flex: ${props => props.flex || '1'};
`

const SearchContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: ${props => props.isMobile ? '100%' : '350px'};
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
    white-space: nowrap;
    overflow: hidden;
`

const PaginationButtons = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;

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

export default class TransactionsHeader extends Component {

    showPagination = () => {
        const {user, pagination} = this.props;
        console.log(this.props)
        if (!user) return '-';

        const page_number = Math.ceil(Number(user.transactions) / 10);
        if (page_number < 1) return '1 / 1';
        return `${pagination + 1} / ${page_number}`;
    }

    handlePagination = async (direction) => {
        const {user, pagination, changePage, fetchTransactions } = this.props;

        const page_number = Math.ceil(Number(user.transactions) / 10);
        if (direction === 'back') {
            if (pagination < 1) return;
            await changePage(pagination - 1);
            await fetchTransactions();
        }
        if (direction === 'forward') {
            if ((pagination + 1) === page_number) return;
            await changePage(pagination + 1);
            await fetchTransactions();
        }
    }

    handleSearch = (search) => {
        const {changePage, searchAssets} = this.props;
        changePage(0);
        searchAssets(search);
    }

    render() {
        const {search, isMobile} = this.props;
        return (
            <TransactionsHeaderRow isMobile={isMobile}>
                <TransactionsHeaderColumn flex={isMobile ? 2.5 : 1}>
                    {/* <SearchContainer isMobile={isMobile}>
                        <BsSearch style={{margin: isMobile ? '0 8px 0 8px' : '0 15px 0 15px'}} />
                        <StyledSearchBox 
                            placeholder={isMobile ? "FILTER ASSETS" : "FILTER BY TOKEN, PROTOCOL OR POOL"}
                            value={search}
                            onChange={(e) => this.handleSearch(e.target.value)}
                        />
                    </SearchContainer> */}
                </TransactionsHeaderColumn>
                <TransactionsHeaderColumn flex={1}>
                    <PaginationButtons>
                        <Icon icon={ic_arrow_back} class="hover-item" size="1.5em" style={{margin: isMobile ? '0 5px 0 0' : '0 15px 0 0'}} onClick={() => this.handlePagination('back')} />
                        <p>{this.showPagination()}</p>
                        <Icon icon={ic_arrow_forward} class="hover-item" size="1.5em" style={{margin: isMobile ? '0 0 0 5px' : '0 0 0 15px'}} onClick={() => this.handlePagination('forward')} />
                    </PaginationButtons>
                </TransactionsHeaderColumn>
            </TransactionsHeaderRow>
        )
    }
}
