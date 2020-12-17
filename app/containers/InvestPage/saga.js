import { channel } from 'redux-saga';
import {
  call, put, select, takeLatest, fork, all, cancelled, take
} from 'redux-saga/effects';

import request from 'utils/request'
import NetworkData from 'contracts';

import { APPROVE_TOKEN, GET_TOKENS_REQUEST, GET_TOKEN_STATS_REQUEST, MINT_GTOKEN_FROM_CTOKEN, MINT_GTOKEN_FROM_UNDERLYING, MINT_GTOKEN_FROM_BRIDGE, REDEEM_GTOKEN_TO_CTOKEN, REDEEM_GTOKEN_TO_UNDERLYING, REDEEM_GTOKEN_TO_BRIDGE, MINT_GTOKEN_FROM_UNDERLYING_BRIDGE, REDEEM_GTOKEN_TO_UNDERLYING_BRIDGE } from './constants'
import { 
  getTokensSuccess, getTokensError,
  mintGTokenFromCTokenSuccess, mintGTokenFromCTokenError,
  mintGTokenFromUnderlyingSuccess, mintGTokenFromUnderlyingError,
  approveTokenSuccess, approveTokenError,
  getTokenStatsSuccess, getTokenStatsError
} from './actions';

import {
  addCurrentSwap, dismissSwap,
  addCurrentApproval, dismissApproval
} from '../App/actions'

import {
  getBalances, getPricesSuccess,
} from '../GrowthStats/actions'

import { 
  deposit, deposit_underlying, bridge_deposit, bridge_deposit_underlying,
  withdraw, withdraw_underlying, withdraw_bridge, withdraw_underlying_bridge
} from './contractHandlers'

const connectionStatusChannel = channel();

// Approve the user to send tokens
const approve = async (Contract, approval_address, total_supply, address, web3, functions) => {
  let stored_hash;

  return Contract.methods.approve(approval_address, total_supply).send({ from: address })
    .on("transactionHash", (hash) => {
        stored_hash = hash;
        connectionStatusChannel.put(
          functions.addCurrentApproval({
            status: 'receipt',
            hash,
          })
        )
    })
    .on("receipt",  (tx) => {
        // Send the confirmation receipt
        functions.updateApprovalBalance(total_supply);
        connectionStatusChannel.put(
          functions.dismissApproval()
        ); 
    })
    .on("confirmation", (confirmation) => {
      // connectionStatusChannel.put(functions.dismissApproval()); 
    })
    .on("error", async function () {
      connectionStatusChannel.put(functions.dismissApproval());
    });
}

function* getTokensSaga(params) {
  const {dateRange} = params;

  const {last_month_date} = dateRange;  
  const query = `
    {
      tokens {
        id
        name
        symbol
        totalSupply
        totalReserve
        depositFee
        withdrawalFee
        listingDate
        cumulativeTotalValueLockedUSD
        countTokenDailyDatas
        cumulativeDailyChange
        hasMiningToken
        lastAvgPrice
        tokenDailyDatas (
          first: 1
          orderBy: id
          orderDirection: desc
          where: {
            date_lte: ${last_month_date}
          }
        ) {
          id
          txCount
          avgPrice
          avgUnderlyingPrice
          currentPrice
        }
      }
    }
  `

  try { 

      // Fetch Pairs price
      // const query_url = 'https://api.thegraph.com/subgraphs/name/irvollo/growth-defi';
      const options = {
        method: 'POST',
        body: JSON.stringify({ query })
      };

      const response = yield call(request, process.env.GROWTH_GRAPH_URL, options);

      if ( response && response.data) {
        const {tokens} = response.data;
        if (tokens) {
          yield put(getTokensSuccess(tokens));
        }
      }
  } catch (error) {
    //const jsonError = yield error.response ? error.response.json() : error;
    // yield put(dismissApproval());
    yield put(getTokensError('Could not fetch tokens data'));
  }
}

function* mintGTokenFromCTokenSaga(params) {
  const {payload} = params;
  const {GContractInstance, _cost, address, asset, toggle, web3} = payload;

  try { 
  
    // Close the current modal
    yield toggle();

    // Call the confirmation modal
    yield put(addCurrentSwap({
      status: 'loading',
      modal_type: 'mint',
      from: asset.from,
      to: asset.to,
      sending: asset.sending,
      receiving: asset.receiving,
      fromDecimals: asset.fromDecimals,
      toDecimals: asset.toDecimals,
      fromImage: asset.fromImage,
      toImage: asset.toImage
    }));    

    
    // Call Web3 to Confirm this transaction
    // const result = yield call([DepositMethod, DepositMethod.send], {from: address});
    yield deposit(
      GContractInstance, 
      connectionStatusChannel,
      _cost, 
      address, 
      asset,
      web3,
      {
        toggle,
        addCurrentSwap,
        dismissSwap,
        getBalances,
      });

  } catch (error) {
    const jsonError = yield error.response ? error.response.json() : error;
    yield put(dismissSwap());
    yield toggle();
    yield put(mintGTokenFromCTokenError(jsonError));
  }
}


