import { UtilsService } from '../services/utils.service'

// 1. Switch on Custom_Cabinets_grp - switch off CouchBar_Stool&Chairs_grp and vice versa
// 2. Switch on Pool_Table_grp switch off Car_Lift_grp and vice versa

export async function switchObjects (scene, app, menuLogicObject, apiUrl) {
  let showBlockRegex = /(?:show:)(.+)(?:hide:)/i
  let hideBlockRegex = /(?:hide:)(.+)(?:show:)/i
  let toShowSceneNamesArr = menuLogicObject.sceneName
    .replace(/\s/g, '')
    .match(showBlockRegex)

  if (!toShowSceneNamesArr || !toShowSceneNamesArr.length) {
    showBlockRegex = /(?:show:)(.+)/i
    toShowSceneNamesArr = menuLogicObject.sceneName
      .replace(/\s/g, '')
      .match(showBlockRegex)
  }

  if (!toShowSceneNamesArr || !toShowSceneNamesArr.length) {
    console.warn(`Nothing to show for ${menuLogicObject.sceneName}`)
    return
  }

  let toHideSceneNamesArr = menuLogicObject.sceneName
    .replace(/\s/g, '')
    .match(hideBlockRegex)

  if (!toHideSceneNamesArr || !toHideSceneNamesArr.length) {
    hideBlockRegex = /(?:hide:)(.+)/i
    toHideSceneNamesArr = menuLogicObject.sceneName
      .replace(/\s/g, '')
      .match(hideBlockRegex)
  }

  if (!toHideSceneNamesArr || !toHideSceneNamesArr.length) {
    console.warn(`Nothing to hide for ${menuLogicObject.sceneName}`)
    return
  }

  const toShowSceneNames = toShowSceneNamesArr[1].split(',')
  const toHideSceneNames = toHideSceneNamesArr[1].split(',')

  const toShowObject3ds = await (<any[]>(
    (<unknown>UtilsService.getObjectsByEntityInScene(scene, {
      sceneName: toShowSceneNames.length > 1 ? toShowSceneNames.join(',') : toShowSceneNames[0]
    }))
  ))

  const toHideObject3ds = await (<any[]>(
    (<unknown>UtilsService.getObjectsByEntityInScene(scene, {
      sceneName: toHideSceneNames.length > 1 ? toHideSceneNames.join(',') : toHideSceneNames[0]
    }))
  ))

  if (!toShowObject3ds.length) {
    await UtilsService.getObjectsByEntityInFromAsset(
      scene,
      app,
      { ...menuLogicObject, sceneName: toShowSceneNames.join(',') },
      apiUrl
    )
  }
  
  if (!toShowObject3ds.length) {
    console.warn(`Nothing to show for ${menuLogicObject.sceneName}`)
    return
  }
  
  // currently visible or not
  const currentlyVisible = toShowObject3ds.every(object3d => object3d.visible)

  if (toShowObject3ds.length) {
    toShowObject3ds.forEach(object3d => {
      if (object3d) {
        object3d.visible = !currentlyVisible
      }
    })
  }

  if (toHideObject3ds.length && !currentlyVisible) {
    toHideObject3ds.forEach(object3d => {
      if (object3d) {
        object3d.visible = currentlyVisible
      }
    })
  }
}
