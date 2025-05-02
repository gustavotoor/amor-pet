/**
 * Rotas de Pets para o sistema Amor Pet
 * 
 * Este arquivo define as rotas relacionadas ao gerenciamento de pets,
 * incluindo criação, listagem, atualização e exclusão.
 */

const express = require('express');
const router = express.Router();
const PetController = require('../controllers/pet.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Todas as rotas de pets requerem autenticação
router.use(verifyToken);

// Rota para criar um novo pet
router.post('/', PetController.uploadImage, PetController.create);

// Rota para listar todos os pets do usuário
router.get('/', PetController.listByUser);

// Rota para buscar um pet específico
router.get('/:id', PetController.getById);

// Rota para atualizar um pet
router.put('/:id', PetController.uploadImage, PetController.update);

// Rota para excluir um pet
router.delete('/:id', PetController.delete);

module.exports = router;
