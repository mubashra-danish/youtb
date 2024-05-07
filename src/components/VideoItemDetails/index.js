import React, {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import ReactPlayer from 'react-player'
import CartContext from '../../context/CartContext'
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
    thumbnailUrl: data.thumbnailUrl,
    viewCount: data.view_count,
    publishedAt: data.published_at,
    description: data.description,
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
        const updatedData = this.getFormattedData(fetchedData)

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
        const {title, videoUrl, viewCount, publishedAt} = videoData
        const {addVideo} = value
        const handleSave = () => {
          addVideo({...videoData})
        }
        return (
          <div>
            <ReactPlayer
              url={videoUrl}
              className="video-player"
              width="50%"
              height="100%"
              controls
            />
            <div className="video-details-container">
              <h2 className="video-title">{title}</h2>
              <p className="view-count">Views: {viewCount}</p>
              <p className="published-at">Published at: {publishedAt}</p>
              <div className="buttons-container">
                <button
                  type="button"
                  className={`like-button ${likeActive ? 'active' : ''}`}
                  onClick={this.handleLike}
                >
                  Like
                </button>
                <button
                  type="button"
                  className={`dislike-button ${dislikeActive ? 'active' : ''}`}
                  onClick={this.handleDislike}
                >
                  Dislike
                </button>
                <button
                  type="button"
                  className={`save-button ${saveActive ? 'active' : ''}`}
                  onClick={saveActive ? this.handleSaved : this.handleSave}
                >
                  {saveActive ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
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
