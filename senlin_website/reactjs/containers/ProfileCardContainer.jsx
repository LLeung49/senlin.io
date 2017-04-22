import React from "react"
import Radium from "radium"
import male from '../../senlin/static/img/male.png'
import alpha from '../../senlin/static/img/flat-ebook-icon.png'
import brain from '../../senlin/static/img/brain.png'
const styles = {
  chip_user: {
    display: 'inline-block',
    padding: '0 25px',
    height: '50px',
    fontSize: '16px',
    lineHeight: '50px',
    borderRadius: '25px',
      fontWeight:400,
      color: 'white',
      backgroundColor: '#198027',
    },
    chip_info: {
    display: 'inline-block',
    padding: '0 25px',
    height: '50px',
    fontSize: '16px',
    lineHeight: '50px',
    borderRadius: '25px',
      fontWeight:400,
      color: 'white',
      backgroundColor: '#198027',
    },
    chip_start: {
    display: 'inline-block',
    padding: '0 25px',
    height: '50px',
    fontSize: '16px',
    lineHeight: '50px',
    borderRadius: '25px',
      fontWeight:400,
      color: 'white',
      backgroundColor: '#198027',
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
export default class CardContainer extends React.Component {
    // checkValidity(){
    //     console.log('you enter: '+ this.refs.numOfWords.value)
    // }

    static propTypes={

        set_showLearned:React.PropTypes.func,
    }

    constructor(props, context) {
        super(props, context);



    };
    show_learned(){
        this.props.set_showLearned(this)
    }


    render () {
        return (
            <div>
            <hr/>
                <div className="container" style={{height: 600, display: 'table'}}>

                    <div className="row" style={{display: 'table-cell',verticalAlign: 'middle',textAlign:'center'}}>
                        <div className="col-md-4" style={{display:'inline-block', float:'none', textAlign:'left', marginRight:'-4px'}}>
                            <div className="card z-depth-1"  style={{borderRadius:'25px',height:300}}>
                                <div className="chip" style={[styles.chip_user]}>
                                      <img src={male}  alt="Person" style={[styles.chipimg]}/>
                                        {this.props.user_name}
                                </div>
                                <div className="card-block ">
                                    <a>
                                        <div className="mask"></div>
                                    </a>
                                </div>
                                <div className="card-block text-center">
                                    <h4 className="card-title" style={{fontSize: '30px'}}>所有单词: {this.props.totalNumOfWords}</h4>
                                    <h4 className="card-title" style={{fontSize: '30px'}}>已学单词: {this.props.numOfLearned}</h4>
                                    <h4 className="card-title" style={{fontSize: '30px'}}>需要复习: {this.props.numOfReview}</h4>
                                    {/*<a href="#" className="button button-rounded button-flat"><i className="fa fa-edit"></i> 编辑</a>*/}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4" style={{display:'inline-block', float:'none', textAlign:'left', marginRight:'-4px'}}>
                            <div className="card z-depth-1"  style={{borderRadius:'25px',height:300}}>
                                <div className="chip" style={[styles.chip_info]}>
                                      <img src={alpha}  alt="Person" style={[styles.chipimg]}/>
                                        词汇表
                                </div>
                                <div className="card-block ">
                                    <a>
                                        <div className="mask"></div>
                                    </a>
                                </div>
                                <div className="card-block text-center">
                                    <h4 className="card-title" style={{fontSize: '30px'}}>/put user's tags here/</h4>
                                        <button onClick={this.props.set_showLearned} name="showLearnedButton" className="button button-rounded button-flat-action"><i className="fa fa-map-o"></i> 查看已学单词</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4" style={{display:'inline-block', float:'none', textAlign:'left', marginRight:'-4px'}}>
                            <div className="card z-depth-1"  style={{borderRadius:'25px',height:300}}>
                                <div className="chip" style={[styles.chip_start]}>
                                      <img src={brain}  alt="Person" style={[styles.chipimg]}/>
                                        背单词
                                </div>
                                <div className="card-block ">
                                    <a>
                                        <div className="mask"></div>
                                    </a>
                                </div>
                                <div className="card-block text-center">
                                    <h4 className="card-title" style={{fontSize: '30px'}}></h4>

                                        <div className="md-form">
                                            <form action="">
                                            <input name="numOfWords" defaultValue='50' type="number" min="10" max="100"
                                            id="form6" className="form-control" required/>
                                            <label className="active">how many words? (between 10 and 100)</label>
                                            <button type="submit"  className="button button-rounded button-flat-action"><i className="fa fa-hand-pointer-o"></i> 开始学习</button>
                                                </form>
                                        </div>


                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            <hr/>
            </div>
        )
    }

}