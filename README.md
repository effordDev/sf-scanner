# sf-scanner
Base component for sf scanning

## Images
F.1 <img src="https://user-images.githubusercontent.com/36901822/164031071-1a23dd52-0c28-4f1b-9f60-649f5a69d167.PNG" width="275">&nbsp;F.2<img src="https://user-images.githubusercontent.com/36901822/164031147-254f107c-2964-4a5d-876b-eb3d81a791bc.PNG" width="275">&nbsp;F.3<img src="https://user-images.githubusercontent.com/36901822/164031402-d7d8f516-c503-4039-8b95-aabc58c8b523.png" width="275">

## Main Properties
``` scannedBarcodes ``` - Outputs a list of the scanned barcodes (F.3)

``` multiScan ``` - If you want to allow multiple scans set to ```true```

``` autoNavigate ``` - If set to ``` true ``` and the component is in a flow, it will automatically fire the ```next``` flow action if available 

``` scannerInstructions ``` - Provide scanner instructions to end user

``` buttonLabel ``` - Label for scanner button (F.1)

``` buttonIcon ``` - Icon for scanner button (F.1)

## Targets
```
<target>lightning__AppPage</target>
<target>lightning__HomePage</target>
<target>lightning__Tab</target>
<target>lightning__FlowScreen</target>
```
