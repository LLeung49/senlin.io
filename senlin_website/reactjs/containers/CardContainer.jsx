import React from "react"
import Radium from "radium"
import { connect } from "react-redux"

import * as counterActions from "../actions/counterActions"


const styles = {
  cardBottomBlock: {
      position: 'relative',
  },
  cardButton: {
    bottom: 20,
    position: "absolute",
  }
}

@Radium
export default class CardContainer extends React.Component {
  render() {
      return (
          <div>
            <hr/>
            <div className="container">
                <div className="card"  style={{height: 600, position: 'relative'}}>
                    <div className="card-block">
                        <h1 style={{fontSize: '8vw'}}>Apple</h1>
                        <a>
                            <div className="mask"></div>
                        </a>
                    </div>
                    <hr className="extra-margins"/>
                    <div className="card-block" style={[styles.cardBottomBlock]}>
                        <h4 className="card-title">['æp(ə)l]</h4>
                        <p className="card-text">Click the button below to show the details.</p>
                        <a className="btn btn-outline-warning" style={[styles.cardButton]}>Show details</a>
                    </div>
                </div>
            </div>
            <hr/>


          </div>
      )
  }
}