import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function Videos() {
  const { logout } = useContext(AuthContext)

  const [album, setAlbum] = useState('All')

  const videos = [
    { id: 1, title: 'Push-up Tutorial', url: 'https://www.youtube.com/embed/_l3ySVKYVJ8', album: 'Upper Body' },
    { id: 2, title: 'Squat Tutorial', url: 'https://www.youtube.com/embed/aclHkVaku9U', album: 'Lower Body' },
    { id: 3, title: 'Plank Tutorial', url: 'https://www.youtube.com/embed/pSHjTRCQxIw', album: 'Core' },
    { id: 4, title: 'Burpees Tutorial', url: 'https://www.youtube.com/embed/TU8QYVW0gDU', album: 'Cardio' }, // updated
    { id: 5, title: 'Bicep Curl Tutorial', url: 'https://www.youtube.com/embed/ykJmrZ5v0Oo', album: 'Arms' },
    { id: 6, title: 'Deadlift Tutorial', url: 'https://www.youtube.com/embed/op9kVnSso6Q', album: 'Full Body' },
  ]

  const albums = ['All', 'Upper Body', 'Lower Body', 'Core', 'Cardio', 'Arms', 'Full Body']

  const filteredVideos =
    album === 'All' ? videos : videos.filter((v) => v.album === album)

  return (
    <div className="container py-4">
      {/* Navbar */}
      <nav className="mb-4">
        <Link to="/dashboard" className="mx-2">
          Dashboard
        </Link>
        <Link to="/goals" className="mx-2">
          Goals
        </Link>
        <Link to="/videos" className="mx-2">
          Videos
        </Link>
        <Link to="/workout" className="mx-2">
          Workout
        </Link>
        <Link to="/nutrition" className="mx-2">
          Nutrition
        </Link>
        <button
          onClick={logout}
          className="btn btn-sm btn-outline-danger float-end"
        >
          Sign Out
        </button>
      </nav>

      <h1>Videos</h1>

      {/* Album selector & note */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div>
          <label className="me-2">Albums:</label>
          <select
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            className="form-select d-inline-block w-auto"
          >
            {albums.map((a, idx) => (
              <option key={idx}>{a}</option>
            ))}
          </select>
        </div>
        <div className="mt-2 mt-md-0">
          <em>
            Note: The videos are demonstrations of exercises that we upload.
          </em>
        </div>
      </div>

      {/* Video grid */}
      <div className="row">
        {filteredVideos.map((video) => (
          <div className="col-md-6 col-lg-4 mb-4" key={video.id}>
            <div className="card h-100">
              <iframe
                width="100%"
                height="200"
                src={video.url}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="card-body">
                <h5 className="card-title">{video.title}</h5>
                <p className="card-text">{video.album}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
