import React from "react";

// 🏠 Home Page
export const HomePage = () => (
  <div className="bg-light min-vh-100 py-5">
    <link 
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
      rel="stylesheet"
    />
    <div className="container">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white py-5 border-bottom border-success border-4">
          <div className="px-3">
            <h1 className="display-4 fw-semibold mb-2">Dilkhush Kirana Store</h1>
            <p className="lead text-white-50 mb-0">Dhasa, Gujarat</p>
          </div>
        </div>
        
        <div className="card-body p-5">
          <h2 className="h3 fw-semibold text-dark mb-4">Your Trusted Partner in Daily Essentials</h2>
          <p className="lead text-secondary mb-3">
            Welcome to <strong className="text-dark">Dilkhush Kirana Store</strong>, a reliable source for premium 
            grocery products in <strong>Dhasa, Gujarat</strong>. We specialize in providing 
            daily essentials, saani, and authentic spices to our valued customers.
          </p>
          <p className="text-secondary mb-5">
            Our commitment is to deliver fresh, high-quality products at competitive prices 
            while maintaining the highest standards of customer service and satisfaction.
          </p>

          <div className="row g-4 mt-4">
            <div className="col-md-4">
              <div className="card h-100 border">
                <div className="card-body p-4">
                  <div className="bg-success text-white rounded d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '50px', height: '50px'}}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 7h-9M14 17H5M15 12h-4m7 0h1m-1 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"/>
                    </svg>
                  </div>
                  <h5 className="card-title fw-semibold">Premium Quality</h5>
                  <p className="card-text text-secondary small">
                    Carefully selected products ensuring freshness and authenticity in every purchase
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border">
                <div className="card-body p-4">
                  <div className="bg-success text-white rounded d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '50px', height: '50px'}}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M2 12h20"/>
                    </svg>
                  </div>
                  <h5 className="card-title fw-semibold">Competitive Pricing</h5>
                  <p className="card-text text-secondary small">
                    Fair and transparent pricing structure designed to provide excellent value
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border">
                <div className="card-body p-4">
                  <div className="bg-success text-white rounded d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{width: '50px', height: '50px'}}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13"/>
                      <path d="M16 8h5l3 3v5h-8V8z"/>
                      <circle cx="5.5" cy="18.5" r="2.5"/>
                      <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                  </div>
                  <h5 className="card-title fw-semibold">Reliable Delivery</h5>
                  <p className="card-text text-secondary small">
                    Efficient delivery service ensuring your orders reach you promptly and securely
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ⚖️ Terms & Conditions
export const TermsPage = () => (
  <div className="bg-light min-vh-100 py-5">
    <link 
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
      rel="stylesheet"
    />
    <div className="container">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white py-5 border-bottom border-primary border-4">
          <div className="px-3">
            <h1 className="display-4 fw-semibold mb-0">Terms & Conditions</h1>
          </div>
        </div>
        
        <div className="card-body p-5">
          <div className="mb-5 pb-4 border-bottom">
            <h3 className="h4 fw-semibold text-dark mb-3">1. Products & Pricing</h3>
            <p className="text-secondary mb-0">
              All product prices are subject to change based on market conditions and availability. 
              We reserve the right to modify prices without prior notice. The price applicable 
              at the time of order confirmation will be honored for that transaction.
            </p>
          </div>

          <div className="mb-5 pb-4 border-bottom">
            <h3 className="h4 fw-semibold text-dark mb-3">2. Order Processing</h3>
            <p className="text-secondary mb-0">
              All orders are subject to product availability and acceptance. We reserve the right 
              to refuse or cancel any order at our discretion. In cases where items are unavailable, 
              we will notify you promptly and process appropriate refunds if payment has been received.
            </p>
          </div>

          <div className="mb-5 pb-4 border-bottom">
            <h3 className="h4 fw-semibold text-dark mb-3">3. Delivery Terms</h3>
            <p className="text-secondary mb-0">
              Delivery timelines are estimates and may vary based on your location, order volume, 
              and product availability. While we strive to meet delivery commitments, unforeseen 
              circumstances may cause delays beyond our control.
            </p>
          </div>

          <div className="mb-5 pb-4 border-bottom">
            <h3 className="h4 fw-semibold text-dark mb-3">4. Payment Processing</h3>
            <p className="text-secondary mb-0">
              Orders are confirmed only upon successful payment verification through our authorized 
              payment gateway partners, including Razorpay. All transactions are processed securely 
              using industry-standard encryption protocols.
            </p>
          </div>

          <div className="mb-5">
            <h3 className="h4 fw-semibold text-dark mb-3">5. User Obligations</h3>
            <p className="text-secondary mb-0">
              Users are required to provide accurate and complete information when placing orders, 
              including contact details and delivery addresses. Incorrect or incomplete information 
              may result in delivery delays or order cancellation.
            </p>
          </div>

          <div className="alert alert-light border p-4">
            <p className="mb-0 text-secondary">
              For inquiries or clarifications regarding these terms, please contact us at{' '}
              <a href="mailto:muzammilmetar82@gmail.com" className="text-primary text-decoration-none fw-medium">
                muzammilmetar82@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 🔒 Privacy Policy
export const PrivacyPage = () => (
  <div className="bg-light min-vh-100 py-5">
    <link 
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
      rel="stylesheet"
    />
    <div className="container">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white py-5 border-bottom border-4" style={{borderColor: '#9b59b6'}}>
          <div className="px-3">
            <h1 className="display-4 fw-semibold mb-0">Privacy Policy</h1>
          </div>
        </div>
        
        <div className="card-body p-5">
          <div className="mb-5 pb-4 border-bottom">
            <h3 className="h4 fw-semibold text-dark mb-4">Information Collection</h3>
            <p className="text-secondary mb-3">
              At <strong className="text-dark">Dilkhush Kirana Store</strong>, we are committed to 
              protecting your privacy and handling your personal information with the utmost care 
              and responsibility.
            </p>
            <p className="text-secondary mb-2">
              We collect only essential personal information necessary for order processing and 
              delivery, including:
            </p>
            <ul className="text-secondary">
              <li className="mb-2">Full name and contact information</li>
              <li className="mb-2">Delivery address details</li>
              <li className="mb-2">Email address for order communications</li>
              <li className="mb-2">Phone number for delivery coordination</li>
            </ul>
          </div>

          <div className="mb-5 pb-4 border-bottom">
            <h3 className="h4 fw-semibold text-dark mb-4">Data Usage & Protection</h3>
            <p className="text-secondary mb-3">
              Your personal information is used exclusively for order fulfillment, customer service, 
              and improving our services. We implement appropriate technical and organizational 
              measures to protect your data against unauthorized access, alteration, or disclosure.
            </p>
            <p className="text-secondary mb-0">
              We do not sell, rent, or share your personal information with third parties for 
              marketing purposes. Data sharing is limited to essential service providers involved 
              in order processing and delivery.
            </p>
          </div>

          <div className="mb-5 pb-4 border-bottom">
            <h3 className="h4 fw-semibold text-dark mb-4">Payment Security</h3>
            <p className="text-secondary mb-0">
              All payment transactions are processed through PCI-DSS compliant payment gateways, 
              including Razorpay. We do not store complete payment card information on our servers. 
              Financial data is encrypted and handled according to industry security standards.
            </p>
          </div>

          <div className="mb-5">
            <h3 className="h4 fw-semibold text-dark mb-4">Contact Information</h3>
            <p className="text-secondary mb-0">
              For questions, concerns, or requests regarding your personal data or this privacy 
              policy, please contact us at{' '}
              <a href="mailto:muzammilmetar82@gmail.com" className="text-decoration-none fw-medium" 
                 style={{color: '#9b59b6'}}>
                muzammilmetar82@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 💰 Refund & Return Policy
export const RefundPage = () => (
  <div className="bg-light min-vh-100 py-5">
    <link 
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
      rel="stylesheet"
    />
    <div className="container">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white py-5 border-bottom border-warning border-4">
          <div className="px-3">
            <h1 className="display-4 fw-semibold mb-0">Refund & Return Policy</h1>
          </div>
        </div>
        
        <div className="card-body p-5">
          <div className="mb-5 pb-4 border-bottom">
            <h3 className="h4 fw-semibold text-dark mb-3">1. Return Eligibility</h3>
            <p className="text-secondary mb-0">
              Due to the perishable nature of grocery items, returns are generally not accepted 
              under normal circumstances. However, we will accept returns and process refunds in 
              cases where products are damaged, defective, expired, or incorrect items were delivered.
            </p>
          </div>

          <div className="mb-5 pb-4 border-bottom">
            <h3 className="h4 fw-semibold text-dark mb-3">2. Refund Request Process</h3>
            <p className="text-secondary mb-0">
              If you receive damaged, defective, or incorrect products, you must contact our customer 
              service team within 24 hours of delivery. Please provide your order number, a detailed 
              description of the issue, and photographic evidence of the product condition. Our team 
              will review your request and determine eligibility for a refund or replacement.
            </p>
          </div>

          <div className="mb-5 pb-4 border-bottom">
            <h3 className="h4 fw-semibold text-dark mb-3">3. Refund Processing Timeline</h3>
            <p className="text-secondary mb-0">
              Once your refund request is approved, the refund amount will be processed within 3 to 7 
              business days. The refund will be credited to your original payment method. Please note 
              that depending on your financial institution, it may take additional time for the refund 
              to reflect in your account.
            </p>
          </div>

          <div className="mb-5 pb-4 border-bottom">
            <h3 className="h4 fw-semibold text-dark mb-3">4. Non-Refundable Conditions</h3>
            <p className="text-secondary mb-0">
              Refunds will not be issued for products that have been used, consumed, or where packaging 
              has been opened (except in cases of damage or defect). Change of mind or preference does 
              not qualify for returns or refunds on grocery items.
            </p>
          </div>

          <div className="alert alert-light border p-4 mt-5">
            <h5 className="fw-semibold text-dark mb-3">Customer Support</h5>
            <p className="mb-0 text-secondary">
              For refund inquiries or to initiate a return request, please contact our support team at{' '}
              <a href="mailto:muzammilmetar82@gmail.com" className="text-warning text-decoration-none fw-medium">
                muzammilmetar82@gmail.com
              </a>
            </p>
          </div>
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