import { UtilsService } from '../services/utils.service'

const positions = {
  wallLPosition: null,
  wallRPosition: null
}

export const shiftWalls = async scene => {
  const wallLName = 'Wall_L';
  const wallRName = 'Wall_R';

  const wallLObject = UtilsService.getObjectByName(scene, wallLName);
  const wallRObject = UtilsService.getObjectByName(scene, wallRName);

  if (!wallLObject) {
    console.warn(`${wallLName} not found`);
    return
  }

  if (!wallRObject) {
    console.warn(`${wallRName} not found`);
    return
  }

  if (!positions.wallLPosition) {
    positions.wallLPosition = {
      x: wallLObject.position.x,
      y: wallLObject.position.y,
      z: wallLObject.position.z
    };
  }

  if (!positions.wallRPosition) {
    positions.wallRPosition = {
      x: wallRObject.position.x,
      y: wallRObject.position.y,
      z: wallRObject.position.z
    };
  }

  if (UtilsService.positionsEqual(positions.wallLPosition, wallLObject.position)) {
    wallLObject.position.x += 0.16;
  } else {
    wallLObject.position.x -= 0.16;
  }

  if (UtilsService.positionsEqual(positions.wallRPosition, wallRObject.position)) {
    wallRObject.position.x -= 0.16;
  } else {
    wallRObject.position.x += 0.16;
  }
}
