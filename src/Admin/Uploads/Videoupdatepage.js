// export default Updatevideo;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../../Modules/Notification';
import './css/videoupload.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useParams } from 'react-router-dom';
import CustomSeparator from "../common/Breadcrumbs";

function Updatevideo() {
  const { id } = useParams(); 
  const [uploadMethod, setUploadMethod] = useState('');
  const [file, setFile] = useState('');
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoLink, setVideoLink] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [displayAt, setDisplayAt] = useState('');
  const [title, setTitle] = useState('');
  const [fileName, setFileName] = useState('');
  const [filePath, setFilePath] = useState('');
  const navigate = useNavigate();

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  // Fetch data for the current video
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/videos/view/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
        console.log("completedata is--",data);
          setTitle(data.title);
          setStatus(data.status ? 'active' : 'inactive');
          setDescription(data.description);
          // setUploadMethod(data.videoLink ? "link" : "local");
          // setVideoLink(data.videoLink);
          const formattedDisplayAt = data.displayAt ? new Date(data.displayAt).toISOString().slice(0, 16) : '';
        setDisplayAt(formattedDisplayAt);
         if (data.videoLink) {
          // Handle video link
          setUploadMethod("link");
          setVideoLink(data.videoLink);
        } else if (data.filePath) {
          // Handle local file
          setUploadMethod("local");
          const previewUrl = `http://localhost:5000/${data.filePath.replace(/\\/g, "/")}`;
          setVideoPreview(previewUrl);
          setFileName(data.fileName);
          setFilePath(data.filePath);
        }
        
        } else {
          console.error("Failed to fetch item data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleUploadMethodChange = (event) => {
    setUploadMethod(event.target.value);
    setFile(null);
    setVideoPreview(null);
    setVideoLink('');
  };
         
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('video/')) {
      Notification.error('Please upload a valid video file.');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB limit
    if (selectedFile.size > maxSize) {
      Notification.error('Video size must be less than 10 MB.');
      return;
    }

    setFile(selectedFile);
    const previewUrl = URL.createObjectURL(selectedFile);
    setVideoPreview(previewUrl);
  };

  const handleLinkSubmit = async () => {

    if (!videoLink || !videoLink.startsWith('http')) {
      Notification.error('Please enter a valid video link.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/videos/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoLink, title, description, status: status === 'active', displayAt }),
      });

      const data = await response.json();
      if (response.ok) {
        Notification.success('Video link updated successfully!');
        navigate('/admin/video-upload/list');
      } else {
        Notification.error(data.message);
      }
    } catch (error) {
      Notification.error('An error occurred while updating the video link.');
    }
  };

  const handleFileSubmit = async () => {
    // console.log({ file, title, description, status, displayAt });
    if ( !title || !description || !status || !displayAt ) {
      Notification.error('Please fill in all required fields and select a video file.');
      return;
    }
    const formData = new FormData();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', status === 'active');
    formData.append('displayAt', displayAt);

    if(file){
     formData.append('video', file);
    }
    else{
      formData.append('fileName',fileName);
      formData.append('filePath',filePath);
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/videos/update/${id}`, {
        method: 'PUT',
        body: formData,
        // body: JSON.stringify({  title, description, status: status === 'active', displayAt }),
      });

      const data = await response.json();
      if (response.ok) {
        Notification.success('Video updated successfully!');
        navigate('/admin/video-upload/list');
      } else {
        Notification.error(data.message);
      }
    } catch (error) {
      Notification.error('An error occurred while updating the video.');
    }
  };

  return (
     <>
        <CustomSeparator
        baseRoute="/admin/video-upload"
        /> 
    <div className="d-flex justify-content-center align-items-center vh-70 bg-light">
      <div className="container1 p-6 rounded shadow" style={{ maxWidth: '700px' }}>
        <h2 className="text-center mb-5" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '2.5rem', color: '#331' }}>
          UPDATE VIDEO
        </h2>

        <div className="mb-3">
          <label htmlFor="title" className="form-label fw-bold">Title</label>
          <input type="text" id="title" className="form-control" placeholder="Enter video title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-bold">Description</label>
          <textarea id="description" className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label fw-bold">Status</label>
          <select id="status" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="displayAt" className="form-label fw-bold">Display At</label>
          <input type="datetime-local" id="displayAt" className="form-control" value={displayAt} onChange={(e) => setDisplayAt(e.target.value)} />
        </div>

        <div className="mb-3">
          <label htmlFor="uploadMethod" className="form-label fw-bold">Choose Upload Method</label>
          <select id="uploadMethod" className="form-select" value={uploadMethod} onChange={handleUploadMethodChange}>
            <option value="" disabled>-- Select an option --</option>
            <option value="local">Upload in Local Storage</option>
            <option value="link">Upload via Link</option>
          </select>
        </div>

        {uploadMethod === 'local' && (
          <div className="mt-3">
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} style={{ marginRight: '10px' }}>
              Upload Video
              <VisuallyHiddenInput type="file"  accept="video/*"  onChange={handleFileChange} />
            </Button>

            {videoPreview && (
              <div className="mb-3">
                <video height="100" width="40%" controls>
                  <source src={videoPreview} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <Button variant="contained" color="primary" className="w-100 mt-3" onClick={handleFileSubmit}>
              Submit Video
            </Button>
          </div>
        )}
        {uploadMethod === 'link' && (
          <div className="mt-3">
            <label htmlFor="videoLink" className="form-label fw-bold">Enter Video Link</label>
            <input type="url" id="videoLink" className="form-control" placeholder="https://example.com/video.mp4" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} />
            <Button variant="contained" startIcon={<CloudUploadIcon />} className="btn btn-primary w-100 mt-3" onClick={handleLinkSubmit}>
              Submit Link
            </Button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}


export default Updatevideo;

