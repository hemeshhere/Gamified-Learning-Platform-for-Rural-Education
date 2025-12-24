import { BookOpen, Gamepad, Trophy, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: BookOpen,
    title: "Choose a Subject",
    description:
      "Pick from Math, Science, English, Hindi, or local languages. Start at your own level!",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    number: "02",
    icon: Gamepad,
    title: "Complete Fun Lessons",
    description:
      "Learn through interactive games, videos, and quizzes. Each lesson is engaging!",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    number: "03",
    icon: Trophy,
    title: "Earn XP & Progress",
    description:
      "Collect XP points, unlock badges, level up, and compete on village leaderboards!",
    gradient: "from-yellow-400 to-orange-500",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-gradient-to-b from-white via-purple-50 to-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-5 shadow">
            🎮 How It Works
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Start Learning in{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              3 Simple Steps
            </span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Simple, fun, and designed especially for kids.  
            Learning has never been this exciting 🚀
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop connection line */}
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-1 bg-gradient-to-r from-purple-300 via-blue-300 to-yellow-300 -translate-y-1/2 rounded-full" />

          <div className="grid md:grid-cols-3 gap-10 relative">
            {steps.map((step, index) => (
              <div key={step.number} className="relative group">
                <div className="bg-white p-10 rounded-3xl shadow-xl border border-purple-100 transition-all duration-300 hover:-translate-y-4 hover:shadow-2xl">

                  {/* Step badge */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <div
                      className={`px-5 py-1 text-sm font-bold text-white rounded-full bg-gradient-to-r ${step.gradient} shadow`}
                    >
                      Step {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 mt-6 bg-gradient-to-r ${step.gradient} shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <step.icon className="w-12 h-12 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-center">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-6 -translate-y-1/2 z-10">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-purple-100 animate-pulse">
                      <ArrowRight className="w-6 h-6 text-purple-500" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
