import React, { Component } from 'react'
import { request } from '../../lib'
import Layout from '../../layouts/default'
import config from '../../../config/index'
import {
  Table,
  Button
} from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

const site = config.qiniu.video

export default class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false,
      selectedKey: '0',
      dataSource: [],
      columns: [{
        title: '海报',
        dataIndex: 'posterKey',
        key: 'posterKey',
        render: (text, record) => (<img width="160" src={site + record.posterKey} />)
      }, {
        title: '名字',
        dataIndex: 'title',
        key: 'title',
      }, {
        title: '原始名',
        dataIndex: 'rawTitle',
        key: 'rawTitle',
      }, {
        title: '上映时间',
        dataIndex: 'pubdate',
        key: 'pubdate',
        render: (text, record) => (
          record.pubdate.map((it, i) => (
            <p key={i}>{moment(it.date).format('YYYY-MM-DD')} {it.country}</p>
          ))
        )
      },
      {
        title: '评分',
        dataIndex: 'rate',
        key: 'rate'
      },
      {
        title: '更新时间',
        dataIndex: 'meta',
        key: 'meta',
        render: (text, record) => (<span>{moment(record.meta.createdAt).fromNow(true)} 前</span>)
      },
      {
        title: '豆瓣 ID',
        dataIndex: 'doubanId',
        key: 'doubanId'
      },
      {
        title: '类型',
        dataIndex: 'movieTypes',
        key: 'movieTypes',
        render: (text, record) => (
          record.movieTypes.map((it, i) => (
            <p key={i}>{it}</p>
          ))
        )
      },
      {
        title: '标签',
        dataIndex: 'tags',
        key: 'tags',
        render: (text, record) => (
          record.tags.map((it, i) => (
            <p key={i}>{it}</p>
          ))
        )
      },
      {
        title: '简要',
        key: 'summary',
        render: (text, record) => <p style={{padding: '5px', maxWidth: '800px'}}>{record.summary}</p>
      },
      {
        title: '详情',
        key: '_id',
        render: (text, record) => <a href={`/detail/${record._id}`} target={'_blank'}>详情</a>
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => <Button type="danger" onClick={()=>this._deleteMovie(record._id)}>删除</Button>
      }]
    }
  }

  componentDidMount () {
    this._getAllMovies()
  }

  _delete = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  _getAllMovies = () => {
    request({
      method: 'get',
      url: '/api/v0/user/movie/list'
    }).then(res => {
      this.setState({
        dataSource: res
      })
    }).catch(() => {
      this.setState({
        dataSource: []
      })
    })
  }
  _deleteMovie = (id) => {
    request({
      method: 'delete',
      url: `/api/v0/user/movies?id=${id}`
    }).then(res => {
      this.setState({
        dataSource: res
      })
    }).catch(() => {
      this.setState({
        dataSource: []
      })
    })
  }

  render () {
    let { dataSource, columns } = this.state

    if (!dataSource || !dataSource.length) return null

    dataSource = dataSource.map((data, i) => {
      data.key = i

      return data
    })

    return (
      <Layout {...this.props}>
        <div className='flex-row full'>
          <div className='flex-1 scroll-y align-self-start'>
            <Table dataSource={dataSource} columns={columns} />
          </div>
        </div>
      </Layout>
    )
  }
}
