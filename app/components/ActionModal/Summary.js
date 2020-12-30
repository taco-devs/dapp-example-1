import React, { Component } from 'react';
import styled from 'styled-components';
import { Icon } from 'react-icons-kit';
import {info} from 'react-icons-kit/icomoon/info';
import ApproveContainer from 'components/ApproveContainer';
import ReactTooltip from 'react-tooltip';
import types from 'contracts/token_types.json';
import { numberToBN, BNtoNumber } from 'utils/utilities';

const PrimaryLabel = styled.b`
  color: #161d6b;
  opacity: 0.75; 
  margin: ${props => props.margin || '0'};
  text-align: ${props => props.align || 'left'};
  letter-spacing: ${props => props.spacing || '0'};∫
`

const BalanceLabel = styled.b`
  color: #161d6b;
  text-align: ${props => props.align || 'left'};
  margin: ${props => props.margin || '0'};
`

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #E8E8E8;
  flex: 1;
  height: calc(550px - ${props => props.hasToggle ? '260px' : '210px'});
  padding: 2em 1.5em 1em 1.5em;
`

const SummaryRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: ${props => props.flex || '1'};
  align-items: center;
  justify-content: ${props => props.justify || 'space-between'};
`

const SummaryColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${props => props.flex || '1'};
  align-items: ${props => props.align || 'flex-start'};
`

const ActionConfirmButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-radius: 5px;
  background-color: ${props => {
    if (props.disabled) return '#BEBEBE';
    if (props.asset.type === types.STKGRO) return '#ffe391';
    if (props.modal_type === 'mint') return '#00d395';
    if (props.modal_type === 'redeem') return '#161d6b';
  }};
  padding: 1em 1em 1em 1em;
  margin: 1em 0 0 0;
  width: 300px;
  color: ${props => !props.disabled && props.asset.type === types.STKGRO ? '#21262b' : 'white'};
  border-width: 3px;
  border-style: solid;
  border-color: ${props => {
    if (props.disabled) return '#BEBEBE';
    if (props.asset.type === types.STKGRO) return '#ffe391';
    if (props.modal_type === 'mint') return '#00d395';
    if (props.modal_type === 'redeem') return '#161d6b';
  }};
  
  &:hover {
    opacity: 0.85;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  }
`

export default class Summary extends Component {

    // Calculate correct fee
    calculateFee = () => {
        const { 
            total_supply, total_reserve, total_reserve_underlying,
            asset, is_native, modal_type, deposit_fee, withdrawal_fee, value_native, value_base, value_redeem
        } = this.props;

        if (!deposit_fee || !withdrawal_fee) return 0;

        const rate = total_supply > 0 ? (total_reserve / asset.base_decimals) / (total_supply / asset.base_decimals) : 1;

        // Validate when input a mint function
        if (modal_type === 'mint') {
            // Validate against native balance
            if (is_native) {
                if (!value_native || Number(value_native) <= 0) return true;
                return Number(value_native * asset.underlying_decimals) * (deposit_fee / asset.underlying_decimals) * rate;
            } else {
                if (!value_base || Number(value_base) <= 0) return true;
                // get the current rate
                return Number(value_base * asset.base_decimals) * (deposit_fee / asset.base_decimals) * rate;
            }
        }

        if (modal_type === 'redeem') {
            return Number(value_redeem * asset.base_decimals) * (withdrawal_fee / asset.base_decimals);
        }
    }

    parseNumber = (number, decimals, factor) => {
        let validate_factor = factor || 100;
        const float_number = number / decimals;
 
        if (float_number >= 1000) {
            return (Math.round(float_number * validate_factor) / validate_factor).toLocaleString('en-En');
        } else {
            return Math.round(float_number * validate_factor) / validate_factor;
        }
        
    }

