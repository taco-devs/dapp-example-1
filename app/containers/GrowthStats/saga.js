import {
  call, put, select, takeLatest, fork, all
} from 'redux-saga/effects';

import request from 'utils/request'
import NetworkData from 'contracts';

import { GET_BALANCES_REQUEST, GET_USER_STATS_REQUEST, GET_TVL_REQUEST, GET_PRICES_REQUEST, GET_GRAPH_REQUEST } from './constants'
import { 
  getUserStatsSuccess, getUserStatsError,
  getBalancesSuccess, getBalancesError,
  getEthPrice,
  getTVLSuccess,
  getTVLError,
  getPricesSuccess, getPricesError,
  getGraphSuccess, getGraphError,
} from './actions';

import { makeSelectCurrrentNetwork } from '../App/selectors';

const base_pairs = [
  "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", // ETH/USD
  "0x208bd5dc470eba21571ddb439801a614ed346376", // GRO/ETH 
]

const compound_base_pairs = [
  "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5", // ETH
]

const USER_STATS = (address) => {
  return `
    {
      users (
        where: {
          address: "${address}"
        }
      ){
        id
        address
        transactions
      }
    }
  `
}

const BALANCES = (address) => {
  if (!address) return '';
  return `
    {
      userBalances (
        where: {
          user: "${address.toLowerCase()}"
        }
      ) {
        id
        amount
        token {
          id
          symbol
          totalSupply
          totalReserve
          depositFee
          withdrawalFee
        }
      }
    }
  `
}

const COMPOUND_MARKETS = (markets) => {
  return `
    {
      markets (where: {
          id_in: ${JSON.stringify(markets)}
      }) {
        id
        exchangeRate
        symbol
        underlyingPrice
        underlyingPriceUSD
      }
    }
  `
}

const PAIR_QUERIES = (all_pairs) =>  {
  return `
    {
      pairs (where: {
        id_in: ${JSON.stringify(all_pairs)}
      }) {
        id
        token0Price
        token1Price
        token0 {
          symbol
        }
      }
    }
`
}

const HEALTH = `
  indexingStatusForCurrentVersion(subgraphName: "${process.env.GROWTH_GRAPH_NAME}") {
    synced
    health
    fatalError {
      message
      block {
        number
        hash
      }
      handler
    }
    chains {
      chainHeadBlock {
        number
      }
      latestBlock {
        number
      }
    }
  }
`

const balanceChecker = (ContractInstance, address) => {
  return ContractInstance.methods.balanceOf(address);
}


const fetch_balances = async (available_assets, user_balances, web3, address) => {
  // Iterate through the contracts
  const balances = [];
  for (const balance of user_balances) {
    try {

      const asset = available_assets[balance.token.symbol];

      // Check for abi and address
      if (!asset) continue;

      // Fetch asset balance
      const ContractInstance = await new web3.eth.Contract(asset.gtoken_abi, balance.token.id);
      const exchange_rate = await ContractInstance.methods.exchangeRate().call();
      const web3_balance = await ContractInstance.methods.balanceOf(address).call();

      let liquidation_price = 0;

      if (Number(balance.amount) > 0) {
        liquidation_price = await ContractInstance.methods.calcWithdrawalCostFromShares(web3_balance, balance.token.totalReserve, balance.token.totalSupply, balance.token.withdrawalFee).call();
      }

      balances.push({
        name: balance.token.symbol,
        base: asset.base_asset,
        underlying: asset.native,
        gtoken_address: balance.token.id,
        web3_balance: web3_balance,
        balance: Number(balance.amount),
        withdrawal_fee: balance.token.withdrawalFee,
        exchange_rate,
        total_reserve: balance.token.totalReserve,
        liquidation_price,
      })

    } catch (e) {
      console.log(e)
    }
  }

  return balances;
}

const get_pairs = ( Network ) => {
  const { available_assets } = Network;
  const assets_keys = Object.keys(available_assets);
  const asset_pairs = 
    assets_keys
      .filter((asset_key) => Network.available_assets[asset_key].pair_address)
      .map((asset_key) => Network.available_assets[asset_key].pair_address);
  const QUERY = PAIR_QUERIES([...base_pairs, ...asset_pairs]);
  return QUERY;
}

const get_markets = ( Network ) => {
  const { available_assets } = Network;
  const assets_keys = Object.keys(available_assets);
  const asset_markets = 
    assets_keys
      .filter((asset_key) => Network.available_assets[asset_key].compound_id)
      .map((asset_key) => Network.available_assets[asset_key].compound_id);
  const QUERY = COMPOUND_MARKETS([...compound_base_pairs,...asset_markets ]);
  return QUERY;
}

const get_prices = async (asset_balances, data, web3) => {
  // Iterate through all prices
  try {
    const { markets } = data;
    const with_prices = 
          asset_balances.map((asset) => {
            const market = markets.find(market => market.symbol === asset.base);

            // Get the redeeming rate

            return {
              ...asset,
              base_price_eth: market ? market.exchangeRate : 0,
              base_price_usd: market ? market.exchangeRate * market.underlyingPriceUSD : 0,
            }
          })
    
    return with_prices;
  } catch (e) {
    console.log(e);
  }
  

}

function* getUserStatsSaga(params) {

  const {address, web3} = params;

  try { 

    // Get the correct pairs to fetch price
    const query = USER_STATS(address);

    // Fetch Pairs price
    const options = {
      method: 'POST',
      body: JSON.stringify({ query })
    };

    const response = yield call(request, process.env.GROWTH_GRAPH_URL, options);

    if ( response && response.data) {
      const {users} = response.data;
      const user = users[0];

      if (user) {
        yield put(getUserStatsSuccess(user));
      }
    }
    
  } catch (error) {
    const jsonError = yield error.response ? error.response.json() : error;
    yield put(getUserStatsError(jsonError));
  }
}

