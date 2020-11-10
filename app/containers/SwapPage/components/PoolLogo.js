import React, { Component } from 'react'
import PropTypes from 'prop-types';
import styled from 'styled-components';

const LogoContainer = styled.div`
    width: 95px;
`

const Pool = styled.img`
    width: 30px;
    height: 30px;
    background-color: white;
    border-radius: 50%;
    padding: 1px;
    margin: -25px 0 0 -15px;
    z-index: 20;
`

const Token0 = styled.img`
    width: ${props => props.isMobile ? '40px' : '50px'};
    height: auto;
    background-color: #21262b;
    border-radius: 50%;
    padding: 3px;
    z-index: 1;
`

const Token1 = styled.img`
    width: ${props => props.isMobile ? '40px' : '50px'};
    height: auto;
    margin: 0 0 0 -20px;
    background-color: white;
    border-radius: 50%;
`



const PoolLogo = ({asset}) => {
    return (
        <LogoContainer>
            <Token0 src={require(`images/logo.png`)} />
            <Token1 src={require(`images/tokens/${asset.gtoken_img_url}`)}/>
            <Pool src={require('images/tokens/balancer.png')} />
        </LogoContainer>
    )
}

export default PoolLogo;