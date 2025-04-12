import * as Yup from 'yup'
import SecretInputFormik from 'src/components/inputs/formik/SecretInput'
import TextInputFormik from 'src/components/inputs/formik/TextInput'
import { secretTest } from './helper'

export default {
  code: 'zonda',
  name: 'Zonda',
  title: 'Zonda (Exchange)',
  elements: [
    {
      code: 'apiKey',
      display: 'API Key',
      component: TextInputFormik,
      face: true,
      long: true
    },
    {
      code: 'secret',
      display: 'Secret Key',
      component: SecretInputFormik
    }
  ],
  getValidationSchema: account => {
    return Yup.object().shape({
      apiKey: Yup.string()
        .max(100, 'The API key is too long')
        .required('The API key is required'),
      secret: Yup.string()
        .max(100, 'The secret key is too long')
        .test(secretTest(account?.secret, 'secret key'))
    })
  }
} 