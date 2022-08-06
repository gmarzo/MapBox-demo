const ACCESS_TOKEN =
  'pk.eyJ1IjoiZ21hcnpvIiwiYSI6ImNsNmd6amZpbzAzMmYzY3ByMDU3N283bWMifQ.DAN_IyL5mXxlGWF2t2AYxA'

const defaultAddress = '1%20lmu%20drive'

const getMap = async address => {
  const formattedAddress = address.split(' ').join('%20')
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${
      address ? formattedAddress : defaultAddress
    }.json?&access_token=${ACCESS_TOKEN}`
  )
  return response.json()
}

export { getMap, ACCESS_TOKEN }
