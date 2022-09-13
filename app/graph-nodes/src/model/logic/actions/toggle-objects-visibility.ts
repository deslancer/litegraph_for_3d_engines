import { UtilsService } from '../services/utils.service'

let envMap = null;

const setEnvMap = scene => {
  scene.traverse(c => {
      if (c && c.material && c.material.envMap && !envMap) envMap = c.material.envMap;
  });
}

const updateEnvMap = (scene, loadedScene) => {
  if (!envMap) setEnvMap(scene);
  loadedScene.traverse(c => {
    if (c && c.material) {
      c.material.envMap = envMap
      c.material.needsUpdate = true;
    }
  })
}

export const toggleObjectsVisibility = async (
  scene,
  app,
  menuLogicObject,
  apiUrl
) => {
  const object3ds = await (<any[]>(
    (<unknown>UtilsService.getObjectsByEntityInScene(scene, menuLogicObject))
  ))

  if (object3ds.length) {
    object3ds.forEach(object3d => {
      if (object3d) {
        if (object3d.visible) {
          object3d.visible = false
        } else {
          object3d.visible = true
        }
      }
    })
  } else {
    await UtilsService.getObjectsByEntityInFromAsset(
      scene,
      app,
      menuLogicObject,
      apiUrl
    );
    const object3ds = await (<any[]>(
      (<unknown>UtilsService.getObjectsByEntityInScene(scene, menuLogicObject))
    ));
    if (object3ds.length) {
      object3ds.forEach(object3d => {
        updateEnvMap(scene, object3d);
      })
    }
  }
}
