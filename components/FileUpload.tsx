"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileText, ImageIcon, File, Plus, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import FileViewer from "@/components/FileViewer"
import { validateFile } from "@/lib/validations"

interface FileUploadProps {
  files: any[]
  onFilesChange: (files: any[]) => void
  disabled?: boolean
}

export default function FileUpload({ files, onFilesChange, disabled }: FileUploadProps) {
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    selectedFiles.forEach((file) => {
      try {
        validateFile(file)

        const reader = new FileReader()
        reader.onload = (event) => {
          const base64String = event.target?.result as string
          const newFile = {
            name: file.name,
            url: base64String,
            type: file.type,
            size: file.size,
            uploadDate: new Date().toISOString(),
          }
          onFilesChange([...files, newFile])

          toast({
            title: "File uploaded successfully! ✅",
            description: `${file.name} has been uploaded and will be saved with the appointment.`,
          })
        }
        reader.onerror = () => {
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          })
        }
        reader.readAsDataURL(file)
      } catch (error) {
        toast({
          title: "File validation failed",
          description: error instanceof Error ? error.message : "Invalid file",
          variant: "destructive",
        })
      }
    })

    e.target.value = ""
  }

  const removeFile = (index: number) => {
    const removedFile = files[index]
    const updatedFiles = files.filter((_, i) => i !== index)
    onFilesChange(updatedFiles)

    toast({
      title: "File removed",
      description: `${removedFile.name} has been removed from the appointment.`,
    })
  }

  return (
    <div className="space-y-4">
      {!disabled && (
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors">
          <Upload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload Files</h3>
              <p className="text-sm text-gray-600">Drag and drop files here, or click to browse</p>
            </div>

            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <ImageIcon className="h-4 w-4" />
                <span>Images</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>PDFs</span>
              </div>
              <div className="flex items-center space-x-1">
                <File className="h-4 w-4" />
                <span>Documents</span>
              </div>
            </div>

            <label htmlFor="file-upload" className="cursor-pointer">
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <Button type="button" variant="default" className="bg-blue-600 hover:bg-blue-700" asChild>
                <span>
                  <Plus className="mr-2 h-4 w-4" />
                  Choose Files
                </span>
              </Button>
            </label>

            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <AlertCircle className="h-3 w-3" />
              <span>Maximum file size: 5MB each • Supported: PDF, JPG, PNG, DOC, DOCX</span>
            </div>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">📎 Uploaded Files ({files.length})</h4>
            {!disabled && (
              <p className="text-xs text-gray-500">Click on images to preview • Click on documents to view/download</p>
            )}
          </div>

          <FileViewer files={files} onRemoveFile={disabled ? undefined : removeFile} readOnly={disabled} />
        </div>
      )}

      {files.length === 0 && disabled && (
        <div className="text-center py-6 text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
          <File className="mx-auto h-8 w-8 text-gray-300 mb-2" />
          <p className="text-sm">No files attached to this appointment</p>
        </div>
      )}
    </div>
  )
}