    // Check for allowance 
    hasEnoughAllowance = () => {
        const {asset, value_native, value_base, underlying_allowance, asset_allowance, is_native} = this.props;

        // Only apppliable on Mint
        if (is_native) {
            if (!value_native || !underlying_allowance) return true;
            return Number(value_native * asset.underlying_decimals) <= Number(underlying_allowance);
        } else {
            if (!value_base || !asset_allowance) return true;
            return Number(value_base * asset.base_decimals) <= Number(asset_allowance);
        }
    }

    // Check if a button should be disabled
    isDisabled = () => {
        const {
            asset, 
            isMintMax, isMintUnderlyingMax, isRedeemMax,
            modal_type, is_native,
            value_base, value_native, value_redeem,
            underlying_balance, asset_balance, g_balance,
        } = this.props;

        if (isMintMax || isMintUnderlyingMax || isRedeemMax) return false;

        // Validate when input a mint function
        if (modal_type === 'mint') {
        // Validate against native balance
        if (is_native) {
            if (!value_native || Number(value_native) <= 0) return true;
            return  numberToBN(value_native, asset.underlying_decimals) > Number(underlying_balance);
        } else {
            if (!value_base || Number(value_base) <= 0) return true;
            return numberToBN(value_base, asset.base_decimals) > Number(asset_balance);
        }
        }

        if (modal_type === 'redeem') {
            if (!value_redeem) return true;
            return numberToBN(value_redeem, asset.base_decimals) > Number(g_balance);
        }

        return true;
    }

