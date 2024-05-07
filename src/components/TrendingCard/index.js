import React from 'react'
import {Link} from 'react-router-dom'
import {formatDistanceToNow} from 'date-fns' // Import formatDistanceToNow function
import './index.css'

const TrendingCard = props => {
  const {trendingData} = props
  const {
    id,
    title,
    thumbnailUrl,
    channel,
    viewCount,
    publishedAt,
  } = trendingData

  // Calculate publishedAgo using formatDistanceToNow
  const publishedAgo = formatDistanceToNow(new Date(publishedAt))

  return (
    <li>
      <Link to={`/videos/${id}`} className="link-item">
        <div className="trending-card">
          <img src={thumbnailUrl} alt={title} className="thumbnail" />
          <div className="channel-info">
            <h2 className="title">{title}</h2>
            <p className="channel-name">{channel.name}</p>
            <div className="bkh">
              <p className="view-count">{viewCount}</p>
              {/* Replace publishedAt with calculated publishedAgo */}
              <p className="published-at">{publishedAgo}</p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default TrendingCard
