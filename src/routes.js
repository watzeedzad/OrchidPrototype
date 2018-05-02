import App from './pages/App'
import WeatherControl from './pages/WeatherControl'
import PlanterAnalyze from './pages/PlanterAnalyze'
import Login from './pages/Login'

const routes = [{
    path: '/',
    component: App,
    indexRoute: { component: Login },
    childRoutes: [
        { path: 'weatherControl', component: WeatherControl },
        { path: 'planterAnalyze', component: PlanterAnalyze }
    ]
}]

export default routes