import {Link} from 'react-router-dom'
import './index.css'

const GamingCard = props => {
  const {gamingData} = props
  const {id, title, thumbnailUrl, viewCount} = gamingData // Added id variable
  return (
    <li>
      <Link to={`/videos/${id}`} className="link-item">
        <div className="gaming-card">
          <img src={thumbnailUrl} alt="video" className="thumb-image" />
          <h1 className="game-head">{title}</h1>
          <div className="vcb">
            <p className="game-para">{viewCount}</p>
            <p className="game-para">Watching Worldwide</p>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default GamingCard
