import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { setCategories } from '../redux/features/categorySlice';
import { message } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Categories = () => {
  const { categories } = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const getAllCategory = async () => {
    try {
      const res = await axios.get(`/api/v1/category/get-all-category`)
      if (res.data.success) {
        // message.success(res.data.message);
        dispatch(setCategories(res.data.category));
      }
    } catch (error) {
      message.error('Something went wrong in getAllCategory')
    }
  };

  useEffect(() => {
    getAllCategory();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout title={"All Categories"}>
      <div className="categoriesOuterContainer">
        <div className="categoriesDiv">
          {/* {cat = Object.keys(categories)}
<li key={cat._id}><Link to={`/category/${cat?.slug}`} className="dropdown-item">{cat.name}</Link></li> */}
          <h5 className='categoriesAllCategories'>All Categories</h5>
          {categories?.map((cat) => (
            <div key={cat._id} className="categoriesParticularDivCon">
              {/* col-md-6 mt-5 mb-3 gx-3 gy-3 */}
              <Link to={`/category/${cat.slug}`} className='btn btn-primary'>{cat.name}</Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Categories
