'use client';

import React, { useState, useEffect, useCallback } from 'react';
import errorImage1 from "@/assets/images/icon/error__1.png";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Error1 = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playerPos, setPlayerPos] = useState({ y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [gameSpeed, setGameSpeed] = useState(5);
  const [isShielded, setIsShielded] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [glowParticles, setGlowParticles] = useState([]);
  const [isExploded, setIsExploded] = useState(false);
  const [errorText, setErrorText] = useState("404");
  const [isMounted, setIsMounted] = useState(false);

  // Game themes with different visuals
  const themes = {
    default: {
      background: 'from-gray-900 to-gray-800',
      player: 'from-cyan-500 to-blue-500',
      obstacle: 'from-red-500 to-pink-500',
      powerUp: 'from-yellow-400 to-yellow-600'
    },
    neon: {
      background: 'from-purple-900 to-indigo-900',
      player: 'from-neon-pink to-neon-purple',
      obstacle: 'from-neon-green to-neon-blue',
      powerUp: 'from-neon-yellow to-neon-orange'
    }
  };

  // Initialize window size and mount status
  useEffect(() => {
    setIsMounted(true);
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Initial size
    updateWindowSize();
    
    // Add resize listener
    window.addEventListener('resize', updateWindowSize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []);

  // Initialize game
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setPlayerPos({ y: 0 });
    setObstacles([]);
    setPowerUps([]);
    setGameSpeed(5);
    setIsShielded(false);
  };

  // Handle jump mechanics
  const handleJump = useCallback(() => {
    if (!isJumping && gameStarted) {
      setIsJumping(true);
      setPlayerPos(prev => ({ y: prev.y - 100 }));
      
      // Gravity effect
      setTimeout(() => {
        setIsJumping(false);
        setPlayerPos(prev => ({ y: 0 }));
      }, 500);
    }
  }, [isJumping, gameStarted]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleJump]);

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      // Update score
      setScore(prev => prev + 1);

      // Increase game speed over time
      if (score % 500 === 0) {
        setGameSpeed(prev => prev + 0.5);
      }

      // Generate obstacles
      if (Math.random() < 0.02) {
        setObstacles(prev => [...prev, {
          id: Math.random(),
          x: 100,
          type: Math.random() > 0.7 ? 'flying' : 'ground'
        }]);
      }

      // Generate power-ups
      if (Math.random() < 0.005) {
        setPowerUps(prev => [...prev, {
          id: Math.random(),
          x: 100,
          type: Math.random() > 0.5 ? 'shield' : 'slowTime'
        }]);
      }

      // Move obstacles and check collisions
      setObstacles(prev => {
        const newObstacles = prev
          .map(obs => ({ ...obs, x: obs.x - gameSpeed }))
          .filter(obs => obs.x > -10);

        // Check collisions
        newObstacles.forEach(obs => {
          const collision = checkCollision(playerPos, obs);
          if (collision && !isShielded) {
            setGameStarted(false);
            setHighScore(current => Math.max(current, score));
          }
        });

        return newObstacles;
      });

      // Move power-ups
      setPowerUps(prev => {
        const newPowerUps = prev
          .map(pow => ({ ...pow, x: pow.x - gameSpeed }))
          .filter(pow => pow.x > -10);

        // Check power-up collection
        newPowerUps.forEach(pow => {
          const collected = checkCollision(playerPos, pow);
          if (collected) {
            handlePowerUp(pow.type);
            setPowerUps(prev => prev.filter(p => p.id !== pow.id));
          }
        });

        return newPowerUps;
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameStarted, score, gameSpeed, playerPos, isShielded]);

  // Handle power-up effects
  const handlePowerUp = (type) => {
    if (type === 'shield') {
      setIsShielded(true);
      setTimeout(() => setIsShielded(false), 5000);
    } else if (type === 'slowTime') {
      setGameSpeed(prev => prev * 0.5);
      setTimeout(() => setGameSpeed(prev => prev * 2), 3000);
    }
  };

  // Collision detection
  const checkCollision = (player, object) => {
    const playerRect = {
      x: 20,
      y: player.y + 250,
      width: 40,
      height: 40
    };

    const objectRect = {
      x: object.x,
      y: object.type === 'flying' ? 200 : 250,
      width: 30,
      height: 30
    };

    return !(playerRect.x + playerRect.width < objectRect.x ||
             objectRect.x + objectRect.width < playerRect.x ||
             playerRect.y + playerRect.height < objectRect.y ||
             objectRect.y + objectRect.height < playerRect.y);
  };

  // Handle mouse movement for parallax effect
  const handleMouseMove = (e) => {
    if (!isMounted) return;
    const { clientX, clientY } = e;
    const moveX = (clientX - (windowSize.width / 2)) * 0.05;
    const moveY = (clientY - (windowSize.height / 2)) * 0.05;
    setMousePosition({ x: moveX, y: moveY });
  };

  // Create glow particles
  const createGlowParticles = (x, y) => {
    const timestamp = Date.now();
    const particles = Array.from({ length: 15 }, (_, i) => ({
      id: `${timestamp}_${Math.random()}_${i}`,
      x,
      y,
      angle: (Math.PI * 2 * i) / 15,
      scale: Math.random() * 0.5 + 0.5,
      opacity: 1,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 3)]
    }));
    setGlowParticles(prev => [...prev, ...particles]);
  };

  // Handle error text click
  const handleErrorClick = () => {
    setIsExploded(true);
    const texts = ["OOPS!", "NOT FOUND", "ERROR", "404"];
    setErrorText(texts[Math.floor(Math.random() * texts.length)]);
    setTimeout(() => setIsExploded(false), 1000);
  };

  // Clean up particles
  useEffect(() => {
    const cleanup = setInterval(() => {
      setGlowParticles(prev => prev.filter(p => p.opacity > 0.1));
    }, 100);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <motion.section
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #4ECDC4 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: isMounted ? `translate(${mousePosition.x}px, ${mousePosition.y}px)` : 'none'
        }} />
      </div>

      {/* Floating Particles */}
      <AnimatePresence>
        {glowParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x,
              y: particle.y,
              scale: particle.scale,
              opacity: 1
            }}
            animate={{
              x: particle.x + Math.cos(particle.angle) * 100,
              y: particle.y + Math.sin(particle.angle) * 100,
              opacity: 0,
              scale: 0
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-4 h-4 rounded-full pointer-events-none"
            style={{
              backgroundColor: particle.color,
              filter: 'blur(4px)'
            }}
          />
        ))}
      </AnimatePresence>

      <div className="container max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* Main Error Display */}
          <motion.div
            animate={{
              scale: isExploded ? [1, 1.2, 0.8, 1] : 1,
              rotate: isExploded ? [0, -10, 10, 0] : 0
            }}
            transition={{ duration: 0.4 }}
            onClick={handleErrorClick}
            className="cursor-pointer"
          >
            <motion.h1
              className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-8"
              animate={{
                backgroundPosition: ['0%', '100%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{ backgroundSize: '200%' }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                createGlowParticles(
                  e.clientX - rect.left,
                  e.clientY - rect.top
                );
              }}
            >
              {errorText}
            </motion.h1>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl text-gray-300 font-light mb-4">
              Looks like you've found a glitch in the matrix
            </h2>
            <p className="text-gray-400">
              The page you're looking for has slipped into another dimension
            </p>
          </motion.div>

          {/* Interactive Image */}
          <motion.div
            className="relative w-64 h-64 mx-auto mb-12"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            whileHover={{
              scale: 1.05,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.5 }
            }}
          >
            <Image
              src={errorImage1}
              alt="404 Error"
              fill
              className="object-contain"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(78, 205, 196, 0.3))'
              }}
            />
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/"
              className="group relative inline-flex items-center px-8 py-3 overflow-hidden"
            >
              <span className="relative z-10 text-white font-medium">
                Return to Reality
                <motion.span
                  className="inline-block ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  →
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(78, 205, 196, 0.5)"
                }}
              />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Interactive Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at var(--x) var(--y), rgba(78, 205, 196, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at var(--x) var(--y), rgba(78, 205, 196, 0.15) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          style={{
            '--x': isMounted ? `${50 + (mousePosition.x / windowSize.width) * 100}%` : '50%',
            '--y': isMounted ? `${50 + (mousePosition.y / windowSize.height) * 100}%` : '50%'
          }}
        />
      </div>
    </motion.section>
  );
};

export default Error1;