function* getTVLSaga() {

  try { 

    // Get the correct pairs to fetch price
    const query = `
    {
      totalValueLocked (id: 1) {
        id
        totalValueLockedETH
        totalValueLockedUSD
      }
      dailyDatas {
        id
        date
        cumulativeTotalValueLockedUSD
        cumulativeTotalValueLockedETH
      }
    }
    `;

    // Fetch Pairs price
    const options = {
      method: 'POST',
      body: JSON.stringify({ query })
    };

    const response = yield call(request, process.env.GROWTH_GRAPH_URL, options);

    if ( response && response.data) {
      const {totalValueLocked, dailyDatas} = response.data;

      yield put(getTVLSuccess(totalValueLocked, dailyDatas));
    }
    
  } catch (error) {
    const jsonError = yield error.response ? error.response.json() : error;
    yield put(getTVLError(jsonError));
  }
}

function* getBalancesSaga(params) {

  const {address, web3} = params;

  if (!address || !web3) {
    return yield put(getBalancesError('No wallet detected'));
  }

  try { 

    // Get network
    const network = yield select(makeSelectCurrrentNetwork());
    const Network = NetworkData[network];

    if (Network) {


        // Get the correct pairs to fetch price
        const PAIRS = get_pairs(Network);
        const markets_query = get_markets(Network);
        const balances_query = BALANCES(address);        

        // Get the balances
        const balances_options = {
          method: 'POST',
          body: JSON.stringify({ query: balances_query })
        };

        const balances_response = yield call(request, process.env.GROWTH_GRAPH_URL, balances_options);
        const {data: balances_data} = balances_response;

        // Fetch Pairs price
        const query_url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
        const options = {
          method: 'POST',
          body: JSON.stringify({ query: PAIRS })
        };

        const response = yield call(request, query_url, options);
        const { data } = response;
      
        // Fetch Markets price
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let raw = JSON.stringify({"query":markets_query});
        const compound_options = {
          method: 'POST',
          body: raw,
          headers: myHeaders,
          redirect: 'follow'
        };

        const c_response = yield call(request, process.env.COMPOUND_GRAPH_URL, compound_options);
        const { data: c_data } = c_response;

        yield put(getPricesSuccess(c_data));
        
        // Set Eth Price in USDT
        const eth_market = c_data.markets.find(market => market.symbol === 'cETH');
        yield put(getEthPrice(eth_market.underlyingPriceUSD));

        // Get GRO data
        const GrowTokenInstance = new web3.eth.Contract(Network.growth_token.abi, Network.growth_token.address);
        const GRO_Method = balanceChecker(GrowTokenInstance, address);
        const gro_balance = yield call([GRO_Method, GRO_Method.call]);

        // Fetch all balances
        if (balances_data) {
        const asset_balances = yield fetch_balances(Network.available_assets, balances_data.userBalances, web3, address);

        // Calculate the asset price
        const balances_with_rate = yield get_prices(asset_balances, c_data, web3, address);

        const balances = [
          {
            name: 'GRO',
            balance: gro_balance,
            price_eth: data.pairs[1].token0Price,
          },
          ...balances_with_rate
        ]

        yield put(getBalancesSuccess(balances))
      }
    }

  } catch (error) {
    // const jsonError = yield error.response ? error.response.json() : error;
    yield put(getBalancesError('Could not fetch balances'));
  }
}


function* getPricesSaga() {

  try { 

    const Network = NetworkData['eth'];
    const markets_query = get_markets(Network);

    // Compound implementation
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"query":markets_query});
    const compound_options = {
      method: 'POST',
      body: raw,
      headers: myHeaders,
      redirect: 'follow'
    };

    const c_response = yield call(request, process.env.COMPOUND_GRAPH_URL, compound_options);
    const { data: c_data } = c_response;
    const eth_market = c_data.markets.find(market => market.symbol === 'cETH');
    yield put(getEthPrice(eth_market.underlyingPriceUSD));

    yield put(getPricesSuccess(c_data))
    
  } catch (error) {
    console.log(error)
    // const jsonError = yield error.response ? error.response.json() : error;
    yield put(getPricesError('Could not fetch balances'));
  }
}

function* getGraphSaga() {

  try { 

    // Get the balances
    const options = {
      method: 'POST',
      body: JSON.stringify({ query: HEALTH })
    };

    const response = yield call(request, process.env.STATUS_URL, options);
    const { data } = response;
    console.log(data);

    yield put(getGraphSuccess(data))
    
  } catch (error) {
    console.log(error)
    // const jsonError = yield error.response ? error.response.json() : error;
    // yield put(getPricesError('Could not fetch balances'));
  }
}


function* getUserStatsRequest() {
  yield takeLatest(GET_USER_STATS_REQUEST, getUserStatsSaga);
}

function* getBalancesRequest() {
  yield takeLatest(GET_BALANCES_REQUEST, getBalancesSaga);
}

function* getTVLRequest() {
  yield takeLatest(GET_TVL_REQUEST, getTVLSaga);
}

function* getPricesRequest() {
  yield takeLatest(GET_PRICES_REQUEST, getPricesSaga);
}

function* getGraphRequest() {
  yield takeLatest(GET_GRAPH_REQUEST, getGraphSaga);
}

export default function* rootSaga() {
  yield all([
    fork(getUserStatsRequest),
    fork(getBalancesRequest),
    fork(getTVLRequest),
    fork(getPricesRequest),
    // fork(getGraphRequest),
  ]);
}