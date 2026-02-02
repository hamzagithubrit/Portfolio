"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import * as SimpleIcons from "simple-icons";
import emailjs from "@emailjs/browser";

// Type definition for icon
type IconType = {
  title: string;
  hex: string;
  path: string;
};

// Constants for typing effect - defined outside component to prevent dependency array issues
const NAME = "Ameer Hamza";
const ROLE = "Full Stack developer";

// BrandIcon component for technology logos
function BrandIcon({
  icon,
  size = 38,
}: {
  icon: typeof SimpleIcons.siHtml5;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-label={icon.title}
      role="img"
      style={{ color: `#${icon.hex}` }}
      className="drop-shadow-sm"
    >
      <path fill="currentColor" d={icon.path} />
    </svg>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const typingInitializedRef = useRef(false);
  const [particles, setParticles] = useState<Array<{
    left: string;
    top: string;
    width: string;
    height: string;
    animationDelay: string;
    animationDuration: string;
  }>>([]);
  
  // Typing effect states
  const [displayedName, setDisplayedName] = useState("");
  const [displayedRole, setDisplayedRole] = useState("");
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSending, setIsSending] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  
  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);
  
  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  // Send email using EmailJS
  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    setFormStatus("");
    
    try {
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      
      if (!publicKey || !serviceId || !templateId) {
        throw new Error("EmailJS credentials not configured");
      }
      
      // Initialize EmailJS with your public key
      emailjs.init(publicKey);
      
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }
      );
      
      setFormStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      setFormStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    const revealElements = document.querySelectorAll(".reveal");
    const revealLeftElements = document.querySelectorAll(".reveal-left");
    
    revealElements.forEach((el) => observerRef.current?.observe(el));
    revealLeftElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      revealElements.forEach((el) => observerRef.current?.unobserve(el));
      revealLeftElements.forEach((el) => observerRef.current?.unobserve(el));
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "skills", "projects", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Generate particles only on client side to avoid hydration mismatch
  useEffect(() => {
    if (mounted) {
      setParticles(
        Array.from({ length: 20 }, () => ({
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          animationDelay: `${Math.random() * 15}s`,
          animationDuration: `${Math.random() * 10 + 10}s`,
        }))
      );
    }
  }, [mounted]);

  // Typing effect - loops continuously
  useEffect(() => {
    let currentIndex = 0;
    let roleIndex = 0;
    let roleInterval: NodeJS.Timeout | null = null;
    let typingInterval: NodeJS.Timeout | null = null;
    let resetTimeout: NodeJS.Timeout | null = null;
    
    const startTyping = () => {
      // Reset states
      setDisplayedName("");
      setDisplayedRole("");
      currentIndex = 0;
      roleIndex = 0;
      
      // Type name
      typingInterval = setInterval(() => {
        if (currentIndex <= NAME.length) {
          setDisplayedName(NAME.slice(0, currentIndex));
          currentIndex++;
        } else {
          if (typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null;
          }
          // Start typing role after name is complete
          setTimeout(() => {
            roleInterval = setInterval(() => {
              if (roleIndex <= ROLE.length) {
                setDisplayedRole(ROLE.slice(0, roleIndex));
                roleIndex++;
              } else {
                if (roleInterval) {
                  clearInterval(roleInterval);
                  roleInterval = null;
                }
                // Wait a bit, then restart the typing effect
                resetTimeout = setTimeout(() => {
                  startTyping();
                }, 2000); // Wait 2 seconds before restarting
              }
            }, 100);
          }, 500);
        }
      }, 100);
    };
    
    // Start the typing effect
    startTyping();
    
    return () => {
      if (typingInterval) clearInterval(typingInterval);
      if (roleInterval) clearInterval(roleInterval);
      if (resetTimeout) clearTimeout(resetTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-neutral-950 via-slate-900 to-zinc-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}
      suppressHydrationWarning
    >
      {/* Animated Background Particles */}
      {mounted && (
        <div className={`particles fixed inset-0 pointer-events-none ${isDarkMode ? 'opacity-100' : 'opacity-30'}`}>
          {particles.map((particle, i) => (
            <div
              key={i}
              className="particle absolute"
              style={{
                left: particle.left,
                top: particle.top,
                width: particle.width,
                height: particle.height,
                animationDelay: particle.animationDelay,
                animationDuration: particle.animationDuration,
              }}
            />
          ))}
        </div>
      )}

      {/* Fixed Left Sidebar - Social Media Icons */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4 px-4" suppressHydrationWarning>
        <div className="flex flex-col gap-4">
          {[
            { name: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
            { name: "GitHub", href: "https://github.com", icon: "github" },
          ].map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all transform hover:scale-110 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                {social.icon === "linkedin" && (
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                )}
                {social.icon === "github" && (
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                )}
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 border-b transition-all duration-300 backdrop-blur-md ${
        isDarkMode 
          ? 'bg-neutral-900/80 border-white/10' 
          : 'bg-white/90 border-gray-200 shadow-sm'
      }`} suppressHydrationWarning>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className={`text-xl font-bold ${isDarkMode ? 'gradient-text' : 'text-gray-900'}`}>Portfolio</div>
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "skills", label: "Skills" },
                { id: "projects", label: "Projects" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-all duration-300 pb-1 relative ${
                    activeSection === item.id
                      ? isDarkMode ? "text-white" : "text-gray-900"
                      : isDarkMode ? "text-slate-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                  suppressHydrationWarning
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient"></span>
                  )}
                </button>
              ))}
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 relative z-10"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className={`animate-slide-in-left ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className={`inline-block px-4 py-2 glass rounded-full text-cyan-400 text-sm font-medium mb-6 animate-fade-in ${isDarkMode ? 'glass-dark' : 'glass-light'}`}>
              Welcome to My Portfolio
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4">
              Hi, I'm{" "}
              <span className="gradient-text animate-gradient">
                {displayedName}
                {displayedName.length < NAME.length && (
                  <span className="animate-pulse">|</span>
                )}
              </span>
            </h1>
            <p className="text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6 font-semibold">
              {displayedRole}
              {displayedRole.length < ROLE.length && (
                <span className="animate-pulse">|</span>
              )}
            </p>
            <p className={`text-lg mb-8 max-w-xl leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              I build exceptional digital experiences that are fast, accessible,
              and visually appealing. Let's create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => scrollToSection("contact")}
                className="group px-8 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105 animate-gradient relative overflow-hidden"
                suppressHydrationWarning
              >
                <span className="relative z-10">Hire Me</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className={`px-8 py-3 glass rounded-lg font-semibold border-2 transition-all transform hover:scale-105 ${
                  isDarkMode 
                    ? 'glass-dark text-white border-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-400/10' 
                    : 'glass-light text-gray-900 bg-white border-cyan-400 hover:border-cyan-500 hover:bg-cyan-50'
                }`}
                suppressHydrationWarning
              >
                View Work
              </button>
            </div>
          </div>
          <div className="flex justify-center md:justify-end animate-slide-in-right">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-cyan-400/50 shadow-2xl shadow-cyan-500/50 animate-float animate-glow">
                <Image
                  src="/image.jpeg"
                  alt="Profile"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse-glow"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className={`py-20 px-4 sm:px-6 lg:px-8 relative z-10 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-b from-neutral-950 to-slate-900' 
            : 'bg-gradient-to-b from-gray-100 to-white'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <h2
            id="about-title"
            className={`text-4xl font-bold text-center mb-4 reveal ${
              visibleElements.has("about-title") ? "active" : ""
            }`}
          >
            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>About </span>
            <span className="gradient-text">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 mx-auto mb-12 animate-gradient"></div>

          <div className="max-w-4xl mx-auto mb-16">
            <div
              className={`reveal ${
                visibleElements.has("about-content") ? "active" : ""
              } ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              id="about-content"
            >
              <div className={`glass rounded-2xl p-8 md:p-12 border transition-all ${
                isDarkMode 
                  ? 'glass-dark border-cyan-500/20 hover:border-cyan-500/40' 
                  : 'glass-light border-gray-300 hover:border-cyan-500/40 bg-white'
              }`}>
                <h3 className="text-3xl font-bold mb-6 gradient-text">Who am I?</h3>
                <div className="space-y-4 mb-8">
                  <p className={`leading-relaxed text-lg ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    I have recently completed my Bachelor's degree in Computer Science at COMSATS University Islamabad, Lahore Campus, graduated in March 2025. My focus lies in creating data-driven solutions and contributing to impactful projects.
                  </p>
                  <p className={`leading-relaxed text-lg ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    I'm a passionate Full Stack Developer with 1 year of
                experience creating modern web applications. I specialize in
                    full stack development including FastAPI, Python, Node.js, Express, MongoDB, React, React Native, and modern CSS frameworks.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { label: "Name", value: "Ameer Hamza", icon: "👤" },
                    { label: "Email", value: "hamzaakram53454@gmail.com", icon: "📧" },
                    { label: "Experience", value: "1 Year", icon: "💼" },
                    { label: "Phone", value: "03098109844", icon: "📱" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                      className={`glass p-4 rounded-lg hover-lift transition-all border ${
                        isDarkMode 
                          ? 'glass-dark border-cyan-500/10 hover:border-cyan-500/30' 
                          : 'glass-light border-gray-300 hover:border-cyan-500/30 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className={`text-xs mb-1 uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{item.label}</p>
                          <p className={`font-semibold text-sm break-all ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all transform hover:scale-105 animate-gradient" suppressHydrationWarning>
                  Download CV
                </button>
                  <button className={`flex-1 px-6 py-3 glass rounded-lg font-semibold border-2 transition-all transform hover:scale-105 ${
                    isDarkMode 
                      ? 'glass-dark text-white border-cyan-400/50 hover:border-cyan-400 hover:bg-cyan-400/10' 
                      : 'glass-light text-gray-900 bg-white border-cyan-400 hover:border-cyan-500 hover:bg-cyan-50'
                  }`} suppressHydrationWarning>
                  Contact Me
                </button>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-center mb-16">
              <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>My </span>
              <span className="gradient-text">Experience</span>
            </h3>
            <div className="relative max-w-5xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500 animate-gradient hidden md:block"></div>
              
              <div className="space-y-12">
                {[
                  {
                    title: "AI Engineer",
                    company: "Soft Techniques",
                    period: "Sep 2025 - Present",
                    description:
                      "Working on AI-powered solutions and machine learning projects using FastAPI, Python, and Next.js. Developed chatbots, web scrapers using Scrapy, and RAG (Retrieval-Augmented Generation) systems. Contributing to cutting-edge AI technologies and many more innovative projects.",
                    side: "right",
                  },
                  {
                    title: "Junior Software Engineer",
                    company: "Huboweb Technologies (Private Limited)",
                    period: "Feb 2025 - Sep 2025",
                    description:
                      "Working on MERN stack projects and handling live projects. Gained experience in full-stack development using MongoDB, Express, React, Node.js, and .NET Framework.",
                    side: "left",
                  },
                ].map((exp, index) => (
                  <div
                    key={index}
                    className={`relative reveal ${
                      visibleElements.has(`exp-${index}`) ? "active" : ""
                    }`}
                    id={`exp-${index}`}
                  >
                    {/* Timeline dot - hidden on mobile, visible on desktop */}
                    <div className="hidden md:block absolute top-6 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full border-4 border-neutral-950 z-10 animate-pulse-glow"></div>
                    
                    {/* Content card */}
                    <div className={`md:w-[calc(50%-40px)] ${exp.side === "left" ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"}`}>
                      <div className={`glass rounded-xl p-6 md:p-8 shadow-2xl border hover-lift transition-all backdrop-blur-sm ${
                        isDarkMode 
                          ? 'glass-dark border-cyan-500/20 hover:border-cyan-500/50' 
                          : 'glass-light border-gray-300 hover:border-cyan-500/50 bg-white'
                      }`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-2xl font-bold mb-2 gradient-text">
                              {exp.title}
                            </h4>
                            <p className="text-cyan-400 font-semibold text-lg mb-1">
                              {exp.company}
                            </p>
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                              {exp.period}
                            </p>
                          </div>
                          <div className="hidden md:block ml-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-400/30">
                              <span className="text-2xl">
                                {index === 0 ? "🤖" : "💻"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className={`leading-relaxed text-base ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className={`py-20 px-4 sm:px-6 lg:px-8 relative z-10 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-b from-slate-900 to-zinc-900' 
            : 'bg-gradient-to-b from-white to-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <h2
            id="skills-title"
            className={`text-4xl font-bold text-center mb-4 reveal ${
              visibleElements.has("skills-title") ? "active" : ""
            }`}
          >
            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>My </span>
            <span className="gradient-text">Skills</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 mx-auto mb-12 animate-gradient"></div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-20">
            {/* Technical Skills */}
            <div
              className={`reveal ${
                visibleElements.has("tech-skills") ? "active" : ""
              }`}
              id="tech-skills"
            >
              <div className={`glass rounded-2xl p-6 md:p-8 border transition-all ${
                isDarkMode 
                  ? 'glass-dark border-cyan-500/20 hover:border-cyan-500/40' 
                  : 'glass-light border-gray-300 hover:border-cyan-500/40 bg-white'
              }`}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-400/30">
                    <span className="text-2xl">💻</span>
                  </div>
                  <h3 className="text-2xl font-bold gradient-text">
                    Technical Skills
                  </h3>
                </div>
                <div className="space-y-5">
                  {[
                    { name: "HTML/CSS", level: 90 },
                    { name: "JavaScript", level: 85 },
                    { name: "React", level: 85 },
                    { name: "Next.js", level: 80 },
                    { name: "Node.js", level: 85 },
                    { name: "Express", level: 80 },
                    { name: "MongoDB", level: 80 },
                    { name: "Python", level: 85 },
                    { name: "FastAPI", level: 85 },
                    { name: "Supabase", level: 75 },
                    { name: "RAG", level: 75 },
                    { name: "Scrapy", level: 80 },
                  ].map((skill) => (
                    <div key={skill.name} className="group">
                      <div className="flex justify-between items-center mb-3">
                        <span className={`font-semibold text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{skill.name}</span>
                        <span className="text-cyan-400 font-bold text-sm bg-cyan-400/10 px-2 py-1 rounded-md">{skill.level}%</span>
                      </div>
                      <div className={`w-full rounded-full h-2.5 overflow-hidden shadow-inner ${isDarkMode ? 'bg-slate-800/60' : 'bg-gray-200'}`}>
                        <div
                          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-1000 animate-gradient shadow-lg"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Professional Skills */}
            <div
              className={`reveal ${
                visibleElements.has("prof-skills") ? "active" : ""
              }`}
              id="prof-skills"
            >
              <div className={`glass rounded-2xl p-6 md:p-8 border transition-all ${
                isDarkMode 
                  ? 'glass-dark border-purple-500/20 hover:border-purple-500/40' 
                  : 'glass-light border-gray-300 hover:border-purple-500/40 bg-white'
              }`}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-400/30">
                    <span className="text-2xl">🌟</span>
                  </div>
                  <h3 className="text-2xl font-bold gradient-text">
                    Professional Skills
                  </h3>
                </div>
                <div className="space-y-5">
                  {[
                    { name: "Communication", level: 90 },
                    { name: "Teamwork", level: 85 },
                    { name: "Problem Solving", level: 95 },
                    { name: "Creativity", level: 75 },
                  ].map((skill) => (
                    <div key={skill.name} className="group">
                      <div className="flex justify-between items-center mb-3">
                        <span className={`font-semibold text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{skill.name}</span>
                        <span className="text-purple-400 font-bold text-sm bg-purple-400/10 px-2 py-1 rounded-md">{skill.level}%</span>
                      </div>
                      <div className={`w-full rounded-full h-2.5 overflow-hidden shadow-inner ${isDarkMode ? 'bg-slate-800/60' : 'bg-gray-200'}`}>
                        <div
                          className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 h-2.5 rounded-full transition-all duration-1000 animate-gradient shadow-lg"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tools & Technologies */}
          <div
            className={`reveal ${
              visibleElements.has("tools-tech") ? "active" : ""
            }`}
            id="tools-tech"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-3">
                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Tools & </span>
                <span className="gradient-text">Technologies</span>
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 mx-auto animate-gradient"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {[
                { name: "HTML5", icon: SimpleIcons.siHtml5 },
                { name: "CSS3", icon: SimpleIcons.siCss },
                { name: "JavaScript", icon: SimpleIcons.siJavascript },
                { name: "React", icon: SimpleIcons.siReact },
                { name: "Next.js", icon: SimpleIcons.siNextdotjs },
                { name: "Node.js", icon: SimpleIcons.siNodedotjs },
                { name: "Express", icon: SimpleIcons.siExpress },
                { name: "MongoDB", icon: SimpleIcons.siMongodb },
                { name: "Python", icon: SimpleIcons.siPython },
                { name: "FastAPI", icon: SimpleIcons.siFastapi },
                { name: "Supabase", icon: SimpleIcons.siSupabase },
                { name: "Scrapy", icon: SimpleIcons.siScrapy },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className={`glass rounded-xl p-5 md:p-6 text-center border hover-lift transition-all transform hover:scale-110 hover:rotate-3 shadow-lg ${
                    isDarkMode 
                      ? 'glass-dark border-cyan-500/20 hover:border-cyan-400' 
                      : 'glass-light border-gray-300 hover:border-cyan-400 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-center mb-3 h-16 animate-float">
                    <BrandIcon icon={tech.icon} size={44} />
                  </div>
                  <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{tech.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className={`py-24 px-4 sm:px-6 lg:px-8 relative z-10 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-b from-zinc-900 to-neutral-950' 
            : 'bg-gradient-to-b from-gray-100 to-white'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            id="projects-title"
            className={`text-5xl sm:text-6xl font-bold mb-4 reveal ${
              visibleElements.has("projects-title") ? "active" : ""
            }`}
          >
            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>My </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Projects</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 mb-12 rounded-full animate-gradient"></div>

          <div className="grid grid-cols-1 gap-8 lg:gap-10">
            {[
              {
                title: "Bookyolo",
                description:
                  "An AI-powered travel platform that analyzes Airbnb/Booking listings so you can book with confidence.",
                tech: ["React Native", "React.js", "FastAPI", "Python", "Supabase"],
                demo: "https://bookyolo-frontend.vercel.app/",
                code: "#",
                image: "/image20.png",
              },
              {
                title: "WebScraper",
                description:
                  "A powerful web scraping platform with automated data extraction, batch processing, and real-time monitoring using modern scraping technologies.",
                tech: ["Next.js", "Python", "Scrapy", "Zyte API", "Selenium", "Supabase"],
                demo: "https://scraperfrontend-production.up.railway.app/",
                code: "#",
                image: "/img30.png",
              },
              {
                title: "Fast Rehabs to Repair",
                description:
                  "A disaster repair platform connecting property owners with qualified contractors. Features include instant matching, fast scheduling, progress tracking, and streamlined claim management from disaster to repair.",
                tech: ["React", "Supabase", "TailwindCSS"],
                demo: "https://fast-rehabs-disastershield.vercel.app/",
                code: "#",
                image: "/img31.png",
              },
              {
                title: "SoftTechniques - Company Website",
                description:
                  "A modern company website helping teams adopt technology the easy way with clear methods, friendly guidance, and real business outcomes. Features AI-powered chatbot, automation solutions, IT consulting, and training services.",
                tech: ["Next.js", "Python", "OpenAI", "Firebase", "EmailJS"],
                demo: "https://softtechniques.com/",
                code: "#",
                image: "/image 17.png",
              },
              {
                title: "Akeno Tech - AI Solutions",
                description:
                  "Transform your business with custom AI solutions. Building scalable AI systems that automate workflows, optimize operations, and deliver actionable insights—from startups to global enterprises.",
                tech: ["React", "Next.js", "TailwindCSS", "Python", "OpenAI"],
                demo: "https://akenotech.com/",
                code: "#",
                image: "/img33.png",
              },
            ].map((project, index) => (
              <div
                key={index}
                id={`project-${index}`}
                className={`reveal-left ${
                  visibleElements.has(`project-${index}`) ? "active" : ""
                }`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 w-full flex flex-col md:flex-row">
                  {/* Image Container - Left Side */}
                  <div className="relative w-full md:w-1/2 bg-gray-100 overflow-hidden flex items-center justify-center">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={800}
                        height={600}
                        className={`w-full h-full ${index === 4 ? 'object-cover' : 'object-contain'}`}
                        priority={index === 0}
                      />
                    ) : (
                      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="text-7xl">📱</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Content - Right Side */}
                  <div className="w-full md:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      {project.title}
                    </h3>
                    <p className="text-gray-700 mb-6 text-base leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    
                    {/* Demo Button */}
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => project.demo === "#" && e.preventDefault()}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:gap-3 group w-fit"
                    >
                      <span>Demo</span>
                      <svg
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className={`py-20 px-4 sm:px-6 lg:px-8 relative z-10 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-b from-neutral-950 via-slate-900 to-zinc-900' 
            : 'bg-gradient-to-b from-white via-gray-50 to-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <h2
            id="contact-title"
            className={`text-4xl font-bold text-center mb-4 reveal ${
              visibleElements.has("contact-title") ? "active" : ""
            }`}
          >
            <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Get In </span>
            <span className="gradient-text">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 mx-auto mb-12 animate-gradient"></div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div
              className={`reveal ${
                visibleElements.has("contact-info") ? "active" : ""
              }`}
              id="contact-info"
            >
              <h3 className="text-2xl font-bold mb-4 gradient-text">
                Contact Information
              </h3>
              <p className={`mb-8 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Feel free to reach out to me for any questions or opportunities.
                I'm always open to discussing new projects, creative ideas or
                opportunities to be part of your vision.
              </p>
              <div className="space-y-6 mb-8">
                {[
                  {
                    icon: "location",
                    label: "Location",
                    value: "Lahore, Pakistan",
                  },
                  {
                    icon: "email",
                    label: "Email",
                    value: "hamzaakram53454@gmail.com",
                  },
                  {
                    icon: "phone",
                    label: "Phone",
                    value: "03098109844",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 hover-lift glass p-4 rounded-lg border ${
                      isDarkMode 
                        ? 'glass-dark border-cyan-500/10' 
                        : 'glass-light border-gray-300 bg-white'
                    }`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-cyan-400/30">
                      <svg
                        className="w-6 h-6 text-cyan-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {item.icon === "location" && (
                          <>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </>
                        )}
                        {item.icon === "email" && (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        )}
                        {item.icon === "phone" && (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                      <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-xl font-bold mb-4 gradient-text">
                  Follow Me
                </h4>
                <div className="flex gap-4">
                  {["GitHub", "LinkedIn"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className={`w-12 h-12 glass rounded-full flex items-center justify-center border hover-lift transition-all transform hover:scale-110 hover:rotate-12 ${
                        isDarkMode 
                          ? 'glass-dark border-cyan-400/30 hover:border-cyan-400' 
                          : 'glass-light border-gray-300 hover:border-cyan-400 bg-white'
                      }`}
                    >
                      <span className="text-cyan-400 text-xs font-bold">
                        {social[0]}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className={`reveal ${
                visibleElements.has("contact-form") ? "active" : ""
              }`}
              id="contact-form"
            >
              <h3 className="text-2xl font-bold mb-6 gradient-text">
                Send Me a Message
              </h3>
              <form className="space-y-6" onSubmit={sendEmail} suppressHydrationWarning>
                <div>
                  <label className={`block mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 glass border rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all ${
                      isDarkMode 
                        ? 'glass-dark border-cyan-400/30 text-white placeholder-slate-400' 
                        : 'glass-light border-gray-300 text-gray-900 placeholder-gray-400 bg-white'
                    }`}
                    placeholder="Enter your name"
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 glass border rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all ${
                      isDarkMode 
                        ? 'glass-dark border-cyan-400/30 text-white placeholder-slate-400' 
                        : 'glass-light border-gray-300 text-gray-900 placeholder-gray-400 bg-white'
                    }`}
                    placeholder="Enter your email"
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 glass border rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all ${
                      isDarkMode 
                        ? 'glass-dark border-cyan-400/30 text-white placeholder-slate-400' 
                        : 'glass-light border-gray-300 text-gray-900 placeholder-gray-400 bg-white'
                    }`}
                    placeholder="Enter subject"
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`w-full px-4 py-3 glass border rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 resize-none transition-all ${
                      isDarkMode 
                        ? 'glass-dark border-cyan-400/30 text-white placeholder-slate-400' 
                        : 'glass-light border-gray-300 text-gray-900 placeholder-gray-400 bg-white'
                    }`}
                    placeholder="Enter your message"
                    suppressHydrationWarning
                  ></textarea>
                </div>
                
                {formStatus === "success" && (
                  <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-center">
                    ✓ Message sent successfully!
                  </div>
                )}
                
                {formStatus === "error" && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center">
                    ✗ Failed to send message. Please try again.
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSending}
                  className={`w-full px-8 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2 transform hover:scale-105 animate-gradient ${
                    isSending ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  suppressHydrationWarning
                >
                  {isSending ? 'Sending...' : 'Send Message'}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-12 px-4 sm:px-6 lg:px-8 relative z-10 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-neutral-950 border-cyan-500/20' 
          : 'bg-white border-gray-300/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About Column */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold gradient-text mb-4">Ameer Hamza</h3>
              <p className={`mb-4 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Full Stack Developer specializing in AI-powered solutions, web scraping, and modern web applications. 
                Passionate about creating innovative solutions that solve real-world problems.
              </p>
              <div className="flex gap-4">
                {[
                  { name: "GitHub", href: "https://github.com/hamzagithubrit", icon: "github" },
                  { name: "LinkedIn", href: "https://www.linkedin.com/in/ameer-hamza-59384b269", icon: "linkedin" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
                      isDarkMode 
                        ? 'bg-slate-800 hover:bg-cyan-500 text-slate-400 hover:text-white' 
                        : 'bg-gray-100 hover:bg-cyan-500 text-gray-600 hover:text-white'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {social.icon === "github" && (
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      )}
                      {social.icon === "linkedin" && (
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      )}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Links</h3>
              <ul className="space-y-2">
                {["Home", "About", "Skills", "Projects", "Contact"].map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => scrollToSection(link.toLowerCase())}
                      className={`transition-colors ${
                        isDarkMode 
                          ? 'text-slate-400 hover:text-cyan-400' 
                          : 'text-gray-600 hover:text-cyan-500'
                      }`}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Contact</h3>
              <ul className="space-y-3">
                <li className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  <span className="block font-semibold mb-1">Email</span>
                  <a href="mailto:hamzaakram53454@gmail.com" className="hover:text-cyan-400 transition-colors">
                    hamzaakram53454@gmail.com
                  </a>
                </li>
                <li className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  <span className="block font-semibold mb-1">Phone</span>
                  <a href="tel:03098109844" className="hover:text-cyan-400 transition-colors">
                    03098109844
                  </a>
                </li>
                <li className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  <span className="block font-semibold mb-1">Location</span>
                  Lahore, Pakistan
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className={`pt-8 border-t ${isDarkMode ? 'border-cyan-500/20' : 'border-gray-300/50'}`}>
            <div className={`text-sm text-center ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              <span className="gradient-text font-semibold">Portfolio</span>
              <span className="mx-2">•</span>
              © {new Date().getFullYear()} Ameer Hamza. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
