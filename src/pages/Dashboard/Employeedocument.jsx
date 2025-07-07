import React, { useState } from 'react';
import { Upload, File, Image, CheckCircle, X, AlertCircle } from 'lucide-react';

const allowedTypes = [
  { label: 'National ID', value: 'nid', icon: '🆔' },
  { label: 'Passport', value: 'passport', icon: '📘' },
  { label: 'Profile Photo', value: 'photo', icon: '📸' },
  { label: 'Resume', value: 'resume', icon: '📄' },
  { label: 'Educational Certificates', value: 'education', icon: '🎓' },
  { label: 'Experience Letters', value: 'experience', icon: '💼' },
  { label: 'Other Documents', value: 'other', icon: '📋' },
];

const Employeedocument = () => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newDocs = files.map((file) => ({
      file,
      type: '',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      status: 'pending',
    }));

    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      const newDocs = files.map((file) => ({
        file,
        type: '',
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        status: 'pending',
      }));
      setDocuments((prev) => [...prev, ...newDocs]);
    }
  };

  const handleTypeChange = (idx, value) => {
    setDocuments((prev) =>
      prev.map((doc, i) => (i === idx ? { ...doc, type: value } : doc))
    );
  };

  const handleRemove = (idx) => {
    const docToRemove = documents[idx];
    if (docToRemove.preview) {
      URL.revokeObjectURL(docToRemove.preview);
    }
    setDocuments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (documents.some(doc => !doc.type)) {
      alert('Please select document types for all files');
      return;
    }

    setUploading(true);
    
    try {
      const totalFiles = documents.length;
      let uploadedCount = 0;
      
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => ({
            ...prev,
            [i]: progress
          }));
        }
        
        uploadedCount++;
        setDocuments(prev => 
          prev.map((d, idx) => 
            idx === i ? { ...d, status: 'uploaded' } : d
          )
        );
      }
      
      alert(`${uploadedCount} documents uploaded successfully!`);
      setDocuments([]);
    } catch (error) {
      alert('Error uploading documents: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Employee Document Upload
          </h1>
          <p className="text-gray-600 text-lg">
            Securely upload and manage your important documents
          </p>
        </div>

        {/* Upload Zone */}
        <div className="mb-8">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50 scale-105'
                : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Upload className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Drop files here or click to browse
                </h3>
                <p className="text-gray-500">
                  Support for multiple file types • Maximum 10MB per file
                </p>
              </div>
              
              <button
                type="button"
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                disabled={uploading}
              >
                Choose Files
              </button>
            </div>
          </div>
        </div>

        {/* Documents List */}
        {documents.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center mb-6">
              <File className="w-6 h-6 text-indigo-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-800">
                Documents Ready for Upload ({documents.length})
              </h3>
            </div>
            
            <div className="space-y-4">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="group relative bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-indigo-300"
                >
                  <div className="flex items-start space-x-4">
                    {/* Preview */}
                    <div className="flex-shrink-0">
                      {doc.preview ? (
                        <div className="relative">
                          <img
                            src={doc.preview}
                            alt="preview"
                            className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                          />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <Image className="w-2 h-2 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg border-2 border-gray-200 flex flex-col items-center justify-center text-indigo-600 shadow-sm">
                          <File className="w-6 h-6 mb-1" />
                          <span className="text-xs font-medium">
                            {doc.file.name.split('.').pop().toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-800 truncate">{doc.name}</h4>
                          <p className="text-sm text-gray-500">{doc.size}</p>
                        </div>
                        
                        <button
                          onClick={() => handleRemove(idx)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
                          disabled={uploading}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Document Type Select */}
                      <div className="mb-3">
                        <select
                          value={doc.type}
                          onChange={(e) => handleTypeChange(idx, e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          disabled={doc.status === 'uploaded'}
                        >
                          <option value="">Select Document Type</option>
                          {allowedTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.icon} {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Progress Bar */}
                      {uploadProgress[idx] !== undefined && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-indigo-600">Uploading...</span>
                            <span className="text-sm text-gray-500">{uploadProgress[idx]}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${uploadProgress[idx]}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Status */}
                      {doc.status === 'uploaded' && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Uploaded successfully</span>
                        </div>
                      )}
                      
                      {!doc.type && doc.status !== 'uploaded' && (
                        <div className="flex items-center space-x-2 text-amber-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">Please select document type</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Upload Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleUpload}
                disabled={uploading || documents.some(doc => !doc.type)}
                className={`inline-flex items-center px-8 py-3 rounded-xl font-medium text-white transition-all duration-200 transform ${
                  uploading || documents.some(doc => !doc.type)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Uploading Documents...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload All Documents ({documents.length})
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employeedocument;