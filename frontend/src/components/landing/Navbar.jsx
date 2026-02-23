import { Gamepad2, Menu, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Portals", href: "#portals" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("Features");

  /* Scroll spy */
  useEffect(() => {
    const sections = navLinks.map(l => document.querySelector(l.href));

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const found = navLinks.find(
              l => l.href === `#${entry.target.id}`
            );
            if (found) setActive(found.name);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach(sec => sec && observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-200"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 8 }}
              className="w-11 h-11 rounded-2xl bg-pink-500 flex items-center justify-center shadow-lg"
            >
              <Gamepad2 className="text-white" />
            </motion.div>
            <span className="text-2xl font-extrabold bg-purple-600 bg-clip-text text-transparent">
              GramiLearn
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex gap-10 font-semibold text-gray-700 relative">
            {navLinks.map(link => {
              const isActive = active === link.name;

              return (
                <button
                  key={link.name}
                  onClick={() =>
                    document
                      .querySelector(link.href)
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="relative group"
                >
                  <span
                    className={`transition-colors ${
                      isActive
                        ? "text-purple-600"
                        : "group-hover:text-purple-600"
                    }`}
                  >
                    {link.name}
                  </span>

                  {/* Hover underline (CSS – no bugs) */}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 w-full bg-gradient-to-r from-purple-500 to-pink-500 
                    transition-transform duration-300 origin-left
                    ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                  />

                  {/* Active underline (single Framer Motion element) */}
                  {isActive && (
                    <motion.span
                      layoutId="active-underline"
                      className="absolute left-0 -bottom-1 h-0.5 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:flex gap-3">
            <Link to="/login">
              <Button variant="ghost" className="font-semibold">
                Login
              </Button>
            </Link>

            <Link to="/register">
              <Button className="rounded-full px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:scale-105 transition">
                <Sparkles className="w-4 h-4 mr-1" />
                Get Started
              </Button>
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-purple-100 transition"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="md:hidden mt-2 rounded-2xl bg-white shadow-xl p-6 space-y-5"
            >
              {navLinks.map(link => (
                <button
                  key={link.name}
                  onClick={() => {
                    document
                      .querySelector(link.href)
                      ?.scrollIntoView({ behavior: "smooth" });
                    setIsOpen(false);
                  }}
                  className="block text-lg font-semibold text-gray-700 hover:text-purple-600"
                >
                  {link.name}
                </button>
              ))}

              <div className="pt-4 border-t space-y-3">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>

                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
