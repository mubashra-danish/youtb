import React, {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillFire} from 'react-icons/ai'
import TrendingCard from '../TrendingCard'
import NavBar from '../NavBar'
import SideBar from '../SideBar'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Trending extends Component {
  state = {
    trendingList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTrending()
  }

  getTrending = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    try {
      const jwtToken = Cookies.get('jwt_token')
      const apiUrl = 'https://apis.ccbp.in/videos/trending'
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
          channel: {
            name: item.channel.name,
            profileImageUrl: item.channel.profile_image_url,
          },
          viewCount: item.view_count,
          publishedAt: item.published_at,
        }))
        this.setState({
          trendingList: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    } catch (error) {
      console.error('Error fetching trending videos:', error)
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  handleRetry = () => {
    this.getTrending()
  }

  renderTrendingVideos = () => {
    const {trendingList} = this.state

    return (
      <div>
        <NavBar />
        <SideBar />
        <nav className="trending-nav">
          <AiFillFire />
          <h1>Trending</h1>
        </nav>
        <div className="trending-videos-container">
          {trendingList.map(video => (
            <TrendingCard key={video.id} trendingData={video} />
          ))}
        </div>
      </div>
    )
  }

  renderTrendingVideosFailure = () => (
    <div>
      <NavBar />
      <SideBar />
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
        alt="Failed to fetch trending videos"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We are having some trouble to complete your request</p>
      <p>Please try again.</p>
      <button onClick={this.handleRetry}>Retry</button>
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
        return this.renderTrendingVideos()
      case apiStatusConstants.failure:
        return this.renderTrendingVideosFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      default:
        return null
    }
  }
}

export default Trending
