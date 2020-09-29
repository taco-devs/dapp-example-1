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

const pairs = [
  "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", // ETH/USD
  "0x208bd5dc470eba21571ddb439801a614ed346376" // GRO/ETH
]

const PAIR_QUERIES = `
  {
    pairs (where: {
      id_in: ${JSON.stringify(pairs)}
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
      const ContractInstance = await new web3.eth.Contract(asset.abi, asset.address);
      const balance = await ContractInstance.methods.balanceOf(address).call();
      const deposit_fee = await ContractInstance.methods.depositFee().call();
      const exchange_rate = await ContractInstance.methods.exchangeRate().call();
      const total_reserve = await ContractInstance.methods.totalReserve().call();

      balances.push({
        name: asset.g_asset,
        base: asset.base_asset,
        underlying: asset.native,
        balance,
        deposit_fee,
        exchange_rate,
        total_reserve
      })

    } catch (e) {
      console.log(e)
    }
  }

  return balances;
}

function* getBalancesSaga(params) {

  const {address, web3} = params;

  try { 


    // Fetch Pairs price
    const query_url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
    const options = {
      method: 'POST',
      body: JSON.stringify({ query: PAIR_QUERIES })
    };

    const response = yield call(request, query_url, options);
    const { data } = response;

    // Get network
    const network = yield select(makeSelectCurrrentNetwork());
    const Network = NetworkData[network];

    if (Network) {
        
        // Set Eth Price in USDT
        const eth_price = data.pairs[0].token1Price
        yield put(getEthPrice(eth_price));


        const GrowTokenInstance = new web3.eth.Contract(Network.growth_token.abi, Network.growth_token.address);
        const GRO_Method = balanceChecker(GrowTokenInstance, address);
        const gro_balance = yield call([GRO_Method, GRO_Method.call]);

        // Fetch all balances
        const asset_balances = yield fetch_balances(Network.available_assets, web3, address);

        const balances = [
          {
            name: 'GRO',
            balance: gro_balance,
            price_eth: data.pairs[1].token0Price,
          },
          ...asset_balances
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