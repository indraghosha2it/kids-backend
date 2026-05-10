



// // src/utils/pdfGenerator.js
// const PDFDocument = require('pdfkit');
// const axios = require('axios');

// // Helper function to format currency
// const formatPrice = (price) => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     minimumFractionDigits: 2
//   }).format(price || 0);
// };

// // Helper function to format date
// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric'
//   });
// };

// // Helper function to get company initials
// const getCompanyInitials = (companyName) => {
//   if (!companyName) return 'AC';
//   return companyName
//     .split(' ')
//     .map(word => word[0])
//     .join('')
//     .toUpperCase()
//     .substring(0, 2);
// };

// // Function to fetch image as buffer
// const fetchImageAsBuffer = async (imageUrl) => {
//   try {
//     if (!imageUrl || imageUrl.startsWith('data:')) return null;
    
//     const response = await axios.get(imageUrl, { 
//       responseType: 'arraybuffer',
//       timeout: 5000 
//     });
    
//     return Buffer.from(response.data, 'binary');
//   } catch (error) {
//     console.error('Error fetching image:', error.message);
//     return null;
//   }
// };

// // Function to draw a color circle
// const drawColorCircle = (doc, x, y, colorCode) => {
//   doc.save();
  
//   try {
//     doc.fillColor(colorCode)
//        .circle(x, y, 3)
//        .fill();
    
//     doc.strokeColor('#888888')
//        .lineWidth(0.3)
//        .circle(x, y, 3)
//        .stroke();
//   } catch (error) {
//     console.error('Error drawing color circle:', error);
//     doc.fillColor('#CCCCCC')
//        .circle(x, y, 3)
//        .fill()
//        .stroke();
//   }
  
//   doc.restore();
// };

// /**
//  * Generate Invoice PDF
//  */
// const generateInvoicePDF = async (invoice) => {
//   console.log('📄 Starting PDF generation for invoice:', invoice?.invoiceNumber);
  
//   return new Promise(async (resolve, reject) => {
//     try {
//       // Load company logo if available
//       let companyLogoBuffer = null;
//       if (invoice.company?.logo) {
//         try {
//           companyLogoBuffer = await fetchImageAsBuffer(invoice.company.logo);
//         } catch (error) {
//           console.error('Failed to load company logo:', error);
//         }
//       }

//       // Create a PDF document
//       const doc = new PDFDocument({ 
//         margin: 40,
//         size: 'A4'
//       });
      
//       const chunks = [];
      
//       doc.on('data', chunk => chunks.push(chunk));
//       doc.on('end', () => {
//         const pdfBuffer = Buffer.concat(chunks);
//         console.log('📄 PDF generated, size:', pdfBuffer.length);
//         resolve(pdfBuffer);
//       });
//       doc.on('error', reject);

//       // ==================== HEADER WITH LOGO AND COMPANY INFO ====================
//       const logoSize = 55;
//       const logoX = 40;
//       const logoY = 35;
      
//       if (companyLogoBuffer) {
//         try {
//           doc.image(companyLogoBuffer, logoX, logoY, { 
//             width: logoSize, 
//             height: logoSize,
//             fit: [logoSize, logoSize],
//             align: 'center',
//             valign: 'center'
//           });
//         } catch (error) {
//           const companyName = invoice.company?.companyName || 'Asian Clothify';
//           const initials = getCompanyInitials(companyName);
          
//           doc.fillColor('#E39A65')
//              .rect(logoX, logoY, logoSize, logoSize)
//              .fill();
          
//           doc.fillColor('#FFFFFF')
//              .fontSize(14)
//              .font('Helvetica-Bold')
//              .text(initials, logoX + logoSize/2 - 8, logoY + logoSize/2 - 7);
//         }
//       } else {
//         const companyName = invoice.company?.companyName || 'Asian Clothify';
//         const initials = getCompanyInitials(companyName);
        
//         doc.fillColor('#E39A65')
//            .rect(logoX, logoY, logoSize, logoSize)
//            .fill();
        
//         doc.fillColor('#FFFFFF')
//            .fontSize(14)
//            .font('Helvetica-Bold')
//            .text(initials, logoX + logoSize/2 - 8, logoY + logoSize/2 - 7);
//       }

//       const companyX = logoX + logoSize + 15;
      
//       doc.fillColor('#333333')
//          .fontSize(14)
//          .font('Helvetica-Bold')
//          .text(invoice.company?.companyName || 'Asian Clothify', companyX, logoY);
      
//       doc.fontSize(8.5)
//          .font('Helvetica')
//          .fillColor('#666666');
      
//       if (invoice.company?.contactPerson) {
//         doc.font('Helvetica-Bold')
//            .text('Contact: ', companyX, logoY + 20, { continued: true })
//            .font('Helvetica')
//            .fillColor('#666666')
//            .text(invoice.company.contactPerson);
//       }
      
//       doc.fillColor('#666666')
//          .text(invoice.company?.email || 'info@asianclothify.com', companyX, logoY + 32);
      
//       doc.text(invoice.company?.phone || '+8801305-785685', companyX, logoY + 44);
      
//       if (invoice.company?.address) {
//         doc.text(invoice.company.address, companyX, logoY + 56, { width: 220 });
//       }

//       doc.fillColor('#E39A65')
//          .fontSize(8)
//          .font('Helvetica-Bold')
//          .text(`Invoice No: ${invoice.invoiceNumber || 'N/A'}`, 450, 40, { align: 'right' });
      
//       doc.fillColor('#333333')
//          .fontSize(8)
//          .font('Helvetica')
//          .text(`Date: ${formatDate(invoice.invoiceDate)}`, 450, 52, { align: 'right' })
//          .text(`Due Date: ${formatDate(invoice.dueDate)}`, 450, 64, { align: 'right' })
//          .text(`Status: ${invoice.paymentStatus?.toUpperCase() || 'UNPAID'}`, 450, 76, { align: 'right' });

//       // ==================== CUSTOMER INFO & ADDRESS SECTION ====================
//       const billingAddress = [
//         invoice.customer?.billingAddress,
//         invoice.customer?.billingCity,
//         invoice.customer?.billingZipCode,
//         invoice.customer?.billingCountry
//       ].filter(Boolean).join(', ');
      
//       const shippingAddress = [
//         invoice.customer?.shippingAddress,
//         invoice.customer?.shippingCity,
//         invoice.customer?.shippingZipCode,
//         invoice.customer?.shippingCountry
//       ].filter(Boolean).join(', ');
      
//       const infoBoxX = 40;
//       const infoBoxY = 115;
//       const infoBoxWidth = 520;
//       const infoBoxHeight = 105;
      
//       doc.fillColor('#F9F9FC')
//          .rect(infoBoxX, infoBoxY, infoBoxWidth, infoBoxHeight)
//          .fill();
      
//       const separatorX = infoBoxX + 260;
//       doc.strokeColor('#DDDDDD')
//          .lineWidth(0.5)
//          .moveTo(separatorX, infoBoxY + 8)
//          .lineTo(separatorX, infoBoxY + infoBoxHeight - 8)
//          .stroke();
      
//       // LEFT COLUMN: CUSTOMER INFO
//       const customerX = infoBoxX + 15;
//       let customerY = infoBoxY + 12;
      
//       doc.fillColor('#E39A65')
//          .fontSize(9)
//          .font('Helvetica-Bold')
//          .text('CUSTOMER INFO', customerX, customerY);
      
//       customerY += 16;
      
//       doc.fontSize(8.5)
//          .font('Helvetica')
//          .fillColor('#333333');
      
//       doc.font('Helvetica-Bold')
//          .text('Company: ', customerX, customerY, { continued: true })
//          .font('Helvetica')
//          .text(invoice.customer?.companyName || 'N/A');
//       customerY += 12;
      
//       doc.font('Helvetica-Bold')
//          .text('Customer Name: ', customerX, customerY, { continued: true })
//          .font('Helvetica')
//          .text(invoice.customer?.contactPerson || 'N/A');
//       customerY += 12;
      
//       doc.font('Helvetica-Bold')
//          .text('Phone: ', customerX, customerY, { continued: true })
//          .font('Helvetica')
//          .text(invoice.customer?.phone || 'N/A');
//       customerY += 12;
      
//       doc.font('Helvetica-Bold')
//          .text('Email: ', customerX, customerY, { continued: true })
//          .font('Helvetica')
//          .text(invoice.customer?.email || 'N/A');
      
//       // RIGHT COLUMN: ADDRESS
//       const addressX = separatorX + 15;
//       let addressY = infoBoxY + 12;
      
//       doc.fillColor('#E39A65')
//          .fontSize(9)
//          .font('Helvetica-Bold')
//          .text('ADDRESS', addressX, addressY);
      
//       addressY += 16;
      
//       doc.fontSize(8.5)
//          .font('Helvetica')
//          .fillColor('#333333');
      
//       doc.font('Helvetica-Bold')
//          .fillColor('#555555')
//          .text('Billing Address:', addressX, addressY);
      
//       addressY += 12;
//       const billingAddressText = billingAddress || 'No billing address provided';
//       doc.font('Helvetica')
//          .fillColor('#333333')
//          .text(billingAddressText, addressX, addressY, { width: 230 });
      
//       addressY += doc.heightOfString(billingAddressText, { width: 230, fontSize: 8.5 }) + 8;
      