    handleDeposit = async () => {
        const {
          asset, web3, address,
          mintGTokenFromCToken,
          mintGTokenFromUnderlying,
          mintGTokenFromBridge,
          mintGTokenFromUnderlyingBridge,
          is_native, value_base, value_native, total_native, total_base,
          underlying_balance, asset_balance, g_balance,
          isMintMax, isMintUnderlyingMax,
          // Functions
          getWei, toggleModal
        } = this.props;

        // Avoid clicks when the user is not allowed to make an action
        if (this.isDisabled()) return;
        
        // Handle depending the asset
        if (is_native) {

            let GContractInstance;

            if (asset.type === types.TYPE_ETH) {
                const _cost =  numberToBN(value_native, asset.underlying_decimals);
                GContractInstance = await new web3.eth.Contract(asset.bridge_abi, asset.bridge_address);
                mintGTokenFromUnderlyingBridge({
                    GContractInstance, 
                    _cost, 
                    growthToken: asset.gtoken_address,
                    address,
                    web3,
                    asset: {
                    from: asset.native,
                    to: asset.g_asset,
                    sending: _cost,
                    receiving: total_native,
                    fromDecimals: asset.underlying_decimals,
                    toDecimals: asset.base_decimals,
                    fromImage: asset.native_img_url,
                    toImage: asset.gtoken_img_url,
                    },
                    toggle: toggleModal
                })
            } else {
                const _cost = isMintUnderlyingMax ? underlying_balance : numberToBN(value_native, asset.underlying_decimals);
                GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
                mintGTokenFromUnderlying({
                    GContractInstance, 
                    _cost, 
                    address,
                    web3,
                    asset: {
                    from: asset.native,
                    to: asset.g_asset,
                    sending: _cost,
                    receiving: total_native,
                    fromDecimals: asset.underlying_decimals,
                    toDecimals: asset.base_decimals,
                    fromImage: asset.native_img_url,
                    toImage: asset.gtoken_img_url,
                    },
                    toggle: toggleModal
                })
            }          
    
        } else {
            let GContractInstance;
            if (asset.type === types.GETH) {
                const _cost = numberToBN(value_base, asset.base_decimals);
                GContractInstance = await new web3.eth.Contract(asset.bridge_abi, asset.bridge_address);
                mintGTokenFromBridge({
                    GContractInstance, 
                    _cost,
                    growthToken: asset.gtoken_address,
                    address,
                    web3,
                    asset: {
                        from: asset.base_asset ,
                        to: asset.g_asset,
                        sending: _cost,
                        receiving: total_base,
                        fromDecimals: asset.base_decimals,
                        toDecimals: asset.base_decimals,
                        fromImage: asset.img_url,
                        toImage: asset.gtoken_img_url,
                    },
                    toggle: toggleModal
                }) 
            } else {
                const _cost = isMintMax ? asset_balance : numberToBN(value_base, asset.base_decimals);
                GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
                mintGTokenFromCToken({
                    GContractInstance, 
                    _cost, 
                    address,
                    web3,
                    asset: {
                    from: asset.base_asset ,
                    to: asset.g_asset,
                    sending: _cost,
                    receiving: total_base,
                    fromDecimals: asset.base_decimals,
                    toDecimals: asset.base_decimals,
                    fromImage: asset.img_url,
                    toImage: asset.gtoken_img_url,
                    },
                    toggle: toggleModal
                }) 
            }

            
        }
    }
    
    
    handleRedeem = async () => {
    const {
        asset, web3, address, getWei,
        g_balance,
        isRedeemMax,
        redeemGTokenToCToken,
        redeemGTokenToUnderlying,
        redeemGTokenToBridge,
        redeemGTokenToUnderlyingBridge,
        is_native, value_redeem, total_native_cost_redeem, total_base_cost_redeem, total_native_redeem, total_base_redeem,
        toggleModal,
    } = this.props;

    
    // Validate Balance
    if (this.isDisabled()) return;

    const _grossShares = isRedeemMax ? g_balance : numberToBN(value_redeem, asset.base_decimals);

    // Handle depending the asset
    if (is_native) {
        let GContractInstance;
        if (asset.type === types.TYPE_ETH) {
            GContractInstance = await new web3.eth.Contract(asset.bridge_abi, asset.bridge_address);
            redeemGTokenToUnderlyingBridge({
                GContractInstance, 
                _grossShares,
                growthToken: asset.gtoken_address,
                address,
                web3,
                asset: {
                    from: asset.g_asset,
                    to: asset.native,
                    sending: total_native_cost_redeem,
                    receiving: total_native_redeem,
                    fromDecimals: asset.base_decimals,
                    toDecimals: asset.underlying_decimals,
                    fromImage: asset.gtoken_img_url,
                    toImage: asset.native_img_url,
                },
                toggle: toggleModal
            })

        } else {
            GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
            redeemGTokenToUnderlying({
                GContractInstance, 
                _grossShares,
                address,
                web3,
                asset: {
                    from: asset.g_asset,
                    to: asset.native,
                    sending: total_native_cost_redeem,
                    receiving: total_native_redeem,
                    fromDecimals: asset.base_decimals,
                    toDecimals: asset.underlying_decimals,
                    fromImage: asset.gtoken_img_url,
                    toImage: asset.native_img_url,
                },
                toggle: toggleModal
            })
        }
        


    } else {

        let GContractInstance;

        if (asset.type === types.GETH) {
            GContractInstance = await new web3.eth.Contract(asset.bridge_abi, asset.bridge_address);
            redeemGTokenToBridge({
                GContractInstance, 
                _grossShares,
                growthToken: asset.gtoken_address,
                address,
                web3,
                asset: {
                    from: asset.g_asset,
                    to: asset.base_asset,
                    sending: total_native_cost_redeem,
                    receiving: total_base_redeem,
                    fromDecimals: asset.base_decimals,
                    toDecimals: asset.base_decimals,
                    fromImage: asset.gtoken_img_url,
                    toImage: asset.img_url,
                },
                toggle: toggleModal
            })
        } else {
            GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
            redeemGTokenToCToken({
                GContractInstance, 
                _grossShares,
                address,
                web3,
                asset: {
                    from: asset.g_asset,
                    to: asset.base_asset,
                    sending: total_native_cost_redeem,
                    receiving: total_base_redeem,
                    fromDecimals: asset.base_decimals,
                    toDecimals: asset.base_decimals,
                    fromImage: asset.gtoken_img_url,
                    toImage: asset.img_url,
                },
                toggle: toggleModal
            })
        }   
    }
    }


