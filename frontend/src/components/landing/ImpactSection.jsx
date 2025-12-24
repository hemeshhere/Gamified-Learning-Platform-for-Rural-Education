import { TrendingUp, Users, BookOpen, Award, Sparkles } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: "85%",
    label: "Higher Engagement",
    description: "Students spend 3x more time learning",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    value: "10,000+",
    label: "Active Students",
    description: "Across 500+ villages",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BookOpen,
    value: "50,000+",
    label: "Lessons Completed",
    description: "Every month by learners",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Award,
    value: "1M+",
    label: "Badges Earned",
    description: "Celebrating achievements",
    gradient: "from-yellow-400 to-orange-500",
  },
];

const ImpactSection = () => {
  return (
    <section
      id="impact"
      className="py-28 bg-gradient-to-b from-white via-purple-50 to-white"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-24">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-5 shadow">
            <Sparkles className="w-4 h-4" />
            Our Impact
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Making a{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Real Difference
            </span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Real numbers that show how gamified learning is transforming
            education in rural India 🚀
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="relative group">
              {/* Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-20 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Card */}
              <div className="relative bg-white p-10 rounded-3xl shadow-xl border border-purple-100 transition-all duration-300 hover:-translate-y-4 hover:shadow-2xl text-center">
                {/* Icon */}
                <div
                  className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center bg-gradient-to-r ${stat.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                >
                  <stat.icon className="w-10 h-10 text-white" />
                </div>

                {/* Value */}
                <div className="text-4xl font-extrabold mb-2">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-lg font-bold mb-1">
                  {stat.label}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
