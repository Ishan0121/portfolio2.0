"use client";
import {
  useState,
  useEffect,
  useRef,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  Home,
  User,
  Briefcase,
  Mail,
  Github,
  Linkedin,
  Loader2,
  Bot,
  X,
  EyeOff,
  HammerIcon,
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import Spline with no SSR
const Spline = dynamic(
  () =>
    import("@splinetool/react-spline").then((mod) => ({
      default: mod.default || mod,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    ),
  }
);

interface InteractiveSplineBotProps {
  splineScene: string;
  width?: number;
  height?: number;
  fallbackIcon?: React.ReactNode;
  onNavigate?: (href: string) => void;
}

interface Position {
  x: number;
  y: number;
}

interface Boundaries {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface Shortcut {
  icon: React.ElementType;
  label: string;
  href: string;
  external?: boolean;
}

const DRAG_THRESHOLD = 5;
const HOVER_DELAY = 1000;
const SPLINE_RELOAD_DELAY = 150;
const ANIMATION_DURATION = 600;
const MENU_WIDTH = 240;
const MENU_HEIGHT = 280;
const PADDING = 20;

export default function InteractiveSplineBot({
  splineScene,
  width = 200,
  height = 200,
  fallbackIcon,
  onNavigate,
}: InteractiveSplineBotProps) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [windowSize, setWindowSize] = useState<Position>({ x: 0, y: 0 });
  const [menuPosition, setMenuPosition] = useState<Position>({ x: 0, y: 0 });
  const [splineKey, setSplineKey] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<Position>({
    x: 0,
    y: 0,
  });

  // Theme detection using next-themes pattern
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const checkTheme = () => {
      if (typeof window !== "undefined") {
        const isDark =
          document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(isDark ? "dark" : "light");
      }
    };

    checkTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const observer = new MutationObserver(checkTheme);

    mediaQuery.addEventListener("change", checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      mediaQuery.removeEventListener("change", checkTheme);
      observer.disconnect();
    };
  }, []);

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<Position>({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const shortcuts: Shortcut[] = useMemo(
    () => [
      { icon: Home, label: "Home", href: "/" },
      { icon: User, label: "About", href: "/about" },
      { icon: Briefcase, label: "Projects", href: "/portfolio" },
      { icon: HammerIcon, label: "Skills", href: "/skills" },
      { icon: Mail, label: "Contact", href: "/contact" },
      {
        icon: Github,
        label: "GitHub",
        href: "https://github.com/Ishan0121",
        external: true,
      },
      {
        icon: Linkedin,
        label: "LinkedIn",
        href: "https://linkedin.com/in/Ishan0121",
        external: true,
      },
    ],
    []
  );

  const boundaries = useMemo((): Boundaries => {
    const topPadding = 50;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    return {
      minX: -halfWidth + PADDING,
      maxX: Math.max(PADDING, windowSize.x - halfWidth - PADDING),
      minY: -halfHeight + topPadding,
      maxY: Math.max(topPadding, windowSize.y - halfHeight - PADDING),
    };
  }, [windowSize, width, height]);

  const handleHide = useCallback(() => {
    setShowMenu(false);
    setShowContextMenu(false);
    setIsHidden(true);
  }, []);

  const handleShow = useCallback(() => {
    setIsHidden(false);
    setShowContextMenu(false);
  }, []);

  const calculateMenuPosition = useCallback(() => {
    const gap = 20;
    let x = position.x + width / 2;
    let y = position.y - MENU_HEIGHT - gap;

    if (y < PADDING) {
      y = position.y + height + gap;
    }
    if (y + MENU_HEIGHT > windowSize.y - PADDING) {
      y = position.y + height / 2 - MENU_HEIGHT / 2;
    }
    if (x + MENU_WIDTH / 2 > windowSize.x - PADDING) {
      x = windowSize.x - PADDING - MENU_WIDTH / 2;
    }
    if (x - MENU_WIDTH / 2 < PADDING) {
      x = PADDING + MENU_WIDTH / 2;
    }

    setMenuPosition({ x, y });
  }, [position, windowSize, width, height]);

  useEffect(() => {
    if (showMenu) {
      calculateMenuPosition();
    }
  }, [showMenu, calculateMenuPosition]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ x: window.innerWidth, y: window.innerHeight });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMounted || windowSize.x === 0) return;

    const constrainedX = Math.max(
      boundaries.minX,
      Math.min(boundaries.maxX, position.x)
    );
    const constrainedY = Math.max(
      boundaries.minY,
      Math.min(boundaries.maxY, position.y)
    );

    if (constrainedX !== position.x || constrainedY !== position.y) {
      setPosition({ x: constrainedX, y: constrainedY });
    }
  }, [windowSize, boundaries, position, isMounted]);

  useEffect(() => {
    if (windowSize.x === 0) return;

    setIsMounted(true);

    const sides = ["top", "right", "bottom", "left"];
    const randomSide = sides[Math.floor(Math.random() * sides.length)];

    const boundaries = {
      minX: -width / 2 + PADDING,
      maxX: Math.max(PADDING, windowSize.x - width / 2 - PADDING),
      minY: -height / 2 + 50,
      maxY: Math.max(50, windowSize.y - height / 2 - PADDING),
    };

    let startX: number, startY: number;
    let endX: number, endY: number;

    switch (randomSide) {
      case "top":
        startX =
          Math.random() * (boundaries.maxX - boundaries.minX) + boundaries.minX;
        startY = -height - 100;
        endX = startX;
        endY = Math.random() * (windowSize.y * 0.3) + boundaries.minY;
        break;
      case "right":
        startX = windowSize.x + width + 100;
        startY =
          Math.random() * (boundaries.maxY - boundaries.minY) + boundaries.minY;
        endX =
          windowSize.x -
          width / 2 -
          PADDING -
          Math.random() * (windowSize.x * 0.2);
        endY = startY;
        break;
      case "bottom":
        startX =
          Math.random() * (boundaries.maxX - boundaries.minX) + boundaries.minX;
        startY = windowSize.y + height + 100;
        endX = startX;
        endY =
          windowSize.y -
          height / 2 -
          PADDING -
          Math.random() * (windowSize.y * 0.3);
        break;
      case "left":
      default:
        startX = -width - 100;
        startY =
          Math.random() * (boundaries.maxY - boundaries.minY) + boundaries.minY;
        endX = width / 2 + PADDING + Math.random() * (windowSize.x * 0.2);
        endY = startY;
        break;
    }

    endX = Math.max(boundaries.minX, Math.min(boundaries.maxX, endX));
    endY = Math.max(boundaries.minY, Math.min(boundaries.maxY, endY));

    setPosition({ x: startX, y: startY });

    const timer = setTimeout(() => {
      setPosition({ x: endX, y: endY });
      setIsInitialLoad(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [windowSize.x, width, height]);

  const moveToRandomPosition = useCallback(() => {
    if (showMenu || isDragging) return;

    const newX =
      Math.random() * (boundaries.maxX - boundaries.minX) + boundaries.minX;
    const newY =
      Math.random() * (boundaries.maxY - boundaries.minY) + boundaries.minY;

    setPosition({ x: newX, y: newY });

    const timer = setTimeout(() => {
      setSplineKey((prev) => prev + 1);
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [showMenu, isDragging, boundaries]);

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    hasDraggedRef.current = false;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    const dx = Math.abs(e.clientX - dragStartRef.current.x);
    const dy = Math.abs(e.clientY - dragStartRef.current.y);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < DRAG_THRESHOLD && !hasDraggedRef.current) {
      setShowMenu((prev) => !prev);
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (showMenu || isDragging) return;

    hoverTimerRef.current = setTimeout(() => {
      if (!showMenu) {
        moveToRandomPosition();
      }
    }, HOVER_DELAY);
  }, [showMenu, isDragging, moveToRandomPosition]);

  const handleMouseLeave = useCallback(() => {
    clearHoverTimer();
  }, [clearHoverTimer]);

  const handleMenuClick = useCallback(() => {
    setShowMenu(false);
    setShowContextMenu(false);
    onNavigate?.("menu-closed");
  }, [onNavigate]);

  useEffect(() => {
    if (showMenu) {
      clearHoverTimer();
    }
  }, [showMenu, clearHoverTimer]);

  const handleSplineError = useCallback((error?: any) => {
    console.warn(
      "Spline scene error (using fallback):",
      error?.message || error
    );
    setSplineError(true);
  }, []);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    hasDraggedRef.current = true;
    clearHoverTimer();
  }, [clearHoverTimer]);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const newX = position.x + info.offset.x;
      const newY = position.y + info.offset.y;

      const constrainedX = Math.max(
        boundaries.minX,
        Math.min(boundaries.maxX, newX)
      );
      const constrainedY = Math.max(
        boundaries.minY,
        Math.min(boundaries.maxY, newY)
      );

      setPosition({ x: constrainedX, y: constrainedY });
      setIsDragging(false);

      setTimeout(() => {
        setSplineKey((prev) => prev + 1);
        hasDraggedRef.current = false;
      }, SPLINE_RELOAD_DELAY);
    },
    [position, boundaries]
  );

  useEffect(() => {
    return () => {
      clearHoverTimer();
    };
  }, [clearHoverTimer]);

  // Suppress Spline console errors
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      // Filter out known Spline runtime errors
      const errorStr = args.join(" ");
      if (
        errorStr.includes("Missing property") ||
        errorStr.includes("splinetool") ||
        errorStr.includes("buildTimeline")
      ) {
        // Silently ignore or log as warning
        console.warn("Spline runtime warning (suppressed):", ...args);
        return;
      }
      // Call original console.error for other errors
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (hasDraggedRef.current) return;

      setShowMenu(false);

      const menuWidth = 160;
      const menuHeight = 140;

      let x = e.clientX;
      let y = e.clientY;

      if (x + menuWidth > windowSize.x - PADDING) {
        x = windowSize.x - menuWidth - PADDING;
      }
      if (y + menuHeight > windowSize.y - PADDING) {
        y = windowSize.y - menuHeight - PADDING;
      }
      if (x < PADDING) {
        x = PADDING;
      }
      if (y < PADDING) {
        y = PADDING;
      }

      setContextMenuPosition({ x, y });
      setShowContextMenu(true);
    },
    [windowSize]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showContextMenu &&
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node) &&
        botRef.current &&
        !botRef.current.contains(e.target as Node)
      ) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showContextMenu]);

  const handleResetPosition = useCallback(() => {
    const centerX = windowSize.x / 2 - width / 2;
    const centerY = windowSize.y / 2 - height / 2;
    setPosition({ x: centerX, y: centerY });
    setShowContextMenu(false);
    setTimeout(() => {
      setSplineKey((prev) => prev + 1);
    }, ANIMATION_DURATION);
  }, [windowSize, width, height]);

  const handleToggleHide = useCallback(() => {
    setIsHidden((prev) => !prev);
    setShowContextMenu(false);
  }, []);

  const handleMoveRandom = useCallback(() => {
    setShowContextMenu(false);
    moveToRandomPosition();
  }, [moveToRandomPosition]);

  if (!isMounted || windowSize.x === 0) return null;

  return (
    <>
      <motion.div
        ref={botRef}
        drag
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={{
          left: boundaries.minX,
          right: boundaries.maxX,
          top: boundaries.minY,
          bottom: boundaries.maxY,
        }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="fixed z-50 select-none group"
        style={{
          width,
          height,
          left: 0,
          top: 0,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        initial={{
          x: position.x,
          y: position.y,
          scale: 0,
          opacity: 0,
        }}
        animate={{
          x: position.x,
          y: position.y,
          scale: isHidden ? 0.25 : 1,
          opacity: 1,
        }}
        transition={{
          type: "spring",
          stiffness: isInitialLoad ? 80 : 200,
          damping: isInitialLoad ? 12 : 20,
          mass: isInitialLoad ? 1.5 : 1,
        }}
        onMouseDown={!isHidden ? handleMouseDown : undefined}
        onClick={
          !isDragging && isHidden
            ? handleShow
            : !isDragging && !isHidden
            ? handleClick
            : undefined
        }
        onContextMenu={handleContextMenu}
        onMouseEnter={!isHidden ? handleMouseEnter : undefined}
        onMouseLeave={!isHidden ? handleMouseLeave : undefined}
        role="button"
        aria-label={isHidden ? "Show navigation bot" : "Navigation bot"}
        tabIndex={0}
      >
        {!isHidden && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
            <div className="glass text-xs px-4 py-2 rounded-full whitespace-nowrap shadow-lg border">
              Drag to move • Click for menu
            </div>
          </div>
        )}

        {!isHidden && (
          <div
            className="w-full h-full relative pointer-events-none"
            style={{
              filter: isDragging ? "brightness(0.8)" : "brightness(1)",
              transition: "filter 0.2s",
            }}
          >
            {splineScene && !splineError ? (
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center rounded-lg glass">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                }
              >
                <div className="w-full h-full relative" key={splineKey}>
                  <motion.div
                    className="w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Spline
                      scene={splineScene}
                      onError={handleSplineError}
                      onLoad={() => console.log("Spline loaded successfully")}
                    />
                  </motion.div>
                </div>
              </Suspense>
            ) : (
              <FallbackIcon width={width} height={height} icon={fallbackIcon} />
            )}
          </div>
        )}

        {isHidden && <HiddenStateOrb width={width} height={height} />}

        {!isHidden && <DragIndicator />}
      </motion.div>

      <AnimatePresence>
        {showMenu && !isHidden && (
          <MenuPopup
            menuRef={menuRef}
            menuPosition={menuPosition}
            shortcuts={shortcuts}
            onClose={handleMenuClick}
            onHide={handleHide}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(showMenu || showContextMenu) && (
          <motion.div
            className="fixed inset-0 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowMenu(false);
              setShowContextMenu(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContextMenu && (
          <ContextMenu
            contextMenuRef={contextMenuRef}
            position={contextMenuPosition}
            isHidden={isHidden}
            onResetPosition={handleResetPosition}
            onToggleHide={handleToggleHide}
            onMoveRandom={handleMoveRandom}
            onClose={() => setShowContextMenu(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function FallbackIcon({
  width,
  height,
  icon,
}: {
  width: number;
  height: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="w-full h-full flex items-center justify-center rounded-lg glass border">
      {icon || (
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Bot
            className="text-primary"
            style={{
              width: width * 0.4,
              height: height * 0.4,
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

function HiddenStateOrb({ width, height }: { width: number; height: number }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      className="w-full h-full rounded-full relative overflow-visible pointer-events-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
          filter: "blur(8px)",
        }}
        animate={{
          scale: isHovering ? [1, 1.15, 1] : 1,
          opacity: isHovering ? [0.4, 0.6, 0.4] : 0.3,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-full glass border shadow-2xl flex items-center justify-center overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)",
          }}
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          animate={{
            y: isHovering ? [-1, 1, -1] : 0,
          }}
          transition={{
            duration: 2,
            repeat: isHovering ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <Bot
            className="drop-shadow-lg relative z-10 opacity-90"
            style={{ width: width * 0.5, height: height * 0.5 }}
            strokeWidth={2}
          />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isHovering && (
          <motion.div
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-20"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="glass text-xs px-3 py-1.5 rounded-full shadow-lg border">
              Click to expand
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DragIndicator() {
  return (
    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      <div className="w-8 h-8 rounded-full glass border shadow-lg flex items-center justify-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="opacity-90"
          aria-hidden="true"
        >
          <path
            d="M8 3V13M3 8H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

interface MenuPopupProps {
  menuRef: React.RefObject<HTMLDivElement>;
  menuPosition: Position;
  shortcuts: Shortcut[];
  onClose: () => void;
  onHide: () => void;
}

function MenuPopup({
  menuRef,
  menuPosition,
  shortcuts,
  onClose,
  onHide,
}: MenuPopupProps) {
  return (
    <motion.div
      ref={menuRef}
      className="fixed z-[60] pointer-events-none"
      style={{
        left: menuPosition.x,
        top: menuPosition.y,
      }}
      initial={{ scale: 0.8, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 10 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="relative pointer-events-auto -translate-x-1/2">
        <motion.div className="relative glass rounded-2xl shadow-2xl border p-3 w-52">
          <motion.button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg border border-white/30 z-10"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close menu"
          >
            <X className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </motion.button>

          <nav className="relative space-y-1" aria-label="Navigation shortcuts">
            {shortcuts.map((shortcut, index) => (
              <MenuShortcutItem
                key={shortcut.label}
                shortcut={shortcut}
                index={index}
                onClick={onClose}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: shortcuts.length * 0.03 }}
            >
              <button
                onClick={onHide}
                className="group relative flex items-center gap-2.5 p-2 rounded-lg border transition-all duration-200 w-full glass hover:opacity-80"
                aria-label="Hide navigation bot"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform bg-gradient-to-br from-orange-500/20 to-red-500/20">
                  <EyeOff className="w-3.5 h-3.5 opacity-90" strokeWidth={2} />
                </div>
                <span className="text-xs font-medium transition-colors opacity-90 group-hover:opacity-100">
                  Hide
                </span>
              </button>
            </motion.div>
          </nav>
        </motion.div>
      </div>
    </motion.div>
  );
}

interface MenuShortcutItemProps {
  shortcut: Shortcut;
  index: number;
  onClick: () => void;
}

function MenuShortcutItem({ shortcut, index, onClick }: MenuShortcutItemProps) {
  const content = (
    <>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform bg-gradient-to-br from-white/10 to-white/5">
        <shortcut.icon
          className="w-3.5 h-3.5 opacity-90"
          strokeWidth={2}
          aria-hidden="true"
        />
      </div>
      <span className="text-xs font-medium transition-colors opacity-90 group-hover:opacity-100">
        {shortcut.label}
      </span>
    </>
  );

  const className =
    "group relative flex items-center gap-2.5 p-2 rounded-lg border transition-all duration-200 glass hover:opacity-80";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      {shortcut.external ? (
        <a
          href={shortcut.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className={className}
          aria-label={`${shortcut.label} (opens in new tab)`}
        >
          {content}
        </a>
      ) : (
        <a href={shortcut.href} onClick={onClick} className={className}>
          {content}
        </a>
      )}
    </motion.div>
  );
}

interface ContextMenuProps {
  contextMenuRef: React.RefObject<HTMLDivElement>;
  position: Position;
  isHidden: boolean;
  onResetPosition: () => void;
  onToggleHide: () => void;
  onMoveRandom: () => void;
  onClose: () => void;
}

function ContextMenu({
  contextMenuRef,
  position,
  isHidden,
  onResetPosition,
  onToggleHide,
  onMoveRandom,
  onClose,
}: ContextMenuProps) {
  const menuItems = [
    {
      icon: Home,
      label: "Reset Position",
      onClick: onResetPosition,
    },
    {
      icon: Bot,
      label: isHidden ? "Show Bot" : "Hide Bot",
      onClick: onToggleHide,
    },
    {
      icon: Briefcase,
      label: "Random Move",
      onClick: onMoveRandom,
    },
  ];

  return (
    <motion.div
      ref={contextMenuRef}
      className="fixed z-[60] pointer-events-auto"
      style={{
        left: position.x,
        top: position.y,
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <motion.div className="relative glass rounded-xl shadow-2xl border p-2 w-40">
        <div className="relative space-y-1">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={item.onClick}
              className="group relative flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 w-full text-left glass hover:opacity-80"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-white/10 to-white/5">
                <item.icon className="w-3.5 h-3.5 opacity-90" strokeWidth={2} />
              </div>
              <span className="text-xs font-medium transition-colors opacity-90 group-hover:opacity-100">
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
