/*
 *
 * InvestPage actions
 *
 */

import { 
  DEFAULT_ACTION, CHANGE_PAGE, SEARCH,
  MINT_GTOKEN_FROM_CTOKEN, MINT_GTOKEN_FROM_CTOKEN_SUCCESS, MINT_GTOKEN_FROM_CTOKEN_ERROR, 
  MINT_GTOKEN_FROM_UNDERLYING, MINT_GTOKEN_FROM_UNDERLYING_SUCCESS, MINT_GTOKEN_FROM_UNDERLYING_ERROR, REDEEM_GTOKEN_TO_CTOKEN, REDEEM_GTOKEN_TO_UNDERLYING,
  APPROVE_TOKEN, APPROVE_TOKEN_SUCCESS, APPROVE_TOKEN_ERROR
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function changePage(pagination) {
  return {
    type: CHANGE_PAGE,
    pagination
  }
}

export function searchAssets(search) {
  return {
    type: SEARCH,
    search
  }
}

// MINT GTOKEN FROM CTOKEN
export function mintGTokenFromCToken(payload) {
  return {
    type: MINT_GTOKEN_FROM_CTOKEN,
    payload
  }
}

export function mintGTokenFromCTokenSuccess(success) {
  return {
    type: MINT_GTOKEN_FROM_CTOKEN_SUCCESS,
    success
  }
}

export function mintGTokenFromCTokenError(error) {
  return {
    type: MINT_GTOKEN_FROM_CTOKEN_ERROR,
    error
  }
}

// MINT GTOKEN FROM UNDERLYING
export function mintGTokenFromUnderlying(payload) {
  return {
    type: MINT_GTOKEN_FROM_UNDERLYING,
    payload
  }
}

export function mintGTokenFromUnderlyingSuccess(success) {
  return {
    type: MINT_GTOKEN_FROM_UNDERLYING_SUCCESS,
    success
  }
}

export function mintGTokenFromUnderlyingError(error) {
  return {
    type: MINT_GTOKEN_FROM_UNDERLYING_ERROR,
    error
  }
}

// REDEEM GTOKEN TO CTOKEN
export function redeemGTokenToCToken(payload) {
  return {
    type: REDEEM_GTOKEN_TO_CTOKEN,
    payload
  }
}

export function redeemGTokenToCTokenSuccess(success) {
  return {
    type: REDEEM_GTOKEN_TO_CTOKEN_SUCCESS,
    success
  }
}

export function redeemGTokenToCTokenError(error) {
  return {
    type: REDEEM_GTOKEN_TO_CTOKEN_ERROR,
    error
  }
}

// REDEEM GTOKEN TO UNDERLYING
export function redeemGTokenToUnderlying(payload) {
  return {
    type: REDEEM_GTOKEN_TO_UNDERLYING,
    payload
  }
}

export function redeemGTokenToUnderlyingSuccess(success) {
  return {
    type: REDEEM_GTOKEN_TO_UNDERLYING_SUCCESS,
    success
  }
}

export function redeemGTokenToUnderlyingError(error) {
  return {
    type: REDEEM_GTOKEN_TO_UNDERLYING_ERROR,
    error
  }
}

// ADD CURRENT APPROVAL
export function approveToken(payload) {
  return {
    type: APPROVE_TOKEN,
    payload
  }
}

export function approveTokenSuccess(success) {
  return {
    type: APPROVE_TOKEN_SUCCESS,
    success
  }
}

export function approveTokenError(error) {
  return {
    type: APPROVE_TOKEN_ERROR,
    error
  }
}