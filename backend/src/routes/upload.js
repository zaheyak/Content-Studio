const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { lessonDataManager } = require('../data/lessonsData');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // Get lessonId from query parameters or body
      const lessonId = req.query.lessonId || req.body.lessonId || 'default';
      // Get type from URL path since we're using /api/upload/{type}
      const urlParts = req.originalUrl.split('/');
      const type = urlParts[urlParts.length - 1];
      
      // Use plural form for type to match the directory structure
      const typeDir = type === 'presentation' ? 'presentations' : 
                     type === 'mindmap' ? 'mindmaps' : 
                     type === 'image' ? 'images' : 
                     type === 'video' ? 'videos' : type;
      
      const uploadPath = path.join(uploadsDir, 'lessons', lessonId, typeDir);
      
      console.log('Multer destination - lessonId:', lessonId, 'type:', type, 'typeDir:', typeDir, 'uploadPath:', uploadPath);
      console.log('Request query:', req.query);
      console.log('Request body keys:', Object.keys(req.body || {}));
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log('Created upload directory:', uploadPath);
      }
      
      cb(null, uploadPath);
    } catch (error) {
      console.error('Error in multer destination:', error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    try {
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      const filename = `${name}_${timestamp}${ext}`;
      console.log('Multer filename - original:', file.originalname, 'generated:', filename);
      cb(null, filename);
    } catch (error) {
      console.error('Error in multer filename:', error);
      cb(error);
    }
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  onError: (err, next) => {
    console.error('Multer error:', err);
    next(err);
  },
  fileFilter: (req, file, cb) => {
    // Get type from URL path since we're using /api/upload/{type}
    const urlParts = req.originalUrl.split('/');
    const type = urlParts[urlParts.length - 1];
    
    console.log('File filter - URL type:', type, 'File:', file.originalname, 'MIME:', file.mimetype);
    
    // Allow all file types for now - we'll filter by MIME type
    if (type === 'presentation') {
      // Allow presentation files
      if (file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
          file.mimetype === 'application/pdf' ||
          file.mimetype === 'application/vnd.ms-powerpoint') {
        console.log('Presentation file accepted');
        cb(null, true);
      } else {
        console.log('Presentation file rejected - invalid MIME type:', file.mimetype);
        cb(new Error('Invalid file type for presentation. Allowed: .pptx, .pdf, .ppt'));
      }
    } else if (type === 'mindmap') {
      // Allow image files
      if (file.mimetype.startsWith('image/')) {
        console.log('Mindmap file accepted');
        cb(null, true);
      } else {
        console.log('Mindmap file rejected - invalid MIME type:', file.mimetype);
        cb(new Error('Invalid file type for mindmap. Allowed: .png, .jpg, .jpeg, .gif, .webp'));
      }
    } else if (type === 'images') {
      // Allow image files
      if (file.mimetype.startsWith('image/')) {
        console.log('Image file accepted');
        cb(null, true);
      } else {
        console.log('Image file rejected - invalid MIME type:', file.mimetype);
        cb(new Error('Invalid file type for images. Allowed: .png, .jpg, .jpeg, .gif, .webp'));
      }
    } else if (type === 'videos') {
      // Allow video files
      if (file.mimetype.startsWith('video/')) {
        console.log('Video file accepted');
        cb(null, true);
      } else {
        console.log('Video file rejected - invalid MIME type:', file.mimetype);
        cb(new Error('Invalid file type for videos. Allowed: .mp4, .avi, .mov, .wmv, .flv, .webm'));
      }
    } else {
      console.log('Invalid upload type:', type);
      cb(new Error('Invalid upload type: ' + type));
    }
  }
});

// Test endpoint to check if multer is working
router.post('/test', upload.single('file'), (req, res) => {
  console.log('Test upload - file:', req.file);
  console.log('Test upload - body:', req.body);
  res.json({ success: true, file: req.file, body: req.body });
});

// Upload presentation endpoint
router.post('/presentation', upload.single('file'), (req, res) => {
  try {
    console.log('Presentation upload request:', {
      query: req.query,
      body: req.body,
      file: req.file ? {
        originalname: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        path: req.file.path,
        destination: req.file.destination
      } : 'No file'
    });

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const lessonId = req.query.lessonId || req.body.lessonId;
    const filePath = `/uploads/lessons/${lessonId}/presentations/${req.file.filename}`;
    const fullPath = path.join(uploadsDir, 'lessons', lessonId, 'presentations', req.file.filename);

    console.log('Presentation uploaded:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: filePath,
      fullPath: fullPath,
      lessonId: lessonId
    });

    // Update lesson data structure with presentation info
    const presentationContent = {
      type: 'presentation',
      method: 'upload',
      file: {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        path: filePath
      },
      presentation_url: filePath
    };

    lessonDataManager.updateLessonContent(lessonId, 'presentation', presentationContent);

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

    const lessonId = req.query.lessonId || req.body.lessonId;
    const filePath = `/uploads/lessons/${lessonId}/mindmaps/${req.file.filename}`;
    const fullPath = path.join(uploadsDir, 'lessons', lessonId, 'mindmaps', req.file.filename);

    console.log('Mindmap uploaded:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: filePath,
      lessonId: lessonId
    });

    // Update lesson data structure with mindmap info
    const mindmapContent = {
      type: 'mindmap',
      method: 'upload',
      file: {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        path: filePath
      },
      mindmap_url: filePath
    };

    lessonDataManager.updateLessonContent(lessonId, 'mindmap', mindmapContent);

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
router.post('/images', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const lessonId = req.query.lessonId || req.body.lessonId;
    const uploadedFiles = [];

    // Process each uploaded file
    req.files.forEach(file => {
      const filePath = `/uploads/lessons/${lessonId}/images/${file.filename}`;
      
      console.log('Image uploaded:', {
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        path: filePath,
        lessonId: lessonId
      });

      uploadedFiles.push({
        name: file.originalname,
        filename: file.filename,
        size: file.size,
        type: file.mimetype,
        path: filePath,
        url: `${req.protocol}://${req.get('host')}${filePath}`
      });
    });

    // Get existing images or create new array
    const existingLesson = lessonDataManager.getLesson(lessonId);
    const existingImages = existingLesson?.content?.images?.files || [];
    
    // Add new images to existing images
    const newImages = uploadedFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      path: file.path
    }));
    
    const updatedImages = [...existingImages, ...newImages];
    
    // Update lesson data structure with images info
    const imagesContent = {
      type: 'images',
      method: 'upload',
      files: updatedImages,
      count: updatedImages.length
    };

    lessonDataManager.updateLessonContent(lessonId, 'images', imagesContent);

    res.json({
      success: true,
      data: uploadedFiles,
      message: `${uploadedFiles.length} image(s) uploaded successfully`
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

    const lessonId = req.query.lessonId || req.body.lessonId;
    const filePath = `/uploads/lessons/${lessonId}/videos/${req.file.filename}`;
    const fullPath = path.join(uploadsDir, 'lessons', lessonId, 'videos', req.file.filename);

    console.log('Video uploaded:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      path: filePath,
      lessonId: lessonId
    });

    // Get existing videos or create new array
    const existingLesson = lessonDataManager.getLesson(lessonId);
    const existingVideos = existingLesson?.content?.video?.files || [];
    
    // Add new video to existing videos
    const newVideo = {
      name: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      path: filePath
    };
    
    const updatedVideos = [...existingVideos, newVideo];
    
    // Update lesson data structure with video info
    const videoContent = {
      type: 'video',
      method: 'upload',
      files: updatedVideos
    };

    lessonDataManager.updateLessonContent(lessonId, 'video', videoContent);

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
