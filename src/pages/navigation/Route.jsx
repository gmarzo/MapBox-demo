// Mapbox API forward geocoding: https://docs.mapbox.com/api/search/geocoding/#forward-geocoding
// Mapbox API point of interest geocoding: https://docs.mapbox.com/api/search/geocoding/#point-of-interest-category-coverage

import { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import BackArrowIcon from '@material-ui/icons/ArrowBack'
import RoomIcon from '@material-ui/icons/Room'

import { ACCESS_TOKEN, getMapByAddress } from '../../api'

import { Map, Marker, Source, Layer } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'

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
      minWidth: '100%',
    },

    mainContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '800px',
      width: '420px',
      backgroundColor: '#e1e0d6',
    },

    mapContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '90%',
      border: '1px solid black',
    },

    listContainer: {
      display: 'flex',
      flex: 1,
      maxWidth: '90%',
      height: '40%',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
    },

    list: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      overflowY: 'scroll',
    },

    instruction: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: '100%',
      backgroundColor: 'white',
      border: '1px solid black',
    },

    instructionText: {
      fontFamily: 'Open sans',
      fontSize: 18,
    },

    marker: {
      fill: 'red',
      height: 35,
      width: 35,
    },
  }),
  { name: 'Route' }
)

const Route = props => {
  const classes = useStyles(props)

  const { mapDispatch, mapState, PAGE_ACTIONS } = props

  const INSTRUCTIONS = mapState.directions.directions[0].steps

  const [loading, setLoading] = useState(true)
  const [startCoords, setStartCoords] = useState(null)
  const [destinationCoords, setDestinationCoords] = useState(null)
  const [checkpoints, setCheckpoints] = useState([])

  useEffect(() => {
    const getStartEnd = async () => {
      setLoading(true)
      const start = await getMapByAddress(mapState.directions.start)
      setStartCoords(start.features[0].center)
      const destination = await getMapByAddress(mapState.directions.end)
      setDestinationCoords(destination.features[0].center)
      setLoading(false)
    }

    const getCheckpoints = () => {
      const checkpoints = mapState.directions.directions[0].steps.map(leg => {
        return leg.intersections[0].location
      })
      setCheckpoints(checkpoints)
    }

    getStartEnd()
    getCheckpoints()
  }, [])

  const routeData = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: checkpoints,
    },
  }

  return (
    <div className={classes.root}>
      <Paper square elevation={3} className={classes.mainContainer}>
        <div className={classes.header}>
          <IconButton
            onClick={() =>
              mapDispatch({ type: PAGE_ACTIONS.SET_PAGE, payload: { page: 'directions' } })
            }
          >
            <BackArrowIcon />
          </IconButton>

          {/* <Button onClick={() => console.log(checkpoints)}>nut</Button> */}
        </div>

        <div className={classes.mapContainer}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Map
              initialViewState={{
                longitude: startCoords[0],
                latitude: startCoords[1],
                zoom: 12,
              }}
              mapStyle="mapbox://styles/mapbox/streets-v9"
              mapboxAccessToken={ACCESS_TOKEN}
            >
              <Marker longitude={startCoords[0]} latitude={startCoords[1]}>
                <RoomIcon className={classes.marker} />
              </Marker>

              {/* 
                Using layer, source, and the routeData: https://stackoverflow.com/questions/67842338/how-to-use-react-map-gl-to-draw-line-between-two-point
              */}

              <Source id="polylineLayer" type="geojson" data={routeData}>
                <Layer
                  id="polylineLayer"
                  type="line"
                  source="my-data"
                  layout={{
                    'line-join': 'round',
                    'line-cap': 'round',
                  }}
                  paint={{
                    'line-color': '#007cbf',
                    'line-width': 4,
                  }}
                />
              </Source>

              <Marker longitude={destinationCoords[0]} latitude={destinationCoords[1]}>
                <RoomIcon className={classes.marker} />
              </Marker>
            </Map>
          )}
        </div>

        <div className={classes.listContainer}>
          <List dense={true} className={classes.list}>
            {INSTRUCTIONS.map((instruction, index) => (
              <ListItem key={index} className={classes.instruction}>
                <ListItemText
                  primary={
                    <Typography className={classes.instructionText}>
                      {index + 1}. {instruction.maneuver.instruction}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Paper>
    </div>
  )
}

export default Route
