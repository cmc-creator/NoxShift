import React, { useState } from 'react';
import { X, Camera, Upload, User, Trash2, Image as ImageIcon } from 'lucide-react';

interface EmployeePhotoManagerProps {
  employees: string[];
  photos: Record<string, string>;
  onUpdatePhoto: (employeeName: string, photoUrl: string) => void;
  onDeletePhoto: (employeeName: string) => void;
  onClose: () => void;
}

export default function EmployeePhotoManager({ employees, photos, onUpdatePhoto, onDeletePhoto, onClose }: EmployeePhotoManagerProps) {
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0] || '');
  const [photoUrl, setPhotoUrl] = useState('');
  const [useWebcam, setUseWebcam] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onUpdatePhoto(selectedEmployee, result);
        setPhotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setUseWebcam(true);
      const video = document.getElementById('webcam-preview') as HTMLVideoElement;
      if (video) video.srcObject = mediaStream;
    } catch (err) {
      alert('Camera access denied or not available');
    }
  };

  const capturePhoto = () => {
    const video = document.getElementById('webcam-preview') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const photo = canvas.toDataURL('image/jpeg');
    onUpdatePhoto(selectedEmployee, photo);
    setPhotoUrl(photo);
    stopWebcam();
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseWebcam(false);
  };

  const handleUrlSubmit = () => {
    if (photoUrl.trim()) {
      onUpdatePhoto(selectedEmployee, photoUrl);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="glass rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl text-white">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold gradient-text">Employee Photo Manager</h2>
              <p className="text-sm text-slate-500">Upload or capture employee photos</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee List */}
          <div className="md:col-span-1 space-y-2">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Select Employee</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {employees.map(emp => (
                <button
                  key={emp}
                  onClick={() => {
                    setSelectedEmployee(emp);
                    setPhotoUrl(photos[emp] || '');
                  }}
                  className={`w-full p-3 rounded-xl border-2 transition-all hover:scale-105 flex items-center gap-3 ${
                    selectedEmployee === emp ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  {photos[emp] ? (
                    <img src={photos[emp]} alt={emp} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(emp)}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-slate-700">{emp}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Management */}
          <div className="md:col-span-2 space-y-4">
            {/* Preview */}
            <div className="glass rounded-2xl p-6 text-center">
              <h3 className="text-sm font-bold text-slate-700 mb-4">Current Photo</h3>
              {photos[selectedEmployee] || photoUrl ? (
                <div className="relative inline-block">
                  <img
                    src={photos[selectedEmployee] || photoUrl}
                    alt={selectedEmployee}
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-xl"
                  />
                  <button
                    onClick={() => {
                      onDeletePhoto(selectedEmployee);
                      setPhotoUrl('');
                    }}
                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-white font-bold text-3xl mx-auto">
                  {getInitials(selectedEmployee)}
                </div>
              )}
              <p className="text-lg font-bold text-slate-800 mt-4">{selectedEmployee}</p>
            </div>

            {/* Upload Options */}
            <div className="grid grid-cols-1 gap-3">
              {/* File Upload */}
              <div className="glass rounded-xl p-4">
                <label className="flex items-center gap-3 cursor-pointer hover:bg-white/50 p-3 rounded-lg transition-all">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-slate-700">Upload from Computer</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Webcam */}
              <div className="glass rounded-xl p-4">
                {!useWebcam ? (
                  <button
                    onClick={startWebcam}
                    className="w-full flex items-center gap-3 hover:bg-white/50 p-3 rounded-lg transition-all"
                  >
                    <Camera className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-slate-700">Capture from Webcam</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <video
                      id="webcam-preview"
                      autoPlay
                      playsInline
                      className="w-full rounded-lg"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={capturePhoto}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all"
                      >
                        Capture Photo
                      </button>
                      <button
                        onClick={stopWebcam}
                        className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* URL Input */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Or paste image URL..."
                    className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                  <button
                    onClick={handleUrlSubmit}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
