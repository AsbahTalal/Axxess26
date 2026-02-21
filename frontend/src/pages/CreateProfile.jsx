import React, { useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { usePulse } from '../PulseContext'; // Updated context
// Note: Ensure your api file has a 'children' export similar to 'pets'
import api, { children as childApi } from '../api/api'; 

export default function CreateProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setChildData } = usePulse(); // Using Pediatric Pulse Context
  const fileInputRef = useRef(null);

  const profileToEdit = location.state?.profileToEdit;

  const [formData, setFormData] = useState({
    name: profileToEdit?.name || '',
    gender: profileToEdit?.gender || 'Male',
    age: profileToEdit?.age || '',
    weight: profileToEdit?.weight ?? '',
    medical: profileToEdit?.medical || '',
  });

  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(
    profileToEdit?.profile_photo_url || null
  );
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');

  const colors = {
    bgGradient: 'linear-gradient(135deg, #E0F2FE 0%, #EEF2FF 100%)', // Softer blue for pediatric
    primary: '#3B82F6', // Medical Blue
    textMain: '#1E293B',
    textMuted: '#94A3B8',
    inputBg: '#F8FAFC',
    border: '#E2E8F0'
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setPhotoError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file.');
      return;
    }
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  // Maps API data to the Frontend Child object
  function apiChildToFrontend(apiChild) {
    return {
      id: apiChild.id,
      name: apiChild.name,
      gender: apiChild.gender ?? '',
      age: apiChild.age ?? '',
      weight: apiChild.weight ?? '',
      medical: apiChild.health_notes ?? '',
      image: apiChild.profile_photo_url || '👶', 
      stats: apiChild.stats ?? { sleepHours: 8, activityData: [8, 7, 9, 11, 8, 10, 8] },
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPhotoUploading(true);

    const body = {
      name: formData.name,
      gender: formData.gender,
      age: formData.age,
      health_notes: formData.medical,
      weight: formData.weight ? parseFloat(formData.weight) : null,
    };

    try {
      let result;
      if (profileToEdit?.id) {
        result = await childApi.update(profileToEdit.id, body);
      } else {
        result = await childApi.create(body);
      }

      const frontendChild = apiChildToFrontend(result);
      
      // Update global context
      setChildData(frontendChild);

      // Handle photo upload if file selected
      if (profileFile) {
        try {
          await childApi.uploadProfilePicture(result.id, profileFile);
        } catch (err) {
          console.error("Photo upload failed, but profile was saved.");
        }
      }

      navigate('/dashboard');
    } catch (err) {
      setPhotoError(err.message || 'Failed to save profile.');
    } finally {
      setPhotoUploading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px', marginBottom: '10px', backgroundColor: colors.inputBg, 
    border: `1px solid ${colors.border}`, borderRadius: '12px', fontSize: '15px',
    boxSizing: 'border-box', outline: 'none', color: colors.textMain
  };

  return (
    <div style={{ 
      minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', background: colors.bgGradient, fontFamily: 'sans-serif', 
      padding: '20px', boxSizing: 'border-box'
    }}>
      <div style={{ 
        width: '100%', maxWidth: '450px', backgroundColor: '#FFFFFF', 
        borderRadius: '30px', padding: '40px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)' 
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '900', color: colors.textMain }}>
            {profileToEdit ? 'Edit Profile' : 'Create Child Profile'}
          </h1>
          <p style={{ color: colors.textMuted, marginTop: '8px' }}>
            Setting up smart monitoring for your little one.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Full Name</label>
          <input 
            type="text" required placeholder="Jamie Doe" style={inputStyle} 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Age</label>
              <input type="number" placeholder="Years" style={inputStyle} value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Gender</label>
              <select style={inputStyle} value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Weight (lbs)</label>
          <input type="number" step="0.1" style={inputStyle} value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />

          <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Medical Notes / Allergies</label>
          <textarea 
            style={{ ...inputStyle, height: '80px', resize: 'none' }} 
            value={formData.medical}
            onChange={(e) => setFormData({...formData, medical: e.target.value})}
          />

          {/* Photo Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
             <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid #E2E8F0' }}>
                {profilePreview ? <img src={profilePreview} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : '👶'}
             </div>
             <button type="button" onClick={() => fileInputRef.current.click()} style={{ fontSize: '12px', fontWeight: 'bold', color: colors.primary }}>Upload Photo</button>
             <input type="file" ref={fileInputRef} hidden onChange={handlePhotoChange} />
          </div>

          <button 
            type="submit" 
            disabled={photoUploading}
            style={{ 
              width: '100%', padding: '16px', background: colors.primary, color: 'white', 
              border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px', 
              marginTop: '20px', cursor: 'pointer' 
            }}
          >
            {photoUploading ? 'Saving...' : 'Finish Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}