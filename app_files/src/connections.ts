import dotenv from 'dotenv';
import { QueryTypes, Sequelize } from 'sequelize';
import pg from 'pg';
const { Pool } = pg;
dotenv.config();

const connectToDb = async () => {
  try {
    await pool.connect();
    console.log('Connected to database');
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
};

const pool = new Pool({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  port: 5432,
});

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  logging: false
});

const queryViewDepartments = async (viewName: string) => {
  try {
    const queried = await sequelize.query(
      `SELECT * FROM ${viewName};`,
      {
        type: QueryTypes.SELECT
      }
    );

    console.log('\n');
    console.log(
      ' id    | dept_name    '
    );
    console.log(
      '-------+-------------'
    );

    queried.forEach((row: any) => {
      console.log(
        ` ${row.id.toString().padEnd(5)} | ` +
        `${row.dept_name.padEnd(12)}`
      );
    });
    console.log('\n');

    return queried;
  } catch (err) {
    console.error("Error", err);
    throw err;
  }
}

const queryViewEmployees = async (viewName: string) => {
  try{
    const queried = await sequelize.query(
      `SELECT * FROM ${viewName};`,
      {
        type: QueryTypes.SELECT
      }
    );

    console.log('\n');
    console.log(
      ' id  | first_name | last_name  | dept_name     | title         | salary     | manager_first_name   | manager_last_name    '
    );
    console.log(
      '-----+------------+------------+---------------+---------------+------------+----------------------+----------------------'
    );

    queried.forEach((row: any) => {
      console.log(
        ` ${row.id.toString().padEnd(3)} | ` +
        `${row.first_name.padEnd(10)} | ` +
        `${row.last_name.padEnd(10)} | ` +
        `${row.dept_name.padEnd(13)} | ` +
        `${row.title.padEnd(13)} | ` +
        `${row.salary.padEnd(10)} | ` +
        `${(row.manager_first_name || '').padEnd(20)} | ` +
        `${(row.manager_last_name || '').padEnd(20)}`
      );
    });
    console.log('\n');

      return queried
  }catch (err){
    console.error("Error", err);
    throw err;
  }
}

const queryViewRoles = async (viewName: string) => {
  try{
    const queried = await sequelize.query(
      `SELECT * FROM ${viewName};`,
      {
        type: QueryTypes.SELECT
      }
    );

    console.log('\n');
    console.log(
      ' title         | salary    '
    );
    console.log(
      '---------------+-----------'
    );

    queried.forEach((row: any) => {
      console.log(
        `${row.title.padEnd(14)} | ` +
        `${row.salary.toString().padEnd(10)}`
      );
    });
    console.log('\n');

      return queried
  }catch (err){
    console.error("Error", err);
    throw err;
  }
}
  
export { queryViewDepartments, queryViewEmployees, queryViewRoles, pool, connectToDb };