function* mintGTokenFromBridgeSaga(params) {
  const {payload} = params;
  const {GContractInstance, _cost, growthToken, address, asset, toggle, web3} = payload;

  try { 
  
    // Close the current modal
    yield toggle();

    // Call the confirmation modal
    yield put(addCurrentSwap({
      status: 'loading',
      modal_type: 'mint',
      from: asset.from,
      to: asset.to,
      sending: asset.sending,
      receiving: asset.receiving,
      fromDecimals: asset.fromDecimals,
      toDecimals: asset.toDecimals,
      fromImage: asset.fromImage,
      toImage: asset.toImage
    }));    

    
    // Call Web3 to Confirm this transaction
    // const result = yield call([DepositMethod, DepositMethod.send], {from: address});
    yield bridge_deposit(
      GContractInstance, 
      connectionStatusChannel,
      _cost, 
      growthToken,
      address, 
      asset,
      web3,
      {
        toggle,
        addCurrentSwap,
        dismissSwap,
        getBalances,
      });

  } catch (error) {
    const jsonError = yield error.response ? error.response.json() : error;
    yield put(dismissSwap());
    yield toggle();
    yield put(mintGTokenFromCTokenError(jsonError));
  }
}


function* mintGTokenFromUnderlyingSaga(params) {

  const {payload} = params;
  const {GContractInstance, _cost, address, web3, asset, toggle} = payload;

  try { 
  
    // Close the current modal
    yield toggle();

    // Call the confirmation modal
    yield put(addCurrentSwap({
      status: 'loading',
      modal_type: 'mint',
      from: asset.from,
      to: asset.to,
      sending: asset.sending,
      receiving: asset.receiving,
      fromDecimals: asset.fromDecimals,
      toDecimals: asset.toDecimals,
      fromImage: asset.fromImage,
      toImage: asset.toImage
    }));    
    
    // Call Web3 to Confirm this transaction
    yield deposit_underlying(
      GContractInstance, 
      connectionStatusChannel,
      _cost, 
      address, 
      asset,
      web3,
      {
        toggle,
        addCurrentSwap,
        dismissSwap,
        getBalances
      });

  } catch (error) {
    console.log(error);
    const jsonError = yield error.response ? error.response.json() : error;
    yield put(dismissSwap());
    yield toggle();
    yield put(mintGTokenFromCTokenError(jsonError));
  }
}

function* mintGTokenFromUnderlyingBridgeSaga(params) {

  const {payload} = params;
  const {GContractInstance, _cost, growthToken, address, web3, asset, toggle} = payload;

  try { 
  
    // Close the current modal
    yield toggle();

    // Call the confirmation modal
    yield put(addCurrentSwap({
      status: 'loading',
      modal_type: 'mint',
      from: asset.from,
      to: asset.to,
      sending: asset.sending,
      receiving: asset.receiving,
      fromDecimals: asset.fromDecimals,
      toDecimals: asset.toDecimals,
      fromImage: asset.fromImage,
      toImage: asset.toImage
    }));    
    
    // Call Web3 to Confirm this transaction
    yield bridge_deposit_underlying(
      GContractInstance, 
      connectionStatusChannel,
      _cost, 
      growthToken,
      address, 
      asset,
      web3,
      {
        toggle,
        addCurrentSwap,
        dismissSwap,
        getBalances
      });

  } catch (error) {

    const jsonError = yield error.response ? error.response.json() : error;
    yield put(dismissSwap());
    yield toggle();
    yield put(mintGTokenFromCTokenError(jsonError));
  }
}

