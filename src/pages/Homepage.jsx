import { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Helmet, HelmetProvider } from 'react-helmet-async'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'

import RoomIcon from '@material-ui/icons/Room'

import { Map, Marker } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'

import { getMap, ACCESS_TOKEN } from '../api'

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
    },

    locationContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      minHeight: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing(1),
    },

    textField: {
      minWidth: '80%',
    },

    newMapButton: {
      width: '80%',
    },
  }),
  { name: 'Homepage' }
)

const Homepage = props => {
  const classes = useStyles(props)

  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const getStuff = async () => {
      const map = await getMap(query)
      console.log(JSON.stringify(map, null, 2))
      setLocation(map.features[0])
      setLoading(false)
    }
    getStuff()
  }, [])

  const newMap = () => {
    const getNewMap = async () => {
      setLoading(true)
      const map = await getMap(query)
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

        <TextField
          variant="outlined"
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
        <div>{location !== '' ? <p>You are here...</p> : <></>}</div>
        <div>{location.place_name}</div>
        <div>
          {loading ? (
            <CircularProgress />
          ) : (
            <div className={classes.locationContainer}>
              ({location.geometry.coordinates[0]}, {location.geometry.coordinates[1]})
              <Map
                initialViewState={{
                  longitude: location.geometry.coordinates[0],
                  latitude: location.geometry.coordinates[1],
                  zoom: 14,
                }}
                style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '20rem' }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={ACCESS_TOKEN}
              >
                <Marker
                  latitude={location.geometry.coordinates[1]}
                  longitude={location.geometry.coordinates[0]}
                  anchor="center"
                >
                  {/* <RoomIcon /> */}
                </Marker>
              </Map>
            </div>
          )}
        </div>
      </HelmetProvider>
    </div>
  )
}

export default Homepage
