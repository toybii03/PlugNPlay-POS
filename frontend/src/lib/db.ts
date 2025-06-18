import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // Default XAMPP MySQL password is empty
    database: 'pos_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test the connection
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

export default pool; 