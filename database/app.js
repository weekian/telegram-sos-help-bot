require('singleton').setup('./models', 'postgres', "postgres", "root", {
  dialect: 'postgres',
  host: 'localhost',
  port: '5432'
});