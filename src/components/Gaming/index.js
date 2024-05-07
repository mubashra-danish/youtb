import React, {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {SiYoutubegaming} from 'react-icons/si'
import GamingCard from '../GamingCard'
import NavBar from '../NavBar'
import SideBar from '../SideBar'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Gaming extends Component {
  state = {
    gamingList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getGaming()
  }

  getGaming = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    try {
      const jwtToken = Cookies.get('jwt_token')
      const apiUrl = 'https://apis.ccbp.in/videos/gaming'
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }

      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.videos.map(item => ({
          id: item.id,
          title: item.title,
          thumbnailUrl: item.thumbnail_url,
          viewCount: item.view_count,
        }))
        this.setState({
          gamingList: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    } catch (error) {
      console.error('Error fetching gaming videos:', error)
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  handleRetry = () => {
    this.getGaming()
  }

  renderGamingVideos = () => {
    const {gamingList} = this.state
    console.log('fetched')
    return (
      <div>
        <NavBar />
        <SideBar />{' '}
        <nav className="trending-nav">
          <SiYoutubegaming />
          <h1>Gaming</h1>
        </nav>
        <div className="gaming-videos-container">
          {gamingList.map(video => (
            <GamingCard key={video.id} gamingData={video} />
          ))}
        </div>
      </div>
    )
  }

  renderGamingVideosFailure = () => (
    <div>
      <div>
        <NavBar />
        <SideBar />

        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
          alt="Failed to fetch trending videos"
          className="failure-img"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We are having some trouble to complete your request</p>
        <p>Please try again.</p>
        <button onClick={this.handleRetry}>Retry</button>
      </div>
    </div>
  )

  renderLoading = () => (
    <div>
      <NavBar />
      <SideBar />

      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
      </div>
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderGamingVideos()
      case apiStatusConstants.failure:
        return this.renderGamingVideosFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      default:
        return null
    }
  }
}

export default Gaming
