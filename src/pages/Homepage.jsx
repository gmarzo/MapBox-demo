import { useEffect, useState, useReducer } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Helmet, HelmetProvider } from 'react-helmet-async'

import ByAddress from './ByAddress'
import ByPOI from './ByPOI'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import HomeIcon from '@material-ui/icons/Home'
import MapIcon from '@material-ui/icons/Map'
import RoomIcon from '@material-ui/icons/Room'
import SearchIcon from '@material-ui/icons/Search'

import { Map, Marker, FullscreenControl } from 'react-map-gl'
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
      minWidth: '100vw',
      background:
        'linear-gradient(32deg, rgba(78,67,255,1) 0%, rgba(128,128,255,1) 24%, rgba(0,212,255,1) 100%)',
    },

    locationContainer: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '80vh',
      minWidth: '75vw',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing(1),
      backgroundColor: '#e1e0d6',
    },

    textField: {
      minWidth: '60%',
      fontFamily: 'Open Sans',
      marginTop: theme.spacing(1),
      backgroundColor: '#ffffff',
      border: '2px solid #000000',
    },

    mapContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: '75vw',
      minHeight: '80vh',
      backgroundColor: '#d6d6d6',
    },

    buttonContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      minWidth: '75vw',
      minHeight: '80vh',
    },

    title: {
      fontFamily: 'Open Sans',
      fontWeight: 'bold',
    },

    logo: {
      display: 'flex',
      flex: 0,
      height: '30vh',
      width: '30vw',
    },

    //Buttons

    pageButton: {
      fontFamily: 'Open sans',
      margin: theme.spacing(0.3),
      color: '#000000',
    },

    buttonPaper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '60vw',
    },

    buttonIcon: {
      width: 45,
      height: 45,
      marginLeft: theme.spacing(1),
    },

    buttonText: {
      marginLeft: theme.spacing(1),
    },
  }),
  { name: 'Homepage' }
)

const PAGE_ACTIONS = {
  SET_PAGE: 'set-page',
}

const reducer = (state, action) => {
  switch (action.type) {
    case PAGE_ACTIONS.SET_PAGE:
      return { ...state, ...action.payload }
  }
}

const initialState = {
  page: '',
}
const contentMapping = {
  address: ByAddress,
  poi: ByPOI,
}

const Homepage = props => {
  const classes = useStyles(props)

  const [state, dispatch] = useReducer(reducer, initialState)

  const Content = contentMapping[state.page]
  return (
    <div className={classes.root}>
      <HelmetProvider>
        <Helmet>
          <title>Mapbox | Homepage</title>
        </Helmet>

        {Content ? (
          <Content mapDispatch={dispatch} mapState={state} PAGE_ACTIONS={PAGE_ACTIONS} />
        ) : (
          <Paper square elevation={3} className={classes.locationContainer}>
            <Typography variant="h2" className={classes.title}>
              Mapbox-Demo
            </Typography>
            <MapIcon className={classes.logo} />
            <div className={classes.buttonContainer}>
              <IconButton
                onClick={() =>
                  dispatch({ type: PAGE_ACTIONS.SET_PAGE, payload: { page: 'address' } })
                }
                className={classes.pageButton}
              >
                <Paper square className={classes.buttonPaper}>
                  <Typography variant="h5" className={classes.buttonText}>
                    Search by Address
                  </Typography>
                  <HomeIcon className={classes.buttonIcon} />
                </Paper>
              </IconButton>

              <IconButton
                onClick={() => dispatch({ type: PAGE_ACTIONS.SET_PAGE, payload: { page: 'poi' } })}
                className={classes.pageButton}
              >
                <Paper square className={classes.buttonPaper}>
                  <Typography variant="h5" className={classes.buttonText}>
                    Search by Point of Interest
                  </Typography>
                  <SearchIcon className={classes.buttonIcon} />
                </Paper>
              </IconButton>
            </div>
          </Paper>
        )}
      </HelmetProvider>
    </div>
  )
}

export default Homepage
