import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import MarkCompleteButton from "./MarkCompleteButton";

export default function LessonViewer() {
  const { id } = useParams();

  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const res = await api.get(`/lessons/${id}`);
      return res.data;
    },
  });

  if (isLoading)
    return <div className="p-6 text-center text-gray-600">Loading lesson...</div>;

  if (error || !lesson)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load lesson. Please try again.
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-3">{lesson.title}</h1>
      <p className="text-gray-700 mb-6">{lesson.description}</p>

      {/* PDF Viewer */}
      {lesson.fileUrl && (
        <div className="mb-8">
          <h2 className="font-semibold mb-2 text-lg">PDF Material</h2>
          <iframe
            src={lesson.fileUrl}
            title="Lesson PDF"
            className="w-full h-[600px] border rounded-lg"
          />
        </div>
      )}

      {/* Video Viewer */}
      {lesson.videoUrl && (
        <div className="mb-8">
          <h2 className="font-semibold mb-2 text-lg">Video Lesson</h2>
          <video
            controls
            className="w-full rounded-lg shadow-lg max-h-[500px]"
          >
            <source src={lesson.videoUrl} />
            Your browser does not support video playback.
          </video>
        </div>
      )}

      <div className="mt-6">
        <MarkCompleteButton lessonId={lesson._id || lesson.id} />
      </div>
    </div>
  );
}
