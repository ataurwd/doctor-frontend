'use client';

import { useState } from 'react';
import SiteIcon from '@/components/SiteIcon';
import ResourceList from '@/components/admin/ResourceList';
import PDFViewerModal from '@/components/admin/PDFViewerModal';
import { RESOURCE_SCHEMAS } from '@/components/admin/adminSchemas';

export default function AdminHandoutsPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [pdfPreview, setPdfPreview] = useState(null); // { url, title }

  return (
    <>
      <ResourceList
        schema={RESOURCE_SCHEMAS.handouts}
        headerAction={
          <div className="flex items-center gap-1 rounded-xl bg-paper-alt p-1 border border-line shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-teal text-white shadow-2xs'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              <SiteIcon name="spark" className="size-3" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-teal text-white shadow-2xs'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              <SiteIcon name="menu" className="size-3" />
              <span>Table</span>
            </button>
          </div>
        }
        customRender={({ items, onEdit, onDelete }) => {
          if (items.length === 0) {
            return (
              <div className="rounded-3xl border border-dashed border-line bg-paper-alt/40 p-12 text-center text-xs text-ink-soft">
                No printable handouts found.
              </div>
            );
          }

          if (viewMode === 'table') {
            return (
              <div className="rounded-3xl border border-line/80 bg-white shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-line/60 bg-paper-alt/40 text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                        <th className="py-3.5 px-5">#</th>
                        <th className="py-3.5 px-5">Title (English / বাংলা)</th>
                        <th className="py-3.5 px-5">PDF File</th>
                        <th className="py-3.5 px-5">Linked Post</th>
                        <th className="py-3.5 px-5">Status</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/40">
                      {items.map((item, idx) => {
                        const enTitle = item.title?.en || 'Untitled Handout';
                        const bnTitle = item.title?.bn || '';
                        const filePath = item.file_path || '/handouts/gout-and-diet.pdf';

                        return (
                          <tr key={item._id} className="hover:bg-paper-alt/30 transition-colors">
                            <td className="py-3.5 px-5 font-mono text-[11px] text-ink-soft">
                              #{idx + 1}
                            </td>
                            <td className="py-3.5 px-5">
                              <p className="font-bold text-ink">{enTitle}</p>
                              {bnTitle && (
                                <p className="text-xs text-ink-soft font-bangla">{bnTitle}</p>
                              )}
                            </td>
                            <td className="py-3.5 px-5">
                              <span className="font-mono text-xs text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg inline-flex items-center gap-1.5 w-fit">
                                <span className="font-black text-[9px] bg-red-600 text-white px-1 py-0.5 rounded">PDF</span>
                                <span className="truncate max-w-[150px]">{filePath}</span>
                              </span>
                            </td>
                            <td className="py-3.5 px-5 font-mono text-xs text-teal">
                              /{item.post_slug || 'gout-and-diet'}
                            </td>
                            <td className="py-3.5 px-5">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                  item.is_published
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {item.is_published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setPdfPreview({ url: filePath, title: enTitle })}
                                  className="rounded-lg bg-teal px-2.5 py-1 text-[11px] font-bold text-white hover:bg-teal-deep transition-all cursor-pointer shadow-2xs"
                                >
                                  Preview PDF
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onEdit(item)}
                                  className="rounded-lg border border-line bg-paper-alt px-2.5 py-1 text-[11px] font-bold text-ink hover:text-teal transition-all cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDelete(item._id, enTitle)}
                                  className="text-red-500 hover:text-red-700 font-bold p-1 cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          // Grid View
          return (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, idx) => {
                const enTitle = item.title?.en || 'Untitled Handout';
                const bnTitle = item.title?.bn || '';
                const filePath = item.file_path || '/handouts/gout-and-diet.pdf';

                return (
                  <div
                    key={item._id}
                    className="group rounded-3xl border border-line/80 bg-white p-6 shadow-2xs hover:shadow-md hover:border-teal/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-line/50">
                        <span className="font-mono text-xs font-bold text-ink-soft bg-paper-alt px-2 py-0.5 rounded-md">
                          #{idx + 1}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            item.is_published
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {item.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      <h3 className="mt-4 font-bold text-ink text-base line-clamp-2 group-hover:text-teal transition-colors">
                        {enTitle}
                      </h3>
                      {bnTitle && (
                        <p className="mt-1 text-xs text-ink-soft font-bangla line-clamp-1">
                          {bnTitle}
                        </p>
                      )}

                      {/* PDF badge & Actions */}
                      <div className="mt-4 rounded-2xl border border-red-200/90 bg-red-50/60 p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white font-black text-xs shadow-xs">
                            PDF
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-ink line-clamp-1">Handout Document</p>
                            <p className="text-[10px] text-ink-soft font-mono truncate">{filePath}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPdfPreview({ url: filePath, title: enTitle })}
                            className="rounded-xl bg-white border border-line px-2.5 py-1.5 text-xs font-bold text-teal hover:bg-teal hover:text-white transition-all cursor-pointer shadow-2xs"
                          >
                            Preview
                          </button>
                          <a
                            href={filePath}
                            download
                            className="rounded-xl bg-white border border-line p-1.5 text-ink-soft hover:text-teal hover:border-teal transition-all shadow-2xs cursor-pointer"
                            title="Download PDF"
                          >
                            <SiteIcon name="download" className="size-4" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="rounded-lg bg-paper-alt px-3 py-1.5 text-xs font-bold text-teal hover:bg-teal hover:text-white transition-all cursor-pointer"
                      >
                        Edit (EN / বাংলা)
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item._id, enTitle)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }}
      />

      {/* PDF Modal */}
      {pdfPreview && (
        <PDFViewerModal
          url={pdfPreview.url}
          title={pdfPreview.title}
          onClose={() => setPdfPreview(null)}
        />
      )}
    </>
  );
}

