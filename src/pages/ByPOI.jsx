import { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Helmet, HelmetProvider } from 'react-helmet-async'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import NativeSelect from '@material-ui/core/NativeSelect'

import { Map, Marker } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'

import CATEGORIES from '../common/categories'

import { getMapByAddress, ACCESS_TOKEN } from '../api'

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      minWidth: '100vw',
      background:
        'linear-gradient(32deg, rgba(78,67,255,1) 0%, rgba(128,128,255,1) 24%, rgba(0,212,255,1) 100%)',
    },

    categorySelect: {
      backgroundColor: '#ffffff',
      border: '2px solid #000000',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '40vw',
    },
  }),
  { name: 'ByPOI' }
)

const ByPOI = props => {
  const classes = useStyles(props)

  const [query, setQuery] = useState('')
  const [searchCategory, setSearchCategory] = useState('')

  //   useEffect(() => {
  //     const getStuff = async () => {
  //       const map = await getMapByAddress(query)
  //       console.log(JSON.stringify(map, null, 2))
  //     }
  //     getStuff()
  //   }, [])

  //   const newMap = () => {
  //     const getNewMap = async () => {
  //       const map = await getMapByAddress(query)
  //     }
  //     getNewMap()
  //   }
  const handleChange = event => {
    setSearchCategory(event.target.value)
  }

  return (
    <div className={classes.root}>
      {searchCategory}
      <NativeSelect
        value={searchCategory}
        className={classes.categorySelect}
        onChange={handleChange}
        inputProps={{ name: 'Category' }}
      >
        {CATEGORIES.map((category, index) => {
          return (
            <option key={index} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          )
        })}
      </NativeSelect>
    </div>
  )
}

export default ByPOI
