import { useState } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt} from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Stay Updated</h3>
              <p>Subscribe to get special offers and latest updates</p>
            </div>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
            {subscribed && (
              <div className="success-message">
                ✓ Thanks for subscribing!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-column">
              <h4>KHIYANSH COMPUTER</h4>
              <p className="company-desc">
                Your one-stop destination for premium products at unbeatable prices.
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <FaMapMarkerAlt className="icon" />
                  <span>Lamachor, Haldwani 263139</span>
                </div>
                <div className="contact-item">
                  <FaPhone className="icon" />
                  <span>+91 9639087092</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="icon" />
                  <span>khiyanshcomputer@outlook.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul className="link-list">
                <li><a href="/">Home</a></li>
                <li><a href="/shop">Shop</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/faq">FAQs</a></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-column">
              <h4>Customer Service</h4>
              <ul className="link-list">
                <li><a href="/shipping">Shipping Info</a></li>
                <li><a href="/returns">Returns & Exchange</a></li>
                <li><a href="/track-order">Track Order</a></li>
                <li><a href="/size-guide">Size Guide</a></li>
                <li><a href="/bulk-orders">Bulk Orders</a></li>
              </ul>
            </div>

            {/* Legal & Social */}
            <div className="footer-column">
              <h4>Legal</h4>
              <ul className="link-list">
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/cookies">Cookie Policy</a></li>
                <li><a href="/compliance">Compliance</a></li>
              </ul>
              
              {/* Social Media */}
              <h4 style={{ marginTop: '20px' }}>Follow Us</h4>
              <div className="social-icons">
                <a href="https://www.facebook.com/Khiyanshcomputer/" target="_blank"  className="social-icon" title="Facebook">
                  <FaFacebook />
                </a>
                <a href="https://www.instagram.com/khiyanshcomputer?igsh=ZDYxZ3B1eXJyNmEw" target="_blank"  className="social-icon" title="Instagram">
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="footer-divider"></div>

          {/* Bottom Footer */}
          <div className="footer-bottom">
            <p className="copyright">© 2025 KHIYANSH COMPUTER. All rights reserved.</p>
            <div className="bottom-links">
              <a href="#">Sitemap</a>
              <a href="#">Accessibility</a>
              <a href="#">Partner With Us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
