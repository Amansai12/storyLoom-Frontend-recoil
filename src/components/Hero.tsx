import React from 'react';
import { motion } from 'framer-motion';
import { 
  Book, 
  Feather, 
  Globe, 
  PenTool, 
  Star, 
  Users, 
  ArrowRight 
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from 'react-router-dom';

// Variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ 
      scale: 1.05,
      transition: { duration: 0.3 }
    }}
    className="h-full"
  >
    <Card className="hover:shadow-lg transition-all duration-300 ease-in-out h-full">
      <CardHeader>
        <Icon className="w-10 h-10 text-primary mb-2" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const TestimonialCard = ({ name, role, quote }: { 
  name: string, 
  role: string, 
  quote: string 
}) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ 
      scale: 1.03,
      transition: { duration: 0.3 }
    }}
  >
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <p className="italic text-gray-600 mb-4">"{quote}"</p>
      <div className="flex items-center">
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white to-blue-50"
    >
      {/* Hero Section */}
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-16 lg:py-24 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Unleash Your Stories, Connect Your Thoughts
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            StoryLoom is more than just a blogging platform. It's a canvas for your ideas, 
            a community of passionate writers, and a space to share your unique perspective.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-4 w-full justify-center"
          >
            <Button onClick={() => navigate('/signin')} size="lg" className="shadow-md">
              Start Writing <Feather className="ml-2" />
            </Button>
            <Button onClick={() => navigate('/signin')}  variant="outline" size="lg" className="shadow-md">
              Explore Stories <Globe className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Features Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="container mx-auto px-4 py-16"
      >
        <div className="text-center mb-12">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Why Choose StoryLoom?
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            We've crafted a platform that empowers writers, nurtures creativity, 
            and builds a vibrant community of storytellers.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-6"
        >
          <FeatureCard 
            icon={PenTool}
            title="Seamless Writing"
            description="Intuitive editor that lets you focus on your story, not the tools."
          />
          <FeatureCard 
            icon={Users}
            title="Community Driven"
            description="Connect with readers and writers who share your passions."
          />
          <FeatureCard 
            icon={Book}
            title="Publish Anywhere"
            description="Share your stories across multiple platforms with ease."
          />
        </motion.div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="container mx-auto px-4 py-16 bg-gray-50"
      >
        <div className="text-center mb-12">
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            What Our Writers Say
          </motion.h2>
        </div>

        <motion.div 
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-6"
        >
          <TestimonialCard 
            name="Sarah Johnson"
            role="Travel Blogger"
            quote="StoryLoom transformed my writing journey. The community support is incredible!"
          />
          <TestimonialCard 
            name="Mike Roberts"
            role="Tech Writer"
            quote="Finally, a platform that understands the needs of modern writers."
          />
          <TestimonialCard 
            name="Emily Chen"
            role="Fiction Author"
            quote="The intuitive interface and powerful tools make storytelling a breeze."
          />
        </motion.div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-16 text-center"
      >
        <div className="bg-primary text-white p-12 rounded-2xl shadow-xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-6"
          >
            Your Story Matters. Start Writing Today.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Whether you're a seasoned writer or just beginning, StoryLoom provides 
            the perfect platform to express yourself.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col md:flex-row items-center gap-4 w-full justify-center"
          >
            <Button onClick={() => navigate('/signup')} size="lg" variant="secondary" className="shadow-md">
              Create Your Account <ArrowRight className="ml-2" />
            </Button>
            <Button onClick={()=> navigate('/about')} variant="outline" size="lg" className="text-black border-white hover:bg-white/20">
              Learn More
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900 text-white py-12"
      >
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">StoryLoom</h3>
            <p className="text-gray-400">
              Empowering writers, one story at a time.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">Home</a></li>
              <li><a href="#" className="hover:text-primary">Features</a></li>
              <li><a href="#" className="hover:text-primary">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">Help Center</a></li>
              <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <Star className="text-white hover:text-primary cursor-pointer" />
              <Users className="text-white hover:text-primary cursor-pointer" />
              <Globe className="text-white hover:text-primary cursor-pointer" />
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-gray-700" />
        <div className="text-center text-gray-400">
          © 2024 StoryLoom. All rights reserved.
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default LandingPage;