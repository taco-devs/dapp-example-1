/*
 *
 * SwapPage actions
 *
 */

import { GET_POOLS_REQUEST, GET_POOLS_SUCCESS, GET_POOLS_ERROR } from './constants';

export function getPools() {
  return {
    type: GET_POOLS_REQUEST,
  };
}

export function getPoolsSuccess(pools, tokens) {
  return {
    type: GET_POOLS_SUCCESS,
    pools,
    tokens
  };
}

export function getPoolsError(error) {
  return {
    type: GET_POOLS_ERROR,
    error
  };
}
