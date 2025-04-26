
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PdfUploaderProps {
  onUpload: (file: File, text: string) => void;
}

export const PdfUploader: React.FC<PdfUploaderProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);

    try {
      setIsProcessing(true);

      // In a real app, we would use a proper PDF parsing library
      // For now, we'll just simulate PDF text extraction
      // This would typically be done on the backend
      
      const simulatedText = `This is simulated text extracted from ${selectedFile.name}. 
      In a real application, we would use a library like pdf.js or PyPDF2 (backend) to extract 
      the actual text content from the PDF file.
      
      This text would then be used to answer user questions based on the content of the PDF.`;
      
      // Wait to simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onUpload(selectedFile, simulatedText);
      
      toast({
        title: "PDF uploaded successfully",
        description: `${selectedFile.name} has been processed and is ready for Q&A`,
      });
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast({
        title: "Error processing PDF",
        description: "There was a problem processing your PDF file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileChange(droppedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-3 rounded-full bg-purple-100">
                <Upload className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Drag & Drop your PDF here</h3>
                <p className="text-sm text-gray-500 mt-1">
                  or click to browse your files
                </p>
              </div>
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
              <Button
                asChild
                variant="outline"
                className="mt-2"
              >
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  Browse Files
                </label>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isProcessing ? (
                <div className="flex items-center space-x-2 text-sm text-purple-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={handleRemove}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PdfUploader;