    // Helper method to parse big numbers
    abbreviateNumber = (value) => {
        var newValue = value;
        if (value >= 1000) {
            var suffixes = ["", "K", "M", "B","T"];
            var suffixNum = Math.floor( (""+value).length/3 );
            var shortValue = '';
            for (var precision = 2; precision >=  1; precision--) {
                shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
                var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
                if (dotLessShortValue.length <= 2) { break; }
            }
            if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
            newValue = shortValue+suffixes[suffixNum];
        }
        return newValue;
    }

    // Get current asset price
    getPrice = (is_native, revert) => {
        const { asset, total_supply, total_reserve, total_reserve_underlying} = this.props; 
        if (!asset || !total_supply || !total_reserve ) return '-';

        if (total_supply <= 0) return '-';
    
        if (is_native) {
            if (revert) {
                let price = Math.round((total_supply / asset.base_decimals) / (total_reserve_underlying / asset.underlying_decimals) * 1000) / 1000;
                return `${price} ${asset.g_asset} = 1 ${asset.native}`
            } else {
                let price = Math.round((total_supply / asset.base_decimals)  / (total_reserve_underlying / asset.underlying_decimals) * 1000) / 1000;
                return `${price} ${asset.g_asset} = 1 ${asset.native}`
            }
        } else {
            if (revert) {
                let price = Math.round(total_reserve / total_supply * 1000) / 1000;
                return `${price} ${asset.base_asset} = 1 ${asset.g_asset}`
            } else {
            let price = Math.round(total_supply / total_reserve * 1000) / 1000;
                return `${price} ${asset.g_asset} = 1 ${asset.base_asset}`
            }
        }
    }

    hasEnoughBridgeAllowance = () => {
        const {asset, bridge_allowance, is_native} = this.props;

        // If it should use any bridge
        if ([types.GETH, types.TYPE_ETH].indexOf(asset.type) < 0) return true;

        // If is an ETH strategy
        if (asset.type === types.TYPE_ETH && !is_native) return true;

        return bridge_allowance > 0;
    }

