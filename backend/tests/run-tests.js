/**
 * Script para executar testes do sistema Amor Pet
 * 
 * Este arquivo configura e executa os testes automatizados
 * para verificar o funcionamento correto do sistema.
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Diretório para relatórios de teste
const REPORTS_DIR = path.join(__dirname, '../reports');

// Garantir que o diretório existe
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// Arquivo de relatório
const reportFile = path.join(REPORTS_DIR, `test-report-${Date.now()}.txt`);

// Configurar ambiente de teste
process.env.NODE_ENV = 'test';
process.env.PORT = 3001; // Porta diferente para testes
process.env.DB_NAME = 'amor_pet_test';
process.env.EMAIL_TEST_MODE = 'true';

console.log('Iniciando testes do sistema Amor Pet...');
console.log(`Data e hora: ${new Date().toLocaleString()}`);
console.log(`Ambiente: ${process.env.NODE_ENV}`);
console.log(`Relatório será salvo em: ${reportFile}`);

// Executar testes
const testProcess = exec('npx mocha tests/api.test.js --timeout 10000', {
  cwd: path.join(__dirname, '..')
});

// Capturar saída
let output = '';

testProcess.stdout.on('data', (data) => {
  output += data;
  process.stdout.write(data);
});

testProcess.stderr.on('data', (data) => {
  output += data;
  process.stderr.write(data);
});

// Finalizar e salvar relatório
testProcess.on('close', (code) => {
  const result = code === 0 ? 'SUCESSO' : 'FALHA';
  
  output += `\n\n=== RESULTADO FINAL ===\n`;
  output += `Status: ${result}\n`;
  output += `Código de saída: ${code}\n`;
  output += `Data e hora de conclusão: ${new Date().toLocaleString()}\n`;
  
  // Salvar relatório
  fs.writeFileSync(reportFile, output);
  
  console.log(`\nTestes concluídos com ${result}`);
  console.log(`Relatório completo salvo em: ${reportFile}`);
  
  if (code === 0) {
    console.log('\nTodos os testes passaram com sucesso!');
  } else {
    console.log('\nAlguns testes falharam. Verifique o relatório para mais detalhes.');
  }
});
