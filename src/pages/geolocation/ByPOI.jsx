// Mapbox API forward geocoding: https://docs.mapbox.com/api/search/geocoding/#forward-geocoding
// Mapbox API point of interest geocoding: https://docs.mapbox.com/api/search/geocoding/#point-of-interest-category-coverage

import { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import clsx from 'clsx'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import NativeSelect from '@material-ui/core/NativeSelect'
import Paper from '@material-ui/core/Paper'
import Slider from '@material-ui/core/Slider'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import RoomIcon from '@material-ui/icons/Room'

import { Map, Marker, Popup } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'

import CATEGORIES from '../../common/categories'

import { getMapByAddress, getMapByPOI, ACCESS_TOKEN } from '../../api'

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

    inputContainer: {
      display: 'flex',
      flex: 0,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      width: '100%',
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
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
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
      marginLeft: theme.spacing(3),
    },

    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '100%',
    },

    searchSliderContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: '100%',
    },

    slider: {
      display: 'flex',
      width: '80%',
      marginLeft: theme.spacing(5),
      marginRight: theme.spacing(3),
    },

    searchButton: {
      marginTop: theme.spacing(2),
    },

    marker: {
      fill: 'red',
      height: 35,
      width: 35,
    },

    blackText: {
      color: 'black',
    },

    topMargin: {
      marginTop: theme.spacing(2),
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
  const [popupPoint, setPopupPoint] = useState(null)
  const [popupOpen, setPopupOpen] = useState(false)
  const [sliderValue, setSliderValue] = useState(1)

  const getPOIs = () => {
    const getPoints = async () => {
      setLoading(true)
      const data = await getMapByPOI(searchCategory, address, sliderValue)
      console.log('POIs: ', data.features)
      setPois(data.features)
      const coords = await getMapByAddress(address)
      setAddressCoords(coords.features)
      setLoading(false)
    }

    getPoints()
  }

  const handleChange = event => {
    switch (event.target.name) {
      case 'Category':
        setSearchCategory(event.target.value)
        break
      case 'Address':
        setAddress(event.target.value)
        break
      case 'slider':
        setSliderValue(event.target.value)
        break
      default:
    }
  }

  const sliderChange = (event, newValue) => {
    setSliderValue(newValue)
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

        <div className={classes.inputContainer}>
          <Typography variant="h4" className={classes.entryTitle}>
            Search for...
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
            Nearby to...
          </Typography>
          <div className={classes.fieldContainer}>
            <TextField
              fullWidth
              name="Address"
              placeholder="12345 Main St, City, State"
              value={address}
              variant="standard"
              className={classes.addressInput}
              onChange={handleChange}
            />
          </div>

          <div className={classes.searchSliderContainer}>
            <Typography variant="h4" className={clsx(classes.entryTitle, classes.topMargin)}>
              Limit: {sliderValue}
            </Typography>
            <Slider
              defaultValue={1}
              name="slider"
              value={sliderValue}
              step={1}
              min={1}
              max={10}
              className={classes.slider}
              onChange={sliderChange}
              marks={[
                { value: 1, label: '1' },
                { value: 10, label: '10' },
              ]}
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
                  <div key={point.id}>
                    <Marker
                      key={index}
                      latitude={point.center[1]}
                      longitude={point.center[0]}
                      //onClick={() => setPopupOpen({ ...popupOpen, popupOpen[point._id]: true })}
                      onClick={e => {
                        e.originalEvent.stopPropagation()
                        setPopupPoint(point)
                        setPopupOpen(true)
                      }}
                    >
                      <RoomIcon className={classes.marker} />
                    </Marker>
                    {popupOpen && (
                      <Popup
                        key={`popup-${index}`}
                        longitude={popupPoint.center[0]}
                        latitude={popupPoint.center[1]}
                        anchor="bottom"
                        onClose={() => setPopupOpen(false)}
                      >
                        <Typography>{popupPoint.text}</Typography>
                        <Typography>{popupPoint.properties.address}</Typography>
                      </Popup>
                    )}
                  </div>
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
