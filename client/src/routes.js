import App from './pages/App'
import WeatherControl from './pages/WeatherControl'

const routes = [{
    path: '/',
    component: App,
    indexRoute: { component: WeatherControl },
    childRoutes: [
        //{ path: 'signin', component: Signin },
    ]
}]

export default routes