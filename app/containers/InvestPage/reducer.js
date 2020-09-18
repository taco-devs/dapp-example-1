/*
 *
 * InvestPage reducer
 *
 */
import { fromJS } from 'immutable';
import { DEFAULT_ACTION, CHANGE_PAGE } from './constants';

export const initialState = fromJS({
  pagination: 0,
});


function investReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE:
      return state.set('pagination', action.pagination);
    default:
      return state;
  }
}

export default investReducer;
