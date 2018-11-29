import moment from 'moment';
import uuid from 'uuid';

class Reflection {
  constructor() {
    this.reflections = [];
  }
  create(data) {
    const newReflection = {
      id: uuid.v4(),
      Nome: data.Nome || '',
      Produto: data.Produto || '',
      Preço: data.Preço || '',
      Criado: moment.now()
    };
    this.reflections.push(newReflection);
    return newReflection
  }
  findOne(id) {
    return this.reflections.find(reflect => reflect.id === id);
  }
  findAll() {
    return this.reflections;
  }
  update(id, data) {
    const reflection = this.findOne(id);
    const index = this.reflections.indexOf(reflection);
    this.reflections[index].Nome = data['Nome'] || reflection.Nome;
    this.reflections[index].Produto = data['Produto'] || reflection.Produto;
    this.reflections[index].Preço = data['Preço'] || reflection.Preço;
    this.reflections[index].Atualizado = moment.now()
    return this.reflections[index];
  }
  delete(id) {
    const reflection = this.findOne(id);
    const index = this.reflections.indexOf(reflection);
    this.reflections.splice(index, 1);
    return {};
  }
}
export default new Reflection();