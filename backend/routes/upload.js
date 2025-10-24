const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { lessonId, contentType } = req.params;
    const uploadPath = path.join(__dirname, '../uploads/content', lessonId, contentType);
    
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
  },
  fileFilter: function (req, file, cb) {
    // Allow all file types for now
    cb(null, true);
  }
});

// Upload single file
router.post('/:lessonId/:contentType', upload.single('file'), (req, res) => {
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
    const fullPath = path.join(__dirname, '../uploads/content', lessonId, contentType, file.filename);
    
    // File information to return
    const fileInfo = {
      id: Date.now(),
      name: file.originalname,
      filename: file.filename,
      size: file.size,
      type: file.mimetype,
      path: filePath,
      fullPath: fullPath,
      url: `http://localhost:3001${filePath}`, // Add full URL for frontend access
      uploadedAt: new Date().toISOString()
    };

    // Update the lesson content JSON
    updateLessonContent(lessonId, contentType, fileInfo);

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
router.post('/:lessonId/:contentType/multiple', upload.array('files', 10), (req, res) => {
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
      const fullPath = path.join(__dirname, '../uploads/content', lessonId, contentType, file.filename);
      
      return {
        id: Date.now() + Math.random(),
        name: file.originalname,
        filename: file.filename,
        size: file.size,
        type: file.mimetype,
        path: filePath,
        fullPath: fullPath,
        url: `http://localhost:3001${filePath}`, // Add full URL for frontend access
        uploadedAt: new Date().toISOString()
      };
    });

    // Update the lesson content JSON
    updateLessonContent(lessonId, contentType, uploadedFiles);

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
router.get('/:lessonId/:contentType', (req, res) => {
  try {
    const { lessonId, contentType } = req.params;
    const contentPath = path.join(__dirname, '../uploads/content', lessonId, contentType);
    
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

// Delete a file
router.delete('/:lessonId/:contentType/:filename', (req, res) => {
  try {
    const { lessonId, contentType, filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/content', lessonId, contentType, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      
      // Update the lesson content JSON
      removeFileFromLessonContent(lessonId, contentType, filename);
      
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Delete failed',
      error: error.message
    });
  }
});

// Helper function to update lesson content JSON
function updateLessonContent(lessonId, contentType, fileInfo) {
  try {
    const contentPath = path.join(__dirname, '../uploads/content', lessonId, 'content.json');
    let contentData = {};
    
    // Load existing content if it exists
    if (fs.existsSync(contentPath)) {
      const existingContent = fs.readFileSync(contentPath, 'utf8');
      contentData = JSON.parse(existingContent);
    }
    
    // Initialize content structure if it doesn't exist
    if (!contentData[contentType]) {
      contentData[contentType] = {
        type: contentType,
        method: 'upload',
        files: [],
        uploadedAt: new Date().toISOString()
      };
    }
    
    // Add file info
    if (Array.isArray(fileInfo)) {
      contentData[contentType].files.push(...fileInfo);
    } else {
      contentData[contentType].files.push(fileInfo);
    }
    
    contentData[contentType].updatedAt = new Date().toISOString();
    
    // Save updated content
    fs.writeFileSync(contentPath, JSON.stringify(contentData, null, 2));
    
  } catch (error) {
    console.error('Error updating lesson content:', error);
  }
}

// Helper function to remove file from lesson content JSON
function removeFileFromLessonContent(lessonId, contentType, filename) {
  try {
    const contentPath = path.join(__dirname, '../uploads/content', lessonId, 'content.json');
    
    if (fs.existsSync(contentPath)) {
      const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
      
      if (contentData[contentType] && contentData[contentType].files) {
        contentData[contentType].files = contentData[contentType].files.filter(
          file => file.filename !== filename
        );
        contentData[contentType].updatedAt = new Date().toISOString();
        
        fs.writeFileSync(contentPath, JSON.stringify(contentData, null, 2));
      }
    }
    
  } catch (error) {
    console.error('Error removing file from lesson content:', error);
  }
}

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

module.exports = router;
