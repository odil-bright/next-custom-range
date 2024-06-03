export const apiGet = async (
  endpoint: string,
  pathId?: string,
  urlParams?: object,
  hasPathId: boolean = true
) => {
  const response = await fetch(endpoint, {
    method: 'GET'
  }).catch((err: Error) => {
    throw err
  })

  if (response.status >= 200 && response.status < 300) {
    return await response?.json()
  } else {
    throw new Error(response.statusText)
  }
}