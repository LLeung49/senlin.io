import * as sampleActions from "../actions/counterActions"

const initialState = {
  clicks: 0,
}

export default function counters(state=initialState, action={}) {
  switch (action.type) {
  case sampleActions.INCREASE:
    if ((state.clicks + 1) >= action.payload){
      return {...state, clicks: 0}
    }
    else{
      return {...state, clicks: state.clicks + 1}
    }
  case sampleActions.DECREASE:
      return {...state, clicks: state.clicks - 1}
  default:
    return state
  }
}