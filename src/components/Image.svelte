<script lang="ts">
  /**
   * - Non-blocking Progressive loading: Loads a blank image at paint, then a
   *   low, then the final once visible
   *     - Why? Images, even jpg progressive, seems to block deferred js from loading
   * - lazy loading full quality only when visible
   * - Network-speed aware quality selection: Will load lower quality if poor network
   * - Viewport aware quality selection: Will load lower quality if small screen
   */
  import { onMount } from "svelte"
  import { getSpeed } from "../lib/speed"
  import { isVisible } from "../lib/isVisible"
  import cache from "./imageCache"

  export let alt: string
  export let src: string
  let size = cache.get(src) || "blank"
  export let initialHeight: string = "auto"
  let height = size === "blank" ? initialHeight : "auto"
  let element: HTMLImageElement

  onMount(async () => {
    getSpeed() // pump it

    if (size === "lg") return

    if (size === "blank") {
      // TODO: Replace with waitFor
      const waitUntilLoaded = () => {
        return new Promise((res) => {
          const interval = setInterval(async () => {
            if (element.naturalWidth !== 0) {
              clearInterval(interval)
              res()
            }
          }, 100)
        })
      }
      await waitUntilLoaded()
      height = "auto"
      size = "xs"
      cache.set(src, "xs")
      await waitUntilLoaded()
    }

    const speed = await getSpeed()
    await isVisible(element)
    if (window.innerWidth > 600 && speed > 1) {
      size = "lg"
      cache.set(src, "lg")
    } else if (size !== "sm") {
      size = "sm"
      cache.set(src, "sm")
    }
  })
</script>

<style lang="scss">
  div {
    background: #f0f0f0;
    img {
      vertical-align: middle;
      max-width: 100%;
    }
  }
</style>

<div style="height: {height}">
  <img {alt} src={`${src}?size=${size}`} bind:this={element} width="100%" />
</div>
