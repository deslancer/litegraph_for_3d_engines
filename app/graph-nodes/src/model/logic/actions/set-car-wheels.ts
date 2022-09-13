export const setCarWheels = (scene) => {
  const bl = scene.getObjectByName('BL');
  const br = scene.getObjectByName('BR');
  const fl = scene.getObjectByName('FL');
  const fr = scene.getObjectByName('FR');
  const wheelObjects = scene.getObjectByName('Wheel_Objects');

  let clonedWheelObjects = wheelObjects.clone();
  bl.add(clonedWheelObjects);

  clonedWheelObjects = wheelObjects.clone();
  clonedWheelObjects.rotation.y = Math.PI;
  br.add(clonedWheelObjects);

  clonedWheelObjects = wheelObjects.clone();
  fl.add(clonedWheelObjects);

  wheelObjects.rotation.y = Math.PI;
  fr.add(wheelObjects);
};
