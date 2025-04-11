import * as Yup from 'yup'
import { SecretInput, TextInput } from 'src/components/inputs/formik'
import _ from 'lodash/fp'

const code = 'zonda'
const name = 'Zonda'
const title = 'Zonda Exchange'
const elements = [
  {
    code: 'apiKey',
    display: 'API Key',
    component: TextInput,
    face: true,
    long: true
  },
  {
    code: 'secret',
    display: 'API Secret',
    component: SecretInput,
    face: true
  },
  {
    code: 'currencyMarket',
    display: 'Currency Market',
    component: TextInput,
    face: true,
    default: 'PLN'
  }
]

const getValidationSchema = () =>
  Yup.object().shape({
    apiKey: Yup.string().required('Required'),
    secret: Yup.string().required('Required'),
    currencyMarket: Yup.string().required('Required')
  })

const REQUIRED_CONFIG_FIELDS = ['apiKey', 'secret', 'currencyMarket']

const loadConfig = (account) => {
  return {
    apiKey: account.apiKey,
    secret: account.secret,
    timeout: 3000,
    enableRateLimit: true
  }
}

export default {
  code,
  name,
  title,
  elements,
  getValidationSchema,
  loadConfig
} 