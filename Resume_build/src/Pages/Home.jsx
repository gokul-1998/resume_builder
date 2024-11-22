import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, Sparkles, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const MotionCard = motion(Card);

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function HomePage() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (token) {
      fetchEmployees();
    }
  }, [token]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_BACKEND_URL}` + '/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        }
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch employees",
        variant: "destructive",
      });
      if (error.message === 'Unauthorized: Please log in again') {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const stats = [
    { icon: FileText, label: 'Resumes Created', value: '1000+' },
    { icon: Users, label: 'Active Users', value: '500+' },
    { icon: Sparkles, label: 'AI Powered', value: '100%' }
  ];

  const renderActionButtons = () => {
    if (user) {
      return (
        <motion.div 
          className="flex flex-col md:flex-row gap-4 justify-center"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <Button 
            onClick={() => navigate('/createResume')}
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Create Resume
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 transform transition-transform group-hover:scale-105" />
          </Button>

          <Button
            onClick={() => navigate('/createAiResume')}
            size="lg"
            variant="outline"
            className="border-blue-400 text-blue-400 hover:bg-blue-400/10 px-8 py-6 text-lg group"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Try AI Resume Builder
          </Button>
        </motion.div>
      );
    }

    return (
      <motion.div 
        className="flex flex-col md:flex-row gap-4 justify-center"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
      >
        <Button 
          onClick={() => navigate('/login')}
          size="lg"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center">
            Get Started
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 transform transition-transform group-hover:scale-105" />
        </Button>

        <Button
          onClick={() => navigate('/signup')}
          size="lg"
          variant="outline"
          className="border-blue-400 text-blue-400 hover:bg-blue-400/10 px-8 py-6 text-lg group"
        >
          Create Account
        </Button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-black to-blue-900 text-white">
      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
      >
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-3xl" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>

        <motion.div 
          className="container mx-auto px-4 relative z-10"
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Sparkles className="h-16 w-16 mx-auto text-blue-400 animate-pulse" />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              Create Your Future with AI
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl mb-12 text-blue-200"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              Build stunning resumes powered by artificial intelligence that stand out and get you noticed
            </motion.p>

            {renderActionButtons()}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section 
        ref={statsRef}
        className="py-20 relative"
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-blue-900/30 backdrop-blur-lg rounded-xl p-8 border border-blue-500/20"
              >
                <stat.icon className="h-10 w-10 text-blue-400 mb-4" />
                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-blue-200">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Community Section - Only show when authenticated */}
      {user && !isLoading && employees.length > 0 && (
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our Community
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {employees.map((employee) => (
                <MotionCard 
                  key={employee.id} 
                  variants={fadeIn}
                  className="bg-blue-900/30 backdrop-blur-lg border border-blue-500/20 hover:border-blue-400/40 transition-colors group"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="relative">
                        <span className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                          {employee.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-lg transition-opacity" />
                      </div>
                      <span className="text-white group-hover:text-blue-400 transition-colors">
                        {employee.name}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-200 mb-2">{employee.email}</p>
                    <p className="text-blue-300">
                      <span className="font-medium text-blue-400">{employee.resumes.length}</span>
                      {' '}
                      {employee.resumes.length === 1 ? 'Resume' : 'Resumes'} Created
                    </p>
                  </CardContent>
                </MotionCard>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
