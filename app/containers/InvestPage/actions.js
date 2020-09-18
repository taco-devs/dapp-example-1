/*
 *
 * InvestPage actions
 *
 */

import { DEFAULT_ACTION, CHANGE_PAGE } from './constants';

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