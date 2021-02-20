import React,{ Component } from 'react'
import { Provider } from 'mobx-react'
import { storeName } from "./store/store";
import "./app.scss";

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 就是要渲染的页面
  render() {
    return <Provider store={storeName}>{this.props.children}</Provider>;
  }
}

export default App

