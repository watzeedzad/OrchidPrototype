import App from './pages/App'
import WeatherControl from './pages/WeatherControl'
import Login from './pages/Login'

const routes = [{
    path: '/',
    component: App,
    indexRoute: { component: Login },
    childRoutes: [
        { path: 'weatherControl', component: WeatherControl },
    ]
}]

export default routes