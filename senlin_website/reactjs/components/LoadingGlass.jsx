import React from "react"

export default class LoadingGlass extends React.Component{
    // 定义属性
    static propTypes={

        onStep:React.PropTypes.func,
        nextCard:React.PropTypes.func,
        onComplete:React.PropTypes.func,
        value:React.PropTypes.number,
        step:React.PropTypes.number
    }


    //这里面的操作可以移动到componentWillMount()里面去
    constructor(...pa) {
        super(...pa);
        this.initValue = this.props.value || 0;
        this.state     = {count: this.initValue}
        this.interval  = 0;
        this.step      = this.props.step || 1;


    }

    stop() {
        clearInterval(this.interval);

    }

    start() {
        this.stop();
        this.interval = setInterval(()=> {
            var count = this.state.count + this.step;
            if (this.props.onStep) {
                this.props.onStep(count);
            }
            if (count < 0) {
                this.props.onComplete && this.props.onComplete();
                this.stop();
            }else{
                this.setState({count});
            }

        }, 1000);
    }

    restart() {
        this.stop();
        this.setState({count: this.initValue});
        this.start();
    }
    componentDidMount(){
        this.start();
    }
    componentWillUnmount(){
        this.stop();
    }

    render() {
        // return (<h2><span className="label label-danger">Time remaining: {this.state.count}</span></h2>)
        if(this.state.count%3 == 0){
            return(<h1><i className="fa fa-hourglass-1" aria-hidden="true"></i></h1>)
        }
        else if(this.state.count%3 == 1){
            return(<h1><i className="fa fa-hourglass-2" aria-hidden="true"></i></h1>)
        }
        else{
            return(<h1><i className="fa fa-hourglass-3" aria-hidden="true"></i></h1>)
        }


    }
}
