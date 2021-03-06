import React, { Component } from 'react'
import { request } from '../../lib'
import Layout from '../../layouts/default'
import {
  Menu
} from 'antd'
import Content from './content'

export default class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false,
      selectedKey: '0',
      years: ['所有年份','2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'],
      type: this.props.match.params.type,
      year: this.props.match.params.year,
      movies: []
    }
    this._getSelectedTypeMovies = this._getSelectedTypeMovies.bind(this)
  }

  componentDidMount () {
    this._getAllMovies()
  }

  _toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  _selectedItem = ({ key }) => {
    this.setState({
      selectedKey: key
    }, this._getSingleMovie)
  }

  _getSelectedYearsMovies(items)  {
    let yearIndex = items.key
    if(yearIndex == 0) yearIndex = ''
    request({
      method: 'get',
      url: `/api/v0/movies?type=${this.state.type || ''}&year=${this.state.years[yearIndex] || ''}`
    }).then(res => {
      this.setState({
        movies: res,
        year:this.state.years[yearIndex] || ''
      })
    }).catch(() => {
      this.setState({
        movies: [],
        year:this.state.years[yearIndex] || ''
      })
    })
  }

  _getSelectedTypeMovies (items){
    let typeStr = items.key
    if(typeStr === '全部') typeStr =''  
    request({
      method: 'get',
      url: `/api/v0/movies?type=${encodeURIComponent(typeStr) || ''}&year=${this.state.year || ''}`
    }).then(res => {
      this.setState({
        movies: res,
        type:encodeURIComponent(typeStr) || ''
      })
    }).catch(() => {
      this.setState({
        movies: [],
        type:encodeURIComponent(typeStr) || ''
      })
    })
   }

  _getAllMovies = () => {
    request(window.__LOADING__)({
      method: 'get',
      url: `/api/v0/movies?type=${this.state.type || ''}&year=${this.state.year || ''}`
    }).then(res => {
      this.setState({
        movies: res
      })
    }).catch(() => {
      this.setState({
        movies: []
      })
    })
  }

  _renderContent = () => {
    const { movies, collapsed } = this.state

    if (!movies || !movies.length) return null

    return (
      <Content
        toggleCollapsed={this._toggleCollapsed}
        collapsed={collapsed}
        movies={movies}
      />
    )
  }

  render () {
    const { years, collapsed, selectedKey } = this.state
    return (
      <Layout _getSelectedTypeMovies = {this._getSelectedTypeMovies} {...this.props} >
        <div className='flex-row full'>
          <Menu
            defaultSelectedKeys={[selectedKey]}
            mode='inline'
            inlineCollapsed={collapsed}
            style={{ height: '100%', overflowY: 'scroll', maxWidth: 230 }}
            onSelect={this._selectedItem}
            className='align-self-start'
            onClick={ (params) => this._getSelectedYearsMovies(params)}
          >
            {
              years && years.length
                ? years.map((e, i) => (
                  <Menu.Item key={i} >
                    {/* <a href={`/year/${e}`}>{e} 年上映</a> */}
                    <a href='#'>{e} { e == '所有年份' ? '' :'年上映'}</a>
                  </Menu.Item>
                ))
                : null
            }
          </Menu>
          <div className='flex-1 scroll-y align-self-start'>
            {this._renderContent()}
          </div>
        </div>
      </Layout>
    )
  }
}
