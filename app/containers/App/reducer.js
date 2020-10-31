/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import { fromJS } from 'immutable';
import { SETUP_NETWORK, ADD_CURRENT_SWAP, DISMISS_SWAP,  ADD_CURRENT_APPROVAL, DISMISS_APPROVAL, TOGGLE_HIDE_BALANCES } from './constants';

const dummyswap = {
  status: 'loading',
  modal_type: 'redeem',
  from: 'gcDAI',
  to: 'DAI',
  sending: 10,
  receiving: 200,
  fromDecimals: 1,
  toDecimals: 1,
  fromImage: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5263.png',
  toImage: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
  hash: 'hdksf'
}

const dummyApproval = {
  status: 'receipt',
  hash: '0xD2C6dB857E3BaA87Fa15241181ed8bC2fBCB9E4C'
}

export const initialState = fromJS({
  network: 'eth',
  currentSwap: null,
  currentApproval: null,
  hideBalances: !!localStorage.getItem('hideBalances'),
});


function appReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_HIDE_BALANCES: 
      localStorage.setItem('hideBalances',!state.get('hideBalances'));
      return state.set('hideBalances', !state.get('hideBalances'));
    case SETUP_NETWORK: 
      return state.set('network', action.network);
    case ADD_CURRENT_SWAP: 
      return state.set('currentSwap', action.swap);
    case DISMISS_SWAP: 
      return state.set('currentSwap', null);
    case ADD_CURRENT_APPROVAL: 
      return state.set('currentApproval', action.approval);
    case DISMISS_APPROVAL: 
      return state.set('currentApproval', null);
    default:
      return state;
  }
}

export default appReducer;
