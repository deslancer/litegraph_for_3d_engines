
const getObject3dNamesFromObject3dSceneName = object3d => {
  return object3d.sceneName.split(',').map(n => n.trim());
};

const isMobile = (): boolean => {
  return (navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i) ||
    (window.innerWidth <= 767 && window.innerHeight <= 900)) as boolean;
};

const getMainAsset = assetUrls => {
  const runningOnMobile = isMobile();
  const gltfRegexp = /.+\.gltf(\.xz)?/;
  if (runningOnMobile) {
    const forMobileAsset = assetUrls.find(au => /.*(mobile).*\.gltf(\.xz)?/.test(au));
    if (forMobileAsset) {
      return forMobileAsset;
    } else {
      return assetUrls.find(au => gltfRegexp.test(au));
    }
  }
  return assetUrls.find(au => gltfRegexp.test(au));
};

const getObjectsByEntityInScene = (scene, entity) => {
  const sceneNames = getObject3dNamesFromObject3dSceneName(entity);
  const objects = [];
  if (!sceneNames.length) {
    return objects;
  }
  for (const sceneName of sceneNames) {
    const object = UtilsService.getObjectByName(scene, sceneName);
    if (object) objects.push(object);
  }
  return objects;
};

export const UtilsService = {
  loadScene (app, url: string) {
    return new Promise((resolve, reject) => {
      app.loader.load(
        url,
        loaded => {
          if (typeof app._updateMaterialsFromGLTF === 'function') app._updateMaterialsFromGLTF(loaded);
          if (typeof app._updateAnimationsFromGLTF === 'function') app._updateAnimationsFromGLTF(loaded, loaded.scene);
          if (typeof app._updateSceneEnvIBL === 'function') app._updateSceneEnvIBL(loaded.scene, app._envRTargetIBL);
          resolve(loaded.scene);
        },
        e => {},
        err => {
          reject(err);
        }
      );
    });
  },

  findObject3dsByMaterialEntity (data, entity) {
    const foundObject3ds = [];
    const object3ds = this.deepFilterDataByKey(data, 'object3ds');
    const ownObject3ds = this.deepFilterDataByKey(data, 'ownObject3ds');
    const allObject3ds = [...object3ds, ...ownObject3ds];
    allObject3ds.forEach(o => {
      if (o.materials && o.materials.length) {
        if (
          o.materials.find(m => {
            return m.id === entity.id;
          })
        ) {
          foundObject3ds.push(o);
        }
      }
    });
    return foundObject3ds;
  },

  /** used in older methods */
  getObjectByEntity (scene, app, entity, apiUrl) {

    return new Promise(async (resolve, reject) => {
      let object: any = scene.getObjectByName(entity.sceneName);
      if (object) {
        resolve(object);
      } else {
        if (entity.asset) {
          const url = getMainAsset(entity.asset.assetUrls);
          const scene = await (<any>this.loadScene(app, `${apiUrl}${url}`));
          scene.userData.entity = { ...entity };
          resolve(scene);
        } else {
          reject();
        }
      }
    });
  },

  getObjectsByEntityInScene (scene, entity) {
    return getObjectsByEntityInScene(scene, entity);
  },

  getObjectsByEntityInFromAsset (scene, app, entity, apiUrl) {
    return new Promise(async (resolve, reject) => {
      if (entity.asset) {
        const url = getMainAsset(entity.asset.assetUrls);
        const loadedScene = await (<any>this.loadScene(app, `${apiUrl}${url}`));
        loadedScene.userData.entity = { ...entity };
        scene.add(loadedScene);
        resolve(getObjectsByEntityInScene(scene, entity));
      } else {
        reject();
      }
    });
  },

  getObjectsByEntity (scene, app, entity, apiUrl) {
    const getObjects = entity => {
      const sceneNames = UtilsService.getObject3dNamesFromObject3dSceneName(entity);
      const objects = [];
      if (!sceneNames.length) {
        return objects;
      }
      for (const sceneName of sceneNames) {
        const object = UtilsService.getObjectByName(scene, sceneName);
        if (object) objects.push(object);
      }
      return objects;
    };
    return new Promise(async (resolve, reject) => {
      let objects = getObjects(entity);
      if (objects.length) {
        resolve(objects);
      } else {
        if (entity.asset) {
          const url = getMainAsset(entity.asset.assetUrls);
          const loadedScene = await (<any>this.loadScene(app, `${apiUrl}${url}`));
          loadedScene.userData.entity = { ...entity };
          scene.add(loadedScene);
          resolve(getObjects(entity));
        } else {
          reject();
        }
      }
    });
  },

  getMaterialByEntity (scene, app, entity, apiUrl) {
    return new Promise(async (resolve, reject) => {
      let material: any = this.getMaterialByName(scene, entity.sceneName);
      if (material) {
        resolve(material);
      } else if (entity.asset) {
        const url = entity.asset.assetUrls.find(au => /.+\.gltf/.test(au));
        const scene = await (<any>this.loadScene(app, `${apiUrl}${url}`));
        scene.userData.entity = { ...entity };
        scene.add(scene);
        material = this.getMaterialByName(scene, entity.sceneName);
        resolve(material);
      } else {
        reject();
      }
    });
  },

  findParentObjectByObject3dEntity (data, entity) {
    let parent;
    const object3ds = this.deepFilterDataByKey(data, 'object3ds');
    const ownObject3ds = this.deepFilterDataByKey(data, 'ownObject3ds');
    const allObject3ds = [...object3ds, ...ownObject3ds];
    allObject3ds.forEach(o => {
      if (o.object3ds && o.object3ds.length) {
        if (
          o.object3ds.find(o => {
            return o.id === entity.id;
          })
        ) {
          parent = o;
        }
      } else if (o.ownObject3ds && o.ownObject3ds.length) {
        if (
          o.ownObject3ds.find(o => {
            return o.id === entity.id;
          })
        ) {
          parent = o;
        }
      }
    });
    return parent;
  },

  updateWorldMaterialConcerningTexture (app, texture) {
    // update world material if it is using this texture
    const wMat = app.worldMaterial;
    if (wMat) {
      for (const textureName in wMat.nodeTextures) {
        if (wMat.nodeTextures[textureName] === texture) {
          app.updateEnvironment(wMat);
        }
      }
    }
  },

  getObjectBySceneNameInEntity (scene, sceneName: string) {
    let obj = null;
    scene.traverse(c => {
      if (c && c.userData.entity && c.userData.entity.sceneName) {
        if (this.sanitizeStr(c.userData.entity.sceneName) === this.sanitizeStr(sceneName)) obj = c;
      }
    });
    return obj;
  },

  sanitizeStr (str: string) {
    return str
      .replace('с', 'c') // russian с
      .replace('С', 'C') // russian С
      .replace('е', 'e') // russian е
      .replace('Е', 'E') // russian Е
      .replace('а', 'a') // russian а
      .replace('А', 'A') // russian А
      .replace('о', 'o') // russian о
      .replace('О', 'O'); // russian О
  },

  getObjectByName (scene, name) {
    let object = null;
    name = this.sanitizeStr(name);
    scene.traverse(o => {
      if (o && o.name && this.sanitizeStr(o.name) === name) {
        object = o;
      }
    });
    return object;
  },

  getMaterialByName (scene, name) {
    let material = null;
    scene.traverse(c => {
      if (c && c.material && c.material.name === name) {
        material = c.material;
      }
    });
    return material;
  },

/*  deepFilterDataByKey (data, filteredKey) {
    const filtered = [];
    const filter = data => {
      if (data) {
        if (Array.isArray(data) && data.length) {
          _.forEach(data, value => {
            filter(value);
          });
        } else {
          _.forEach(data, (value, key) => {
            if (value) {
              if (Array.isArray(value) && value.length) {
                if (key === filteredKey && value) {
                  _.forEach(value, v => {
                    filtered.push(v);
                    filter(v);
                  });
                } else {
                  _.forEach(value, v => {
                    filter(v);
                  });
                }
              } else {
                if (key === filteredKey && value) {
                  filtered.push({
                    ...value
                  });
                }
              }
            }
          });
        }
      }
    };
    filter(data);
    return _.uniqBy(filtered, f => {
      return f.id;
    }).filter(f => f.id);
  },*/

  getObject3dNamesFromObject3dSceneName (object3d) {
    return getObject3dNamesFromObject3dSceneName(object3d);
  },

  changeMaterialOnObject3dEntities (scene, object3dEntities, material) {
    object3dEntities.forEach(object3d => {
      // in case we have several object names, splitted by ','
      const object3dSceneNames = getObject3dNamesFromObject3dSceneName(object3d);

      object3dSceneNames.forEach(sn => {
        object3d = UtilsService.getObjectByName(scene, sn);
        if (object3d) {
          object3d.material = material;
        } else {
          {
            console.warn(`setObjectMenuMaterial - object3d ${sn} not found`);
          }
        }
      });
    });
  },

  positionsEqual (positionA, positionB) {
    return positionA && positionB && positionA.x === positionB.x && positionA.y === positionB.y && positionA.z === positionB.z;
  },

  switchObjectsGetToHideObject3dSceneNames (menuLogicObject) {
    let hideBlockRegex = /(?:hide:)(.+)(?:show:)/i;

    let toHideSceneNamesArr = menuLogicObject.sceneName.replace(/\s/g, '').match(hideBlockRegex);

    if (!toHideSceneNamesArr || !toHideSceneNamesArr.length) {
      hideBlockRegex = /(?:hide:)(.+)/i;
      toHideSceneNamesArr = menuLogicObject.sceneName.replace(/\s/g, '').match(hideBlockRegex);
    }

    if (!toHideSceneNamesArr || !toHideSceneNamesArr.length) {
      return null;
    }

    return toHideSceneNamesArr[1].split(',');
  },

  getMainAsset (assetUrls) {
    return getMainAsset(assetUrls);
  },

  async changeObjectsVisibility (apiUrl, app, logic, objects, scene, show) {
    if (objects?.length) {
      for (const obj of objects) {
        const objectEntity = logic.object3ds.find(o => o.id === obj);
        if (!objectEntity) return;
        const object: any = await UtilsService.getObjectByEntity(scene, app, objectEntity, apiUrl);
        if (object) {
          object.visible = show;
        }
      }
    }
  }
};
