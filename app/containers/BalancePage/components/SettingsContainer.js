import React, { Component } from 'react'; 
import styled from 'styled-components';
import Switch from 'rc-switch';

const StyledMenu = styled.div`
    font-size: 0.85em;
    width: 100%;
    display: flex;
    flex-direction: row;
    color: white;
    align-items: center;
    background-color: rgba(255, 255, 255, .05);
    height: ${props => props.open ? '80px' : '0'};
    ${props => props.open && 'padding: 0 0 0.75em 0;'}
    border-radius: 0 5px 5px 5px;
    transition: height 0.5s;
    &:hover {
        color: #00d395;
        cursor: pointer;
    }
`

const StyledSettingsRow = styled.div`
    display: flex;
    flex-direction: row;
`

const SettingColumn = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 1.5em 0 1.5em;
`

const SettingLabel = styled.p`
    font-size: 0.85em;
    color:white;
`


const SwitchBox = styled.label`
  position: relative;
  display: inline-block;
  width: 150px;
  height: 34px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input:checked + .slider {
    background-color: ${props => {
      if (props.modal_type === 'mint') return '#00d395';
      if (props.modal_type === 'redeem') return '#161d6b';
    }};
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(73px);
    -ms-transform: translateX(73px);
    transform: translateX(73px);
  }
  
`

const SwitchSlider = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => {
    if (props.modal_type === 'mint') return '#00d395';
  }};
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 5px;

  &:before {
    border-radius: 5px;
    position: absolute;
    content: "";
    height: 26px;
    width: 70px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }
`

const SwitchLabel = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  z-index: 99;
  color: ${props => {
    if (props.value === props.active) return '#00d395'; 
    return 'white';
  }};
  -webkit-transition: .4s;
  transition: .4s;
  font-size: 0.85em;
`

export default class SettingsContainer extends Component {
    render() {
        const {open, hideBalances} = this.props;
        return (
            <StyledMenu open={open}>
                { open && (
                    <StyledSettingsRow>
                        <SettingColumn>
                            <SettingLabel>SHOW VALUE</SettingLabel>
                            <SwitchBox  modal_type="mint" onClick={e => e.stopPropagation()}>
                                <input type="checkbox" checked={hideBalances}/>
                                <SwitchSlider className="slider" modal_type="mint" onClick={this.props.toggleHideBalances}>
                                    <SwitchLabel 
                                        value={false}
                                        active={hideBalances}  
                                        modal_type="mint">
                                    <p>$</p>
                                    </SwitchLabel>
                                    <SwitchLabel 
                                        value={true}
                                        active={hideBalances}  
                                        modal_type="mint">
                                    <p>%</p>
                                    </SwitchLabel>
                                </SwitchSlider>
                            </SwitchBox>
                        </SettingColumn>
                    </StyledSettingsRow>
                )}
                
            </StyledMenu>
        )
    }
}
