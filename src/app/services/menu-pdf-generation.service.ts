import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
      previousAutoTable: { finalY: number };
    }
  
    interface jsPDFInternal {
      getNumberOfPages: () => number;
      pageSize: {
        getWidth: () => number;
        getHeight: () => number;
      };
    }
}

@Injectable({
  providedIn: 'root'
})
export class MenuPdfGenerationService {

  constructor() { }

  generatePDF(menu: any, total_dish: number, logoUrl: string='/assets/images/mera-menu-new.PNG') {
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Function to convert to title case
    const toTitleCase = (str: string) => {
      return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };

    // Function to format date to MM-DD-YYYY
    const formatDate = (date: string) => {
      const d = new Date(date);
      const month = ('0' + (d.getMonth() + 1)).slice(-2);
      const day = ('0' + d.getDate()).slice(-2);
      const year = d.getFullYear();
      return `${month}-${day}-${year}`;
    };

    // Add watermark
    // const watermark = new Image();
    // watermark.src = "/assets/images/pdf-watermark.jpg";
    // watermark.onload = () => {
    //   doc.addImage(watermark, 'PNG', pageWidth / 4, pageHeight / 4, pageWidth / 2, pageHeight / 2, '', 'NONE', 0.2); // Adjust as needed for opacity



      // Add company logo
      const logo = new Image();
      logo.src = logoUrl;
      logo.onload = () => {
        doc.addImage(logo, 'PNG', 20, 20, 216, 71); // Adjust as needed

        // Add company name
        // doc.setFontSize(18);
        // doc.setTextColor('#0000FF');
        // const menuName = `${menu.name} (${this.total_dish})`;
        // doc.text(menuName, pageWidth / 2, 100, { align: 'center' });

        // Add menu name and count
        doc.setFontSize(20);
        doc.setTextColor('#0000FF');
        const menuName = `${menu.name} (${total_dish})`;
        doc.text(menuName, pageWidth / 2, 100, { align: 'center' });

        // // Add owner, created_at, and id details
        // doc.setFontSize(12);
        // doc.setTextColor('#000000');
        // const owner = `${menu.user.first_name} ${menu.user.last_name}`;
        // const createdAt = `Created At: ${menu.created_at}`;
        // const id = `ID: ${menu.id}`;
        // doc.text(`Owner: ${owner}`, 20, 120);
        // doc.text(createdAt, pageWidth / 2 - doc.getTextWidth(createdAt) / 2, 120);
        // doc.text(id, pageWidth - 20 - doc.getTextWidth(id), 120);

        // Create table for Owner, Created At, and Id
        const tableColumn = ['Created By', 'Created On'];
        const tableRows = [
          [`${toTitleCase(menu.user.first_name)} ${toTitleCase(menu.user.last_name)}`, formatDate(menu.created_at)]
        ];

        doc.autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 140,
          theme: 'grid',
          // headStyles: { halign: 'center' },
          // bodyStyles: { halign: 'center' },
          headStyles: { halign: 'center', fillColor: [255, 255, 255], textColor: '#000000', lineWidth: 0 },
          bodyStyles: { halign: 'center', fillColor: [255, 255, 255], textColor: '#000000', lineWidth: 0 },
          
          margin: { top: 10 }
        });

        let currentHeight = doc.previousAutoTable.finalY + 20;


        // Iterate through belong_to_cuisine
        menu.belong_to_cuisine.forEach((cuisine: any, index: number) => {
          doc.setFontSize(14);
          doc.setTextColor('#000000');
          doc.text(`${index + 1}. ${cuisine.type} (${cuisine.count})`, 20, currentHeight);

          // Add dishes table
          doc.setFontSize(12);
          const tableColumn = ['S.No', 'Name', 'Cuisine', 'Count'];
          const tableRows: any[] = [];
          cuisine.dishes.forEach((dish: any, dishIndex: number) => {
            const count = dish.users.map((user: any) => `${user.first_name} ${user.last_name}`).join(', ');
            tableRows.push([dishIndex + 1, dish.name, dish.cuisine_name, dish.count]);
          });

          // Add table to PDF
          doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: currentHeight + 10,
          });
          currentHeight = doc.previousAutoTable.finalY + 20;
        });

        // Add thank you message
        doc.setFontSize(16);
        doc.setTextColor('#000000');
        // doc.text('Thank you!', pageWidth / 2, currentHeight + 20, { align: 'center' }); //center align
        doc.text('Thank you for using MeraMenu!', 20, currentHeight + 20);

        // Add page number
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(11);
          doc.setTextColor('#FF0000');
          doc.text('website: www.meramenu.in; phone +91 8319598413', pageWidth / 2, pageHeight - 20, { align: 'center' });
          doc.setFontSize(8);
          doc.setTextColor('#000000');
          doc.text(`Page ${i} of ${pageCount}`, 20, pageHeight - 20, { align: 'left' });
        }

        // Save the PDF
        doc.save('menu.pdf');
      };
    // };
  }
}
