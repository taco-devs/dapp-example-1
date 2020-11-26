import React, { Component } from 'react';
import styled from 'styled-components';
import debounce from 'lodash.debounce';
import BPool from 'contracts/Interop/Bpool.json';

const BalanceLabel = styled.b`
  color: #161d6b;
  text-align: ${props => props.align || 'left'};
  margin: ${props => props.margin || '0'};
`

const InputSection = styled.div`
  display: flex; 
  flex-direction: column;
  border-color: #DCDCDC;
  border-width: 3px;
  border-style: solid;
  width: 100%;
  border-radius: 5px;
`

const InputSectionColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${props => props.flex || '1'};
  padding: 0.5em 0.75em 0.25em 0.5em;
  justify-content: space-around;
  align-items: ${props => props.align || 'flex-start'};
`

const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  font-size: ${props => props.font || '1em'};
`

const AmountInput = styled.div`
  display: flex;
  flex: 3;
`

const StyledInput = styled.input`
  width: 100%;
  border: 0;
  outline: none;
  font-size: 1.2em;
  letter-spacing: 2px;
`

const MaxButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 5px 10px 5px 10px;
  color: white;
  border-radius: 5px;
  flex: 1;
  transition: background-color .4s ease;
  background-color: ${props => {
    if (props.modal_type === 'mint') return '#00d395';
    if (props.modal_type === 'redeem') return '#161d6b';
  }};

  &:hover {
    opacity: 0.85;
    cursor: pointer;
  }
`

const IconLogo = styled.img`
  height: 30px;
  width: 30px;
`

const AssetLabel = styled.b`
  color: #161d6b;
  font-size: 0.85em;
`

const SelectorRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-around;
  border-radius: 5px;
  padding: 5px 0 5px 0;
  width: 100%
`

export default class SwapInputIn extends Component {

    componentDidMount = () => {
      this.getBalance();
    }
    
    getBalance = async () => {
      const {assetIn, web3, address, Network, handleMultipleChange} = this.props;
      if (assetIn === 'GRO') {
        const asset = Network.growth_token;
        const GContractInstance = await new web3.eth.Contract(asset.abi, asset.address);
        const result = await GContractInstance.methods.balanceOf(address).call();
        handleMultipleChange({
          balanceIn: result / 1e18,
        })
      } else {
        const asset = Network.available_assets[assetIn];
        const GContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
        const result = await GContractInstance.methods.balanceOf(address).call();
        handleMultipleChange({
          balanceIn: result / 1e8,
        })
      }
    }

    // Get Input asset
    getInputAsset = () => {
      const {assetIn, Network} = this.props;
      if (assetIn) {
        if (assetIn === 'GRO') {
          const asset = Network.growth_token;
          return {
            name: assetIn,
            img: asset.img_url
          }
        } else {
          const asset = Network.available_assets[assetIn];
          return {
            name: asset.g_asset,
            img: asset.gtoken_img_url,
          }
        }
      }
    }

    parseBalance = (amount) => {
      if (!amount) return '-';
      return amount;
    }

    getTokens = (assetIn, amountInput, tokens) => {
      const {getWei} = this.props;

      let tokenIn;
      let tokenOut;
      let _amountInput;

      // Validate if GRO 
      if (assetIn === 'GRO') {
        // Asset in position 0 is GRO
        tokenIn = tokens[0];
        tokenOut = tokens[1]; 
        _amountInput = getWei(amountInput, 1e18);
      } else {
        tokenIn = tokens[1];
        tokenOut = tokens[0]; 
        _amountInput = getWei(amountInput, 1e8)
      }

      return {tokenIn, tokenOut, _amountInput};
    }

    getConversion = (assetIn, amountOutput) => {
      
      if (assetIn === 'GRO') {
        return amountOutput / 1e8;
      } else {
        return amountOutput / 1e18;
      }
    }

    handleInputChange = debounce(async (amountInput) => {
      const {handleMultipleChange, liquidity_pool_address, web3, assetIn } = this.props;

      // Init LP Contract
      const BPoolInstance = await new web3.eth.Contract(BPool, liquidity_pool_address);  

      // Get current rates
      const tokens = await BPoolInstance.methods.getCurrentTokens().call();

      let {tokenIn, tokenOut, _amountInput} = this.getTokens(assetIn, amountInput, tokens);

      // Get Data
      let swapFee = await BPoolInstance.methods.getSwapFee().call();
      let tokenBalanceIn = await BPoolInstance.methods.getBalance(tokenIn).call();
      let tokenBalanceOut = await BPoolInstance.methods.getBalance(tokenOut).call();
      let tokenWeightIn = await BPoolInstance.methods.getNormalizedWeight(tokenIn).call();
      let tokenWeightOut = await BPoolInstance.methods.getNormalizedWeight(tokenOut).call();

      // CalcOutGivenIn
      const _amountOutput = await BPoolInstance.methods.calcOutGivenIn(
        tokenBalanceIn, //tokenBalanceIn
        tokenWeightIn, // tokenWeightIn
        tokenBalanceOut, // tokenBalanceOut
        tokenWeightOut, // tokenWeightOut
        _amountInput,// tokenAmountIn
        swapFee//
      ).call();
      
      let amountOutput = this.getConversion(assetIn, _amountOutput);  

      handleMultipleChange({
        amountOutput,
        swapType: 'SEND'
      });
    }, 300);

    setMax = () => {
      const {balanceIn, handleMultipleChange} = this.props;
      const amountInput = balanceIn;

      handleMultipleChange({amountInput});
      this.handleInputChange(amountInput);
    }

    render() {
        const {
            isLoading,
            amountInput,
            balanceIn,
            handleMultipleChange
        } = this.props;
        const asset = this.getInputAsset();
        return (
          <InputSection>
            <InputRow>
              <InputSectionColumn flex="2.5" align="flex-start">
                <BalanceLabel>BALANCE: {this.parseBalance(balanceIn)}</BalanceLabel>
              </InputSectionColumn>
              <InputSectionColumn align="flex-end">
                <BalanceLabel>FROM</BalanceLabel>
              </InputSectionColumn>
            </InputRow>
            <InputRow>
              <InputSectionColumn 
                flex="2.25"
              >
                <InputRow>
                  <AmountInput>
                      <StyledInput
                          value={amountInput}
                          placeholder="0.0"
                          disabled={isLoading}
                          type="number"
                          onClick={e => e.stopPropagation()}
                          onChange={e => {
                              handleMultipleChange({amountInput: e.target.value});
                              if (e.target.value.length <= 0) {
                                handleMultipleChange({amountOutput: ''})
                              } else {
                                this.handleInputChange(e.target.value)
                              };
                              
                          }}
                      />
                  </AmountInput>
                  <MaxButton
                      modal_type="mint"
                      onClick={e => {
                        e.stopPropagation();
                        this.setMax();
                      }}
                  > 
                      MAX
                  </MaxButton>
                </InputRow>
              </InputSectionColumn>
              <InputSectionColumn>
                {asset && (
                  <SelectorRow>
                      <IconLogo src={require(`images/tokens/${asset.img}`)}/>
                      <AssetLabel>{asset.name}</AssetLabel> 
                  </SelectorRow>
                )}
                
              </InputSectionColumn>
            </InputRow>
          </InputSection>
            
        )
    }
}
