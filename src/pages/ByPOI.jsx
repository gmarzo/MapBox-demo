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

import { getMapByAddress, getMapByPOI, ACCESS_TOKEN } from '../api'

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

    searchContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '80vw',
      height: '80vh',
    },

    categorySelect: {
      backgroundColor: '#ffffff',
      border: '2px solid #000000',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '70vw',
    },

    addressInput: {
      backgroundColor: '#ffffff',
      border: '2px solid #000000',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: '70vw',
    },
  }),
  { name: 'ByPOI' }
)

const ByPOI = props => {
  const classes = useStyles(props)

  const [loading, setLoading] = useState(true)
  const [searchCategory, setSearchCategory] = useState('')
  const [address, setAddress] = useState('')
  const [pois, setPois] = useState(null)
  const [addressCoords, setAddressCoords] = useState(null)

  const getPOIs = () => {
    const getPoints = async () => {
      setLoading(true)
      const data = await getMapByPOI(searchCategory, address)
      console.log('POIs: ', data.features)
      setPois(data.features)
      const coords = await getMapByAddress(address)
      console.log('Address coords: ', coords.features)
      setAddressCoords(coords.features)
      setLoading(false)
    }

    // const getMapCenter = async () => {
    //   const coords = await getMapByAddress(address)
    //   console.log('Address coords: ', coords.features)
    //   setAddressCoords(coords.features)
    //   setLoading(false)
    // }

    getPoints()
    // getMapCenter()
  }

  const handleChange = event => {
    switch (event.target.name) {
      case 'Category':
        setSearchCategory(event.target.value)
        break
      case 'Address':
        setAddress(event.target.value)
        break
      default:
    }
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.searchContainer}>
        {searchCategory}
        <NativeSelect
          name="Category"
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

        <TextField
          fullWidth
          name="Address"
          value={address}
          variant="standard"
          className={classes.addressInput}
          onChange={handleChange}
        />

        <Button variant="contained" color="primary" onClick={() => getPOIs()}>
          Search
        </Button>

        {loading ? (
          <CircularProgress />
        ) : (
          <Map
            initialViewState={{
              latitude: addressCoords[0].center[1],
              longitude: addressCoords[0].center[0],
              zoom: 12,
            }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              flex: 1,
              minHeight: '50vh',
              width: '60vw',
              marginTop: '1vh',
              marginBottom: '2vh',
            }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={ACCESS_TOKEN}
          >
            {pois.map((point, index) => {
              return <Marker key={index} latitude={point.center[1]} longitude={point.center[0]} />
            })}
          </Map>
        )}
      </Paper>
    </div>
  )
}

export default ByPOI
