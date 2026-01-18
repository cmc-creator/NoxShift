import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Home, Plus, Heart, MessageCircle, Download, Share2, Filter, Grid, List, X } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
  uploadedBy: string;
  uploadDate: Date;
  likes: number;
  comments: number;
  category: 'team' | 'events' | 'celebrations' | 'workplace' | 'fun';
}

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [filter, setFilter] = useState<'all' | 'team' | 'events' | 'celebrations'>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const photos: Photo[] = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      title: 'Team Building Day 2026',
      description: 'Amazing team building event at the bowling alley!',
      uploadedBy: 'Sarah J.',
      uploadDate: new Date(2026, 0, 15),
      likes: 24,
      comments: 8,
      category: 'team'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800',
      title: 'Holiday Party 2025',
      description: 'Celebrating the holidays with the best team ever!',
      uploadedBy: 'Michael C.',
      uploadDate: new Date(2025, 11, 20),
      likes: 45,
      comments: 12,
      category: 'celebrations'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
      title: 'New Office Space',
      description: 'Our beautiful new workspace!',
      uploadedBy: 'Emily D.',
      uploadDate: new Date(2026, 0, 10),
      likes: 18,
      comments: 5,
      category: 'workplace'
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1530099486328-e021101a494a?w=800',
      title: "Sarah's Birthday Celebration",
      description: 'Happy birthday to our amazing receptionist!',
      uploadedBy: 'Karen M.',
      uploadDate: new Date(2026, 0, 12),
      likes: 32,
      comments: 15,
      category: 'celebrations'
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800',
      title: 'Monthly All-Hands Meeting',
      description: 'Great turnout for our January meeting!',
      uploadedBy: 'James W.',
      uploadDate: new Date(2026, 0, 5),
      likes: 12,
      comments: 3,
      category: 'events'
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800',
      title: 'Coffee Chat Friday',
      description: 'Casual Friday vibes ☕',
      uploadedBy: 'Izzy C.',
      uploadDate: new Date(2026, 0, 17),
      likes: 28,
      comments: 9,
      category: 'fun'
    },
    {
      id: '7',
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      title: 'Training Workshop',
      description: 'Learning new skills together!',
      uploadedBy: 'Manager',
      uploadDate: new Date(2026, 0, 8),
      likes: 15,
      comments: 4,
      category: 'events'
    },
    {
      id: '8',
      url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
      title: 'Team Lunch',
      description: 'Pizza Friday is the best! 🍕',
      uploadedBy: 'Sarah J.',
      uploadDate: new Date(2026, 0, 16),
      likes: 35,
      comments: 11,
      category: 'team'
    },
  ];

  const filteredPhotos = filter === 'all' 
    ? photos 
    : photos.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/command-center" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Home className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">Command Center</span>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Camera className="w-7 h-7 text-purple-400" />
                  Photo Gallery 📸
                </h1>
                <p className="text-xs text-purple-200">{photos.length} team memories captured</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-purple-600' : 'hover:bg-white/10'}`}
                >
                  <Grid className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-purple-600' : 'hover:bg-white/10'}`}
                >
                  <List className="w-4 h-4 text-white" />
                </button>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:scale-105 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Upload Photo
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'all', label: 'All Photos', emoji: '📷' },
              { id: 'team', label: 'Team', emoji: '👥' },
              { id: 'events', label: 'Events', emoji: '🎉' },
              { id: 'celebrations', label: 'Celebrations', emoji: '🎊' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  filter === f.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-purple-200 hover:bg-white/10'
                }`}
              >
                <span>{f.emoji}</span>
                <span className="font-semibold text-sm">{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                  <h3 className="font-bold text-white mb-1">{photo.title}</h3>
                  <p className="text-xs text-purple-200 mb-2">by {photo.uploadedBy}</p>
                  <div className="flex items-center gap-3 text-sm text-white">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {photo.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {photo.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-[1.02] transition-all cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="flex gap-6">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-48 h-48 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{photo.title}</h3>
                    <p className="text-purple-200 mb-3">{photo.description}</p>
                    <div className="flex items-center gap-4 text-sm text-purple-300 mb-4">
                      <span>Uploaded by {photo.uploadedBy}</span>
                      <span>•</span>
                      <span>{photo.uploadDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-white font-semibold">{photo.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        <MessageCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-semibold">{photo.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4 text-green-400" />
                        <span className="text-white font-semibold">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="w-full rounded-2xl mb-6 max-h-[70vh] object-contain"
            />
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h2 className="text-3xl font-bold text-white mb-2">{selectedPhoto.title}</h2>
              <p className="text-purple-200 mb-4">{selectedPhoto.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-purple-300 text-sm">
                  Uploaded by {selectedPhoto.uploadedBy} on {selectedPhoto.uploadDate.toLocaleDateString()}
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <Heart className="w-5 h-5 text-red-400" />
                    <span className="text-white font-bold">{selectedPhoto.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <MessageCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-bold">{selectedPhoto.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors">
                    <Download className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
