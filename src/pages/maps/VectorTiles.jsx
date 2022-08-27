import { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { getVectorTile } from '../../api'

import DeckGL from '@deck.gl/react'
import { MVTLayer } from '@deck.gl/geo-layers'

import clsx from 'clsx'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import NativeSelect from '@material-ui/core/NativeSelect'
import Slider from '@material-ui/core/Slider'
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
      height: undefined,
      width: '70%',
      aspectRatio: 1 / 1,
    },

    mapButton: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
    },

    mapContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '800px',
      width: '420px',
      backgroundColor: '#e1e0d6',
    },

    tileContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },

    select: {
      width: '80%',
      height: '30px',
      backgroundColor: 'white',
      fontFamily: 'Open sans',
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

    fieldTitleContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      minWidth: '80%',
    },

    fieldTitle: {
      fontFamily: 'Open Sans',
      fontSize: '1.5rem',
    },

    topMargin: {
      marginTop: theme.spacing(2),
    },

    slider: {
      width: '80%',
    },
  }),
  { name: 'VectorTiles' }
)

const VectorTiles = props => {
  const classes = useStyles(props)

  const MAX_ZOOM = 30
  const { mapDispatch, mapState, PAGE_ACTIONS } = props

  const [vectorTile, setVectorTile] = useState(null)
  const [loading, setLoading] = useState(false)

  const [zoom, setZoom] = useState(0)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const newTile = () => {
    const getTile = async () => {
      setLoading(true)
      const tile = await getVectorTile(zoom, x, y)
      setVectorTile(tile)
      setLoading(false)
    }
    getTile()
  }

  const handleChange = event => {
    switch (event.target.name) {
      case 'Zoom':
        setZoom(Number(event.target.value))
        setX(0)
        setY(0)
        break
      case 'X':
        setX(Number(event.target.value))
        break
      case 'Y':
        setY(Number(event.target.value))
        break
      default:
        break
    }
  }

  const xSliderChange = (event, newValue) => {
    setX(newValue)
  }

  const ySliderChange = (event, newValue) => {
    setY(newValue)
  }

  const layer = new MVTLayer({
    data: vectorTile,

    minZoom: 0,
    maxZoom: 23,
    getLineColor: [192, 192, 192],
    getFillColor: [140, 170, 180],

    getLineWidth: f => {
      switch (f.properties.class) {
        case 'street':
          return 6
        case 'motorway':
          return 10
        default:
          return 1
      }
    },
    lineWidthMinPixels: 1,
  })

  return (
    <div className={classes.root}>
      <Paper square elevation={3} className={classes.mapContainer}>
        <div className={classes.header}>
          <IconButton
            onClick={() => mapDispatch({ type: PAGE_ACTIONS.SET_PAGE, payload: { page: 'home' } })}
          >
            <ArrowBackIcon />
          </IconButton>
        </div>

        <div className={classes.fieldTitleContainer}>
          <Typography variant="h5" className={classes.fieldTitle}>
            Zoom Level
          </Typography>
        </div>
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

        <div className={clsx(classes.fieldTitleContainer, classes.topMargin)}>
          <Typography variant="h5" className={classes.fieldTitle}>
            X: {x}
          </Typography>
        </div>

        <Slider
          defaultValue={0}
          name="xSlider"
          value={x}
          step={1}
          min={0}
          max={2 ** zoom - 1}
          className={classes.slider}
          onChange={xSliderChange}
          marks={
            zoom === 0
              ? [{}]
              : [
                  { value: 0, label: '0' },
                  { value: 2 ** zoom - 1, label: `${2 ** zoom - 1}` },
                ]
          }
          disabled={zoom === 0}
        />

        <div className={clsx(classes.fieldTitleContainer, classes.topMargin)}>
          <Typography variant="h5" className={classes.fieldTitle}>
            Y: {y}
          </Typography>
        </div>

        <Slider
          defaultValue={0}
          name="ySlider"
          value={y}
          step={1}
          min={0}
          max={2 ** zoom - 1}
          className={classes.slider}
          onChange={ySliderChange}
          marks={
            zoom === 0
              ? [{}]
              : [
                  { value: 0, label: '0' },
                  { value: 2 ** zoom - 1, label: `${2 ** zoom - 1}` },
                ]
          }
          disabled={zoom === 0}
        />

        <Button variant="contained" color="primary" onClick={newTile} className={classes.mapButton}>
          Generate Tile
        </Button>

        <div name="tileContainer" className={classes.tileContainer}>
          {vectorTile && !loading ? (
            // <img
            //   src={
            //     'https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/1/0/0.mvt?access_token=pk.eyJ1IjoiZ21hcnpvIiwiYSI6ImNsNmd6amZpbzAzMmYzY3ByMDU3N283bWMifQ.DAN_IyL5mXxlGWF2t2AYxA'
            //   }
            //   className={classes.tile}
            // />
            <DeckGL viewState={VectorTiles} layers={[layer]} />
          ) : (
            <></>
          )}
        </div>
      </Paper>
    </div>
  )
}

export default VectorTiles
