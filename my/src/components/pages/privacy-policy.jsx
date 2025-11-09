import React from "react";

// 🏠 Home Page
export const HomePage = () => (
  <div className="home-page">
    <style>{`
      .home-page {
        min-height: 100vh;
        background: #f8f9fa;
        padding: 60px 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      .home-container {
        max-width: 1100px;
        margin: 0 auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        overflow: hidden;
      }
      .home-header {
        background: #2c3e50;
        color: white;
        padding: 60px 50px;
        border-bottom: 4px solid #27ae60;
      }
      .home-header h1 {
        font-size: 2.8rem;
        font-weight: 600;
        margin-bottom: 12px;
        letter-spacing: -0.5px;
      }
      .home-header .location {
        font-size: 1.1rem;
        color: #bdc3c7;
        font-weight: 400;
      }
      .home-content {
        padding: 60px 50px;
      }
      .home-content h2 {
        font-size: 1.9rem;
        color: #2c3e50;
        margin-bottom: 30px;
        font-weight: 600;
        letter-spacing: -0.3px;
      }
      .home-content p {
        font-size: 1.05rem;
        color: #5a6c7d;
        line-height: 1.8;
        margin-bottom: 20px;
      }
      .home-content strong {
        color: #2c3e50;
        font-weight: 600;
      }
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-top: 50px;
      }
      .feature-card {
        background: #ffffff;
        border: 1px solid #e1e8ed;
        border-radius: 6px;
        padding: 35px 30px;
        transition: all 0.3s ease;
      }
      .feature-card:hover {
        border-color: #27ae60;
        box-shadow: 0 4px 12px rgba(39, 174, 96, 0.1);
      }
      .feature-card .icon {
        width: 50px;
        height: 50px;
        background: #27ae60;
        color: white;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        margin-bottom: 20px;
      }
      .feature-card h3 {
        color: #2c3e50;
        font-weight: 600;
        margin-bottom: 12px;
        font-size: 1.2rem;
      }
      .feature-card p {
        color: #5a6c7d;
        margin: 0;
        font-size: 0.95rem;
        line-height: 1.6;
      }
    `}</style>
    
    <div className="home-container">
      <div className="home-header">
        <h1>Dilkhush Kirana Store</h1>
        <div className="location">Dhasa, Gujarat</div>
      </div>
      
      <div className="home-content">
        <h2>Your Trusted Partner in Daily Essentials</h2>
        <p>
          Welcome to <strong>Dilkhush Kirana Store</strong>, a reliable source for premium 
          grocery products in <strong>Dhasa, Gujarat</strong>. We specialize in providing 
          daily essentials, saani, and authentic spices to our valued customers.
        </p>
        <p>
          Our commitment is to deliver fresh, high-quality products at competitive prices 
          while maintaining the highest standards of customer service and satisfaction.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7h-9M14 17H5M15 12h-4m7 0h1m-1 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"/>
              </svg>
            </div>
            <h3>Premium Quality</h3>
            <p>Carefully selected products ensuring freshness and authenticity in every purchase</p>
          </div>
          <div className="feature-card">
            <div className="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M2 12h20"/>
              </svg>
            </div>
            <h3>Competitive Pricing</h3>
            <p>Fair and transparent pricing structure designed to provide excellent value</p>
          </div>
          <div className="feature-card">
            <div className="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"/>
                <path d="M16 8h5l3 3v5h-8V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <h3>Reliable Delivery</h3>
            <p>Efficient delivery service ensuring your orders reach you promptly and securely</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ⚖️ Terms & Conditions
export const TermsPage = () => (
  <div className="terms-page">
    <style>{`
      .terms-page {
        min-height: 100vh;
        background: #f8f9fa;
        padding: 60px 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      .terms-container {
        max-width: 1100px;
        margin: 0 auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        overflow: hidden;
      }
      .terms-header {
        background: #2c3e50;
        color: white;
        padding: 60px 50px;
        border-bottom: 4px solid #3498db;
      }
      .terms-header h1 {
        font-size: 2.8rem;
        font-weight: 600;
        margin: 0;
        letter-spacing: -0.5px;
      }
      .terms-content {
        padding: 60px 50px;
      }
      .terms-item {
        margin-bottom: 40px;
        padding-bottom: 40px;
        border-bottom: 1px solid #e1e8ed;
      }
      .terms-item:last-of-type {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      .terms-item h3 {
        color: #2c3e50;
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 15px;
        letter-spacing: -0.3px;
      }
      .terms-item p {
        color: #5a6c7d;
        font-size: 1.05rem;
        line-height: 1.8;
        margin: 0;
      }
      .contact-box {
        background: #f8f9fa;
        border: 1px solid #e1e8ed;
        border-radius: 6px;
        padding: 30px;
        margin-top: 50px;
      }
      .contact-box p {
        margin: 0;
        font-size: 1.05rem;
        color: #5a6c7d;
      }
      .contact-box a {
        color: #3498db;
        font-weight: 500;
        text-decoration: none;
      }
      .contact-box a:hover {
        text-decoration: underline;
      }
    `}</style>
    
    <div className="terms-container">
      <div className="terms-header">
        <h1>Terms & Conditions</h1>
      </div>
      
      <div className="terms-content">
        <div className="terms-item">
          <h3>1. Products & Pricing</h3>
          <p>
            All product prices are subject to change based on market conditions and availability. 
            We reserve the right to modify prices without prior notice. The price applicable 
            at the time of order confirmation will be honored for that transaction.
          </p>
        </div>

        <div className="terms-item">
          <h3>2. Order Processing</h3>
          <p>
            All orders are subject to product availability and acceptance. We reserve the right 
            to refuse or cancel any order at our discretion. In cases where items are unavailable, 
            we will notify you promptly and process appropriate refunds if payment has been received.
          </p>
        </div>

        <div className="terms-item">
          <h3>3. Delivery Terms</h3>
          <p>
            Delivery timelines are estimates and may vary based on your location, order volume, 
            and product availability. While we strive to meet delivery commitments, unforeseen 
            circumstances may cause delays beyond our control.
          </p>
        </div>

        <div className="terms-item">
          <h3>4. Payment Processing</h3>
          <p>
            Orders are confirmed only upon successful payment verification through our authorized 
            payment gateway partners, including Razorpay. All transactions are processed securely 
            using industry-standard encryption protocols.
          </p>
        </div>

        <div className="terms-item">
          <h3>5. User Obligations</h3>
          <p>
            Users are required to provide accurate and complete information when placing orders, 
            including contact details and delivery addresses. Incorrect or incomplete information 
            may result in delivery delays or order cancellation.
          </p>
        </div>

        <div className="contact-box">
          <p>
            For inquiries or clarifications regarding these terms, please contact us at{' '}
            <a href="mailto:muzammilmetar82@gmail.com">muzammilmetar82@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  </div>
);

// 🔒 Privacy Policy
export const PrivacyPage = () => (
  <div className="privacy-page">
    <style>{`
      .privacy-page {
        min-height: 100vh;
        background: #f8f9fa;
        padding: 60px 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      .privacy-container {
        max-width: 1100px;
        margin: 0 auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        overflow: hidden;
      }
      .privacy-header {
        background: #2c3e50;
        color: white;
        padding: 60px 50px;
        border-bottom: 4px solid #9b59b6;
      }
      .privacy-header h1 {
        font-size: 2.8rem;
        font-weight: 600;
        margin: 0;
        letter-spacing: -0.5px;
      }
      .privacy-content {
        padding: 60px 50px;
      }
      .privacy-section {
        margin-bottom: 40px;
        padding-bottom: 40px;
        border-bottom: 1px solid #e1e8ed;
      }
      .privacy-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      .privacy-section h3 {
        color: #2c3e50;
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 20px;
        letter-spacing: -0.3px;
      }
      .privacy-section p {
        color: #5a6c7d;
        font-size: 1.05rem;
        line-height: 1.8;
        margin-bottom: 15px;
      }
      .privacy-section p:last-child {
        margin-bottom: 0;
      }
      .privacy-section ul {
        margin: 15px 0;
        padding-left: 25px;
        color: #5a6c7d;
      }
      .privacy-section li {
        margin-bottom: 10px;
        line-height: 1.7;
      }
      .privacy-section a {
        color: #9b59b6;
        font-weight: 500;
        text-decoration: none;
      }
      .privacy-section a:hover {
        text-decoration: underline;
      }
      .highlight {
        color: #2c3e50;
        font-weight: 600;
      }
    `}</style>
    
    <div className="privacy-container">
      <div className="privacy-header">
        <h1>Privacy Policy</h1>
      </div>
      
      <div className="privacy-content">
        <div className="privacy-section">
          <h3>Information Collection</h3>
          <p>
            At <span className="highlight">Dilkhush Kirana Store</span>, we are committed to 
            protecting your privacy and handling your personal information with the utmost care 
            and responsibility.
          </p>
          <p>
            We collect only essential personal information necessary for order processing and 
            delivery, including:
          </p>
          <ul>
            <li>Full name and contact information</li>
            <li>Delivery address details</li>
            <li>Email address for order communications</li>
            <li>Phone number for delivery coordination</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h3>Data Usage & Protection</h3>
          <p>
            Your personal information is used exclusively for order fulfillment, customer service, 
            and improving our services. We implement appropriate technical and organizational 
            measures to protect your data against unauthorized access, alteration, or disclosure.
          </p>
          <p>
            We do not sell, rent, or share your personal information with third parties for 
            marketing purposes. Data sharing is limited to essential service providers involved 
            in order processing and delivery.
          </p>
        </div>

        <div className="privacy-section">
          <h3>Payment Security</h3>
          <p>
            All payment transactions are processed through PCI-DSS compliant payment gateways, 
            including Razorpay. We do not store complete payment card information on our servers. 
            Financial data is encrypted and handled according to industry security standards.
          </p>
        </div>

        <div className="privacy-section">
          <h3>Contact Information</h3>
          <p>
            For questions, concerns, or requests regarding your personal data or this privacy 
            policy, please contact us at{' '}
            <a href="mailto:muzammilmetar82@gmail.com">muzammilmetar82@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  </div>
);

// 💰 Refund & Return Policy
export const RefundPage = () => (
  <div className="refund-page">
    <style>{`
      .refund-page {
        min-height: 100vh;
        background: #f8f9fa;
        padding: 60px 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      .refund-container {
        max-width: 1100px;
        margin: 0 auto;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        overflow: hidden;
      }
      .refund-header {
        background: #2c3e50;
        color: white;
        padding: 60px 50px;
        border-bottom: 4px solid #e67e22;
      }
      .refund-header h1 {
        font-size: 2.8rem;
        font-weight: 600;
        margin: 0;
        letter-spacing: -0.5px;
      }
      .refund-content {
        padding: 60px 50px;
      }
      .refund-item {
        margin-bottom: 40px;
        padding-bottom: 40px;
        border-bottom: 1px solid #e1e8ed;
      }
      .refund-item:last-of-type {
        border-bottom: none;
      }
      .refund-item h3 {
        color: #2c3e50;
        font-size: 1.4rem;
        font-weight: 600;
        margin-bottom: 15px;
        letter-spacing: -0.3px;
      }
      .refund-item p {
        color: #5a6c7d;
        font-size: 1.05rem;
        line-height: 1.8;
        margin: 0;
      }
      .contact-card {
        background: #f8f9fa;
        border: 1px solid #e1e8ed;
        border-radius: 6px;
        padding: 30px;
        margin-top: 50px;
      }
      .contact-card h3 {
        color: #2c3e50;
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 15px;
      }
      .contact-card p {
        margin: 0;
        font-size: 1.05rem;
        color: #5a6c7d;
      }
      .contact-card a {
        color: #e67e22;
        font-weight: 500;
        text-decoration: none;
      }
      .contact-card a:hover {
        text-decoration: underline;
      }
    `}</style>
    
    <div className="refund-container">
      <div className="refund-header">
        <h1>Refund & Return Policy</h1>
      </div>
      
      <div className="refund-content">
        <div className="refund-item">
          <h3>1. Return Eligibility</h3>
          <p>
            Due to the perishable nature of grocery items, returns are generally not accepted 
            under normal circumstances. However, we will accept returns and process refunds in 
            cases where products are damaged, defective, expired, or incorrect items were delivered.
          </p>
        </div>

        <div className="refund-item">
          <h3>2. Refund Request Process</h3>
          <p>
            If you receive damaged, defective, or incorrect products, you must contact our customer 
            service team within 24 hours of delivery. Please provide your order number, a detailed 
            description of the issue, and photographic evidence of the product condition. Our team 
            will review your request and determine eligibility for a refund or replacement.
          </p>
        </div>

        <div className="refund-item">
          <h3>3. Refund Processing Timeline</h3>
          <p>
            Once your refund request is approved, the refund amount will be processed within 3 to 7 
            business days. The refund will be credited to your original payment method. Please note 
            that depending on your financial institution, it may take additional time for the refund 
            to reflect in your account.
          </p>
        </div>

        <div className="refund-item">
          <h3>4. Non-Refundable Conditions</h3>
          <p>
            Refunds will not be issued for products that have been used, consumed, or where packaging 
            has been opened (except in cases of damage or defect). Change of mind or preference does 
            not qualify for returns or refunds on grocery items.
          </p>
        </div>

        <div className="contact-card">
          <h3>Customer Support</h3>
          <p>
            For refund inquiries or to initiate a return request, please contact our support team at{' '}
            <a href="mailto:muzammilmetar82@gmail.com">muzammilmetar82@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default {
  HomePage,
  TermsPage,
  PrivacyPage,
  RefundPage,
};