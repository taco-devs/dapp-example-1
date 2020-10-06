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

export const initialState = fromJS({
  network: 'eth',
  currentSwap: null,
});


function appReducer(state = initialState, action) {
  switch (action.type) {
    case SETUP_NETWORK: 
      return state.set('network', action.network);
    case ADD_CURRENT_SWAP: 
      return state.set('currentSwap', action.swap);
    case DISMISS_SWAP: 
      return state.set('currentSwap', null);
    default:
      return state;
  }
}

export default appReducer;
