import CartContext from '../../context/CartContext'

const VideoItem = props => {
  const {videoItemDetails} = props
  const {id, title, name, viewCount, publishedAt, imageUrl} = videoItemDetails
  return (
    <li>
      <div>
        <img src={imageUrl} />
        <div>
          <h1>{title}</h1>
          <p>{name}</p>
          <p>{viewCount}</p>
          <p>{publishedAt}</p>
        </div>
      </div>
    </li>
  )
}
export default VideoItem
