# File Storage System

## 📁 Directory Structure

```
uploads/
├── content/
│   ├── lesson_1234567890/
│   │   ├── videos/
│   │   │   ├── file-1703123456789-123456789.mp4
│   │   │   └── file-1703123456789-987654321.avi
│   │   ├── images/
│   │   │   ├── files-1703123456789-111111111.jpg
│   │   │   ├── files-1703123456789-222222222.png
│   │   │   └── files-1703123456789-333333333.gif
│   │   ├── presentations/
│   │   │   └── file-1703123456789-444444444.pdf
│   │   ├── code/
│   │   │   └── file-1703123456789-555555555.js
│   │   └── content.json
│   └── lesson_9876543210/
│       ├── videos/
│       ├── images/
│       └── content.json
```

## 🔄 How It Works

### 1. **File Upload Process:**
- Trainer uploads files through frontend
- Files are sent to `/api/upload/{lessonId}/{contentType}`
- Backend creates folder structure: `uploads/content/{lessonId}/{contentType}/`
- Files are saved with unique names: `{fieldname}-{timestamp}-{random}.{ext}`
- File info is stored in `content.json`

### 2. **Content JSON Structure:**
```json
{
  "videos": {
    "type": "videos",
    "method": "upload",
    "files": [
      {
        "id": 1703123456789,
        "name": "intro-video.mp4",
        "filename": "file-1703123456789-123456789.mp4",
        "size": 15728640,
        "type": "video/mp4",
        "path": "/uploads/content/lesson_1234567890/videos/file-1703123456789-123456789.mp4",
        "uploadedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "uploadedAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "images": {
    "type": "images",
    "method": "upload",
    "files": [
      {
        "id": 1703123456790,
        "name": "diagram.png",
        "filename": "files-1703123456789-111111111.png",
        "size": 2048576,
        "type": "image/png",
        "path": "/uploads/content/lesson_1234567890/images/files-1703123456789-111111111.png",
        "uploadedAt": "2024-01-15T10:35:00Z"
      }
    ],
    "uploadedAt": "2024-01-15T10:35:00Z",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

### 3. **API Endpoints:**

#### **Upload Single File:**
```bash
POST /api/upload/{lessonId}/{contentType}
Content-Type: multipart/form-data
Body: file (binary)
```

#### **Upload Multiple Files:**
```bash
POST /api/upload/{lessonId}/{contentType}/multiple
Content-Type: multipart/form-data
Body: files[] (binary array)
```

#### **Get Files:**
```bash
GET /api/upload/{lessonId}/{contentType}
Response: { "success": true, "data": [...] }
```

#### **Delete File:**
```bash
DELETE /api/upload/{lessonId}/{contentType}/{filename}
```

### 4. **Frontend Integration:**

#### **Image Upload:**
```javascript
const formData = new FormData();
files.forEach(file => {
  formData.append('files', file);
});

const response = await fetch(`http://localhost:3001/api/upload/${lessonId}/images/multiple`, {
  method: 'POST',
  body: formData
});
```

#### **Video Upload:**
```javascript
const formData = new FormData();
formData.append('file', file);

const response = await fetch(`http://localhost:3001/api/upload/${lessonId}/videos`, {
  method: 'POST',
  body: formData
});
```

## 🎯 Benefits

1. **Real File Storage** - Files are actually saved to disk
2. **Organized Structure** - Each lesson has its own folder
3. **Content Type Separation** - Videos, images, etc. in separate folders
4. **JSON Tracking** - File metadata stored in JSON for easy access
5. **Unique Filenames** - No conflicts with duplicate names
6. **File Management** - Upload, list, and delete operations
7. **Fallback Support** - Frontend falls back to localStorage if upload fails

## 🔧 Configuration

- **Max File Size:** 50MB
- **Supported Types:** All file types
- **Storage Location:** `./uploads/content/`
- **File Naming:** `{fieldname}-{timestamp}-{random}.{ext}`
- **Content Types:** videos, images, presentations, code, documents

## 📊 Example Usage

1. **Trainer uploads image** → Saved to `uploads/content/lesson_123/images/`
2. **File info stored** in `uploads/content/lesson_123/content.json`
3. **Frontend displays** file with real path and size
4. **View modal shows** actual file information
5. **No more "undefined"** or "NaN MB" errors!