//       doc.font('Helvetica-Bold')
//          .fillColor('#555555')
//          .text('Shipping Address:', addressX, addressY);
      
//       addressY += 12;
      
//       if (shippingAddress && billingAddress && shippingAddress === billingAddress) {
//         doc.font('Helvetica')
//            .fillColor('#333333')
//            .text('Same as billing address', addressX, addressY, { width: 230 });
//       } else if (shippingAddress) {
//         doc.font('Helvetica')
//            .fillColor('#333333')
//            .text(shippingAddress, addressX, addressY, { width: 230 });
//       } else {
//         doc.font('Helvetica')
//            .fillColor('#333333')
//            .text('No shipping address provided', addressX, addressY, { width: 230 });
//       }
      
//       let yPos = infoBoxY + infoBoxHeight + 15;

//       // ==================== ITEMS TABLE WITH PER-COLOR PRICING ====================
//       // Table Header
//       doc.fillColor('#E39A65')
//          .rect(40, yPos - 5, 520, 16)
//          .fill();

//       doc.fillColor('#FFFFFF')
//          .fontSize(9)
//          .font('Helvetica-Bold')
//          .text('Product', 45, yPos, { width: 90 })
//          .text('Color', 145, yPos, { width: 55 })
//          .text('Sizes (Size:Qty)', 210, yPos, { width: 185 })
//          .text('Unit Price', 405, yPos, { width: 50, align: 'right' })
//          .text('Total', 460, yPos, { width: 50, align: 'right' });

//       yPos += 20;

//       if (invoice.items && invoice.items.length > 0) {
//         for (const item of invoice.items) {
//           if (item.colors && item.colors.length > 0) {
//             // Prepare all color rows with their size lines and per-color pricing
//             const colorRows = [];
            
//             for (const color of item.colors) {
//               const activeSizes = color.sizeQuantities?.filter(sq => sq.quantity > 0) || [];
              
//               // Get the per-color unit price (use color.unitPrice, fallback to item.unitPrice)
//               const colorUnitPrice = color.unitPrice || item.unitPrice || 0;
              
//               // Format sizes - try to keep on one line with smaller font
//               let sizesText = '';
//               let currentLine = '';
//               const maxWidth = 180;
//               const fontSize = 6.5;
              
//               activeSizes.forEach((sq, index) => {
//                 const sizeText = `${sq.size}:${sq.quantity}`;
//                 const testLine = currentLine ? `${currentLine}, ${sizeText}` : sizeText;
//                 const testWidth = doc.widthOfString(testLine, { fontSize: fontSize });
                
//                 if (testWidth <= maxWidth) {
//                   currentLine = testLine;
//                 } else {
//                   if (currentLine) {
//                     sizesText += (sizesText ? '\n' : '') + currentLine;
//                   }
//                   currentLine = sizeText;
//                 }
                
//                 if (index === activeSizes.length - 1 && currentLine) {
//                   sizesText += (sizesText ? '\n' : '') + currentLine;
//                 }
//               });
              
//               const sizeLines = sizesText ? sizesText.split('\n') : ['-'];
//               const rowHeight = Math.max(18, sizeLines.length * 10);
              
//               const colorQty = color.totalForColor || 0;
//               // Use per-color unit price for total calculation
//               const colorTotal = colorQty * colorUnitPrice;
              
//               colorRows.push({
//                 color: color,
//                 sizeLines: sizeLines,
//                 rowHeight: rowHeight,
//                 colorQty: colorQty,
//                 colorUnitPrice: colorUnitPrice,
//                 colorTotal: colorTotal,
//                 fontSize: fontSize
//               });
//             }
            
//             // Check page break
//             const totalHeight = colorRows.reduce((sum, row) => sum + row.rowHeight, 0);
//             if (yPos + totalHeight > 750) {
//               doc.addPage();
//               yPos = 40;
              
//               doc.fillColor('#E39A65')
//                  .rect(40, yPos - 5, 520, 16)
//                  .fill();
              
//               doc.fillColor('#FFFFFF')
//                  .fontSize(9)
//                  .font('Helvetica-Bold')
//                  .text('Product', 45, yPos, { width: 90 })
//                  .text('Color', 145, yPos, { width: 55 })
//                  .text('Sizes (Size:Qty)', 210, yPos, { width: 185 })
//                  .text('Unit Price', 405, yPos, { width: 50, align: 'right' })
//                  .text('Total', 460, yPos, { width: 50, align: 'right' });
              
//               yPos += 20;
//             }
            
//             // Render all colors
//             for (let i = 0; i < colorRows.length; i++) {
//               const row = colorRows[i];
//               const isFirstColor = (i === 0);
//               const rowStartY = yPos;
              
//               // Draw background
//               if (i % 2 === 0) {
//                 doc.fillColor('#F9F9F9')
//                    .rect(40, rowStartY - 1, 520, row.rowHeight + 2)
//                    .fill();
//               }
              
//               // Draw separator between different colors
//               if (i > 0) {
//                 doc.strokeColor('#E0E0E0')
//                    .lineWidth(0.3)
//                    .moveTo(40, rowStartY - 1)
//                    .lineTo(560, rowStartY - 1)
//                    .stroke();
//               }
              
//               // PRODUCT NAME (only first color)
//               if (isFirstColor) {
//                 doc.fillColor('#333333')
//                    .fontSize(8)
//                    .font('Helvetica-Bold');
                
//                 let productName = item.productName || 'Product';
//                 while (doc.widthOfString(productName, { fontSize: 8, font: 'Helvetica-Bold' }) > 85 && productName.length > 3) {
//                   productName = productName.substring(0, productName.length - 1);
//                 }
//                 if (productName !== (item.productName || 'Product')) {
//                   productName = productName.substring(0, productName.length - 3) + '...';
//                 }
                
//                 doc.text(productName, 45, rowStartY + 4);
//               }
              
//               // COLOR with circle
//               const colorCode = row.color.color?.code || '#CCCCCC';
//               const circleY = rowStartY + (row.rowHeight / 2);
//               drawColorCircle(doc, 158, circleY, colorCode);
              
//               let colorName = row.color.color?.name || row.color.color?.code || 'Color';
//               if (colorName.startsWith('#')) colorName = 'Color';
//               if (colorName.length > 10) colorName = colorName.substring(0, 8) + '...';
              
//               doc.fillColor('#333333')
//                  .fontSize(7.5)
//                  .font('Helvetica')
//                  .text(colorName, 168, circleY - 3);
              
//               // SIZES
//               let currentSizeY = rowStartY + (row.rowHeight / 2) - ((row.sizeLines.length * 10) / 2);
              
//               row.sizeLines.forEach((line, idx) => {
//                 doc.fontSize(row.fontSize)
//                    .fillColor('#555555')
//                    .text(line, 210, currentSizeY + (idx * 10), { width: 180 });
//               });
              
//               const valueY = rowStartY + (row.rowHeight / 2) - 3;
              
//               // UNIT PRICE (per-color)
//               doc.fontSize(8)
//                  .fillColor('#333333')
//                  .text(formatPrice(row.colorUnitPrice).replace('$', ''), 405, valueY, { width: 50, align: 'right' });
              
//               // TOTAL
//               doc.text(formatPrice(row.colorTotal).replace('$', ''), 460, valueY, { width: 50, align: 'right' });
              
//               // Move to next row
//               yPos += row.rowHeight;
//             }
            
//             // Separator between products
//             yPos += 5;
//             doc.strokeColor('#CCCCCC')
//                .lineWidth(0.5)
//                .moveTo(40, yPos - 3)
//                .lineTo(560, yPos - 3)
//                .stroke();
            
//           } else {
//             // Simple product (no colors) - use product-level pricing
//             const rowHeight = 18;
            
//             if (yPos + rowHeight > 750) {
//               doc.addPage();
//               yPos = 40;
              
//               doc.fillColor('#E39A65')
//                  .rect(40, yPos - 5, 520, 16)
//                  .fill();
              
//               doc.fillColor('#FFFFFF')
//                  .fontSize(9)
//                  .font('Helvetica-Bold')
//                  .text('Product', 45, yPos, { width: 90 })
//                  .text('Color', 145, yPos, { width: 55 })
//                  .text('Sizes (Size:Qty)', 210, yPos, { width: 185 })
//                  .text('Unit Price', 405, yPos, { width: 50, align: 'right' })
//                  .text('Total', 460, yPos, { width: 50, align: 'right' });
              
//               yPos += 20;
//             }
            
//             if ((Math.floor(yPos / 18)) % 2 === 0) {
//               doc.fillColor('#F9F9F9')
//                  .rect(40, yPos - 1, 520, rowHeight + 2)
//                  .fill();
//             }
            
//             let productName = item.productName || 'Product';
//             while (doc.widthOfString(productName, { fontSize: 8, font: 'Helvetica' }) > 85 && productName.length > 3) {
//               productName = productName.substring(0, productName.length - 1);
//             }
//             if (productName !== (item.productName || 'Product')) {
//               productName = productName.substring(0, productName.length - 3) + '...';
//             }
            
//             doc.fillColor('#333333')
//                .fontSize(8)
//                .font('Helvetica')
//                .text(productName, 45, yPos + 2)
//                .text('-', 158, yPos + 2)
//                .text('-', 210, yPos + 2)
//                .text(formatPrice(item.unitPrice).replace('$', ''), 405, yPos + 2, { width: 50, align: 'right' })
//                .text(formatPrice(item.total || 0).replace('$', ''), 460, yPos + 2, { width: 50, align: 'right' });
            
