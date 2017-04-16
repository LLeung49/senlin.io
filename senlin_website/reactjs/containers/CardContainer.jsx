import React from "react"
import Radium from "radium"
import { connect } from "react-redux"
import * as githubActions from "../actions/githubActions"
import GithubRepos from "../components/GithubRepos"
import CountdownTimer from "../components/CountdownTimer"
import LoadingGlass from "../components/LoadingGlass"
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
  outer: {

  },
  inner: {

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
            timeSpend: 10,
            start: false,
        };
        this.showDetails=this.showDetails.bind(this);
        this.startLearning=this.startLearning.bind(this);
    };

    componentDidMount() {
        // after page loaded
        console.log('Component DID MOUNT!')
        let {dispatch, github} = this.props
        if (!github.isLoadingRepos && github.repos === undefined) {
            dispatch(githubActions.fetchRepos())
            console.log('Fetching words.....')
        }

    }
    componentWillMount() {
        console.log('Component WILL MOUNT!')

    }



    reload(){
        window.location.reload()
    }
    showDetails(){
        this.setState({details: true})
    }
    nextCard(){
        this.setState({details: false})
    }

    setTimeSpend(countValue){
        this.setState({timeSpend: countValue})
    }
    startLearning(){
        this.setState({start: true})
    }
    ajax_sync_memory(data,time){
        // console.log(data)
        // console.log(time)
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
                  return senlin_async_db.getItem(time);
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
                  return senlin_offline_db.getItem(time);
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

                senlin_async_db.clear().then(function() {
                    // Run this code once the database has been entirely deleted.
                    console.log('Database is now empty.');
                }).catch(function(err) {
                    // This code runs if there were any errors
                    console.log(err);
                });

                senlin_offline_db.clear().then(function() {
                    // Run this code once the database has been entirely deleted.
                    console.log('Database is now empty.');
                }).catch(function(err) {
                    // This code runs if there were any errors
                    console.log(err);
                });

                senlin_words.clear().then(function() {
                    // Run this code once the database has been entirely deleted.
                    console.log('Database is now empty.');
                }).catch(function(err) {
                    // This code runs if there were any errors
                    console.log(err);
                });


            })  ;

    }

    handleCorrect() {
        console.log('Correct clicked!')
        let {counters, github} =  this.props
        var userid = '64b93d2e-138f-45f6-a118-66968cd62b20'
        var time_stamp = (Math.round(new Date()/10))/100
        var time_spend = 10 - this.state.timeSpend


        var data = {
            timeStamp: time_stamp,
            timeSpend: time_spend,
            userId: userid,
            correct: true,
            cardId: github.repos.words[counters.clicks].Card_id,
        }
        var time = String(time_stamp)
        this.ajax_sync_memory(data,time)


        let {dispatch} = this.props;
        dispatch(counterActions.increaseCounter())
        this.nextCard()
    }

    handleWrong(){
        console.log('Wrong clicked!')
        let {counters, github} =  this.props
        var userid = '64b93d2e-138f-45f6-a118-66968cd62b20'
        var time_stamp= (Math.round(new Date()/10))/100
        var time_spend = 10 - this.state.timeSpend
        // console.log(Math.round(new Date()/1000))


        var data = {
            timeStamp: time_stamp,
            timeSpend: time_spend,
            userId: userid,
            correct: false,
            cardId: github.repos.words[counters.clicks].Card_id,
        }

        var time = String(time_stamp)
        this.ajax_sync_memory(data,time)

        let {dispatch} = this.props;
        dispatch(counterActions.increaseCounter())
        this.nextCard()
    }

    renderLoading() {
        console.log('Rendering loading....')
      return (
        <div>
            <hr/>
            <div className="container">
                <div className="card z-depth-2"  style={{height: 600, position: 'relative'}}>
                    <div className="card-block text-center">
                        <h1 style={{fontSize: '120px'}}>Welcome</h1>

                        <a>
                            <div className="mask"></div>
                        </a>
                    </div>
                    <hr className="extra-margins"/>
                    <div className="card-block text-center">
                        <LoadingGlass/>
                        <h4 className="card-title" style={{fontSize: '30px'}}>Loading...</h4>
                        <p className="card-text" style={{fontSize: '20px'}}></p>
                    </div>
                </div>
            </div>
            <hr/>
          </div>

      )
    }

    renderFinish() {
        console.log('Rendering Finish....')
      return (
        <div>
            <hr/>
            <div className="container">
                <div className="card z-depth-2"  style={{height: 600, position: 'relative'}}>
                    <div className="card-block text-center">
                        <h1 style={{fontSize: '120px'}}>Congratulations!</h1>

                        <a>
                            <div className="mask"></div>
                        </a>
                    </div>
                    <hr className="extra-margins"/>
                    <div className="card-block text-center" >
                        <h4 className="card-title" style={{fontSize: '30px'}}><i className="fa fa-trophy" aria-hidden="true"></i>  You finish today's quota.</h4>
                        <a className="btn btn-secondary btn-lg waves-effect waves-light" onClick={() => this.reload()} style={[styles.cardButton]} >Continue   <i className="fa fa-undo" aria-hidden="true"></i></a>

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
        var numOfWords = 0;
        senlin_words.length().then(function(numberOfKeys) {
            // Outputs the length of the database.
            numOfWords =  numberOfKeys;
        }).catch(function(err) {
            // This code runs if there were any errors
            console.log(err);
        });
        // console.log(numOfWords)
      if (github.isLoadingRepos || github.repos === undefined) {
        return this.renderLoading()
      }
      console.log('Rendering word...')

      return (
          <div>
            <hr/>
            <div className="container">
                <div className="card z-depth-2"  style={{height: 600, position: 'relative'}}>
                    <div className="card-block text-center">
                        <h1 style={{fontSize: '120px'}}>{github.repos.words[counters.clicks].Front}</h1>
                        {/*<h1 style={{fontSize: '120px'}}>单词</h1>*/}
                        <a>
                            <div className="mask"></div>
                        </a>
                    </div>
                    <hr className="extra-margins"/>
                    <div className="card-block text-center">
                        <CountdownTimer  secondsRemaining="10" nextCard = {this.showDetails} setTime = {this.setTimeSpend.bind(this)}/>
                        <h4 className="card-title" style={{fontSize: '30px'}}><i className="fa fa-microphone" aria-hidden="true"></i>   {github.repos.words[counters.clicks].Pronunciation}</h4>
                        {/*<h4 className="card-title" style={{fontSize: '30px'}}>/音标/</h4>*/}
                        <p className="card-text" style={{fontSize: '20px'}}></p>
                        <a className="btn btn-warning btn-lg waves-effect waves-light" style={[styles.cardButton]}onClick={this.showDetails}>想起来了   <i className="fa fa-eye" aria-hidden="true"></i></a>
                    </div>
                </div>
            </div>
            <hr/>


          </div>
      )


    }

    renderDetails() {
        console.log('Rendering details.....')
      let {counters, github} = this.props
      if (github.isLoadingRepos || github.repos === undefined) {
          return this.renderLoading()
      }
      return (
          <div>
            <hr/>
            <div className="container">
                <div className="card z-depth-2"  style={{height: 600, position: 'relative'}}>
                    <div className="card-block text-center">
                        <h1 style={{fontSize: '120px'}}>{github.repos.words[counters.clicks].Front}</h1>
                        {/*<h1 style={{fontSize: '120px'}}>单词</h1>*/}
                        <a>
                            <div className="mask"></div>
                        </a>
                    </div>
                    <hr className="extra-margins"/>
                    <div className="card-block text-center">
                        <h4><span className="badge indigo"><i className="fa fa-history" aria-hidden="true"></i>   回想用时 {10 - this.state.timeSpend} 秒.</span></h4>
                        <h4 className="card-title" style={{fontSize: '30px'}}><i className="fa fa-microphone" aria-hidden="true"></i>  {github.repos.words[counters.clicks].Pronunciation}</h4>
                        {/*<h4 className="card-title" style={{fontSize: '30px'}}>/音标/</h4>*/}
                        <p className="card-text" style={{fontSize: '20px'}}>{github.repos.words[counters.clicks].Back}</p>
                        {/*<p className="card-text" style={{fontSize: '20px'}}>释义</p>*/}
                        <button className="btn btn-success btn-lg waves-effect waves-light" style={[styles.cardButton]} onClick={() => this.handleCorrect()}>记对了   <i className="fa fa-smile-o" aria-hidden="true"></i></button>
                        <button className="btn btn-danger btn-lg waves-effect waves-light" style={[styles.cardButton]} onClick={() => this.handleWrong()}>没记对    <i className="fa fa-frown-o" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
            <hr/>


          </div>
      )
    }
    renderHome(){
        console.log('Rendering Home....')
        let {counters, github} = this.props
      if (github.isLoadingRepos || github.repos === undefined) {
        return this.renderLoading()
      }
      return (
        <div>
            <hr/>
            <div className="container">
                <div className="card z-depth-2  text-center align-center"  style={{height: 600, position: 'relative'}}>
                    <div className="card-block text-center">
                        <h1 style={{fontSize: '120px'}}>今日概要</h1>
                        {/*<h1 style={{fontSize: '120px'}}>单词</h1>*/}
                        <a>
                            <div className="mask"></div>
                        </a>
                    </div>
                    <hr className="extra-margins"/>
                    <div className="card-block text-center align-center" style={[styles.inner]} >

                            <h3>今日单词: {github.repos.words.length}</h3>
                            <h3>今日新词: {github.repos.words.length - Number(github.repos.numOfScheduledWords)}</h3>
                            <h3>剩余新词: {github.repos.numOfNewWords}</h3>

                        <a className="btn btn-default btn-lg waves-effect waves-light" style={[styles.cardButton]}onClick={this.startLearning}>开始学习   <i className="fa fa-paper-plane" aria-hidden="true"></i></a>

                    </div>
                </div>
            </div>
            <hr/>
          </div>

      )
    }

    render () {
        let {counters,github} = this.props
        if (github.isLoadingRepos || github.repos === undefined) {
          return this.renderLoading()
        }
        if (counters.clicks >= Number(github.repos.words.length)){
            return this.renderFinish();
        }
        if (!this.state.start){
            return this.renderHome();
        }
        if (this.state.details){
            return this.renderDetails();
        } else{
            return this.renderWord();
        }

    }

}