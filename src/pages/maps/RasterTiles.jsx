import { useEffect, useState, useReducer } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Helmet, HelmetProvider } from 'react-helmet-async'

import { getRasterTile } from '../../api'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

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
  }),
  { name: 'RasterTiles' }
)

const RasterTiles = props => {
  const classes = useStyles(props)

  const [rasterTile, setRasterTile] = useState(null)
  const [loading, setLoading] = useState(false)

  const newTile = () => {
    const getTile = async () => {
      setLoading(true)
      const tile = await getRasterTile()
      setRasterTile(tile)
      setLoading(false)
    }
    getTile()
  }

  return (
    <div className={classes.root}>
      <Button variant="contained" color="primary" onClick={newTile}>
        Give mappy
      </Button>
      {rasterTile && !loading ? <img src={rasterTile} /> : <div>loading</div>}
    </div>
  )
}

export default RasterTiles
