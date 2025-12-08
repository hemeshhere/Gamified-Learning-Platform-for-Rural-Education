import React from 'react'
import { Link } from 'react-router-dom'

export default function LessonCard({ lesson }){
  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{lesson.title}</h3>
          <p className="text-sm text-gray-600">{lesson.description}</p>
          <div className="mt-2 text-xs text-gray-500">Grade: {lesson.grade}</div>
        </div>
        <div className="text-right">
          {lesson.fileUrl && <div className="text-sm">📄 PDF</div>}
          {lesson.videoUrl && <div className="text-sm">🎥 Video</div>}
          <Link to={`/lessons/${lesson.id}`} className="block mt-3 text-blue-600 text-sm">Open</Link>
        </div>
      </div>
    </div>
  )
}
