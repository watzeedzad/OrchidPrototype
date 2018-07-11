import App from './pages/App'
import WeatherControl from './pages/WeatherControl'
import PlanterAnalyze from './pages/PlanterAnalyze'
import FertilityControl from './pages/FertilityControl'
import Login from './pages/Login'
import WaterControl from './pages/WaterControl'
import FertilizerControl from './pages/FertilizerControl';

const routes = [{
    path: '/',
    component: App,
    indexRoute: { component: Login },
    childRoutes: [
        { path: 'weatherControl', component: WeatherControl },
        { path: 'planterAnalyze', component: PlanterAnalyze },
        { path: 'fertilityControl', component: FertilityControl },
        { path: 'waterControl', component: WaterControl },
        { path: 'fertilizerControl', component:FertilizerControl},
    ]
}]

export default routes