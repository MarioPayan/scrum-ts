const BASE_URL = "https://api.giphy.com/v1/gifs/random"
const GIPHY_UNSECURED_API_KEY = "YaTFhcvsljeKlONk73uwnBfjkwf11GP4"

const getRandomGifUrl = async (keyWord = "celebration"): Promise<string> => {
  const url = `${BASE_URL}?api_key=${GIPHY_UNSECURED_API_KEY}&tag=${keyWord}&rating=g`
  const response = await fetch(url).then(response => response.json())
  return response?.data?.images?.original?.url || ""
}

export const getDefaultGifUrl = (): string => {
  return "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDUybHByNTAxZmJ3bnFtYzE3Y3F5eHN2ZjJ2emlwaTQwanh4Z3hieiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XeXzWgD6P4LG8/giphy.gif"
}

export default getRandomGifUrl