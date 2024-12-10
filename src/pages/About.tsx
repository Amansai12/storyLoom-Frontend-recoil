
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Users, 
  Pen, 
  Globe, 
  BookOpen, 
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Link } from 'react-router-dom';
import { Separator } from '@radix-ui/react-dropdown-menu';
import Navbar from '@/components/Navbar';

const AboutPage = () => {
  const features = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Connect with Writers",
      description: "Follow your favorite bloggers and build your personalized reading network."
    },
    {
      icon: <Pen className="h-6 w-6 text-primary" />,
      title: "Create & Share",
      description: "Easily write, edit, and publish your own blog posts with our intuitive editor."
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Discover Content",
      description: "Explore diverse topics and perspectives from writers around the world."
    }
  ];

  const faqs = [
    {
      question: "How do I start blogging?",
      answer: "Simply create an account, set up your profile, and start writing. Our platform makes it easy to share your thoughts with the world."
    },
    {
      question: "Is the platform free?",
      answer: "Basic features are completely free. We offer premium options for advanced customization and analytics."
    },
    {
      question: "Can I monetize my blog?",
      answer: "Yes! We provide tools for sponsored content, affiliate links, and potential reader support options."
    }
  ];

  // Variants for animations
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
        duration: 0.5
      }
    }
  };

  return (
    <>
    <Navbar onSearch={() => {}} />
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-8 min-h-[90vh] flex flex-col justify-evenly"
      >
        <motion.div 
          variants={itemVariants}
          className="text-center mb-12"
        >
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-4"
          >
            Welcome to Our Blogging Community
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            A platform where writers connect, share stories, and inspire each other across diverse topics and perspectives.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center space-x-4">
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div 
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="bg-secondary p-8 rounded-lg text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <BookOpen className="mx-auto h-12 w-12 mb-4 text-primary" />
            <h3 className="text-2xl font-semibold mb-4">Start Your Blogging Journey</h3>
            <p className="mb-6 text-muted-foreground">
              Join thousands of writers sharing their unique stories and perspectives.
            </p>
            <Button size="lg"><Link to={'/signup'}>Create Your Account</Link></Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className='w-full bg-black text-white py-5'
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
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Star className="text-white hover:text-primary cursor-pointer" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Users className="text-white hover:text-primary cursor-pointer" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Globe className="text-white hover:text-primary cursor-pointer" />
              </motion.div>
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-gray-700" />
        <div className="text-center text-gray-400">
          © 2024 StoryLoom. All rights reserved.
        </div>
      </motion.div>
    </>
  );
};

export default AboutPage;