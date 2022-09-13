import { UtilsService } from '../services/utils.service'

const materialsDictionary = new Map()

export const toggleMaterial = async (
  scene,
  app,
  appData,
  menuLogicObject,
  apiUrl
) => {
  try {
    let material = await UtilsService.getMaterialByEntity(
      scene,
      app,
      menuLogicObject,
      apiUrl
    )
    if (!material) {
      // error
      console.warn(
        `Object with a scene name ${menuLogicObject.sceneName} cannot be found in the scene and cannot be loaded`
      )
      return
    }

    const object3ds = UtilsService.findObject3dsByMaterialEntity(
      appData,
      menuLogicObject
    )

    if (!object3ds.length) {
      console.warn(
        `setObjectMenuMaterial material ${menuLogicObject.sceneName} no object3ds found`
      )
      return
    }

    const object3dSceneNames = UtilsService.getObject3dNamesFromObject3dSceneName(
      object3ds[0]
    )

    const object3d = UtilsService.getObjectByName(scene, object3dSceneNames[0])

    if (object3d.material.name === menuLogicObject.sceneName) {
      material = materialsDictionary.get(menuLogicObject.sceneName);
    } else {
      materialsDictionary.set(menuLogicObject.sceneName, object3d.material);
    }

    UtilsService.changeMaterialOnObject3dEntities(scene, object3ds, material)
  } catch (err) {
    console.error(`setObjectMenuMaterial error`, err)
  }
}
