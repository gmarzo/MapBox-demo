// Mapbox API forward geocoding: https://docs.mapbox.com/api/search/geocoding/#forward-geocoding
// Mapbox API point of interest geocoding: https://docs.mapbox.com/api/search/geocoding/#point-of-interest-category-coverage

import { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import clsx from 'clsx'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import IconButton from '@material-ui/core/IconButton'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import NativeSelect from '@material-ui/core/NativeSelect'

import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import RoomIcon from '@material-ui/icons/Room'

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

    header: {
      display: 'flex',
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },

    searchContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: '80vw',
      height: '80vh',
      backgroundColor: '#e1e0d6',
    },

    fieldContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      minWidth: '100%',
    },

    mapContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '100%',
      minHeight: '60%',
    },

    categorySelect: {
      backgroundColor: '#ffffff',
      border: '2px solid #000000',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '70vw',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },

    addressInput: {
      backgroundColor: '#ffffff',
      border: '2px solid #000000',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '70vw',
    },

    entryTitle: {
      display: 'flex',
      justifyContent: 'flex-start',
      fontFamily: 'Open Sans',
      color: '#000000',
      paddingLeft: '5vw',
    },

    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '100%',
    },

    searchButton: {
      marginTop: theme.spacing(2),
    },

    markerColor: {
      fill: 'red',
      height: 25,
      width: 25,
    },

    blackText: {
      color: 'black',
    },
  }),
  { name: 'ByPOI' }
)

const ByPOI = props => {
  const classes = useStyles(props)

  const { mapDispatch, mapState, PAGE_ACTIONS } = props

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
        <div className={classes.header}>
          <IconButton
            onClick={() => mapDispatch({ type: PAGE_ACTIONS.SET_PAGE, payload: { page: 'home' } })}
          >
            <ArrowBackIcon />
          </IconButton>
        </div>

        <Typography variant="h4" className={classes.entryTitle}>
          Category
        </Typography>
        <div className={classes.fieldContainer}>
          <NativeSelect
            name="Category"
            value={searchCategory}
            className={classes.categorySelect}
            onChange={handleChange}
            inputProps={{ name: 'Category' }}
          >
            <option aria-label="---" value="" />
            {CATEGORIES.map((category, index) => {
              return (
                <option key={index} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              )
            })}
          </NativeSelect>
        </div>

        <Typography variant="h4" className={classes.entryTitle}>
          Address
        </Typography>
        <div className={classes.fieldContainer}>
          <TextField
            fullWidth
            name="Address"
            value={address}
            variant="standard"
            className={classes.addressInput}
            onChange={handleChange}
          />
        </div>

        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => getPOIs()}
            className={classes.searchButton}
            disabled={!searchCategory || !address}
          >
            Search
          </Button>
        </div>

        {loading ? (
          <></>
        ) : (
          <div className={classes.mapContainer}>
            <Map
              initialViewState={{
                latitude: addressCoords[0].center[1],
                longitude: addressCoords[0].center[0],
                zoom: 12,
              }}
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: '75%',
                height: '90%',
                marginTop: '30px',
                marginBottom: '30px',
              }}
              mapStyle="mapbox://styles/mapbox/streets-v9"
              mapboxAccessToken={ACCESS_TOKEN}
            >
              {pois.map((point, index) => {
                return (
                  <Marker key={index} latitude={point.center[1]} longitude={point.center[0]}>
                    <div>{point.text}</div>
                    <RoomIcon className={classes.markerColor} />
                  </Marker>
                )
              })}
            </Map>
          </div>
        )}
      </Paper>
    </div>
  )
}

export default ByPOI
