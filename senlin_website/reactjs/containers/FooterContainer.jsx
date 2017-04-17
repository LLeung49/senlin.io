import React from "react"
import image from '../../senlin/static/img/senlinlogo.png'


export default class FooterContainer extends React.Component {
  render() {
      return (
          <div>
              <footer className="page-footer warning-color-dark center-on-small-only">

                <div className="container">
                    <div className="row">

                        <div className="col-md-6">
                            <h5 className="title">Footer Content</h5>
                            <p>Here you can use rows and columns here to organize your footer content.</p>
                        </div>

                        <div className="col-md-6">
                            <h5 className="title">Links</h5>
                            <ul>
                                <li><a href="#!">Link 1</a></li>
                                <li><a href="#!">Link 2</a></li>
                                <li><a href="#!">Link 3</a></li>
                                <li><a href="#!">Link 4</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-copyright">
                    <div className="container-fluid">
                        © 2017 Copyright: <a href="https://Senlin.io"> <img src={image} height={25}  mode='fit'/> Senlin.io </a>

                    </div>
                </div>
              </footer>
          </div>
      )
  }
}