import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  RefreshCcw,
  Calendar,
  X
} from "lucide-react";

interface BulkUploadWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkUploadWizard({ isOpen, onClose }: BulkUploadWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [importScheduled, setImportScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templateColumns = [
    'Product Name*', 'SKU*', 'Category*', 'Subcategory', 'Description*',
    'Short Description', 'Price*', 'Compare Price', 'Stock*', 'Weight',
    'Fabric Type*', 'Occasion', 'Regional Style', 'Colors', 'Sizes',
    'Meta Title', 'Meta Description', 'Keywords', 'Status'
  ];

  const sampleData = [
    {
      'Product Name*': 'Royal Blue Banarasi Saree',
      'SKU*': 'PRD001',
      'Category*': 'Sarees',
      'Subcategory': 'Silk Sarees',
      'Description*': 'Elegant royal blue Banarasi saree with intricate golden zari work',
      'Short Description': 'Premium Banarasi silk saree',
      'Price*': '12999',
      'Compare Price': '15999',
      'Stock*': '25',
      'Weight': '800',
      'Fabric Type*': 'Pure Silk',
      'Occasion': 'Wedding',
      'Regional Style': 'North Indian',
      'Colors': 'Royal Blue,Navy Blue',
      'Sizes': 'Free Size',
      'Meta Title': 'Royal Blue Banarasi Saree - Premium Collection',
      'Meta Description': 'Elegant royal blue Banarasi saree with golden zari work',
      'Keywords': 'banarasi saree,silk saree,wedding saree',
      'Status': 'active'
    }
  ];

  const downloadTemplate = () => {
    const csvContent = [
      templateColumns.join(','),
      sampleData.map(row => 
        templateColumns.map(col => `"${row[col] || ''}"`).join(',')
      ).join('\n')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pareenita_product_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
      simulateValidation(file);
    }
  };

  const simulateValidation = (file: File) => {
    setCurrentStep(2);
    setUploadProgress(0);
    
    // Simulate file processing
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setValidationResults([
            { row: 1, status: 'success', data: sampleData[0] },
            { row: 2, status: 'error', data: { 'Product Name*': 'Pink Lehenga', 'SKU*': '', error: 'SKU is required' } },
            { row: 3, status: 'warning', data: { 'Product Name*': 'Green Kurta', 'SKU*': 'PRD003', 'Price*': 'invalid', warning: 'Invalid price format' } }
          ]);
          setErrors([
            { row: 2, field: 'SKU*', message: 'SKU is required', severity: 'error' },
            { row: 3, field: 'Price*', message: 'Invalid price format', severity: 'warning' }
          ]);
          setCurrentStep(3);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const processImport = () => {
    if (importScheduled && scheduledTime) {
      setCurrentStep(5);
    } else {
      setCurrentStep(4);
      // Simulate import process
      setTimeout(() => {
        setCurrentStep(5);
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-elegant">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Bulk Product Upload</CardTitle>
              <CardDescription>
                Import multiple products using CSV file
              </CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Step 1: Template Download & File Upload */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <FileSpreadsheet className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Prepare Your Data</h3>
                <p className="text-muted-foreground">
                  Download our template and prepare your product data
                </p>
              </div>

              {/* Template Download */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1. Download Template</CardTitle>
                  <CardDescription>
                    Use our CSV template with all required fields and sample data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={downloadTemplate} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download CSV Template
                  </Button>
                  
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Template includes:</h4>
                    <div className="grid gap-1 md:grid-cols-2 text-sm">
                      <div>• Basic product information</div>
                      <div>• Pricing and inventory</div>
                      <div>• Ethnic wear specific fields</div>
                      <div>• SEO optimization</div>
                      <div>• Variant support (colors, sizes)</div>
                      <div>• Sample data for reference</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2. Upload Your File</CardTitle>
                  <CardDescription>
                    Upload your completed CSV file for validation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="font-medium">Choose CSV file to upload</p>
                      <p className="text-sm text-muted-foreground">
                        Maximum file size: 10MB
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button 
                      className="mt-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Select File
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Guidelines */}
              <Card className="bg-accent/50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    Important Guidelines
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Fields marked with * are required</li>
                    <li>• Use comma-separated values for multiple colors/sizes</li>
                    <li>• Ensure SKUs are unique across all products</li>
                    <li>• Price should be in numbers only (without ₹ symbol)</li>
                    <li>• Status can be: active, draft, or scheduled</li>
                    <li>• Images should be uploaded separately after import</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: File Processing */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCcw className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Processing File</h3>
                <p className="text-muted-foreground">
                  Validating your data and checking for errors...
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Processing: {uploadFile?.name}</span>
                      <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                    <div className="text-sm text-muted-foreground">
                      Validating data format, checking required fields, and verifying data integrity...
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Validation Results */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Validation Results</h3>
                  <p className="text-muted-foreground">
                    Review errors and warnings before importing
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    1 Valid
                  </Badge>
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    1 Error
                  </Badge>
                  <Badge variant="warning" className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    1 Warning
                  </Badge>
                </div>
              </div>

              {/* Error Summary */}
              {errors.length > 0 && (
                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-destructive" />
                      Errors Found ({errors.filter(e => e.severity === 'error').length})
                    </CardTitle>
                    <CardDescription>
                      These issues must be fixed before importing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {errors.filter(e => e.severity === 'error').map((error, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Badge variant="destructive">Row {error.row}</Badge>
                          <span className="font-medium">{error.field}:</span>
                          <span className="text-muted-foreground">{error.message}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Data Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Preview</CardTitle>
                  <CardDescription>
                    Review your data before final import
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>Row</TableHead>
                          <TableHead>Product Name</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Issues</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationResults.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {result.status === 'success' && (
                                <CheckCircle className="w-4 h-4 text-success" />
                              )}
                              {result.status === 'error' && (
                                <XCircle className="w-4 h-4 text-destructive" />
                              )}
                              {result.status === 'warning' && (
                                <AlertTriangle className="w-4 h-4 text-warning" />
                              )}
                            </TableCell>
                            <TableCell>{result.row}</TableCell>
                            <TableCell>{result.data['Product Name*']}</TableCell>
                            <TableCell>{result.data['SKU*'] || '-'}</TableCell>
                            <TableCell>{result.data['Price*'] || '-'}</TableCell>
                            <TableCell>{result.data['Category*'] || '-'}</TableCell>
                            <TableCell>
                              {result.data.error && (
                                <Badge variant="destructive" className="text-xs">
                                  {result.data.error}
                                </Badge>
                              )}
                              {result.data.warning && (
                                <Badge variant="outline" className="text-xs">
                                  {result.data.warning}
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Import Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Import Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="skipErrors"
                      className="rounded"
                    />
                    <Label htmlFor="skipErrors">
                      Skip rows with errors and import valid data only
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="scheduleImport"
                      checked={importScheduled}
                      onChange={(e) => setImportScheduled(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="scheduleImport">
                      Schedule import for later
                    </Label>
                  </div>

                  {importScheduled && (
                    <div className="ml-6 space-y-2">
                      <Label>Import Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Import Progress */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Importing Products</h3>
                <p className="text-muted-foreground">
                  Please wait while we import your products...
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Progress value={75} className="h-2" />
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Importing 1 of 1 valid products...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Import Complete */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Import Complete!</h3>
                <p className="text-muted-foreground">
                  {importScheduled ? 'Import has been scheduled successfully' : 'Your products have been imported successfully'}
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-3 text-center">
                    <div>
                      <div className="text-2xl font-bold text-success">1</div>
                      <div className="text-sm text-muted-foreground">Imported</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-warning">1</div>
                      <div className="text-sm text-muted-foreground">Warnings</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-destructive">1</div>
                      <div className="text-sm text-muted-foreground">Skipped</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {importScheduled && (
                <Card className="bg-accent/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-medium">Scheduled Import</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your import will run on {new Date(scheduledTime).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={() => {/* Navigate to products */}}>
                  View Products
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        {currentStep === 3 && (
          <div className="border-t p-6 flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Upload Different File
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={processImport}
                disabled={errors.some(e => e.severity === 'error')}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {importScheduled ? 'Schedule Import' : 'Start Import'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}