    render() {
        const {
            asset, is_native,
            total_reserve, total_supply, deposit_fee, withdrawal_fee,
            total_native, total_base, total_native_redeem, total_base_redeem, modal_type, toggleNativeAvailable
        } = this.props;
        return (
            <SummaryContainer
                hasToggle={asset && toggleNativeAvailable.indexOf(asset.type) > -1}
                onClick={e => e.stopPropagation()}
            >
                <SummaryRow>
                <SummaryColumn>
                    <PrimaryLabel>PRICE</PrimaryLabel>
                </SummaryColumn>
                <SummaryColumn flex="2" align="flex-end">
                    <PrimaryLabel spacing="1px">{this.getPrice(is_native, true)}</PrimaryLabel>
                </SummaryColumn>
                </SummaryRow>
                <SummaryRow>
                <SummaryColumn>
                    <PrimaryLabel>{asset.base_asset} RESERVE</PrimaryLabel>
                </SummaryColumn>
                <SummaryColumn align="flex-end">
                    <PrimaryLabel spacing="1px">{total_reserve ?  this.parseNumber(total_reserve, asset.base_decimals, asset.ui_decimals) : '-'} {asset.base_asset}</PrimaryLabel>
                </SummaryColumn>
                </SummaryRow>
                <SummaryRow>
                <SummaryColumn>
                    <PrimaryLabel>{asset.g_asset} SUPPLY</PrimaryLabel>
                </SummaryColumn>
                <SummaryColumn align="flex-end">
                    <PrimaryLabel spacing="1px">{total_supply ? this.parseNumber(total_supply, asset.base_decimals, asset.ui_decimals) : '-'} {asset.g_asset}</PrimaryLabel>
                </SummaryColumn>
                </SummaryRow>
                <SummaryRow>
                <SummaryColumn>
                    <SummaryRow>
                    <PrimaryLabel margin="0 5px 0 0">FEE</PrimaryLabel>
                    <Icon 
                        icon={info} 
                        style={{color: '#BEBEBE' }} 
                        data-tip={asset.type === types.STKGRO ? 
                            `
                            - 5% distributed between holders
                            <br />
                            - 5% burned forever
                            ` : 
                            `
                            - 0.5% distributed between holders
                            <br />
                            - 0.5% sent to the Liquidity Pool
                        `} 
                    />
                    </SummaryRow>
                </SummaryColumn>
                <SummaryColumn align="flex-end" flex="2">
                    {modal_type === 'mint' && <PrimaryLabel spacing="1px">{this.parseNumber(this.calculateFee(), 1e18, 1e8)} {is_native ? asset.native : asset.base_asset}  ({this.parseNumber(deposit_fee, 1e16, 1).toFixed(2)}%)</PrimaryLabel>}
                    {modal_type === 'redeem' && <PrimaryLabel spacing="1px">{this.parseNumber(this.calculateFee(), 1e18, 1e8)} {asset.g_asset}  ({this.parseNumber(withdrawal_fee, 1e16, 1)}%)</PrimaryLabel>}   
                </SummaryColumn>
                </SummaryRow>
                <SummaryRow>
                <SummaryColumn>
                    <SummaryRow>
                    <BalanceLabel margin="0 5px 0 0">TOTAL</BalanceLabel>
                    <Icon 
                        icon={info} 
                        style={{color: '#BEBEBE' }} 
                        data-tip={`
                            Total received after fees.
                        `} 
                    />
                    </SummaryRow>
                </SummaryColumn>
                <SummaryColumn align="flex-end" flex="2">
                    {modal_type === 'mint'&& is_native && <PrimaryLabel spacing="1px">{total_native ? this.parseNumber(total_native, asset.base_decimals, 1e8) : '-'} {asset.g_asset}</PrimaryLabel>}
                    {modal_type === 'mint'&& !is_native && <PrimaryLabel spacing="1px">{total_base ? this.parseNumber(total_base, asset.base_decimals, 1e8) : '-'} {asset.g_asset}</PrimaryLabel>}
                    {modal_type === 'redeem'&& is_native && <PrimaryLabel spacing="1px">{total_native_redeem ? this.parseNumber(total_native_redeem, asset.underlying_decimals, 1e8) : '-'} {asset.native}</PrimaryLabel>}
                    {modal_type === 'redeem'&& !is_native && <PrimaryLabel spacing="1px">{total_base_redeem ? this.parseNumber(total_base_redeem, asset.base_decimals, 1e8) : '-'} {asset.base_asset}</PrimaryLabel>} 
                </SummaryColumn>
                </SummaryRow>
                <SummaryRow justify="center" flex="2">
                    {modal_type === 'mint' &&  (
                        <React.Fragment>
                            {this.hasEnoughAllowance() ? (
                            <ActionConfirmButton
                                asset={asset}
                                modal_type={modal_type}
                                onClick={() => this.handleDeposit()}
                                disabled={this.isDisabled()}
                            >
                                {this.isDisabled() ? 'NOT ENOUGH BALANCE' : 'CONFIRM MINT'}
                            </ActionConfirmButton>
                            ) : (
                                <ApproveContainer 
                                    {...this.props}
                                    {...this.state}
                                />
                            )}
                        </React.Fragment>
                    )}
                    {modal_type === 'redeem' &&  (
                        <React.Fragment>
                            {this.hasEnoughBridgeAllowance() ? (
                                <ActionConfirmButton 
                                    asset={asset}
                                    modal_type={modal_type}
                                    onClick={() => this.handleRedeem()}
                                    disabled={this.isDisabled()}
                                >
                                    {this.isDisabled() ? 'NOT ENOUGH BALANCE' : 'CONFIRM REDEEM'}
                                </ActionConfirmButton>
                            ) : (
                                <ApproveContainer 
                                    {...this.props}
                                    {...this.state}
                                    bridgeApproval={true}
                                />
                            )}
                            
                        </React.Fragment>
                    )}
                </SummaryRow>
                <ReactTooltip multiline={true} place="right"/>
            </SummaryContainer>
        )
    }
}
