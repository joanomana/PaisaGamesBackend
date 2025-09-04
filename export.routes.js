import express from 'express';
import ExcelJS from 'exceljs';
import User from '../models/User.js';
import Media from '../models/Media.js';
import Review from '../models/Review.js';

const router = express.Router();

// Exportar usuarios
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().lean();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Usuarios');
    worksheet.columns = [
      { header: 'ID', key: '_id', width: 24 },
      { header: 'Username', key: 'username', width: 20 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Role', key: 'role', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 24 },
    ];
    users.forEach(user => worksheet.addRow(user));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=usuarios.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al exportar usuarios', error: err.message });
  }
});

// Exportar media
router.get('/media', async (req, res) => {
  try {
    const media = await Media.find().lean();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Media');
    worksheet.columns = [
      { header: 'ID', key: '_id', width: 24 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Created At', key: 'createdAt', width: 24 },
    ];
    media.forEach(item => worksheet.addRow({ ...item, category: item.category?.name || item.category }));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=media.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al exportar media', error: err.message });
  }
});

// Exportar reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().lean();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reviews');
    worksheet.columns = [
      { header: 'ID', key: '_id', width: 24 },
      { header: 'User', key: 'user', width: 24 },
      { header: 'Media', key: 'media', width: 24 },
      { header: 'Comment', key: 'comment', width: 40 },
      { header: 'Rating', key: 'rating', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 24 },
    ];
    reviews.forEach(review => worksheet.addRow(review));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=reviews.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error al exportar reviews', error: err.message });
  }
});

export default router;
