import { UtilsService } from '../services/utils.service';
import { ExecuteActionArguments } from '../model/execute-action-arguments';

// @ts-ignore
declare const v3d: any;

const getMaterialColors = (material: any): string[] => {
  if (material.isMeshNodeMaterial) {
    return Object.keys(material.nodeRGBMap);
  } else if (material.isMeshStandardMaterial) {
    return ['color', 'emissive'];
  } else {
    return [];
  }
};

const setColors = (app: any, material: any, colorProperties: any[]): void => {
  const colors = getMaterialColors(material);

  colorProperties.forEach(colorProperty => {
    const colorName = Object.keys(colorProperty)[0];

    const color = new v3d.Color(Object.values(colorProperty)[0]);
    color.convertSRGBToLinear();
    const r = color.r;
    const g = color.g;
    const b = color.b;

    if (material.isMeshNodeMaterial) {
      const rgbIdx = material.nodeRGBMap[colorName];
      material.nodeRGB[rgbIdx].x = r;
      material.nodeRGB[rgbIdx].y = g;
      material.nodeRGB[rgbIdx].z = b;
    } else {
      material.color.r = r;
      material.color.g = g;
      material.color.b = b;
      material.emissive.r = r;
      material.emissive.g = g;
      material.emissive.b = b;
    }
  });

  material.needsUpdate = true;

  if (material === app.worldMaterial) {
    app.updateEnvironment(material);
  }
};

export const setMaterialColorsTest = async (args: ExecuteActionArguments) => {
  const { actionArguments, apiUrl, app, logic, scene } = args;

    if (!actionArguments || !scene) {
      console.warn(`Action: [setMaterialColorsTest] actionArguments or scene is absent`);
      return;
    }

    let { object3d, material_color } = actionArguments;
    if (!object3d || !material_color) {
      console.warn(`Action: [setMaterialColorsTest] object or material is absent`);
      return;
    }

    const objectEntity = logic.object3ds.find(o => o.id === object3d);
    const colorEntity = logic.materials.find(o => o.id === material_color);

    if (!objectEntity) {
      console.warn(`Action: [setMaterialColorsTest] object with id ${object3d} is not attached to logic`);
      return;
    }

    if (!colorEntity) {
      console.warn(`Action: [setMaterialColorsTest] material with id ${material_color} is not attached to logic`);
      return;
    }

    if (!(colorEntity.data && colorEntity.data.properties && colorEntity.data.properties.length)) {
      console.warn(`Action: [setMaterialColorsTest] material properties is absent`);
      return;
    }

    const colorProperties = colorEntity.data.properties.filter(p => {
      return /.*color.*/gi.test(Object.keys(p)[0]);
    });

    if (!colorProperties.length) return;

    const material: any = await UtilsService.getMaterialByEntity(scene, app, colorEntity, apiUrl);
    if (!material) {
      // error
      console.warn(`Object with a scene name ${objectEntity.sceneName} cannot be found in the scene and cannot be loaded`);
      return;
    }

    // get all objects of the same type(name) in scene
    let object3ds = []
    let sceneNameRegexp = new RegExp(`${objectEntity.sceneName}.*`, 'gi')
    scene.traverse(sc => {
      if (sc && sc.material && sc.material.name === colorEntity.sceneName ) {
        object3ds = [...object3ds, sc]
      }
    })


    if (!object3ds.length) {
      console.warn(`[setMaterialColors] material ${objectEntity.sceneName} no object3ds found`);
      return;
    }

    object3ds.forEach(obj3d => {
          if (obj3d.material && obj3d.material.name === material.name) {
            const material = obj3d.material.clone();
            if (material.isMeshNodeMaterial) {
              setColors(app, material, colorProperties);
              obj3d.material = material;
            } else {
              setColors(app, material, colorProperties);
              obj3d.material = material;
            }
          }
    });

    material.needsUpdate = true;

    if (material === app.worldMaterial) {
      app.updateEnvironment(material);
    }

  let cameraObjectSceneName = 'Camera_Main';

  if (objectEntity.sceneName.includes('Windows')){
    cameraObjectSceneName = `Camera_Windows_0${objectEntity.sceneName.substring(objectEntity.sceneName.length - 2)}`;
  } else if (objectEntity.sceneName.includes('Entry_Door')) {
    cameraObjectSceneName = 'Camera_Entry_Door';
  } else if (objectEntity.sceneName.includes('Patio_Door')) {
    cameraObjectSceneName = 'Camera_Patio_Door';
  } else if (objectEntity.sceneName.includes('Siding')) {
    cameraObjectSceneName = 'Camera_Siding';
  }

  // camera object by object entity scene name
  let newCamera = scene.getObjectByName(cameraObjectSceneName)




  function animate() {
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate)
  //
};

