
'use strict';

const registry = require('./engine/registry');
const { Datatype } = require('./engine/datatype');
const { Entity } = require('./engine/entity');
const builtins = require('./builtins');

exports.registerDatatype = registerDatatype;
exports.findDatatype = registry.findDatatype;
exports.getDatatype = registry.getDatatype;

exports.registerEntity = registerEntity;
exports.findEntity = registry.findEntity;
exports.getEntity = registry.getEntity;

for(const definition of builtins.datatypes) {
  registerDatatype(definition);
}

for(const definition of builtins.entities) {
  registerEntity(definition);
}

function registerDatatype(definition) {
  if(registry.findDatatype(definition.id)) {
    throw new Error(`Datatype already exists: '${definition.id}'`);
  }

  const datatype = new Datatype(definition);
  registry.registerDatatype(datatype);

  registry.registerDatatype(new Datatype({ id: `list:${datatype.id}`, list: datatype.id }));
  registry.registerDatatype(new Datatype({ id: `map:${datatype.id}`, map: datatype.id }));
}

function registerEntity(definition) {
  if(registry.findEntity(definition.id)) {
    throw new Error(`Entity already exists: '${definition.id}'`);
  }

  const entity = new Entity(definition);
  registry.registerEntity(entity);

  // register its reference type
  registerDatatype({ id: entity.id, reference: entity.id });
}
