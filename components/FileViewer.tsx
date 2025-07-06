"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ImageIcon, File, Download, Eye, X, ZoomIn } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FileViewerProps {
  files: any[]
  onRemoveFile?: (index: number) => void
  readOnly?: boolean
}

export default function FileViewer({ files, onRemoveFile, readOnly = false }: FileViewerProps) {
  const [previewFile, setPreviewFile] = useState<any>(null)

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    } else if (type === "application/pdf") {
      return <FileText className="h-4 w-4 text-red-500" />
    } else {
      return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ""
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const downloadFile = (file: any) => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const previewFileContent = (file: any) => {
    setPreviewFile(file)
  }

  const isImage = (type: string) => type.startsWith("image/")
  const isPDF = (type: string) => type === "application/pdf"

  if (files.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
        <File className="mx-auto h-8 w-8 text-gray-300 mb-2" />
        <p className="text-sm">No files attached</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          Attached Files ({files.length}):
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {files.map((file, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                {/* File Preview Thumbnail */}
                <div className="mb-3">
                  {isImage(file.type) ? (
                    <div className="relative group">
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => previewFileContent(file)}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-md flex items-center justify-center">
                        <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ) : isPDF(file.type) ? (
                    <div
                      className="w-full h-32 bg-red-50 border-2 border-dashed border-red-200 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-red-100 transition-colors"
                      onClick={() => previewFileContent(file)}
                    >
                      <FileText className="h-8 w-8 text-red-500 mb-2" />
                      <span className="text-xs text-red-600 font-medium">PDF Document</span>
                      <span className="text-xs text-gray-500">Click to view</span>
                    </div>
                  ) : (
                    <div
                      className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => downloadFile(file)}
                    >
                      <File className="h-8 w-8 text-gray-500 mb-2" />
                      <span className="text-xs text-gray-600 font-medium">Document</span>
                      <span className="text-xs text-gray-500">Click to download</span>
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span className="px-2 py-1 bg-gray-100 rounded-full">
                            {file.type.split("/")[1]?.toUpperCase() || "FILE"}
                          </span>
                          {file.size && <span>{formatFileSize(file.size)}</span>}
                        </div>
                        {file.uploadDate && (
                          <p className="text-xs text-gray-400 mt-1">
                            Uploaded: {new Date(file.uploadDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => previewFileContent(file)}
                        title="Preview/View file"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {isImage(file.type) ? "Preview" : "View"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(file)}
                        title="Download file"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>

                    {!readOnly && onRemoveFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveFile(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Enhanced Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {previewFile && getFileIcon(previewFile.type)}
              <span>{previewFile?.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => previewFile && downloadFile(previewFile)}
                className="ml-auto"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center items-center max-h-[70vh] overflow-auto">
            {previewFile && (
              <>
                {isImage(previewFile.type) ? (
                  <img
                    src={previewFile.url || "/placeholder.svg"}
                    alt={previewFile.name}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                ) : isPDF(previewFile.type) ? (
                  <div className="text-center p-8">
                    <FileText className="mx-auto h-16 w-16 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">PDF Document</h3>
                    <p className="text-gray-600 mb-4">{previewFile.name}</p>
                    <p className="text-sm text-gray-500 mb-4">PDF preview is not available in this browser.</p>
                    <Button onClick={() => downloadFile(previewFile)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <File className="mx-auto h-16 w-16 text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Document Preview</h3>
                    <p className="text-gray-600 mb-4">{previewFile.name}</p>
                    <p className="text-sm text-gray-500 mb-4">Preview is not available for this file type.</p>
                    <Button onClick={() => downloadFile(previewFile)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download File
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {previewFile && (
            <div className="border-t pt-4 text-sm text-gray-600">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">File Type:</span> {previewFile.type}
                </div>
                <div>
                  <span className="font-medium">Size:</span> {formatFileSize(previewFile.size)}
                </div>
                {previewFile.uploadDate && (
                  <div className="col-span-2">
                    <span className="font-medium">Uploaded:</span> {new Date(previewFile.uploadDate).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
