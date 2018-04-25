import App from './pages/App'
import Home from './pages/Home'
import WeatherControl from './pages/WeatherControl'

const routes = [{
    path: '/',
    component: App,
    indexRoute: { component: WeatherControl },
    childRoutes: [
        { path: 'weatherControl', component: WeatherControl },
    ]
}]

export default routes