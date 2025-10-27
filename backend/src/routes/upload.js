const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const lessonId = req.body.lessonId || 'default';
    const type = req.body.type || 'general';
    const uploadPath = path.join(uploadsDir, 'lessons', lessonId, type);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const filename = `${name}_${timestamp}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const type = req.body.type;
    
    if (type === 'presentation') {
      // Allow presentation files
      const allowedTypes = ['.pptx', '.pdf', '.ppt'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type for presentation. Allowed: .pptx, .pdf, .ppt'));
      }
    } else if (type === 'mindmap') {
      // Allow image files
      const allowedTypes = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type for mindmap. Allowed: .png, .jpg, .jpeg, .gif, .webp'));
      }
    } else if (type === 'images') {
      // Allow image files
      const allowedTypes = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type for images. Allowed: .png, .jpg, .jpeg, .gif, .webp'));
      }
    } else if (type === 'videos') {
      // Allow video files
      const allowedTypes = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type for videos. Allowed: .mp4, .avi, .mov, .wmv, .flv, .webm'));
      }
    } else {
      cb(new Error('Invalid upload type'));
    }
  }
});

// Upload presentation endpoint
router.post('/presentation', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const lessonId = req.body.lessonId;
    const filePath = `/uploads/lessons/${lessonId}/presentations/${req.file.filename}`;
    const fullPath = path.join(uploadsDir, 'lessons', lessonId, 'presentations', req.file.filename);

    console.log('Presentation uploaded:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: filePath,
      lessonId: lessonId
    });

    res.json({
      success: true,
      data: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        path: filePath,
        url: `${req.protocol}://${req.get('host')}${filePath}`,
        type: 'presentation'
      },
      message: 'Presentation uploaded successfully'
    });
  } catch (error) {
    console.error('Presentation upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload presentation',
      error: error.message
    });
  }
});

// Upload mindmap endpoint
router.post('/mindmap', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const lessonId = req.body.lessonId;
    const filePath = `/uploads/lessons/${lessonId}/mindmaps/${req.file.filename}`;
    const fullPath = path.join(uploadsDir, 'lessons', lessonId, 'mindmaps', req.file.filename);

    console.log('Mindmap uploaded:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: filePath,
      lessonId: lessonId
    });

    res.json({
      success: true,
      data: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        path: filePath,
        url: `${req.protocol}://${req.get('host')}${filePath}`,
        type: 'mindmap'
      },
      message: 'Mindmap uploaded successfully'
    });
  } catch (error) {
    console.error('Mindmap upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload mindmap',
      error: error.message
    });
  }
});

// Upload images endpoint
router.post('/images', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const lessonId = req.body.lessonId;
    const filePath = `/uploads/lessons/${lessonId}/images/${req.file.filename}`;
    const fullPath = path.join(uploadsDir, 'lessons', lessonId, 'images', req.file.filename);

    console.log('Image uploaded:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: filePath,
      lessonId: lessonId
    });

    res.json({
      success: true,
      data: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        path: filePath,
        url: `${req.protocol}://${req.get('host')}${filePath}`,
        type: 'image'
      },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Upload videos endpoint
router.post('/videos', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const lessonId = req.body.lessonId;
    const filePath = `/uploads/lessons/${lessonId}/videos/${req.file.filename}`;
    const fullPath = path.join(uploadsDir, 'lessons', lessonId, 'videos', req.file.filename);

    console.log('Video uploaded:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: filePath,
      lessonId: lessonId
    });

    res.json({
      success: true,
      data: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        path: filePath,
        url: `${req.protocol}://${req.get('host')}${filePath}`,
        type: 'video'
      },
      message: 'Video uploaded successfully'
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload video',
      error: error.message
    });
  }
});

// Serve uploaded files
router.get('/lessons/:lessonId/:type/:filename', (req, res) => {
  try {
    const { lessonId, type, filename } = req.params;
    const filePath = path.join(uploadsDir, 'lessons', lessonId, type, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Set appropriate headers
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (['.pptx', '.ppt'].includes(ext)) {
      contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    } else if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
      contentType = `image/${ext.slice(1)}`;
    } else if (['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'].includes(ext)) {
      contentType = `video/${ext.slice(1)}`;
    }
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('File serve error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve file',
      error: error.message
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 50MB.'
      });
    }
  }
  
  res.status(400).json({
    success: false,
    message: error.message || 'Upload error'
  });
});

module.exports = router;
