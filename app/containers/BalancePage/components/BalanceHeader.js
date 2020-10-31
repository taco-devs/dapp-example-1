import React, { Component } from 'react';
import styled from 'styled-components';
import Switch from "react-switch";
import { Icon } from 'react-icons-kit';
import {chevronDown} from 'react-icons-kit/fa/chevronDown';
import {chevronUp} from 'react-icons-kit/fa/chevronUp'
import {ic_arrow_forward} from 'react-icons-kit/md/ic_arrow_forward';
import {ic_arrow_back} from 'react-icons-kit/md/ic_arrow_back';
import SettingsContainer from './SettingsContainer';

const InvestHeaderRow = styled.div`
    display: flex;
    flex-direction: row;
    margin: 1em 0 0em 0;
    flex: 1;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    font-size: ${props => props.isMobile ? '0.8em' : '1em'};
`

const InvestHeaderColumn = styled.div`
    display: flex;
    flex-direction: row;
    flex: ${props => props.flex || '1'};
    justify-content: ${props => props.justify || 'flex-start'};
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

const StyledLabel = styled.div`
    font-size: 0.85em;
    display: flex;
    flex-direction: row;
    color: white;
    align-items: center;
    background-color: rgba(255, 255, 255, .05);
    height: 40px;
    border-radius: ${props => props.open ? '5px 5px 0 0' : '5px'};
    padding: 0 0.75em 0 0.75em;

    &:hover {
        color: #00d395;
        cursor: pointer;
    }
`

export default class BalanceHeader extends Component {

    handleOpenMenu = () => {
        const {toggleSettings} = this.props;
        toggleSettings();
    }

    render() {
        const {search, isMobile, hideBalances, openSettingsMenu} = this.props;
        return (
            <React.Fragment>
                <InvestHeaderRow isMobile={isMobile}>
                    <InvestHeaderColumn justify="flex-start">
                    <StyledLabel 
                        open={openSettingsMenu}
                        onClick={this.handleOpenMenu}
                    >
                        <Icon icon={openSettingsMenu ? chevronUp : chevronDown} size="1em" style={{margin: '-2.5px 0.5em 0 0'}}/>
                        <p>SETTINGS</p>
                    </StyledLabel>
                    </InvestHeaderColumn>
                    <InvestHeaderColumn>
                        <PaginationButtons>
                            <Icon icon={ic_arrow_back} class="hover-item" size="1.5em" style={{margin: isMobile ? '0 5px 0 0' : '0 15px 0 0'}} onClick={() => this.handlePagination('back')} />
                            <p>1 / 1</p>
                            <Icon icon={ic_arrow_forward} class="hover-item" size="1.5em" style={{margin: isMobile ? '0 0 0 5px' : '0 0 0 15px'}} onClick={() => this.handlePagination('forward')} />
                        </PaginationButtons>
                    </InvestHeaderColumn>
                </InvestHeaderRow>
                <SettingsContainer 
                    {...this.props}
                    open={openSettingsMenu}
                />
            </React.Fragment>
            
        )
    }
}
