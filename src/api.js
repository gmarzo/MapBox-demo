const ACCESS_TOKEN =
  'pk.eyJ1IjoiZ21hcnpvIiwiYSI6ImNsNmd6amZpbzAzMmYzY3ByMDU3N283bWMifQ.DAN_IyL5mXxlGWF2t2AYxA'

const DEFAULT_ADDRESS = '1%20lmu%20drive'

//Geocoding Calls
const getMapByAddress = async address => {
  const formattedAddress = address.split(' ').join('%20')
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${
      address ? formattedAddress : DEFAULT_ADDRESS
    }.json?&access_token=${ACCESS_TOKEN}&limit=1`
  )
  return response.json()
}

const getMapByPOI = async (category, address, limit) => {
  const locations = await getMapByAddress(address)
  const location = locations.features[0].geometry.coordinates

  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${category}.json?type=poi&proximity=${location}&access_token=${ACCESS_TOKEN}&limit=${limit}`
  )
  return response.json()
}

//Raster Tile

const getRasterTile = async (zoom, x, y) => {
  const response = await fetch(
    `https://api.mapbox.com/v4/mapbox.satellite/${zoom}/${x}/${y}@2x.jpg90?access_token=${ACCESS_TOKEN}`
  )
  return response.url
}

//Navigation

const getDirections = async (start, destination) => {
  const startCoords = await getMapByAddress(start)
  const journeyStart = startCoords.features[0].geometry.coordinates

  const destinationCoords = await getMapByAddress(destination)
  const journeyEnd = destinationCoords.features[0].geometry.coordinates

  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${journeyStart[0]},${journeyStart[1]};${journeyEnd[0]},${journeyEnd[1]}?alternatives=true&steps=true&access_token=${ACCESS_TOKEN}`
  )

  return response.json()
}

export { getMapByAddress, getMapByPOI, getRasterTile, getDirections, ACCESS_TOKEN }
