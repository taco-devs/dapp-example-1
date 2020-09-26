/*
 *
 * InvestPage reducer
 *
 */
import { fromJS } from 'immutable';
import { DEFAULT_ACTION,
  GET_BALANCES_REQUEST, GET_BALANCES_SUCCESS, GET_BALANCES_ERROR,
  GET_ETH_PRICE
} from './constants';

export const initialState = fromJS({
  balances: null,
  eth_price: null,
});


function statsReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION: 
      return state;
    case GET_BALANCES_REQUEST: 
      return state;
    case GET_BALANCES_SUCCESS: 
      return state.set('balances', action.balances);
    case GET_BALANCES_ERROR: 
      return state;
    case GET_ETH_PRICE: 
      return state.set('eth_price', action.eth_price);
    default:
      return state;
  }
}

export default statsReducer;
