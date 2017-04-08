import React from "react"
import Radium from "radium"
import { connect } from "react-redux"
import * as githubActions from "../actions/githubActions"
import GithubRepos from "../components/GithubRepos"

import * as counterActions from "../actions/counterActions"


const styles = {
  cardBottomBlock: {
      // position: 'relative',
  },
  cardButton: {
    // bottom: 20,
    // position: "absolute",
  }
}

@connect(state => ({
    counters: state.counters,
    github: state.github,
}))

@Radium
export default class CardContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
          details: false,
        };
        this.showDetails=this.showDetails.bind(this);
  };
    showDetails(){
        this.setState({details: true})
    }
    nextCard(){
        this.setState({details: false})
    }

    componentDidMount() {
      let {dispatch, github} = this.props
      if (!github.isLoadingRepos && github.repos === undefined) {
        dispatch(githubActions.fetchRepos())
      }
    }

    handleClick() {
        let {dispatch} = this.props;
        dispatch(counterActions.increaseCounter())
        this.nextCard()
    }

    renderLoading() {
      return (
        <div>
            <hr/>
            <div className="container">
                <div className="card"  style={{height: 600, position: 'relative'}}>
                    <div className="card-block text-center">
                        <h1 style={{fontSize: '120px'}}>请稍等</h1>
                        <a>
                            <div className="mask"></div>
                        </a>
                    </div>
                    <hr className="extra-margins"/>
                    <div className="card-block text-center" style={[styles.cardBottomBlock]}>
                        <h4 className="card-title" style={{fontSize: '30px'}}>拼命加载中...</h4>
                        <p className="card-text" style={{fontSize: '20px'}}></p>
                    </div>
                </div>
            </div>
            <hr/>


          </div>
      )
    }


    renderWord() {
        let {counters, github} = this.props
      if (github.isLoadingRepos || github.repos === undefined) {
        return this.renderLoading()
      }
      return (
          <div>
            <hr/>
            <div className="container">
                <div className="card"  style={{height: 600, position: 'relative'}}>
                    <div className="card-block text-center">
                        <h1 style={{fontSize: '120px'}}>{github.repos[counters.clicks].Front}</h1>
                        <a>
                            <div className="mask"></div>
                        </a>
                    </div>
                    <hr className="extra-margins"/>
                    <div className="card-block text-center" style={[styles.cardBottomBlock]}>
                        <h4 className="card-title" style={{fontSize: '30px'}}>/{github.repos[counters.clicks].Pronunciation}/</h4>
                        <p className="card-text" style={{fontSize: '20px'}}></p>
                        <a className="btn btn-warning btn-lg waves-effect waves-light" style={[styles.cardButton]}onClick={this.showDetails}>Show Details</a>
                    </div>
                </div>
            </div>
            <hr/>


          </div>
      )


    }



  renderDetails() {
      let {counters, github} = this.props
      if (github.isLoadingRepos || github.repos === undefined) {
        return this.renderLoading()
      }
      return (
          <div>
            <hr/>
            <div className="container">
                <div className="card"  style={{height: 600, position: 'relative'}}>
                    <div className="card-block text-center">
                        <h1 style={{fontSize: '120px'}}>{github.repos[counters.clicks].Front}</h1>
                        <a>
                            <div className="mask"></div>
                        </a>
                    </div>
                    <hr className="extra-margins"/>
                    <div className="card-block text-center" style={[styles.cardBottomBlock]}>
                        <h4 className="card-title" style={{fontSize: '30px'}}>/{github.repos[counters.clicks].Pronunciation}/</h4>
                        <p className="card-text" style={{fontSize: '20px'}}>{github.repos[counters.clicks].Back}</p>
                        <button className="btn btn-default btn-lg waves-effect waves-light" style={[styles.cardButton]} onClick={() => this.handleClick()}>Correct</button>
                        <button className="btn btn-danger btn-lg waves-effect waves-light" style={[styles.cardButton]} onClick={() => this.handleClick()}>Wrong</button>
                    </div>
                </div>
            </div>
            <hr/>


          </div>
      )
  }
  render () {
        if (this.state.details){
            return this.renderDetails();
        }else{
            return this.renderWord();

        }

  }

}