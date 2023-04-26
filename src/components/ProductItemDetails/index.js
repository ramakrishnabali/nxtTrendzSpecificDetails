// Write your code here
import {Component} from 'react'

import Cookies from 'js-cookie'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    count: 1,
    product: [],
    similarProducts: [],
    apiStatus: apiStatusConstants[0],
  }

  componentDidMount() {
    this.getProduct()
  }

  getProduct = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props

    const {params} = match

    const {id} = params
    //  console.log(id)
    const apiUrl = `https://apis.ccbp.in/products/${id}`

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    //  console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      // console.log(data)
      const updatedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        style: data.style,
        description: data.description,
        price: data.price,
      }

      // console.log(updatedData)

      const updatedSimilarProducts = data.similar_products.map(eachObject => ({
        id: eachObject.id,
        imageUrl: eachObject.image_url,
        title: eachObject.title,
        style: eachObject.style,
        price: eachObject.price,
        description: eachObject.description,
        brand: eachObject.brand,
        totalReviews: eachObject.total_reviews,
        rating: eachObject.rating,
        availability: eachObject.availability,
      }))

      //  console.log(updatedSimilarProducts)

      this.setState({
        product: updatedData,
        similarProducts: updatedSimilarProducts,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  decreaseCount = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({
        count: prevState.count - 1,
      }))
    }
  }

  increaseCount = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  getProductRoute = props => {
    const {history} = props

    history.replace('/product')
  }

  renderProduct = () => {
    const {product, count} = this.state

    const {
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      availability,
      description,
      price,
    } = product

    return (
      <div className="product-details-container">
        <div className="product-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product-description-container">
            <h1 className="product-heading">{title}</h1>
            <p className="product-price">Rs {price}/- </p>
            <div className="rating-reviews-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="reviews">{description}</p>
            <p className="reviews">
              <span className="product-price">Available:</span> {availability}
            </p>
            <p className="reviews">
              <span className="product-price">Brand:</span> {brand}
            </p>

            <div className="plus-minus-container">
              <button
                type="button"
                className="minus-button"
                onClick={this.decreaseCount}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="reviews">{count}</p>
              <button
                type="button"
                className="minus-button"
                onClick={this.increaseCount}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        {this.renderSimilarProducts()}
      </div>
    )
  }

  renderSimilarProducts = () => {
    const {similarProducts} = this.state
    return (
      <div className="similar-products-container">
        <h1 className="similar-heading">Similar Products</h1>
        <ul className="ul-container">
          {similarProducts.map(eachSimilar => (
            <SimilarProductItem
              key={eachSimilar.id}
              similarProduct={eachSimilar}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <>
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="failure-button">
          Continue Shopping
        </button>
      </Link>
    </>
  )

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  status = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProduct()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.status()}
      </>
    )
  }
}

export default ProductItemDetails
