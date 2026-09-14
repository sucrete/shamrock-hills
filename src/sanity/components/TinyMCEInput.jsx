import { useRef, useState, useCallback, useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { set, useClient } from 'sanity'
import { createPortal } from 'react-dom'
import { EditorView, basicSetup } from 'codemirror'
import { ViewPlugin, Decoration } from '@codemirror/view'
import { EditorState, RangeSetBuilder } from '@codemirror/state'
import { html as htmlLang } from '@codemirror/lang-html'
import beautify from 'js-beautify'

// Injected once — styles TinyMCE toolbar to match Sanity Studio
const TOOLBAR_CSS = `
  .tox-tinymce { border: none !important; box-shadow: none !important; border-radius: 0 !important; }
  .tox .tox-toolbar-overlord { background: #f6f6f8 !important; box-shadow: none !important; }
  .tox .tox-toolbar,
  .tox .tox-toolbar__primary,
  .tox .tox-toolbar__overflow { background: #f6f6f8 !important; border-bottom: 1px solid #dce1e7 !important; padding: 1px 2px !important; }
  .tox .tox-toolbar__group { padding: 0 5px !important; }
  .tox .tox-toolbar__group:not(:last-of-type) { border-right: none !important; position: relative !important; margin-right: 0 !important; padding-right: 5px !important; }
  .tox .tox-toolbar__group:not(:last-of-type)::after { content: '' !important; position: absolute !important; right: 0 !important; top: 22% !important; bottom: 22% !important; width: 1px !important; background: #dce1e7 !important; }
  .tox .tox-tbtn__select-label { max-width: 90px !important; }
  .tox:not(.tox-tinymce-inline) .tox-editor-header { box-shadow: none !important; }
  .tox .tox-tbtn { color: #54595f !important; border-radius: 3px !important; height: 26px !important; min-width: 29px !important; background: transparent !important; display: flex !important; align-items: center !important; justify-content: center !important; }
  .tox .tox-tbtn:not(.tox-tbtn--select):not(.tox-split-button__chevron) { width: 29px !important; }
  .tox .tox-tbtn:hover { background: #e9e9e9 !important; color: #101112 !important; }
  .tox .tox-tbtn--enabled,
  .tox .tox-tbtn--enabled:hover,
  .tox .tox-tbtn[aria-pressed="true"],
  .tox .tox-tbtn[aria-pressed="true"]:hover { background: #007e61 !important; color: #fff !important; }
  .tox .tox-tbtn svg { fill: none !important; stroke: currentColor !important; width: 15px !important; height: 15px !important; }
  .tox .tox-tbtn__select-chevron svg,
  .tox .tox-split-button__chevron svg { fill: currentColor !important; stroke: none !important; width: 10px !important; height: 10px !important; }
  .tox .tox-tbtn__select-chevron { display: flex !important; align-items: center !important; justify-content: center !important; }
  .tox .tox-split-button { border: 1px solid #dce1e7 !important; border-radius: 3px !important; background: transparent !important; gap: 0 !important; display: flex !important; align-items: center !important; }
  .tox .tox-split-button:hover { background: #e9e9e9 !important; }
  .tox .tox-split-button .tox-tbtn { background: transparent !important; border: none !important; min-width: unset !important; padding: 0 3px !important; }
  .tox .tox-split-button__chevron { border-left: none !important; padding: 0 2px !important; min-width: unset !important; width: 16px !important; display: flex !important; align-items: center !important; justify-content: center !important; }
  .tox .tox-tbtn--select { border: 1px solid #dce1e7 !important; background: #fff !important; border-radius: 3px !important; }
  .tox .tox-tbtn--bespoke { width: 100px !important; }
  .tox .tox-tbtn--select:hover { background: #e9e9e9 !important; }
  .tox .tox-tbtn__select-label { font-size: 12px !important; color: #101112 !important; }
  .tox .tox-statusbar { border-top: 1px solid #dce1e7 !important; background: #f6f6f8 !important; }
  .tox .tox-menu { background: #fff !important; }
  .tox .tox-collection__item-icon svg { fill: none !important; stroke: currentColor !important; stroke-width: 2px !important; stroke-linecap: round !important; stroke-linejoin: round !important; }
  .tox .tox-collection__item--active,
  .tox .tox-collection__item:hover { background: #e9e9e9 !important; color: #101112 !important; }
  .tox .tox-statusbar a,
  .tox .tox-statusbar__path-item,
  .tox .tox-statusbar__wordcount { color: #6b7280 !important; font-size: 11px !important; }
  /* Fullscreen: make the iframe fill the fixed container */
  .bw-tce-fs { display: flex; flex-direction: column; }
  .bw-tce-fs .tox-tinymce { flex: 1 !important; height: auto !important; min-height: 0 !important; }
  .bw-tce-fs .tox-sidebar-wrap { flex: 1 !important; min-height: 0 !important; }
  .bw-tce-fs .tox-edit-area { flex: 1 !important; min-height: 0 !important; }
  .bw-tce-fs .tox-edit-area__iframe { height: 100% !important; }
  .tox-editor-header {padding-top: 0 !important;  padding-bottom: 0 !important;}
  .tox .tox-edit-area::before { outline: none !important; border: none !important; border-color: transparent !important}
  .tox .tox-collection__item-label p,
  .tox .tox-collection__item-label h2,
  .tox .tox-collection__item-label h3,
  .tox .tox-collection__item-label h4 { font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; letter-spacing: inherit !important; color: inherit !important; }
  .tox .tox-pop.tox-pop--bottom::after { border-top-color: #f6f6f8 !important; }
  .tox.tox-tinymce-aux { z-index: 999999 !important; }
  body:has(.tox-tbtn[aria-expanded="true"]) .tox-tooltip { display: none !important; }
  .tox .tox-dialog .tox-form__group { margin-bottom: 14px !important; }
  .tox .tox-dialog__header .tox-button--icon:hover { background-color: #e9e9e9 !important; border-radius: 3px !important; }
  /* Pushes the fullscreen button's own group to the far right of the primary
     toolbar row, breaking it off visually from the rest. Targeted by the
     button itself (not :last-of-type) because the toolbar's own overflow
     "..." toggle is also its own trailing group — margin-left:auto on that
     one would push it away from the edge it's supposed to stay pinned to.
     Scoped to __primary only, so a folded-in copy inside the overflow
     dropdown isn't affected. When the toolbar is too narrow to fit
     everything, this group (being last in toolbar order) is naturally
     first in line to collapse into that overflow menu like any other. */
  .tox-toolbar__primary > .tox-toolbar__group:has([data-mce-name="customfullscreen"]) { margin-left: auto !important; }
  /* Sanity's document form wraps every field in a legibility-width container
     (~600px) — fine for short text fields, but it fights our 950px editor
     width. Widening the whole form (not just the editor) to the same 950px
     and centering it keeps the document heading/description sharing the
     same left edge as the editor below them, rather than the heading
     staying flush against the pane's true edge while the editor sits
     centered/inset within it. :has() scopes this to only forms that contain
     a TinyMCE instance, so other document types keep their normal width.
     NOTE: these are Sanity/@sanity-ui's own generated class names, tied to
     the installed version — if a Sanity upgrade changes them, this override
     will silently stop matching and need updating to the new class names. */
  .FormContainer-sc-yal29m-0:has(.tox-tinymce),
  [data-testid="form-view"]:has(.tox-tinymce) { max-width: 950px !important; margin-inline: auto !important; }
`

function SanityImageBrowser({ sanityClient, onSelect, onCancel }) {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [paneRect, setPaneRect] = useState(null)
  const uploadInputRef = useRef(null)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const result = await sanityClient.assets.upload('image', file, { filename: file.name })
      setAssets(prev => [{
        _id: result._id,
        url: result.url,
        originalFilename: result.originalFilename || file.name,
        metadata: result.metadata,
      }, ...prev])
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  useEffect(() => {
    const pane = document.querySelector('[data-testid="document-panel-scroller"]')
    if (pane) {
      setPaneRect(pane.getBoundingClientRect())
      const ro = new ResizeObserver(() => setPaneRect(pane.getBoundingClientRect()))
      ro.observe(pane)
      return () => ro.disconnect()
    }
  }, [])

  useEffect(() => {
    sanityClient.fetch(
      `*[_type == "sanity.imageAsset"] | order(_createdAt desc) [0..199] {
        _id, url, originalFilename,
        metadata { dimensions { width, height } }
      }`
    ).then(data => { setAssets(data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [sanityClient])

  const filtered = search
    ? assets.filter(a => a.originalFilename?.toLowerCase().includes(search.toLowerCase()))
    : assets

  const overlayStyle = paneRect
    ? { position: 'fixed', top: paneRect.top, left: paneRect.left, width: paneRect.width, height: paneRect.height }
    : { position: 'fixed', inset: 0 }

  return createPortal(
    <div
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
      style={{ ...overlayStyle, zIndex: 999999, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div style={{ background: '#fff', borderRadius: 8, width: '90%', maxWidth: 900, maxHeight: '85%', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #dce1e7', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Inter, system-ui, sans-serif' }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#101112', whiteSpace: 'nowrap' }}>Media Library</span>
          <input type="search" autoFocus placeholder="Search by filename…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '5px 10px', border: '1px solid #dce1e7', borderRadius: 4, fontSize: 13, outline: 'none' }} />
          <input ref={uploadInputRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
          <button type="button" onClick={() => uploadInputRef.current?.click()} disabled={uploading}
            style={{ padding: '5px 14px', borderRadius: 4, border: '1px solid #dce1e7', background: '#101112', color: '#fff', cursor: uploading ? 'default' : 'pointer', fontSize: 13, whiteSpace: 'nowrap', opacity: uploading ? 0.6 : 1 }}>
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
          <button type="button" onClick={onCancel}
            style={{ padding: '5px 14px', borderRadius: 4, border: '1px solid #dce1e7', background: 'transparent', cursor: 'pointer', fontSize: 13, color: '#54595f', whiteSpace: 'nowrap' }}>Cancel</button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#6b7280', fontSize: 14 }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#6b7280', fontSize: 14 }}>No images found</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
              {filtered.map(asset => (
                <button key={asset._id} type="button" onClick={() => onSelect(asset.url, asset.originalFilename || '')}
                  style={{ border: '2px solid transparent', borderRadius: 6, padding: 4, background: '#f6f7f8', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.1s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#101112' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent' }}>
                  <img src={`${asset.url}?w=300&h=200&fit=crop&auto=format`} alt={asset.originalFilename || ''}
                    style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block', borderRadius: 4 }} />
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {asset.originalFilename || asset._id}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

// js-beautify's default inline list minus 'a' and 'svg' so button anchors and SVGs nest onto their own lines
const BEAUTIFY_INLINE = [
  'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite',
  'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img',
  'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript',
  'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'select', 'small',
  'span', 'strong', 'sub', 'sup', 'template', 'textarea', 'time', 'u', 'var',
  'video', 'wbr', 'text', 'acronym', 'big', 'strike', 'tt',
]

const stripSvgWhitespace = (html) =>
  html.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, (svg) =>
    svg.replace(/>(?:\s|&nbsp;)+</g, '><'))

function formatHtmlWithCss(text) {
  return beautify.html(stripSvgWhitespace(text), {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: false,
    end_with_newline: false,
    indent_inner_html: true,
    inline: BEAUTIFY_INLINE,
  })
}

const BLOCK_RE = /(<\/(?:section|article|header|footer|nav|main|div|ul|ol|li|figure|figcaption|aside|details|summary|blockquote|pre|table|thead|tbody|tfoot|tr|td|th|caption|h[1-6]|p|form|fieldset)>)\s+(?=<)/gi
const stripBlockWhitespace = (html) => html.replace(BLOCK_RE, '$1')

const INLINE_TAGS = 'strong|em|b|i|u|s|del|ins|mark|code|cite|span|a'
function normalizeInlineBoundarySpaces(html) {
  // Move single boundary spaces outside inline tag boundaries so they survive in plain text nodes.
  html = html.replace(new RegExp(`(<(?:${INLINE_TAGS})\\b[^>]*>) `, 'gi'), ' $1')
  html = html.replace(new RegExp(` (<\\/(?:${INLINE_TAGS})>)`, 'gi'), '$1 ')
  // Convert any space immediately before an inline opening tag to &nbsp; so TinyMCE's
  // DOM parser preserves it (it strips trailing regular spaces from text nodes).
  html = html.replace(new RegExp(` (<(?:${INLINE_TAGS})\\b)`, 'gi'), ' $1')
  return html
}


const hangingIndent = ViewPlugin.fromClass(class {
  constructor(view) { this.decorations = this.compute(view) }
  update(update) {
    if (update.docChanged || update.viewportChanged || update.geometryChanged)
      this.decorations = this.compute(update.view)
  }
  compute(view) {
    const builder = new RangeSetBuilder()
    const cw = view.defaultCharacterWidth
    for (const { from, to } of view.visibleRanges) {
      let pos = from
      while (pos <= to) {
        const line = view.state.doc.lineAt(pos)
        let n = 0
        for (let i = 0; i < line.text.length; i++) {
          if (line.text[i] === ' ') n++
          else break
        }
        if (n > 0) {
          const px = n * cw
          builder.add(line.from, line.from, Decoration.line({
            attributes: { style: `padding-left:${px}px;text-indent:-${px}px` },
          }))
        }
        pos = line.to + 1
      }
    }
    return builder.finish()
  }
}, { decorations: v => v.decorations })

function SourceEditorModal({ html, onApply, onCancel }) {
  const [paneRect, setPaneRect] = useState(null)
  const cmContainerRef = useRef(null)
  const viewRef = useRef(null)

  useEffect(() => {
    const pane = document.querySelector('[data-testid="document-panel-scroller"]')
    if (!pane) return
    setPaneRect(pane.getBoundingClientRect())
    const ro = new ResizeObserver(() => setPaneRect(pane.getBoundingClientRect()))
    ro.observe(pane)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!cmContainerRef.current) return
    const view = new EditorView({
      state: EditorState.create({
        doc: formatHtmlWithCss(html),
        extensions: [
          basicSetup,
          htmlLang(),
          EditorView.lineWrapping,
          hangingIndent,
          EditorView.theme({
            '&': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '11.5px' },
            '.cm-scroller': { overflow: 'visible', lineHeight: '1.5' },
            '.cm-content': { padding: '14px 4px', caretColor: '#101112' },
            '.cm-gutters': { background: '#f6f6f8', border: 'none', borderRight: '1px solid #dce1e7', color: '#9ca3af', minWidth: '3rem' },
            '.cm-activeLineGutter': { background: '#efefef' },
            '.cm-activeLine': { background: 'rgba(0,0,0,0.02)' },
            '&.cm-focused': { outline: 'none' },
          }),
        ],
      }),
      parent: cmContainerRef.current,
    })
    viewRef.current = view
    return () => { view.destroy(); viewRef.current = null }
  }, [])

  const handleFormat = () => {
    const view = viewRef.current
    if (!view) return
    const formatted = formatHtmlWithCss(view.state.doc.toString())
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: formatted } })
  }

  const handleApply = () => {
    const content = viewRef.current?.state.doc.toString() ?? ''
    onApply(formatHtmlWithCss(content))
  }

  const overlayStyle = paneRect
    ? { position: 'fixed', top: paneRect.top, left: paneRect.left, width: paneRect.width, height: paneRect.height }
    : { position: 'fixed', inset: 0 }

  return createPortal(
    <div
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
      style={{ ...overlayStyle, zIndex: 999999, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div style={{ background: '#fff', borderRadius: 8, width: '92%', maxWidth: 960, maxHeight: '90%', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #dce1e7', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, system-ui, sans-serif' }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#101112', flex: 1 }}>Source HTML</span>
          <button type="button" onClick={handleFormat}
            style={{ padding: '4px 12px', borderRadius: 4, border: '1px solid #dce1e7', background: 'transparent', cursor: 'pointer', fontSize: 13, color: '#54595f', fontFamily: 'inherit' }}>Format</button>
          <button type="button" onClick={onCancel}
            style={{ padding: '4px 12px', borderRadius: 4, border: '1px solid #dce1e7', background: 'transparent', cursor: 'pointer', fontSize: 13, color: '#54595f', fontFamily: 'inherit' }}>Cancel</button>
          <button type="button" onClick={handleApply}
            style={{ padding: '4px 12px', borderRadius: 4, border: 'none', background: '#101112', color: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Apply</button>
        </div>
        <div ref={cmContainerRef} style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} />
      </div>
    </div>,
    document.body
  )
}

const FS_EXPAND_PATHS   = '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>'
const FS_MINIMIZE_PATHS = '<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/>'

export default function TinyMCEInput({ value, onChange, fill = false, fullscreenZIndex = 9000, onFullscreenChange = null }) {
  const sanityClient = useClient({ apiVersion: '2024-01-01' })
  const editorRef = useRef(null)
  const containerRef = useRef(null)
  const fullscreenBtnRef = useRef(null)
  const insertImageRef = useRef(null)
  const initialValueRef = useRef(value || '')
  const [showImageBrowser, setShowImageBrowser] = useState(false)
  const [showSourceEditor, setShowSourceEditor] = useState(false)
  const [sourceHtml, setSourceHtml] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [paneRect, setPaneRect] = useState(null)

  // Track pane rect when fullscreen
  useEffect(() => {
    if (!isFullscreen) { setPaneRect(null); return }
    const pane = containerRef.current?.closest('[data-testid="document-panel-scroller"]')
      ?? document.querySelector('[data-testid="document-panel-scroller"]')
    if (!pane) return
    const update = () => setPaneRect(pane.getBoundingClientRect())
    update()
    const ro = new ResizeObserver(update)
    ro.observe(pane)
    return () => ro.disconnect()
  }, [isFullscreen])

  // Escape key exits fullscreen
  useEffect(() => {
    if (!isFullscreen) return
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false)
        onFullscreenChange?.(false)
      }
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [isFullscreen])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    const svg = editor.editorContainer?.querySelector('[data-mce-name="customfullscreen"] svg')
    if (svg) svg.innerHTML = isFullscreen ? FS_MINIMIZE_PATHS : FS_EXPAND_PATHS
    const applyActive = () => {
      fullscreenBtnRef.current?.setActive(isFullscreen)
      const btn = editor.editorContainer?.querySelector('[data-mce-name="customfullscreen"]')
      if (btn) {
        btn.classList.toggle('tox-tbtn--enabled', isFullscreen)
        btn.setAttribute('aria-pressed', String(isFullscreen))
      }
    }
    applyActive()
    requestAnimationFrame(applyActive)
  }, [isFullscreen])

  // Modal-context Escape: collapse the parent modal's fullscreen without touching isFullscreen
  useEffect(() => {
    if (!onFullscreenChange) return
    const onEsc = (e) => {
      if (e.key === 'Escape' && delegatedFsRef.current) {
        delegatedFsRef.current = false
        fullscreenBtnRef.current?.setActive(false)
        const editor = editorRef.current
        if (editor) {
          const svg = editor.editorContainer?.querySelector('[data-mce-name="customfullscreen"] svg')
          if (svg) svg.innerHTML = FS_EXPAND_PATHS
        }
        onFullscreenChange(false)
      }
    }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [onFullscreenChange])

  const editorReadyRef = useRef(false)
  const fullscreenToggleFnRef = useRef(null)
  const delegatedFsRef = useRef(false)

  const handleEditorChange = useCallback((content) => {
    if (!editorReadyRef.current) return
    onChange(set(content))
  }, [onChange])

  const handleImageSelect = useCallback((url, filename) => {
    insertImageRef.current?.(url, filename)
    insertImageRef.current = null
    setShowImageBrowser(false)
  }, [])

  // Updated on every render so the TinyMCE onAction closure always sees the current values
  fullscreenToggleFnRef.current = () => {
    if (onFullscreenChange) {
      delegatedFsRef.current = !delegatedFsRef.current
      const next = delegatedFsRef.current
      fullscreenBtnRef.current?.setActive(next)
      const ed = editorRef.current
      const svgEl = ed?.editorContainer?.querySelector('[data-mce-name="customfullscreen"] svg')
      if (svgEl) svgEl.innerHTML = next ? FS_MINIMIZE_PATHS : FS_EXPAND_PATHS
      onFullscreenChange(next)
    } else {
      setIsFullscreen(f => !f)
    }
  }

  const containerStyle = {
    ...(fill ? { height: '100%' } : {}),
    ...(!isFullscreen ? { width: '100%' } : {}),
    ...(isFullscreen && paneRect && !onFullscreenChange ? {
      position: 'fixed',
      top: paneRect.top,
      left: paneRect.left,
      width: paneRect.width,
      height: paneRect.height,
      zIndex: fullscreenZIndex,
      background: '#fff',
    } : {}),
  }

  return (
    <>
      <style>{TOOLBAR_CSS}</style>
      <div ref={containerRef} className={isFullscreen || fill ? 'bw-tce-fs' : ''}
        style={{ border: `1px solid ${isFocused ? '#007e61' : '#dce1e7'}`, borderRadius: 3, overflow: 'hidden', ...containerStyle }}>
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          onInit={(_, editor) => { editorRef.current = editor; setTimeout(() => { editorReadyRef.current = true }, 0) }}
          initialValue={initialValueRef.current}
          init={{
            height: 600,
            menubar: false,
            directionality: 'ltr',
            license_key: 'gpl',
            branding: false,
            promotion: false,
            resize: !isFullscreen && !fill,
            inline_boundaries: false,
            table_caption: false,
            table_advtab: false,
            table_style_by_css: true,
            table_default_styles: { width: '100%' },
            table_toolbar: 'tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
            link_target_list: [
              { title: 'Current tab', value: '' },
              { title: 'New tab', value: '_blank' },
            ],
            link_assume_external_targets: 'https',
            formats: {
              underline: { inline: 'u', remove: 'all' },
            },
            plugins: ['lists', 'link', 'image', 'table', 'autolink'],
            toolbar: 'undo redo | blocks | bold italic underline customhighlight | customlists | customalign | customlink custombtn sanityimage customtable | custommoretools | customcode | customfullscreen',
            block_formats: 'Normal=p;Heading 2=h2;Heading 3=h3;Heading 4=h4',
            valid_elements: '*[*]',
            extended_valid_elements: [
              'svg[*],path[*],circle[*],rect[*],line[*],polyline[*],polygon[*],ellipse[*],g[*],defs[*],use[*],symbol[*]',
              'section[*],article[*],header[*],footer[*],nav[*],main[*],figure[*],figcaption[*],aside[*],details[*],summary[*]',
              'div[*],p[*],span[*],a[*],img[*],br[*],hr[*]',
              'h1[*],h2[*],h3[*],h4[*],h5[*],h6[*]',
              'ul[*],ol[*],li[*],dl[*],dt[*],dd[*]',
              'table[*],thead[*],tbody[*],tfoot[*],tr[*],td[*],th[*],caption[*],colgroup[*],col[*]',
              'form[*],input[*],button[*],select[*],option[*],optgroup[*],textarea[*],label[*],fieldset[*],legend[*]',
              'blockquote[*],pre[*],code[*],kbd[*],samp[*],var[*]',
              'em[*],strong[*],b[*],i[*],u[*],s[*],del[*],ins[*],mark[*],small[*],sub[*],sup[*]',
              'time[*],abbr[*],cite[*],q[*],dfn[*],address[*]',
              'iframe[*],video[*],audio[*],source[*],track[*],picture[*],canvas[*]',
            ].join(','),
            custom_elements: '~svg,~path,~circle,~rect,~line,~polyline,~polygon,~ellipse,~g,~defs,~use,section,article,header,footer,nav,main,figure,figcaption',
            valid_children: '+body[svg|section|article|header|footer|nav|main],+div[svg|section|article],+li[svg|span|a|button],+span[svg]',
            verify_html: false,
            cleanup: false,

            entity_encoding: 'raw',
            content_css: ['/editor.css'],
            content_style: `
              body { margin: 0 auto; padding: 16px 20px; direction: ltr; max-width: 900px; }
              p[data-empty] { line-height: 1; margin: 0; }
              table { outline: none !important; }
              body.mce-in-table table { outline: 2px solid #007e61 !important; }
              [data-row], [data-mce-row-resize] { display: none !important; }
              [data-column], [data-mce-col-resize] { opacity: 0 !important; }
              body.mce-in-table.mce-table-hovered [data-column],
              body.mce-in-table.mce-table-hovered [data-mce-col-resize] { background: rgba(0,126,97,0.7) !important; opacity: 1 !important; width: 2px !important; }
              .ephox-snooker-resizer-bar:last-child { display: none !important; }
              img { max-width: 100%; height: auto; border-radius: 1rem; }
              svg { display: inline-block; width: 1.25rem; height: 1.25rem; vertical-align: middle; }
              body:focus-visible { outline: none !important; }
              mark.highlight-green { background-color: #c6f56f; padding: 0 .05em; border-radius: 2px; }
              a:not(.btn) { color: #005b2f; text-decoration-line: underline; text-decoration-color: rgba(0,91,47,0.25); text-underline-offset: 4px; }
              h4 { font-size: 19px; }
              @media (min-width: 640px) { h4 { font-size: 25px; } }
              hr { background-color: #dce5d7; height: 1px; border: none; }
            `,
            setup: (editor) => {

              // Enter creates a brand-new block with no attributes of its own, so
              // alignment (a plain text-align style on the <p>) doesn't carry over
              // on its own — TinyMCE fires NewBlock for exactly this case.
              editor.on('NewBlock', (e) => {
                const prev = e.newBlock.previousElementSibling
                if (prev?.style?.textAlign) {
                  e.newBlock.style.textAlign = prev.style.textAlign
                }
              })

              const normalizeUrl = (url) => {
                const s = url.trim()
                if (!s) return s
                if (/^(https?:\/\/|mailto:|tel:|ftp:\/\/|\/|#|\.\.?\/)/i.test(s)) return s
                return `https://${s}`
              }

              // Shared by the link and button dialogs — lets an editor type a bare
              // phone number or email address instead of remembering to prepend
              // "tel:"/"mailto:" themselves.
              const linkTypeItems = [
                { value: 'normal', text: 'Normal' },
                { value: 'tel', text: 'Phone number' },
                { value: 'mailto', text: 'Email address' },
              ]
              const detectLinkType = (href) => {
                const lower = (href || '').toLowerCase()
                if (lower.startsWith('tel:')) return 'tel'
                if (lower.startsWith('mailto:')) return 'mailto'
                return 'normal'
              }
              const stripTypePrefix = (value, type) =>
                type === 'normal' ? value : value.replace(new RegExp(`^${type}:`, 'i'), '')
              const buildHref = (type, rawValue) => {
                const value = rawValue.trim()
                if (type === 'tel') return `tel:${stripTypePrefix(value, 'tel').replace(/\s+/g, '')}`
                if (type === 'mailto') return `mailto:${stripTypePrefix(value, 'mailto')}`
                return normalizeUrl(value)
              }

              const updateEmptyParas = () => {
                const body = editor.getBody()
                if (!body) return
                body.querySelectorAll('p').forEach(p => {
                  const empty = p.childNodes.length === 1 && p.firstChild?.nodeName === 'BR'
                  empty ? p.setAttribute('data-empty', '') : p.removeAttribute('data-empty')
                })
              }
              editor.on('SetContent NodeChange input', updateEmptyParas)

              editor.on('click', (e) => {
                const body = editor.getBody()
                const inTable = !!editor.dom.getParent(e.target, 'table')
                body.classList.toggle('mce-in-table', inTable)
              })
              const isResizerEl = (el) => !!(el && (
                el.hasAttribute?.('data-column') ||
                el.hasAttribute?.('data-mce-col-resize') ||
                el.classList?.contains('ephox-snooker-resizer-bar') ||
                el.closest?.('.ephox-snooker-resizer-bar')
              ))
              let resizerActive = false
              const clearResizer = () => { resizerActive = false }
              editor.on('mousedown', (e) => { if (isResizerEl(e.target)) resizerActive = true })
              editor.on('mouseup', clearResizer)
              document.addEventListener('mouseup', clearResizer)
              editor.on('remove', () => document.removeEventListener('mouseup', clearResizer))
              editor.on('mouseover', (e) => {
                if (resizerActive || isResizerEl(e.target)) return
                const body = editor.getBody()
                const inTable = !!editor.dom.getParent(e.target, 'table')
                body.classList.toggle('mce-table-hovered', inTable)
              })
              editor.on('mouseout', (e) => {
                if (resizerActive) return
                const rt = e.relatedTarget
                if (isResizerEl(rt)) return
                const body = editor.getBody()
                const stillInTable = !!rt && !!editor.dom.getParent(rt, 'table')
                if (!stillInTable) body.classList.remove('mce-table-hovered')
              })
              editor.on('blur', () => {
                const body = editor.getBody()
                body.classList.remove('mce-in-table')
                body.classList.remove('mce-table-hovered')
              })

              editor.on('OpenWindow', () => {
                requestAnimationFrame(() => {
                  // Height/border width/cell padding only get hidden in the Table
                  // Properties dialog — matching on label text alone (without this
                  // title check) also strips Height from the Insert/Edit Image dialog,
                  // taking its width/height lock-ratio control down with it.
                  const dialogTitle = document.querySelector('.tox-dialog__title')?.textContent.trim().toLowerCase() ?? ''
                  const isTableDialog = dialogTitle === 'table properties' || dialogTitle === 'insert table'
                  document.querySelectorAll('.tox-dialog .tox-form__group').forEach(group => {
                    const label = group.querySelector('label')
                    if (!label) return
                    const text = label.textContent.trim().toLowerCase()
                    if (isTableDialog && (text === 'height' || text === 'border width' || text === 'cell padding')) group.style.display = 'none'
                    if (text === 'title') group.style.display = 'none'
                    if (text === 'text to display') label.textContent = 'Text'
                  })
                  const titleEl = document.querySelector('.tox-dialog__title')
                  if (titleEl) {
                    const t = titleEl.textContent.trim().toLowerCase()
                    if (t === 'insert link' || t === 'edit link' || t === 'insert/edit link') titleEl.textContent = 'Edit Link'
                  }
                })
              })

              editor.on('GetContent', (e) => {
                if (e.format !== 'text') {
                  const body = editor.getBody()
                  const doc = editor.getDoc()
                  if (body) {
                    let html = body.innerHTML
                    html = html.trim()
                    html = html.replace(/ data-empty=""/g, '')
                    // Convert &nbsp; placed at inline boundaries (by normalizeInlineBoundarySpaces) back to regular spaces.
                    html = html.replace(new RegExp(`(?:&nbsp;|\\u00A0)(<(?:${INLINE_TAGS})\\b)`, 'gi'), ' $1')
                    html = stripSvgWhitespace(html)
                    const tmpDoc = new DOMParser().parseFromString(html, 'text/html')
                    tmpDoc.querySelectorAll('svg').forEach(svg => {
                      const walker = tmpDoc.createTreeWalker(svg, NodeFilter.SHOW_TEXT)
                      const junk = []
                      let n
                      while ((n = walker.nextNode())) {
                        if (!n.nodeValue.trim()) junk.push(n)
                      }
                      junk.forEach(t => t.remove())
                    })
                    tmpDoc.querySelectorAll('span').forEach(el => {
                      const td = el.style.textDecoration
                      const tdl = el.style.textDecorationLine
                      if ((td && td.includes('underline')) || (tdl && tdl.includes('underline'))) {
                        const u = tmpDoc.createElement('u')
                        while (el.firstChild) u.appendChild(el.firstChild)
                        el.style.removeProperty('text-decoration')
                        el.style.removeProperty('text-decoration-line')
                        el.style.removeProperty('text-decoration-color')
                        el.style.removeProperty('text-decoration-thickness')
                        el.style.removeProperty('text-underline-offset')
                        const remaining = el.getAttribute('style')?.trim()
                        if (remaining) u.setAttribute('style', remaining)
                        el.parentNode.replaceChild(u, el)
                      }
                    })
                    // Strip naked spans (no class, no style) — TinyMCE artifacts
                    // Skip spans inside <a> or <button> where they carry layout meaning
                    tmpDoc.querySelectorAll('span').forEach(el => {
                      if (!el.hasAttribute('class') && !el.hasAttribute('style') && !el.closest('a, button')) {
                        const parent = el.parentNode
                        while (el.firstChild) parent.insertBefore(el.firstChild, el)
                        parent.removeChild(el)
                      }
                    })
                    html = tmpDoc.body.innerHTML
                    if (doc) {
                      const styles = [...doc.querySelectorAll('style[data-user]')]
                        .map(s => `<style>\n${s.textContent.replace(/^\n+/, '').replace(/\n+$/, '')}\n</style>`)
                        .join('\n')
                      if (styles) html = styles + '\n' + html
                    }
                    e.content = html
                  }
                }
              })

              editor.on('BeforeSetContent', (e) => {
                const doc = editor.getDoc()
                if (!doc) return
                if (/<style[^>]*>/i.test(e.content)) {
                  // Incoming content has style blocks — replace user styles with them
                  doc.querySelectorAll('style[data-user]').forEach(s => s.remove())
                  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi
                  let m
                  while ((m = re.exec(e.content)) !== null) {
                    const el = doc.createElement('style')
                    el.setAttribute('data-user', '')
                    el.textContent = m[1]
                    doc.head.appendChild(el)
                  }
                  e.content = normalizeInlineBoundarySpaces(stripBlockWhitespace(e.content.replace(/<style[^>]*>[\s\S]*?<\/style>\s*/gi, '')))
                } else {
                  // No style blocks in incoming content (e.g. undo snapshot, internal TinyMCE ops)
                  // Leave existing style[data-user] elements alone so they survive
                  e.content = normalizeInlineBoundarySpaces(stripBlockWhitespace(e.content))
                }
              })

              const lu = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`
              editor.ui.registry.addIcon('undo',           lu('<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>'))
              editor.ui.registry.addIcon('redo',           lu('<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>'))
              editor.ui.registry.addIcon('bold',           lu('<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>'))
              editor.ui.registry.addIcon('italic',         lu('<line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/>'))
              editor.ui.registry.addIcon('underline',      lu('<path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/>'))
              editor.ui.registry.addIcon('square-round-corner', lu('<path d="M21 11a8 8 0 0 0-8-8"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>'))
              editor.ui.registry.addIcon('highlight',      lu('<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>'))
              editor.ui.registry.addIcon('unordered-list', lu('<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>'))
              editor.ui.registry.addIcon('ordered-list',   lu('<line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>'))
              editor.ui.registry.addIcon('link',           lu('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'))
              editor.ui.registry.addIcon('image',          lu('<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>'))
              editor.ui.registry.addIcon('table',          lu('<path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>'))
              editor.ui.registry.addIcon('sourcecode',     lu('<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>'))
              editor.ui.registry.addIcon('fullscreen',     lu('<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="15" y1="3" y2="9"/><line x1="3" x2="9" y1="21" y2="15"/>'))
              editor.ui.registry.addIcon('align-left',     lu('<line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/>'))
              editor.ui.registry.addIcon('align-center',   lu('<line x1="21" y1="6" x2="3" y2="6"/><line x1="17" y1="12" x2="7" y2="12"/><line x1="19" y1="18" x2="5" y2="18"/>'))
              editor.ui.registry.addIcon('align-right',    lu('<line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/>'))
              editor.ui.registry.addIcon('align-justify',  lu('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>'))
              editor.ui.registry.addIcon('unlink',         lu('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/><line x1="8" y1="2" x2="8" y2="5"/><line x1="2" y1="8" x2="5" y2="8"/><line x1="16" y1="19" x2="16" y2="22"/><line x1="19" y1="16" x2="22" y2="16"/>'))
              editor.ui.registry.addIcon('custom-btn',     lu('<rect x="1" y="7" width="22" height="10" rx="5"/><line x1="7" y1="12" x2="17" y2="12"/>'))
              editor.ui.registry.addIcon('new-tab',         lu('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>'))

              editor.ui.registry.addSplitButton('customalign', {
                icon: 'align-left',
                tooltip: 'Align left',
                onAction: () => editor.execCommand('JustifyLeft'),
                fetch: (callback) => callback([
                  { type: 'choiceitem', icon: 'align-center', text: 'Center', value: 'center' },
                  { type: 'choiceitem', icon: 'align-right',  text: 'Right',  value: 'right' },
                ]),
                onItemAction: (_api, value) => {
                  // Images always sit inside a wrapping <p>, and TinyMCE's built-in
                  // 'aligncenter' format is shared between that <p> and the image
                  // itself — depending on which one the format actually lands on,
                  // centering can silently no-op. Setting margin-inline directly on
                  // the image bypasses that ambiguity entirely.
                  const node = editor.selection.getNode()
                  if (node.nodeName === 'IMG' && value === 'center') {
                    node.style.marginInline = 'auto'
                    node.style.float = 'none'
                    editor.undoManager.add()
                    editor.fire('change')
                    return
                  }
                  const cmd = { center: 'JustifyCenter', right: 'JustifyRight' }
                  editor.execCommand(cmd[value])
                },
              })

              // Table context toolbar icons
              const tbl = '<rect x="3" y="9" width="18" height="12" rx="1"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="10" y1="9" x2="10" y2="21"/>'
              editor.ui.registry.addToggleButton('customtable', {
                icon: 'table',
                tooltip: 'Insert table',
                onAction: () => editor.execCommand('mceInsertTable', false, { rows: 3, columns: 3 }),
                onSetup: (api) => {
                  const onNodeChange = () => {
                    const node = editor.selection.getNode()
                    api.setActive(!!node.closest('table'))
                  }
                  editor.on('NodeChange', onNodeChange)
                  return () => editor.off('NodeChange', onNodeChange)
                },
              })

              editor.ui.registry.addIcon('table-insert-row-above',   lu(`${tbl}<path d="M12 6V2"/><path d="M10 4l2-2 2 2"/>`))
              editor.ui.registry.addIcon('table-insert-row-after',   lu(`<rect x="3" y="3" width="18" height="12" rx="1"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="10" y1="3" x2="10" y2="15"/><path d="M12 18v4"/><path d="M10 20l2 2 2-2"/>`))
              editor.ui.registry.addIcon('table-delete-row',          lu(`${tbl}<line x1="9" y1="18" x2="15" y2="18"/>`))
              editor.ui.registry.addIcon('table-insert-column-before',lu(`<rect x="9" y="3" width="12" height="18" rx="1"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="9" y1="10" x2="21" y2="10"/><path d="M6 12H2"/><path d="M4 10l-2 2 2 2"/>`))
              editor.ui.registry.addIcon('table-insert-column-after', lu(`<rect x="3" y="3" width="12" height="18" rx="1"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="10" x2="15" y2="10"/><path d="M18 12h4"/><path d="M20 10l2 2-2 2"/>`))
              editor.ui.registry.addIcon('table-delete-column',       lu(`<rect x="3" y="9" width="12" height="12" rx="1"/><line x1="3" y1="15" x2="15" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/><line x1="17" y1="7" x2="23" y2="13"/><line x1="23" y1="7" x2="17" y2="13"/>`))
              editor.ui.registry.addIcon('table-delete-table',       lu('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>'))
              editor.ui.registry.addIcon('table-merge-cells',        lu('<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="18" height="8" rx="1"/><path d="m10 7 2 2 2-2"/><path d="M12 5v4"/>'))
              editor.ui.registry.addIcon('table-split-cells',        lu('<rect x="3" y="3" width="18" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/><path d="M12 13v-4"/><path d="m10 11 2-2 2 2"/>'))
              editor.ui.registry.addIcon('table-row-properties',     lu('<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>'))
              editor.ui.registry.addIcon('table-cell-properties',    lu('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/><circle cx="6" cy="15" r="1.5"/>'))
              editor.ui.registry.addIcon('table-caption',            lu('<path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/><path d="M21 18h-4"/><path d="M19 16v4"/>'))
              editor.ui.registry.addIcon('table-top-header',         lu('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M12 3v6"/><rect x="3" y="3" width="18" height="6" rx="2"/>'))
              editor.ui.registry.addIcon('table-left-header',        lu('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M3 12h6"/>'))
              editor.ui.registry.addIcon('table-classes',            lu('<path d="m15 5-8.373 8.373a1 1 0 0 0 0 1.414l2.586 2.586a1 1 0 0 0 1.414 0L19 9"/><path d="m5 15-1.5 5 5-1.5"/>'))
              editor.ui.registry.addIcon('table-cell-classes',       lu('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/><path d="m10 13 2 2 4-4"/>'))

              editor.ui.registry.addIcon('hr', lu('<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="7" x2="10" y2="7"/><line x1="3" y1="17" x2="10" y2="17"/>'))
              editor.ui.registry.addButton('customhr', {
                icon: 'hr',
                tooltip: 'Insert horizontal rule',
                onAction: () => editor.execCommand('InsertHorizontalRule'),
              })

              editor.ui.registry.addIcon('more-drawer', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><circle cx="5" cy="12" r="1.75" style="fill:currentColor"/><circle cx="12" cy="12" r="1.75" style="fill:currentColor"/><circle cx="19" cy="12" r="1.75" style="fill:currentColor"/></svg>`)
              editor.ui.registry.addIcon('break-out',    lu('<rect x="3" y="3" width="18" height="9" rx="1"/><line x1="3" y1="17" x2="21" y2="17"/><line x1="12" y1="21" x2="12" y2="17"/><path d="M9 20l3 3 3-3"/>'))
              editor.ui.registry.addIcon('break-before', lu('<rect x="3" y="12" width="18" height="9" rx="1"/><line x1="3" y1="7" x2="21" y2="7"/><line x1="12" y1="3" x2="12" y2="7"/><path d="M9 4l3-3 3 3"/>'))

              const paraBeforeAction = () => {
                const body = editor.getBody()
                const doc = editor.getDoc()
                if (!body || !doc) return
                const node = editor.selection.getNode()
                let topLevel = node
                while (topLevel && topLevel.parentNode !== body) topLevel = topLevel.parentNode
                const p = doc.createElement('p')
                p.innerHTML = '<br>'
                body.insertBefore(p, topLevel || body.firstChild)
                editor.selection.setCursorLocation(p, 0)
                editor.focus()
                editor.undoManager.add()
              }

              const paraAfterAction = () => {
                const body = editor.getBody()
                const doc = editor.getDoc()
                if (!body || !doc) return
                const node = editor.selection.getNode()
                let topLevel = node
                while (topLevel && topLevel.parentNode !== body) topLevel = topLevel.parentNode
                const p = doc.createElement('p')
                p.innerHTML = '<br>'
                const anchor = topLevel && topLevel.parentNode === body ? topLevel : null
                const ref = anchor?.nextSibling || null
                if (ref) {
                  body.insertBefore(p, ref)
                } else {
                  const trailing = body.querySelector('p[data-trailing]')
                  if (trailing) body.removeChild(trailing)
                  body.appendChild(p)
                  const sentinel = doc.createElement('p')
                  sentinel.setAttribute('data-trailing', '1')
                  sentinel.innerHTML = '<br>'
                  body.appendChild(sentinel)
                }
                editor.selection.setCursorLocation(p, 0)
                editor.focus()
                editor.undoManager.add()
              }

              editor.ui.registry.addButton('custombefore', { icon: 'break-before', tooltip: 'New paragraph before block', onAction: paraBeforeAction })
              editor.ui.registry.addButton('custombreak',  { icon: 'break-out',    tooltip: 'New paragraph after block',  onAction: paraAfterAction  })

              editor.ui.registry.addGroupToolbarButton('custommoretools', {
                icon: 'more-drawer',
                tooltip: 'More tools',
                items: 'customhr custombefore custombreak',
              })

              editor.ui.registry.addSplitButton('customlists', {
                icon: 'unordered-list',
                tooltip: 'Bulleted list',
                onAction: () => editor.execCommand('InsertUnorderedList'),
                onSetup: (api) => {
                  const onNodeChange = () => api.setActive(!!editor.selection.getNode().closest('ul'))
                  editor.on('NodeChange', onNodeChange)
                  return () => editor.off('NodeChange', onNodeChange)
                },
                fetch: (callback) => callback([
                  { type: 'choiceitem', icon: 'ordered-list', text: 'Numbered list', value: 'ol' },
                ]),
                onItemAction: (_api, value) => {
                  if (value === 'ol') editor.execCommand('InsertOrderedList')
                },
              })

              editor.ui.registry.addButton('customcode', {
                icon: 'sourcecode',
                tooltip: 'Edit HTML source',
                onAction: () => {
                  setSourceHtml(editor.getContent())
                  setShowSourceEditor(true)
                },
              })
              editor.ui.registry.addButton('sanityimage', {
                icon: 'image',
                tooltip: 'Insert from Media Library',
                onAction: () => {
                  insertImageRef.current = (url, filename) => {
                    // A default width (rather than letting the image auto-fill the full
                    // content column) leaves room for alignment to do something visible —
                    // a full-width image has no free space for centering/floating to use.
                    editor.insertContent(`<img src="${url}" alt="${filename}" style="width:600px;max-width:100%;height:auto;display:block;" />`)
                  }
                  setShowImageBrowser(true)
                },
              })
              // A stock mceLink dialog can't offer the phone/email dropdown below,
              // so this fully replaces it. Existing links are edited via the stored
              // node reference directly (immune to any selection changes while the
              // dialog is open); a bookmark is used only for the "wrap the current
              // selection in a new link" path, where the original range itself is
              // what needs restoring before formatter.apply can act on it.
              const openLinkDialog = () => {
                const existingLink = editor.dom.getParent(editor.selection.getNode(), 'a')
                const currentHref = existingLink?.getAttribute('href') ?? ''
                const currentType = detectLinkType(currentHref)
                const displayUrl = stripTypePrefix(currentHref, currentType)
                const hasSelection = !editor.selection.isCollapsed()
                const needsTextField = !existingLink && !hasSelection
                const bookmark = editor.selection.getBookmark(2, true)

                editor.windowManager.open({
                  title: existingLink ? 'Edit Link' : 'Insert Link',
                  body: {
                    type: 'panel',
                    items: [
                      { type: 'selectbox', name: 'type', label: 'Link type', items: linkTypeItems },
                      { type: 'input', name: 'url', label: 'URL' },
                      ...(needsTextField ? [{ type: 'input', name: 'text', label: 'Text to display' }] : []),
                      { type: 'selectbox', name: 'target', label: 'Open in', items: [
                        { value: '', text: 'Current tab' },
                        { value: '_blank', text: 'New tab' },
                      ]},
                    ],
                  },
                  buttons: [
                    { type: 'cancel', text: 'Cancel' },
                    { type: 'submit', text: existingLink ? 'Update' : 'Insert', primary: true },
                  ],
                  initialData: {
                    type: currentType,
                    url: displayUrl,
                    text: '',
                    target: existingLink ? (existingLink.getAttribute('target') ?? '') : '_blank',
                  },
                  onSubmit: (api) => {
                    const data = api.getData()
                    const href = buildHref(data.type, data.url)
                    if (existingLink) {
                      // dom.setAttrib (not the raw DOM setAttribute) — TinyMCE caches the
                      // original href in a shadow data-mce-href attribute and prefers that
                      // over the live href when serializing, so a plain setAttribute here
                      // gets silently overridden by the stale cached value on save.
                      editor.dom.setAttrib(existingLink, 'href', href)
                      if (data.target) {
                        editor.dom.setAttrib(existingLink, 'target', data.target)
                        editor.dom.setAttrib(existingLink, 'rel', 'noopener noreferrer')
                      } else {
                        editor.dom.setAttrib(existingLink, 'target', null)
                        editor.dom.setAttrib(existingLink, 'rel', null)
                      }
                    } else if (needsTextField) {
                      const targetAttr = data.target ? ` target="${data.target}" rel="noopener noreferrer"` : ''
                      editor.insertContent(`<a href="${href}"${targetAttr}>${data.text || data.url}</a>`)
                    } else {
                      editor.selection.moveToBookmark(bookmark)
                      editor.formatter.apply('link', { href, target: data.target || '', rel: data.target ? 'noopener noreferrer' : '' })
                    }
                    editor.undoManager.add()
                    api.close()
                  },
                })
              }

              editor.ui.registry.addToggleButton('customlink', {
                icon: 'link',
                tooltip: 'Edit Link',
                onAction: openLinkDialog,
                onSetup: (api) => {
                  const update = () => {
                    const inLink = !!editor.dom.getParent(editor.selection.getNode(), 'a')
                    api.setActive(inLink)
                    api.setEnabled(editor.selection.isEditable())
                  }
                  update()
                  editor.on('NodeChange', update)
                  return () => editor.off('NodeChange', update)
                },
              })

              editor.ui.registry.addButton('custombtn', {
                icon: 'custom-btn',
                tooltip: 'Insert button',
                onAction: () => {
                  const node = editor.selection.getNode()
                  const existingBtn = editor.dom.getParent(node, 'a.btn')
                  const currentHref = existingBtn?.getAttribute('href') ?? ''
                  const currentType = detectLinkType(currentHref)
                  const displayUrl = stripTypePrefix(currentHref, currentType)
                  editor.windowManager.open({
                    title: existingBtn ? 'Edit Button' : 'Insert Button',
                    body: {
                      type: 'panel',
                      items: [
                        { type: 'input', name: 'text', label: 'Button text' },
                        { type: 'selectbox', name: 'type', label: 'Link type', items: linkTypeItems },
                        { type: 'input', name: 'url',  label: 'URL' },
                        { type: 'selectbox', name: 'target', label: 'Open in', items: [
                          { value: '',       text: 'Same window' },
                          { value: '_blank', text: 'New tab' },
                        ]},
                      ],
                    },
                    buttons: [
                      { type: 'cancel', text: 'Cancel' },
                      { type: 'submit', text: existingBtn ? 'Update' : 'Insert', primary: true },
                    ],
                    initialData: existingBtn ? {
                      text:   existingBtn.querySelector('span')?.textContent ?? existingBtn.textContent ?? '',
                      type:   currentType,
                      url:    displayUrl,
                      target: existingBtn.getAttribute('target') ?? '',
                    } : { text: '', type: 'normal', url: '', target: '_blank' },
                    onSubmit: (api) => {
                      const { text, type, url, target } = api.getData()
                      const targetAttr = target ? ` target="${target}" rel="noopener noreferrer"` : ''
                      const html = `<a href="${buildHref(type, url)}" class="btn btn-md btn-header-bushwood hover:btn-white-dark"${targetAttr}><span>${text}</span></a>`
                      if (existingBtn) {
                        editor.dom.setOuterHTML(existingBtn, html)
                      } else {
                        editor.insertContent(html)
                      }
                      api.close()
                    },
                  })
                },
              })

              editor.ui.registry.addToggleButton('customfullscreen', {
                icon: 'fullscreen',
                tooltip: 'Toggle fullscreen',
                onSetup: (api) => { fullscreenBtnRef.current = api; return () => {} },
                onAction: () => fullscreenToggleFnRef.current?.(),
              })

              editor.ui.registry.addMenuItem('customeditlink', {
                icon: 'link',
                text: 'Edit Link',
                shortcut: 'Meta+K',
                onAction: openLinkDialog,
                onSetup: (api) => {
                  const update = () => api.setEnabled(editor.selection.isEditable())
                  update()
                  editor.on('NodeChange', update)
                  return () => editor.off('NodeChange', update)
                },
              })

              editor.ui.registry.addToggleButton('customhighlight', {
                icon: 'highlight',
                tooltip: 'Highlight',
                onAction: () => editor.formatter.toggle('greenHighlight'),
                onSetup: (api) => {
                  const update = () => api.setActive(editor.formatter.match('greenHighlight'))
                  update()
                  editor.on('NodeChange', update)
                  return () => editor.off('NodeChange', update)
                },
              })

              // Rounded-corners toggle for the image right-click menu, with two
              // explicit states — 12px or none — so it never depends on falling back
              // to the default 1rem CSS rounding. (Alignment isn't duplicated here:
              // the toolbar's Align dropdown already centers a selected image
              // correctly on its own — 'alignleft'/'aligncenter' are shared formats
              // between block text and images, so a toggle item tracking them here
              // could show more than one as active at once.)
              editor.ui.registry.addToggleMenuItem('imagerounded', {
                icon: 'square-round-corner',
                text: 'Rounded corners',
                onAction: () => {
                  const img = editor.selection.getNode()
                  if (img.nodeName !== 'IMG') return
                  img.style.borderRadius = img.style.borderRadius === '12px' ? '0px' : '12px'
                  editor.undoManager.add()
                  editor.fire('change')
                },
                onSetup: (api) => {
                  const update = () => {
                    const img = editor.selection.getNode()
                    api.setActive(img.nodeName === 'IMG' && img.style.borderRadius === '12px')
                  }
                  update()
                  editor.on('NodeChange', update)
                  return () => editor.off('NodeChange', update)
                },
              })

              // setup() runs before initPlugins(), so the link plugin would overwrite any
              // addContextMenu('link') call made here. Defer until after plugins have loaded.
              // editor.formatter also isn't populated yet during setup() — registering a
              // format here throws "Cannot read properties of undefined (reading 'register')".
              editor.on('init', () => {
                editor.ui.registry.addContextMenu('link', {
                  update: (element) => {
                    const isInLink = editor.dom.getParents(element, 'a').length > 0
                    return isInLink ? 'customeditlink unlink openlink' : ''
                  },
                })

                // Relabels the image plugin's own "Image…" item — still the way to set
                // an explicit width/height with the lock-ratio control (inserts go
                // through the Media Library browser, but resizing still uses this
                // dialog) — reusing its existing onAction/icon so the dialog it opens
                // is untouched.
                const defaultImageMenuItem = editor.ui.registry.getAll().menuItems.image
                if (defaultImageMenuItem) {
                  editor.ui.registry.addMenuItem('image', { ...defaultImageMenuItem, text: 'Image options' })
                }

                editor.ui.registry.addContextMenu('image', {
                  update: (element) => (element.nodeName === 'IMG' ? 'image | imagerounded' : ''),
                })

                editor.formatter.register('greenHighlight', { inline: 'mark', classes: 'highlight-green' })
              })
            },
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onEditorChange={handleEditorChange}
        />
        {showImageBrowser && (
          <SanityImageBrowser
            sanityClient={sanityClient}
            onSelect={handleImageSelect}
            onCancel={() => setShowImageBrowser(false)}
          />
        )}
        {showSourceEditor && (
          <SourceEditorModal
            html={sourceHtml}
            onApply={(html) => {
              const editor = editorRef.current
              if (editor) {
                editor.setContent(normalizeInlineBoundarySpaces(stripBlockWhitespace(html.replace(/<style[^>]*>[\s\S]*?<\/style>\s*/gi, ''))), { format: 'raw', no_events: true })
                editor.undoManager?.add()
                const doc = editor.getDoc()
                if (doc) {
                  doc.querySelectorAll('style[data-user]').forEach(s => s.remove())
                  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi
                  let m
                  while ((m = re.exec(html)) !== null) {
                    const el = doc.createElement('style')
                    el.setAttribute('data-user', '')
                    el.textContent = m[1]
                    doc.head.appendChild(el)
                  }
                }
              }
              onChange(set(html))
              setShowSourceEditor(false)
            }}
            onCancel={() => setShowSourceEditor(false)}
          />
        )}
      </div>
    </>
  )
}
