import { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { getRasterTile } from '../../api'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import NativeSelect from '@material-ui/core/NativeSelect'
import Typography from '@material-ui/core/Typography'

import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import HomeIcon from '@material-ui/icons/Home'
import MapIcon from '@material-ui/icons/Map'
import SearchIcon from '@material-ui/icons/Search'

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

    tile: {
      height: '300px',
      width: '300px',
    },

    mapButton: {
      marginBottom: theme.spacing(1),
    },

    mapContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minWidth: '75vw',
      minHeight: '80vh',
      backgroundColor: '#e1e0d6',
    },

    select: {
      width: '80%',
      height: '30px',
      backgroundColor: 'white',
      marginBottom: theme.spacing(0.5),
    },

    header: {
      display: 'flex',
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
    },
  }),
  { name: 'RasterTiles' }
)

const RasterTiles = props => {
  const classes = useStyles(props)

  const MAX_ZOOM = 18
  const { mapDispatch, mapState, PAGE_ACTIONS } = props

  const [rasterTile, setRasterTile] = useState(null)
  const [loading, setLoading] = useState(false)

  const [zoom, setZoom] = useState(0)
  const [x, setX] = useState(null)
  const [y, setY] = useState(null)

  const newTile = () => {
    const getTile = async () => {
      setLoading(true)
      const tile = await getRasterTile(zoom, x, y)
      setRasterTile(tile)
      setLoading(false)
    }
    getTile()
  }

  const handleChange = event => {
    //console.log('That was most unkind sir')
    switch (event.target.name) {
      case 'Zoom':
        setZoom(event.target.value)
        setX(0)
        setY(0)
        break
      case 'X':
        setX(event.target.value)
        break
      case 'Y':
        setY(event.target.value)
        break
      default:
        break
    }
  }

  return (
    <div className={classes.root}>
      <Paper elevation={3} className={classes.mapContainer}>
        <div className={classes.header}>
          <IconButton
            onClick={() => mapDispatch({ type: PAGE_ACTIONS.SET_PAGE, payload: { page: 'home' } })}
          >
            <ArrowBackIcon />
          </IconButton>
        </div>

        <Typography>Zoom</Typography>
        <NativeSelect
          name="Zoom"
          value={zoom}
          onChange={e => handleChange(e)}
          className={classes.select}
        >
          {Array.from(Array(MAX_ZOOM).keys()).map(zoom => (
            <option key={zoom} value={zoom}>
              {zoom}
            </option>
          ))}
        </NativeSelect>

        <Typography>X</Typography>
        <NativeSelect name="X" value={x} onChange={e => handleChange(e)} className={classes.select}>
          {Array.from(Array(2 ** zoom).keys()).map(x => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </NativeSelect>

        <Typography>Y</Typography>
        <NativeSelect name="Y" value={y} onChange={e => handleChange(e)} className={classes.select}>
          {Array.from(Array(2 ** zoom).keys()).map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </NativeSelect>

        <Button variant="contained" color="primary" onClick={newTile} className={classes.mapButton}>
          Give mappy
        </Button>

        {rasterTile && !loading ? (
          <img src={rasterTile} className={classes.tile} />
        ) : (
          <CircularProgress />
        )}
      </Paper>
    </div>
  )
}

export default RasterTiles
