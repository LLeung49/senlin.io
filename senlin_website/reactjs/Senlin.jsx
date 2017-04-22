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
import TableContainer from "./containers/TableContainer"

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
            showLearnedWords: false,
        };
        this.set_showLearnedWords=this.set_showLearnedWords.bind(this);

    };
    set_showLearnedWords(){
        this.setState({showLearnedWords:true})
        console.log('Show Learned Words!!!')
    }


  render() {
        console.log(this.props.user_name, this.props.numOfWords)
      if(this.state.showLearnedWords){
          return (
              <div>
                <NavBarContainer user_name={this.props.user_name}/>
                <Provider store={store}>
                    <TableContainer user_name={this.props.user_name} numOfWords={this.props.numOfWords}/>
                </Provider>
                <FooterContainer />
            </div>
          )
      }
      else if(this.props.numOfWords == 0 ){
          return (
            <div>
                <NavBarContainer  user_name={this.props.user_name}/>
                    <ProfileCardContainer numOfLearned={this.props.numOfLearned}
                                          totalNumOfWords={this.props.totalNumOfWords}
                                          user_name={this.props.user_name}
                                          numOfReview={this.props.numOfReview}
                                          set_showLearned={this.set_showLearnedWords}
                    />
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

render(<Senlin user_name={user_name} numOfReview={numOfReview} numOfLearned={numOfLearned} totalNumOfWords={totalNumOfWords} numOfWords={numOfWords}/>, document.getElementById('Senlin'))