//             yPos += rowHeight;
//             yPos += 5;
            
//             doc.strokeColor('#CCCCCC')
//                .lineWidth(0.5)
//                .moveTo(40, yPos - 3)
//                .lineTo(560, yPos - 3)
//                .stroke();
//           }
//         }
//       }

//       // ==================== SUMMARY SECTION ====================
//       yPos += 20;

//       const subtotal = Number(invoice.subtotal || 0).toFixed(2);
//       const vatAmount = Number(invoice.vatAmount || 0).toFixed(2);
//       const discountAmount = Number(invoice.discountAmount || 0).toFixed(2);
//       const shippingCost = Number(invoice.shippingCost || 0).toFixed(2);
//       const finalTotal = Number(invoice.finalTotal || 0).toFixed(2);
//       const amountPaid = Number(invoice.amountPaid || 0).toFixed(2);
//       const dueAmount = Number(invoice.dueAmount || 0).toFixed(2);

//       const paidPercent = finalTotal > 0 ? ((amountPaid / finalTotal) * 100).toFixed(1) : '0';
//       const duePercent = finalTotal > 0 ? ((dueAmount / finalTotal) * 100).toFixed(1) : '0';

//       // Calculate how many lines we'll have
//       let lineCount = 2; // Subtotal + Total
//       if (invoice.vatPercentage > 0) lineCount++;
//       if (invoice.discountPercentage > 0) lineCount++;
//       if (parseFloat(shippingCost) > 0) lineCount++;
//       lineCount += 3; // Line + Paid + Due

//       const lineHeight = 10;
//       const boxHeight = (lineCount * lineHeight) + 10;

//       // Summary box
//       const summaryBoxX = 250;
//       const summaryBoxY = yPos - 8;
//       const summaryBoxWidth = 270;
//       const summaryBoxHeight = boxHeight;

//       doc.fillColor('#F5F5F5')
//          .rect(summaryBoxX, summaryBoxY, summaryBoxWidth, summaryBoxHeight)
//          .fill();

//       let summaryY = yPos;
//       const col1X = summaryBoxX + 10;
//       const col2X = summaryBoxX + 175;

//       doc.fillColor('#333333')
//          .fontSize(8.5)
//          .font('Helvetica');

//       const formatPriceShort = (price) => {
//         const num = parseFloat(price);
//         return '$' + num.toFixed(2);
//       };

//       // Subtotal
//       doc.text('Subtotal:', col1X, summaryY);
//       doc.text(formatPriceShort(subtotal), col2X, summaryY);
//       summaryY += lineHeight;

//       // VAT
//       if (invoice.vatPercentage > 0) {
//         doc.text(`VAT (${invoice.vatPercentage}%):`, col1X, summaryY);
//         doc.text(formatPriceShort(vatAmount), col2X, summaryY);
//         summaryY += lineHeight;
//       }

//       // Discount
//       if (invoice.discountPercentage > 0) {
//         doc.text(`Discount (${invoice.discountPercentage}%):`, col1X, summaryY);
//         doc.text(`-${formatPriceShort(discountAmount)}`, col2X, summaryY);
//         summaryY += lineHeight;
//       }

//       // Shipping
//       if (parseFloat(shippingCost) > 0) {
//         doc.text('Shipping:', col1X, summaryY);
//         doc.text(formatPriceShort(shippingCost), col2X, summaryY);
//         summaryY += lineHeight;
//       }

//       // Line
//       doc.strokeColor('#CCCCCC')
//          .lineWidth(0.5)
//          .moveTo(col1X, summaryY - 2)
//          .lineTo(summaryBoxX + summaryBoxWidth - 15, summaryY - 2)
//          .stroke();
//       summaryY += 4;

//       // Total
//       doc.font('Helvetica-Bold')
//          .fontSize(9.5)
//          .text('TOTAL:', col1X, summaryY);
//       doc.text(formatPriceShort(finalTotal), col2X, summaryY);
//       summaryY += 12;

//       // Paid
//       doc.font('Helvetica')
//          .fontSize(7.5);
//       doc.fillColor('#22c55e')
//          .text('Paid:', col1X, summaryY);
//       doc.text(`${formatPriceShort(amountPaid)} (${paidPercent}%)`, col2X, summaryY);
//       summaryY += 9;

//       // Due
//       doc.fillColor(parseFloat(dueAmount) > 0 ? '#ef4444' : '#22c55e')
//          .text('Due:', col1X, summaryY);
//       doc.text(`${formatPriceShort(dueAmount)} (${duePercent}%)`, col2X, summaryY);

//       doc.fillColor('#333333');

//       // ==================== BANK DETAILS (LEFT) & BANKING TERMS (RIGHT) ====================
//       let bankingStartY = summaryBoxY + summaryBoxHeight + 15;
      
//       const hasBankDetails = invoice.bankDetails && Object.values(invoice.bankDetails).some(v => v && v.toString().trim());
//       const hasBankingTerms = invoice.bankingTerms && invoice.bankingTerms.length > 0 && 
//                               invoice.bankingTerms.some(term => term.title?.trim() || term.value?.trim());
      
//       if (hasBankDetails || hasBankingTerms) {
//         const bankingBoxX = 40;
//         const bankingBoxY = bankingStartY;
//         const bankingBoxWidth = 520;
        
//         let leftColumnHeight = 25;
//         let rightColumnHeight = 25;
        
//         if (hasBankDetails) {
//           const bankDetails = invoice.bankDetails;
//           let lineCount = 0;
//           if (bankDetails.bankName && bankDetails.bankName.toString().trim()) lineCount++;
//           if (bankDetails.accountName && bankDetails.accountName.toString().trim()) lineCount++;
//           if (bankDetails.accountNumber && bankDetails.accountNumber.toString().trim()) lineCount++;
//           if (bankDetails.accountType && bankDetails.accountType.toString().trim()) lineCount++;
//           if (bankDetails.routingNumber && bankDetails.routingNumber.toString().trim()) lineCount++;
//           if (bankDetails.swiftCode && bankDetails.swiftCode.toString().trim()) lineCount++;
//           if (bankDetails.iban && bankDetails.iban.toString().trim()) lineCount++;
//           if (bankDetails.bankAddress && bankDetails.bankAddress.toString().trim()) lineCount++;
//           leftColumnHeight = Math.max(leftColumnHeight, (lineCount * 14) + 20);
//         }
        
//         if (hasBankingTerms) {
//           const validTerms = invoice.bankingTerms.filter(term => term.title?.trim() || term.value?.trim());
//           let totalHeight = 0;
          
//           const measureTextHeight = (text, width, fontSize = 7.5) => {
//             const charsPerLine = Math.floor(width / 4.5);
//             const lines = Math.ceil(text.length / charsPerLine);
//             return lines * 12;
//           };
          
//           validTerms.forEach(term => {
//             if (term.title && term.value) {
//               const titleText = `${term.title}: `;
//               const fullText = titleText + term.value;
//               const textHeight = measureTextHeight(fullText, 230, 7.5);
//               totalHeight += Math.max(textHeight, 14);
//             } else if (term.title) {
//               const textHeight = measureTextHeight(term.title, 230, 7.5);
//               totalHeight += Math.max(textHeight, 14);
//             } else if (term.value) {
//               const textHeight = measureTextHeight(term.value, 230, 7.5);
//               totalHeight += Math.max(textHeight, 14);
//             }
//           });
          
//           rightColumnHeight = Math.max(rightColumnHeight, totalHeight + 20);
//         }
        
//         const boxHeight = Math.max(leftColumnHeight, rightColumnHeight, 60) + 15;
        
//         doc.fillColor('#F9F9FC')
//            .rect(bankingBoxX, bankingBoxY, bankingBoxWidth, boxHeight)
//            .fill();
        
//         doc.strokeColor('#E39A65')
//            .lineWidth(0.8)
//            .rect(bankingBoxX, bankingBoxY, bankingBoxWidth, boxHeight)
//            .stroke();
        
//         const bankSeparatorX = bankingBoxX + 260;
//         doc.strokeColor('#DDDDDD')
//            .lineWidth(0.5)
//            .moveTo(bankSeparatorX, bankingBoxY + 8)
//            .lineTo(bankSeparatorX, bankingBoxY + boxHeight - 8)
//            .stroke();
        
//         // LEFT COLUMN: BANK DETAILS
//         // const leftX = bankingBoxX + 15;
//         // let leftY = bankingBoxY + 12;
        
//         // doc.fillColor('#E39A65')
//         //    .fontSize(9)
//         //    .font('Helvetica-Bold')
//         //    .text('BANK DETAILS', leftX, leftY);
        
//         // leftY += 16;
        
//         // if (hasBankDetails) {
//         //   doc.fontSize(7.5)
//         //      .font('Helvetica')
//         //      .fillColor('#333333');
          
//         //   const bankDetails = invoice.bankDetails;
          
//         //   const drawBankLine = (label, value, y) => {
//         //     if (value && value.toString().trim()) {
//         //       const labelText = `${label}: `;
//         //       const fullText = labelText + value.toString();
//         //       const textWidth = doc.widthOfString(fullText, { fontSize: 7.5 });
              
