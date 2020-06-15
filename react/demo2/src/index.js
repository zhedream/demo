import React from 'react'
import ReactDom from 'react-dom'

// const hello = React.createElement('h1', null, 'hello world')
const hello = <h1>Hello</h1>; // 

class World extends React.Component {

  constructor(props) {
    super(props)
    this.state = { seconds: 0 }
  }

  render() {
    return <h1 onClick={this.output}>World {this.props.title} {this.state.seconds}</h1>;
  }

  output() {
    // console.log(this.props.title);
    console.log(this);

  }

  tick() {
    this.setState(state => {
      return {
        seconds: state.seconds + 1
      }
    })
  }

  componentDidMount() {
    console.log('挂载后');
    this.interval = setInterval(() => this.tick(), 1000);
    this.output();

  }

  componentWillUnmount() {
    console.log('卸载前');
    clearInterval(this.interval)
  }

}

function App(props) {
  return (
    <div>
      {hello}
      <World title="时间" />
    </div>
  )
}

ReactDom.render(<App />, document.getElementById('root'))