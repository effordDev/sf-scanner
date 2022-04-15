import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';

export default class Scanner extends LightningElement {
     sessionScanner;
    @track scannedBarcodes = [];

    connectedCallback() {
        this.sessionScanner = getBarcodeScanner();
    }

    beginScanning() {
        // Reset scannedBarcodes before starting new scanning session
        this.scannedBarcodes = [];

        // Make sure BarcodeScanner is available before trying to use it
        if (this.sessionScanner != null && this.sessionScanner.isAvailable()) {
            const scanningOptions = {
                barcodeTypes: [
                    this.sessionScanner.barcodeTypes.DATA_MATRIX,
                    this.sessionScanner.barcodeTypes.QR
               ],
                instructionText: 'Scan barcodes — Click ✖︎ when done',
                successText: 'Successful scan.'
            };
            this.sessionScanner.beginCapture(scanningOptions)
            .then((scannedBarcode) => {
                this.processScannedBarcode(scannedBarcode);
                this.continueScanning();
            })
            .catch((error) => {
                this.processError(error);
                this.sessionScanner.endCapture();
            })
        }
        else {
            console.log("BarcodeScanner unavailable. Non-mobile device?");
        }
    }

    continueScanning() {
        this.sessionScanner.resumeCapture()
        .then((scannedBarcode) => {
            this.processScannedBarcode(scannedBarcode);
            this.continueScanning();
        })
        .catch((error) => {
            this.processError(error);
            this.sessionScanner.endCapture();
        })
    }

    processScannedBarcode(barcode) {
        const codeString = barcode.value
        this.scannedBarcodes.push(codeString)
    }

    processError(error) {
        // Check to see if user ended scanning
        if (error.code == 'userDismissedScanner') {
            console.log('User terminated scanning session via Cancel.');
        }
        else {
            console.error(error);
        }
    }
}