import React from "react"
import "@styles/styles.scss"

interface IndexStates {
  showBurger: boolean
  expandBanner: "tws-expanded" | "ddn-expanded" | "none"
}

export default class IndexPage extends React.Component<{}, IndexStates> {
  constructor(props) {
    super(props)
    this.state = {
      showBurger: false,
      expandBanner: "none",
    }
  }

  public render() {
    const burgerActive = this.state.showBurger ? "is-active" : ""
    const bannerExpand = this.state.expandBanner
    const toggleBurger = () =>
      this.setState({ showBurger: !this.state.showBurger })
    const toggleTws = () =>
      this.setState({
        expandBanner:
          this.state.expandBanner == "none" ? "tws-expanded" : "none",
      })
    const toggleDdn = () =>
      this.setState({
        expandBanner:
          this.state.expandBanner == "none" ? "ddn-expanded" : "none",
      })
    return (
      <div id="app">
        <div
          className="navbar is-primary"
          role="navigation"
          aria-label="main navigation"
        >
          <div className="navbar-brand">
            <a className="navbar-item" href="https://teeworlds.cn">
              <img src="/logo.png" />
            </a>
            {/* mobile burger button */}
            <div
              role="button"
              className={`navbar-burger burger ${burgerActive}`}
              aria-label="menu"
              aria-expanded="false"
              data-target="NavbarMain"
              onClick={toggleBurger}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </div>
          </div>

          <div id="NavbarMain" className={`navbar-menu ${burgerActive}`}>
            <div className="navbar-start">
              <a className="navbar-item" onClick={toggleTws}>
                百科
              </a>
              <a className="navbar-item" onClick={toggleDdn}>
                数据查询
              </a>
              <a className="navbar-item">DDNet排行</a>
            </div>
          </div>
        </div>
        <div className="banner-container">
          <div
            className={`has-background-teeworlds banner-left ${bannerExpand}`}
          >
            <div className="tws-logo" />
            <h1 className="title">快节奏横版射击对战</h1>
          </div>
          <div className={`has-background-ddnet banner-right ${bannerExpand}`}>
            <div className="ddn-logo" />
            <h1 className="title has-text-light">多人合作闯关模式</h1>
          </div>
        </div>
      </div>
    )
  }
}
