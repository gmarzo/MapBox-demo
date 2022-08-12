import { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Helmet, HelmetProvider } from 'react-helmet-async'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'

import { Map, Marker } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'

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

    locationContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      minHeight: '100%',
      minWidth: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing(1),
    },

    textField: {
      minWidth: '60%',
      fontFamily: 'Open Sans',
      marginTop: theme.spacing(1),
      backgroundColor: '#ffffff',
      border: '2px solid #000000',
    },

    newMapButton: {
      width: '50%',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },

    mapContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: '75vw',
      minHeight: '80vh',
      backgroundColor: '#d6d6d6',
    },
  }),
  { name: 'Homepage' }
)

const ByAddress = props => {
  const classes = useStyles(props)

  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const getStuff = async () => {
      const map = await getMapByAddress(query)
      console.log(JSON.stringify(map, null, 2))
      setLocation(map.features[0])
      setLoading(false)
    }
    getStuff()
  }, [])

  const newMap = () => {
    const getNewMap = async () => {
      setLoading(true)
      const map = await getMapByAddress(query)
      setLocation(map.features[0])
      setLoading(false)
    }
    getNewMap()
  }

  const handleFieldChange = event => {
    const request = event.target.value
    setQuery(request)
  }

  return (
    <div className={classes.root}>
      <HelmetProvider>
        <Helmet>
          <title>Mapbox | Homepage</title>
        </Helmet>

        <Paper square elevation={3} className={classes.mapContainer}>
          <TextField
            variant="filled"
            className={classes.textField}
            label="Address"
            value={query}
            onChange={handleFieldChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => newMap()}
            className={classes.newMapButton}
          >
            New address
          </Button>
          {/* <div>{location !== '' ? <p>You are here...</p> : <></>}</div> */}
          <div>
            {loading ? (
              <CircularProgress />
            ) : (
              <div className={classes.locationContainer}>
                <div>{location.text}</div>
                <div>
                  ({location.geometry.coordinates[0]}, {location.geometry.coordinates[1]})
                </div>
                <Map
                  initialViewState={{
                    longitude: location.geometry.coordinates[0],
                    latitude: location.geometry.coordinates[1],
                    zoom: 14,
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flex: 1,
                    minHeight: '60vh',
                    width: '50vw',
                    marginTop: '1vh',
                    marginBottom: '2vh',
                  }}
                  mapStyle="mapbox://styles/mapbox/streets-v9"
                  mapboxAccessToken={ACCESS_TOKEN}
                >
                  <Marker
                    latitude={location.geometry.coordinates[1]}
                    longitude={location.geometry.coordinates[0]}
                    pitchAlignment="map"
                    anchor="bottom"
                  />
                </Map>
              </div>
            )}
          </div>
        </Paper>
      </HelmetProvider>
    </div>
  )
}

export default ByAddress
