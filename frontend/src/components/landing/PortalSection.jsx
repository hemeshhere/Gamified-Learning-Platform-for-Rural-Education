import {
  GraduationCap,
  School,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
const studentBenefits = [
  "Learn at your own pace",
  "Fun games and quizzes",
  "Earn XP and badges",
  "Compete on leaderboards",
  "Works offline",
];

const teacherBenefits = [
  "Track student progress",
  "Assign custom lessons",
  "View analytics reports",
  "Create class competitions",
  "Easy content management",
];

const PortalSection = () => {
  return (
    <section
      id="portals"
      className="py-28 bg-gradient-to-b from-white via-purple-50 to-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-24">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-5 shadow">
            <Sparkles className="w-4 h-4" />
            Portals
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Designed for{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Students & Teachers
            </span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Two beautifully crafted experiences — one for curious learners,
            another for powerful educators 🚀
          </p>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Student Portal */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white p-10 rounded-3xl shadow-xl border border-purple-100 transition-all duration-300 hover:-translate-y-4 hover:shadow-2xl">
              {/* Badge */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <div className="px-5 py-1 text-sm font-bold text-white rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow">
                  Student Portal
                </div>
              </div>

              {/* Icon */}
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 mt-6 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>

              <ul className="space-y-4 mb-10">
                {studentBenefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    {benefit}
                  </li>
                ))}
              </ul>

                <Link to="/register">
                    <Button className="w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 group/btn">
                        Start Learning
                        <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                    </Button>
                </Link>
            </div>
          </div>

          {/* Teacher Portal */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white p-10 rounded-3xl shadow-xl border border-blue-100 transition-all duration-300 hover:-translate-y-4 hover:shadow-2xl">
              {/* Badge */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <div className="px-5 py-1 text-sm font-bold text-white rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow">
                  Teacher Dashboard
                </div>
              </div>

              {/* Icon */}
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <School className="w-12 h-12 text-white" />
              </div>

              <ul className="space-y-4 mb-10">
                {teacherBenefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    {benefit}
                  </li>
                ))}
              </ul>

            <Link to="/login">
            <Button className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 group/btn">
                Access Dashboard
                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform" />
            </Button>
            </Link>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortalSection;
