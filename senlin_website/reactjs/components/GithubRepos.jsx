import React from "react"

export default class GithubRepos extends React.Component {

  render() {
    let repos = this.props.repos
    let clicks = this.props.index


    return (
      <div>{repos[clicks].Front},{clicks}</div>
    )
  }
}