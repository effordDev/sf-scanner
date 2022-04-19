import { api, LightningElement, track } from 'lwc'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import { FlowNavigationNextEvent } from 'lightning/flowSupport'
import { getBarcodeScanner } from 'lightning/mobileCapabilities'

export default class Scanner extends LightningElement {
    myScanner
    scanButtonDisabled = false
    @api scannedBarcodes = []
    @api label = ''
    @api multiScan = false
    @api autoNavigate
    @api buttonLabel = ''
    @api buttonIcon = ''
    @api scannerInstructions = ''
    @api availableActions = []
    // When component is initialized, detect whether to enable Scan button
    connectedCallback() {
        this.myScanner = getBarcodeScanner()
        if (this.myScanner == null || !this.myScanner.isAvailable()) {
            this.scanButtonDisabled = true
        }
    }

    handleBeginScanClick(event) {
        // Reset scannedBarcode to empty string before starting new scan
        this.scannedBarcodes = []

        // Make sure BarcodeScanner is available before trying to use it
        // Note: We _also_ disable the Scan button if there's no BarcodeScanner
        if (this.myScanner != null && this.myScanner.isAvailable()) {
            const scanningOptions = {
                
                barcodeTypes: [
                    this.myScanner.barcodeTypes.DATA_MATRIX,
                    this.myScanner.barcodeTypes.QR
                ],
                instructionText: this.scannerInstructions,
                successText: 'Success'
            }

            if (this.multiScan) {
                this.myScanner.beginCapture(scanningOptions)
                .then((scannedBarcode) => {
                    this.processScannedBarcode(scannedBarcode)
                    this.continueScanning()
                })
                .catch((error) => {
                    this.processError(error)
                    this.myScanner.endCapture()
                })
            } else {

                this.myScanner.beginCapture(scanningOptions)
                .then((result) => {
                    console.log(result)

                    this.scannedBarcodes = [(decodeURIComponent(result.value))]
                    this.toast(
                        'Successful Scan',
                        `${result.value}`,
                        'success'
                    )

                    if(this.autoNavigate === true && this.availableActions.find(action => action === 'NEXT')){
                        const navigateNextEvent = new FlowNavigationNextEvent()
                        this.dispatchEvent(navigateNextEvent)
                    } 

                    
                    this.myScanner.endCapture()
                
                })
                .catch((error) => {
                    console.error(error)

                    this.toast(
                        'Barcode Scanner Error',
                        `There was a problem scanning the barcode: ${JSON.stringify(error)}, Please try again.`,
                        'error',
                        'sticky'
                    )
                    this.myScanner.endCapture()
                })
            }                
        } else {
            this.toast(
                'Barcode Scanner Is Not Available',
                'Non-mobile device?',
                'error'
            )
        }       
    }

    continueScanning() {

        this.myScanner.resumeCapture()
        .then((scannedBarcode) => {
            

            this.processScannedBarcode(scannedBarcode)

            setTimeout(() => {
                this.continueScanning()
            }, 2000)
        })
        .catch((error) => {
            this.processError(error)
            this.myScanner.endCapture()
            if (error.code != 'USER_DISMISSED') {
                this.toast('error 2', JSON.stringify(error), 'error', 'sticky')
            }
        })
    }

    processScannedBarcode(barcode) {
        const codeString = barcode.value
        this.scannedBarcodes = [...this.scannedBarcodes, codeString]
        const set = new Set(this.scannedBarcodes)
        this.scannedBarcodes = [...set]
        this.toast(
            'Successful Scan',
            `${codeString}`,
            'success'
        )
    }

    processError(error) {
        // Check to see if user ended scanning
        if (error.code == 'USER_ DISMISSED') {
            console.log('User terminated scanning session via Cancel.')
        }
        else {
            console.error(error)
        }
    }

    removeItem(event) {
        const itemToRemove = event.currentTarget.dataset.item
       
        const el = event.currentTarget
        
        el.parentNode.parentNode.parentNode.classList.add("hidden")
    
        setTimeout(() => {
          this.scannedBarcodes = this.scannedBarcodes.filter(item => item != itemToRemove)
        }, 2000)
    }

    jumpTo() {
        const el = this.template.querySelector(`.myBottom`)

        if (el) {
            el.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }

    toast(title, message, variant, mode = 'dismissable') {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant,
                mode
            })
        )
    }
}