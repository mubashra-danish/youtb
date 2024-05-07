import CartContext from '../../context/CartContext'
import VideoItem from '../VideoItem'

const SavedVideos = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList} = value
      return (
        <ul>
          {cartList.map(eachVideoItem => (
            <VideoItem
              key={eachVideoItem.id}
              videoItemDetails={eachVideoItem}
            />
          ))}
        </ul>
      )
    }}
  </CartContext.Consumer>
)
export default SavedVideos
