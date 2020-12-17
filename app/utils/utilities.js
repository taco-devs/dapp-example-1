import supportedChains from './chains';
import { BigNumber } from "bignumber.js";

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

function numberToString(num)
{
  let numStr = String(num);

  if (Math.abs(num) < 1.0)
  {
      let e = parseInt(num.toString().split('e-')[1]);
      if (e)
      {
          let negative = num < 0;
          if (negative) num *= -1
          num *= Math.pow(10, e - 1);
          numStr = '0.' + (new Array(e)).join('0') + num.toString().substring(2);
          if (negative) numStr = "-" + numStr;
      }
  }
  else
  {
      let e = parseInt(num.toString().split('+')[1]);
      if (e > 20)
      {
          e -= 20;
          num /= Math.pow(10, e);
          numStr = num.toString() + (new Array(e + 1)).join('0');
      }
  }

  return numStr;
}

function valid(amount, decimals) {
  const regex = new RegExp(`^\\d+${decimals > 0 ? `(\\.\\d{1,${decimals}})?` : ''}$`);
  return regex.test(amount);
}

function coins(units, decimals) {
  if (!valid(units, 0)) throw new Error('Invalid amount');
  if (decimals == 0) return units;
  const s = units.padStart(1 + decimals, '0');
  return s.slice(0, -decimals) + '.' + s.slice(-decimals);
}

function units(coins, decimals) {
  if (!valid(coins, decimals)) throw new Error('Invalid amount');
  let i = coins.indexOf('.');
  if (i < 0) i = coins.length;
  const s = coins.slice(i + 1);
  return coins.slice(0, i) + s + '0'.repeat(decimals - s.length);
}


export function numberToBN(value_number, decimals) {
  let parsedNumber = value_number.toString();
  if (decimals === 1e18) {
    return units(parsedNumber, 18)
  }
  if (decimals === 1e8) {
    return units(parsedNumber, 8)
  }
  if (decimals === 1e6) {
    return units(parsedNumber, 6)
  }
}

export function BNtoNumber(value_number, decimals) {
  let parsedNumber = value_number.toString();
  if (decimals === 1e18) {
    return coins(parsedNumber, 18)
  }
  if (decimals === 1e8) {
    return coins(parsedNumber, 8)
  }
  if (decimals === 1e6) {
    return coins(parsedNumber, 6)
  }
}
