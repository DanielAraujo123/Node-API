import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';
import Helper from './Helper';

const User = {
 
  async create(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({'message': 'tá faltando algo..'});
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ 'message': 'entre com um email válido' });
    }
    const hashPassword = Helper.hashPassword(req.body.password);

    const createQuery = `INSERT INTO
      users(id, email, password, criado_date, modificado_date)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
    const values = [
      uuidv4(),
      req.body.email,
      hashPassword,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(createQuery, values);
      const token = Helper.generateToken(rows[0].id);
      return res.status(201).send({ token });
    } catch(error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ 'message': 'email existente' })
      }
      return res.status(400).send(error);
    }
  },
  
  async login(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({'message': 'tá faltando algo'});
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ 'message': 'email errado' });
    }
    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await db.query(text, [req.body.email]);
      if (!rows[0]) {
        return res.status(400).send({'message': 'errado'});
      }
      if(!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send({ 'message': 'errado' });
      }
      const token = Helper.generateToken(rows[0].id);
      return res.status(200).send({ token });
    } catch(error) {
      return res.status(400).send(error)
    }
  },
 
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM users WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.user.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'usuario nao encontrado'});
      }
      return res.status(204).send({ 'message': 'apagado' });
    } catch(error) {
      return res.status(400).send(error);
    }
  }
}

export default User;
