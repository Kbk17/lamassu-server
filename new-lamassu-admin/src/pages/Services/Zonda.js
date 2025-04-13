import { useMutation, useQuery } from '@apollo/react-hooks'
import { makeStyles, Grid } from '@material-ui/core'
import gql from 'graphql-tag'
import * as R from 'ramda'
import React, { useState } from 'react'
import * as Yup from 'yup'

import Modal from 'src/components/Modal'
import SecretInputFormik from 'src/components/inputs/formik/SecretInput'
import TextInputFormik from 'src/components/inputs/formik/TextInput'
import SingleRowTable from 'src/components/single-row-table/SingleRowTable'
import { formatLong } from 'src/utils/string'
import FormRenderer from './FormRenderer'
import { secretTest } from './schemas/helper'

const GET_INFO = gql`
  query getData {
    accounts
    config
  }
`

const SAVE_ACCOUNT = gql`
  mutation Save($accounts: JSONObject) {
    saveAccounts(accounts: $accounts)
  }
`

const styles = {
  wrapper: {
    marginBottom: 24
  }
}

const useStyles = makeStyles(styles)

// Definiujemy schema Zondy bezpośrednio tutaj
const zondaSchema = {
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
      code: 'privateKey',
      display: 'Private Key',
      component: SecretInputFormik
    }
  ],
  getValidationSchema: account => {
    return Yup.object().shape({
      apiKey: Yup.string('The API key must be a string')
        .max(100, 'The API key is too long')
        .required('The API key is required'),
      privateKey: Yup.string('The private key must be a string')
        .max(100, 'The private key is too long')
        .test(secretTest(account?.privateKey, 'private key'))
    })
  }
};

const Zonda = () => {
  const [editingSchema, setEditingSchema] = useState(false)
  
  const { data } = useQuery(GET_INFO)
  const [saveAccount] = useMutation(SAVE_ACCOUNT, {
    onCompleted: () => setEditingSchema(false),
    refetchQueries: ['getData']
  })
  
  const classes = useStyles()
  const accounts = data?.accounts ?? {}
  const zondaAccount = accounts?.zonda || {}
  
  console.log("Zonda component render");
  console.log("Zonda account data:", zondaAccount);
  
  const getItems = (elements) => {
    const faceElements = R.filter(R.prop('face'))(elements);
    const values = zondaAccount || {};
    
    const result = R.map(({ display, code, long }) => ({
      label: display,
      value: long ? formatLong(values[code]) : values[code]
    }))(faceElements);
    
    return result;
  }
  
  const getElements = (elements) => {
    return R.map(elem => {
      if (elem.component !== SecretInputFormik) return elem;
      return {
        ...elem,
        inputProps: {
          isPasswordFilled:
            !R.isNil(zondaAccount) &&
            !R.isNil(R.path([elem.code], zondaAccount))
        }
      }
    }, elements);
  }
  
  const getAccounts = (elements) => {
    const account = zondaAccount;
    const filterBySecretComponent = R.filter(R.propEq('component', SecretInputFormik));
    const mapToCode = R.map(R.prop(['code']));
    const passwordFields = R.compose(
      mapToCode,
      filterBySecretComponent
    )(elements);
    
    return R.mapObjIndexed(
      (value, key) => (R.includes(key, passwordFields) ? '' : value),
      account
    );
  }
  
  return (
    <div className={classes.wrapper}>
      <Grid item>
        <SingleRowTable
          editMessage={'Configure Zonda (Exchange)'}
          title={'Zonda (Exchange)'}
          onEdit={() => setEditingSchema(true)}
          items={getItems(zondaSchema.elements)}
        />
      </Grid>
      
      {editingSchema && (
        <Modal
          title={`Edit ${zondaSchema.name}`}
          width={525}
          handleClose={() => setEditingSchema(false)}
          open={true}>
          <FormRenderer
            save={it =>
              saveAccount({
                variables: { accounts: { [zondaSchema.code]: it } }
              })
            }
            elements={getElements(zondaSchema.elements)}
            validationSchema={zondaSchema.getValidationSchema(zondaAccount)}
            value={getAccounts(zondaSchema.elements)}
          />
        </Modal>
      )}
    </div>
  )
}

export default Zonda 