//         //       if (textWidth <= 230) {
//         //         doc.font('Helvetica-Bold')
//         //            .text(labelText, leftX, y, { continued: true })
//         //            .font('Helvetica')
//         //            .text(value.toString());
//         //         return 12;
//         //       } else {
//         //         doc.font('Helvetica-Bold')
//         //            .text(labelText, leftX, y, { continued: true })
//         //            .font('Helvetica')
//         //            .text(value.toString(), { width: 230 });
//         //         return doc.heightOfString(fullText, { width: 230 }) + 4;
//         //       }
//         //     }
//         //     return 0;
//         //   };
          
//         //   if (bankDetails.bankName && bankDetails.bankName.toString().trim()) {
//         //     const height = drawBankLine('Bank Name', bankDetails.bankName, leftY);
//         //     leftY += height;
//         //   }
//         //   if (bankDetails.accountName && bankDetails.accountName.toString().trim()) {
//         //     const height = drawBankLine('Account Name', bankDetails.accountName, leftY);
//         //     leftY += height;
//         //   }
//         //   if (bankDetails.accountNumber && bankDetails.accountNumber.toString().trim()) {
//         //     const height = drawBankLine('Account Number', bankDetails.accountNumber, leftY);
//         //     leftY += height;
//         //   }
//         //   if (bankDetails.accountType && bankDetails.accountType.toString().trim()) {
//         //     const height = drawBankLine('Account Type', bankDetails.accountType, leftY);
//         //     leftY += height;
//         //   }
//         //   if (bankDetails.routingNumber && bankDetails.routingNumber.toString().trim()) {
//         //     const height = drawBankLine('Routing Number', bankDetails.routingNumber, leftY);
//         //     leftY += height;
//         //   }
//         //   if (bankDetails.swiftCode && bankDetails.swiftCode.toString().trim()) {
//         //     const height = drawBankLine('SWIFT Code', bankDetails.swiftCode, leftY);
//         //     leftY += height;
//         //   }
//         //   if (bankDetails.iban && bankDetails.iban.toString().trim()) {
//         //     const height = drawBankLine('IBAN', bankDetails.iban, leftY);
//         //     leftY += height;
//         //   }
//         //   if (bankDetails.bankAddress && bankDetails.bankAddress.toString().trim()) {
//         //     const height = drawBankLine('Bank Address', bankDetails.bankAddress, leftY);
//         //     leftY += height;
//         //   }
//         // } else {
//         //   doc.fillColor('#999999')
//         //      .fontSize(7.5)
//         //      .font('Helvetica')
//         //      .text('No bank details provided', leftX, leftY);
//         // }


//                 // LEFT COLUMN: BANK DETAILS
//         const leftX = bankingBoxX + 15;
//         let leftY = bankingBoxY + 12;
        
//         doc.fillColor('#E39A65')
//            .fontSize(9)
//            .font('Helvetica-Bold')
//            .text('BANK DETAILS', leftX, leftY);
        
//         leftY += 16;
        
//         if (hasBankDetails) {
//           doc.fontSize(7.5)
//              .font('Helvetica')
//              .fillColor('#333333');
          
//           const bankDetails = invoice.bankDetails;
          
//           const drawBankLine = (label, value, y) => {
//             if (value && value.toString().trim()) {
//               const labelText = `${label}: `;
//               const maxWidth = 220; // Maximum width for the text
              
//               // Draw the label first
//               doc.font('Helvetica-Bold')
//                  .text(labelText, leftX, y, { continued: true });
              
//               const valueStr = value.toString();
//               const labelWidth = doc.widthOfString(labelText, { fontSize: 7.5, font: 'Helvetica-Bold' });
//               const availableWidth = maxWidth - labelWidth;
              
//               // Calculate remaining space on current line
//               const currentX = doc.x; // Get current X position after label
//               const remainingWidth = maxWidth - (currentX - leftX);
              
//               const valueWidth = doc.widthOfString(valueStr, { fontSize: 7.5, font: 'Helvetica' });
              
//               if (valueWidth <= remainingWidth) {
//                 // Value fits on same line
//                 doc.font('Helvetica')
//                    .text(valueStr);
//                 return 12;
//               } else {
//                 // Value doesn't fit - finish current line, then wrap
//                 doc.font('Helvetica')
//                    .text(''); // End the current line
                
//                 // Draw the value on next line(s) with indentation
//                 const indentX = leftX + 5; // Small indent for wrapped lines
//                 doc.font('Helvetica')
//                    .text(valueStr, indentX, y + 10, { width: maxWidth - 5 });
                
//                 // Calculate height of wrapped text
//                 const textHeight = doc.heightOfString(valueStr, { width: maxWidth - 5, fontSize: 7.5 });
//                 return 12 + textHeight;
//               }
//             }
//             return 0;
//           };
          
//           if (bankDetails.bankName && bankDetails.bankName.toString().trim()) {
//             const height = drawBankLine('Bank Name', bankDetails.bankName, leftY);
//             leftY += height;
//           }
//           if (bankDetails.accountName && bankDetails.accountName.toString().trim()) {
//             const height = drawBankLine('Account Name', bankDetails.accountName, leftY);
//             leftY += height;
//           }
//           if (bankDetails.accountNumber && bankDetails.accountNumber.toString().trim()) {
//             const height = drawBankLine('Account Number', bankDetails.accountNumber, leftY);
//             leftY += height;
//           }
//           if (bankDetails.accountType && bankDetails.accountType.toString().trim()) {
//             const height = drawBankLine('Account Type', bankDetails.accountType, leftY);
//             leftY += height;
//           }
//           if (bankDetails.routingNumber && bankDetails.routingNumber.toString().trim()) {
//             const height = drawBankLine('Routing Number', bankDetails.routingNumber, leftY);
//             leftY += height;
//           }
//           if (bankDetails.swiftCode && bankDetails.swiftCode.toString().trim()) {
//             const height = drawBankLine('SWIFT Code', bankDetails.swiftCode, leftY);
//             leftY += height;
//           }
//           if (bankDetails.iban && bankDetails.iban.toString().trim()) {
//             const height = drawBankLine('IBAN', bankDetails.iban, leftY);
//             leftY += height;
//           }
//           if (bankDetails.bankAddress && bankDetails.bankAddress.toString().trim()) {
//             const height = drawBankLine('Bank Address', bankDetails.bankAddress, leftY);
//             leftY += height;
//           }
//         } else {
//           doc.fillColor('#999999')
//              .fontSize(7.5)
//              .font('Helvetica')
//              .text('No bank details provided', leftX, leftY);
//         }
        
//         // RIGHT COLUMN: BANKING TERMS
//         const rightX = bankSeparatorX + 15;
//         let rightY = bankingBoxY + 12;
        
//         doc.fillColor('#E39A65')
//            .fontSize(9)
//            .font('Helvetica-Bold')
//            .text('BANKING TERMS', rightX, rightY);
        
//         rightY += 16;
        
//         if (hasBankingTerms) {
//           doc.fontSize(7.5)
//              .font('Helvetica')
//              .fillColor('#333333');
          
//           const validTerms = invoice.bankingTerms.filter(term => term.title?.trim() || term.value?.trim());
//           const regularTerms = validTerms.filter(term => term.title?.trim() && term.value?.trim());
//           const titleOnlyTerms = validTerms.filter(term => term.title?.trim() && !term.value?.trim());
//           const valueOnlyTerms = validTerms.filter(term => !term.title?.trim() && term.value?.trim());
          
//           regularTerms.forEach((term) => {
//             const titleText = `${term.title}: `;
//             const fullText = titleText + term.value;
//             const textWidth = doc.widthOfString(fullText, { fontSize: 7.5 });
            
//             if (textWidth <= 230) {
//               doc.font('Helvetica-Bold')
//                  .text(titleText, rightX, rightY, { continued: true })
//                  .font('Helvetica')
//                  .text(term.value);
//               rightY += 12;
//             } else {
//               doc.font('Helvetica-Bold')
//                  .text(titleText, rightX, rightY);
//               rightY += 10;
//               doc.font('Helvetica')
//                  .text(term.value, rightX, rightY, { width: 230 });
//               rightY += doc.heightOfString(term.value, { width: 230 }) + 4;
//             }
//           });
          
//           if (titleOnlyTerms.length > 0) {
//             if (regularTerms.length > 0) rightY += 4;
            
//             titleOnlyTerms.forEach((term) => {
//               doc.font('Helvetica-Bold')
//                  .fillColor('#E39A65')
//                  .text(term.title, rightX, rightY);
//               rightY += 10;
//               doc.fillColor('#333333');
//             });
//           }
          
//           if (valueOnlyTerms.length > 0) {
//             if (regularTerms.length > 0 || titleOnlyTerms.length > 0) rightY += 4;
            
//             valueOnlyTerms.forEach((term) => {
//               doc.font('Helvetica')
//                  .text(term.value, rightX, rightY, { width: 230 });
//               rightY += doc.heightOfString(term.value, { width: 230 }) + 4;
//             });
//           }
//         } else {
//           doc.fillColor('#999999')
//              .fontSize(7.5)
//              .font('Helvetica')
//              .text('No banking terms provided', rightX, rightY);
//         }
        
//         bankingStartY += boxHeight + 10;
//       }
      
//       // ==================== NOTES & TERMS ====================
//       let notesStartY = bankingStartY;
      
