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

// Calculate the performance of gDAI performance fees only
const apy_gDAI_fees = (tokens) => {
    // Only gDAI
    const gDAI = tokens.find(token => token.symbol === 'gDAI');

    const prices = gDAI.tokenDailyDatas.map(tdd => tdd.avgPrice);
    const min = Math.min(...prices);
    const priceDelta = 1 + ( gDAI.lastAvgPrice - min );

    const mathFactor = Math.pow(priceDelta, 1 / 21);
    const apy = (mathFactor - 1) * 365 * 100;
    return apy;
}

// Specific method to handle gDAI reusable for type 2 
export const apy_gDAI = (tokens, relevantPrices) => {

    const token = tokens.find(token => token.symbol === 'gDAI');
    const asset = NetworkData['eth'].available_assets['gDAI'];
    
    // Calculate the delta from listing date to today
    const SECONDS_IN_DAY = 86400;
    let TODAY = new Date();
    TODAY = new Date(TODAY.getTime() + TODAY.getTimezoneOffset() * 60000);
    TODAY.setHours(0,0,0,0);
    const TODAY_DATE = Math.round(TODAY.getTime() / 1000);
    
    let FIRST_DAY = new Date(token.listingDate * 1000);
    FIRST_DAY.setHours(0,0,0,0);
    const FIRST_DATE = Math.round(FIRST_DAY.getTime() / 1000);

    const dayDelta = (TODAY_DATE - FIRST_DATE) / SECONDS_IN_DAY;

    let apy =
        asset.portfolio.reduce((acc, portfolio) => {
            const portfolio_asset = NetworkData['eth'].available_assets[portfolio.asset];

            // Handle gDAI apy strategy
            if (portfolio_asset.g_asset === 'gDAI') {
                return acc + (apy_gDAI_fees(tokens) * (portfolio.percentage / 100));
            }

            // Handle gcDAIv2 
            if (portfolio_asset.type === types.TYPE1) {
                const portfolio_token = tokens.find(token => token.name === portfolio_asset.contract_name);
                return acc + (apy_type1(portfolio_token, asset, relevantPrices, dayDelta) * (portfolio.percentage / 100));
            }
        }, 0)

    return apy;
}

// Calculate the APY for Type 1 tokens
// Type 1 considering COMP farming.
const apy_type1 = (token, asset,relevantPrices, dayDelta ) => {
    
    try {
        // GET COMP Price
        const miningTokenPrice = getMiningTokenPrice(relevantPrices);
        const miningFactor = ((token.miningTokenBalance / 1e18) * miningTokenPrice) / (token.totalSupply / 1e8) / token.lastUSDPrice;
        const lastAvgPrice = new Number(token.lastAvgPrice) + new Number(miningFactor);

        const mathFactor = Math.pow(lastAvgPrice, 1 / (dayDelta));
        const apy = (mathFactor - 1) * 365 * 100;
        
        return apy;
    } catch (e) {
        console.log(e);
        return 1;
    }
}

// TYPE2 
// Lends ETH/WBTC borrow DAI and mint gDAI 
const apy_type2 = (tokens, token, asset, relevantPrices, dayDelta) => {
    
    //Get gDAI token
    const gDAI = tokens.find(token => token.symbol === 'gDAI');
    const gDAIValue = gDAI.lastUSDPrice * (token.gDAIReserve / 1e18);

    // Calculate native APY with mining factor
    const miningTokenPrice = getMiningTokenPrice(relevantPrices);
    const miningFactor = ((token.miningTokenBalance / 1e18) * miningTokenPrice) / (token.totalSupply / 1e8) / token.lastUSDPrice;
    const lastAvgPrice = new Number(token.lastAvgPrice) + new Number(miningFactor);
    const mathFactor = Math.pow(lastAvgPrice, 1 / (dayDelta));
    const strategy_apy = (mathFactor - 1) * 365 * 100;

    // Get the market size
    const strategyValue = (token.totalSupply / 1e8) * token.lastUSDPrice;

    // Standarize apys 
    const strategyTVL = strategyValue + gDAIValue;
    const gcFactor = strategyValue / strategyTVL;
    const gDAIFactor = gDAIValue / strategyTVL;

    // Calculate the correct apy 
    const gDAIApyFactor = apy_gDAI(tokens, relevantPrices) * gDAIFactor;
    const gcTokenApyFactor = strategy_apy * gcFactor;

    const apy = gDAIApyFactor + gcTokenApyFactor;

    return apy;
}

