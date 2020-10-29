/*
 *
 * GrowthStats actions
 *
 */

import { DEFAULT_ACTION,
  GET_GRAPH_REQUEST, GET_GRAPH_SUCCESS, GET_GRAPH_ERROR,
  GET_BALANCES_REQUEST, GET_BALANCES_SUCCESS, GET_BALANCES_ERROR,
  GET_USER_STATS_REQUEST, GET_USER_STATS_SUCCESS, GET_USER_STATS_ERROR,
  GET_TVL_REQUEST, GET_TVL_SUCCESS, GET_TVL_ERROR,
  GET_PRICES_REQUEST, GET_PRICES_SUCCESS, GET_PRICES_ERROR,
  GET_ETH_PRICE
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getGraph() {
  return {
    type: GET_GRAPH_REQUEST,
  };
}

export function getGraphSuccess(status) {
  return {
    type: GET_GRAPH_SUCCESS,
    status
  };
}

export function getGraphError(error) {
  return {
    type: GET_GRAPH_ERROR,
    error
  };
}

export function getUserStats(address, web3) {
  return {
    type: GET_USER_STATS_REQUEST,
    address,
    web3
  };
}

export function getUserStatsSuccess(user) {
  return {
    type: GET_USER_STATS_SUCCESS,
    user
  };
}

export function getUserStatsError(error) {
  return {
    type: GET_USER_STATS_ERROR,
    error
  };
}

export function getBalances(address, web3) {
  return {
    type: GET_BALANCES_REQUEST,
    address,
    web3
  };
}

export function getBalancesSuccess(balances) {
  return {
    type: GET_BALANCES_SUCCESS,
    balances
  };
}

export function getBalancesError(error) {
  return {
    type: GET_BALANCES_ERROR,
    error
  };
}

export function getTVL() {
  return {
    type: GET_TVL_REQUEST
  };
}

export function getTVLSuccess(tvl, tvl_history) {
  return {
    type: GET_TVL_SUCCESS,
    tvl,
    tvl_history
  };
}

export function getTVLError(error) {
  return {
    type: GET_TVL_ERROR,
    error
  };
}

export function getPrices() {
  return {
    type: GET_PRICES_REQUEST
  };
}

export function getPricesSuccess(prices) {
  return {
    type: GET_PRICES_SUCCESS, 
    prices
  };
}

export function getPricesError(error) {
  return {
    type: GET_PRICES_ERROR,
    error
  };
}

export function getEthPrice(eth_price) {
  return {
    type: GET_ETH_PRICE,
    eth_price
  };
}
