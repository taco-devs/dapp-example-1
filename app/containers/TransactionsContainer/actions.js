/*
 *
 * TransactionsContainer actions
 *
 */

import { 
    GET_TRANSACTIONS_REQUEST, GET_TRANSACTIONS_SUCCESS, GET_TRANSACTIONS_ERROR,
    CHANGE_PAGINATION,
 } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getTransactions(payload) {
  return {
    type: GET_TRANSACTIONS_REQUEST,
    ...payload
  }
}

export function getTransactionsSuccess(transactions) {
  return {
    type: GET_TRANSACTIONS_SUCCESS,
    transactions
  }
}

export function getTransactionsError(error) {
  return {
    type: GET_TRANSACTIONS_ERROR,
    error
  }
}

export function changePage(pagination) {
  return {
    type: CHANGE_PAGINATION,
    pagination
  }
}
