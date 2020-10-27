import React, { Component } from 'react';
import styled from 'styled-components';

import { Icon } from 'react-icons-kit';
import {ic_search} from 'react-icons-kit/md/ic_search';
import {ic_arrow_forward} from 'react-icons-kit/md/ic_arrow_forward';
import {ic_arrow_back} from 'react-icons-kit/md/ic_arrow_back'


const InvestHeaderRow = styled.div`
    display: flex;
    flex-direction: row;
    margin: 1em 0 0.5em 0;
    flex: 1;
    width: 100%;
    justify-content: space-between;
    font-size: ${props => props.isMobile ? '0.8em' : '1em'};
`

const InvestHeaderColumn = styled.div`
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

export default class InvestHeader extends Component {

    showPagination = () => {
        const {pagination, assets, search} = this.props;
        if (!assets) return '-'

        // filter assets
        const filterd_assets = 
            assets
                .filter(asset_key => {
                    if (!search) return true;
                    if (search.length < 1) return true;
                    return `g${asset_key}`.toUpperCase().indexOf(search.toUpperCase()) > -1;
                })

        const page_number = Math.ceil(filterd_assets.length / 10);
        if (page_number < 1) return '1 / 1';
        return `${pagination + 1} / ${page_number}`;
    }

    handlePagination = (direction) => {
        const {changePage, pagination, assets, search} = this.props;

        // filter assets
        const filterd_assets = 
            assets
                .filter(asset_key => {
                    if (!search) return true;
                    if (search.length < 1) return true;
                    return `g${asset_key}`.toUpperCase().indexOf(search.toUpperCase()) > -1;
                })

        const page_number = Math.ceil(filterd_assets.length / 10);
        if (direction === 'back') {
            if (pagination < 1) return;
            changePage(pagination - 1);
        }
        if (direction === 'forward') {
            if ((pagination + 1) === page_number) return;
            changePage(pagination + 1);
        }
    }

    handleSearch = (search) => {
        const {changePage, searchAssets, pagination} = this.props;
        changePage(0);
        searchAssets(search);
    }

    render() {
        const {search, isMobile} = this.props;
        return (
            <InvestHeaderRow isMobile={isMobile}>
                <InvestHeaderColumn flex={isMobile ? 2.5 : 1}>
                    <SearchContainer isMobile={isMobile}>
                        <Icon icon={ic_search} size="1.5em" style={{margin: isMobile ? '0 8px 0 8px' : '0 15px 0 15px'}} />
                        <StyledSearchBox 
                            placeholder={isMobile ? "FILTER ASSETS" : "FILTER BY TOKEN, PROTOCOL OR POOL"}
                            value={search}
                            onChange={(e) => this.handleSearch(e.target.value)}
                        />
                    </SearchContainer>
                </InvestHeaderColumn>
                <InvestHeaderColumn flex={1}>
                    <PaginationButtons>
                        <Icon icon={ic_arrow_back} class="hover-item" size="1.5em" style={{margin: isMobile ? '0 5px 0 0' : '0 15px 0 0'}} onClick={() => this.handlePagination('back')} />
                        <p>{this.showPagination()}</p>
                        <Icon icon={ic_arrow_forward} class="hover-item" size="1.5em" style={{margin: isMobile ? '0 0 0 5px' : '0 0 0 15px'}} onClick={() => this.handlePagination('forward')} />
                    </PaginationButtons>
                </InvestHeaderColumn>
            </InvestHeaderRow>
        )
    }
}
