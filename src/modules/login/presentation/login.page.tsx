import { useState, useRef } from "react";
import { TextInput, PasswordInput, Button } from "@mantine/core";
import { IconUser, IconLock } from "@tabler/icons-react";
import {
  LoginVideo,
  BlackcitoSinPatitas,
} from "../../../presentation/assets/imports";
import { useLogin } from "../hooks/useLogin";
import { motion } from "motion/react";

export const LoginPage = () => {
  const {
    isLoading,
    error,
    username,
    setUsername,
    password,
    setPassword,
    handleSubmit,
  } = useLogin();

  const [isVideoEnding, setIsVideoEnding] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const duration = videoRef.current.duration;
    const currentTime = videoRef.current.currentTime;
    if (duration - currentTime < 1 && !isVideoEnding) {
      setIsVideoEnding(true);
    }
  };

  const handleEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsVideoEnding(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-black">
      {/* Background Video */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isVideoEnding ? "opacity-0" : "opacity-100"
          }`}
      >
        <video
          ref={videoRef}
          src={LoginVideo}
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Black background to show during transition opacity 0 */}
      <div className="absolute inset-0 bg-black -z-10"></div>

      {/* Cinematic Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 z-0" />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent z-0" />

      {/* Additional subtle atmospheric lighting behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full flex justify-center"
      >
        <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center mb-[2dvh]">
          {/* Decorative ambient border glow */}
          <div className="absolute -inset-0.5 bg-linear-to-b from-blue-500/20 to-violet-500/0 rounded-[2.5rem] blur-xl opacity-50 z-[-1]" />

          <div className="w-full rounded-[2.5rem] p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 bg-zinc-950/60 backdrop-blur-md ring-1 ring-white/20 relative overflow-hidden">
            {/* Subtle inner reflection */}
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="text-center mb-10 relative z-10">
              <style>
                {`
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-8px); }
                }
                .animate-float { animation: float 2.5s ease-in-out infinite; }
              `}
              </style>
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center animate-float relative">
                <img
                  src={BlackcitoSinPatitas}
                  alt="Cupper & Hannia Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] relative z-10"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-wide font-pacifico drop-shadow-md">
                Cupper & Hannia
              </h1>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-medium tracking-[0.2em] relative inline-block">
                SISTEMA DE GESTIÓN MINERA
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-linear-to-r from-transparent via-amber-500 to-transparent" />
              </p>
            </div>

            {/* Error Message */}
            {error && typeof error === "string" && error.length > 0 && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-xl animate-slideDown shadow-inner shadow-rose-500/10">
                <p className="text-xs text-rose-300 text-center font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-5 relative z-10"
            >
              <div>
                <TextInput
                  label={
                    <span className="text-zinc-400 font-medium text-xs uppercase tracking-wider mb-1 block">
                      Usuario
                    </span>
                  }
                  placeholder="Ingresa tu usuario"
                  radius="xl"
                  size="sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  leftSection={<IconUser size={15} stroke={1.5} />}
                  styles={{
                    input: {
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                      borderColor: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                      "&:focus": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        boxShadow: "0 0 20px rgba(255, 255, 255, 0.15)",
                      },
                    },
                    section: { color: "rgba(161,161,170,0.5)" },
                  }}
                />
              </div>

              <div>
                <PasswordInput
                  label={
                    <span className="text-zinc-400 font-medium text-xs uppercase tracking-wider mb-1 block">
                      Contraseña
                    </span>
                  }
                  placeholder="Ingresa tu contraseña"
                  radius="xl"
                  size="sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftSection={<IconLock size={15} stroke={1.5} />}
                  styles={{
                    input: {
                      backgroundColor: "rgba(0, 0, 0, 0.02)",
                      borderColor: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                    },
                    innerInput: {
                      "&:focus": {
                        borderColor: "transparent",
                      },
                    },
                    section: { color: "rgba(161,161,170,0.5)" },
                  }}
                />
              </div>

              <Button
                type="submit"
                fullWidth
                radius="lg"
                size="sm"
                loading={isLoading}
                className="mt-8! bg-linear-to-r! from-cyan-600! to-blue-600! text-white! 
              font-bold! hover:from-cyan-500! hover:to-blue-500! 
              shadow-[0_0_20px_rgba(6,182,212,0.3)]! transition-all duration-300! border-0!"
              >
                Iniciar Sesión
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-10 relative z-10">
              <p className="text-center text-[11px] text-zinc-500/70 font-medium">
                &copy; {new Date().getFullYear()} Cupper & Hannia
                <br />
                Secure Authentication Gateway
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
