interface Topic {
  _id: string;
  title: {
    en: string;
    vi: string;
  };
}

interface TopicFiltersProps {
  topics: Topic[];
  selectedTopic: string | null;
  onTopicChange: (topicId: string | null) => void;
  showGeneral: boolean;
  locale: 'en' | 'vi';
}

export default function TopicFilters({ 
  topics, 
  selectedTopic, 
  onTopicChange,
  showGeneral,
  locale
}: TopicFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={() => onTopicChange(null)}
        className={`px-4 py-2 rounded-full border transition-colors ${
          !selectedTopic
            ? 'bg-black text-white border-black'
            : 'bg-transparent text-black border-black/20 hover:border-black'
        }`}
      >
        All
      </button>
      
      {topics.map(topic => (
        <button
          key={topic._id}
          onClick={() => onTopicChange(topic._id)}
          className={`px-4 py-2 rounded-full border transition-colors ${
            selectedTopic === topic._id
              ? 'bg-black text-white border-black'
              : 'bg-transparent text-black border-black/20 hover:border-black'
          }`}
        >
          {topic.title?.[locale] || topic.title?.en || 'Topic'}
        </button>
      ))}
      
      {showGeneral && (
        <button
          onClick={() => onTopicChange('general')}
          className={`px-4 py-2 rounded-full border transition-colors ${
            selectedTopic === 'general'
              ? 'bg-black text-white border-black'
              : 'bg-transparent text-black border-black/20 hover:border-black'
          }`}
        >
          General
        </button>
      )}
    </div>
  );
}
