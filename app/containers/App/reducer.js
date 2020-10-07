/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import { fromJS } from 'immutable';
import { SETUP_NETWORK, ADD_CURRENT_SWAP, DISMISS_SWAP } from './constants';

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

export const initialState = fromJS({
  network: 'eth',
  currentSwap: null,
});


function appReducer(state = initialState, action) {
  switch (action.type) {
    case SETUP_NETWORK: 
      return state.set('network', action.network)//.set('currentSwap', dummyswap);
    case ADD_CURRENT_SWAP: 
      return state.set('currentSwap', action.swap);
    case DISMISS_SWAP: 
      return state.set('currentSwap', null);
    default:
      return state;
  }
}

export default appReducer;
