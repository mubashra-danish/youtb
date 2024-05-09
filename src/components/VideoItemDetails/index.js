import React, {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import ReactPlayer from 'react-player'
import CartContext from '../../context/CartContext'
import NavBar from '../NavBar'
import SideBar from '../SideBar'
import {AiOutlineLike} from 'react-icons/ai'
import {AiOutlineDislike} from 'react-icons/ai'
import {HiOutlineSave} from 'react-icons/hi'
import {formatDistanceToNow} from 'date-fns'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class VideoItemDetails extends Component {
  state = {
    videoData: [],
    apiStatus: apiStatusConstants.initial,
    likeActive: false,
    dislikeActive: false,
    saveActive: false,
  }

  componentDidMount() {
    console.log('Component mounted')
    this.getVideoData()
  }

  getFormattedData = data => ({
    id: data.id,
    title: data.title,
    videoUrl: data.video_url,
    thumbnailUrl: data.thumbnail_url,
    channel: {
      name: data.channel.name,
      profileImageUrl: data.channel.profile_image_url,
      subscriberCount: data.channel.subscriber_count,
    },
    viewCount: data.view_count,
    publishedAt: data.published_at,
    description: data.description,
    channel: data.channel,
  })

  getVideoData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/videos/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = this.getFormattedData(fetchedData.video_details)
        this.setState({
          videoData: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    } catch (error) {
      console.error('Error fetching video details:', error)
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  handleRetry = () => {
    console.log('Retrying...')
    this.getVideoData()
  }

  handleLike = () => {
    this.setState(prevState => ({
      likeActive: !prevState.likeActive,
      dislikeActive: false,
    }))
  }

  handleDislike = () => {
    this.setState(prevState => ({
      dislikeActive: !prevState.dislikeActive,
      likeActive: false,
    }))
  }

  handleSaved = () => {
    this.setState(prevState => ({
      saveActive: !prevState.saveActive,
    }))
  }

  renderLoadingView = () => (
    <div className="video-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
        alt="Failed to fetch video details"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We are having some trouble completing your request.</p>
      <p>Please try again.</p>
      <button type="button" onClick={this.handleRetry}>
        Retry
      </button>
    </div>
  )

  renderVideoDetailsView = () => (
    <CartContext.Consumer>
      {value => {
        const {videoData, likeActive, dislikeActive, saveActive} = this.state
        const {title, videoUrl, viewCount, publishedAt, channel} = videoData
        console.log('videoData:', videoData)
        const {addVideo} = value
        const handleSave = () => {
          addVideo({...videoData})
          console.log('save button called')
        }
        return (
          <div>
            <NavBar />
            <SideBar />
            <div className="detailcont">
              <ReactPlayer
                url={videoUrl}
                className="video-player"
                width="96%"
                height="100%"
                controls
              />
              <div className="video-details-container">
                <div>
                  <p>{channel.subscriberCount}</p>
                  <p>{channel.name}</p>
                </div>
                <h2 className="video-title">{title}</h2>

                <div className="biggboxx">
                  <div className="dateboxx">
                    <p className="view-count">{viewCount}</p>
                    <p className="published-at">
                      {formatDistanceToNow(new Date(publishedAt))}
                    </p>
                  </div>
                  <div className="buttons-container">
                    <button
                      type="button"
                      className={`like-button ${likeActive ? 'active' : ''}`}
                      onClick={this.handleLike}
                    >
                      <AiOutlineLike />
                    </button>
                    <button
                      type="button"
                      className={`dislike-button ${
                        dislikeActive ? 'active' : ''
                      }`}
                      onClick={this.handleDislike}
                    >
                      <AiOutlineDislike />
                    </button>
                    <button
                      type="button"
                      className={`save-button ${saveActive ? 'active' : ''}`}
                      onClick={saveActive ? this.handleSaved : this.handleSave}
                    >
                      <HiOutlineSave />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <hr />
          </div>
        )
      }}
    </CartContext.Consumer>
  )

  render() {
    console.log('Rendering VideoItemDetails component')
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVideoDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default VideoItemDetails
