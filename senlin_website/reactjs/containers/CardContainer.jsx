import React from "react"
import Radium from "radium"
import { connect } from "react-redux"
import * as githubActions from "../actions/githubActions"
import GithubRepos from "../components/GithubRepos"
import CountdownTimer from "../components/CountdownTimer"
import { request } from "../utils"
import * as counterActions from "../actions/counterActions"
// import * as localforage from "localforage"
import * as loacalforage from "localforage"
var localforage = require('../../node_modules/localforage/dist/localforage.js');
var senlin_offline_db = localforage.createInstance({
    name: "senlin_db"
});
var senlin_async_db = localforage.createInstance({
    name: "senlin_async"
});
var senlin_words = localforage.createInstance({
    name: "senlin_words"
});
var senlin_review = localforage.createInstance({
    name: "senlin_review"
});


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
          timeSpend: 20,
        };
        this.showDetails=this.showDetails.bind(this);
  };
    showDetails(){
        this.setState({details: true})
    }
    nextCard(){
        this.setState({details: false})
    }

    setTimeSpend(countValue){
        this.setState({timeSpend: countValue})
    }
    componentDidMount() {
        // after page loaded
        let {dispatch, github} = this.props
        if (!github.isLoadingRepos && github.repos === undefined) {
            dispatch(githubActions.fetchRepos())
        }
    }
    

    ajax_sync_memory(data,time){
         $.ajax({
            type: 'POST',
                url: process.env.BASE_API_URL + 'api/new_memories/',
                data: {
                    data,
                    csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value
                }
            })
            .done(function(data) {
                console.log('---> UPLOAD SUCCESSFULLY')
            })
            .fail(function(jqXhr) {
                console.log('failed to register');
                console.log('---> UPLOAD FAILED.')
                //add to local async storage
                senlin_async_db.setItem(time, {
                    timeSpend: data['time_stamp'],
                    userId: data['userId'],
                    correct: data['correct'],
                    cardId: data['cardId'],
                }).then(function () {
                  return localforage.getItem(time);
                }).catch(function (err) {
                  // we got an error
                });

            })
            .always(function () {
                // add to local memories storage
                senlin_offline_db.setItem(time, {
                    timeSpend: data['time_stamp'],
                    userId: data['userId'],
                    correct: data['correct'],
                    cardId: data['cardId'],
                }).then(function () {
                  return localforage.getItem(time);
                }).catch(function (err) {
                  // we got an error
                });


                senlin_async_db.keys().then(function(Keys) {
                    // Outputs the length of the database.
                    console.log('#Aysnc: ', Keys);
                }).catch(function(err) {
                    // This code runs if there were any errors
                    console.log(err);
                });

                senlin_offline_db.keys().then(function(Keys) {
                    // Outputs the length of the database.
                    console.log('#Offline: ', Keys);
                }).catch(function(err) {
                    // This code runs if there were any errors
                    console.log(err);
                });



            })  ;

    }


    handleCorrect() {
        let {counters, github} =  this.props
        var userid = '64b93d2e-138f-45f6-a118-66968cd62b20'
        var time_stamp = (Math.round(new Date()/10))/100
        var time_spend = 20 - this.state.timeSpend
        // console.log(userid)
        // console.log(github.repos[counters.clicks].Card_id)
        // console.log(time_stamp)
        // console.log(time_spend)

        var data = {
            timeStamp: time_stamp,
            timeSpend: time_spend,
            userId: userid,
            correct: true,
            cardId: github.repos[counters.clicks].Card_id,
        }
        var time = String(time_stamp)
        this.ajax_sync_memory(data,time)


        let {dispatch} = this.props;
        dispatch(counterActions.increaseCounter())
        this.nextCard()
    }

    handleWrong(){
        let {counters, github} =  this.props
        var userid = '64b93d2e-138f-45f6-a118-66968cd62b20'
        var time_stamp= (Math.round(new Date()/10))/100
        var time_spend = 20 - this.state.timeSpend
        // console.log(userid)
        // console.log(github.repos[counters.clicks].Card_id)
        // console.log(time_stamp)
        // console.log(time_spend)

        var data = {
            timeStamp: time_stamp,
            timeSpend: time_spend,
            userId: userid,
            correct: false,
            cardId: github.repos[counters.clicks].Card_id,
        }

        var time = String(time_stamp)
        this.ajax_sync_memory(data,time)

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
                        <CountdownTimer  secondsRemaining="10" nextCard = {this.showDetails} setTime = {this.setTimeSpend.bind(this)}/>
                        <h4 className="card-title" style={{fontSize: '30px'}}>{github.repos[counters.clicks].Pronunciation}</h4>
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
                        <h4><span className="badge indigo">You spend {20 - this.state.timeSpend} seconds.</span></h4>
                        <h4 className="card-title" style={{fontSize: '30px'}}>{github.repos[counters.clicks].Pronunciation}</h4>
                        <p className="card-text" style={{fontSize: '20px'}}>{github.repos[counters.clicks].Back}</p>
                        <button className="btn btn-default btn-lg waves-effect waves-light" style={[styles.cardButton]} onClick={() => this.handleCorrect()}>Correct</button>
                        <button className="btn btn-danger btn-lg waves-effect waves-light" style={[styles.cardButton]} onClick={() => this.handleWrong()}>Wrong</button>
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