import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabaseService } from '@/services/supabaseService';

interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  currentImageUrl: string;
  projectTitle: string;
  onImageUpdated: (newImageUrl: string) => void;
}

const ImageEditModal: React.FC<ImageEditModalProps> = ({
  isOpen,
  onClose,
  projectId,
  currentImageUrl,
  projectTitle,
  onImageUpdated
}) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPEG, PNG, GIF, etc.)",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      console.log('ImageEditModal: Starting upload for project:', projectId);
      console.log('ImageEditModal: Selected file:', selectedFile);
      
      // Upload image to Supabase storage
      const imageUrl = await supabaseService.uploadProjectImage(selectedFile, projectId);
      
      if (imageUrl) {
        console.log('ImageEditModal: Upload successful, updating project with URL:', imageUrl);
        
        // Update project with new image URL
        const updatedProject = await supabaseService.updateProjectImage(projectId, imageUrl);
        
        if (updatedProject) {
          console.log('ImageEditModal: Project updated successfully:', updatedProject);
          
          toast({
            title: "Image Updated Successfully",
            description: "Your project banner image has been updated",
          });
          
          onImageUpdated(imageUrl);
          onClose();
        } else {
          throw new Error('Failed to update project with new image URL');
        }
      } else {
        throw new Error('Upload completed but no image URL was returned');
      }
    } catch (error) {
      console.error('ImageEditModal: Error uploading image:', error);
      
      let errorMessage = "Failed to upload image. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('storage bucket')) {
          errorMessage = "Storage configuration error. Please contact support.";
        } else if (error.message.includes('permission')) {
          errorMessage = "Permission denied. Please check your account permissions.";
        } else if (error.message.includes('network')) {
          errorMessage = "Network error. Please check your internet connection.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900/95 border border-gray-700/50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Edit Project Image</h2>
              <p className="text-gray-400">{projectTitle}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Current Image */}
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Current Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-40 bg-gray-700 rounded-lg overflow-hidden">
                  {currentImageUrl && currentImageUrl !== '/placeholder.svg' ? (
                    <img 
                      src={currentImageUrl} 
                      alt="Current project banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-500" />
                      <span className="text-gray-500 ml-2">No image set</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* New Image Upload */}
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Upload New Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors bg-white/5">
                  <input
                    id="newImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="newImage" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-400">
                      {selectedFile ? selectedFile.name : 'Click to upload new image'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Max size: 5MB • Supported: JPEG, PNG, GIF
                    </p>
                  </label>
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Preview:</p>
                    <div className="relative w-full h-40 bg-gray-700 rounded-lg overflow-hidden">
                      <img 
                        src={previewUrl} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions - Fixed positioning */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700/50">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="border-white/20 text-gray-300 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? 'Uploading...' : 'Update Image'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditModal; 