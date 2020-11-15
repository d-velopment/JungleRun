<script>
  import { onMount } from "svelte"
  import ResizeObserver from "svelte-resize-observer"

  const treeAssets = ["true"]

  const maxFar = 1
  var trees = new Array(75)
    .fill()
    .map((_, i) => {
      let origX = Math.random() * 100
      origX = origX >= 49 && origX <= 51 ? 49 : origX
      const origZ = Math.random() * 10
      return {
        xOrigin: origX,
        x: 50 - ((50 - origX) * origZ) / 6,
        y: 0,
        z: origZ,
        opacity: 0,
        asset: "ipack/" + treeAssets[Math.floor(Math.random() * treeAssets.length)] + ".png",
      }
    })
    .sort((a, b) => a.z - b.z)

  let screenRatio = document.body.clientWidth / document.body.clientHeight
  const onResize = (event) => {
    screenRatio = document.body.clientWidth / document.body.clientHeight
    console.log(screenRatio)
  }

  onMount(() => {
    let frame
    let step = 0
    function loop() {
      frame = requestAnimationFrame(loop)
      step++

      let isChanged = false
      trees = trees.map((tree) => {
        tree.z *= 1.01
        tree.x = 50 - ((50 - tree.xOrigin) * tree.z) / 6
        tree.y = 10 - tree.z / (screenRatio * 3)

        if (tree.z < 75) {
          tree.opacity += 0.01
        }

        if (tree.z > 100 || tree.x < 0 || tree.x > 100) {
          tree.opacity -= 0.05
        }
        if (tree.z > 400 || tree.x < -50 || tree.x > 150) {
          tree.z = maxFar
          tree.origX = tree.x = Math.random() * 100
          tree.origX = tree.origX >= 49 && tree.origX <= 51 ? 49 : tree.origX
          tree.opacity = 0
          isChanged = true
        }
        return tree
      })
      if (isChanged) trees = trees.sort((a, b) => a.z - b.z)
    }

    loop()

    return () => cancelAnimationFrame(frame)
  })
</script>

<style>
  /* OVERALL VIEW */
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0px;
    margin: 0px;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0);
    position: fixed;
    overflow: hidden;
  }
  .img {
    position: absolute;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
  .scene {
    background: rgb(0, 0, 0);
    background: linear-gradient(0deg, rgba(30, 40, 80, 1) 0%, rgba(0, 0, 0, 1) 100%);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
  .ground {
    background: rgb(58, 73, 73);
    background: linear-gradient(0deg, rgba(18, 23, 33, 1) 0%, rgba(7, 14, 17, 1) 100%);
    position: absolute;
    width: 100%;
    height: 10%;
    bottom: 0%;
  }
  .runner {
    position: absolute;
    background-image: url("ipack/run.gif");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    width: 100%;
    height: 35%;
    bottom: -2%;
    mix-blend-mode: multiply;
  }
</style>

<main>
  <ResizeObserver on:resize="{(e) => onResize(e.detail.target)}" />
  <div class="scene">
    <div class="ground"></div>
    {#each trees as tree}
      <div
        style="left: {tree.x - tree.z}%; bottom: {tree.y}%; opacity: {tree.opacity}; width: {tree.z * 2}%; height: {tree.z * 2}%; background-image: url('{tree.asset}')"
        class="img"></div>
    {/each}
    <div class="runner"></div>
  </div>
</main>
