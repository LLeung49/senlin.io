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



const styles = {
  scroll_table:{
      overflow:'scroll',
      height:'600px',
  }
}



@connect(state => ({
    github: state.github,
}))

@Radium
export default class CardContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {

        };

    };

    componentDidMount() {
        console.log('Component DID MOUNT!')
        let {dispatch, github} = this.props
        if (!github.isLoadingRepos && github.repos === undefined) {
            dispatch(githubActions.fetchRepos(this.props.user_name, 0))
            console.log('Fetching words.....')
        }

    }


    renderLoading() {
        console.log('Rendering loading....')
      return (
        <div>
            <hr/>
            <div className="container">
                <div className="card z-depth-2"  style={{height: 600, position: 'relative'}}>
                    <div className="card-block text-center">
                        {/*<h1 style={{fontSize: '120px'}}>Welcome</h1>*/}
                        <a>
                            <div className="mask"></div>
                        </a>
                    </div>
                    <div className="card-block text-center">
                        {/*<h1><div className="loader"></div></h1>*/}
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


    eachRow(text,i) {
                return (
                    <tr key={i}>
                        <th scope="row">{i+1}</th>
                        <td >{text.Front}</td>
                        <td>{text.Pronunciation}</td>
                        <td style={{width:'70%'}}>{text.Back}</td>
                        <td>{text.LastViewed}</td>
                    </tr>


                )


    }

    render(){
        let {github} = this.props
        if (github.isLoadingRepos || github.repos === undefined) {
          return this.renderLoading()
        }
        console.log(github.repos.words,github.repos.words.length)
        var list = []
        for(var i=0;i<github.repos.words.length;i++){
            // console.log(github.repos.words[i])
            list.push(github.repos.words[i])
        }
        console.log(list)

        return (<div>
                    <table className="table table-sm table-hover table-striped table-bordered">

                        <tbody>
                        <tr>
                            <td colSpan="5">
                                <div className="scrolltable" style={[styles.scroll_table]} >
                                    <table>
                                        <tbody>
                                            {github.repos.words.map(this.eachRow)}
                                        </tbody>
                                    </table>

                                </div>
                            </td>
                        </tr>

                        </tbody>

                    </table>



                        </div>)





    }










}