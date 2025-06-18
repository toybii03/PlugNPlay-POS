import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background" data-id="ckbss7q7t" data-path="src/pages/NotFound.tsx">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 p-8" data-id="k1r10xn34" data-path="src/pages/NotFound.tsx">

        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }} data-id="qhnp2n5x9" data-path="src/pages/NotFound.tsx">

          <h1 className="text-8xl font-bold text-primary" data-id="g6wkas8mk" data-path="src/pages/NotFound.tsx">404</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4" data-id="cyrx7puzf" data-path="src/pages/NotFound.tsx">

          <h2 className="text-2xl font-semibold tracking-tight" data-id="639nwwyf7" data-path="src/pages/NotFound.tsx">Page Not Found</h2>
          <p className="text-muted-foreground" data-id="7ebnqv3vi" data-path="src/pages/NotFound.tsx">
            Sorry, the page you are looking for does not exist or has been removed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }} data-id="pn3q24e41" data-path="src/pages/NotFound.tsx">

          <Button asChild variant="default" size="lg" data-id="9sfsbpcle" data-path="src/pages/NotFound.tsx">
            <a href="/" data-id="rb1we83ru" data-path="src/pages/NotFound.tsx">Back to Home</a>
          </Button>
        </motion.div>
      </motion.div>
    </div>);

};

export default NotFound;