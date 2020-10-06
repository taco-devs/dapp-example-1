import {
  call, put, select, takeLatest, fork, all
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

const deposit = (ContractInstance, _cost) => {
  return ContractInstance.methods.deposit(_cost);
}

const deposit_underlying = (ContractInstance, _cost) => {
  return ContractInstance.methods.depositUnderlying(_cost);
}

const withdraw = (ContractInstance, _cost) => {
  return ContractInstance.methods.withdraw(_cost);
}

const withdraw_underlying = (ContractInstance, _cost) => {
  return ContractInstance.methods.withdrawUnderlying(_cost);
}

function* mintGTokenFromCTokenSaga(params) {


  try { 

    const {payload} = params;
    const {GContractInstance, _cost, address} = payload;
    
    const DepositMethod = deposit(GContractInstance, _cost);

    // Call Web3 to Confirm this transaction
    const result = yield call([DepositMethod, DepositMethod.send], {from: address});

  } catch (error) {
    const jsonError = yield error.response ? error.response.json() : error;
    yield put(mintGTokenFromCTokenError(jsonError));
  }
}


function* mintGTokenFromUnderlyingSaga(params) {

  const {payload} = params;
  const {GContractInstance, _cost, address, asset, toggle} = payload;

  try { 

    const DepositMethod = deposit_underlying(GContractInstance, _cost);

    // Close the current modal
    yield toggle();

    // Call the confirmation modal
    yield put(addCurrentSwap({
      status: 'loading',
      type: 'mint',
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
    const result = yield call([DepositMethod, DepositMethod.send], {from: address});

    if (result) {
      console.log(result);
      yield put(dismissSwap());
    }

  } catch (error) {

    const jsonError = yield error.response ? error.response.json() : error;
    yield put(dismissSwap());
    yield toggle();
    yield put(mintGTokenFromCTokenError(jsonError));
  }
}

function* redeemGTokenToCTokenSaga(params) {

  try { 

    const {payload} = params;
    const {GContractInstance, _grossShares, address} = payload;
    
    const WithdrawMethod = withdraw(GContractInstance, _grossShares);

    // Call Web3 to Confirm this transaction
    const result = yield call([WithdrawMethod, WithdrawMethod.send], {from: address});

  } catch (error) {
    const jsonError = yield error.response ? error.response.json() : error;
    yield put(mintGTokenFromCTokenError(jsonError));
  }
}


function* redeemGTokenToUnderlyingSaga(params) {
  try { 

    const {payload} = params;
    const {GContractInstance, _grossShares, address} = payload;
    const WithdrawMethod = withdraw_underlying(GContractInstance, _grossShares);

    // Call Web3 to Confirm this transaction
    const result = yield call([WithdrawMethod, WithdrawMethod.send], {from: address});
    

  } catch (error) {
    const jsonError = yield error.response ? error.response.json() : error;
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

export default function* rootSaga() {
  yield all([
    fork(mintGTokenFromCTokenRequest),
    fork(mintGTokenFromUnderlyingRequest),
    fork(redeemGTokenToCTokenRequest),
    fork(redeemGTokenToUnderlyingRequest),
  ]);
}