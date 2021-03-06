export async function getPageData(that, path) {
  // TODO: Figure out config for browser, b/c browser can't access node-config
  const res = await that.fetch(`${process.env.url}${path}.json`)
  if (res.ok) {
    return await res.json()
  } else if (res.status === 403 || res.status === 404) {
    that.error(404, "Oops! We can't find the record you seek.")
  } else {
    that.error(res.status, "Oops! Something went wrong.")
  }
}
