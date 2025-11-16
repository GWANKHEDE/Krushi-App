import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFGeneratorProps {
  billData: any;
  invoiceNumber: string;
  customerPhone: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface PDFData {
  customerName: string;
  customerPhone: string;
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
    unit: string;
    sellingPrice: number;
    discount: number;
  }>;
  subtotal: number;
  tax: number;
  totalDiscount: number;
  overallDiscount: number;
  grandTotal: number;
  paymentMethod: string;
  createdAt: string;
}

export function PDFGenerator({ 
  billData, 
  invoiceNumber, 
  customerPhone, 
  onSuccess, 
  onError 
}: PDFGeneratorProps) {
  const { toast } = useToast();
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  const calculateProductTotal = (product: any) => {
    const baseTotal = product.quantity * product.sellingPrice;
    const discountAmount = (baseTotal * product.discount) / 100;
    return baseTotal - discountAmount;
  };

  const generatePDF = async (): Promise<jsPDF> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!pdfTemplateRef.current) {
          throw new Error('PDF template not found');
        }

        // Ensure the element is visible for capture
        const element = pdfTemplateRef.current;
        const originalDisplay = element.style.display;
        element.style.display = 'block';

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: element.scrollWidth,
          height: element.scrollHeight,
        });

        // Restore original display
        element.style.display = originalDisplay;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Calculate dimensions to fit the page
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.95;
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 5;

        // Add image to PDF
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        resolve(pdf);
      } catch (error) {
        reject(error);
      }
    });
  };

  const downloadPDF = async (pdf: jsPDF, filename: string) => {
    pdf.save(filename);
  };

  const sendWhatsAppMessage = async (phone: string, invoiceNumber: string, pdfData: PDFData) => {
    const message = `🚀 *Krushi Seva Kendra - Invoice #${invoiceNumber}*

📅 ${new Date().toLocaleDateString('en-IN')}

👤 *Customer:* ${pdfData.customerName}
📞 *Phone:* ${pdfData.customerPhone}

🛍️ *Items:*
${pdfData.items.map((item, index) => 
  `${index + 1}. ${item.name} - ${item.quantity} ${item.unit} x ₹${item.sellingPrice}${item.discount > 0 ? ` (-${item.discount}%)` : ''} = ₹${calculateProductTotal(item).toFixed(2)}`
).join('\n')}

💰 *Bill Summary:*
Subtotal: ₹${pdfData.subtotal.toFixed(2)}
GST (18%): ₹${pdfData.tax.toFixed(2)}
Discount: ₹${pdfData.totalDiscount.toFixed(2)}
${pdfData.overallDiscount > 0 ? `Overall Discount (${pdfData.overallDiscount}%): ₹${(pdfData.subtotal * pdfData.overallDiscount / 100).toFixed(2)}\n` : ''}
💳 *Grand Total: ₹${pdfData.grandTotal.toFixed(2)}*

💳 *Payment Method:* ${pdfData.paymentMethod}
✅ *Status:* PAID

Thank you for your business! 🌱`;

    const whatsappUrl = `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleGenerateAndSend = async () => {
    try {
      // Generate PDF
      const pdf = await generatePDF();
      
      // Download PDF locally
      await downloadPDF(pdf, `invoice-${invoiceNumber}.pdf`);
      
      // Send WhatsApp message
      await sendWhatsAppMessage(customerPhone, invoiceNumber, billData);
      
      toast({
        title: "Success!",
        description: `Invoice #${invoiceNumber} sent to WhatsApp and PDF downloaded`,
      });
      
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to generate PDF';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      onError?.(errorMessage);
    }
  };

  return (
    <div>
      {/* Hidden PDF Template */}
      <div 
        ref={pdfTemplateRef} 
        className="fixed -left-[10000px] top-0" 
        style={{ 
          width: '210mm', 
          minHeight: '297mm',
          backgroundColor: 'white',
          padding: '20mm'
        }}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 border-b pb-4">
            <h2 className="text-2xl font-bold">Krushi Seva Kendra</h2>
            <p className="text-gray-600">Gandhi Chowk, Nanded, Maharashtra - 431601</p>
            <p className="text-sm">GSTIN: 27ABCDE1234F1Z5</p>
            <p className="text-sm text-gray-500">{billData.createdAt}</p>
          </div>
          
          {/* Invoice Info */}
          <div className="text-center">
            <h3 className="text-lg font-bold">TAX INVOICE</h3>
            <p className="text-sm">Invoice #: {invoiceNumber}</p>
          </div>
          
          {/* Customer & Payment Info */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <p><strong>Name:</strong> {billData.customerName}</p>
              <p><strong>Phone:</strong> {billData.customerPhone}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payment Information</h3>
              <p><strong>Method:</strong> {billData.paymentMethod}</p>
              <p><strong>Status:</strong> <span className="text-green-600 font-semibold">PAID</span></p>
            </div>
          </div>
          
          {/* Items Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left font-semibold">#</th>
                  <th className="p-3 text-left font-semibold">Product</th>
                  <th className="p-3 text-left font-semibold">Qty</th>
                  <th className="p-3 text-left font-semibold">Rate</th>
                  <th className="p-3 text-left font-semibold">Discount</th>
                  <th className="p-3 text-left font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {billData.items.map((item: any, idx: number) => (
                  <tr key={idx} className="border-t">
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.sku}</p>
                      </div>
                    </td>
                    <td className="p-3">{item.quantity} {item.unit}</td>
                    <td className="p-3">₹{item.sellingPrice.toFixed(2)}</td>
                    <td className="p-3">
                      {item.discount > 0 ? (
                        <span className="text-green-600 font-medium">{item.discount}%</span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-3 font-medium">₹{calculateProductTotal(item).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Totals */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{billData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%):</span>
              <span>₹{billData.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Total Discount:</span>
              <span>-₹{billData.totalDiscount.toFixed(2)}</span>
            </div>
            {billData.overallDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Overall Discount ({billData.overallDiscount}%):</span>
                <span>-₹{(billData.subtotal * billData.overallDiscount / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Grand Total:</span>
              <span className="text-green-600">₹{billData.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t">
            <p>Thank you for your business!</p>
            <p>For queries, contact: +91-9876543210</p>
          </div>
        </div>
      </div>

      <Button
        onClick={handleGenerateAndSend}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        Send WhatsApp + Download PDF
      </Button>
    </div>
  );
}
