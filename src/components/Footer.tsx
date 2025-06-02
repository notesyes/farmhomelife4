interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer className={`bg-gray-800 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-emerald-400 mb-4">
              Egg Tracker
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              The complete solution for egg farmers to track production, manage
              sales, and grow their business.
            </p>
            <p className="text-gray-400 text-xs">
              © 2025 Egg Tracker. All rights reserved.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Features
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors duration-200"
                >
                  Production Tracking
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors duration-200"
                >
                  Food Tracking
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors duration-200"
                >
                  Customer Management
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors duration-200"
                >
                  Sales Management
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors duration-200"
                >
                  Reporting & Analytics
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors duration-200"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors duration-200"
                >
                  Tutorials
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors duration-200"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors duration-200"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors duration-200"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";

export default Footer;
