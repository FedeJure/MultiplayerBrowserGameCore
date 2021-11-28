export function Log(
  classType: { constructor: { name: string } } | string,
  ...args: Object[]
) {
  const d = new Date();
  const name = classType.constructor ? classType.constructor.name : classType;
  console.log(`${d.toUTCString()} -- [${name}] ::`, ...args);
}
