/*
 *
 * InvestPage reducer
 *
 */
import { fromJS } from 'immutable';
import { DEFAULT_ACTION, CHANGE_PAGE, SEARCH } from './constants';

export const initialState = fromJS({
  pagination: 0,
  search: null
});


function investReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE:
      return state.set('pagination', action.pagination);
    case SEARCH: 
      return state.set('search', action.search);
    default:
      return state;
  }
}

export default investReducer;
