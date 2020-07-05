import axios from 'axios'
import { pigskit_restful_origin } from './service_origins'

axios.defaults.baseURL = pigskit_restful_origin()
axios.defaults.withCredentials = true

export default axios