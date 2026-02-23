import { Gamepad2, Heart, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Student Portal", href: "#portals" },
      { name: "Teacher Dashboard", href: "#portals" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Our Team", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
    ],
  };

  return (
    <footer className="relative bg-gradient-to-br from-foreground via-foreground/95 to-foreground text-background pt-20">
      
      {/* Top glow */}
      <div className="absolute inset-x-0 -top-20 h-32 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-14 mb-16">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-quicksand font-extrabold tracking-wide">
                GramiLearn
              </span>
            </div>

            <p className="text-background/75 mb-6 max-w-md leading-relaxed">
              Making quality education accessible, engaging, and fun for every
              child in rural India through{" "}
              <span className="text-primary font-semibold">
                gamified learning
              </span>.
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-background/70 hover:text-background transition">
                <Mail className="w-5 h-5 text-primary" />
                <span>hello@gramilearn.edu</span>
              </div>
              <div className="flex items-center gap-3 text-background/70 hover:text-background transition">
                <Phone className="w-5 h-5 text-primary" />
                <span>+91 7004903132</span>
              </div>
              <div className="flex items-center gap-3 text-background/70 hover:text-background transition">
                <MapPin className="w-5 h-5 text-primary" />
                <span>LPU, Punjab, India</span>
              </div>
            </div>
          </div>

          {/* Link sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-lg mb-5 capitalize">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-background/70 hover:text-primary hover:translate-x-1 inline-block transition-all"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-background/60">
            © {new Date().getFullYear()} GramiLearn. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