function* redeemGTokenToCTokenSaga(params) {

  const {payload} = params;
  const {GContractInstance, _grossShares, address, asset, toggle, web3} = payload;
  try { 
    // Close the current modal
    yield toggle();

    // Call the confirmation modal
    yield put(addCurrentSwap({
      status: 'loading',
      modal_type: 'redeem',
      from: asset.from,
      to: asset.to,
      sending: asset.sending,
      receiving: asset.receiving,
      fromDecimals: asset.fromDecimals,
      toDecimals: asset.toDecimals,
      fromImage: asset.fromImage,
      toImage: asset.toImage
    }));    

    
    // Call Web3 to Confirm this transaction
    // const result = yield call([DepositMethod, DepositMethod.send], {from: address});
    yield withdraw(
      GContractInstance, 
      connectionStatusChannel,
      _grossShares, 
      address, 
      asset,
      web3,
      {
        toggle,
        addCurrentSwap,
        dismissSwap,
        getBalances,
      });

  } catch (error) {
    console.log(error)
    const jsonError = yield error.response ? error.response.json() : error;
    yield put(dismissSwap());
    yield toggle();
    yield put(mintGTokenFromCTokenError(jsonError));
  }
}


function* redeemGTokenToUnderlyingSaga(params) {
  const {payload} = params;
  const {GContractInstance, _grossShares, address, asset,  web3, toggle} = payload;

  try { 
  
    // Close the current modal
    yield toggle();

    // Call the confirmation modal
    yield put(addCurrentSwap({
      status: 'loading',
      modal_type: 'redeem',
      from: asset.from,
      to: asset.to,
      sending: asset.sending,
      receiving: asset.receiving,
      fromDecimals: asset.fromDecimals,
      toDecimals: asset.toDecimals,
      fromImage: asset.fromImage,
      toImage: asset.toImage
    }));    

    
    // Call Web3 to Confirm this transaction
    // const result = yield call([DepositMethod, DepositMethod.send], {from: address});
    yield withdraw_underlying(
      GContractInstance, 
      connectionStatusChannel,
      _grossShares, 
      address, 
      asset,
      web3,
      {
        toggle,
        addCurrentSwap,
        dismissSwap,
        getBalances
      });

  } catch (error) {
    const jsonError = yield error.response ? error.response.json() : error;
    yield put(dismissSwap());
    yield toggle();
    yield put(mintGTokenFromCTokenError(jsonError));
  }
}

function* redeemGTokenToBridgeSaga(params) {
  const {payload} = params;
  const {GContractInstance, _grossShares, growthToken, address, asset,  web3, toggle} = payload;

  try { 
  
    // Close the current modal
    yield toggle();

    // Call the confirmation modal
    yield put(addCurrentSwap({
      status: 'loading',
      modal_type: 'redeem',
      from: asset.from,
      to: asset.to,
      sending: asset.sending,
      receiving: asset.receiving,
      fromDecimals: asset.fromDecimals,
      toDecimals: asset.toDecimals,
      fromImage: asset.fromImage,
      toImage: asset.toImage
    }));    

    
    // Call Web3 to Confirm this transaction
    // const result = yield call([DepositMethod, DepositMethod.send], {from: address});
    yield withdraw_bridge(
      GContractInstance, 
      connectionStatusChannel,
      _grossShares, 
      growthToken,
      address, 
      asset,
      web3,
      {
        toggle,
        addCurrentSwap,
        dismissSwap,
        getBalances
      });

  } catch (error) {
    const jsonError = yield error.response ? error.response.json() : error;
    yield put(dismissSwap());
    yield toggle();
    yield put(mintGTokenFromCTokenError(jsonError));
  }
}

function* redeemGTokenToUnderlyingBridgeSaga(params) {
  const {payload} = params;
  const {GContractInstance, _grossShares, growthToken, address, asset,  web3, toggle} = payload;

  console.log('payload', payload)

  try { 
  
    // Close the current modal
    yield toggle();

    // Call the confirmation modal
    yield put(addCurrentSwap({
      status: 'loading',
      modal_type: 'redeem',
      from: asset.from,
      to: asset.to,
      sending: asset.sending,
      receiving: asset.receiving,
      fromDecimals: asset.fromDecimals,
      toDecimals: asset.toDecimals,
      fromImage: asset.fromImage,
      toImage: asset.toImage
    }));    

    
    // Call Web3 to Confirm this transaction
    // const result = yield call([DepositMethod, DepositMethod.send], {from: address});
    yield withdraw_underlying_bridge(
      GContractInstance, 
      connectionStatusChannel,
      _grossShares, 
      growthToken,
      address, 
      asset,
      web3,
      {
        toggle,
        addCurrentSwap,
        dismissSwap,
        getBalances
      });

  } catch (error) {
    const jsonError = yield error.response ? error.response.json() : error;
    yield put(dismissSwap());
    yield toggle();
    yield put(mintGTokenFromCTokenError(jsonError));
  }
}

