import React from 'react'
import { Link } from 'gatsby'
import Menu from './Menu'
import HackerBackground from './HackerBackground'
import { siteName, socialMedia } from '../settings'

// 页脚样式
let footerStyle = {
  marginBottom: '1rem',
}

// 布局容器样式
const layoutContainerStyle = {
  minHeight: '100vh', // 确保容器至少占满整个视口高度
  display: 'flex',
  flexDirection: 'column',
}

// 主内容区域样式
const mainContentStyle = {
  flexGrow: 1, // 让主内容区域自动填充剩余空间
  width: '100%',
}

// 布局组件，用于管理网站的整体布局
class Layout extends React.Component {
  // 组件状态，包含菜单状态、搜索关键词、动画、年份、天数、主题和logo等
  state = {
    menuState: false, // false表示关闭，true表示打开
    keyword: '',
    animation: [],
    year: '',
    days: '',
    theme: '',
    logo: '/funny-eagle-light.jpg'
  }
  
  // 组件挂载后执行的生命周期方法
  componentDidMount() {
    // 直接设置为dark主题，不再支持切换
    this.setTheme('dark');
    
    this.setState({
      theme: 'dark',
      year: new Date().getFullYear(),
      logo: "/funny-eagle-light.jpg",
    });
  }
  
  // 设置主题（只保留dark主题设置）
  setTheme = (themeName) => {
    localStorage.setItem('theme', 'dark'); // 强制使用dark主题
    document.documentElement.className = 'dark-theme';
    this.setState({
      theme: 'dark',
    });
  }
  
  // 切换菜单状态
  toggleMenuState = () => {
    this.setState({
      menuState: !this.state.menuState,
    })
  }
  
  // 处理搜索关键词变化
  change = (e) => {
    this.setState({
      keyword: e.target.value,
    })
  }
  
  // 执行搜索
  search = () => {
    window.open(
      'https://cn.bing.com/search?q=site%3Ayangjinlong86.github.io%20' +
        this.state.keyword
    )
  }
  
  // 格式化时间
  formatTime = (msTime) => {
    const time = msTime / 1000
    const day = Math.floor(time / 60 / 60 / 24)
    return ` ${day} 天`
  }
  
  // 处理回车键事件
  handleEnter = (e) => {
    if (e.keyCode === 13) {
      this.search()
    }
  }
  
  render() {
    const { menuState, days, year, theme , logo} = this.state
    const { pageName, pageDescript, children, aside, className } = this.props

    // 网站名称组件
    const websiteName = (
      <div>
        <Link
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            fontWeight: 200,
          }}
          className="funnyeagle"
          to={'/'}
        >
          <span className="logo-mobile">{siteName}</span>
        </Link>
        
        {pageName ? (
          <div className="page-name">
            {'#' + pageName}
          </div>
        ) : null}
      </div>
    )
    
    // 页面描述组件
    const descript = <div className="page-description">{pageDescript}</div>
    
    return (
      <div className={className} style={layoutContainerStyle}>
        <HackerBackground />
        <div className="css-main" style={mainContentStyle}>
          {/* 侧边栏 */}
          <aside className={'css-aside ' + (menuState ? 'open' : 'close')}>
            <header className="css-header">
              {websiteName}
              <div className="menu-button" onClick={this.toggleMenuState}>
                <i
                  className={
                    'iconfont icon-' + (menuState ? 'close' : 'menu')
                  }
                />
              </div>
            </header>
            {aside ? (
              <div
                className="css-toc"
                onClick={this.toggleMenuState}
                dangerouslySetInnerHTML={{
                  __html: aside,
                }}
              />
            ) : (
              <React.Fragment>
                <Menu direction="column" />
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <input
                    placeholder="关键字，然后 Enter"
                    onChange={this.change}
                    onKeyUp={this.handleEnter}
                  />
                </div>
              </React.Fragment>
            )}
          </aside>
          {/* 主内容区域 */}
          <article className="css-post">{children}</article>
        </div>
        {/* 页脚 */}
        <footer>
          <div className="social-media" style={footerStyle}>
            {socialMedia.map((item) => (
              <a key={item.icon} target="_blank" href={item.href}>
                <i className={'iconfont icon-' + item.icon}></i>
              </a>
            ))}
          </div>
          <div style={footerStyle}>
            
            © <span className="year">{year}</span> yangjinlong86.github.io {' '}
            • Powered by{' '}
            <a
              className="funnyeagle"
              target="_blank"
              href="https://www.gatsbyjs.org/"
            >
              Gatsbyjs
            </a>
            
          </div>
        </footer>
      </div>
    )
  }
}

export default Layout