// Lends ETH borrow DAI and mint gDAI 
const apy_typeEth = (tokens, token, asset, relevantPrices, dayDelta) => {

    //Get gDAI token
    const gDAI = tokens.find(token => token.symbol === 'gDAI');
    const gDAIValue = gDAI.lastUSDPrice * (token.gDAIReserve / 1e18);

    // Calculate native APY with mining factor
    const miningTokenPrice = getMiningTokenPrice(relevantPrices);
    const miningFactor = ((token.miningTokenBalance / 1e18) * miningTokenPrice) / (token.totalSupply / 1e8) / token.lastUSDPrice;
    const lastAvgPrice = new Number(token.lastAvgPrice) + new Number(miningFactor);
    const mathFactor = Math.pow(lastAvgPrice, 1 / (dayDelta));
    const strategy_apy = (mathFactor - 1) * 365 * 100;

    // Get the market size
    const strategyValue = (token.totalSupply / 1e8) * token.lastUSDPrice;

    // Standarize apys 
    const strategyTVL = strategyValue + gDAIValue;
    const gcFactor = strategyValue / strategyTVL;
    const gDAIFactor = gDAIValue / strategyTVL;

    // Calculate the correct apy 
    const gDAIApyFactor = apy_gDAI(tokens, relevantPrices) * gDAIFactor;
    const gcTokenApyFactor = strategy_apy * gcFactor;

    const apy = gDAIApyFactor + gcTokenApyFactor;

    return apy;
}

// CALC Apy for PMTs
const apy_PMT = (tokens, token, asset, relevantPrices, dayDelta) => {

    let apy =
        asset.portfolio.reduce((acc, portfolio) => {
            const portfolio_asset = NetworkData['eth'].available_assets[portfolio.asset];

            // Handle PMT profits
            if (portfolio_asset.type === types.PMT) {
                const prices = token.tokenDailyDatas.map(tdd => tdd.avgPrice);
                const min = Math.min(...prices);
                const priceDelta = 1 + ( token.lastAvgPrice - min );
            
                const mathFactor = Math.pow(priceDelta, 1 / 21);
                const apy = (mathFactor - 1) * 365 * 100;
                return acc + (apy * (portfolio.percentage / 100));
            }

            // Handle gcDAIv2 & gcUSDCv2
            if (portfolio_asset.type === types.TYPE1) {
                const portfolio_token = tokens.find(token => token.name === portfolio_asset.contract_name);
                return acc + (apy_type1(portfolio_token, asset, relevantPrices, dayDelta) * (portfolio.percentage / 100));
            }

            // Handle gcETH and gcWBTC
            if (portfolio_asset.type === types.TYPE2) {
                const portfolio_token = tokens.find(token => token.name === portfolio_asset.contract_name);
                return acc + (apy_type1(portfolio_token, asset, relevantPrices, dayDelta) * (portfolio.percentage / 100));
            }

        }, 0)
    
    return apy;
}

// Specific method for gETH 
const apy_gETH = (tokens, token, asset, relevantPrices, dayDelta) => {
    let apy =
        asset.portfolio.reduce((acc, portfolio) => {
            const portfolio_asset = NetworkData['eth'].available_assets[portfolio.asset];

            if (portfolio_asset.type === types.GETH) {
                const prices = token.tokenDailyDatas.map(tdd => tdd.avgPrice);
                const min = Math.min(...prices);
                const priceDelta = 1 + ( token.lastAvgPrice - min );
            
                const mathFactor = Math.pow(priceDelta, 1 / 21);
                const apy = (mathFactor - 1) * 365 * 100;
                return acc + (apy * (portfolio.percentage / 100));
            }

            // Handle gcETH 
            if (portfolio_asset.type === types.TYPE_ETH) {
                const portfolio_token = tokens.find(token => token.name === portfolio_asset.contract_name);
                return acc + (apy_typeEth(tokens, portfolio_token, asset, relevantPrices, dayDelta) * (portfolio.percentage / 100));
            }

        }, 0)
    
    return apy;
}

// Apy router
export const getAVGApy = (token, asset, relevantPrices, tokens, dayDelta) => {
    // Route asset to apy
    if (asset.type === types.TYPE1) return apy_type1(token, asset, relevantPrices, dayDelta);
    if (asset.type === types.TYPE2) return apy_type2(tokens, token, asset, relevantPrices, dayDelta);
    if (asset.type === types.TYPE_ETH) return apy_typeEth(tokens, token, asset, relevantPrices, dayDelta);
    if (asset.type === types.PMT && asset.g_asset === 'gDAI') return apy_gDAI(tokens, relevantPrices );
    if (asset.type === types.PMT && asset.g_asset !== 'gDAI') return apy_PMT(tokens, token, asset, relevantPrices, dayDelta);
    if (asset.type === types.GETH) return apy_gETH(tokens, token, asset, relevantPrices, dayDelta);

    // If not any of the above use standard APY calculation
    const mathFactor = Math.pow(token.lastAvgPrice, 1 / (dayDelta));
    const apy = (mathFactor - 1) * 365 * 100;
    return apy;
}