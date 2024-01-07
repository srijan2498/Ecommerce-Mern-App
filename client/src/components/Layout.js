import React, { useEffect } from 'react'
import Footer from './Footer'
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header'
import { Helmet } from 'react-helmet';
import { message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/features/authSlice';

const Layout = ({ children, title, description, keywords, author }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const res = await axios.post(`/api/v1/auth/getUserData`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.data.success) {
        // message.success(res.data.message);
        navigate('/');
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      message.error("Something went wrong")
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }// eslint-disable-next-line
    , [user]);


  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author}></meta>
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: '78vh' }} >
        <h4>{children}</h4>
      </main>
      <Footer />
    </div>
  )
}

Layout.defaultProps = {
  title: "E-Commerce App",
  keywords: "HTML, CSS, Bootstrap, JavaScript, ReactJS, JSX, NodeJS, Express, MongoDB",
  description: "MERN STACK PROJECT",
  author: "Srijan Tripathi"
}

export default Layout
