import NetworkData from 'contracts';
import types from 'contracts/token_types.json';

// GET THE PRICE FOR ETH
const getEthPrice = (relevantPrices) => {
    const ethPrice = relevantPrices.pairs && relevantPrices.pairs.find(pair => pair.token0.symbol === 'WETH');
    return ethPrice.token1Price;
}

// GET THE PRICE for COMP
const getMiningTokenPrice = (relevantPrices) => {
    const ethPrice = relevantPrices.pairs && relevantPrices.pairs.find(pair => pair.token0.symbol === 'WETH');
    const miningToken = relevantPrices.pairs && relevantPrices.pairs.find(pair => pair.token0.symbol === 'COMP');

    if (ethPrice && miningToken) {
        return ethPrice.token1Price * miningToken.token1Price;
    } else {
        return 0;
    }
}

// Calculate the APY for Type 1 tokens
// Type 1 considering COMP farming.
const apy_type1 = (token, asset,relevantPrices, dayDelta ) => {
    
    // console.log({token, asset,relevantPrices, dayDelta})
    // GET COMP Price
    const miningTokenPrice = getMiningTokenPrice(relevantPrices);
    const miningFactor = ((token.miningTokenBalance / 1e18) * miningTokenPrice) / (token.totalSupply / 1e8) / token.lastUSDPrice;
    const lastAvgPrice = new Number(token.lastAvgPrice) + new Number(miningFactor);

    const mathFactor = Math.pow(lastAvgPrice, 1 / (dayDelta));
    const apy = (mathFactor - 1) * 365 * 100;
    
    return apy;
}


export const getAVGApy = (token, asset, relevantPrices, dayDelta) => {
    if (asset.type === types.TYPE1) return apy_type1(token, asset, relevantPrices, dayDelta);

    // If not any of the above use standard APY calculation
    const mathFactor = Math.pow(token.lastAvgPrice, 1 / (dayDelta));
    const apy = (mathFactor - 1) * 365 * 100;
    return apy;
}