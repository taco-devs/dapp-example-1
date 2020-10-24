import { channel } from 'redux-saga';
import {
  call, put, select, takeLatest, fork, all, cancelled, take
} from 'redux-saga/effects';

import request from 'utils/request'
import NetworkData from 'contracts';

import { APPROVE_TOKEN, GET_TOKENS_REQUEST, GET_TOKEN_STATS_REQUEST, MINT_GTOKEN_FROM_CTOKEN, MINT_GTOKEN_FROM_UNDERLYING, REDEEM_GTOKEN_TO_CTOKEN, REDEEM_GTOKEN_TO_UNDERLYING } from './constants'
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
  getBalances
} from '../GrowthStats/actions'


const connectionStatusChannel = channel();

const deposit = (ContractInstance, _cost, address, asset, web3, functions) => {
  let stored_hash;
  return ContractInstance.methods.deposit(_cost).send({ from: address})
    .on("transactionHash", (hash) => {
        stored_hash = hash;
        connectionStatusChannel.put(
          functions.addCurrentSwap({
            status: 'receipt',
            modal_type: 'mint',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash,
            progress: false,
          })
        )
    })
    .on("receipt",  (tx) => {
        // Send the confirmation receipt
        connectionStatusChannel.put(
          functions.addCurrentSwap({
            status: 'confirmed',
            modal_type: 'mint',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash: stored_hash,
            progress: true,
          })
        )

        // Timeout to autoclose the modal in 5s
        setTimeout(() => {
          connectionStatusChannel.put(functions.dismissSwap());
          connectionStatusChannel.put(functions.getBalances(address, web3));
        }, 5000)
    })
    .on("confirmation", (confirmation) => {
      // connectionStatusChannel.put(functions.dismissSwap()); 
    })
    .on("error", async function () {
        console.log("Error");
    });
}

const deposit_underlying = (ContractInstance, _cost, address, asset, web3, functions) => {
  let stored_hash;
  return ContractInstance.methods.depositUnderlying(_cost).send({ from: address})
    .on("transactionHash", (hash) => {
        stored_hash = hash;
        connectionStatusChannel.put(
          functions.addCurrentSwap({
            status: 'receipt',
            modal_type: 'mint',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash,
            progress: false,
          })
        )
    })
    .on("receipt",  (tx) => {
        // Send the confirmation receipt
        connectionStatusChannel.put(
          functions.addCurrentSwap({
            status: 'confirmed',
            modal_type: 'mint',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash: stored_hash,
            progress: true,
          })
        )

        // Timeout to autoclose the modal in 5s
        setTimeout(() => {
          connectionStatusChannel.put(functions.dismissSwap());
          connectionStatusChannel.put(functions.getBalances(address, web3));
        }, 5000)
    })
    .on("confirmation", (confirmation) => {
      // connectionStatusChannel.put(functions.dismissSwap()); 
    })
    .on("error", async function () {
        console.log("Error");
    });
}

const withdraw = (ContractInstance, _cost, address, asset, web3, functions) => {
  let stored_hash;
  return ContractInstance.methods.withdraw(_cost).send({ from: address})
    .on("transactionHash", (hash) => {
        stored_hash = hash;
        connectionStatusChannel.put(
          functions.addCurrentSwap({
            status: 'receipt',
            modal_type: 'redeem',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash,
            progress: false,
          })
        )
    })
    .on("receipt",  (tx) => {
        // Send the confirmation receipt
        connectionStatusChannel.put(
          functions.addCurrentSwap({
            status: 'confirmed',
            modal_type: 'redeem',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash: stored_hash,
            progress: true,
          })
        )

        // Timeout to autoclose the modal in 5s
        setTimeout(() => {
          connectionStatusChannel.put(functions.dismissSwap());
          connectionStatusChannel.put(functions.getBalances(address, web3));
        }, 5000)
    })
    .on("confirmation", (confirmation) => {
      // connectionStatusChannel.put(functions.dismissSwap()); 
    })
    .on("error", async function () {
        console.log("Error");
    });
}

const withdraw_underlying = (ContractInstance, _cost, address, asset, web3, functions) => {
  let stored_hash;
  return ContractInstance.methods.withdrawUnderlying(_cost).send({ from: address})
    .on("transactionHash", (hash) => {
        stored_hash = hash;
        connectionStatusChannel.put(
          functions.addCurrentSwap({
            status: 'receipt',
            modal_type: 'redeem',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash,
            progress: false,
          })
        )
    })
    .on("receipt",  (tx) => {
        // Send the confirmation receipt
        connectionStatusChannel.put(
          functions.addCurrentSwap({
            status: 'confirmed',
            modal_type: 'redeem',
            from: asset.from,
            to: asset.to,
            sending: asset.sending,
            receiving: asset.receiving,
            fromDecimals: asset.fromDecimals,
            toDecimals: asset.toDecimals,
            fromImage: asset.fromImage,
            toImage: asset.toImage,
            hash: stored_hash,
            progress: true,
          })
        )

        // Timeout to autoclose the modal in 5s
        setTimeout(() => {
          connectionStatusChannel.put(functions.dismissSwap());
          connectionStatusChannel.put(functions.getBalances(address, web3));
        }, 5000)
    })
    .on("confirmation", (confirmation) => {
      // connectionStatusChannel.put(functions.dismissSwap()); 
    })
    .on("error", async function () {
        console.log("Error");
    });
}

// Approve the user to send tokens
const approve = (Contract, asset, total_supply, address, functions) => {
  let stored_hash;
  return Contract.methods.approve(asset.gtoken_address, total_supply).send({ from: address })
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
        console.log("Error");
    });
}

function* getTokensSaga(params) {
  const {payload} = params;
  
  const query = `
    {
      tokens {
        id
        name
        symbol
        totalSupply
      }
    }
  `

  try { 

      // Fetch Pairs price
      const query_url = 'https://api.thegraph.com/subgraphs/name/irvollo/growth-defi';
      const options = {
        method: 'POST',
        body: JSON.stringify({ query })
      };

      const response = yield call(request, query_url, options);

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
    console.log(error);
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
    // const result = yield call([DepositMethod, DepositMethod.send], {from: address});
    yield deposit_underlying(
      GContractInstance, 
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
    console.log(error);
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
    console.log(error);
    const jsonError = yield error.response ? error.response.json() : error;
    yield put(dismissSwap());
    yield toggle();
    yield put(mintGTokenFromCTokenError(jsonError));
  }
}

function* approveTokenSaga(params) {
  const {payload} = params;
  const {Contract, asset, total_supply, address, updateApprovalBalance} = payload;

  try { 

    yield put(addCurrentApproval({status: 'loading'}))

    yield approve(
      Contract, 
      asset, 
      total_supply, 
      address,
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
        txCount
        token {
          id
        }
      }
    }
  `

  try { 

      // Fetch Pairs price
      const query_url = 'https://api.thegraph.com/subgraphs/name/irvollo/growth-defi';
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

function* redeemGTokenToCTokenRequest() {
  yield takeLatest(REDEEM_GTOKEN_TO_CTOKEN, redeemGTokenToCTokenSaga);
}

function* redeemGTokenToUnderlyingRequest() {
  yield takeLatest(REDEEM_GTOKEN_TO_UNDERLYING, redeemGTokenToUnderlyingSaga);
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
    fork(redeemGTokenToCTokenRequest),
    fork(redeemGTokenToUnderlyingRequest),
    fork(approveTokenRequest),
    fork(getTokenStatsRequest),
    fork(watchDownloadFileChannel)
  ]);
}