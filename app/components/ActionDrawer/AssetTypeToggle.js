import React, { Component } from 'react';
import styled from 'styled-components';

const Toggle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 50px;
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
    if (props.modal_type === 'redeem') return '#161d6b'; 
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
    if (props.modal_type === 'mint') {
      if (props.value === props.is_native) return '#00d395'; 
      return 'white';
    } else {
      if (props.value === props.is_native) return '#161d6b'; 
      return 'white';
    }
    
  }};
  -webkit-transition: .4s;
  transition: .4s;
  font-size: 0.85em;
`

export default class AssetTypeToggle extends Component {

    handleToggle = () => {
        const {toggleNativeSelector} = this.props;
        toggleNativeSelector();
    }

    render() {
        const {modal_type, is_native} = this.props;
        return (
            <Toggle>
                <SwitchBox modal_type={modal_type}>
                <input type="checkbox" checked={is_native}/>
                <SwitchSlider className="slider" modal_type={modal_type} onClick={this.handleToggle}>
                    <SwitchLabel
                        name="base"
                        value={false}
                        is_native={is_native} 
                        modal_type={modal_type}
                    >
                    <p>ASSET</p>
                    </SwitchLabel>
                    <SwitchLabel
                        name="native"
                        value={true}
                        is_native={is_native} 
                        modal_type={modal_type}
                    >
                        <p>NATIVE</p>
                    </SwitchLabel>
                </SwitchSlider>
                </SwitchBox>
            </Toggle>
        )
    }
}
