import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../img/logo.png";
import axios from "axios";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, orderData } = location.state || {};

  const [order, setOrder] = useState(orderData || null);
  const [loading, setLoading] = useState(!orderData);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${orderId}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!orderData && orderId) fetchOrder();
    else if (!orderData) setLoading(false);

    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Order Placed Successfully!", {
            body: "Your order has been confirmed and will be delivered soon.",
            icon: logo,
          });
        }
      });
    }
  }, [orderId, orderData]);

  // -------------------------------
  // Generate PDF Invoice (WITH DYNAMIC SHIPPING)
  // -------------------------------
  const generatePDF = () => {
    if (!order) return;

    const doc = new jsPDF();
    const img = new Image();
    img.src = logo;

    const primaryColor = [13, 110, 253];
    const accentColor = [40, 167, 69];
    const grayColor = [108, 117, 125];
    const pageWidth = doc.internal.pageSize.width;

    const safe = (val) => (val ? String(val).trim() : "N/A");

    const addHeader = () => {
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, pageWidth, 55, "F");

      doc.addImage(img, "PNG", 14, 10, 35, 35);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("Dilkhush Kirana", 55, 22);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Your trusted local store", 55, 30);

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(pageWidth - 70, 10, 56, 42, 3, 3, "F");

      doc.setTextColor(...primaryColor);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", pageWidth - 42, 18, { align: "center" });

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(`ID: #${safe(order._id || orderId).slice(-8)}`, pageWidth - 42, 26, { align: "center" });
      doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN")}`, pageWidth - 42, 32, { align: "center" });

      const status = safe(order.status).toLowerCase();
      const txnId = safe(order.razorpayPaymentId);
      const razorId = safe(order.razorpayOrderId);

      let displayStatus = "Pending";
      if (status === "paid") displayStatus = "Paid";
      else if (status === "failed") displayStatus = "Failed";

      doc.setFontSize(8.5);
      doc.setTextColor(33, 37, 41);
      doc.text(`Payment: ${displayStatus}`, pageWidth - 42, 38, { align: "center" });

      if (txnId !== "N/A" && txnId.length > 8) {
        doc.text(`Txn: ${txnId.slice(-8)}`, pageWidth - 42, 44, { align: "center" });
      } else if (razorId !== "N/A" && razorId.length > 8) {
        doc.text(`RZP: ${razorId.slice(-8)}`, pageWidth - 42, 44, { align: "center" });
      }
    };

    const addInvoiceBody = () => {
      const ship = order.shippingAddress || {};
      const bill = order.billingAddress || {};

      doc.setFillColor(248, 249, 250);
      doc.rect(0, 60, pageWidth, 50, "F");

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryColor);
      doc.text("BILL TO", 14, 70);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(safe(order.customerName), 14, 78);
      doc.setFontSize(9);
      doc.setTextColor(...grayColor);
      doc.text(safe(order.customerEmail), 14, 84);
      doc.text(safe(order.customerPhone), 14, 90);

      const billAddr = `${bill.street || ""}, ${bill.city || ""}${bill.state ? ", " + bill.state : ""} ${bill.zip || ""}`.trim();
      const billLines = doc.splitTextToSize(billAddr || "N/A", 55);
      doc.text(billLines, 14, 96);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...primaryColor);
      doc.text("SHIP TO", 110, 70);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const shipAddr = `${ship.street || ""}, ${ship.city || ""}${ship.state ? ", " + ship.state : ""} ${ship.zip || ""}`.trim();
      const shipLines = doc.splitTextToSize(shipAddr || "N/A", 85);
      doc.text(shipLines, 110, 78);
      if (ship.country) {
        doc.text(ship.country, 110, 78 + shipLines.length * 5);
      }

      // ---------- Product Table ----------
      const head = [["#", "Product", "Qty", "Price", "Total"]];
      const products = order.products || order.cartItems || [];

      const body = products.map((p, i) => {
        const price = p.product?.price || p.price || 0;
        const qty = p.quantity || 1;
        return [
          i + 1,
          safe(p.product?.name || p.name),
          qty,
          `₹ ${price.toFixed(2)}`,
          `₹ ${(price * qty).toFixed(2)}`,
        ];
      });

      autoTable(doc, {
        head,
        body,
        startY: 118,
        theme: "striped",
        styles: { font: "helvetica", fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: primaryColor, fontStyle: "bold", halign: "center" },
        columnStyles: {
          0: { cellWidth: 15, halign: "center" },
          1: { cellWidth: 80 },
          2: { cellWidth: 20, halign: "center" },
          3: { cellWidth: 30, halign: "right" },
          4: { cellWidth: 35, halign: "right" },
        },
      });

      const finalY = doc.lastAutoTable.finalY || 120;

      // ---------- Calculations ----------
      const subtotal = products.reduce((sum, p) => sum + ((p.product?.price || p.price || 0) * (p.quantity || 1)), 0);
      const shippingCharge = Number(order.shippingCharge || order.shipping || 0);
      const totalAmount = Number(order.totalAmount || subtotal + shippingCharge);

      // ---------- Summary Box ----------
      doc.setFillColor(248, 249, 250);
      doc.roundedRect(pageWidth - 75, finalY + 10, 61, 50, 3, 3, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text("Subtotal:", pageWidth - 70, finalY + 20);
      doc.text(`₹ ${subtotal.toFixed(2)}`, pageWidth - 18, finalY + 20, { align: "right" });

      // Dynamic shipping
      doc.setTextColor(shippingCharge > 0 ? [255, 87, 34] : accentColor);
      doc.text("Shipping:", pageWidth - 70, finalY + 28);
      doc.text(
        shippingCharge > 0 ? `₹ ${shippingCharge.toFixed(2)}` : "FREE",
        pageWidth - 18,
        finalY + 28,
        { align: "right" }
      );

      doc.setLineWidth(0.5);
      doc.setDrawColor(...grayColor);
      doc.line(pageWidth - 70, finalY + 33, pageWidth - 18, finalY + 33);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...primaryColor);
      doc.text("Total:", pageWidth - 70, finalY + 42);
      doc.text(`₹ ${totalAmount.toFixed(2)}`, pageWidth - 18, finalY + 42, { align: "right" });

      // Footer
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(...grayColor);
      const status = safe(order.status).toLowerCase();
      if (status === "paid") {
        doc.text(`Paid via Razorpay on ${new Date(order.paidAt || Date.now()).toLocaleDateString("en-IN")}`, 14, finalY + 58);
      } else {
        doc.text("Payment pending confirmation", 14, finalY + 58);
      }
      doc.text("GSTIN: 24ABCDE1234F1Z7", 14, finalY + 64);
      doc.text("Thank you for shopping with Dilkhush Kirana!", 14, finalY + 70);

      doc.setDrawColor(...grayColor);
      doc.line(pageWidth - 65, finalY + 76, pageWidth - 14, finalY + 76);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("Authorized Signatory", pageWidth - 39.5, finalY + 81, { align: "center" });
    };

    img.onload = () => {
      addHeader();
      addInvoiceBody();
      const formattedDate = new Date().toLocaleDateString("en-IN").replace(/\//g, "-");
      doc.save(`Dilkhush_Invoice_${formattedDate}.pdf`);
    };

    img.onerror = () => {
      addHeader();
      addInvoiceBody();
      const formattedDate = new Date().toLocaleDateString("en-IN").replace(/\//g, "-");
      doc.save(`Dilkhush_Invoice_${formattedDate}.pdf`);
    };
  };

  if (loading)
    return (
      <div className="dk-state">
        <div className="dk-spinner" />
        <p className="dk-state-text">Loading order details...</p>
      </div>
    );

  return (
    <div className="bandhani" style={{ padding: "56px 16px 88px" }}>
      <div className="t-card frame-inset" style={{ maxWidth: 620, margin: "0 auto", padding: "40px 28px", textAlign: "center", position: "relative" }}>
        <DotLottieReact
          src="https://lottie.host/3b0b1e9f-c4b5-4a83-ac91-a684ae861f27/cgY4CSU3Wl.lottie"
          loop
          autoplay
          style={{ width: 170, height: 170, margin: "0 auto" }}
        />

        <span className="dk-eyebrow" style={{ marginTop: 8 }}>Dhanyavaad</span>
        <h1 className="font-display" style={{ fontSize: "clamp(28px, 4.4vw, 40px)", color: "var(--ink)", margin: "0 0 6px", lineHeight: 1.15 }}>
          Order Placed Successfully!
        </h1>
        <div className="ornament" style={{ margin: "14px 0 18px" }}><span className="diamond" /></div>
        <p style={{ color: "var(--ink-2)", fontSize: 17, lineHeight: 1.7, margin: "0 auto 28px", maxWidth: 460 }}>
          Thank you for your purchase. Your order <strong style={{ color: "var(--maroon)" }}>#{orderId}</strong> has been confirmed and will be delivered soon.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={generatePDF}>
            Download Invoice (PDF)
          </button>
          <a href={`/track-order?order=${encodeURIComponent(orderId || "")}`} className="btn btn-outline">
            Track Order
          </a>
          <button className="btn btn-soft" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>

        <p style={{ marginTop: 24, marginBottom: 0, fontSize: 14, color: "var(--muted)" }}>
          Order ID: <strong style={{ color: "var(--ink)" }}>{orderId}</strong>
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;