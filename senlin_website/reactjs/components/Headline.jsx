import React from "react"

export default class Headline extends React.Component {
  render() {
    return (
        <div>
            <strong>{ this.props.children }</strong>

        </div>

    )
  }
}
