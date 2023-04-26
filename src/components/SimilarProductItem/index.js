// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProduct} = props

  const {imageUrl, title, price, brand, rating} = similarProduct

  return (
    <li className="list-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-image"
      />
      <h1 className="similar-product-heading">{title}</h1>
      <p className="similar-brand"> by {brand}</p>

      <div className="similar-rating-container">
        <p className="product-price">Rs {price}/- </p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
