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
  // Generate PDF Invoice (NO FONTS!)
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

    // White invoice box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - 70, 10, 56, 42, 3, 3, "F");

    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth - 42, 18, { align: "center" });

    // Basic invoice info
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(`ID: #${safe(order._id || orderId).slice(-8)}`, pageWidth - 42, 26, { align: "center" });
    doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN")}`, pageWidth - 42, 32, { align: "center" });

    // Payment info (safe + clean)
    const status = safe(order.status).toLowerCase();
    const txnId = safe(order.razorpayPaymentId);
    const razorId = safe(order.razorpayOrderId);

    let displayStatus = "Pending";
    if (status === "paid") displayStatus = "Paid ✅";
    else if (status === "failed") displayStatus = "Failed ❌";

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

    // Product Table
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
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: primaryColor,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 15, halign: "center" },
        1: { cellWidth: 80 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 30, halign: "right" },
        4: { cellWidth: 35, halign: "right" },
      },
    });

    const finalY = doc.lastAutoTable.finalY || 120;
    const subtotal = products.reduce((sum, p) => sum + ((p.product?.price || p.price || 0) * (p.quantity || 1)), 0);

    doc.setFillColor(248, 249, 250);
    doc.roundedRect(pageWidth - 75, finalY + 10, 61, 40, 3, 3, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text("Subtotal:", pageWidth - 70, finalY + 20);
    doc.text(`₹ ${subtotal.toFixed(2)}`, pageWidth - 18, finalY + 20, { align: "right" });

    doc.setTextColor(...accentColor);
    doc.text("Shipping:", pageWidth - 70, finalY + 28);
    doc.text("FREE", pageWidth - 18, finalY + 28, { align: "right" });

    doc.setLineWidth(0.5);
    doc.setDrawColor(...grayColor);
    doc.line(pageWidth - 70, finalY + 33, pageWidth - 18, finalY + 33);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text("Total:", pageWidth - 70, finalY + 42);
    doc.text(`₹ ${(order.totalAmount || subtotal).toFixed(2)}`, pageWidth - 18, finalY + 42, { align: "right" });

    // ✅ Dynamic footer note
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    if (status === "paid") {
      doc.text(`Paid via Razorpay on ${new Date(order.paidAt || Date.now()).toLocaleDateString("en-IN")}`, 14, finalY + 58);
    } else {
      doc.text("Payment pending confirmation", 14, finalY + 58);
    }
    doc.text("GSTIN: 24ABCDE1234F1Z7", 14, finalY + 64);

    doc.setDrawColor(...grayColor);
    doc.line(pageWidth - 65, finalY + 70, pageWidth - 14, finalY + 70);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Authorized Signatory", pageWidth - 39.5, finalY + 75, { align: "center" });
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
      <div className="text-center py-5">
        <p>Loading order details...</p>
      </div>
    );

  return (
    <div className="container text-center py-5">
      <DotLottieReact
        src="https://lottie.host/3b0b1e9f-c4b5-4a83-ac91-a684ae861f27/cgY4CSU3Wl.lottie"
        loop
        autoplay
        style={{ width: 180, height: 180, margin: "0 auto" }}
      />

      <h1 className="text-success mt-3">Order Placed Successfully!</h1>
      <p className="mt-3 text-muted">
        Thank you for your purchase. Your order <strong>#{orderId}</strong> has been confirmed and will be delivered soon.
      </p>

 //     <button className="btn 
 // btn-success mt-4"
 //onClick={generatePDF}>
     //   Download Invoice (PDF)
    //  </button>

      <button className="btn btn-outline-primary ms-3 mt-4" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default OrderSuccess;
