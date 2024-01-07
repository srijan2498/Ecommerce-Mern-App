import React, { useEffect } from 'react'
import Layout from '../components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { setTags } from '../redux/features/tagsSlice';

const Tags = () => {
    const { tags } = useSelector((state) => state.tags);
    const dispatch = useDispatch();

    const getAllTags = async () => {
        try {
            const res = await axios.get(`/api/v1/tag/get-all-tags`)
            if (res.data?.success) {
                // message.success(res.data.message);
                dispatch(setTags(res.data.tags));
            }
        } catch (error) {
            message.error('Something went wrong in getAllCategory')
        }
    };

    useEffect(() => {
        getAllTags();
        // eslint-disable-next-line
    }, []);

    return (
        <Layout title={"All Categories"}>
            <div className="categoriesOuterContainer">
                <div className="categoriesDiv">
                    <h5 className='categoriesAllCategories'>All Tags</h5>
                    {tags?.map((tag) => (
                        <div key={tag._id} className="categoriesParticularDivCon">
                            {/* col-md-6 mt-5 mb-3 gx-3 gy-3 */}
                            <Link to={`/tag/${tag.slug}`} className='btn btn-primary'>{tag.name}</Link>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default Tags
