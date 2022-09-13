import { UtilsService } from '../services/utils.service';
import { ExecuteActionArguments } from '../model/execute-action-arguments';

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

    if (colors.indexOf(colorName) < 0) {
      return;
    }

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
      material[colorName].r = r;
      material[colorName].g = g;
      material[colorName].b = b;
    }
  });

  material.needsUpdate = true;

  if (material === app.worldMaterial) {
    app.updateEnvironment(material);
  }
};

export const setMaterialColors = async (scene, app, appData, menuLogicObject, apiUrl, args: ExecuteActionArguments) => {

  try {
    if (!(menuLogicObject.data && menuLogicObject.data.properties && menuLogicObject.data.properties.length)) return;

    const colorProperties = menuLogicObject.data.properties.filter(p => {
      return /.*color.*/gi.test(Object.keys(p)[0]);
    });

    if (!colorProperties.length) return;

    const material: any = await UtilsService.getMaterialByEntity(scene, app, menuLogicObject, apiUrl);
    if (!material) {
      // error
      console.warn(`Object with a scene name ${menuLogicObject.sceneName} cannot be found in the scene and cannot be loaded`);
      return;
    }

    const object3ds = UtilsService.findObject3dsByMaterialEntity(appData, menuLogicObject);

    if (!object3ds.length) {
      console.warn(`setMaterialColors material ${menuLogicObject.sceneName} no object3ds found`);
      return;
    }

    object3ds.forEach(object3d => {
      // in case we have several object names, splitted by ','
      const object3dSceneNames = object3d.sceneName.split(',').map(n => n.trim());

      object3dSceneNames.forEach(sn => {
        object3d = UtilsService.getObjectByName(scene, sn);
        if (object3d) {
          if (object3d.material && object3d.material.name === material.name) {
            const material = object3d.material.clone();
            material.nodeRGB = _.cloneDeep(object3d.material.nodeRGB);
            material.nodeRGBArr = _.cloneDeep(object3d.material.nodeRGBArr);
            setColors(app, material, colorProperties);
            object3d.material = material;
          } else {
            setColors(app, material, colorProperties);
            object3d.material = material;
          }
        } else {
          {
            console.warn(`setMaterialColors - object3d ${sn} not found`);
          }
        }
      });
    });

    material.needsUpdate = true;

    if (material === app.worldMaterial) {
      app.updateEnvironment(material);
    }
  } catch (err) {
    console.error(`setMaterialColors error`, err);
  }
};
