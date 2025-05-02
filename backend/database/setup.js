/**
 * Script para configurar o banco de dados do sistema Amor Pet
 * 
 * Este arquivo executa os scripts SQL para criar as tabelas
 * e inserir dados iniciais no banco de dados.
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Configuração do banco de dados
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'amor_pet',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
};

// Criar pool de conexão
const pool = new Pool(dbConfig);

// Caminhos dos scripts SQL
const schemaPath = path.join(__dirname, 'schema.sql');
const seedsPath = path.join(__dirname, 'seeds.sql');

// Função para executar script SQL
async function executeScript(filePath) {
  try {
    const script = fs.readFileSync(filePath, 'utf8');
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      await client.query(script);
      await client.query('COMMIT');
      console.log(`Script executado com sucesso: ${filePath}`);
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`Erro ao executar script ${filePath}:`, error);
      return false;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filePath}:`, error);
    return false;
  }
}

// Função principal
async function setupDatabase() {
  console.log('Iniciando configuração do banco de dados...');
  console.log(`Banco de dados: ${dbConfig.database}`);
  
  try {
    // Verificar conexão com o banco de dados
    const client = await pool.connect();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    client.release();
    
    // Executar script de criação de tabelas
    console.log('Criando tabelas...');
    const schemaResult = await executeScript(schemaPath);
    
    if (!schemaResult) {
      console.error('Falha ao criar tabelas. Abortando.');
      return;
    }
    
    // Executar script de dados iniciais
    console.log('Inserindo dados iniciais...');
    const seedsResult = await executeScript(seedsPath);
    
    if (!seedsResult) {
      console.error('Falha ao inserir dados iniciais.');
    }
    
    console.log('Configuração do banco de dados concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao configurar banco de dados:', error);
  } finally {
    // Fechar pool de conexão
    await pool.end();
  }
}

// Executar configuração
setupDatabase();
