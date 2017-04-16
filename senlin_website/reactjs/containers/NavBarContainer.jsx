import React from "react"
import image from '../../senlin/static/img/senlin1.png'
import Headline from "../components/Headline"

export default class NavBarContainer extends React.Component {
  render() {
    return (


        <nav className="navbar navbar-toggleable-md navbar-dark warning-color bg-primary">
            <div className="container">
                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav1" aria-controls="navbarNav1" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand" href="#">
                     <img src={image} height={50}  mode='fit'/>
                </a>
                <div className="collapse navbar-collapse" id="navbarNav1">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            {/*<a className="nav-link">Home<span className="sr-only">(current)</span></a>*/}
                        </li>


                    </ul>
                    <form className="form-inline waves-effect waves-light">
                        <i className="fa fa-search" aria-hidden="true"></i>
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