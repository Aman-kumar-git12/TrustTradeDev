import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (saleDetails) => {
    const doc = new jsPDF();

    // Company Logo/Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185); // Blue color
    doc.text('TrustTrade', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Premium Digital Marketplace', 14, 25);

    // Invoice Title
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('INVOICE', 160, 20);

    // Invoice Info
    doc.setFontSize(10);
    doc.text(`Invoice No: INV-${saleDetails.saleId?.slice(-6).toUpperCase() || Date.now()}`, 140, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 35);
    doc.text(`Status: ${saleDetails.status?.toUpperCase()}`, 140, 40);

    // Bill To
    doc.line(14, 45, 196, 45); // Horizontal line
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Bill To:', 14, 55);
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Name: ${saleDetails.buyerName}`, 14, 62);
    doc.text(`Email: ${saleDetails.buyerEmail}`, 14, 67);
    doc.text(`Phone: ${saleDetails.buyerPhone}`, 14, 72);

    // Asset Details Table
    autoTable(doc, {
        startY: 85,
        head: [['Item Description', 'Quantity', 'Unit Price', 'Total']],
        body: [
            [
                saleDetails.assetTitle,
                saleDetails.quantity,
                `Rs ${saleDetails.unitPrice?.toLocaleString()}`,
                `Rs ${saleDetails.totalAmount?.toLocaleString()}`
            ]
        ],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 5 },
    });

    // Total Calculation Section
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal:`, 135, finalY);
    doc.text(`Rs ${saleDetails.totalAmount?.toLocaleString()}`, 196, finalY, { align: 'right' });

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Paid:`, 135, finalY + 10);
    doc.text(`Rs ${saleDetails.totalAmount?.toLocaleString()}`, 196, finalY + 10, { align: 'right' });


    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(150);
    doc.text('Thank you for your business!', 105, 280, { align: 'center' });
    doc.text('TrustTrade - Secure Digital Transactions', 105, 285, { align: 'center' });

    // Save
    doc.save(`Invoice_${saleDetails.assetTitle.replace(/\s+/g, '_')}_${saleDetails.saleId?.slice(-6)}.pdf`);
};
