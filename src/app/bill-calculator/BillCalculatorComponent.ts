import { Component } from '@angular/core';
import {CurrencyPipe, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Component({
  selector: 'app-bill-calculator',
  templateUrl: './bill-calculator.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    CurrencyPipe
  ],
  styleUrls: ['./bill-calculator.component.scss']
})
export class BillCalculatorComponent {
  flatHolderName: string = '';
  consumerAddress: string = '';
  pastMeterUnit: number = 0;
  currentMeterUnit: number = 0;
  meterUnit: number = 0;
  propertyType: string = 'Residential';
  phase: number | undefined;
  totalBill: number | null = null;

  // Hardcoded fixed charges
  fixedCharges: number = 128;
  // Wheeling charge per unit
  wheelingChargePerUnit: number = 1.17;

  // Additional charges
  additionalChargePerUnit: number = 0;

  // Charges and bill details
  meterCharges: number = 0;
  wheelingCharges: number = 0;
  additionalCharges: number = 0;
  electricityDuty: number = 0;

  calculateBill(): void {
    if (this.pastMeterUnit !== null && this.currentMeterUnit !== null) {
      this.meterUnit = this.currentMeterUnit - this.pastMeterUnit;
    } else {
      this.meterUnit = 0;
    }
    let rate: number;

    if (this.meterUnit >= 0 && this.meterUnit <= 100) {
      rate = 4.71;
      this.additionalChargePerUnit = 0.400;
    } else if (this.meterUnit > 100 && this.meterUnit <= 300) {
      rate = 8.08;
      this.additionalChargePerUnit = 0.58;
    } else if (this.meterUnit > 300 && this.meterUnit <= 500) {
      rate = 9.34;
      this.additionalChargePerUnit = 0.65;
    } else if (this.meterUnit > 500) {
      rate = 10.93;
      this.additionalChargePerUnit = 0.74;
    }

    // @ts-ignore
    this.meterCharges = this.meterUnit * rate;
    this.wheelingCharges = this.meterUnit * this.wheelingChargePerUnit;
    this.additionalCharges = this.meterUnit * this.additionalChargePerUnit;

    const baseAmount = this.fixedCharges + this.meterCharges + this.wheelingCharges + this.additionalCharges;

    if (this.propertyType === 'Residential') {
      this.electricityDuty = baseAmount * 0.16;
    } else {
      this.electricityDuty = baseAmount * 0.21;
    }

    this.totalBill = baseAmount + this.electricityDuty;
  }

  generatePDF(): void {
    const doc = new jsPDF();

    doc.text('MSEB Electricity Bill', 105, 10, { align: 'center' });

    doc.text('Customer Details:', 10, 20);
    doc.text(`Flat Holder Name: ${this.flatHolderName}`, 10, 30);
    doc.text(`Consumer Address: ${this.consumerAddress}`, 10, 40);
    doc.text(`Past Meter Reading: ${this.pastMeterUnit}`, 10, 50);
    doc.text(`Current Meter Reading: ${this.currentMeterUnit}`, 10, 60);
    doc.text(`Meter Unit: ${this.meterUnit}`, 10, 70);
    doc.text(`Phase: ${this.phase}`, 10, 80);

    doc.text('Bill Details:', 10, 90);
    doc.text(`Meter Charges (विज आकार): ₹${this.meterCharges}`, 10, 100);
    doc.text(`Fixed Charges (स्थिर आकार): ₹${this.fixedCharges}`, 10, 110);
    doc.text(`Wheeling Charges (वाहन आकार): ₹${this.wheelingCharges}`, 10, 120);
    doc.text(`Additional Charges (इंधन समायोजन आकार): ₹${this.additionalCharges}`, 10, 130);
    doc.text(`Electricity Duty (विज शुल्क): ₹${this.electricityDuty}`, 10, 140);
    doc.text(`Total Bill: ₹${this.totalBill}`, 10, 150);

    doc.save('electricity-bill.pdf');
  }
}
