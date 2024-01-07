import React from 'react'
import { message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setKeyword, setResults } from '../../redux/features/searchSlice';

const SearchInput = () => {
  const navigate = useNavigate();
  const { keyword } = useSelector((state) => state.search)
  const { results } = useSelector((state) => state.search);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/api/v1/product/search/${keyword}`);
      if (res.data.success) {
        dispatch(setResults(res.data.results))
      }
      navigate('/search')
    } catch (error) {
      message.error("Something went wrong , Please provide any Input");
    }
  };

  return (
    <div>
      <form className="d-flex" role="search" onSubmit={handleSubmit}>
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={keyword} onChange={(e) => { dispatch(setKeyword(e.target.value)) }} />
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  )
}

export default SearchInput
