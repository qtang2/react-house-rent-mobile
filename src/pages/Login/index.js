import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'
import { withFormik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'
import { API, setToken } from '../../utils'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  // default account: test3 pw: test3
  // if get response code 400, try create a new user

  handleSubmit = async (e) => {
    e.preventDefault()

    const { username, password } = this.state

    const res = await API.post('/user/login', {
      username,
      password,
    })

    const { status, body, description } = res.data
    if (status === 200) {
      localStorage.setItem('houserent_token', body.token)
      this.props.history.go(-1)
    } else {
      Toast.info(description, 2)
    }
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}> Login </NavHeader>
        <WhiteSpace size='xl' />

        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name='username'
                placeholder='Username'
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            <ErrorMessage
              className={styles.error}
              name='username'
              component='div'
            />

            <div className={styles.formItem}>
              <Field
                className={styles.input}
                name='password'
                type='password'
                placeholder='Password'
              />
            </div>
            <ErrorMessage
              className={styles.error}
              name='password'
              component='div'
            />

            <div className={styles.formSubmit}>
              <button className={styles.submit} type='submit'>
                Login
              </button>
            </div>
          </Form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to='/registe'>Not a register~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}
Login = withFormik({
  // provide validation values
  mapPropsToValues: () => ({ username: '', password: '' }),
  // props is Login component props
  handleSubmit: async (values, { props }) => {
    const { username, password } = values

    const res = await API.post('/user/login', {
      username,
      password,
    })

    const { status, body, description } = res.data
    if (status === 200) {
      setToken(body.token)
      if (!props.location.state) {
        // means directly go to login page
        // then back to last page
        props.history.go(-1)
      } else {
        // means redirect to login page
        // need to back to previous page
        // use replace istead of push, since we dont wannt go to previous login page
        props.history.replace(props.location.state.from.pathname)
      }
    } else {
      Toast.info(description, 2)
    }
  },

  // form validation
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .matches(
        REG_UNAME,
        'username must between 5 to 8, is number, letter, underscore'
      ),
    password: Yup.string()
      .required('Password is required')
      .matches(
        REG_PWD,
        'password must between 5 to 12, is number, letter, underscore'
      ),
  }),
})(Login)
export default Login
