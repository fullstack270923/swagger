
const knex = require('knex')
const config = require('config')

// const connectedKnex = knex({
//     client: 'pg',
//     version: '13',
//     connection: {
//         host: '127.0.0.1',
//         user: 'postgres',
//         password: 'admin',
//         database: 'postgres'
//     }
// })

const connectedKnex = knex({
    client: 'pg',
    version: '13',
    connection: {
        host: config.db_local.host,
        user: config.db_local.user,
        password: config.db_local.password,
        database: config.db_local.database
    }
})

async function create_table_if_not_exist() {
    const tableExists = await connectedKnex.schema.hasTable('COMPANY');

    if (!tableExists) {
      await connectedKnex.schema.createTable('COMPANY', (table) => {
        table.increments('ID').primary(); // This creates a SERIAL column
        table.string('NAME').notNullable();
        table.integer('AGE').notNullable();
        table.string('ADDRESS', 50);
        table.decimal('SALARY');
      });
    }

}

async function stored_proc() {
    await connectedKnex.raw('select * from get_current_time()');
    return result    
}


async function delete_all() {
    // db.run('update company ....')
    const result = await connectedKnex('COMPANY').del()
    await connectedKnex.raw('ALTER SEQUENCE "COMPANY_ID_seq" RESTART WITH 1');
    return result    
}

async function get_all() {
    // db.run('select * from company')
    try {
    const emplyees = await connectedKnex('company').select('*') 
    console.log(emplyees);
//    await connectedKnex.raw('SELECT * FROM COMPANY');
    return emplyees
    }
    catch (e) {
        console.log(e);
        return null;
    }
}

async function get_by_id(id) {
    // db.run('select * from company where id=?')
    const emplyee = await connectedKnex('company').select('*').where('id', id).first()
    // [1, 'DANNY', 2000] ==> [{id: 1, 'name': 'danny' }] ORM
    return emplyee
}

async function new_employee(new_emp) {
    // db.run('insert into company ....')
    // result[0] will be the new ID given by the SQL
    // Insert into company values(....)
    const result = await connectedKnex('company').insert(new_emp)
    return { ...new_emp, ID: result[0] }
}

async function update_emplyee(id, updated_employee) {
    // db.run('update company ....')
    const result = await connectedKnex('company').where('ID', id).update(updated_employee)
    return updated_employee
}

async function delete_employee(id) {
    // db.run('update company ....')
    const result = await connectedKnex('company').where('ID', id).del()
    return result
}

module.exports = {
    get_all, get_by_id, new_employee, update_emplyee, delete_employee, 
    delete_all, create_table_if_not_exist
}
