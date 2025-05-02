/**
 * Controlador de Pets para o sistema Amor Pet
 * 
 * Este arquivo contém os métodos para gerenciar pets dos tutores,
 * incluindo criação, listagem, atualização e exclusão.
 */

const { Pet, User } = require('../models');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../frontend/public/uploads/pets');
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `pet-${uniqueSuffix}${ext}`);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas!'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB
});

// Controlador de Pets
const PetController = {
  // Middleware para upload de imagem
  uploadImage: upload.single('photo'),
  
  // Criar novo pet
  create: async (req, res) => {
    try {
      const { name, species, breed, age, weight, observations } = req.body;
      const userId = req.user.id;
      
      // Verificar se o usuário existe
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Preparar dados do pet
      const petData = {
        user_id: userId,
        name,
        species,
        breed,
        age: age ? parseInt(age) : null,
        weight: weight ? parseFloat(weight) : null,
        observations,
        photo_url: req.file ? `/uploads/pets/${req.file.filename}` : null
      };
      
      // Criar o pet
      const pet = await Pet.create(petData);
      
      return res.status(201).json({
        message: 'Pet cadastrado com sucesso',
        pet
      });
    } catch (error) {
      console.error('Erro ao criar pet:', error);
      
      // Se houver um arquivo enviado, excluí-lo em caso de erro
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(500).json({ 
        message: 'Erro ao cadastrar pet',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Listar todos os pets do usuário
  listByUser: async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Buscar todos os pets do usuário
      const pets = await Pet.findAll({
        where: { user_id: userId },
        order: [['name', 'ASC']]
      });
      
      return res.status(200).json(pets);
    } catch (error) {
      console.error('Erro ao listar pets:', error);
      return res.status(500).json({ 
        message: 'Erro ao listar pets',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Buscar pet por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Buscar o pet
      const pet = await Pet.findOne({
        where: { 
          id,
          user_id: userId
        }
      });
      
      if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado' });
      }
      
      return res.status(200).json(pet);
    } catch (error) {
      console.error('Erro ao buscar pet:', error);
      return res.status(500).json({ 
        message: 'Erro ao buscar pet',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Atualizar pet
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, species, breed, age, weight, observations } = req.body;
      const userId = req.user.id;
      
      // Buscar o pet
      const pet = await Pet.findOne({
        where: { 
          id,
          user_id: userId
        }
      });
      
      if (!pet) {
        // Se houver um arquivo enviado, excluí-lo
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        
        return res.status(404).json({ message: 'Pet não encontrado' });
      }
      
      // Preparar dados para atualização
      const updateData = {
        name,
        species,
        breed,
        age: age ? parseInt(age) : null,
        weight: weight ? parseFloat(weight) : null,
        observations
      };
      
      // Se uma nova foto foi enviada
      if (req.file) {
        // Excluir foto antiga se existir
        if (pet.photo_url) {
          const oldPhotoPath = path.join(__dirname, '../../frontend/public', pet.photo_url);
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
          }
        }
        
        // Atualizar com nova foto
        updateData.photo_url = `/uploads/pets/${req.file.filename}`;
      }
      
      // Atualizar o pet
      await pet.update(updateData);
      
      return res.status(200).json({
        message: 'Pet atualizado com sucesso',
        pet: await pet.reload()
      });
    } catch (error) {
      console.error('Erro ao atualizar pet:', error);
      
      // Se houver um arquivo enviado, excluí-lo em caso de erro
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(500).json({ 
        message: 'Erro ao atualizar pet',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  // Excluir pet
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Buscar o pet
      const pet = await Pet.findOne({
        where: { 
          id,
          user_id: userId
        }
      });
      
      if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado' });
      }
      
      // Excluir foto se existir
      if (pet.photo_url) {
        const photoPath = path.join(__dirname, '../../frontend/public', pet.photo_url);
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
        }
      }
      
      // Excluir o pet
      await pet.destroy();
      
      return res.status(200).json({ message: 'Pet excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir pet:', error);
      return res.status(500).json({ 
        message: 'Erro ao excluir pet',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = PetController;
