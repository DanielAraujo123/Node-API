import ReflectionModel from '../models/Reflection';

const Reflection = {
  create(req, res, next) {
    if (!req.body.Nome && !req.body.Produto && !req.body.Preço) {
      return res.status(400).send({'message': 'ta faltando algo..'})
    }
    const reflection = ReflectionModel.create(req.body);
    return res.status(201).send(reflection);
  },
  getAll(req, res) {
    const reflections = ReflectionModel.findAll();
    return res.status(200).send(reflections);
  },
  getOne(req, res) {
    const reflection = ReflectionModel.findOne(req.params.id);
    if (!reflection) {
      return res.status(404).send({'message': 'erro'});
    }
    return res.status(200).send(reflection);
  },
  update(req, res) {
    const reflection = ReflectionModel.findOne(req.params.id);
    if (!reflection) {
      return res.status(404).send({'message': 'erro'});
    }
    const updatedReflection = ReflectionModel.update(req.params.id, req.body)
    return res.status(200).send(updatedReflection);
  },
  delete(req, res) {
    const reflection = ReflectionModel.findOne(req.params.id);
    if (!reflection) {
      return res.status(404).send({'message': 'erro'});
    }
    const ref = ReflectionModel.delete(req.params.id);
    return res.status(204).send(ref);
  }
}

export default Reflection;