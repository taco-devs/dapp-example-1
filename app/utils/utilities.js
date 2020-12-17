import supportedChains from './chains';

export function getChainData(chainId) {
    const chainData = supportedChains.filter(chain => chain.chain_id === chainId)[0];
  
    if (!chainData) {
      throw new Error("ChainId missing or not supported");
    }
  
    const API_KEY = '9619f128da304b1c99b821758dc58bb5' // process.env.REACT_APP_INFURA_ID;
  
    if (
      chainData.rpc_url.includes("infura.io") &&
      chainData.rpc_url.includes("%API_KEY%") &&
      API_KEY
    ) {
      const rpcUrl = chainData.rpc_url.replace("%API_KEY%", API_KEY);
  
      return {
        ...chainData,
        rpc_url: rpcUrl
      };
    }
  
    return chainData;
  }


function RoundNum(num, length) { 
  var number = Math.round(num * Math.pow(10, length)) / Math.pow(10, length);
  return number;
}

export function numberToBN(value_number, decimals) {
  return (value_number * decimals).toString();
}

export function BNtoNumber(value_number, decimals) {
  if (decimals === 1e18) {
    return RoundNum(value_number / decimals, 18)
  }
  if (decimals === 1e8) {
    return RoundNum(value_number / decimals, 8)
  }
  if (decimals === 1e6) {
    return RoundNum(value_number / decimals, 6)
  }
}
