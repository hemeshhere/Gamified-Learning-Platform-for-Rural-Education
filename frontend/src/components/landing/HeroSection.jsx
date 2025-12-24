import { Link } from "react-router-dom";
import { Sparkles, Trophy, Star, Gamepad2 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 text-center px-6">
      
      {/* Small fun badge */}
      <div className="mb-6 inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-2 rounded-full shadow text-purple-600 font-semibold">
        <Gamepad2 size={18} />
        Learning made fun 
      </div>

      {/* Main heading */}
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
        Learn. Play.{" "}
        <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Level Up!
        </span>
      </h1>

      {/* Description */}
       <div className="max-w-2xl mb-10 text-gray-700 text-lg md:text-xl leading-relaxed">
        <p className="mb-3">
            Welcome to{" "}
            <span className="font-bold text-purple-600">GramiLearn</span>{" "}
            <Sparkles className="inline text-pink-500 ml-1" size={22} />
        </p>
        <p className="mb-3 flex justify-center items-center gap-2 flex-wrap">
            Where learning feels like a{" "}
            <span className="font-semibold text-purple-600">fun game</span>
            <Gamepad2 className="text-purple-500" size={22} />
            instead of homework!
        </p>
        <p className="mb-3 flex justify-center items-center gap-2 flex-wrap">
            Complete lessons, earn{" "}
            <span className="font-semibold text-yellow-600">XP points</span>
            <Star className="text-yellow-500" size={22} />
            and collect cool{" "}
            <span className="font-semibold text-pink-600">badges</span>
            <Trophy className="text-pink-500" size={20} />
        </p>
        <p className="font-semibold text-purple-700">
            Level up your skills and become a{" "}
            <span className="font-bold text-2xl text-purple-900">Learning Hero</span> 
        </p>
       </div>

      {/* Feature highlights */}
      <div className="flex flex-wrap justify-center gap-6 mb-10 text-gray-700">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow">
          <Star className="text-yellow-500" />
          Fun Games & Quizzes
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow">
          <Trophy className="text-purple-600" />
          Badges & Rewards
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow">
          <Sparkles className="text-pink-500" />
          Learn at Your Own Pace
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          to="/register"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:scale-110 transition"
        >
          <Sparkles /> Start Playing
        </Link>

        <Link
          to="/login"
          className="flex items-center gap-2 bg-white border-2 border-purple-600 text-purple-600 px-10 py-4 rounded-full font-bold shadow hover:scale-110 transition"
        >
          <Trophy /> Login
        </Link>
      </div>

      {/* Bottom hint */}
      <p className="mt-8 text-sm text-gray-500">
         Fun •  Learning •  Growth
      </p>
    </section>
  );
}
