// Mapbox API forward geocoding: https://docs.mapbox.com/api/search/geocoding/#forward-geocoding
// Mapbox API point of interest geocoding: https://docs.mapbox.com/api/search/geocoding/#point-of-interest-category-coverage

import { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import BackArrowIcon from '@material-ui/icons/ArrowBack'

import { getDirections } from '../../api'

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
      minWidth: '75vw',
      minHeight: '80vh',
      backgroundColor: '#e1e0d6',
    },

    searchContainer: {
      display: 'flex',
      flexDirection: 'column',
      flex: 0,
      alignItems: 'flex-start',
      justifyContent: 'center',
      minWidth: '80%',
    },

    routeContainer: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      minWidth: '100%',
    },

    textField: {
      minWidth: '100%',
      marginTop: theme.spacing(1),
      backgroundColor: 'white',
      border: '2px solid #000000',
      fontFamily: 'Open sans',
    },

    searchButton: {
      marginTop: theme.spacing(1.5),
      marginBottom: theme.spacing(1),
    },

    routeItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      minWidth: '60vw',
      backgroundColor: 'white',
      border: '1px solid #000000',
    },

    topMargin: {
      marginTop: theme.spacing(2),
    },
  }),
  { name: 'Directions' }
)

const Directions = props => {
  const classes = useStyles(props)

  const METERS_TO_MILES = 0.000621371

  const { mapDispatch, mapState, PAGE_ACTIONS } = props

  const [start, setStart] = useState(mapState.directions.start)
  const [destination, setDestination] = useState(mapState.directions.destination)
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(false)

  const handleChange = event => {
    switch (event.target.name) {
      case 'start':
        setStart(event.target.value)
        break
      case 'destination':
        setDestination(event.target.value)
        break
      default:
    }
  }

  useEffect(() => {
    const wayfinder = async () => {
      setLoading(true)
      const directions = await getDirections(start, destination)
      setRoutes(directions.routes)
      setLoading(false)
    }
    if (start && destination) {
      wayfinder()
    }
  }, [])

  const generateRoute = () => {
    const wayfinder = async () => {
      setLoading(true)
      const directions = await getDirections(start, destination)
      setRoutes(directions.routes)
      console.log(directions.routes)
      setLoading(false)
    }
    wayfinder()
  }

  return (
    <div className={classes.root}>
      <Paper square elevation={3} className={classes.mainContainer}>
        <div className={classes.header}>
          <IconButton
            onClick={() =>
              mapDispatch({
                type: PAGE_ACTIONS.SET_PAGE,
                payload: { page: 'home', start: '', destination: '', directions: [] },
              })
            }
          >
            <BackArrowIcon />
          </IconButton>
        </div>
        <div className={classes.searchContainer}>
          <Typography variant="h5">Start</Typography>
          <TextField
            name="start"
            value={start}
            onChange={e => handleChange(e)}
            className={classes.textField}
          />
          <Typography variant="h5" className={classes.topMargin}>
            Destination
          </Typography>
          <TextField
            name="destination"
            value={destination}
            onChange={e => handleChange(e)}
            className={classes.textField}
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={() => generateRoute()}
          className={classes.searchButton}
          disabled={!start || !destination}
        >
          Search button
        </Button>

        <div className={classes.routeContainer}>
          {routes && loading ? (
            <CircularProgress />
          ) : (
            <List>
              {routes.map((route, index) => {
                return (
                  <ListItem
                    button
                    key={index}
                    className={classes.routeItem}
                    onClick={() =>
                      mapDispatch({
                        type: PAGE_ACTIONS.SET_PAGE,
                        payload: {
                          page: 'route',
                          directions: {
                            start: `${start}`,
                            destination: `${destination}`,
                            directions: route.legs,
                          },
                        },
                      })
                    }
                  >
                    <ListItemText
                      primary={
                        route.duration <= 3600 ? (
                          <Typography variant="h5">{Math.ceil(route.duration / 60)} min</Typography>
                        ) : (
                          <Typography variant="h5">
                            {Math.floor(route.duration / 360)} hr {Math.ceil(route.duration / 60)}{' '}
                            min
                          </Typography>
                        )
                      }
                      //Using toLocaleString(): https://stackoverflow.com/questions/5731193/how-to-format-numbers
                      secondary={`${(route.distance * METERS_TO_MILES).toLocaleString(undefined, {
                        maximumFractionDigits: 1,
                      })} mi`}
                    />
                    <ListItemIcon>
                      <ChevronRightIcon />
                    </ListItemIcon>
                  </ListItem>
                )
              })}
            </List>
          )}
        </div>
      </Paper>
    </div>
  )
}

export default Directions
