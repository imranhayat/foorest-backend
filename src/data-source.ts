import { DataSource } from 'typeorm';
import { join } from 'path';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL ?? 'postgres://foorest:foorest_dev@localhost:5432/foorest',
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
});
