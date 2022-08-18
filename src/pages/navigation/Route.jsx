// Mapbox API forward geocoding: https://docs.mapbox.com/api/search/geocoding/#forward-geocoding
// Mapbox API point of interest geocoding: https://docs.mapbox.com/api/search/geocoding/#point-of-interest-category-coverage

import { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
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

    listContainer: {
      display: 'flex',
      maxWidth: '80%',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },

    instruction: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'white',
      border: '1px solid black',
      fontFamily: 'Open Sans',
    },
  }),
  { name: 'Route' }
)

const Route = props => {
  const classes = useStyles(props)

  const { mapDispatch, mapState, PAGE_ACTIONS } = props

  const INSTRUCTIONS = mapState.directions.directions[0].steps

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
        </div>

        <Button onClick={() => console.log(mapState.directions.directions)}>
          directions to console
        </Button>

        <div className={classes.listContainer}>
          <List dense={true}>
            {INSTRUCTIONS.map((instruction, index) => (
              <ListItem key={index} className={classes.instruction}>
                <ListItemText primary={`${index + 1}. ${instruction.maneuver.instruction}`} />
              </ListItem>
            ))}
          </List>
        </div>
      </Paper>
    </div>
  )
}

export default Route
