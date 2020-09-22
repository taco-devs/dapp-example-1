import React, { Component } from 'react';
import * as Drawer from '@accessible/drawer'
import styled from 'styled-components';
import {GiHamburgerMenu} from 'react-icons/gi'


const Burger = styled.a`
  color: white;

  &:hover {
    cursor: pointer;
    color: #00d395;
  }
`

const MaskContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  height: 100vh;
  width: 100vw;
  z-index: 120;
`

const Mask = styled.div`
  height: 100vh;
  width: 35vw;
  background-color: black;
  opacity: 0.35;
`

const StyledDrawerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 65vw;
  background: rgb(22,29,107);
  background: radial-gradient(circle, rgba(22,29,107,1) 0%, rgba(11,15,60,1) 100%);
  -webkit-box-shadow: -5px 0px 10px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: -5px 0px 10px 0px rgba(0,0,0,0.75);
  box-shadow: -5px 0px 10px 0px rgba(0,0,0,0.75);
  height: 100vh;
  z-index: 121;
`



export default class MenuDrawer extends Component {

    constructor (props) {
        super(props);

        this.containerRef = React.createRef();
    }

    state = {
        open: false
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }
  
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        console.log(this.containerRef)
        if (this.containerRef && !this.containerRef.current.contains(event.target)) {
            this.setState({open: false});
        }
    }
  

    toggle = () => {
        this.setState({open: !this.state.open});
    }

    render() {
        const {open} = this.state;
        return (
            <div ref={this.containerRef}>
                <Drawer.Drawer 
                    open={open}
                >
                    <Drawer.Trigger>
                        <Burger
                            onClick={() => this.toggle()}
                        >
                            <GiHamburgerMenu size="1.5em"/>
                        </Burger>
                    </Drawer.Trigger>
                
                    <Drawer.Target 
                        placement="right"
                        preventScroll={true}
                    >
                        <MaskContainer>
                            <Mask 
                                onClick={() => this.toggle()}
                            />
                            <StyledDrawerContainer>

                            </StyledDrawerContainer>
                        </MaskContainer>
                    </Drawer.Target>
                </Drawer.Drawer>
            </div>
            
        )
    }
}
