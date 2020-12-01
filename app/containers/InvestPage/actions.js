/*
 *
 * InvestPage actions
 *
 */

import { 
  DEFAULT_ACTION, CHANGE_PAGE, SEARCH,
  GET_TOKENS_REQUEST, GET_TOKENS_SUCCESS, GET_TOKENS_ERROR,
  MINT_GTOKEN_FROM_CTOKEN, MINT_GTOKEN_FROM_CTOKEN_SUCCESS, MINT_GTOKEN_FROM_CTOKEN_ERROR, 
  MINT_GTOKEN_FROM_UNDERLYING, MINT_GTOKEN_FROM_UNDERLYING_SUCCESS, MINT_GTOKEN_FROM_UNDERLYING_ERROR,
  MINT_GTOKEN_FROM_BRIDGE, MINT_GTOKEN_FROM_BRIDGE_ERROR, MINT_GTOKEN_FROM_BRIDGE_SUCCESS,
  MINT_GTOKEN_FROM_UNDERLYING_BRIDGE, MINT_GTOKEN_FROM_UNDERLYING_BRIDGE_SUCCESS, MINT_GTOKEN_FROM_UNDERLYING_BRIDGE_ERROR,
  REDEEM_GTOKEN_TO_BRIDGE, REDEEM_GTOKEN_TO_BRIDGE_SUCCESS, REDEEM_GTOKEN_TO_BRIDGE_ERROR,
  REDEEM_GTOKEN_TO_CTOKEN, REDEEM_GTOKEN_TO_UNDERLYING,
  APPROVE_TOKEN, APPROVE_TOKEN_SUCCESS, APPROVE_TOKEN_ERROR,
  GET_TOKEN_STATS_REQUEST, GET_TOKEN_STATS_SUCCESS, GET_TOKEN_STATS_ERROR
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

// GET TOKEN REQUEST
export function getTokens(dateRange) {
  return {
    type: GET_TOKENS_REQUEST,
    dateRange
  }
}

export function getTokensSuccess(tokens) {
  return {
    type: GET_TOKENS_SUCCESS,
    tokens
  }
}

export function getTokensError(error) {
  return {
    type: GET_TOKENS_ERROR,
    error
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

// MINT GTOKEN FROM BRIDGE
export function mintGTokenFromBridge(payload) {
  return {
    type: MINT_GTOKEN_FROM_BRIDGE,
    payload
  }
}

export function mintGTokenFromBridgeSuccess(success) {
  return {
    type: MINT_GTOKEN_FROM_BRIDGE_SUCCESS,
    success
  }
}

export function mintGTokenFromBridgeError(error) {
  return {
    type: MINT_GTOKEN_FROM_BRIDGE_ERROR,
    error
  }
}

// MINT GTOKEN FROM UNDERLYING BRIDGE
export function mintGTokenFromUnderlyingBridge(payload) {
  return {
    type: MINT_GTOKEN_FROM_UNDERLYING_BRIDGE,
    payload
  }
}

export function mintGTokenFromUnderlyingBridgeSuccess(success) {
  return {
    type: MINT_GTOKEN_FROM_UNDERLYING_BRIDGE_SUCCESS,
    success
  }
}

export function mintGTokenFromUnderlyingBridgeError(error) {
  return {
    type: MINT_GTOKEN_FROM_UNDERLYING_BRIDGE_ERROR,
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

// REDEEM GTOKEN TO BRIDGE
export function redeemGTokenToBridge(payload) {
  return {
    type: REDEEM_GTOKEN_TO_BRIDGE,
    payload
  }
}

export function redeemGTokenToBridgeSuccess(success) {
  return {
    type: REDEEM_GTOKEN_TO_BRIDGE_SUCCESS,
    success
  }
}

export function redeemGTokenToBridgeError(error) {
  return {
    type: REDEEM_GTOKEN_TO_BRIDGE_ERROR,
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

// GET TOKEN STATS REQUEST
export function getTokenStats(payload) {
  return {
    type: GET_TOKEN_STATS_REQUEST,
    payload
  }
}

export function getTokenStatsSuccess(tokenData) {
  return {
    type: GET_TOKEN_STATS_SUCCESS,
    tokenData
  }
}

export function getTokenStatsError(error) {
  return {
    type: GET_TOKEN_STATS_ERROR,
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