import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Box from '../Box'
import NavBar from '../NavBar' // Import NavBar component
import SideBar from '../SideBar' // Import SideBar component
import './index.css'
import {formatDistanceToNow} from 'date-fns' // Import formatDistanceToNow function

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    videos: [],
    searchQuery: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.fetchVideos()
  }

  fetchVideos = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    try {
      const jwtToken = Cookies.get('jwt_token')
      let apiUrl = 'https://apis.ccbp.in/videos/all'
      if (this.state.searchQuery) {
        apiUrl += `?search=${this.state.searchQuery}`
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      if (response.ok) {
        const responseData = await response.json()
        const updatedVideos = responseData.videos.map(video => ({
          id: video.id,
          title: video.title,
          thumbnailUrl: video.thumbnail_url,
          channel: {
            name: video.channel.name,
            profileImageUrl: video.channel.profile_image_url,
          },
          viewCount: video.view_count,
          // Replace publishedAt with the result of formatDistanceToNow
          publishedAgo: formatDistanceToNow(new Date(video.published_at)),
        }))
        this.setState({
          videos: updatedVideos,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  handleSearch = () => {
    this.fetchVideos()
  }

  handleInputChange = event => {
    this.setState({searchQuery: event.target.value})
  }

  renderVideos = () => {
    const {videos} = this.state
    return (
      <div className="main-box">
        {videos.map(video => (
          <div key={video.id} className="video">
            <Link to={`/videos/${video.id}`}>
              <img
                className="homeimg"
                src={video.thumbnailUrl}
                alt={video.title}
              />
              <div className="logobox">
                <img
                  className="logoboximg"
                  src={video.channel.profileImageUrl}
                />
                <div>
                  <p className="hometitle">{video.title}</p>
                  <p className="hometitlee">{video.channel.name}</p>
                  <div className="boxforcount">
                    <p className="homecount">{video.viewCount}</p>
                    {/* Use publishedAgo instead of publishedAt */}
                    <p className="homecount">{video.publishedAgo}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state

    return (
      <div>
        <NavBar className="navbar" />{' '}
        {/* Add NavBar component with className */}
        <div className="sidebar-container">
          <SideBar className="sidebar" />{' '}
          {/* Add SideBar component with className */}
          <div className="main-content">
            <div className="search-container">
              <Box className="boxxx" />
              <input
                type="text"
                onChange={this.handleInputChange}
                placeholder="Search"
              />
              <button onClick={this.handleSearch}>Search</button>
            </div>

            {apiStatus === apiStatusConstants.inProgress && (
              <div className="loader-container">
                <Loader
                  type="ThreeDots"
                  color="#00BFFF"
                  height={80}
                  width={80}
                />
              </div>
            )}

            {apiStatus === apiStatusConstants.success && this.renderVideos()}

            {apiStatus === apiStatusConstants.failure && (
              <div className="failure-message">
                <p>Failed to fetch videos. Please try again.</p>
                <button onClick={this.fetchVideos}>Retry</button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Home
