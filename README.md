# CAD Blocks Application Documentation

## 📌 Project Overview
A Node.js and PostgreSQL application for processing and visualizing CAD file blocks (DXF).

---

## 🛠️ Database Setup

### SQL Scripts
```sql
-- Create database
CREATE DATABASE cad_blocks_db;

-- Create tables
CREATE TABLE "Files" (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL UNIQUE,
  originalname VARCHAR(255) NOT NULL,
  mimetype VARCHAR(100),
  size INTEGER,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Blocks" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  layer VARCHAR(100),
  x FLOAT,
  y FLOAT,
  z FLOAT,
  properties JSONB,
  "fileId" INTEGER REFERENCES "Files"(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_blocks_name ON "Blocks"(name);
CREATE INDEX idx_blocks_fileId ON "Blocks"("fileId");
```

---

## 📦 Installation Guide

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git

### Setup Steps
```bash
# Clone the repository
git clone https://github.com/sakethmalladi/rarome-cad-blocks-viewer.git
cd cad-blocks-app

# Install dependencies
npm install

# Create database
psql -U postgres -c "CREATE DATABASE cad_blocks_db;"

# Set up environment variables
cp .env.example .env
# Edit the .env file with your DB credentials

# Start the application
npm start
```

---

## 🔌 API Reference

### Base URL
```
http://localhost:5000/api
```

### Endpoints

| Method | Endpoint            | Description         | Parameters                   |
|--------|---------------------|---------------------|------------------------------|
| POST   | `/files/upload`     | Upload CAD file     | `Form-data: file`            |
| GET    | `/files`            | List uploaded files | None                         |
| GET    | `/blocks`           | List blocks         | `name`, `type`, `page`, `limit` |
| GET    | `/blocks/:id`       | Get block details   | None                         |

---

### Example Requests

```bash
# Upload file
curl -X POST http://localhost:5000/api/files/upload   -F "file=@sample.dxf"

# Get blocks
curl "http://localhost:5000/api/blocks?name=door&page=1"
```

---

## 🗂️ Project Structure

```
backend/
├── config/       # DB configuration
├── controllers/  # Route handlers
├── models/       # Sequelize models
├── routes/       # Express routers
├── services/     # Business logic
└── tests/        # Unit tests

frontend/
├── public/       # Static assets
├── app.js        # Main application logic
└── index.html    # User interface
```

---

## 📚 Library Selection

| Library      | Purpose                | Reason                                 |
|--------------|------------------------|----------------------------------------|
| dxf-parser   | Parse DXF files        | Lightweight, pure JS solution          |
| Sequelize    | PostgreSQL ORM         | Supports migrations, relations         |
| multer       | File upload handling   | Streamlined for Express                |
| jest         | Testing                | Comprehensive test runner              |

---

## 🧠 Development Notes

### Challenges & Solutions

- **DWG Support**  
  *Challenge*: No reliable open-source DWG parser  
  *Solution*: Implemented Teigha Converter for DWG→DXF conversion

- **Large File Processing**  
  *Challenge*: Memory issues with 50MB+ files  
  *Solution*: Implemented streaming file processing

- **Geometry Rendering**  
  *Challenge*: Browser visualization of CAD data  
  *Solution*: Used Three.js for simplified 2D previews

---

## ✅ Testing

```bash
# Run test suite
npm test

# With coverage
npm test -- --coverage
```

---

## 🚀 Deployment

### Production Requirements

- **Database**: Configure connection pooling
- **Storage**: Use AWS S3 for file storage
- **Security**: Implement JWT authentication

### Docker Configuration
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🧰 Troubleshooting

### Common Issues

- **Database Connection Errors**  
  - Verify PostgreSQL is running  
  - Check credentials in `.env`

- **File Upload Failures**  
  - Ensure `uploads/` directory exists  
  - Check file size limits (default: 10MB)

- **DWG Processing Issues**  
  - Confirm Teigha Converter is installed  
  - Check file version compatibility

---

## 🤖 AI Assistance

- **Code Generation**: Used GitHub Copilot for boilerplate
- **Debugging**: Leveraged ChatGPT for diagnosing memory leaks
- **Optimization**: AI recommended database indexing strategies

---

## 🤝 Contributing

1. Fork the repository  
2. Create your feature branch  
3. Commit your changes  
4. Push to the branch  
5. Open a pull request
