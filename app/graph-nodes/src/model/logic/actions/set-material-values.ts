import { UtilsService } from '../services/utils.service';


const getMaterialValues = (material: any): string[] => {
  if (material.isMeshNodeMaterial) {
    return Object.keys(material.nodeValueMap);
  } else if (material.isMeshStandardMaterial) {
    return ['metalness', 'roughness', 'bumpScale', 'emissiveIntensity', 'envMapIntensity'];
  } else {
    return [];
  }
};

const setValues = (app: any, material: any, valueProperties: any[]): void => {
  const values = getMaterialValues(material);

  valueProperties.forEach(valueProperty => {
    const valueName = Object.keys(valueProperty)[0];

    if (values.indexOf(valueName) < 0) {
      return;
    }

    if (material.isMeshNodeMaterial) {
      const valIdx = material.nodeValueMap[valueName];
      material.nodeValue[valIdx] = isNaN(Number(Object.values(valueProperty)[0])) ? Object.values(valueProperty)[0] : Number(Object.values(valueProperty)[0]);
    } else {
      material[valueName] = isNaN(Number(Object.values(valueProperty)[0])) ? Object.values(valueProperty)[0] : Number(Object.values(valueProperty)[0]);
    }
  });

  material.needsUpdate = true;

  if (material === app.worldMaterial) {
    app.updateEnvironment(material);
  }
};

export const setMaterialValues = async (scene, app, appData, menuLogicObject, apiUrl) => {
  try {
    if (!(menuLogicObject.data && menuLogicObject.data.properties && menuLogicObject.data.properties.length)) return;

    const valueProperties = menuLogicObject.data.properties.filter(p => {
      return !/.*color.*/gi.test(Object.keys(p)[0]) && !/.*nodeTextures.*/gi.test(Object.keys(p)[0]);
    });

    if (!valueProperties.length) return;

    const material: any = await UtilsService.getMaterialByEntity(scene, app, menuLogicObject, apiUrl);
    if (!material) {
      // error
      console.warn(`Object with a scene name ${menuLogicObject.sceneName} cannot be found in the scene and cannot be loaded`);
      return;
    }

    const object3ds = UtilsService.findObject3dsByMaterialEntity(appData, menuLogicObject);

    if (!object3ds.length) {
      console.warn(`setMaterialValues material ${menuLogicObject.sceneName} no object3ds found`);
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
            material.nodeValue = _.cloneDeep(object3d.material.nodeValue);
            setValues(app, material, valueProperties);
            object3d.material = material;
          } else {
            setValues(app, material, valueProperties);
            object3d.material = material;
          }
        } else {
          {
            console.warn(`setMaterialValues - object3d ${sn} not found`);
          }
        }
      });
    });
  } catch (err) {
    console.error(`setMaterialValues error`, err);
  }
};
