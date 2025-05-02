/**
 * Integração com API de Pagamento Pix para o sistema Amor Pet
 * 
 * Este arquivo contém as funções necessárias para integração com a API de Pagamento Pix,
 * permitindo a geração de QR Codes Pix e o processamento de pagamentos.
 * 
 * Para um ambiente de produção, substitua a implementação genérica por uma integração
 * com um provedor específico (Mercado Pago, PagSeguro, etc.)
 */

const crypto = require('crypto');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Diretório para armazenar QR codes gerados
const QR_CODE_DIR = path.join(__dirname, '../public/qrcodes');

// Garantir que o diretório existe
if (!fs.existsSync(QR_CODE_DIR)) {
  fs.mkdirSync(QR_CODE_DIR, { recursive: true });
}

/**
 * Classe para gerenciar pagamentos via Pix
 */
class PixPaymentService {
  constructor() {
    // Configurações padrão (devem ser substituídas pelas configurações do banco de dados)
    this.pixKey = process.env.PIX_KEY || '12345678900'; // CPF/CNPJ
    this.merchantName = process.env.PIX_MERCHANT_NAME || 'Amor Pet Ltda';
    this.merchantCity = process.env.PIX_MERCHANT_CITY || 'São Paulo';
    this.testMode = process.env.PIX_TEST_MODE === 'true' || true;
  }

  /**
   * Atualiza as configurações do Pix
   * @param {Object} config - Configurações do Pix
   */
  updateConfig(config) {
    this.pixKey = config.pixKey || this.pixKey;
    this.merchantName = config.merchantName || this.merchantName;
    this.merchantCity = config.merchantCity || this.merchantCity;
    this.testMode = config.testMode !== undefined ? config.testMode : this.testMode;
  }

  /**
   * Gera um código Pix Copia e Cola
   * @param {number} amount - Valor do pagamento
   * @param {string} description - Descrição do pagamento
   * @param {string} reference - Referência do pagamento (ID do agendamento ou plano)
   * @returns {string} - Código Pix Copia e Cola
   */
  generatePixCode(amount, description, reference) {
    // Implementação simplificada do Pix Copia e Cola
    // Em um ambiente real, isso seria feito usando a biblioteca específica do provedor
    
    // Formato do Pix Copia e Cola (BRCode)
    const pixData = {
      pixKey: this.pixKey,
      description: description.substring(0, 25), // Limite de 25 caracteres
      merchantName: this.merchantName,
      merchantCity: this.merchantCity,
      amount: amount.toFixed(2),
      reference: reference,
      transactionId: uuidv4().substring(0, 25) // ID único para a transação
    };
    
    // Em um ambiente real, aqui seria usado o algoritmo correto para gerar o BRCode
    // Esta é uma implementação simplificada para demonstração
    const pixCodeString = `00020126580014BR.GOV.BCB.PIX0136${pixData.pixKey}5204000053039865802BR5913${pixData.merchantName}6008${pixData.merchantCity}62150511${pixData.reference}6304`;
    
    return pixCodeString;
  }

  /**
   * Gera um QR Code Pix
   * @param {number} amount - Valor do pagamento
   * @param {string} description - Descrição do pagamento
   * @param {string} reference - Referência do pagamento (ID do agendamento ou plano)
   * @returns {Promise<Object>} - Objeto com informações do QR Code
   */
  async generateQrCode(amount, description, reference) {
    try {
      const pixCode = this.generatePixCode(amount, description, reference);
      
      // Gerar nome de arquivo único
      const fileName = `pix_${reference}_${Date.now()}.png`;
      const filePath = path.join(QR_CODE_DIR, fileName);
      
      // Gerar QR Code
      await qrcode.toFile(filePath, pixCode, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300
      });
      
      return {
        success: true,
        pixCode: pixCode,
        qrCodeUrl: `/qrcodes/${fileName}`,
        amount: amount,
        description: description,
        reference: reference,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
      };
    } catch (error) {
      console.error('Erro ao gerar QR Code Pix:', error);
      return {
        success: false,
        error: 'Erro ao gerar QR Code Pix'
      };
    }
  }

  /**
   * Simula o processamento de um pagamento Pix (para modo de teste)
   * @param {string} reference - Referência do pagamento
   * @returns {Promise<Object>} - Resultado do processamento
   */
  async simulatePayment(reference) {
    if (!this.testMode) {
      return {
        success: false,
        error: 'Simulação de pagamento só está disponível no modo de teste'
      };
    }
    
    // Simular um atraso para processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      reference: reference,
      transactionId: `pix_${Date.now()}`,
      paidAt: new Date(),
      status: 'approved'
    };
  }

  /**
   * Verifica o status de um pagamento
   * @param {string} reference - Referência do pagamento
   * @returns {Promise<Object>} - Status do pagamento
   */
  async checkPaymentStatus(reference) {
    // Em um ambiente real, aqui seria feita uma consulta à API do provedor
    // Esta é uma implementação simplificada para demonstração
    
    if (this.testMode) {
      // No modo de teste, simular um status aleatório
      const statuses = ['pending', 'approved', 'pending', 'pending'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        success: true,
        reference: reference,
        status: randomStatus,
        checkedAt: new Date()
      };
    }
    
    // Em um ambiente real, retornaria o status real do pagamento
    return {
      success: false,
      error: 'Verificação de status não implementada para ambiente de produção'
    };
  }

  /**
   * Processa um webhook de confirmação de pagamento
   * @param {Object} payload - Dados recebidos no webhook
   * @returns {Object} - Resultado do processamento
   */
  processWebhook(payload) {
    // Em um ambiente real, aqui seria feita a validação e processamento do webhook
    // Esta é uma implementação simplificada para demonstração
    
    console.log('Webhook Pix recebido:', payload);
    
    // Validar payload
    if (!payload || !payload.reference || !payload.status) {
      return {
        success: false,
        error: 'Payload inválido'
      };
    }
    
    return {
      success: true,
      reference: payload.reference,
      status: payload.status,
      processedAt: new Date()
    };
  }
}

// Exportar instância única do serviço
module.exports = new PixPaymentService();
