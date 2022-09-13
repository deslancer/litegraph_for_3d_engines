import { UtilsService } from '../services/utils.service'

export const hideObjects = (scene, logic) => {
  const objectEntities =
    logic.data && logic.data.objects.filter(o => o.objectType === 'object3d');

  if (!objectEntities.length) {
    console.warn('Cannot find objects entities')
    return
  }

  objectEntities.forEach(objectEntity => {
    const object3dSceneNames = objectEntity.sceneName
      .split(',')
      .map(n => n.trim())

    object3dSceneNames.forEach(sn => {
      const object3d = UtilsService.getObjectByName(scene, sn)
      if (object3d) {
        if (object3d.visible) {
          object3d.visible = false
        }
      }
    })
  })
}
