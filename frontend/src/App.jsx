// App.jsx (FIXED)
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChangePassword from "./pages/ChangePassword";

import ProtectedRoute from "./components/common/ProtectedRoute";
import ProtectedElement from "./components/common/ProtectedElement";
import RoleRedirect from "./components/common/RoleRedirect";

// Auth
import Landing from "./pages/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import GlobalLoader from "./components/common/GlobalLoader";

// Student Pages
import StudentDashboard from "./pages/StudentDashboard";
import LessonsList from "./components/lessons/LessonsList";
import LessonViewer from "./components/lessons/LessonViewer";
import NotificationsPage from "./pages/NotificationsPage";
import ProgressPage from "./pages/ProgressPage";
import BadgeGallery from "./pages/BadgeGallery";
import QuizList from "./components/quiz/QuizList";
import QuizAttempt from "./components/quiz/QuizAttempt";

// Chat (Student)
import StudentChatList from "./pages/StudentChatList";
import ChatRoom from "./pages/ChatScreen";

// Teacher Pages
import TeacherDashboard from "./pages/TeacherDashboard";
import LessonUpload from "./pages/LessonUpload";
import QuizCreate from "./pages/QuizCreate";
import TeacherAddXP from "./pages/TeacherAddXP";
import TeacherSendNotification from "./pages/TeacherSendNotification";
import TeacherManageContent from "./pages/TeacherManageContent";
import TeacherStudentList from "./pages/TeacherStudentList";
import TeacherChatList from "./pages/TeacherChatList";

export default function App() {
  return (
    <BrowserRouter>
      <GlobalLoader />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ROOT REDIRECT */}
        <Route
          path="/"
          element={
            <ProtectedElement>
              <RoleRedirect />
            </ProtectedElement>
          }
        />

        {/*  STUDENT ROUTES  */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/lessons" element={<LessonsList />} />
          <Route path="/lessons/:id" element={<LessonViewer />} />
          <Route path="/quiz" element={<QuizList />} />
          <Route path="/quiz/:quizId" element={<QuizAttempt />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/badges" element={<BadgeGallery />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Student Chat */}
          <Route path="/student/chat" element={<StudentChatList />} />
          <Route path="/student/chat/:teacherId" element={<ChatRoom />} />
        </Route>

        {/*  TEACHER ROUTES  */}
        <Route element={<ProtectedRoute allowedRoles={["teacher", "admin"]} />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/create-lesson" element={<LessonUpload />} />
          <Route path="/teacher/create-quiz" element={<QuizCreate />} />
          <Route path="/teacher/add-xp" element={<TeacherAddXP />} />
          <Route path="/teacher/send-notification" element={<TeacherSendNotification />} />
          <Route path="/teacher/manage" element={<TeacherManageContent />} />
          <Route path="/teacher/students" element={<TeacherStudentList />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Teacher Chat */}
          <Route path="/teacher/chat" element={<TeacherChatList />} />
          <Route path="/teacher/chat/:studentId" element={<ChatRoom />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
