"use client"

import { useState, useEffect, forwardRef } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ value, onChange, placeholder, className = "min-h-[200px]" }, ref) => {
    const [mounted, setMounted] = useState(false)
    const [editorValue, setEditorValue] = useState(value)

    useEffect(() => {
      setMounted(true)
    }, [])

    useEffect(() => {
      setEditorValue(value)
    }, [value])

    const handleChange = (content: string) => {
      setEditorValue(content)
      onChange(content)
    }

    const modules = {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ],
    }

    const formats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "color",
      "background",
      "align",
      "list",
      "bullet",
      "blockquote",
      "code-block",
      "link",
      "image",
    ]

    if (!mounted) {
      return (
        <div ref={ref} className={`border rounded-md p-3 ${className}`}>
          <div className="animate-pulse bg-gray-200 h-full w-full rounded-md"></div>
        </div>
      )
    }

    return (
      <div ref={ref} className={`rich-text-editor ${className}`}>
        <ReactQuill
          theme="snow"
          value={editorValue}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </div>
    )
  }
)

export default RichTextEditor
