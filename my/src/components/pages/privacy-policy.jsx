import React from "react";
import { PageBanner, Ornament } from "../Ornament";

const PolicyLayout = ({ title, sub, crumb, children }) => (
  <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
    <div className="toran" />
    <div className="dk-wrap" style={{ padding: "14px 16px" }}>
      <a href="/" className="link-arrow" style={{ color: "var(--ink-2)" }}>← Back to Dilkhush Kirana</a>
    </div>
    <PageBanner title={title} sub={sub} crumb={crumb} />
    <div className="bandhani" style={{ padding: "0 16px 88px" }}>
      <div className="t-card t-prose" style={{ maxWidth: 860, margin: "-24px auto 0", padding: "clamp(24px, 5vw, 52px)", position: "relative", zIndex: 16 }}>
        {children}
        <Ornament className="mt-8" />
      </div>
    </div>
  </div>
);

const Feature = ({ title, text, icon }) => (
  <div className="t-card" style={{ padding: 22 }}>
    <span className="t-icon-circle" style={{ marginBottom: 12 }}>{icon}</span>
    <h5 className="font-display" style={{ fontSize: 20, color: "var(--ink)", margin: "0 0 6px" }}>{title}</h5>
    <p style={{ fontSize: 15, margin: 0 }}>{text}</p>
  </div>
);

// 🏠 Home Page
export const HomePage = () => (
  <PolicyLayout title="Dilkhush Kirana Store" sub="Dhasa, Gujarat" crumb="Welcome">
    <h3>Your Trusted Partner in Daily Essentials</h3>
    <p>
      Welcome to <strong>Dilkhush Kirana Store</strong>, a reliable source for premium
      grocery products in <strong>Dhasa, Gujarat</strong>. We specialize in providing
      daily essentials, saani, and authentic spices to our valued customers.
    </p>
    <p>
      Our commitment is to deliver fresh, high-quality products at competitive prices
      while maintaining the highest standards of customer service and satisfaction.
    </p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 28 }}>
      <Feature title="Premium Quality" text="Carefully selected products ensuring freshness and authenticity in every purchase"
        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7h-9M14 17H5M15 12h-4m7 0h1m-1 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"/></svg>} />
      <Feature title="Competitive Pricing" text="Fair and transparent pricing structure designed to provide excellent value"
        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>} />
      <Feature title="Reliable Delivery" text="Efficient delivery service ensuring your orders reach you promptly and securely"
        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h5l3 3v5h-8V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>} />
    </div>
  </PolicyLayout>
);

// ⚖️ Terms & Conditions
export const TermsPage = () => (
  <PolicyLayout title="Terms & Conditions" crumb="Legal">
    <section>
      <h3><span className="num">01</span>Products &amp; Pricing</h3>
      <p>
        All product prices are subject to change based on market conditions and availability.
        We reserve the right to modify prices without prior notice. The price applicable
        at the time of order confirmation will be honored for that transaction.
      </p>
    </section>
    <section>
      <h3><span className="num">02</span>Order Processing</h3>
      <p>
        All orders are subject to product availability and acceptance. We reserve the right
        to refuse or cancel any order at our discretion. In cases where items are unavailable,
        we will notify you promptly and process appropriate refunds if payment has been received.
      </p>
    </section>
    <section>
      <h3><span className="num">03</span>Delivery Terms</h3>
      <p>
        Delivery timelines are estimates and may vary based on your location, order volume,
        and product availability. While we strive to meet delivery commitments, unforeseen
        circumstances may cause delays beyond our control.
      </p>
    </section>
    <section>
      <h3><span className="num">04</span>Payment Processing</h3>
      <p>
        Orders are confirmed only upon successful payment verification through our authorized
        payment gateway partners, including Razorpay. All transactions are processed securely
        using industry-standard encryption protocols.
      </p>
    </section>
    <section>
      <h3><span className="num">05</span>User Obligations</h3>
      <p>
        Users are required to provide accurate and complete information when placing orders,
        including contact details and delivery addresses. Incorrect or incomplete information
        may result in delivery delays or order cancellation.
      </p>
    </section>
    <div className="t-note">
      <p style={{ margin: 0 }}>
        For inquiries or clarifications regarding these terms, please contact us at{' '}
        <a href="mailto:muzammilmetar82@gmail.com">muzammilmetar82@gmail.com</a>
      </p>
    </div>
  </PolicyLayout>
);

// 🔒 Privacy Policy
export const PrivacyPage = () => (
  <PolicyLayout title="Privacy Policy" crumb="Legal">
    <section>
      <h3><span className="num">01</span>Information Collection</h3>
      <p>
        At <strong>Dilkhush Kirana Store</strong>, we are committed to
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
    </section>
    <section>
      <h3><span className="num">02</span>Data Usage &amp; Protection</h3>
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
    </section>
    <section>
      <h3><span className="num">03</span>Payment Security</h3>
      <p>
        All payment transactions are processed through PCI-DSS compliant payment gateways,
        including Razorpay. We do not store complete payment card information on our servers.
        Financial data is encrypted and handled according to industry security standards.
      </p>
    </section>
    <section>
      <h3><span className="num">04</span>Contact Information</h3>
      <p>
        For questions, concerns, or requests regarding your personal data or this privacy
        policy, please contact us at{' '}
        <a href="mailto:muzammilmetar82@gmail.com">muzammilmetar82@gmail.com</a>
      </p>
    </section>
  </PolicyLayout>
);

// 💰 Refund & Return Policy
export const RefundPage = () => (
  <PolicyLayout title="Refund & Return Policy" crumb="Legal">
    <section>
      <h3><span className="num">01</span>Return Eligibility</h3>
      <p>
        Due to the perishable nature of grocery items, returns are generally not accepted
        under normal circumstances. However, we will accept returns and process refunds in
        cases where products are damaged, defective, expired, or incorrect items were delivered.
      </p>
    </section>
    <section>
      <h3><span className="num">02</span>Refund Request Process</h3>
      <p>
        If you receive damaged, defective, or incorrect products, you must contact our customer
        service team within 24 hours of delivery. Please provide your order number, a detailed
        description of the issue, and photographic evidence of the product condition. Our team
        will review your request and determine eligibility for a refund or replacement.
      </p>
    </section>
    <section>
      <h3><span className="num">03</span>Refund Processing Timeline</h3>
      <p>
        Once your refund request is approved, the refund amount will be processed within 3 to 7
        business days. The refund will be credited to your original payment method. Please note
        that depending on your financial institution, it may take additional time for the refund
        to reflect in your account.
      </p>
    </section>
    <section>
      <h3><span className="num">04</span>Non-Refundable Conditions</h3>
      <p>
        Refunds will not be issued for products that have been used, consumed, or where packaging
        has been opened (except in cases of damage or defect). Change of mind or preference does
        not qualify for returns or refunds on grocery items.
      </p>
    </section>
    <div className="t-note">
      <h5 className="font-display" style={{ fontSize: 20, color: "var(--ink)", margin: "0 0 6px" }}>Customer Support</h5>
      <p style={{ margin: 0 }}>
        For refund inquiries or to initiate a return request, please contact our support team at{' '}
        <a href="mailto:muzammilmetar82@gmail.com">muzammilmetar82@gmail.com</a>
      </p>
    </div>
  </PolicyLayout>
);

export default {
  HomePage,
  TermsPage,
  PrivacyPage,
  RefundPage,
};
