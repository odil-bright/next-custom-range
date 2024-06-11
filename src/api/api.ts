const baseURL = "https://24ee90b8-0c31-457e-b64f-ea922c8af629.mock.pstmn.io";

export const apiGet = async (
  endpoint: string,
  pathId?: string,
  urlParams?: object,
  hasPathId: boolean = true
) => {
  const path = buildURL(endpoint);
  const response = await fetch(path, {
    method: "GET",
  }).catch((err: Error) => {
    throw err;
  });

  if (response.status >= 200 && response.status < 300) {
    return await response?.json();
  } else {
    throw new Error(response.statusText);
  }
};

function buildURL(endpoint: string) {
  return baseURL + endpoint;
}
