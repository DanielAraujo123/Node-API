import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const Helper = {
  
  hashPassword(password) {
    return bcryptjs.hashSync(password, bcryptjs.genSaltSync(8))
  },
  
  comparePassword(hashPassword, password) {
    return bcryptjs.compareSync(password, hashPassword);
  },
 
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
 
  generateToken(id) {
    const token = jwt.sign({
      userId: id
    },
      process.env.SECRET, { expiresIn: '7d' }
    );
    return token;
  }
}

export default Helper;
