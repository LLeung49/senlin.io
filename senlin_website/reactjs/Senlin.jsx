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
import ProfileCardContainer from "./containers/ProfileCardContainer"
import CardContainer from "./containers/CardContainer"

import App1Container from "./containers/App1Container"

let finalCreateStore = compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)
let reducer = combineReducers(reducers)
let store = finalCreateStore(reducer)

class Senlin extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {

        };

    };



  render() {
        console.log(this.props.user_name, this.props.numOfWords)
      if(this.props.numOfWords == 0 ){
          return (
            <div>
                <NavBarContainer  user_name={this.props.user_name}/>
                    <ProfileCardContainer user_name={this.props.user_name} />
                <FooterContainer />
            {/*<Provider store={store}>*/}

                {/*<App1Container />*/}
            {/*</Provider>*/}
                </div>
        )
      }
      else{
          return (
            <div>
                <NavBarContainer user_name={this.props.user_name}/>
                <Provider store={store}>
                    <CardContainer user_name={this.props.user_name} numOfWords={this.props.numOfWords}/>
                </Provider>
                <FooterContainer />
            {/*<Provider store={store}>*/}

                {/*<App1Container />*/}
            {/*</Provider>*/}
            </div>
        )
      }

  }
}

render(<Senlin user_name={user_name} numOfWords={numOfWords}/>, document.getElementById('Senlin'))