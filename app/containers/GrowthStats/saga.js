import {
  call, put, select, takeLatest, fork, all
} from 'redux-saga/effects';

import request from 'utils/request'
import NetworkData from 'contracts';

import { GET_BALANCES_REQUEST } from './constants'
import { 
  getBalancesSuccess, getBalancesError,
  getEthPrice
} from './actions';

import { makeSelectCurrrentNetwork } from '../App/selectors';

const base_pairs = [
  "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", // ETH/USD
  "0x208bd5dc470eba21571ddb439801a614ed346376", // GRO/ETH 
]

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
const balanceChecker = (ContractInstance, address) => {
  return ContractInstance.methods.balanceOf(address);
}


const fetch_balances = async (available_assets, web3, address) => {
  const assets_keys = Object.keys(available_assets);
  // Iterate through the contracts
  const balances = [];
  for (const key of assets_keys) {
    try {

      const asset = available_assets[key];

      // Check for abi and address
      if (!asset.gtoken_abi || !asset.gtoken_address) continue;

      // Fetch asset balance
      const ContractInstance = await new web3.eth.Contract(asset.gtoken_abi, asset.gtoken_address);
      const balance = await ContractInstance.methods.balanceOf(address).call();
      const withdrawal_fee = await ContractInstance.methods.withdrawalFee().call();
      const exchange_rate = await ContractInstance.methods.exchangeRate().call();
      const total_reserve = await ContractInstance.methods.totalReserve().call();
      const total_supply = await ContractInstance.methods.totalSupply().call();
      
      //console.log(balance, withdrawal_fee, exchange_rate, total_reserve, total_supply);

      let liquidation_price = 0;

      if (Number(balance) > 0) {
        liquidation_price = await ContractInstance.methods.calcWithdrawalCostFromShares(balance, total_reserve, total_supply, withdrawal_fee).call();
      }

      balances.push({
        name: asset.g_asset,
        base: asset.base_asset,
        underlying: asset.native,
        gtoken_address: asset.gtoken_address,
        balance,
        withdrawal_fee,
        exchange_rate,
        total_reserve,
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

const get_prices = async (asset_balances, data, web3) => {
  // Iterate through all prices
  try {
    const { pairs } = data;
    const with_prices = 
          asset_balances.map((asset) => {
            const pair = pairs.find(pair => pair.token0.symbol === asset.base);

            // Get the redeeming rate

            return {
              ...asset,
              base_price_eth: pair ? pair.token0Price : 0,
            }
          })
    
    return with_prices;
  } catch (e) {
    console.log(e);
  }
  

}

function* getBalancesSaga(params) {

  const {address, web3} = params;

  try { 

    // Get network
    const network = yield select(makeSelectCurrrentNetwork());
    const Network = NetworkData[network];

    if (Network) {

        // Get the correct pairs to fetch price
        const PAIRS = get_pairs(Network);

        // Fetch Pairs price
        const query_url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
        const options = {
          method: 'POST',
          body: JSON.stringify({ query: PAIRS })
        };

        const response = yield call(request, query_url, options);
        const { data } = response;
        
        // Set Eth Price in USDT
        const eth_price = data.pairs[0].token1Price
        yield put(getEthPrice(eth_price));

        // Get GRO data
        const GrowTokenInstance = new web3.eth.Contract(Network.growth_token.abi, Network.growth_token.address);
        const GRO_Method = balanceChecker(GrowTokenInstance, address);
        const gro_balance = yield call([GRO_Method, GRO_Method.call]);

        // Fetch all balances
        const asset_balances = yield fetch_balances(Network.available_assets, web3, address);;

        // Calculate the asset price
        const balances_with_rate = yield get_prices(asset_balances, data, web3, address);
        

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

  } catch (error) {
    const jsonError = yield error.response ? error.response.json() : error;
    yield put(getBalancesError(jsonError));
  }
}

function* getBalancesRequest() {
  yield takeLatest(GET_BALANCES_REQUEST, getBalancesSaga);
}

export default function* rootSaga() {
  yield all([
    fork(getBalancesRequest),
  ]);
}