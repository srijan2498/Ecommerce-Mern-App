import React from 'react'
import Layout from '../../components/Layout'
import { Button, Form, Input, message } from 'antd';
import axios from 'axios'
import '../../styles/authStyles/register.css'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    // eslint-disable-next-line
    const onFinish = async (values) => {
        try {
            const res = await axios.post(`/api/v1/auth/login`, { ...values });
            if (res.data.success) {
                message.success(res.data.message);
                localStorage.setItem("token", res.data.token);
                navigate('/');
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            message.error('Something went wrong')
        }
    };

    return (
        <Layout>
            <section className="registerSection">
                <Form className='OuterRegisterFormContainer' onFinish={onFinish} >

                    <Form.Item name="email" label="E-mail" rules={[{ type: 'email', message: 'The input is not valid E-mail!', }, { required: true, message: 'Please input your E-mail!', },]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!', },]}>
                        <Input.Password className='pswd' />
                    </Form.Item>

                    <Form.Item >
                        <Link to="/forgot-password">Forgot Password</Link>
                    </Form.Item>

                    <Form.Item className='submitBtnFormItem'>
                        <section className="submitBtnSection">
                            <Button className='submitBtn' type="primary" htmlType="submit"> Submit</Button>
                            <Link to="/register">Not a user | Sign-Up</Link>
                        </section>
                    </Form.Item>
                </Form>
            </section>
        </Layout>
    )
}

export default Login