//       if (invoice.notes || invoice.terms) {
//         if (notesStartY > 720) {
//           doc.addPage();
//           notesStartY = 40;
//         }
        
//         const notesBoxX = 40;
//         const notesBoxY = notesStartY;
//         const notesBoxWidth = 520;
        
//         let notesBoxHeight = 15;
//         if (invoice.notes) notesBoxHeight += doc.heightOfString(invoice.notes, { width: 500 }) + 20;
//         if (invoice.terms) notesBoxHeight += doc.heightOfString(invoice.terms, { width: 500 }) + 20;
        
//         if (notesBoxHeight > 15) {
//           doc.fillColor('#FFF8F0')
//              .rect(notesBoxX, notesBoxY, notesBoxWidth, notesBoxHeight)
//              .fill();
          
//           doc.strokeColor('#E39A65')
//              .lineWidth(0.5)
//              .rect(notesBoxX, notesBoxY, notesBoxWidth, notesBoxHeight)
//              .stroke();
          
//           let currentNotesY = notesBoxY + 12;
          
//           if (invoice.notes) {
//             doc.fillColor('#333333')
//                .fontSize(9)
//                .font('Helvetica-Bold')
//                .text('NOTES:', notesBoxX + 10, currentNotesY);
//             currentNotesY += 12;
            
//             doc.fontSize(7.5)
//                .font('Helvetica')
//                .fillColor('#666666')
//                .text(invoice.notes, notesBoxX + 10, currentNotesY, { width: 500 });
//             currentNotesY += doc.heightOfString(invoice.notes, { width: 500 }) + 8;
//           }
          
//           if (invoice.terms) {
//             doc.fillColor('#333333')
//                .fontSize(9)
//                .font('Helvetica-Bold')
//                .text('TERMS & CONDITIONS:', notesBoxX + 10, currentNotesY);
//             currentNotesY += 12;
            
//             doc.fontSize(7.5)
//                .font('Helvetica')
//                .fillColor('#666666')
//                .text(invoice.terms, notesBoxX + 10, currentNotesY, { width: 500 });
//           }
//         }
//       }
      
//       // ==================== FOOTER ====================
//       const pageHeight = doc.page.height;
//       const footerY = pageHeight - 35;
      
//       doc.strokeColor('#E39A65')
//          .lineWidth(0.5)
//          .moveTo(40, footerY - 8)
//          .lineTo(550, footerY - 8)
//          .stroke();
      
//       console.log('📄 PDF generation complete');
//       doc.end();

//     } catch (error) {
//       console.error('❌ PDF Generation Error:', error);
//       reject(error);
//     }
//   });
// };

// module.exports = { generateInvoicePDF };


// src/utils/pdfGenerator.js
const PDFDocument = require('pdfkit');
const axios = require('axios');

