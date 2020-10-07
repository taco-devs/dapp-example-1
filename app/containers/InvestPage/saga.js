import { channel } from 'redux-saga';
import {
  call, put, select, takeLatest, fork, all, cancelled, take
} from 'redux-saga/effects';

import request from 'utils/request'
import NetworkData from 'contracts';

import { MINT_GTOKEN_FROM_CTOKEN, MINT_GTOKEN_FROM_UNDERLYING, REDEEM_GTOKEN_TO_CTOKEN, REDEEM_GTOKEN_TO_UNDERLYING } from './constants'
import { 
  mintGTokenFromCTokenSuccess, mintGTokenFromCTokenError,
  mintGTokenFromUnderlyingSuccess, mintGTokenFromUnderlyingError
} from './actions';

import {
  addCurrentSwap, dismissSwap
} from '../App/actions'


const connectionStatusChannel = channel();

const deposit = (ContractInstance, _cost, address, asset, functions) => {
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
        }, 5000)
    })
    .on("confirmation", (confirmation) => {
      // connectionStatusChannel.put(functions.dismissSwap()); 
    })
    .on("error", async function () {
        console.log("Error");
    });
}

const deposit_underlying = (ContractInstance, _cost, address, asset, functions) => {
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
        }, 5000)
    })
    .on("confirmation", (confirmation) => {
      // connectionStatusChannel.put(functions.dismissSwap()); 
    })
    .on("error", async function () {
        console.log("Error");
    });
}

const withdraw = (ContractInstance, _cost, address, asset, functions) => {
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
        }, 5000)
    })
    .on("confirmation", (confirmation) => {
      // connectionStatusChannel.put(functions.dismissSwap()); 
    })
    .on("error", async function () {
        console.log("Error");
    });
}

const withdraw_underlying = (ContractInstance, _cost, address, asset, functions) => {
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
        }, 5000)
    })
    .on("confirmation", (confirmation) => {
      // connectionStatusChannel.put(functions.dismissSwap()); 
    })
    .on("error", async function () {
        console.log("Error");
    });
}

function* mintGTokenFromCTokenSaga(params) {
  const {payload} = params;
  const {GContractInstance, _cost, address, asset, toggle} = payload;

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
      {
        toggle,
        addCurrentSwap,
        dismissSwap
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
  const {GContractInstance, _cost, address, asset, toggle} = payload;

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
      {
        toggle,
        addCurrentSwap,
        dismissSwap
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
  const {GContractInstance, _grossShares, address, asset, toggle} = payload;
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
      {
        toggle,
        addCurrentSwap,
        dismissSwap
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
  const {GContractInstance, _grossShares, address, asset, toggle} = payload;

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
      {
        toggle,
        addCurrentSwap,
        dismissSwap
      });

  } catch (error) {
    console.log(error);
    const jsonError = yield error.response ? error.response.json() : error;
    yield put(dismissSwap());
    yield toggle();
    yield put(mintGTokenFromCTokenError(jsonError));
  }
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

function* watchDownloadFileChannel() {
  while (true) {
    const action = yield take(connectionStatusChannel)
    yield put(action)
  }
}

export default function* rootSaga() {
  yield all([
    fork(mintGTokenFromCTokenRequest),
    fork(mintGTokenFromUnderlyingRequest),
    fork(redeemGTokenToCTokenRequest),
    fork(redeemGTokenToUnderlyingRequest),
    fork(watchDownloadFileChannel)
  ]);
}