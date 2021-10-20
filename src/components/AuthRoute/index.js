import { Redirect, Route } from 'react-router'
import { isAuth } from '../../utils'

const AuthRoute = ({ component: Component, ...rest }) => {
  // return a route component but add some functions to it
  // if auth, then render the component, if not render redirect component
  return (
    <Route
      {...rest}
      render={(props) => {
        const isLogin = isAuth()

        if (isLogin) {
          return <Component />
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      }}
    ></Route>
  )
}

export default AuthRoute