// Helper function to format currency
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(price || 0);
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function to get company initials
const getCompanyInitials = (companyName) => {
  if (!companyName) return 'JC';
  return companyName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Helper function to get unit label
const getUnitLabel = (orderUnit) => {
  if (!orderUnit) return 'pcs';
  switch(orderUnit) {
    case 'kg': return 'kg';
    case 'ton': return 'MT';
    default: return 'pcs';
  }
};

// Function to fetch image as buffer
const fetchImageAsBuffer = async (imageUrl) => {
  try {
    if (!imageUrl || imageUrl.startsWith('data:')) return null;
    
    const response = await axios.get(imageUrl, { 
      responseType: 'arraybuffer',
      timeout: 5000 
    });
    
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error('Error fetching image:', error.message);
    return null;
  }
};

// Function to draw a color circle
const drawColorCircle = (doc, x, y, colorCode) => {
  doc.save();
  
  try {
    doc.fillColor(colorCode)
       .circle(x, y, 3)
       .fill();
    
    doc.strokeColor('#888888')
       .lineWidth(0.3)
       .circle(x, y, 3)
       .stroke();
  } catch (error) {
    console.error('Error drawing color circle:', error);
    doc.fillColor('#CCCCCC')
       .circle(x, y, 3)
       .fill()
       .stroke();
  }
  
  doc.restore();
};

/**
 * Generate Invoice PDF
 */
const generateInvoicePDF = async (invoice) => {
  console.log('📄 Starting PDF generation for invoice:', invoice?.invoiceNumber);
  
  return new Promise(async (resolve, reject) => {
    try {
      // Load company logo if available
      let companyLogoBuffer = null;
      if (invoice.company?.logo) {
        try {
          companyLogoBuffer = await fetchImageAsBuffer(invoice.company.logo);
        } catch (error) {
          console.error('Failed to load company logo:', error);
        }
      }

      // Create a PDF document
      const doc = new PDFDocument({ 
        margin: 40,
        size: 'A4'
      });
      
      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        console.log('📄 PDF generated, size:', pdfBuffer.length);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // ==================== HEADER WITH LOGO AND COMPANY INFO ====================
      const logoSize = 55;
      const logoX = 40;
      const logoY = 35;
      
      if (companyLogoBuffer) {
        try {
          doc.image(companyLogoBuffer, logoX, logoY, { 
            width: logoSize, 
            height: logoSize,
            fit: [logoSize, logoSize],
            align: 'center',
            valign: 'center'
          });
        } catch (error) {
          const companyName = invoice.company?.companyName || 'Jute Craftify';
          const initials = getCompanyInitials(companyName);
          
          doc.fillColor('#6B4F3A')
             .rect(logoX, logoY, logoSize, logoSize)
             .fill();
          
          doc.fillColor('#FFFFFF')
             .fontSize(14)
             .font('Helvetica-Bold')
             .text(initials, logoX + logoSize/2 - 8, logoY + logoSize/2 - 7);
        }
      } else {
        const companyName = invoice.company?.companyName || 'Jute Craftify';
        const initials = getCompanyInitials(companyName);
        
        doc.fillColor('#6B4F3A')
           .rect(logoX, logoY, logoSize, logoSize)
           .fill();
        
        doc.fillColor('#FFFFFF')
           .fontSize(14)
           .font('Helvetica-Bold')
           .text(initials, logoX + logoSize/2 - 8, logoY + logoSize/2 - 7);
      }

      const companyX = logoX + logoSize + 15;
      
      doc.fillColor('#2C2420')
         .fontSize(14)
         .font('Helvetica-Bold')
         .text(invoice.company?.companyName || 'Jute Craftify', companyX, logoY);
      
      doc.fontSize(8.5)
         .font('Helvetica')
         .fillColor('#8B7355');
      
      if (invoice.company?.contactPerson) {
        doc.font('Helvetica-Bold')
           .text('Contact: ', companyX, logoY + 20, { continued: true })
           .font('Helvetica')
           .fillColor('#8B7355')
           .text(invoice.company.contactPerson);
      }
      
      doc.fillColor('#8B7355')
         .text(invoice.company?.email || 'info@jutecraftify.com', companyX, logoY + 32);
      
      doc.text(invoice.company?.phone || '+8801305-785685', companyX, logoY + 44);
      
      if (invoice.company?.address) {
        doc.text(invoice.company.address, companyX, logoY + 56, { width: 220 });
      }

      doc.fillColor('#6B4F3A')
         .fontSize(8)
         .font('Helvetica-Bold')
         .text(`Invoice No: ${invoice.invoiceNumber || 'N/A'}`, 450, 40, { align: 'right' });
      
      doc.fillColor('#2C2420')
         .fontSize(8)
         .font('Helvetica')
         .text(`Date: ${formatDate(invoice.invoiceDate)}`, 450, 52, { align: 'right' })
         .text(`Due Date: ${formatDate(invoice.dueDate)}`, 450, 64, { align: 'right' })
         .text(`Status: ${invoice.paymentStatus?.toUpperCase() || 'UNPAID'}`, 450, 76, { align: 'right' });

      // ==================== CUSTOMER INFO & ADDRESS SECTION ====================
      const billingAddress = [
        invoice.customer?.billingAddress,
        invoice.customer?.billingCity,
        invoice.customer?.billingZipCode,
        invoice.customer?.billingCountry
      ].filter(Boolean).join(', ');
      
      const shippingAddress = [
        invoice.customer?.shippingAddress,
        invoice.customer?.shippingCity,
        invoice.customer?.shippingZipCode,
        invoice.customer?.shippingCountry
      ].filter(Boolean).join(', ');
      
      const infoBoxX = 40;
      const infoBoxY = 115;
      const infoBoxWidth = 520;
      const infoBoxHeight = 105;
      
      doc.fillColor('#FAF7F2')
         .rect(infoBoxX, infoBoxY, infoBoxWidth, infoBoxHeight)
         .fill();
      
      const separatorX = infoBoxX + 260;
      doc.strokeColor('#E5D5C0')
         .lineWidth(0.5)
         .moveTo(separatorX, infoBoxY + 8)
         .lineTo(separatorX, infoBoxY + infoBoxHeight - 8)
         .stroke();
      
      // LEFT COLUMN: CUSTOMER INFO
      const customerX = infoBoxX + 15;
      let customerY = infoBoxY + 12;
      
      doc.fillColor('#6B4F3A')
         .fontSize(9)
         .font('Helvetica-Bold')
         .text('CUSTOMER INFO', customerX, customerY);
      
      customerY += 16;
      
      doc.fontSize(8.5)
         .font('Helvetica')
         .fillColor('#2C2420');
      
      doc.font('Helvetica-Bold')
         .text('Company: ', customerX, customerY, { continued: true })
         .font('Helvetica')
         .text(invoice.customer?.companyName || 'N/A');
      customerY += 12;
      
      doc.font('Helvetica-Bold')
         .text('Customer Name: ', customerX, customerY, { continued: true })
         .font('Helvetica')
         .text(invoice.customer?.contactPerson || 'N/A');
      customerY += 12;
      
      doc.font('Helvetica-Bold')
         .text('Phone: ', customerX, customerY, { continued: true })
         .font('Helvetica')
         .text(invoice.customer?.phone || 'N/A');
      customerY += 12;
      
      doc.font('Helvetica-Bold')
         .text('Email: ', customerX, customerY, { continued: true })
         .font('Helvetica')
         .text(invoice.customer?.email || 'N/A');
      
      // RIGHT COLUMN: ADDRESS
      const addressX = separatorX + 15;
      let addressY = infoBoxY + 12;
      
      doc.fillColor('#6B4F3A')
         .fontSize(9)
         .font('Helvetica-Bold')
         .text('ADDRESS', addressX, addressY);
      
      addressY += 16;
      
      doc.fontSize(8.5)
         .font('Helvetica')
         .fillColor('#2C2420');
      
      doc.font('Helvetica-Bold')
         .fillColor('#8B7355')
         .text('Billing Address:', addressX, addressY);
      
      addressY += 12;
      const billingAddressText = billingAddress || 'No billing address provided';
      doc.font('Helvetica')
         .fillColor('#2C2420')
         .text(billingAddressText, addressX, addressY, { width: 230 });
      
      addressY += doc.heightOfString(billingAddressText, { width: 230, fontSize: 8.5 }) + 8;
      
      doc.font('Helvetica-Bold')
         .fillColor('#8B7355')
         .text('Shipping Address:', addressX, addressY);
      
      addressY += 12;
      
      if (shippingAddress && billingAddress && shippingAddress === billingAddress) {
        doc.font('Helvetica')
           .fillColor('#2C2420')
           .text('Same as billing address', addressX, addressY, { width: 230 });
      } else if (shippingAddress) {
        doc.font('Helvetica')
           .fillColor('#2C2420')
           .text(shippingAddress, addressX, addressY, { width: 230 });
      } else {
        doc.font('Helvetica')
           .fillColor('#2C2420')
           .text('No shipping address provided', addressX, addressY, { width: 230 });
      }
      
      let yPos = infoBoxY + infoBoxHeight + 15;

      // ==================== ITEMS TABLE WITH PER-COLOR PRICING ====================
      // Table Header
      doc.fillColor('#6B4F3A')
         .rect(40, yPos - 5, 520, 16)
         .fill();

      doc.fillColor('#FFFFFF')
         .fontSize(9)
         .font('Helvetica-Bold')
         .text('Product', 45, yPos, { width: 90 })
         .text('Color', 145, yPos, { width: 55 })
         .text('Sizes/Weight', 210, yPos, { width: 185 })
         .text('Unit Price', 405, yPos, { width: 50, align: 'right' })
         .text('Total', 460, yPos, { width: 50, align: 'right' });

      yPos += 20;

      if (invoice.items && invoice.items.length > 0) {
        for (const item of invoice.items) {
          const isWeightBased = item.orderUnit === 'kg' || item.orderUnit === 'ton';
          const unitLabel = getUnitLabel(item.orderUnit);
          
          if (item.colors && item.colors.length > 0) {
            // Prepare all color rows with their size lines and per-color pricing
            const colorRows = [];
            
            for (const color of item.colors) {
              const activeSizes = color.sizeQuantities?.filter(sq => sq.quantity > 0) || [];
              
              // Get the per-color unit price
              const colorUnitPrice = color.unitPrice || item.unitPrice || 0;
              
              let sizesText = '';
              if (isWeightBased) {
                const quantity = color.quantity || color.totalQuantity || color.totalForColor || 0;
                sizesText = `${quantity} ${unitLabel}`;
              } else {
                let currentLine = '';
                const maxWidth = 180;
                const fontSize = 6.5;
                
                activeSizes.forEach((sq, index) => {
                  const sizeText = `${sq.size}:${sq.quantity}`;
                  const testLine = currentLine ? `${currentLine}, ${sizeText}` : sizeText;
                  const testWidth = doc.widthOfString(testLine, { fontSize: fontSize });
                  
                  if (testWidth <= maxWidth) {
                    currentLine = testLine;
                  } else {
                    if (currentLine) {
                      sizesText += (sizesText ? '\n' : '') + currentLine;
                    }
                    currentLine = sizeText;
                  }
                  
                  if (index === activeSizes.length - 1 && currentLine) {
                    sizesText += (sizesText ? '\n' : '') + currentLine;
                  }
                });
              }
              
              const sizeLines = sizesText ? sizesText.split('\n') : ['-'];
              const rowHeight = Math.max(18, sizeLines.length * 10);
              
              const colorQty = isWeightBased 
                ? (color.quantity || color.totalQuantity || color.totalForColor || 0)
                : (color.totalForColor || 0);
              const colorTotal = colorQty * colorUnitPrice;
              
              colorRows.push({
                color: color,
                sizeLines: sizeLines,
                rowHeight: rowHeight,
                colorQty: colorQty,
                colorUnitPrice: colorUnitPrice,
                colorTotal: colorTotal,
                fontSize: 6.5,
                isWeightBased: isWeightBased,
                unitLabel: unitLabel
              });
            }
            
            // Check page break
            const totalHeight = colorRows.reduce((sum, row) => sum + row.rowHeight, 0);
            if (yPos + totalHeight > 750) {
              doc.addPage();
              yPos = 40;
              
              doc.fillColor('#6B4F3A')
                 .rect(40, yPos - 5, 520, 16)
                 .fill();
              
              doc.fillColor('#FFFFFF')
                 .fontSize(9)
                 .font('Helvetica-Bold')
                 .text('Product', 45, yPos, { width: 90 })
                 .text('Color', 145, yPos, { width: 55 })
                 .text(isWeightBased ? 'Weight' : 'Sizes (Size:Qty)', 210, yPos, { width: 185 })
                 .text('Unit Price', 405, yPos, { width: 50, align: 'right' })
                 .text('Total', 460, yPos, { width: 50, align: 'right' });
              
              yPos += 20;
            }
            
            // Render all colors
            for (let i = 0; i < colorRows.length; i++) {
              const row = colorRows[i];
              const isFirstColor = (i === 0);
              const rowStartY = yPos;
              
              // Draw background
              if (i % 2 === 0) {
                doc.fillColor('#FAF7F2')
                   .rect(40, rowStartY - 1, 520, row.rowHeight + 2)
                   .fill();
              }
              
              // Draw separator between different colors
              if (i > 0) {
                doc.strokeColor('#E5D5C0')
                   .lineWidth(0.3)
                   .moveTo(40, rowStartY - 1)
                   .lineTo(560, rowStartY - 1)
                   .stroke();
              }
              
              // PRODUCT NAME (only first color)
              if (isFirstColor) {
                doc.fillColor('#2C2420')
                   .fontSize(8)
                   .font('Helvetica-Bold');
                
                let productName = item.productName || 'Product';
                while (doc.widthOfString(productName, { fontSize: 8, font: 'Helvetica-Bold' }) > 85 && productName.length > 3) {
                  productName = productName.substring(0, productName.length - 1);
                }
                if (productName !== (item.productName || 'Product')) {
                  productName = productName.substring(0, productName.length - 3) + '...';
                }
                
                doc.text(productName, 45, rowStartY + 4);
              }
              
              // COLOR with circle
              const colorCode = row.color.color?.code || '#CCCCCC';
              const circleY = rowStartY + (row.rowHeight / 2);
              drawColorCircle(doc, 158, circleY, colorCode);
              
              let colorName = row.color.color?.name || row.color.color?.code || 'Color';
              if (colorName.startsWith('#')) colorName = 'Color';
              if (colorName.length > 10) colorName = colorName.substring(0, 8) + '...';
              
              doc.fillColor('#2C2420')
                 .fontSize(7.5)
                 .font('Helvetica')
                 .text(colorName, 168, circleY - 3);
              
              // SIZES/WEIGHT
              let currentSizeY = rowStartY + (row.rowHeight / 2) - ((row.sizeLines.length * 10) / 2);
              
              row.sizeLines.forEach((line, idx) => {
                doc.fontSize(row.fontSize)
                   .fillColor('#8B7355')
                   .text(line, 210, currentSizeY + (idx * 10), { width: 180 });
              });
              
              const valueY = rowStartY + (row.rowHeight / 2) - 3;
              
              // UNIT PRICE (per-color)
              doc.fontSize(8)
                 .fillColor('#2C2420')
                 .text(`${row.colorUnitPrice.toFixed(2)}/${unitLabel === 'pcs' ? 'pc' : unitLabel}`, 405, valueY, { width: 50, align: 'right' });
              
              // TOTAL
              doc.text(formatPrice(row.colorTotal).replace('$', ''), 460, valueY, { width: 50, align: 'right' });
              
              // Move to next row
              yPos += row.rowHeight;
            }
            
            // Separator between products
            yPos += 5;
            doc.strokeColor('#CCCCCC')
               .lineWidth(0.5)
               .moveTo(40, yPos - 3)
               .lineTo(560, yPos - 3)
               .stroke();
            
          } else {
            // Simple product (no colors)
            const rowHeight = 18;
            
            if (yPos + rowHeight > 750) {
              doc.addPage();
              yPos = 40;
              
              doc.fillColor('#6B4F3A')
                 .rect(40, yPos - 5, 520, 16)
                 .fill();
              
              doc.fillColor('#FFFFFF')
                 .fontSize(9)
                 .font('Helvetica-Bold')
                 .text('Product', 45, yPos, { width: 90 })
                 .text('Color', 145, yPos, { width: 55 })
                 .text(isWeightBased ? 'Weight' : 'Sizes (Size:Qty)', 210, yPos, { width: 185 })
                 .text('Unit Price', 405, yPos, { width: 50, align: 'right' })
                 .text('Total', 460, yPos, { width: 50, align: 'right' });
              
              yPos += 20;
            }
            
            if ((Math.floor(yPos / 18)) % 2 === 0) {
              doc.fillColor('#FAF7F2')
                 .rect(40, yPos - 1, 520, rowHeight + 2)
                 .fill();
            }
            
            let productName = item.productName || 'Product';
            while (doc.widthOfString(productName, { fontSize: 8, font: 'Helvetica' }) > 85 && productName.length > 3) {
              productName = productName.substring(0, productName.length - 1);
            }
            if (productName !== (item.productName || 'Product')) {
              productName = productName.substring(0, productName.length - 3) + '...';
            }
            
            const quantity = item.totalQuantity || 0;
            
            doc.fillColor('#2C2420')
               .fontSize(8)
               .font('Helvetica')
               .text(productName, 45, yPos + 2)
               .text('-', 158, yPos + 2)
               .text(`${quantity} ${unitLabel}`, 210, yPos + 2)
               .text(`${item.unitPrice.toFixed(2)}/${unitLabel === 'pcs' ? 'pc' : unitLabel}`, 405, yPos + 2, { width: 50, align: 'right' })
               .text(formatPrice(item.total || 0).replace('$', ''), 460, yPos + 2, { width: 50, align: 'right' });
            
            yPos += rowHeight;
            yPos += 5;
            
            doc.strokeColor('#CCCCCC')
               .lineWidth(0.5)
               .moveTo(40, yPos - 3)
               .lineTo(560, yPos - 3)
               .stroke();
          }
        }
      }

      // ==================== SUMMARY SECTION ====================
      yPos += 20;

      const subtotal = Number(invoice.subtotal || 0).toFixed(2);
      const vatAmount = Number(invoice.vatAmount || 0).toFixed(2);
      const discountAmount = Number(invoice.discountAmount || 0).toFixed(2);
      const shippingCost = Number(invoice.shippingCost || 0).toFixed(2);
      const finalTotal = Number(invoice.finalTotal || 0).toFixed(2);
      const amountPaid = Number(invoice.amountPaid || 0).toFixed(2);
      const dueAmount = Number(invoice.dueAmount || 0).toFixed(2);

      const paidPercent = finalTotal > 0 ? ((amountPaid / finalTotal) * 100).toFixed(1) : '0';
      const duePercent = finalTotal > 0 ? ((dueAmount / finalTotal) * 100).toFixed(1) : '0';

      // Calculate how many lines we'll have
      let lineCount = 2; // Subtotal + Total
      if (invoice.vatPercentage > 0) lineCount++;
      if (invoice.discountPercentage > 0) lineCount++;
      if (parseFloat(shippingCost) > 0) lineCount++;
      lineCount += 3; // Line + Paid + Due

      const lineHeight = 10;
      const boxHeight = (lineCount * lineHeight) + 10;

      // Summary box
      const summaryBoxX = 250;
      const summaryBoxY = yPos - 8;
      const summaryBoxWidth = 270;
      const summaryBoxHeight = boxHeight;

      doc.fillColor('#F5E6D3')
         .rect(summaryBoxX, summaryBoxY, summaryBoxWidth, summaryBoxHeight)
         .fill();

      let summaryY = yPos;
      const col1X = summaryBoxX + 10;
      const col2X = summaryBoxX + 175;

      doc.fillColor('#2C2420')
         .fontSize(8.5)
         .font('Helvetica');

      const formatPriceShort = (price) => {
        const num = parseFloat(price);
        return '$' + num.toFixed(2);
      };

      // Subtotal
      doc.text('Subtotal:', col1X, summaryY);
      doc.text(formatPriceShort(subtotal), col2X, summaryY);
      summaryY += lineHeight;

      // VAT
      if (invoice.vatPercentage > 0) {
        doc.text(`VAT (${invoice.vatPercentage}%):`, col1X, summaryY);
        doc.text(formatPriceShort(vatAmount), col2X, summaryY);
        summaryY += lineHeight;
      }

      // Discount
      if (invoice.discountPercentage > 0) {
        doc.text(`Discount (${invoice.discountPercentage}%):`, col1X, summaryY);
        doc.text(`-${formatPriceShort(discountAmount)}`, col2X, summaryY);
        summaryY += lineHeight;
      }

      // Shipping
      if (parseFloat(shippingCost) > 0) {
        doc.text('Shipping:', col1X, summaryY);
        doc.text(formatPriceShort(shippingCost), col2X, summaryY);
        summaryY += lineHeight;
      }

      // Line
      doc.strokeColor('#E5D5C0')
         .lineWidth(0.5)
         .moveTo(col1X, summaryY - 2)
         .lineTo(summaryBoxX + summaryBoxWidth - 15, summaryY - 2)
         .stroke();
      summaryY += 4;

      // Total
      doc.font('Helvetica-Bold')
         .fontSize(9.5)
         .text('TOTAL:', col1X, summaryY);
      doc.text(formatPriceShort(finalTotal), col2X, summaryY);
      summaryY += 12;

      // Paid
      doc.font('Helvetica')
         .fontSize(7.5);
      doc.fillColor('#3A7D44')
         .text('Paid:', col1X, summaryY);
      doc.text(`${formatPriceShort(amountPaid)} (${paidPercent}%)`, col2X, summaryY);
      summaryY += 9;

      // Due
      doc.fillColor(parseFloat(dueAmount) > 0 ? '#dc3545' : '#3A7D44')
         .text('Due:', col1X, summaryY);
      doc.text(`${formatPriceShort(dueAmount)} (${duePercent}%)`, col2X, summaryY);

      doc.fillColor('#2C2420');

      // ==================== BANK DETAILS (LEFT) & BANKING TERMS (RIGHT) ====================
      let bankingStartY = summaryBoxY + summaryBoxHeight + 15;
      
      const hasBankDetails = invoice.bankDetails && Object.values(invoice.bankDetails).some(v => v && v.toString().trim());
      const hasBankingTerms = invoice.bankingTerms && invoice.bankingTerms.length > 0 && 
                              invoice.bankingTerms.some(term => term.title?.trim() || term.value?.trim());
      
      if (hasBankDetails || hasBankingTerms) {
        const bankingBoxX = 40;
        const bankingBoxY = bankingStartY;
        const bankingBoxWidth = 520;
        
        let leftColumnHeight = 25;
        let rightColumnHeight = 25;
        
        if (hasBankDetails) {
          const bankDetails = invoice.bankDetails;
          let lineCount = 0;
          if (bankDetails.bankName && bankDetails.bankName.toString().trim()) lineCount++;
          if (bankDetails.accountName && bankDetails.accountName.toString().trim()) lineCount++;
          if (bankDetails.accountNumber && bankDetails.accountNumber.toString().trim()) lineCount++;
          if (bankDetails.accountType && bankDetails.accountType.toString().trim()) lineCount++;
          if (bankDetails.routingNumber && bankDetails.routingNumber.toString().trim()) lineCount++;
          if (bankDetails.swiftCode && bankDetails.swiftCode.toString().trim()) lineCount++;
          if (bankDetails.iban && bankDetails.iban.toString().trim()) lineCount++;
          if (bankDetails.bankAddress && bankDetails.bankAddress.toString().trim()) lineCount++;
          leftColumnHeight = Math.max(leftColumnHeight, (lineCount * 14) + 20);
        }
        
        if (hasBankingTerms) {
          const validTerms = invoice.bankingTerms.filter(term => term.title?.trim() || term.value?.trim());
          let totalHeight = 0;
          
          const measureTextHeight = (text, width, fontSize = 7.5) => {
            const charsPerLine = Math.floor(width / 4.5);
            const lines = Math.ceil(text.length / charsPerLine);
            return lines * 12;
          };
          
          validTerms.forEach(term => {
            if (term.title && term.value) {
              const titleText = `${term.title}: `;
              const fullText = titleText + term.value;
              const textHeight = measureTextHeight(fullText, 230, 7.5);
              totalHeight += Math.max(textHeight, 14);
            } else if (term.title) {
              const textHeight = measureTextHeight(term.title, 230, 7.5);
              totalHeight += Math.max(textHeight, 14);
            } else if (term.value) {
              const textHeight = measureTextHeight(term.value, 230, 7.5);
              totalHeight += Math.max(textHeight, 14);
            }
          });
          
          rightColumnHeight = Math.max(rightColumnHeight, totalHeight + 20);
        }
        
        const boxHeight = Math.max(leftColumnHeight, rightColumnHeight, 60) + 15;
        
        doc.fillColor('#FAF7F2')
           .rect(bankingBoxX, bankingBoxY, bankingBoxWidth, boxHeight)
           .fill();
        
        doc.strokeColor('#6B4F3A')
           .lineWidth(0.8)
           .rect(bankingBoxX, bankingBoxY, bankingBoxWidth, boxHeight)
           .stroke();
        
        const bankSeparatorX = bankingBoxX + 260;
        doc.strokeColor('#E5D5C0')
           .lineWidth(0.5)
           .moveTo(bankSeparatorX, bankingBoxY + 8)
           .lineTo(bankSeparatorX, bankingBoxY + boxHeight - 8)
           .stroke();
        
        // LEFT COLUMN: BANK DETAILS
        const leftX = bankingBoxX + 15;
        let leftY = bankingBoxY + 12;
        
        doc.fillColor('#6B4F3A')
           .fontSize(9)
           .font('Helvetica-Bold')
           .text('BANK DETAILS', leftX, leftY);
        
        leftY += 16;
        
        if (hasBankDetails) {
          doc.fontSize(7.5)
             .font('Helvetica')
             .fillColor('#2C2420');
          
          const bankDetails = invoice.bankDetails;
          
          const drawBankLine = (label, value, y) => {
            if (value && value.toString().trim()) {
              const labelText = `${label}: `;
              const maxWidth = 220;
              
              doc.font('Helvetica-Bold')
                 .text(labelText, leftX, y, { continued: true });
              
              const valueStr = value.toString();
              const labelWidth = doc.widthOfString(labelText, { fontSize: 7.5, font: 'Helvetica-Bold' });
              const availableWidth = maxWidth - labelWidth;
              
              const currentX = doc.x;
              const remainingWidth = maxWidth - (currentX - leftX);
              
              const valueWidth = doc.widthOfString(valueStr, { fontSize: 7.5, font: 'Helvetica' });
              
              if (valueWidth <= remainingWidth) {
                doc.font('Helvetica')
                   .text(valueStr);
                return 12;
              } else {
                doc.font('Helvetica')
                   .text('');
                
                const indentX = leftX + 5;
                doc.font('Helvetica')
                   .text(valueStr, indentX, y + 10, { width: maxWidth - 5 });
                
                const textHeight = doc.heightOfString(valueStr, { width: maxWidth - 5, fontSize: 7.5 });
                return 12 + textHeight;
              }
            }
            return 0;
          };
          
          if (bankDetails.bankName && bankDetails.bankName.toString().trim()) {
            const height = drawBankLine('Bank Name', bankDetails.bankName, leftY);
            leftY += height;
          }
          if (bankDetails.accountName && bankDetails.accountName.toString().trim()) {
            const height = drawBankLine('Account Name', bankDetails.accountName, leftY);
            leftY += height;
          }
          if (bankDetails.accountNumber && bankDetails.accountNumber.toString().trim()) {
            const height = drawBankLine('Account Number', bankDetails.accountNumber, leftY);
            leftY += height;
          }
          if (bankDetails.accountType && bankDetails.accountType.toString().trim()) {
            const height = drawBankLine('Account Type', bankDetails.accountType, leftY);
            leftY += height;
          }
          if (bankDetails.routingNumber && bankDetails.routingNumber.toString().trim()) {
            const height = drawBankLine('Routing Number', bankDetails.routingNumber, leftY);
            leftY += height;
          }
          if (bankDetails.swiftCode && bankDetails.swiftCode.toString().trim()) {
            const height = drawBankLine('SWIFT Code', bankDetails.swiftCode, leftY);
            leftY += height;
          }
          if (bankDetails.iban && bankDetails.iban.toString().trim()) {
            const height = drawBankLine('IBAN', bankDetails.iban, leftY);
            leftY += height;
          }
          if (bankDetails.bankAddress && bankDetails.bankAddress.toString().trim()) {
            const height = drawBankLine('Bank Address', bankDetails.bankAddress, leftY);
            leftY += height;
          }
        } else {
          doc.fillColor('#999999')
             .fontSize(7.5)
             .font('Helvetica')
             .text('No bank details provided', leftX, leftY);
        }
        
        // RIGHT COLUMN: BANKING TERMS
        const rightX = bankSeparatorX + 15;
        let rightY = bankingBoxY + 12;
        
        doc.fillColor('#6B4F3A')
           .fontSize(9)
           .font('Helvetica-Bold')
           .text('BANKING TERMS', rightX, rightY);
        
        rightY += 16;
        
        if (hasBankingTerms) {
          doc.fontSize(7.5)
             .font('Helvetica')
             .fillColor('#2C2420');
          
          const validTerms = invoice.bankingTerms.filter(term => term.title?.trim() || term.value?.trim());
          const regularTerms = validTerms.filter(term => term.title?.trim() && term.value?.trim());
          const titleOnlyTerms = validTerms.filter(term => term.title?.trim() && !term.value?.trim());
          const valueOnlyTerms = validTerms.filter(term => !term.title?.trim() && term.value?.trim());
          
          regularTerms.forEach((term) => {
            const titleText = `${term.title}: `;
            const fullText = titleText + term.value;
            const textWidth = doc.widthOfString(fullText, { fontSize: 7.5 });
            
            if (textWidth <= 230) {
              doc.font('Helvetica-Bold')
                 .text(titleText, rightX, rightY, { continued: true })
                 .font('Helvetica')
                 .text(term.value);
              rightY += 12;
            } else {
              doc.font('Helvetica-Bold')
                 .text(titleText, rightX, rightY);
              rightY += 10;
              doc.font('Helvetica')
                 .text(term.value, rightX, rightY, { width: 230 });
              rightY += doc.heightOfString(term.value, { width: 230 }) + 4;
            }
          });
          
          if (titleOnlyTerms.length > 0) {
            if (regularTerms.length > 0) rightY += 4;
            
            titleOnlyTerms.forEach((term) => {
              doc.font('Helvetica-Bold')
                 .fillColor('#6B4F3A')
                 .text(term.title, rightX, rightY);
              rightY += 10;
              doc.fillColor('#2C2420');
            });
          }
          
          if (valueOnlyTerms.length > 0) {
            if (regularTerms.length > 0 || titleOnlyTerms.length > 0) rightY += 4;
            
            valueOnlyTerms.forEach((term) => {
              doc.font('Helvetica')
                 .text(term.value, rightX, rightY, { width: 230 });
              rightY += doc.heightOfString(term.value, { width: 230 }) + 4;
            });
          }
        } else {
          doc.fillColor('#999999')
             .fontSize(7.5)
             .font('Helvetica')
             .text('No banking terms provided', rightX, rightY);
        }
        
        bankingStartY += boxHeight + 10;
      }
      
      // ==================== NOTES & TERMS ====================
      let notesStartY = bankingStartY;
      
      if (invoice.notes || invoice.terms) {
        if (notesStartY > 720) {
          doc.addPage();
          notesStartY = 40;
        }
        
        const notesBoxX = 40;
        const notesBoxY = notesStartY;
        const notesBoxWidth = 520;
        
        let notesBoxHeight = 15;
        if (invoice.notes) notesBoxHeight += doc.heightOfString(invoice.notes, { width: 500 }) + 20;
        if (invoice.terms) notesBoxHeight += doc.heightOfString(invoice.terms, { width: 500 }) + 20;
        
        if (notesBoxHeight > 15) {
          doc.fillColor('#F5E6D3')
             .rect(notesBoxX, notesBoxY, notesBoxWidth, notesBoxHeight)
             .fill();
          
          doc.strokeColor('#6B4F3A')
             .lineWidth(0.5)
             .rect(notesBoxX, notesBoxY, notesBoxWidth, notesBoxHeight)
             .stroke();
          
          let currentNotesY = notesBoxY + 12;
          
          if (invoice.notes) {
            doc.fillColor('#2C2420')
               .fontSize(9)
               .font('Helvetica-Bold')
               .text('NOTES:', notesBoxX + 10, currentNotesY);
            currentNotesY += 12;
            
            doc.fontSize(7.5)
               .font('Helvetica')
               .fillColor('#8B7355')
               .text(invoice.notes, notesBoxX + 10, currentNotesY, { width: 500 });
            currentNotesY += doc.heightOfString(invoice.notes, { width: 500 }) + 8;
          }
          
          if (invoice.terms) {
            doc.fillColor('#2C2420')
               .fontSize(9)
               .font('Helvetica-Bold')
               .text('TERMS & CONDITIONS:', notesBoxX + 10, currentNotesY);
            currentNotesY += 12;
            
            doc.fontSize(7.5)
               .font('Helvetica')
               .fillColor('#8B7355')
               .text(invoice.terms, notesBoxX + 10, currentNotesY, { width: 500 });
          }
        }
      }
      
      // ==================== FOOTER ====================
      const pageHeight = doc.page.height;
      const footerY = pageHeight - 35;
      
      doc.strokeColor('#6B4F3A')
         .lineWidth(0.5)
         .moveTo(40, footerY - 8)
         .lineTo(550, footerY - 8)
         .stroke();
      
      console.log('📄 PDF generation complete');
      doc.end();

    } catch (error) {
      console.error('❌ PDF Generation Error:', error);
      reject(error);
    }
  });
};

module.exports = { generateInvoicePDF };