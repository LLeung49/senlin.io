import React from "react"

export default class CountdownTimer extends React.Component{
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
        this.initValue = this.props.value || 10;
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
            var count = this.state.count - this.step;
            if (this.props.onStep) {
                this.props.onStep(count);
            }
            if (count < 0) {
                this.props.onComplete && this.props.onComplete();
                this.props.setTime(10)
                this.props.nextCard(this);

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
        this.props.setTime(this.state.count)
        this.stop();
    }

    render() {
        // return (<h2><span className="label label-danger">Time remaining: {this.state.count}</span></h2>)
        if(this.state.count > 0 ){
            return(
            <h1><span className="badge red"><i className="fa fa-clock-o" aria-hidden="true"></i>  {this.state.count}</span></h1>
        )
        }
        else{
            return(
                <h1><span className="badge red">Time's up</span></h1>

            )
        }

    }
}

