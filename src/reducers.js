import { combineReducers } from 'redux'

const menuInitialState = {
  opened: false
}

export const menu = (state = menuInitialState, action) => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return Object.assign({}, state, {
        opened: !state.opened ? true : false
      })
    case 'CLOSE_MENU':
      return false
    case 'OPEN_MENU':
      return true
    default:
      return state
  }
}


export default combineReducers({
  menu
})
