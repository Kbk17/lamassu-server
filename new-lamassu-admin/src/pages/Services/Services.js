import { useQuery, useMutation } from '@apollo/react-hooks'
import { makeStyles, Grid } from '@material-ui/core'
import gql from 'graphql-tag'
import * as R from 'ramda'
import React, { useState } from 'react'
import * as Yup from 'yup'

import Modal from 'src/components/Modal'
import { SecretInput } from 'src/components/inputs/formik'
import CheckboxInput from 'src/components/inputs/formik/Checkbox'
import TitleSection from 'src/components/layout/TitleSection'
import SingleRowTable from 'src/components/single-row-table/SingleRowTable'
import { formatLong } from 'src/utils/string'

import FormRenderer from './FormRenderer'
import schemas from './schemas'

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
    // widths + spacing is a little over 1200 on the design
    // this adjusts the margin after a small reduction on card size
    marginLeft: 1
  }
}

const useStyles = makeStyles(styles)

const Services = () => {
  const [editingSchema, setEditingSchema] = useState(null)

  const { data } = useQuery(GET_INFO)
  const [saveAccount] = useMutation(SAVE_ACCOUNT, {
    onCompleted: () => setEditingSchema(null),
    refetchQueries: ['getData']
  })

  const classes = useStyles()

  const accounts = data?.accounts ?? {}
  
  // Debug GraphQL data
  console.log("GraphQL data:", data);
  
  // Dodajemy więcej logów debugowania
  console.log("Available schemas:", schemas);
  console.log("Zonda schema:", schemas['zonda']);
  console.log("All schemas keys:", Object.keys(schemas));
  console.log("Services component render");

  const getItems = (code, elements) => {
    console.log(`Getting items for ${code}`, elements);
    
    if (!elements) {
      console.error(`No elements found for ${code}`);
      return [];
    }
    
    const faceElements = R.filter(R.prop('face'))(elements);
    console.log(`Face elements for ${code}:`, faceElements);
    
    const values = accounts[code] || {};
    console.log(`Values for ${code}:`, values);
    
    const result = R.map(({ display, code, long }) => ({
      label: display,
      value: long ? formatLong(values[code]) : values[code]
    }))(faceElements);
    
    console.log(`Final items for ${code}:`, result);
    return result;
  }

  const updateSettings = element => {
    const settings = element.settings
    const field = R.lensPath(['config', settings.field])
    const isEnabled = R.isNil(settings.requirement)
      ? true
      : R.equals(R.view(field, data), settings.requirement)
    settings.enabled = isEnabled
    return element
  }

  const getElements = ({ code, elements }) => {
    return R.map(elem => {
      if (elem.component === CheckboxInput) return updateSettings(elem)
      if (elem.component !== SecretInput) return elem
      return {
        ...elem,
        inputProps: {
          isPasswordFilled:
            !R.isNil(accounts[code]) &&
            !R.isNil(R.path([elem.code], accounts[code]))
        }
      }
    }, elements)
  }

  const getAccounts = ({ elements, code }) => {
    const account = accounts[code]
    const filterBySecretComponent = R.filter(R.propEq('component', SecretInput))
    const mapToCode = R.map(R.prop(['code']))
    const passwordFields = R.compose(
      mapToCode,
      filterBySecretComponent
    )(elements)
    return R.mapObjIndexed(
      (value, key) => (R.includes(key, passwordFields) ? '' : value),
      account
    )
  }

  const getValidationSchema = ({ code, getValidationSchema }) => {
    console.log("Getting validation schema for:", code);
    console.log("Schema object:", schemas[code]);
    console.log("getValidationSchema exists?", !!getValidationSchema);
    
    try {
      if (!getValidationSchema) {
        console.error(`Missing getValidationSchema for ${code}`);
        return Yup.object(); // Fallback do pustego schematu
      }
      return getValidationSchema(accounts[code]);
    } catch (error) {
      console.error(`Error getting validation schema for ${code}:`, error);
      return Yup.object(); // Fallback do pustego schematu
    }
  }

  return (
    <div className={classes.wrapper}>
      <TitleSection title="3rd Party Services" />
      <Grid container spacing={4}>
        {console.log("Schemas to render:", Object.keys(schemas))}
        {R.values(schemas).map(schema => {
          console.log("Rendering schema:", schema?.code);
          return (
            <Grid item key={schema.code}>
              <SingleRowTable
                editMessage={'Configure ' + schema.title}
                title={schema.title}
                onEdit={() => setEditingSchema(schema)}
                items={getItems(schema.code, schema.elements)}
              />
            </Grid>
          );
        })}
        
        {/* Wymuszenie renderowania Zondy w bardziej bezpośredni sposób */}
        <Grid item key="zonda-forced">
          <SingleRowTable
            editMessage={'Configure Zonda (Exchange)'}
            title={'Zonda (Exchange)'}
            onEdit={() => {
              console.log("Editing Zonda schema");
              console.log("Schema exists?", !!schemas['zonda']);
              if (schemas['zonda']) {
                setEditingSchema(schemas['zonda']);
              } else {
                console.error("Zonda schema not found!");
              }
            }}
            items={schemas['zonda'] ? getItems('zonda', schemas['zonda'].elements) : []}
          />
        </Grid>
      </Grid>
      {editingSchema && (
        <Modal
          title={`Edit ${editingSchema.name}`}
          width={525}
          handleClose={() => setEditingSchema(null)}
          open={true}>
          <FormRenderer
            save={it =>
              saveAccount({
                variables: { accounts: { [editingSchema.code]: it } }
              })
            }
            elements={getElements(editingSchema)}
            validationSchema={getValidationSchema(editingSchema)}
            value={getAccounts(editingSchema)}
          />
        </Modal>
      )}
    </div>
  )
}

export default Services
