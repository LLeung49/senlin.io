import React from "react"

export default class Headline extends React.Component {
  render() {
    return (
        <div>
          {/*<h1>{ this.props.children }</h1>*/}
          <div className="flex-center flex-column animated fadeIn">
            <h1 className="mb-1">Material Design for Bootstrap</h1>

            <a target="_blank" href="https://mdbootstrap.com/mdb-quick-start/" className="btn btn-primary mb-2">5 min quick start with MDB</a>

            <h5 className="mb-1">Thank you for using our product. We're glad you're with us.</h5>

            <p className="text-muted">MDB Team</p>


        </div>
        </div>

    )
  }
}
