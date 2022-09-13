import { UtilsService } from '../services/utils.service';

const emptyTextureName = 'empty.jpg';
const materialsEmptyTexturesMap = new Map();
const materialsEmptyTextureKeysMap = new Map();

const getTextureKey = (material, textureName) => Object.keys(material.nodeTextures).find(key => material.nodeTextures[key].name === textureName);

const getEmptyTextureKey = (material, textureName) => {
  const key = getTextureKey(material, textureName);
  if (key && !materialsEmptyTextureKeysMap.get(material.name)) {
    materialsEmptyTextureKeysMap.set(material.name, key);
  }
  return materialsEmptyTextureKeysMap.get(material.name);
};

const setTextures = (app: any, material: any, textureProperties: any[]): void => {
  textureProperties.forEach(valueProperty => {
    const textureName = Object.values(valueProperty)[0];
    const textureKey = getTextureKey(material, textureName);
    const emptyTextureKey = getEmptyTextureKey(material, emptyTextureName);

    if (!textureKey) {
      console.warn(`setNodeMaterialTexture textureKey for texture ${textureName} undefined`);
      return;
    }

    if (!emptyTextureKey) {
      console.warn(`setNodeMaterialTexture emptyTextureKey for texture ${emptyTextureName} undefined`);
      return;
    }

    if (material.nodeTextures[emptyTextureKey] && material.name && !materialsEmptyTexturesMap.get(material.name)) {
      materialsEmptyTexturesMap.set(material.name, material.nodeTextures[emptyTextureKey]);
    }

    if (material.isMeshNodeMaterial) {
      material.nodeTextures[emptyTextureKey] = material.nodeTextures[textureKey];
      UtilsService.updateWorldMaterialConcerningTexture(app, material.nodeTextures[emptyTextureKey]);
    } else {
      console.warn(`setNodeMaterialTexture trying to change nodeTexture on not node material ${material.name}`);
    }
  });

  material.needsUpdate = true;

  if (material === app.worldMaterial) {
    app.updateEnvironment(material);
  }
};

const setDefaultTexture = (app: any, material: any) => {
  if (material.isMeshNodeMaterial) {
    if (material.name && materialsEmptyTexturesMap.get(material.name)) {
      const emptyTextureKey = getTextureKey(material, emptyTextureName);
      if (!emptyTextureKey) {
        console.warn(`setNodeMaterialTexture emptyTextureKey for texture ${emptyTextureName} undefined`);
        return;
      }
      material.nodeTextures[emptyTextureKey] = materialsEmptyTexturesMap.get(material.name);
      UtilsService.updateWorldMaterialConcerningTexture(app, material.nodeTextures[emptyTextureKey]);
    } else {
      console.warn(`setNodeMaterialTexture cannot find default texture for material ${material.name}`);
    }
  } else {
    console.warn(`setNodeMaterialTexture tring to change nodeTexture on not node material ${material.name}`);
  }
};

const setTextureNodeValues = (material: any, textureNodeValueMapProperties: any) => {
  try {
    if (textureNodeValueMapProperties.length) {
      textureNodeValueMapProperties.forEach(property => {
        const nodeValueMap = JSON.parse(Object.keys(property)[0]);
        let nodeValue = Object.values(property)[0];
        nodeValue = !Number.isNaN(Number(nodeValue)) ? Number(nodeValue) : nodeValue;
        const nodeValueIdx = <number>Object.values(nodeValueMap['nodeValueMap'])[0];
        material.nodeValue[nodeValueIdx] = nodeValue;
      });
    }
  } catch (err) {
    console.warn(`setTextureNodeValues Error ${err.message}`);
  }
};

export const setNodeMaterialTexture = async (scene, app, appData, menuLogicObject, apiUrl) => {
  if (!(menuLogicObject.data && menuLogicObject.data.properties && menuLogicObject.data.properties.length)) return;

  const textureProperties = menuLogicObject.data.properties.filter(p => {
    return /.*nodeTextures.*/gi.test(Object.keys(p)[0]);
  });

  const textureNodeValueMapProperties = menuLogicObject.data.properties.filter(p => {
    return /.*nodeValueMap.*/gi.test(Object.keys(p)[0]);
  });

  const material: any = await UtilsService.getMaterialByEntity(scene, app, menuLogicObject, apiUrl);
  if (!material) {
    // error
    console.warn(`Object with a scene name ${menuLogicObject.sceneName} cannot be found in the scene and cannot be loaded`);
    return;
  }

  const object3ds = UtilsService.findObject3dsByMaterialEntity(appData, menuLogicObject);

  if (!object3ds.length) {
    console.warn(`setMaterialTexture material ${menuLogicObject.sceneName} no object3ds found`);
    return;
  }

  object3ds.forEach(object3d => {
    // in case we have several object names, splitted by ','
    const object3dSceneNames = object3d.sceneName.split(',').map(n => n.trim());

    object3dSceneNames.forEach(sn => {
      object3d = UtilsService.getObjectByName(scene, sn);
      if (object3d) {
        if (!textureProperties.length) {
          setDefaultTexture(app, material);
          return;
        } else {
          if (object3d.material && object3d.material.name === material.name) {
            setTextureNodeValues(object3d.material, textureNodeValueMapProperties);
            setTextures(app, object3d.material, textureProperties);
          } else {
            setTextureNodeValues(material, textureNodeValueMapProperties);
            setTextures(app, material, textureProperties);
            object3d.material = material;
          }
        }
      } else {
        {
          console.warn(`setMaterialTexture - object3d ${sn} not found`);
        }
      }
    });
  });
};
