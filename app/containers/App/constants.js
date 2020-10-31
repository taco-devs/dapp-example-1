/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_REPOS = 'boilerplate/App/LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'boilerplate/App/LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'boilerplate/App/LOAD_REPOS_ERROR';

export const SETUP_NETWORK = 'boilerplate/App/SETUP_NETWORK';
export const ADD_CURRENT_SWAP = 'boilerplate/App/ADD_CURRENT_SWAP';
export const DISMISS_SWAP = 'boilerplate/App/DISMISS_SWAP';

export const ADD_CURRENT_APPROVAL = 'boilerplate/App/ADD_CURRENT_APPROVAL';
export const DISMISS_APPROVAL = 'boilerplate/App/DISMISS_APPROVAL';

export const TOGGLE_HIDE_BALANCES = 'boilerplate/App/DISMISS_APPROVAL';
export const TOGGLE_ADD_GRO = 'boilerplate/App/TOGGLE_ADD_GRO';