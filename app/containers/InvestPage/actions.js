/*
 *
 * InvestPage actions
 *
 */

import { 
  DEFAULT_ACTION, CHANGE_PAGE, SEARCH,
  MINT_GTOKEN_FROM_CTOKEN, MINT_GTOKEN_FROM_CTOKEN_SUCCESS, MINT_GTOKEN_FROM_CTOKEN_ERROR, 
  MINT_GTOKEN_FROM_UNDERLYING, MINT_GTOKEN_FROM_UNDERLYING_SUCCESS, MINT_GTOKEN_FROM_UNDERLYING_ERROR
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