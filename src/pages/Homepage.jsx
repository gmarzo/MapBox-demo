import { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'

import Map from 'react-map-gl'

import { getMap, ACCESS_TOKEN } from '../api'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '100vh',
    },

    locationContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      minHeight: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },

    textField: {
      minWidth: '80%',
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
      <TextField
        variant="outlined"
        className={classes.textField}
        label="Address"
        value={query}
        onChange={handleFieldChange}
      />
      <Button variant="contained" color="primary" onClick={() => newMap()}>
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
              style={{ width: 350, height: 300 }}
              mapStyle="mapbox://styles/mapbox/streets-v9"
              mapboxAccessToken={ACCESS_TOKEN}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Homepage
