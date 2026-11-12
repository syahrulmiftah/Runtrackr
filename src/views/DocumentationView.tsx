import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { SettingsButton } from '../components/ui/SettingsButton';

export interface DocTopicItem {
  id: string;
  title: string;
}

export const DOC_TOPICS: DocTopicItem[] = [
  { id: 'strava', title: 'Import runs from Strava' },
  { id: 'score', title: 'How your score works' },
];

interface DocumentationViewProps {
  onBack: () => void;
  onSelectTopic: (topicId: string) => void;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({
  onBack,
  onSelectTopic,
}) => {
  return (
    <div className="w-full flex flex-col gap-6 max-w-md mx-auto pt-2 pb-12 font-roboto">
      {/* Top Header */}
      <div className="w-full flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#27272F] hover:bg-[#3C3C45] border border-[#303037] flex items-center justify-center text-white transition-all cursor-pointer active:scale-95"
          aria-label="Back to manage account"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-medium text-white font-roboto">
          Documentation
        </h1>
      </div>

      {/* Topics List */}
      <div className="w-full flex flex-col gap-2.5 mt-1">
        {DOC_TOPICS.map((topic) => (
          <SettingsButton
            key={topic.id}
            label={topic.title}
            onClick={() => onSelectTopic(topic.id)}
          />
        ))}
      </div>
    </div>
  );
};
