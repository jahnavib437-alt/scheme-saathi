import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bookmark, Plus, Folder, ExternalLink, ArrowRight } from 'lucide-react';
import { useTrackerStore } from '../store/trackerStore';
import { useUIStore } from '../store/uiStore';
import { CategoryArtwork } from '../assets/categorySvgs';

export const BoardsPage = () => {
  const { t } = useTranslation();
  const { boards, savedSchemeIds } = useTrackerStore();
  const { addToast } = useUIStore();

  const [activeBoard, setActiveBoard] = useState('My Applications');
  const [newBoardName, setNewBoardName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const sampleBoards = Object.keys(boards).length > 0 ? boards : {
    'My Applications': ['pm-kisan-1', 'ayushman-bharat-1'],
    'Mom\'s Schemes': ['gruha-lakshmi-1', 'sandhya-suraksha-1'],
    'Education & Students': ['nsp-post-matric-1'],
  };

  const handleCreateBoard = (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    addToast({ title: `Created board: "${newBoardName}"`, type: 'success' });
    setNewBoardName('');
    setShowCreateModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-saathi-ink tracking-tight">
            Saved Scheme Boards
          </h1>
          <p className="text-sm text-saathi-muted mt-1">
            Organize welfare schemes into curated family collections and application boards.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-pill bg-saathi-primary text-white text-xs font-bold shadow-soft-sm hover:bg-saathi-primary-hover self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Board</span>
        </button>
      </div>

      {/* Boards Collages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(sampleBoards).map(([boardName, items]) => (
          <div
            key={boardName}
            onClick={() => setActiveBoard(boardName)}
            className="bg-saathi-card rounded-4xl border border-saathi-border p-4 shadow-soft-sm hover:shadow-soft-hover transition-all cursor-pointer group space-y-3"
          >
            {/* Stacked Card Collage Preview */}
            <div className="relative h-44 rounded-3xl overflow-hidden bg-saathi-bg border border-saathi-border/60 flex items-center justify-center">
              <CategoryArtwork category="farmers" className="absolute -top-4 -left-4 w-32 h-32 rounded-2xl opacity-80 shadow-md rotate-[-6deg]" />
              <CategoryArtwork category="women" className="absolute -bottom-4 -right-4 w-36 h-36 rounded-2xl opacity-80 shadow-md rotate-[8deg]" />
              <div className="relative z-10 px-4 py-2 rounded-2xl bg-white/90 dark:bg-saathi-card/90 backdrop-blur-md border border-saathi-border text-center shadow-soft-sm">
                <Folder className="w-6 h-6 text-saathi-primary mx-auto mb-1" />
                <span className="text-xs font-bold text-saathi-ink">{items.length} Schemes</span>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="font-display font-bold text-base text-saathi-ink group-hover:text-saathi-primary transition-colors">
                  {boardName}
                </h3>
                <p className="text-xs text-saathi-muted">
                  Saved collection • Updated recently
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-saathi-muted group-hover:text-saathi-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Create Board Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-saathi-ink/70 backdrop-blur-sm">
          <form
            onSubmit={handleCreateBoard}
            className="bg-saathi-card rounded-3xl border border-saathi-border p-6 max-w-sm w-full shadow-soft-lg space-y-4"
          >
            <h3 className="font-display font-bold text-lg text-saathi-ink">Create New Board</h3>
            <p className="text-xs text-saathi-muted">Name your collection (e.g. "Dad's Agriculture Subsidy", "College Fees").</p>
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Board title..."
              className="w-full p-3 rounded-2xl border border-saathi-border bg-saathi-bg text-xs font-bold text-saathi-ink focus:outline-none"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-pill text-xs font-semibold bg-saathi-bg text-saathi-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-pill text-xs font-bold bg-saathi-primary text-white shadow-soft-sm"
              >
                Create Board
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
