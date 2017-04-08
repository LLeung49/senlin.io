import React from "react"
import { render } from "react-dom"
import {
  createStore,
  compose,
  applyMiddleware,
  combineReducers,
} from "redux"
import { Provider } from "react-redux"
import thunk from "redux-thunk"

import * as reducers from "./reducers"

import NavBarContainer from "./containers/NavBarContainer"
import FooterContainer from "./containers/FooterContainer"
import CardContainer from "./containers/CardContainer"
import App1Container from "./containers/App1Container"

let finalCreateStore = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)
let reducer = combineReducers(reducers)
let store = finalCreateStore(reducer)

class Senlin extends React.Component {


  render() {
    return (
        <div>
            <NavBarContainer />
            <Provider store={store}>
                <CardContainer />
            </Provider>
            <FooterContainer />
        {/*<Provider store={store}>*/}

            {/*<App1Container />*/}
        {/*</Provider>*/}
            </div>
    )
  }
}

render(<Senlin/>, document.getElementById('Senlin'))