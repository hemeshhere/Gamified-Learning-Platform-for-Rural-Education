import {
  Gamepad2,
  Clock,
  Brain,
  WifiOff,
  Languages,
  LayoutDashboard,
  Trophy,
} from "lucide-react";

const features = [
  {
    icon: Gamepad2,
    title: "Gamified Lessons",
    description:
      "Learn through fun games and earn XP, badges, and rewards as you progress.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Clock,
    title: "Short Modules",
    description:
      "Bite-sized learning modules that fit any schedule, perfect for busy rural life.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Brain,
    title: "Adaptive Quizzes",
    description:
      "Smart quizzes that adjust difficulty based on student performance.",
    gradient: "from-pink-500 to-rose-400",
  },
  {
    icon: WifiOff,
    title: "Offline Support",
    description:
      "Download lessons and learn without internet. Works on low bandwidth too!",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    icon: Languages,
    title: "Local Languages",
    description:
      "Content available in Hindi, Tamil, Telugu, and other regional languages.",
    gradient: "from-yellow-400 to-orange-400",
  },
  {
    icon: LayoutDashboard,
    title: "Teacher Dashboard",
    description:
      "Teachers can track progress, assign tasks, and monitor student performance.",
    gradient: "from-indigo-500 to-purple-500",
  },
];

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="py-24 bg-gradient-to-b from-white via-purple-50 to-pink-50"
    >
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-bold mb-4 shadow-sm">
            🎮 Features
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Learn & Grow
            </span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Powerful features designed for rural education — simple, fun, and
            exciting for every child 🚀
          </p>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-white rounded-3xl p-8 shadow-xl border-2 border-transparent hover:border-purple-300 transition-all duration-300 hover:-translate-y-3 hover:rotate-[0.5deg]"
            >
              {/* Glow background */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* ICON */}
              <div
                className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
              >
                <feature.icon className="w-10 h-10 text-white" />
              </div>

              {/* TITLE */}
              <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* FUN DECOR DOT */}
              <div className="absolute top-5 right-5 w-3 h-3 rounded-full bg-purple-300 opacity-70 group-hover:scale-150 transition" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
