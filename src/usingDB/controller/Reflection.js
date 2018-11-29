import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';

const Reflection = {

  async create(req, res, next) {
    const createQuery = `INSERT INTO
      reflections(id, Nome, Produto, Preço, owner_id, criado_date, modificado_date)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning *`;
    const values = [
      uuidv4(),
      req.body.Nome,
      req.body.Produto,
      req.body.Preço,
      req.user.id,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(createQuery, values);
      return res.status(201).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  
  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM reflections where owner_id = $1';
    try {
      const { rows, rowCount } = await db.query(findAllQuery, [req.user.id]);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  
  async getOne(req, res) {
    const text = 'SELECT * FROM reflections WHERE id = $1 AND owner_id = $2';
    try {
      const { rows } = await db.query(text, [req.params.id, req.user.id]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'nao encontrado'});
      }
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },
  
  async update(req, res) {
    const findOneQuery = 'SELECT * FROM reflections WHERE id=$1 AND owner_id = $2';
    const updateOneQuery =`UPDATE reflections
      SET Nome=$1,Produto=$2,Preço=$3,modificado_date=$4
      WHERE id=$5 AND owner_id = $6 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id, req.user.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'nao encontrado'});
      }
      const values = [
        req.body.Nome || rows[0].Nome,
        req.body.Produto || rows[0].Produto,
        req.body.Preço || rows[0].Preço,
        moment(new Date()),
        req.params.id,
        req.user.id
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch(err) {
      return res.status(400).send(err);
    }
  },
  
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM reflections WHERE id=$1 AND owner_id = $2 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.id, req.user.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'nao encontrado'});
      }
      return res.status(204).send({ 'message': 'apagado' });
    } catch(error) {
      return res.status(400).send(error);
    }
  }
}

export default Reflection;
