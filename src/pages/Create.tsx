import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useLocation } from 'wouter';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export function Create() {
  const [, navigate] = useLocation();
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  }

  function removeFile() {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim() && !file) {
      setError('Add a caption or image');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.posts.create(content.trim(), file || undefined);
      navigate('/feed');
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Create Post</h1>
        <p className="text-sm text-muted-foreground mt-1">Share a moment with your followers</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image area */}
        <div
          className={`border-2 border-dashed rounded-2xl transition-colors ${
            preview ? 'border-transparent' : 'border-border hover:border-primary/50 cursor-pointer'
          }`}
          onClick={() => !preview && fileRef.current?.click()}
        >
          {preview ? (
            <div className="relative">
              <img src={preview} alt="preview" className="w-full max-h-96 object-contain rounded-2xl bg-secondary" />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); removeFile(); }}
                className="absolute top-3 right-3 bg-black/60 rounded-full p-1.5 hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <ImagePlus className="w-10 h-10" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Add a photo</p>
                <p className="text-xs mt-1">Click to upload (optional)</p>
              </div>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />

        {/* Caption */}
        <textarea
          placeholder="Write a caption…"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          maxLength={2200}
          className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm resize-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
        <div className="flex justify-end">
          <span className="text-xs text-muted-foreground">{content.length}/2200</span>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || (!content.trim() && !file)}
          className="w-full gradient-bg text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Sharing…' : 'Share Post'}
        </button>
      </form>
    </div>
  );
}
