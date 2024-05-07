import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Gaming from './components/Gaming'
import VideoItemDetails from './components/VideoItemDetails'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'
import Trending from './components/Trending'
import SavedVideos from './components/SavedVideos'

import './App.css'

class App extends Component {
  state = {
    videoList: [],
  }

  addVideo = video => {
    const {videoList} = this.state
    const videoObject = videoList.find(
      eachVideoItem => eachVideoItem.id === video.id,
    )

    if (videoObject) {
      this.setState(prevState => ({
        videoList: prevState.videoList.map(eachVideoItem => {
          if (videoObject.id === eachVideoItem.id) {
            return {...eachVideoItem}
          }

          return eachVideoItem
        }),
      }))
    } else {
      const updatedVideoList = [...videoList, video]

      this.setState({cartList: updatedVideoList})
    }
  }

  render() {
    const {videoList} = this.state

    return (
      <CartContext.Provider
        value={{
          videoList,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/gaming" component={Gaming} />
          <ProtectedRoute exact path="/trending" component={Trending} />
          <ProtectedRoute
            exact
            path="/videos/:id"
            component={VideoItemDetails}
          />
          <ProtectedRoute exact path="/saved-videos" component={SavedVideos} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
