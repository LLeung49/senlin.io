import React from "react"
import image from '../../senlin/static/img/senlin1.png'
import Headline from "../components/Headline"

export default class NavBarContainer extends React.Component {
  render() {
    return (


        <nav className="navbar navbar-toggleable-md navbar-dark warning-color bg-primary">
            <div className="container">
                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#collapseEx2" aria-controls="collapseEx2" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand" href="#">
                     <img src={image} height={50}  mode='fit'/>
                </a>
                <div className="collapse navbar-collapse" id="collapseEx2">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            {/*<a className="nav-link">Home <span className="sr-only">(current)</span></a>*/}
                        </li>


                    </ul>
                    <form className="form-inline waves-effect waves-light">
                        <input className="form-control" type="text" placeholder="Search"/>
                    </form>
                </div>
            </div>
        </nav>




      // {/*<div className="container">*/}
      //   {/*<div className="row">*/}
      //     {/*<div className="col-sm-12">*/}
      //       {/*<Headline>Senlin</Headline>*/}
      //     {/*</div>*/}
      //   {/*</div>*/}
      // {/*</div>*/}
    )
  }
}