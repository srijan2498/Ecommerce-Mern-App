import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import Adminmenu from '../../components/Adminmenu'
import axios from 'axios';
import { message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

const CreateProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [tag, setTag] = useState("");
    const [quantity, setQuantity] = useState("");
    // const [photo, setPhoto] = useState("");
    const [photo, setPhoto] = useState([]);
    const [shipping, setShipping] = useState("");
    const [isSpecial, setIsSpecial] = useState("");

    const [photoImage, setPhotoImage] = useState([]);
    const [selectImg, setSelectImage] = useState(null)
    const [isImgSelected, setIsImgSelected] = useState(false)

    //get all category
    const getAllCategory = async () => {
        try {
            const res = await axios.get(`/api/v1/category/get-all-category`)
            if (res.data?.success) {
                setCategories(res.data?.category)
            }
        } catch (error) {
            message.error('Something went wrong in getAllCategory')
        }
    };

    useEffect(() => {
        getAllCategory();
    }, []);

    //getAllTags Func
    const getAllTags = async () => {
        try {
            const res = await axios.get(`/api/v1/tag/get-all-tags`)
            if (res.data.success) {
                setTags(res.data.tags)
            }
        } catch (error) {
            message.error('Something went wrong in getAllTags')
        }
    };

    useEffect(() => {
        getAllTags();
    }, []);

    // upload image to cloudinary
    const submitImage = () => {
        const data = new FormData()
        data.append('file', selectImg)
        data.append('upload_preset', 'ecommerce')
        data.append('cloud_name', 'dveema5rd')
        fetch('https://api.cloudinary.com/v1_1/dveema5rd/image/upload', {
            method: 'post',
            body: data
        })
            .then((res) => res.json())
            .then((data) => {
                setPhoto([...photo, data.secure_url])
            }).catch((err) => {
            })

    }

    //create product func
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const productDetail = {
                name,
                description,
                originalPrice,
                price,
                quantity,
                photo,
                category,
                tag,
                isSpecial
            }
            const res = await axios.post(`/api/v1/product/create-product`, productDetail, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            if (res.data?.success) {
                message.success(res.data.message);
                navigate('/dashboard/admin/products')
            } else {
                message.error(res.data?.message)
            }
        } catch (error) {
            message.error('Something went wrong in create product')
        }
    }

    return (
        <Layout title={'Dashboard - Create Product'}>
            <div className='AdminDashboard'>
                {/* container-fluid m-3 p-3 */}
                <div className="row">
                    <div className="sideAdminDashboard col-md-3 ">
                        <Adminmenu />
                    </div>
                    <div className="col-md-9">
                        <div className='mainAdminDashboardOfCreateCategory'>
                            <h4 className='text-center  mb-3'>Create Product</h4>
                            <div className="m-1 w-88">
                                <label className='labelClass'>Select category : </label>
                                <Select bordered={false} placeholder="Select a category" size='large' showSearch className='form-select mb-3' onChange={(value) => { setCategory(value) }}>
                                    {categories?.map((cat) => (
                                        <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                                    ))}
                                </Select>
                                <button onClick={() => { navigate('/dashboard/admin/create-category') }} className='btn btn-primary mb-3'>Add Category</button> <br />
                                <label className='labelClass'>Select tag : </label>
                                <Select bordered={false} placeholder="Select a tag" size='large' showSearch className='form-select mb-3' onChange={(value) => { setTag(value) }}>
                                    {tags?.map((tag) => (
                                        <Option key={tag._id} value={tag._id}>{tag.name}</Option>
                                    ))}
                                </Select>
                                <div className="mb-3">
                                    {isImgSelected == false ? <label className='btn btn-outline-secondary col-md-12'>
                                        {"Choose Photo"}
                                        <input type="file" name="photo" accept='image/*' onChange={(e) => {
                                            setPhotoImage([...photoImage, e.target.files[0]])
                                            setSelectImage(e.target.files[0])
                                            setIsImgSelected(true)
                                        }} hidden />
                                    </label> : <label className='btn btn-outline-secondary col-md-12'>
                                        {"Upload Photo"}
                                        <input type="button" onClick={(e) => {
                                            submitImage()
                                            setIsImgSelected(false)
                                        }} hidden />
                                    </label>}

                                </div>
                                <div className="mb-3 div_prod">
                                    {photoImage && (
                                        photoImage.map((pho) => {
                                            return <img src={URL.createObjectURL(pho)} alt="product photo" height={"200px"} className='img img-responsive admin_prod_img' />
                                        })
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className='labelClass'>Product Name : </label>
                                    <input type="text" value={name} placeholder='write a name' className='form-control' onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className='labelClass'>Product Description : </label>
                                    <textarea value={description} placeholder='write description' className='form-control' onChange={(e) => setDescription(e.target.value)} />
                                </div>
                                <label className='labelClass'>Special Product : </label>
                                <Select bordered={false} placeholder="Special product" size='large' showSearch className='form-select mb-3' onChange={(value) => { setIsSpecial(value) }}>
                                    <Option value={`Yes`}>Yes</Option>
                                    <Option value={`No`}>No</Option>
                                </Select>
                                <div className="mb-3">
                                    <label className='labelClass'>Original Price : </label>
                                    <input type="number" value={originalPrice} placeholder='write original price' className='form-control' onChange={(e) => setOriginalPrice(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className='labelClass'>Selling Price : </label>
                                    <input type="number" value={price} placeholder='write price' className='form-control' onChange={(e) => setPrice(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className='labelClass'>Quantity : </label>
                                    <input type="number" value={quantity} placeholder='write quantity' className='form-control' onChange={(e) => setQuantity(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className='labelClass'>Shipping : </label>
                                    <Select bordered={false} placeholder="Select Shipping" size='large' showSearch className='form-select mb-3' onChange={(value) => { setShipping(value) }}>
                                        <Option value="0">Yes</Option>
                                        <Option value="1">No</Option>
                                    </Select>
                                </div>
                                <div className="mb-3">
                                    <button className="btn btn-primary" onClick={handleCreate}>CREATE PRODUCT</button>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct
