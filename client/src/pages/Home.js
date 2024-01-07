import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { message, Button } from 'antd';
import axios from 'axios';
import { setProducts } from '../redux/features/productSlice';
import { setCategories } from '../redux/features/categorySlice';
import { Checkbox, Radio } from 'antd';
import { PriceData } from '../components/PriceData';
import { useNavigate } from 'react-router-dom';
import { setCart } from '../redux/features/cartSlice';
import '../styles/home.css'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { setUser } from '../redux/features/authSlice';
import Products from './admin/Products';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [wishItem, setWishItem] = useState([])

  const [loggedInUser, setLoggedInUser] = useState(null)
  useEffect(() => {
    setLoggedInUser(user)
    if (user?.isAdmin == 'true') {
      navigate('/dashboard/admin/products')
    }
  }, [user])

  useEffect(() => {
    let existingCartItem = localStorage.getItem("cart");
    if (existingCartItem) {
      setCart(JSON.parse(existingCartItem));
    }

  }, []);

  //decreaseProductQuantity Function
  const decreaseProductQuantity = async (id) => {
    try {
      const res = await axios.get(`/api/v1/product/decrease-product-quantity/${id}`);
      if (res.data.success) {
        getAllProducts();
      }
    } catch (error) {
      message.error("Something went wrong in decreaseProductQuantity func");
    }
  }

  //get all categories
  const getAllCategory = async () => {
    try {
      const res = await axios.get(`/api/v1/category/get-all-category`);
      if (res.data?.success) {
        dispatch(setCategories(res.data.category));
        // message.success('All categories fetched successfully')
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      message.error("Something went wrong in get-all-category");
    }
  }

  useEffect(() => {
    getAllCategory();
    // eslint-disable-next-line
  }, []);

  //get all products
  const getAllProducts = async () => {
    try {
      const res = await axios.get(`/api/v1/product/get-all-products`);

      if (res.data?.success) {
        dispatch(setProducts(res.data?.products));
        // message.success("All products fetched successfully")
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      message.error("Something went wrong in get-all-products")
    }
  }

  useEffect(() => {
    if (user?.name && (!checked.length || !radio.length)) {
      setWishItem(user.wishlist)
      getAllProducts();
    }
    else if (!checked.length || !radio.length) {
      getAllProducts();
    }
  }, [checked.length, radio.length, wishItem, loggedInUser]);

  // handleFilter func (filter by category)
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((cat) => cat !== id);
    }
    setChecked(all);
  };

  //get filtered product
  const filterProduct = async () => {
    try {
      const res = await axios.post(`/api/v1/product/product-filters`, { checked, radio });
      if (res.data?.success) {
        // message.success(res.data.message);
        dispatch(setProducts(res.data.products));
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      message.error('Something went wrong in filtered product')
    }
  }

  // add product to user wishlist
  const addToUserWishlist = async (productId) => {
    try {
      const res = await axios.post(`/api/v1/auth/wishlist/add`, { productId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.data?.success) {
        // message.success(res.data.message);
        // dispatch(setProducts(res.data.products));
      } else {
        message.error(res.data.message);
      }
      window.location.reload()
    } catch (error) {
      message.error('Something went wrong while adding product to wishlist!')
    }
  }

  // remove product from user wishlist
  const removeFromUserWishlist = async (productId) => {
    try {
      const res = await axios.post(`/api/v1/auth/wishlist/remove`, { productId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.data?.success) {
        // message.success(res.data.message);
        // dispatch(setProducts(res.data.products));
      } else {
        message.error(res.data.message);
      }
      window.location.reload()
    } catch (error) {
      message.error('Something went wrong while adding product to wishlist!')
    }
  }

  // login to add to wishlist
  const loginToAddToWishList = () => {
    navigate('/login')
  }

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio, filterProduct])

  return (
    <div>
      {loggedInUser ? <div>
        {loggedInUser?.isAdmin == 'false' ? <>
          {products && <Layout title={"All Products - Best Offers"}>
            <div className={`${user?.isAdmin == "true" ? "HomeForAdmin" : "Home"}`}>
              <div className="homeSideContainer">
                {/* filter by category */}
                <h6 className="homeFilterHeading">Filter By Category</h6>
                <div className="homeFilterByCatContainer">
                  {categories?.map((cat) => (
                    <Checkbox className={`${user?.isAdmin == "true" ? "homeFilterByCatContainerChechboxForAdmin" : "homeFilterByCatContainerChechbox"}`} key={cat._id}
                      onChange={(e) => handleFilter(e.target.checked, cat._id)}
                    >{cat.name}</Checkbox>
                  ))}
                </div>
                {/* filter by price */}
                <h6 className="homeFilterHeading homeFilterByPriceHeading">Filter By Price</h6>
                <div className="homeFilterByCatContainer">
                  <Radio.Group onChange={e => setRadio(e.target.value)}>
                    {PriceData?.map((p) => (
                      <div className='homeFilterByCatContainerRadioDiv' key={p._id}>
                        <Radio className={`${user?.isAdmin == "true" ? "homeFilterByCatContainerRadioForAdmin" : ""}`} value={p.array}>{p.name}</Radio>
                      </div>
                    ))}
                  </Radio.Group>
                </div>
                <div>
                  <Button className="btn btn-primary resetFiltersBtn" onClick={() => window.location.reload()}>Reset Filters</Button>
                </div>
              </div>

              <div className="homeMainContainer">
                {/* {JSON.stringify(checked, null, 4)} */}
                {/* {JSON.stringify(radio, null, 4)} */}
                <h4 className="allProductsHeading">Our Special Products</h4>
                <div className="allProductsBigContainer">
                  {products?.map((product) => {
                    if (product.isSpecial == "Yes") {
                      return <div key={product._id} className="card" style={{ width: "18rem" }}>
                        <img src={`${product.photo[0]}`} className="card-img-top cardImage" alt={product.name} />
                        <div className="card-body">
                          <h4 className="card-title">{product.name}</h4>


                          <div className="productDescDiv">
                            <p className="productDesc card-text">{product.description.substring(0, 30)}...</p>
                          </div>

                          <div className="productPriceDiv">
                            <p className="productOriginalPrice card-text"><strike>Rs. {product.originalPrice}</strike></p>
                            <p className="productPrice card-text">Rs. {product.price}</p>
                          </div>

                          <div className="productQuantity">
                            <p>Stock : <strong>{product.quantity}</strong></p>
                            {user && user?.isAdmin == "false" ? (
                              <>{
                                wishItem.find((wish) => {
                                  if (wish._id == product._id) {
                                    return true
                                  }
                                }) ? <p className='wishListHeartSymbol' onClick={() => removeFromUserWishlist(product._id)}><AiFillHeart /></p> : <p className='wishListHeartSymbol' onClick={() => addToUserWishlist(product._id)}><AiOutlineHeart /></p>
                              }
                              </>
                            ) : <><p className='wishListHeartSymbol' onClick={() => loginToAddToWishList()}><AiOutlineHeart /></p></>}
                          </div>
                          <div className="moreDetailsandAddToCartBtnContainer">
                            <button className="btn btn-primary" onClick={() => { navigate(`/product-detail/${product.slug}`) }}>More Details</button>
                            {product?.quantity > 0 ? (
                              <button className="btn btn-secondary" onClick={() => {
                                dispatch(setCart([...cart, product]));
                                localStorage.setItem("cart", JSON.stringify([...cart, product]))
                                message.success('Item added to cart');
                                decreaseProductQuantity(product._id);
                              }}>ADD TO CART</button>
                            ) : (<button className='btn btn-danger' disabled={true}>Out of Stock</button>)}
                          </div>
                        </div>
                      </div>
                    }
                  }
                  )}
                </div>
              </div>
            </div>
          </Layout>}
        </> : <Products />}
      </div> : <>
        {products && <Layout title={"All Products - Best Offers"}>
          <div className={`${user?.isAdmin == "true" ? "HomeForAdmin" : "Home"}`}>
            <div className="homeSideContainer">
              {/* filter by category */}
              <h6 className="homeFilterHeading">Filter By Category</h6>
              <div className="homeFilterByCatContainer">
                {categories?.map((cat) => (
                  <Checkbox className={`${user?.isAdmin == "true" ? "homeFilterByCatContainerChechboxForAdmin" : "homeFilterByCatContainerChechbox"}`} key={cat._id}
                    onChange={(e) => handleFilter(e.target.checked, cat._id)}
                  >{cat.name}</Checkbox>
                ))}
              </div>
              {/* filter by price */}
              <h6 className="homeFilterHeading homeFilterByPriceHeading">Filter By Price</h6>
              <div className="homeFilterByCatContainer">
                <Radio.Group onChange={e => setRadio(e.target.value)}>
                  {PriceData?.map((p) => (
                    <div className='homeFilterByCatContainerRadioDiv' key={p._id}>
                      <Radio className={`${user?.isAdmin == "true" ? "homeFilterByCatContainerRadioForAdmin" : ""}`} value={p.array}>{p.name}</Radio>
                    </div>
                  ))}
                </Radio.Group>
              </div>
              <div>
                <Button className="btn btn-primary resetFiltersBtn" onClick={() => window.location.reload()}>Reset Filters</Button>
              </div>
            </div>

            <div className="homeMainContainer">
              {/* {JSON.stringify(checked, null, 4)} */}
              {/* {JSON.stringify(radio, null, 4)} */}
              <h4 className="allProductsHeading">Our Special Products</h4>
              <div className="allProductsBigContainer">
                {products?.map((product) => {
                  if (product.isSpecial == "Yes") {
                    return <div key={product._id} className="card" style={{ width: "18rem" }}>
                      <img src={`${product.photo[0]}`} className="card-img-top cardImage" alt={product.name} />
                      <div className="card-body">
                        <h4 className="card-title">{product.name}</h4>


                        <div className="productDescDiv">
                          <p className="productDesc card-text">{product.description.substring(0, 30)}...</p>
                        </div>

                        <div className="productPriceDiv">
                          <p className="productOriginalPrice card-text"><strike>Rs. {product.originalPrice}</strike></p>
                          <p className="productPrice card-text">Rs. {product.price}</p>
                        </div>

                        <div className="productQuantity">
                          <p>Stock : <strong>{product.quantity}</strong></p>
                          {user && user?.isAdmin == "false" ? (
                            <>{
                              wishItem.find((wish) => {
                                if (wish._id == product._id) {
                                  return true
                                }
                              }) ? <p className='wishListHeartSymbol' onClick={() => removeFromUserWishlist(product._id)}><AiFillHeart /></p> : <p className='wishListHeartSymbol' onClick={() => addToUserWishlist(product._id)}><AiOutlineHeart /></p>
                            }
                            </>
                          ) : <><p className='wishListHeartSymbol' onClick={() => loginToAddToWishList()}><AiOutlineHeart /></p></>}
                        </div>
                        <div className="moreDetailsandAddToCartBtnContainer">
                          <button className="btn btn-primary" onClick={() => { navigate(`/product-detail/${product.slug}`) }}>More Details</button>
                          {product?.quantity > 0 ? (
                            <button className="btn btn-secondary" onClick={() => {
                              dispatch(setCart([...cart, product]));
                              localStorage.setItem("cart", JSON.stringify([...cart, product]))
                              message.success('Item added to cart');
                              decreaseProductQuantity(product._id);
                            }}>ADD TO CART</button>
                          ) : (<button className='btn btn-danger' disabled={true}>Out of Stock</button>)}
                        </div>
                      </div>
                    </div>
                  }
                }
                )}
              </div>
            </div>
          </div>
        </Layout>}
      </>}
    </div>
  )
}

export default Home
