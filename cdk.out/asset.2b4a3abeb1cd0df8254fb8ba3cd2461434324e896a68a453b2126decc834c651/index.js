// lambda/asaiWorld/index.ts
exports.handler = async function(event) {
  console.log(event.body);
  return { "asai": "World" };
};
