import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';


dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE!,
  process.env.USER!,
  process.env.PASSWORD!,
  
  {
    host: process.env.HOST,
    port: Number(process.env.PORT),
    dialect: 'postgres',
    logging:false
  }
);

// Sync the models with the database
sequelize.sync({ alter:true })
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch((err) => {
    console.error('Unable to synchronize the models:', err);
  });

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to database.');
  })
  .catch((err) => {
    console.error('enable to connect', err);
  });

export default sequelize;
