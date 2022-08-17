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

const getMapByPOI = async (category, address) => {
  const locations = await getMapByAddress(address)
  const location = locations.features[0].geometry.coordinates

  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${category}.json?type=poi&proximity=${location}&access_token=${ACCESS_TOKEN}&limit=10`
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

export { getMapByAddress, getMapByPOI, getRasterTile, ACCESS_TOKEN }