function* approveTokenSaga(params) {
  const {payload} = params;
  const {Contract, approval_address, total_supply, address, updateApprovalBalance, web3} = payload;

  try { 

    yield put(addCurrentApproval({status: 'loading'}));


    yield approve(
      Contract, 
      approval_address, 
      total_supply, 
      address,
      web3,
      {
        addCurrentApproval,
        dismissApproval, 
        updateApprovalBalance
      });

  } catch (error) {
    const jsonError = yield error.response ? error.response.json() : error;
    yield put(dismissApproval());
    yield put(approveTokenError(jsonError));
  }
}


function* getTokenStatsSaga(params) {
  const {payload} = params;
  const {token} = payload;
  
  const parsed_where = `
    where: {
      token: "${token.toLowerCase()}"
    }
  `

  const query = `
    {
      tokenDailyDatas (
          ${parsed_where}
        )
      {
        id
        date
        mintTotalSent
        mintTotalReceived
        redeemTotalSent
        redeemTotalReceived
        avgPrice
        avgUnderlyingPrice
        txCount
        supply
        reserve
        miningTokenBalance
        currentPrice
        token {
          id
        }
      }
    }
  `

  try { 

      // Fetch Pairs price
      const query_url = `${process.env.GROWTH_GRAPH_URL}`;
      const options = {
        method: 'POST',
        body: JSON.stringify({ query })
      };

      const response = yield call(request, query_url, options);

      if ( response && response.data) {
        const {tokenDailyDatas} = response.data;

        if (tokenDailyDatas) {
          yield put(getTokenStatsSuccess(tokenDailyDatas));
        }
      }
  } catch (error) {
    const jsonError = yield error.response ? error.response.json() : error;
    // yield put(dismissApproval());
    // yield put(approveTokenError(jsonError));
  }
}

function* getTokensRequest() {
  yield takeLatest(GET_TOKENS_REQUEST, getTokensSaga);
}

function* mintGTokenFromCTokenRequest() {
  yield takeLatest(MINT_GTOKEN_FROM_CTOKEN, mintGTokenFromCTokenSaga);
}


function* mintGTokenFromUnderlyingRequest() {
  yield takeLatest(MINT_GTOKEN_FROM_UNDERLYING, mintGTokenFromUnderlyingSaga);
}

function* mintGTokenFromBridgeRequest() {
  yield takeLatest(MINT_GTOKEN_FROM_BRIDGE, mintGTokenFromBridgeSaga);
}

function* mintGTokenFromUnderlyingBridgeRequest() {
  yield takeLatest(MINT_GTOKEN_FROM_UNDERLYING_BRIDGE, mintGTokenFromUnderlyingBridgeSaga);
}

function* redeemGTokenToCTokenRequest() {
  yield takeLatest(REDEEM_GTOKEN_TO_CTOKEN, redeemGTokenToCTokenSaga);
}

function* redeemGTokenToUnderlyingRequest() {
  yield takeLatest(REDEEM_GTOKEN_TO_UNDERLYING, redeemGTokenToUnderlyingSaga);
}

function* redeemGTokenToBridgeRequest() {
  yield takeLatest(REDEEM_GTOKEN_TO_BRIDGE, redeemGTokenToBridgeSaga);
}

function* redeemGTokenToUnderlyingBridgeRequest() {
  yield takeLatest(REDEEM_GTOKEN_TO_UNDERLYING_BRIDGE, redeemGTokenToUnderlyingBridgeSaga);
}

function* approveTokenRequest() {
  yield takeLatest(APPROVE_TOKEN, approveTokenSaga);
}

function* getTokenStatsRequest() {
  yield takeLatest(GET_TOKEN_STATS_REQUEST, getTokenStatsSaga);
}

function* watchDownloadFileChannel() {
  while (true) {
    const action = yield take(connectionStatusChannel)
    yield put(action)
  }
}

export default function* rootSaga() {
  yield all([
    fork(getTokensRequest),
    fork(mintGTokenFromCTokenRequest),
    fork(mintGTokenFromUnderlyingRequest),
    fork(mintGTokenFromBridgeRequest),
    fork(mintGTokenFromUnderlyingBridgeRequest),
    fork(redeemGTokenToCTokenRequest),
    fork(redeemGTokenToUnderlyingRequest),
    fork(redeemGTokenToBridgeRequest),
    fork(redeemGTokenToUnderlyingBridgeRequest),
    fork(approveTokenRequest),
    fork(getTokenStatsRequest),
    fork(watchDownloadFileChannel)
  ]);
}