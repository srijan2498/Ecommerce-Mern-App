import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { message, Button } from 'antd';
import axios from 'axios';

const WishListPage = () => {
    const navigate = useNavigate();
    // const { wishList } = useSelector((state) => state.wishList);
    const [wishList, setWishList] = useState([])
    // add product to user wishlist
    const getAllWishlist = async () => {
        try {
            const res = await axios.get(`/api/v1/auth/wishlist`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (res.data?.success) {
                setWishList(res.data.wishes)
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            message.error('Something went wrong while fetching wishlist!')
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
                message.success(res.data.message);
            } else {
                message.error(res.data.message);
            }
            window.location.reload()
        } catch (error) {
            message.error('Something went wrong while adding product to wishlist!')
        }
    }
    useEffect(() => {
        getAllWishlist()
    }, [])
    return (
        <Layout>
            <div className="wishListOuterMostContainer">
                <h4 className='text-center m-3'>WishList Page</h4>
                <div className="wishListContainer">
                    <div className="wishListInnerContainer">
                        {wishList.length > 0 ? <>{wishList?.map((product) => (
                            <div key={product._id} className="CartPageMainInnerContainer row p-3 mb-2 card flex-row">
                                <div className="cartPageImageContainer col-md-5">
                                    <img src={`${product.photo[0]}`} className="card-img-top" alt={product.name} width={"100px"} height={"100px"} />
                                </div>
                                <div className="wishListPageMainCardContainer col-md-7">
                                    <h4>{product.name}</h4>
                                    <h6>{product.description}</h6>
                                    <h6>Original Price : <strike>{product.originalPrice}</strike></h6>
                                    <h6>Selling Price : {product.price}</h6>
                                    <h6>Quantity Available : {product.quantity}</h6>
                                    <button className="btn btn-primary moreDetailsBtn" onClick={() => { navigate(`/product-detail/${product.slug}`) }}>More Details</button>
                                    <button className="btn btn-danger remove_wish_btn" onClick={() => { removeFromUserWishlist(product._id); }}>Remove</button>
                                </div>
                            </div>
                        ))}</> : <div className='no_product_here'>No product added to wishlist yet!</div>}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default WishListPage
