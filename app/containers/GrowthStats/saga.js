import {
  call, put, select, takeLatest, fork, all
} from 'redux-saga/effects';

import request from 'utils/request'
import GrowToken from 'contracts/GrowToken.json';


import { GET_BALANCES_REQUEST } from './constants'
import { 
  getBalancesSuccess, getBalancesError,
  getEthPrice
} from './actions';

const balanceChecker = (ContractInstance, address) => {
  return ContractInstance.methods.balanceOf(address);
}

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
    console.log(data)

    // Set Eth Price in USDT
    const eth_price = data.pairs[0].token1Price
    yield put(getEthPrice(eth_price));

    const GrowTokenInstance = new web3.eth.Contract(GrowToken, '0x09e64c2b61a5f1690ee6fbed9baf5d6990f8dfd0');
    const GRO_Method = balanceChecker(GrowTokenInstance, address);

    const gro_balance = yield call([GRO_Method, GRO_Method.call]);
    
    const balances = [
      {
        name: 'GRO',
        balance: gro_balance,
        price_eth: data.pairs[1].token0Price,
      },
    ]

    yield put(getBalancesSuccess(balances))

  } catch (error) {
    console.log(error);
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