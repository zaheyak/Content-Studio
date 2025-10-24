const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { lessonId, contentType } = req.params;
    const uploadPath = path.join(__dirname, 'uploads', 'content', lessonId, contentType);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Upload single file
app.post('/api/upload/:lessonId/:contentType', upload.single('file'), (req, res) => {
  try {
    const { lessonId, contentType } = req.params;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Create the file path structure
    const filePath = `/uploads/content/${lessonId}/${contentType}/${file.filename}`;
    
    // File information to return
    const fileInfo = {
      id: Date.now(),
      name: file.originalname,
      filename: file.filename,
      size: file.size,
      type: file.mimetype,
      path: filePath,
      uploadedAt: new Date().toISOString()
    };

    console.log('File uploaded successfully:', fileInfo);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: fileInfo
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

// Upload multiple files
app.post('/api/upload/:lessonId/:contentType/multiple', upload.array('files', 10), (req, res) => {
  try {
    const { lessonId, contentType } = req.params;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = files.map(file => {
      const filePath = `/uploads/content/${lessonId}/${contentType}/${file.filename}`;
      
      return {
        id: Date.now() + Math.random(),
        name: file.originalname,
        filename: file.filename,
        size: file.size,
        type: file.mimetype,
        path: filePath,
        uploadedAt: new Date().toISOString()
      };
    });

    console.log('Multiple files uploaded successfully:', uploadedFiles);

    res.json({
      success: true,
      message: `${files.length} files uploaded successfully`,
      data: uploadedFiles
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: error.message
    });
  }
});

// Get uploaded files for a lesson
app.get('/api/upload/:lessonId/:contentType', (req, res) => {
  try {
    const { lessonId, contentType } = req.params;
    const contentPath = path.join(__dirname, 'uploads', 'content', lessonId, contentType);
    
    if (!fs.existsSync(contentPath)) {
      return res.json({
        success: true,
        data: []
      });
    }

    const files = fs.readdirSync(contentPath).map(filename => {
      const filePath = path.join(contentPath, filename);
      const stats = fs.statSync(filePath);
      
      return {
        id: Date.now() + Math.random(),
        name: filename,
        filename: filename,
        size: stats.size,
        type: getMimeType(filename),
        path: `/uploads/content/${lessonId}/${contentType}/${filename}`,
        uploadedAt: stats.birthtime.toISOString()
      };
    });

    res.json({
      success: true,
      data: files
    });

  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get files',
      error: error.message
    });
  }
});

// Helper function to get MIME type based on file extension
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
    '.avi': 'video/avi',
    '.mov': 'video/quicktime',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.html': 'text/html'
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Upload server running on port ${PORT}`);
  console.log(`📁 Upload directory: ${path.join(__dirname, 'uploads')}`);
});
