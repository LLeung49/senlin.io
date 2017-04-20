import React from "react"
import image from '../../senlin/static/img/senlin1.png'
import male from '../../senlin/static/img/male.png'
import Headline from "../components/Headline"
import Radium from "radium"

const styles = {
  chip: {
    display: 'inline-block',
    padding: '0 25px',
    height: '50px',
    fontSize: '16px',
    lineHeight: '50px',
    borderRadius: '25px',
    backgroundColor: '#aa66cc',
      fontWeight:400
    },

    chipimg :{
        float: 'left',
        margin: '0 10px 0 -25px',
        height: '50px',
        width: '50px',
        borderRadius: '50%',
    },

    button :{
        backgroundColor:'#44c767',
        MozBorderRadius:'28px',
        WebkitBorderRadius:'28px',
        borderRadius:'28px',
        border:'1px solid #18ab29',
        display:'inline-block',
        cursor:'pointer',
        color:'#ffffff',
        fontFamily:'Arial',
        fontSize:'17px',
        padding:'16px 31px',
        textDecoration:'none',
        textShadow:'0px 1px 0px #2f6627',
        ":hover":{backgroundColor:'#5cbf2a'},
        ":active":{position:'relative',
                    top:'1px',}
    },


}


@Radium
export default class NavBarContainer extends React.Component {
  render() {
    return (

<div>
        <nav className="navbar navbar-toggleable-md navbar-dark warning-color bg-primary">
            <div className="container">
                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav1" aria-controls="navbarNav1" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand" href="#">
                     <img src={image} height={50} />
                </a>
                {/*<div className="collapse navbar-collapse" id="navbarNav1">*/}
                    {/*<ul className="navbar-nav mr-auto">*/}
                        {/*<li className="nav-item active">*/}
                            {/*/!*<a className="nav-link">Home<span className="sr-only">(current)</span></a>*!/*/}
                        {/*</li>*/}


                    {/*</ul>*/}
                    {/*/!*<form className="form-inline waves-effect waves-light">*!/*/}
                        {/*/!*<i className="fa fa-search" aria-hidden="true"></i>*!/*/}
                        {/*/!*<input className="form-control" type="text" placeholder="Search"/>*!/*/}
                    {/*/!*</form>*!/*/}
                    {/*<ul className="nav navbar-nav navbar-right">*/}
                        {/*<li><p className="navbar-text"><span className="label label-primary"><span className="glyphicon glyphicon-user"></span> {this.props.user_name}</span></p></li>*/}
                        {/*<li className="">*/}
                            {/*<a href="senlin/register">*/}
                                {/*<span className="glyphicon glyphicon-off" aria-hidden="true"></span>&nbsp;Logout*/}
                            {/*</a>*/}
                        {/*</li>*/}
                    {/*</ul>*/}
                {/*</div>*/}

                <div className="collapse navbar-collapse" id="navbarNav1">

                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item dropdown btn-group">
                                    <a className="nav-link dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <div className="chip" style={[styles.chip]}>
                                          <img src={male}  alt="Person" style={[styles.chipimg]}/>
                                            {this.props.user_name}
                                        </div>
                                    </a>
                                    <div className="dropdown-menu dropdown" aria-labelledby="dropdownMenu1">
                                        <a className="dropdown-item" href="http://localhost:8000/senlin/register">登出</a>
                                    </div>
                                </li>

                            </ul>
                            {/*<ul class="nav navbar-nav navbar-right">*/}
                                {/*<li>*/}
                                    {/*<a href="http://localhost:8000/senlin/register" className="button button-border-caution button-pill" style={{fontWeight:700}}>logout</a>*/}
                                {/*</li>*/}
                            {/*</ul>*/}



                </div>





            </div>
        </nav>

    </div>


    )
  }
}